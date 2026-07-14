#!/usr/bin/env bash
#
# korean-typography-harness — installer
# ---------------------------------------------------------------------------
# 이 레포의 skills/ 와 agents/ 를 Claude Code(및 선택적으로 ~/.agents 허브)로 설치한다.
#
# 사용법:
#   ./scripts/install.sh                 # ~/.claude 로 복사 설치 (기본)
#   ./scripts/install.sh --symlink       # 복사 대신 심링크 (개발/실시간 편집용)
#   ./scripts/install.sh --force         # 이미 있으면 덮어쓰기
#   ./scripts/install.sh --target DIR    # 대상 디렉토리 지정 (기본 ~/.claude)
#   ./scripts/install.sh --agents-hub    # ~/.agents/skills 에도 함께 설치 (Codex 허브)
#   ./scripts/install.sh --uninstall     # 설치했던 스킬/에이전트 제거
#
# 조합 예:  ./scripts/install.sh --symlink --force --agents-hub
# ---------------------------------------------------------------------------
set -euo pipefail

# --- 위치 파악 ---------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SKILLS_SRC="${REPO_ROOT}/skills"
AGENTS_SRC="${REPO_ROOT}/agents"

# --- 옵션 --------------------------------------------------------------------
TARGET="${HOME}/.claude"
MODE="copy"          # copy | symlink
FORCE=0
AGENTS_HUB=0
UNINSTALL=0

while [ $# -gt 0 ]; do
  case "$1" in
    --symlink)     MODE="symlink" ;;
    --force)       FORCE=1 ;;
    --agents-hub)  AGENTS_HUB=1 ;;
    --uninstall)   UNINSTALL=1 ;;
    --target)      shift; TARGET="${1:?--target 에 디렉토리가 필요합니다}" ;;
    --target=*)    TARGET="${1#--target=}" ;;
    -h|--help)
      sed -n '2,22p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "알 수 없는 옵션: $1" >&2; exit 2 ;;
  esac
  shift
done

# 실제 이름 목록
skill_names() { find "${SKILLS_SRC}" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort; }
agent_files() { find "${AGENTS_SRC}" -mindepth 1 -maxdepth 1 -name '*.md' -exec basename {} \; | sort; }

# --- 언인스톨 ----------------------------------------------------------------
if [ "${UNINSTALL}" -eq 1 ]; then
  echo "▶ 제거: ${TARGET}"
  while IFS= read -r n; do rm -rf "${TARGET}/skills/${n}"; echo "  - skills/${n}"; done < <(skill_names)
  while IFS= read -r n; do rm -f  "${TARGET}/agents/${n}"; echo "  - agents/${n}"; done < <(agent_files)
  if [ "${AGENTS_HUB}" -eq 1 ] && [ -d "${HOME}/.agents/skills" ]; then
    while IFS= read -r n; do rm -rf "${HOME}/.agents/skills/${n}"; done < <(skill_names)
    echo "  - ~/.agents/skills 에서도 제거"
  fi
  echo "✔ 제거 완료"
  exit 0
fi

# --- 설치 헬퍼 ---------------------------------------------------------------
# install_one <src> <dst>
install_one() {
  local src="$1" dst="$2"
  if [ -e "${dst}" ] || [ -L "${dst}" ]; then
    if [ "${FORCE}" -eq 1 ]; then
      rm -rf "${dst}"
    else
      echo "  skip (이미 존재, --force 로 덮어쓰기): ${dst/#${HOME}/\~}"
      return 1
    fi
  fi
  mkdir -p "$(dirname "${dst}")"
  if [ "${MODE}" = "symlink" ]; then
    ln -s "${src}" "${dst}"
  else
    # 복사: 심링크가 아닌 실파일로. rsync 없으면 cp -R.
    if command -v rsync >/dev/null 2>&1; then
      rsync -a --exclude='.DS_Store' "${src}/" "${dst}/" 2>/dev/null || rsync -a "${src}" "${dst}"
    else
      cp -R "${src}" "${dst}"
    fi
  fi
  return 0
}

# --- 설치 실행 ---------------------------------------------------------------
echo "▶ korean-typography-harness 설치"
echo "  source : ${REPO_ROOT}"
echo "  target : ${TARGET/#${HOME}/\~}   (mode=${MODE}, force=${FORCE})"
echo ""

s_ok=0; s_skip=0
echo "skills →"
while IFS= read -r n; do
  if install_one "${SKILLS_SRC}/${n}" "${TARGET}/skills/${n}"; then
    echo "  + ${n}"; s_ok=$((s_ok+1))
  else
    s_skip=$((s_skip+1))
  fi
done < <(skill_names)

a_ok=0; a_skip=0
echo "agents →"
while IFS= read -r n; do
  # 에이전트는 단일 파일: symlink 모드면 파일 심링크, copy 면 파일 복사
  dst="${TARGET}/agents/${n}"
  if { [ -e "${dst}" ] || [ -L "${dst}" ]; } && [ "${FORCE}" -ne 1 ]; then
    echo "  skip (이미 존재): agents/${n}"; a_skip=$((a_skip+1)); continue
  fi
  rm -f "${dst}"; mkdir -p "${TARGET}/agents"
  if [ "${MODE}" = "symlink" ]; then ln -s "${AGENTS_SRC}/${n}" "${dst}"; else cp "${AGENTS_SRC}/${n}" "${dst}"; fi
  echo "  + ${n}"; a_ok=$((a_ok+1))
done < <(agent_files)

# --- 선택: Codex 허브 (~/.agents/skills) ------------------------------------
if [ "${AGENTS_HUB}" -eq 1 ]; then
  HUB="${HOME}/.agents/skills"
  if [ -d "${HOME}/.agents" ]; then
    echo "agents-hub → ${HUB/#${HOME}/\~}"
    mkdir -p "${HUB}"
    while IFS= read -r n; do
      install_one "${SKILLS_SRC}/${n}" "${HUB}/${n}" && echo "  + ${n}" || true
    done < <(skill_names)
  else
    echo "  (~/.agents 없음 — agents-hub 건너뜀)"
  fi
fi

echo ""
echo "✔ 완료 — skills: +${s_ok} (skip ${s_skip}), agents: +${a_ok} (skip ${a_skip})"
echo "  Claude Code 를 재시작하면 스킬/에이전트가 로드됩니다."
echo "  진입점:  그냥 한글로 요청하거나  /korean-design-apply"
