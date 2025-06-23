package com.andik.ecommerce.service;

import java.math.BigDecimal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andik.ecommerce.entity.*;
import com.andik.ecommerce.exception.BadRequestException;
import com.andik.ecommerce.exception.ResourceNotFoundException;
import com.andik.ecommerce.model.*;
import com.andik.ecommerce.repository.*;

@Service
public class PesananService {

    @Autowired
    private ProdukRepository produkRepository;
    @Autowired
    private PesananRepository pesananRepository;
    @Autowired
    private PesananItemRepository pesananItemRepository;
    @Autowired
    private KeranjangService keranjangService;
    @Autowired
    private PesananLogService pesananLogService;

    @Transactional
    public PesananResponse create(String username, PesananRequest request) {
        Pesanan pesanan = new Pesanan();
        pesanan.setId(UUID.randomUUID().toString());
        pesanan.setTanggal(new Date());
        pesanan.setNomor(generateNomorPesanan());
        pesanan.setPengguna(new Pengguna(username));
        pesanan.setAlamatPengiriman(request.getAlamatPengiriman());
        pesanan.setStatusPesanan(StatusPesanan.DRAFT);
        pesanan.setWaktuPesan(new Date());

        List<PesananItem> items = new ArrayList<>();
        for (KeranjangRequest k : request.getItems()) {
            Produk produk = produkRepository.findById(k.getProdukId())
                .orElseThrow(() -> new BadRequestException("Produk ID " + k.getProdukId() + " tidak ditemukan"));
            if (produk.getStok() < k.getKuantitas()) {
                throw new BadRequestException("Stok tidak mencukupi");
            }

            PesananItem pi = new PesananItem();
            pi.setId(UUID.randomUUID().toString());
            pi.setProduk(produk);
            pi.setDeskripsi(produk.getNama());
            pi.setKuantitas(k.getKuantitas());
            pi.setHarga(produk.getHarga());
            pi.setJumlah(BigDecimal.valueOf(produk.getHarga().doubleValue() * pi.getKuantitas()));
            pi.setPesanan(pesanan);
            items.add(pi);
        }

        BigDecimal jumlah = items.stream()
            .map(PesananItem::getJumlah)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        pesanan.setJumlah(jumlah);
        pesanan.setOngkir(request.getOngkir());
        pesanan.setTotal(jumlah.add(request.getOngkir()));

        Pesanan saved = pesananRepository.save(pesanan);
        for (PesananItem item : items) {
            pesananItemRepository.save(item);
            Produk produk = item.getProduk();
            produk.setStok(produk.getStok() - item.getKuantitas());
            produkRepository.save(produk);
            keranjangService.delete(username, produk.getId());
        }

        pesananLogService.createLog(username, saved, PesananLogService.DRAFT, "Pesanan sukses dibuat");
        return new PesananResponse(saved, items);
    }

    @Transactional
    public Pesanan cancelPesanan(String pesananId, String userId) {
        Pesanan pesanan = findUserPesananOrThrow(pesananId, userId);
        if (!StatusPesanan.DRAFT.equals(pesanan.getStatusPesanan())) {
            throw new BadRequestException("Pesanan ini tidak dapat dibatalkan karena sudah diproses");
        }

        pesanan.setStatusPesanan(StatusPesanan.DIBATALKAN);
        Pesanan saved = pesananRepository.save(pesanan);
        pesananLogService.createLog(userId, saved, PesananLogService.DIBATALKAN, "Pesanan dibatalkan oleh user");
        return saved;
    }

    @Transactional
    public Pesanan terimaPesanan(String pesananId, String userId) {
        Pesanan pesanan = findUserPesananOrThrow(pesananId, userId);
        if (!StatusPesanan.PENGIRIMAN.equals(pesanan.getStatusPesanan())) {
            throw new BadRequestException("Hanya pesanan dalam status PENGIRIMAN yang bisa diterima");
        }

        pesanan.setStatusPesanan(StatusPesanan.SELESAI); // ✅ fix
        Pesanan saved = pesananRepository.save(pesanan);
        pesananLogService.createLog(userId, saved, PesananLogService.SELESAI, "Pesanan diterima user");
        return saved;
    }

    public List<Pesanan> findAllPesananUser(String userId, int page, int limit) {
        return pesananRepository.findByPenggunaId(userId,
            PageRequest.of(page, limit, Sort.by("waktuPesan").descending()));
    }

    public List<Pesanan> search(String filterText, int page, int limit) {
        return pesananRepository.search(filterText.toLowerCase(),
            PageRequest.of(page, limit, Sort.by("waktuPesan").descending()));
    }

    @Transactional
    public Pesanan konfirmasiPembayaran(String pesananId, String userId) {
        Pesanan pesanan = findPesananOrThrow(pesananId);
        if (!StatusPesanan.DRAFT.equals(pesanan.getStatusPesanan())) {
            throw new BadRequestException("Status harus DRAFT untuk dikonfirmasi pembayaran");
        }

        pesanan.setStatusPesanan(StatusPesanan.PEMBAYARAN);
        Pesanan saved = pesananRepository.save(pesanan);
        pesananLogService.createLog(userId, saved, PesananLogService.PEMBAYARAN, "Pembayaran dikonfirmasi");
        return saved;
    }

    @Transactional
    public Pesanan packing(String pesananId, String userId) {
        Pesanan pesanan = findPesananOrThrow(pesananId);
        if (!StatusPesanan.PEMBAYARAN.equals(pesanan.getStatusPesanan())) {
            throw new BadRequestException("Status harus PEMBAYARAN untuk packing");
        }

        pesanan.setStatusPesanan(StatusPesanan.PACKING);
        Pesanan saved = pesananRepository.save(pesanan);
        pesananLogService.createLog(userId, saved, PesananLogService.PACKING, "Pesanan dipacking");
        return saved;
    }

    @Transactional
    public Pesanan kirim(String pesananId, String userId) {
        Pesanan pesanan = findPesananOrThrow(pesananId);
        if (!StatusPesanan.PACKING.equals(pesanan.getStatusPesanan())) {
            throw new BadRequestException("Status harus PACKING untuk pengiriman");
        }

        pesanan.setStatusPesanan(StatusPesanan.PENGIRIMAN);
        Pesanan saved = pesananRepository.save(pesanan);
        pesananLogService.createLog(userId, saved, PesananLogService.PENGIRIMAN, "Pesanan dikirim");
        return saved;
    }

    private Pesanan findUserPesananOrThrow(String pesananId, String userId) {
        Pesanan pesanan = pesananRepository.findById(pesananId)
            .orElseThrow(() -> new ResourceNotFoundException("Pesanan tidak ditemukan"));
        if (!pesanan.getPengguna().getId().equals(userId)) {
            throw new BadRequestException("Tidak berhak mengakses pesanan ini");
        }
        return pesanan;
    }

    private Pesanan findPesananOrThrow(String pesananId) {
        return pesananRepository.findById(pesananId)
            .orElseThrow(() -> new ResourceNotFoundException("Pesanan tidak ditemukan"));
    }

    private String generateNomorPesanan() {
        return String.format("%016d", System.nanoTime());
    }
}
