import re
from pathlib import Path

root = Path(r'e:\Project\Student_Profile')
files = [p for p in sorted(root.rglob('*.js')) + sorted(root.rglob('*.jsx')) if 'node_modules' not in p.parts and '.git' not in p.parts]
changed = []
for path in files:
    try:
        text = path.read_text(encoding='utf-8')
    except PermissionError:
        continue
    orig = text
    text = re.sub(r'{\s*/\*[\s\S]*?\*/\s*}', '', text)
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    text = re.sub(r'(?<!http:)(?<!https:)//.*', '', text)
    if text != orig:
        path.write_text(text, encoding='utf-8')
        changed.append(str(path.relative_to(root)))
print('changed files:')
print('\n'.join(changed))
