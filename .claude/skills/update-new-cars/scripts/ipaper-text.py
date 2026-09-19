#!/usr/bin/env python3
"""Print the text of every page of an iPaper flipbook.

    ipaper-text.py <flipbook url>

Toyota and Lexus publish their price lists as iPaper flipbooks
(kynningarefni.toyota.is/verdlisti, .../verdlistilexus). The page is rendered
in the browser, but the whole publication's text sits in the HTML as a
`pageTexts` array, so no browser and no page images are needed. The `?page=N`
in those URLs only picks the page that opens first; every page is in the array.

Each page is printed on its own line after a `=== page N ===` marker, with the
whitespace collapsed, since a table row otherwise arrives one cell per line.
"""
import json
import re
import sys
import urllib.request

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 Chrome/126 Safari/537.36"
)

if len(sys.argv) != 2:
    sys.exit("usage: ipaper-text.py <flipbook url>")

request = urllib.request.Request(sys.argv[1], headers={"User-Agent": UA})
html = urllib.request.urlopen(request, timeout=30).read().decode("utf-8", "replace")

marker = '"pageTexts":'
start = html.find(marker)
if start < 0:
    sys.exit("no pageTexts in the page; it may not be an iPaper flipbook")

pages, _ = json.JSONDecoder().raw_decode(html[start + len(marker) :])
for number, text in enumerate(pages, 1):
    print(f"=== page {number} ===")
    print(re.sub(r"\s+", " ", text).strip())
