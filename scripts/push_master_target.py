import json
import os
import urllib.error
import urllib.request
from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = ROOT_DIR / "data" / "raw" / "master_target_stores.xlsx"
ENV_FILE = ROOT_DIR / ".env"
TABLE = "master_target"
BATCH_SIZE = 500


def load_env() -> None:
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def get_config() -> tuple[str, str]:
    load_env()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_SECRET_KKEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SECRET_KEY are required in .env")
    return url.rstrip("/"), key


def read_rows() -> list[dict[str, object]]:
    df = pd.read_excel(INPUT_FILE)
    df = df.where(pd.notna(df), None)
    return df.to_dict("records")


def push_batch(base_url: str, key: str, rows: list[dict[str, object]]) -> None:
    request = urllib.request.Request(
        f"{base_url}/rest/v1/{TABLE}",
        data=json.dumps(rows, ensure_ascii=False).encode("utf-8"),
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request) as response:
            if response.status not in (200, 201, 204):
                raise RuntimeError(f"Supabase returned HTTP {response.status}")
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase returned HTTP {error.code}: {detail}") from error


def main() -> None:
    rows = read_rows()
    if not rows:
        raise RuntimeError(f"No rows found in {INPUT_FILE}")

    base_url, key = get_config()
    print(f"Pushing {len(rows)} rows to {TABLE}...")

    for start in range(0, len(rows), BATCH_SIZE):
        batch = rows[start : start + BATCH_SIZE]
        push_batch(base_url, key, batch)
        print(f"Synced {min(start + BATCH_SIZE, len(rows))}/{len(rows)} rows")


if __name__ == "__main__":
    main()
