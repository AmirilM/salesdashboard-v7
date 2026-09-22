from pathlib import Path
from uuid import uuid4

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = ROOT_DIR / "data" / "raw" / "data_sales_transactions.xlsx"
OUTPUT_FILE = ROOT_DIR / "data" / "processed" / "data_sales_transactions_cleaned.csv"

COLUMNS = [
    "id",
    "brand_name",
    "product_division",
    "product_group",
    "product_category",
    "date",
    "item",
    "qty_item",
    "localamount",
    "store_code",
    "month",
    "year",
    "sap_article",
    "sap_description",
    "brand_code",
    "lob",
    "sublob",
    "kpi_group",
    "store_name",
    "concept",
    "week_apple",
    "quarter_apple",
    "week_sf",
]

TEXT_COLUMNS = [
    "brand_name",
    "product_division",
    "product_group",
    "product_category",
    "item",
    "store_code",
    "month",
    "year",
    "sap_article",
    "sap_description",
    "brand_code",
    "lob",
    "sublob",
    "kpi_group",
    "store_name",
    "concept",
    "week_apple",
    "quarter_apple",
    "week_sf",
]


def main() -> None:
    df = pd.read_excel(INPUT_FILE, dtype={column: "string" for column in TEXT_COLUMNS})

    missing_columns = sorted(set(COLUMNS[1:]) - set(df.columns))
    extra_columns = sorted(set(df.columns) - set(COLUMNS[1:]))
    if missing_columns or extra_columns:
        raise ValueError(f"Column mismatch. Missing: {missing_columns}; Extra: {extra_columns}")

    df["id"] = [str(uuid4()) for _ in range(len(df))]
    df["date"] = pd.to_datetime(df["date"], errors="raise").dt.strftime("%Y-%m-%d")
    df["qty_item"] = pd.to_numeric(df["qty_item"], errors="raise").astype("Int64")
    df["localamount"] = pd.to_numeric(df["localamount"], errors="raise").round(2)
    df = df[COLUMNS].astype(object).where(pd.notna(df), None)
    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8-sig")
    print(f"Created {OUTPUT_FILE} with {len(df)} rows and {len(df.columns)} columns")


if __name__ == "__main__":
    main()
