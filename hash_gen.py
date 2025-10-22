"""
hash_gen.py
----------------
Reads `emails.txt` (one email per line), computes the SHA-256 hash for each
email (lowercased and trimmed), and injects the resulting hashes into
`kms_nsl.html` between the markers:

    // __AUTH_HASHES_START__
    // __AUTH_HASHES_END__

The script creates a backup of the original HTML as `kms_nsl.html.bak`.

Usage (Windows PowerShell):
    cd d:\projects\igeo.github.io
    python .\hash_gen.py

"""
import hashlib
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
EMAILS_FILE = BASE_DIR / 'emails.txt'
HTML_FILE = BASE_DIR / 'kms_nsl.html'


def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


def read_emails(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"{path} not found. Create a newline-separated emails.txt")
    emails = []
    with path.open(encoding='utf-8') as f:
        for line in f:
            e = line.strip()
            if not e:
                continue
            emails.append(e.lower())
    # remove duplicates while preserving order
    seen = set()
    unique = []
    dup_count = 0
    for e in emails:
        if e in seen:
            dup_count += 1
            continue
        seen.add(e)
        unique.append(e)
    if dup_count:
        print(f"Removed {dup_count} duplicate email{'s' if dup_count != 1 else ''}")
    emails = unique
    return emails


def make_array_entries(emails):
    lines = []
    for email in emails:
        h = sha256_hex(email)
        user = email.split('@')[0]
        comment = f"// {user[:3]}**{user[-2:]}@{email.split('@')[1][:4]}***"
        lines.append(f"        '{h}',   {comment}")
    return lines


def inject_hashes_into_html(html_path: Path, entries_lines):
    txt = html_path.read_text(encoding='utf-8')
    start_marker = r'// __AUTH_HASHES_START__'
    end_marker = r'// __AUTH_HASHES_END__'
    pattern = re.compile(rf'({re.escape(start_marker)})(.*?){re.escape(end_marker)}', re.S)

    replacement_block = start_marker + "\n" + "// Do not edit between these markers — updated by hash_gen.py\n"
    replacement_block += "const _0x5f2d3c = [\n"
    replacement_block += "\n".join(entries_lines) + ("\n" if entries_lines else "")
    replacement_block += "];\n" + end_marker

    if not pattern.search(txt):
        raise RuntimeError("Markers not found in HTML file. Make sure the file contains '// __AUTH_HASHES_START__' and '// __AUTH_HASHES_END__'")

    new_txt = pattern.sub(replacement_block, txt, count=1)
    backup_path = html_path.with_suffix('.html.bak')
    html_path.write_text(new_txt, encoding='utf-8')
    backup_path.write_text(txt, encoding='utf-8')
    print(f"Injected {len(entries_lines)} hashes into {html_path}")
    print(f"Backup of original saved to {backup_path}")


def main():
    emails = read_emails(EMAILS_FILE)
    entries = make_array_entries(emails)
    inject_hashes_into_html(HTML_FILE, entries)


if __name__ == '__main__':
    main()
