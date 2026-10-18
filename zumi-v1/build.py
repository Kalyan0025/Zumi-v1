#!/usr/bin/env python3
"""Inline src/ css + js into dist/index.html (one self-contained file).
Usage: python3 build.py   (open dist/index.html, or serve src/ directly during dev)"""
import re,pathlib
root=pathlib.Path(__file__).parent;src=root/'src'
h=(src/'index.html').read_text()
h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>\n'+(src/m.group(1)).read_text()+'\n</style>',h)
h=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>\n'+(src/m.group(1)).read_text()+'\n</script>',h)
h=re.sub(r'(?is)<!doctype html>|</?html[^>]*>|</?head>|</?body>','',h)
h=re.sub(r'<meta name="viewport"[^>]*>|<meta charset="utf-8">','',h)
d=root/'dist';d.mkdir(exist_ok=True);(d/'index.html').write_text(h.strip()+'\n')
print('built',d/'index.html',len(h)//1024,'KB')
