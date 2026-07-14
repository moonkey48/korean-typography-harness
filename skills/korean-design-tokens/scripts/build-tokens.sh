#!/usr/bin/env bash
#
# Korean Design — 멀티플랫폼 토큰 빌드
# ---------------------------------------------------------------------------
# foundation 의 정본 DTCG 를 source 로 Style Dictionary 가
# build/{css,scss,js,ios,android} 에 산출물을 생성한다.
#
# 사용:  bash scripts/build-tokens.sh
# 요구:  Node/npm (npx 로 style-dictionary v4 를 즉석 실행)
#
set -euo pipefail

# 이 스크립트는 scripts/ 에 있다. skill 루트를 cwd 로 삼는다.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${SKILL_ROOT}"

CONFIG="assets/style-dictionary.config.json"
SOURCE="../korean-design-foundation/references/tokens.dtcg.json"

if [ ! -f "${CONFIG}" ]; then
  echo "error: config 를 찾을 수 없습니다: ${SKILL_ROOT}/${CONFIG}" >&2
  exit 1
fi

if [ ! -f "${SOURCE}" ]; then
  echo "error: foundation 토큰(SSOT)을 찾을 수 없습니다: ${SKILL_ROOT}/${SOURCE}" >&2
  echo "       korean-design-foundation 스킬이 형제 디렉토리에 있어야 합니다." >&2
  exit 1
fi

echo "▶ Style Dictionary 빌드 시작"
echo "  source: ${SOURCE}"
echo "  config: ${CONFIG}"

# style-dictionary v4 CLI. 설치돼 있으면 로컬 바이너리를, 없으면 npx 로 내려받아 실행.
npx --yes style-dictionary@^4 build --config "${CONFIG}"

echo "✔ 빌드 완료 → ${SKILL_ROOT}/build/{css,scss,js,ios,android}"
