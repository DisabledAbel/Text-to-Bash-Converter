#!/usr/bin/env bash
set -euo pipefail

Server_Dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
Install_Dir="${CLASH_INSTALL_DIR:-$Server_Dir}"

Service_Name="clash-for-linux"
Service_User="root"
Service_Group="root"

# =========================
# 基础校验
# =========================
if [ "$(id -u)" -ne 0 ]; then
  echo "[ERROR] root required" >&2
  exit 1
fi

if [ ! -f "${Server_Dir}/.env" ]; then
  echo "[ERROR] .env not found in ${Server_Dir}" >&2
  exit 1
fi

# =========================
# 同步文件
# =========================
mkdir -p "$Install_Dir"

chmod +x "$Install_Dir"/clashctl 2>/dev/null || true
chmod +x "$Install_Dir"/scripts/* 2>/dev/null || true
chmod +x "$Install_Dir"/bin/* 2>/dev/null || true

# =========================
# 目录初始化
# =========================
mkdir -p \
  "$Install_Dir/runtime" \
  "$Install_Dir/logs" \
  "$Install_Dir/config/mixin.d"

# =========================
# 加载 env
# =========================
# shellcheck disable=SC1090
source "$Install_Dir/.env"

# shellcheck disable=SC1090
source "$Install_Dir/scripts/get_cpu_arch.sh"

# shellcheck disable=SC1090
source "$Install_Dir/scripts/resolve_clash.sh"

write_env_value() {
  local key="$1"
  local value="$2"
  local env_file="$Install_Dir/.env"
  local escaped="${value//\\/\\\\}"
  escaped="${escaped//&/\\&}"
  escaped="${escaped//|/\\|}"
  escaped="${escaped//\'/\'\\\'\'}"

  if grep -qE "^[[:space:]]*(export[[:space:]]+)?${key}=" "$env_file"; then
    sed -i -E "s|^[[:space:]]*(export[[:space:]]+)?${key}=.*$|export ${key}='${escaped}'|g" "$env_file"
  else
    printf "export %s='%s'\n" "$key" "$value" >> "$env_file"
  fi
}

read_env_value() {
  local key="$1"
  sed -nE "s/^[[:space:]]*(export[[:space:]]+)?${key}=['\"]?([^'\"]*)['\"]?$/\2/p" "$Install_Dir/.env" | head -n 1
}

get_public_ip() {
  curl -fsS --max-time 5 ifconfig.me 2>/dev/null \
    || curl -fsS --max-time 5 ip.sb 2>/dev/null \
    || curl -fsS --max-time 5 api.ipify.org 2>/dev/null \
    || true
}

show_dashboard_info() {
  local secret="$1"
  local public_ip="$2"
  local dashboard_port="9090"
  local ui_url=""

  if [ -n "${public_ip:-}" ]; then
    ui_url="http://${public_ip}:${dashboard_port}/ui/#/setup?hostname=${public_ip}&port=${dashboard_port}&secret=${secret}"
  else
    ui_url="http://127.0.0.1:${dashboard_port}/ui/#/setup?hostname=127.0.0.1&port=${dashboard_port}&secret=${secret}"
  fi

  echo
  echo "╔═══════════════════════════════════════════════╗"
  echo "║                😼 Web 控制台                  ║"
  echo "║═══════════════════════════════════════════════║"
  echo "║                                               ║"
  echo "║     🔓 注意放行端口：9090                     ║"
  if [ -n "${public_ip:-}" ]; then
    printf "║     🌏 公网：http://%-27s║\n" "${public_ip}:9090/ui"
  else
    printf "║     🏠 本地：http://%-27s║\n" "127.0.0.1:9090/ui"
  fi
  echo "║                                               ║"
  echo "╚═══════════════════════════════════════════════╝"
  echo
  echo "😼 当前密钥：${secret}"
  echo "🎯 面板地址：${ui_url}"
}

wait_dashboard_ready() {
  local host="$1"
  local port="${2:-9090}"
  local max_retry="${3:-20}"
  local i

  for ((i=1; i<=max_retry; i++)); do
    if curl -fsS --max-time 2 "http://${host}:${port}/ui/" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  return 1
}

prompt_and_apply_subscription() {
  local sub_url=""
  local secret=""
  local public_ip=""

  while true; do
    echo
    read -r -p "✈️  请输入要添加的订阅链接：" sub_url

    if [ -z "${sub_url:-}" ]; then
      echo "❌ 订阅链接不能为空"
      continue
    fi

    write_env_value "CLASH_URL" "$sub_url"

    echo "⏳ 正在下载订阅..."
    echo "🍃 验证订阅配置..."
    if ! "$Install_Dir/scripts/generate_config.sh" >/dev/null 2>&1; then
      echo "❌ 订阅不可用或转换失败，请检查链接后重试"
      continue
    fi
    
    echo "🎉 订阅已添加：[1] $sub_url"
    echo "🔥 订阅已生效"

    if command -v systemctl >/dev/null 2>&1; then
      systemctl restart "${Service_Name}.service"
    else
      "$Install_Dir/scripts/run_clash.sh" --daemon
    fi

    secret="$(read_env_value "CLASH_SECRET")"
    public_ip="$(get_public_ip)"

    show_dashboard_info "$secret" "$public_ip"
    return 0
  done
}

# =========================
# 内核检查
# =========================
if ! resolve_clash_bin "$Install_Dir" "${CpuArch:-}" >/dev/null 2>&1; then
  echo "[ERROR] clash core not ready" >&2
  exit 1
fi

# =========================
# 安装 clashctl
# =========================
ln -sf "$Install_Dir/clashctl" /usr/local/bin/clashctl
chmod +x "$Install_Dir/clashctl"

# =========================
# 安装 proxy helper
# =========================
cat >/etc/profile.d/clash-for-linux.sh <<EOF
# clash-for-linux proxy helpers

CLASH_INSTALL_DIR="${Install_Dir}"
ENV_FILE="\${CLASH_INSTALL_DIR}/.env"

if [ -f "\$ENV_FILE" ]; then
  set +u
  . "\$ENV_FILE" >/dev/null 2>&1 || true
  set -u
fi

CLASH_LISTEN_IP="\${CLASH_LISTEN_IP:-127.0.0.1}"
CLASH_HTTP_PORT="\${CLASH_HTTP_PORT:-7890}"
CLASH_SOCKS_PORT="\${CLASH_SOCKS_PORT:-7891}"

proxy_on() {
  export http_proxy="http://\${CLASH_LISTEN_IP}:\${CLASH_HTTP_PORT}"
  export https_proxy="http://\${CLASH_LISTEN_IP}:\${CLASH_HTTP_PORT}"
  export HTTP_PROXY="http://\${CLASH_LISTEN_IP}:\${CLASH_HTTP_PORT}"
  export HTTPS_PROXY="http://\${CLASH_LISTEN_IP}:\${CLASH_HTTP_PORT}"
  export all_proxy="socks5://\${CLASH_LISTEN_IP}:\${CLASH_SOCKS_PORT}"
  export ALL_PROXY="socks5://\${CLASH_LISTEN_IP}:\${CLASH_SOCKS_PORT}"
  export no_proxy="127.0.0.1,localhost,::1"
  export NO_PROXY="127.0.0.1,localhost,::1"
  echo "[OK] Proxy enabled: http://\${CLASH_LISTEN_IP}:\${CLASH_HTTP_PORT}"
}

proxy_off() {
  unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
  unset all_proxy ALL_PROXY no_proxy NO_PROXY
  echo "[OK] Proxy disabled"
}
EOF

chmod 644 /etc/profile.d/clash-for-linux.sh

# =========================
# 安装 systemd
# =========================
if command -v systemctl >/dev/null 2>&1; then
  CLASH_SERVICE_USER="$Service_User" CLASH_SERVICE_GROUP="$Service_Group" \
    "$Install_Dir/scripts/install_systemd.sh" "$Install_Dir"

  if [ "${CLASH_ENABLE_SERVICE:-true}" = "true" ]; then
    systemctl enable "${Service_Name}.service" || true
  fi
else
  echo "[WARN] systemd not found, will use script mode"
fi

# =========================
# 输出 + 订阅录入
# =========================
echo
echo "=== Install Complete ==="
echo "Install Dir : $Install_Dir"
echo "clashctl    : /usr/local/bin/clashctl"

prompt_and_apply_subscription

echo
echo "Commands:"
echo "  clashctl status"
echo "  clashctl logs"
echo "  clashctl restart"
echo "  clashctl stop"
echo "  clashctl ui"
echo "  clashctl secret"