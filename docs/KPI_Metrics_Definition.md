# KPI & Metrics Definition

## 1. Overview

Dokumen ini mendefinisikan metric/KPI yang digunakan dalam dashboard sales performance, termasuk definisi bisnis dan formula/logic perhitungan.

**Primary data source:** sales transaction data  
**Primary sales amount field:** `LocalAmount`  
**Primary quantity field:** `Qty`

---

## 2. Sales Metrics

| No | Category | Metric Name | Definition | Formula / Logic |
|---:|---|---|---|---|
| 1 | Sales | Revenue / Sales Amount | Total nilai transaksi yang memenuhi scope metrik. | `SUM(LocalAmount)` sesuai brand/provider/product/filter |
| 2 | Sales | Sales Quantity | Jumlah unit/transaksi yang memenuhi scope metrik. | `SUM(Qty)` sesuai brand/provider/product/filter |
| 3 | Sales | Target | Nilai sasaran yang menjadi pembanding pencapaian aktual. | Target diambil dari table `master_target` |
| 4 | Sales | Achievement | Nilai aktual pencapaian pada scope kategori/staff yang dipilih. | `SUM(LocalAmount)` sesuai KPI Group dan/atau Sales ID |
| 5 | Sales | Achievement % | Persentase realisasi terhadap target. | `Achievement / Target` |
| 6 | Sales | Variance | Selisih antara pencapaian aktual dan target. | `Actual - Target` |
| 7 | Sales | Estimated Revenue | Proyeksi revenue akhir bulan berdasarkan rata-rata run rate harian saat ini. | `Actual / Day(Current Date) * Days in Month` |
| 8 | Sales | Estimated Achievement % | Persentase proyeksi pencapaian terhadap target. | `Estimated Revenue / Target` |
| 10 | Sales | Time Gone % | Persentase hari dalam bulan yang telah berlalu pada periode dashboard. | `(Current Date - 1 day position) / Days in Month` |

---

## 3. Product Metrics

| No | Category | Metric Name | Definition | Formula / Logic |
|---:|---|---|---|---|
| 11 | Product | Apple Revenue | Total nilai penjualan dengan KPI Group `APPLE`. | `SUMIFS(LocalAmount, KPI Group, "APPLE")` |
| 12 | Product | Android Revenue | Total nilai penjualan dengan KPI Group `ANDROID`. | `SUMIFS(LocalAmount, KPI Group, "ANDROID")` |
| 13 | Product | Accessories Revenue | Total nilai penjualan dengan KPI Group `ACCESSORIES`. | `SUMIFS(LocalAmount, KPI Group, "ACCESSORIES")` |
| 14 | Product | VAS Revenue | Total nilai penjualan dengan KPI Group `VAS`. | `SUMIFS(LocalAmount, KPI Group, "VAS")` |
| 15 | Product | Sales by Brand | Agregasi penjualan berdasarkan dimensi yang disebutkan pada nama metrik. | `SUM(LocalAmount) GROUP BY` dimensi terkait |
| 16 | Product | Sales by Product | Agregasi penjualan berdasarkan dimensi yang disebutkan pada nama metrik. | `SUM(LocalAmount) GROUP BY` dimensi terkait |
| 17 | Product | Sales by SKU / Article | Agregasi penjualan berdasarkan dimensi yang disebutkan pada nama metrik. | `SUM(LocalAmount) GROUP BY` dimensi terkait |
| 18 | Product | Product Qty | Jumlah unit/transaksi yang memenuhi scope metrik. | `SUM(Qty)` sesuai brand/provider/product/filter |

---

## 4. Metric Calculation Reference

### 4.1 Revenue / Sales Amount

Revenue merupakan total nilai transaksi berdasarkan filter/scope yang sedang aktif.

```text
Revenue = SUM(LocalAmount)
```

Scope dapat dibatasi berdasarkan:

- Store
- Area Manager
- Sales ID
- KPI Group
- Brand
- Provider
- Product
- Date / Period
- dan filter dashboard lainnya

---

### 4.2 Sales Quantity

Mengukur jumlah unit/transaksi yang terjual.

```text
Sales Quantity = SUM(Qty)
```

Perhitungan mengikuti filter/scope yang sama dengan Revenue.

---

### 4.3 Target

Target merupakan nilai sasaran yang digunakan sebagai benchmark terhadap actual sales.

Untuk store:

