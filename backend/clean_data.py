with open(
    "knowledge_base.txt",
    "r",
    encoding="utf-8"
) as f:
    lines = f.readlines()

cleaned = []

for line in lines:
    line = line.strip()

    if len(line) > 30:
        cleaned.append(line)

with open(
    "knowledge_clean.txt",
    "w",
    encoding="utf-8"
) as f:
    for line in cleaned:
        f.write(line + "\n")

print("Cleaned successfully.")