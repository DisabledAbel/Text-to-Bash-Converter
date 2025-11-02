import requests
import json
import os
from datetime import datetime

SEARCH_QUERY = "bash language:bash"
RESULTS_FILE = "repos.json"
ISSUE_TITLE = "📦 Bash Repository Updates"
API_URL = "https://api.github.com"
REPO_NAME = os.getenv("GITHUB_REPOSITORY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GITHUB_TOKEN}" if GITHUB_TOKEN else None,
}

def search_repos():
    url = f"{API_URL}/search/repositories?q={SEARCH_QUERY}&sort=updated&order=desc&per_page=10"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["items"]

def load_old_data():
    if not os.path.exists(RESULTS_FILE):
        return []
    with open(RESULTS_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(RESULTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_issue_by_title():
    url = f"{API_URL}/repos/{REPO_NAME}/issues?state=all"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    for issue in resp.json():
        if issue["title"] == ISSUE_TITLE:
            return issue
    return None

def create_issue():
    url = f"{API_URL}/repos/{REPO_NAME}/issues"
    data = {"title": ISSUE_TITLE, "body": "Tracking new Bash repositories 🔍"}
    resp = requests.post(url, headers=HEADERS, json=data)
    resp.raise_for_status()
    issue = resp.json()
    print(f"✅ Created new issue #{issue['number']}")
    return issue

def reopen_issue(issue_number):
    url = f"{API_URL}/repos/{REPO_NAME}/issues/{issue_number}"
    resp = requests.patch(url, headers=HEADERS, json={"state": "open"})
    if resp.status_code == 200:
        print(f"♻️ Reopened issue #{issue_number}")
    else:
        print(f"⚠️ Failed to reopen issue: {resp.text}")

def comment_on_issue(issue_number, message):
    url = f"{API_URL}/repos/{REPO_NAME}/issues/{issue_number}/comments"
    resp = requests.post(url, headers=HEADERS, json={"body": message})
    if resp.status_code == 201:
        print("💬 Comment posted successfully.")
    else:
        print(f"⚠️ Failed to post comment: {resp.status_code} {resp.text}")

def close_issue(issue_number):
    url = f"{API_URL}/repos/{REPO_NAME}/issues/{issue_number}"
    resp = requests.patch(url, headers=HEADERS, json={"state": "closed"})
    if resp.status_code == 200:
        print(f"✅ Issue #{issue_number} closed successfully.")
    else:
        print(f"⚠️ Failed to close issue: {resp.text}")

def format_repo_list(repos):
    lines = []
    for repo in repos:
        lines.append(
            f"- **[{repo['full_name']}]({repo['html_url']})** — ⭐ {repo['stargazers_count']} stars\n"
            f"  🕒 Updated: {repo['updated_at'][:10]}"
        )
    return "\n".join(lines)

def main():
    if not GITHUB_TOKEN or not REPO_NAME:
        print("⚠️ Missing GitHub environment variables.")
        return

    print("🔍 Checking for new Bash repositories...")
    new_data = search_repos()
    old_data = load_old_data()
    old_urls = {repo["html_url"] for repo in old_data}

    new_repos = [repo for repo in new_data if repo["html_url"] not in old_urls]

    issue = get_issue_by_title()
    if not issue:
        issue = create_issue()
    elif issue["state"] == "closed":
        reopen_issue(issue["number"])

    if new_repos:
        repo_list = format_repo_list(new_repos)
        message = (
            f"### 🧾 New Bash Repositories Found ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})\n\n"
            f"{repo_list}\n\n"
            f"React with 👍 to close this update."
        )
        comment_on_issue(issue["number"], message)
        save_data(new_data)
    else:
        print("✅ No new repositories found.")

if __name__ == "__main__":
    main()
