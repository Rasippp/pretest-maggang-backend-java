# Soal test maggang Backend engineer dengan Springboot

Berikut adalah soal/pertanyaan yang perlu dijawab oleh peserta maggang

## knowledge base

1. Apa yang anda ketahui tentang Rest API?
2. Apa yang anda ketahui tentang Server side and Client side processing?
3. Apa yang anda ketahui tentang Monolith dan Microservices, berikan contohnya?
4. Apa yang anda ketahui tentang Design pattern inversion of Control serta Dependency Injection?
5. Apa yang anda ketahui tentang Java programming dan Spring framework khususnya spring-boot?
   Jawaban
1. REST API
REST API adalah antarmuka yang memungkinkan client dan server berkomunikasi melalui protokol HTTP dengan metode seperti GET, POST, PUT, DELETE. 
Data umumnya dikirim dalam format JSON. REST bersifat stateless dan resource-based.

2. Server-side vs Client-side Processing
Client-side: Diproses di browser (UI, validasi ringan).
Server-side: Diproses di server (logika bisnis, database, autentikasi).
Contoh: Validasi form di client, simpan data ke DB di server.

3. Monolith vs Microservices
Monolith: Satu aplikasi besar, semua fungsi dalam satu proyek.
Contoh: Aplikasi e-commerce full satu proyek.
Microservices: Dibagi jadi layanan kecil yang saling terhubung via API.
Contoh: Service user, service produk, service pembayaran terpisah.

4. Inversion of Control & Dependency Injection
IoC: Pembalikan kontrol pembuatan objek ke framework.
DI: Objek disuntikkan (injected) otomatis oleh framework.
Membuat kode lebih modular dan mudah diuji.

5. Java & Spring Boot
Java: Bahasa OOP, kuat dan cross-platform.
Spring Boot: Framework Java untuk bikin aplikasi web/API secara cepat dengan konfigurasi minimal.
Cocok untuk REST API dan microservices, karena sudah support autoconfiguration dan embedded server.

## Design modules

Dalam suatu schenario ada requirement membuat aplikasi e-commerse seperti Tokopedia seperti berikut:

1. Catalog, pelanggan mencari product di toko
    ![catalog](imgs/catalog.png)
2. Item, bisa melihat detail informasi produk
    ![items](imgs/item.png)
3. Cart, pelanggan bisa menambahkan produk yang ingin di beli ke keranjang
    ![cart](imgs/cart.png)
4. Setelah di checkout, masuk ke list transaction
    ![list-transaction](imgs/list-transaction.png)
5. Kita juga bisa liat detail transactionya
    ![detail-transaction](imgs/detail-transaction.png)

Kemudian temen-temen buat design database, module (monolith/microservices) berdasarkan gambar atau schenario tersebut. Serta jelakan mengapa menggunakan design tersebut.

Desain Modul & Database (Proyek E-Commerce)
Desain Modul: Menggunakan Monolith Architecture
Alasan:
Karena proyek masih sederhana, fitur belum kompleks, dan lebih cepat dikembangkan & dideploy dalam satu kode base.

Modul Utama:
Auth (pengguna)
Produk
Keranjang
Pesanan
Desain Database: Relasional (PostgreSQL)
Tabel: pengguna, produk, kategori, keranjang, pesanan, pesanan_item
Kalau aplikasi makin besar, bisa dipecah jadi Microservices (misal: Auth Service, Produk Service, dll). Tapi untuk saat ini, Monolith lebih efisien dan mudah di-manage



## Praktek

Berdasarkan analisa tersebut, buat project monorepo (pada repository ini) dengan menggunakan framework springboot seperti berikut specifikasinya:

- Database: `PostgreSQL 15`
- JDK version: `Oracle JDK 17 or later`
- Springboot version: `3.0.x`

terkait design system Toko, Barang, Pembelian pada ecommerse tersebut.
