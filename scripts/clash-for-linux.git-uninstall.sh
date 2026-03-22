#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="clash-for-linux"
UNIT_PATH="/etc/systemd/system/${SERVICE_NAME}.service"
INSTALL_DIR="${CLASH_INSTALL_DIR:-$(cd "$(dirname "$0")" && pwd)}"

CLASHCTL_LINK="/usr/local/bin/clashctl"
PROFILED_FILE="/etc/profile.d/clash-for-linux.sh"

PURGE=false

for arg in "$@"; do
  case "$arg" in
    --purge)
      PURGE=true
      ;;
    *)
      echo "[ERROR] 未知参数: $arg" >&2
      echo "用法: uninstall.sh [--purge]" >&2
      exit 2
      ;;
  esac
done

log()   { printf "%b\n" "$*"; }
ok()    { log "\033[32m[OK]\033[0m $*"; }
warn()  { log "\033[33m[WARN]\033[0m $*"; }
err()   { log "\033[31m[ERROR]\033[0m $*"; }

if [ "$(id -u)" -ne 0 ]; then
  err "卸载需要 root 权限"
  exit 1
fi

echo "[INFO] 正在卸载 clash-for-linux..."

# =========================
# 停止服务
# =========================
if command -v systemctl >/dev/null 2>&1; then
  systemctl stop "${SERVICE_NAME}.service" >/dev/null 2>&1 || true
  systemctl disable "${SERVICE_NAME}.service" >/dev/null 2>&1 || true
fi

# =========================
# 停止进程（仅当前项目）
# =========================
PID_FILE="${INSTALL_DIR}/runtime/clash.pid"

if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"

  if [ -n "${PID:-}" ] && kill -0 "$PID" 2>/dev/null; then
    echo "[INFO] 正在停止进程 pid=$PID"
    kill "$PID" 2>/dev/null || true
    sleep 1

    if kill -0 "$PID" 2>/dev/null; then
      echo "[WARN] 强制结束进程 -9 $PID"
      kill -9 "$PID" 2>/dev/null || true
    fi
  fi

  rm -f "$PID_FILE"
fi

# =========================
# 删除 systemd
# =========================
if [ -f "$UNIT_PATH" ]; then
  rm -f "$UNIT_PATH"
  ok "已移除 systemd 服务"
fi

if command -v systemctl >/dev/null 2>&1; then
  systemctl daemon-reload >/dev/null 2>&1 || true
  systemctl reset-failed >/dev/null 2>&1 || true
fi

# =========================
# 删除命令入口
# =========================
rm -f "$CLASHCTL_LINK" >/dev/null 2>&1 || true
rm -f "$PROFILED_FILE" >/dev/null 2>&1 || true

ok "已清理命令入口及环境变量"

# =========================
# 删除安装目录
# =========================
if [ "$PURGE" = true ]; then
  if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    ok "已删除安装目录: $INSTALL_DIR"
  else
    warn "未找到安装目录: $INSTALL_DIR"
  fi
else
  warn "安装目录已保留: $INSTALL_DIR"
  echo "如需彻底删除，请执行：bash uninstall.sh --purge"
fi

echo
ok "卸载完成"