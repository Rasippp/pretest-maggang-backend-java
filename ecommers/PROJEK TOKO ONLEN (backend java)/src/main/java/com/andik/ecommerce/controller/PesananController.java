package com.andik.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.andik.ecommerce.entity.Pesanan;
import com.andik.ecommerce.model.PesananRequest;
import com.andik.ecommerce.model.PesananResponse;
import com.andik.ecommerce.security.service.UserDetailsImpl;
import com.andik.ecommerce.service.PesananService;

@RestController
@RequestMapping("/api")
@PreAuthorize("isAuthenticated()")
public class PesananController {

    @Autowired
    private PesananService pesananService;

    // ✅ Perbaikan: tambahkan pengecekan items null
    @PostMapping("/pesanans")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<?> create(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody PesananRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Items tidak boleh kosong"));
        }

        PesananResponse response = pesananService.create(user.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pesanans/{pesananId}/cancel")
    @PreAuthorize("hasAuthority('user')")
    public Pesanan cancelPesananUser(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable("pesananId") String pesananId) {
        return pesananService.cancelPesanan(pesananId, user.getUsername());
    }

    @PatchMapping("/pesanans/{pesananId}/terima")
    @PreAuthorize("hasAuthority('user')")
    public Pesanan terima(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable("pesananId") String pesananId) {
        return pesananService.terimaPesanan(pesananId, user.getUsername());
    }

    @PatchMapping("/pesanans/{pesananId}/konfirmasi")
    @PreAuthorize("hasAuthority('admin')")
    public Pesanan konfirmasi(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable("pesananId") String pesananId) {
        return pesananService.konfirmasiPembayaran(pesananId, user.getUsername());
    }

    @PatchMapping("/pesanans/{pesananId}/packing")
    @PreAuthorize("hasAuthority('admin')")
    public Pesanan packing(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable("pesananId") String pesananId) {
        return pesananService.packing(pesananId, user.getUsername());
    }

    @PatchMapping("/pesanans/{pesananId}/kirim")
    @PreAuthorize("hasAuthority('admin')")
    public Pesanan kirim(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable("pesananId") String pesananId) {
        return pesananService.kirim(pesananId, user.getUsername());
    }

    @GetMapping("/pesanans")
    @PreAuthorize("hasAuthority('user')")
    public List<Pesanan> findAllPesananUser(@AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "limit", defaultValue = "25", required = false) int limit) {
        return pesananService.findAllPesananUser(user.getUsername(), page, limit);
    }

    @GetMapping("/pesanans/admin")
    @PreAuthorize("hasAuthority('admin')")
    public List<Pesanan> search(@AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam(name = "filterText", defaultValue = "", required = false) String filterText,
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "limit", defaultValue = "25", required = false) int limit) {
        return pesananService.search(filterText, page, limit);
    }

}
