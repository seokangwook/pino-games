#!/bin/bash
# Exit 0 = skip build, exit 1 = proceed with build
DIFF=$(git diff HEAD^ HEAD --name-only 2>/dev/null)
if [ -z "$DIFF" ]; then exit 0; fi
if echo "$DIFF" | grep -qE '\.(ts|tsx|js|jsx|json|css|scss|mjs|cjs)$|^(src|app|pages|components|lib|public|styles|hooks|utils|types)/'; then
  exit 1
fi
exit 0