```text
Target = Target dari table 'master_target'
```

---

### 4.4 Achievement

Achievement merepresentasikan actual sales yang telah dicapai dalam scope tertentu.

```text
Achievement = SUM(LocalAmount)
```

Contoh scope:

```text
Achievement Store
Achievement Apple
Achievement Android
Achievement Accessories
Achievement VAS
```

---

### 4.5 Achievement %

Mengukur persentase pencapaian terhadap target.

```text
Achievement % = Achievement / Target
```

Untuk display sebagai percentage:

```text
Achievement % × 100
```

Contoh:

```text
Achievement = Rp 800.000.000
Target      = Rp 1.000.000.000

Achievement % = 80%
```

---

### 4.6 Variance

Variance menunjukkan gap nominal antara actual dan target.

```text
Variance = Actual - Target
```

Interpretasi:

```text
Variance > 0  → Actual berada di atas Target
Variance = 0  → Actual sama dengan Target
Variance < 0  → Actual berada di bawah Target
```

---

### 4.7 Estimated Revenue

Estimated Revenue merupakan proyeksi revenue sampai akhir bulan berdasarkan run rate harian saat ini.

```text
Estimated Revenue =
Actual / Day(Current Date) × Days in Month
```

Contoh:

```text
Actual            = Rp 500.000.000
Current Day       = 15
Days in Month     = 30

Estimated Revenue =
Rp 500.000.000 / 15 × 30

= Rp 1.000.000.000
```

> Untuk implementasi dashboard, definisi `Day(Current Date)` perlu konsisten dengan status periode dashboard dan tanggal transaksi yang digunakan.

---

### 4.8 Estimated Achievement %

Mengukur projected achievement terhadap target.

```text
Estimated Achievement % =
Estimated Revenue / Target
```

Contoh:

```text
Estimated Revenue = Rp 1.000.000.000
Target            = Rp 1.200.000.000

Estimated Achievement % = 83,33%
```

---

### 4.9 Time Gone %

Time Gone % menunjukkan proporsi waktu dalam bulan yang sudah berlalu.

```text
Time Gone % =
(Current Date - 1 day position) / Days in Month
```

Metric ini dapat digunakan sebagai benchmark untuk membandingkan:

```text
Achievement % vs Time Gone %
```

Contoh interpretasi:

```text
Achievement % > Time Gone %
→ Sales pace berada di atas waktu yang telah berjalan.

Achievement % < Time Gone %
→ Sales pace berada di bawah waktu yang telah berjalan.
```

---

## 5. KPI Group Metrics

Dashboard menggunakan empat KPI Group utama:

```text
APPLE
ANDROID
ACCESSORIES
VAS
```

### Apple Revenue

```text
SUMIFS(LocalAmount, KPI Group, "APPLE")
```

### Android Revenue

```text
SUMIFS(LocalAmount, KPI Group, "ANDROID")
```

### Accessories Revenue

```text
SUMIFS(LocalAmount, KPI Group, "ACCESSORIES")
```

### VAS Revenue

```text
SUMIFS(LocalAmount, KPI Group, "VAS")
```

---

## 6. Product Analysis Metrics

### Sales by Brand

Digunakan untuk melihat kontribusi revenue berdasarkan brand.

```text
SUM(LocalAmount)
GROUP BY Brand
```

Contoh output:

```text
Apple      Rp xxx
Samsung    Rp xxx
Xiaomi     Rp xxx
Oppo       Rp xxx
```

### Sales by Product

Digunakan untuk melihat performa berdasarkan product/product description.

```text
SUM(LocalAmount)
GROUP BY Product
```

### Sales by SKU / Article

Digunakan untuk analisis level SKU/article.

```text
SUM(LocalAmount)
GROUP BY SKU / Article
```

### Product Qty

Mengukur volume unit berdasarkan product scope.

```text
Product Qty = SUM(Qty)
```

---

## 8. Implementation Notes

### Revenue fields

Gunakan field:

```text
localamount
```

sebagai sumber utama revenue.

### Quantity fields

Gunakan:

```text
qty_item
```

sebagai sumber utama quantity.

### Target source

Target harus berasal dari table 'master_target', bukan dihitung dari actual sales.


### Filter consistency

Semua metric yang menggunakan actual sales harus menerapkan filter/scope yang sama dengan dashboard context, kecuali metric memang didefinisikan sebagai aggregate/global metric.

---
