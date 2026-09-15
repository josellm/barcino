#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 {smoke-test|test}"
  exit 1
}

case "${1:-}" in
  smoke-test|test)
    npm run test:smoke
    exit $?
    ;;
  *)
    usage
    ;;
esac