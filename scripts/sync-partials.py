#!/usr/bin/env python3
"""Copy the shared header and footer from partials/ into every page.

Each page marks where a partial goes with comment pairs, e.g.
    <!-- partial:header -->
    ...
    <!-- /partial:header -->
Everything between the markers is replaced. In partials, {{home}} becomes ""
on index.html (so nav links stay on the page) and "index.html" elsewhere.

Usage: python3 scripts/sync-partials.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ["header", "footer"]


def main():
    partials = {name: (ROOT / "partials" / f"{name}.html").read_text().strip() for name in PARTIALS}
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        original = page.read_bytes().decode("utf-8")
        newline = "\r\n" if "\r\n" in original else "\n"
        html = original.replace("\r\n", "\n")
        home = "" if page.name == "index.html" else "index.html"
        for name, body in partials.items():
            pattern = re.compile(rf"^([ \t]*)<!-- partial:{name} -->.*?<!-- /partial:{name} -->", re.S | re.M)
            if not pattern.search(html):
                print(f"warning: {page.name} has no {name} markers", file=sys.stderr)
                continue
            html = pattern.sub(
                lambda m: f"{m.group(1)}<!-- partial:{name} -->\n{m.group(1)}"
                + body.replace("{{home}}", home)
                + f"\n{m.group(1)}<!-- /partial:{name} -->",
                html,
            )
        html = html.replace("\n", newline)
        if html != original:
            page.write_bytes(html.encode("utf-8"))
            changed += 1
            print(f"updated {page.name}")
    print(f"{changed} page(s) updated")


if __name__ == "__main__":
    main()
