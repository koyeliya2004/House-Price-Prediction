#!/usr/bin/env bash
set -euo pipefail

echo "Removing training artifacts: catboost_info/ and Output/"
rm -rf "$(pwd)/catboost_info" "$(pwd)/Output"
echo "Removed."
