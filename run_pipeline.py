import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = ROOT_DIR / "scripts"


def run_command(command: list[str]) -> None:
    result = subprocess.run(command)
    if result.returncode != 0:
        sys.exit(result.returncode)


def main() -> None:
    print("=== Step 1: Cleaning Sales Data ===")
    run_command([sys.executable, str(SCRIPTS_DIR / "clean_sales_data.py")])

    print("\n=== Step 2: Syncing to Supabase ===")
    run_command([sys.executable, str(SCRIPTS_DIR / "sync_supabase.py")])

    print("\nPipeline finished successfully.")


if __name__ == "__main__":
    main()
