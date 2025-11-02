import requests
import json
import os
from datetime import datetime

# ---------------------------
# Configuration
# ---------------------------
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

# ---------------------------
# Helper functions
# ---------------------------

def search_repos():
    """Search GitHub for Bash repos."""
    url = f"{API_URL}/search/repositories?q={SEARCH_QUERY}&sort=updated&order=desc&per_page=10"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["items"]

def load_old_data():
    """Load previous repo data."""
    if not os.path.exists(RESULTS_FILE):
        return []
    with open(RESULTS_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    """Save repo data locally."""
    with open(RESULTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_or_create_issue():
    """Get the issue ID or create it if it doesn’t exist."""
    url = f"{API_URL}/repos/{REPO_NAME}/issues"
    resp = requests.get(url, headers=HEADERS)
    resp.raise_for_status()
    issues = resp.json()

    for issue in issues:
        if issue["title"] == ISSUE_TITLE:
            print(f"🧾 Found existing issue #{issue['number']}")
            return issue["number"]

    # If not found, create new issue
    print("🆕 Creating new tracking issue...")
    new_issue = requests.post(url, headers=HEADERS, json={"title": ISSUE_TITLE})
    new_issue.raise_for_status()
    issue_number = new_issue.json()["number"]
    print(f"✅ Created issue #{issue_number}")
    return issue_number

def comment_on_issue(issue_number, message):
    """Post comment to the tracking issue."""
    url = f"{API_URL}/repos/{REPO_NAME}/issues/{issue_number}/comments"
    resp = requests.post(url, headers=HEADERS, json={"body": message})
    if resp.status_code == 201:
        print("💬 Comment posted successfully.")
    else:
        print(f"⚠️ Failed to post comment: {resp.status_code} {resp.text}")

def format_repo_list(repos):
    """Format the repository list into markdown."""
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
    issue_number = get_or_create_issue()

    if new_repos:
        print(f"🆕 Found {len(new_repos)} new Bash repositories.")
        repo_list = format_repo_list(new_repos)
        message = (
            f"### 🧾 New Bash Repositories Found ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})\n\n"
            f"{repo_list}"
        )
        comment_on_issue(issue_number, message)
        save_data(new_data)
    else:
        print("✅ No new repositories found.")

if __name__ == "__main__":
    main()
