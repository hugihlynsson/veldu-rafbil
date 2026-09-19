#!/usr/bin/env bash
# Download every page of an issuu publication as a JPEG, so the price list can
# be read with the Read tool. Issuu serves no text layer, only page images.
#
#   issuu-pages.sh <issuu doc url> <output dir>
#
# Prints the upload date read from the document id, then one line per page.
# Pages are fetched until the CDN answers 403, which is how it says "no such
# page" - there is no page count to ask for.
set -euo pipefail

url="${1:?usage: issuu-pages.sh <issuu doc url> <output dir>}"
out="${2:?usage: issuu-pages.sh <issuu doc url> <output dir>}"
ua='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36'

id=$(curl -sSL -A "$ua" "$url" |
  grep -o 'image\.isu\.pub/[0-9a-f-]*/jpg/page_1_thumb_large' |
  head -1 | cut -d/ -f2 || true)

if [ -z "$id" ]; then
  echo "no document id found at $url" >&2
  exit 1
fi

# The id starts with the upload timestamp as yymmddHHMMSS.
echo "uploaded 20${id:0:2}-${id:2:2}-${id:4:2}"

mkdir -p "$out"
page=1
while :; do
  file="$out/page_$page.jpg"
  code=$(curl -sS -o "$file" -w '%{http_code}' "https://image.isu.pub/$id/jpg/page_$page.jpg")
  if [ "$code" != 200 ]; then
    rm -f "$file"
    break
  fi
  echo "$file"
  page=$((page + 1))
done

[ "$page" -gt 1 ] || { echo "no pages downloaded for $id" >&2; exit 1; }
