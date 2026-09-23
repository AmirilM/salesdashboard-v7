# Data Dictionary — `master_target_stores.xlsx`

## 1. Column Structure

| No | Column | Recommended Type | Null | Unique | Definition |
|---:|---|---|---:|---:|---|
| 1 | `store_code` | `TEXT / VARCHAR` | 0 | 130 | Kode unik toko / business identifier. |
| 2 | `cost_center` | `TEXT / VARCHAR` | 0 | 130 | Kode cost center yang terkait dengan toko. |
| 3 | `store_name` | `TEXT / VARCHAR` | 0 | 130 | Nama toko atau lokasi/cabang. |
| 4 | `concept` | `TEXT / VARCHAR` | 0 | 5 | Konsep/format toko. |
| 5 | `target_revenue_total` | `NUMERIC(18,2)` | 0 | 42 | Total target revenue toko. |
| 6 | `target_revenue_apple` | `NUMERIC(18,2)` | 0 | 119 | Target revenue Apple. |
| 7 | `target_revenue_android` | `NUMERIC(18,2)` | 0 | 127 | Target revenue Android; merupakan agregat seluruh brand Android yang tersedia. |
| 8 | `target_revenue_samsung` | `NUMERIC(18,2)` | 0 | 127 | Target revenue Samsung. |
| 9 | `target_revenue_xiaomi` | `NUMERIC(18,2)` | 0 | 115 | Target revenue Xiaomi. |
| 10 | `target_revenue_huawei` | `NUMERIC(18,2)` | 0 | 98 | Target revenue Huawei. |
| 11 | `target_revenue_motorola` | `NUMERIC(18,2)` | 0 | 110 | Target revenue Motorola. |
| 12 | `target_revenue_oppo` | `NUMERIC(18,2)` | 0 | 114 | Target revenue Oppo. |
| 13 | `target_revenue_infinix` | `NUMERIC(18,2)` | 0 | 111 | Target revenue Infinix. |
| 14 | `target_revenue_accessories` | `NUMERIC(18,2)` | 0 | 128 | Target revenue Accessories. |
| 15 | `target_revenue_vas` | `NUMERIC(18,2)` | 0 | 127 | Target revenue VAS (Value Added Services). |

---

## 2. Revenue Structure

### Android

```text
target_revenue_android
├── target_revenue_samsung
├── target_revenue_xiaomi
├── target_revenue_huawei
├── target_revenue_motorola
├── target_revenue_oppo
└── target_revenue_infinix
```

**Validation result:** `target_revenue_android` = jumlah seluruh target brand Android pada **130/130 store**.


### Total Revenue

Struktur total:

```text
target_revenue_total
├── target_revenue_apple
├── target_revenue_android
├── target_revenue_accessories
└── target_revenue_vas
```

---

## 11. Final Assessment

Struktur final:

```text
STORE
├── store_code
├── cost_center
├── store_name
└── concept

TARGET
├── target_revenue_total
├── target_revenue_apple
├── target_revenue_android
│   ├── Samsung
│   ├── Xiaomi
│   ├── Huawei
│   ├── Motorola
│   ├── Oppo
│   └── Infinix
├── target_revenue_accessories
└── target_revenue_vas
```

