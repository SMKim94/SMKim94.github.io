#!/bin/bash
#
# Claude Code on the web 세션 시작 훅.
#
# 이 저장소는 Node 26을 요구하지만(.node-version, package.json engines,
# .npmrc engine-strict) 웹 세션 컨테이너의 기본 Node는 그보다 낮다.
# 그대로 두면 npm ci가 EBADENGINE으로 실패하므로 여기서 Node 26을 깔아준다.
#
set -euo pipefail

# 웹(원격) 세션에서만 동작한다. 로컬 개발 환경은 각자 버전 매니저를 쓴다.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
PREFIX=/opt/node26

# .node-version이 단일 출처. "26" 같은 메이저만 적혀 있으면 최신 26.x를 찾는다.
PIN="$(tr -d 'v \t\n\r' < "$PROJECT_DIR/.node-version")"

resolve_version() {
  case "$PIN" in
    *.*) printf 'v%s\n' "$PIN" ;;
    *)   curl -sSL --retry 3 --max-time 60 https://nodejs.org/dist/index.json \
           | grep -o "\"version\":\"v${PIN}\.[0-9]\+\.[0-9]\+\"" \
           | head -1 | sed 's/.*"\(v[0-9.]*\)"/\1/' ;;
  esac
}

arch() {
  case "$(uname -m)" in
    x86_64)  echo x64 ;;
    aarch64|arm64) echo arm64 ;;
    *) echo "지원하지 않는 아키텍처: $(uname -m)" >&2; return 1 ;;
  esac
}

install_node() {
  local version="$1" a tarball
  a="$(arch)" || return 1
  tarball="node-${version}-linux-${a}.tar.xz"

  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN

  curl -sSL --retry 3 --max-time 300 \
    -o "$tmp/node.tar.xz" "https://nodejs.org/dist/${version}/${tarball}" || return 1

  rm -rf "$PREFIX"
  mkdir -p "$PREFIX"
  tar -xJf "$tmp/node.tar.xz" -C "$PREFIX" --strip-components=1 || return 1
}

# 이미 원하는 버전이 깔려 있으면 다시 받지 않는다 (재실행 안전).
WANTED="$(resolve_version || true)"
CURRENT=""
[ -x "$PREFIX/bin/node" ] && CURRENT="$("$PREFIX/bin/node" -v 2>/dev/null || true)"

if [ -z "$WANTED" ]; then
  echo "경고: Node 버전을 확인하지 못했습니다 (네트워크?). 기존 설치를 그대로 씁니다." >&2
elif [ "$CURRENT" != "$WANTED" ]; then
  echo "Node $WANTED 설치 중... (현재: ${CURRENT:-없음})"
  if ! install_node "$WANTED"; then
    echo "경고: Node $WANTED 설치 실패. npm ci가 EBADENGINE으로 실패할 수 있습니다." >&2
  fi
fi

if [ ! -x "$PREFIX/bin/node" ]; then
  echo "경고: $PREFIX/bin/node 가 없어 Node 설정을 건너뜁니다." >&2
  exit 0
fi

# 이 세션의 모든 이후 명령이 Node 26을 보도록 PATH를 넘긴다.
export PATH="$PREFIX/bin:$PATH"
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PATH=\"$PREFIX/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi

echo "Node $(node -v) / npm $(npm -v)"

# 의존성 설치. lockfile 그대로 재현하려고 npm install이 아닌 npm ci를 쓴다
# (설치가 수 초라 캐시 이득보다 결정성과 깨끗한 작업 트리가 낫다).
cd "$PROJECT_DIR"
npm ci --no-audit --no-fund
