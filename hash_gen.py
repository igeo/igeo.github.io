# save as hash_emails.py and run: python3 hash_emails.py
import hashlib

with open('emails.txt', encoding='utf-8') as f:
    for line in f:
        email = line.strip()
        if not email: 
            continue
        h = hashlib.sha256(email.encode('utf-8')).hexdigest()
        user = email.split('@')[0]
        print(f"            '{h}',   // {user[:3]}**{user[-2:]}@{email.split('@')[1][:4]}***")
