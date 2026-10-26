#!/usr/bin/env bash
# Local preview of the blog, drafts included, with live reload: http://127.0.0.1:4000
# Uses Homebrew's ruby@3.3 (GitHub Pages builds with Ruby 3.3 and the github-pages gem).
# First run on a new machine: brew install ruby@3.3 && ./serve.sh --install
# to kill the process running on a specific port: lsof -ti tcp:4000 | xargs kill

set -euo pipefail
cd "$(dirname "$0")"
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
if [[ "${1:-}" == "--install" ]]; then
  gem install bundler --no-document
  bundle config set --local path vendor/bundle
  bundle install
fi
exec bundle exec jekyll serve --drafts --livereload --port 4000 2> >(grep -v 'bigdecimal\|silence this warning' >&2)
