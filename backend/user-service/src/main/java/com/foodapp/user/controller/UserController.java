package com.foodapp.user.controller;

import com.foodapp.user.entity.User;
import com.foodapp.user.entity.UserAddress;
import com.foodapp.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
  private final UserService svc;

  public UserController(UserService svc) {
    this.svc = svc;
  }

  @GetMapping("/healthz")
  public ResponseEntity<?> health() { return ResponseEntity.ok().body(new java.util.HashMap<>() {{ put("ok", true); }}); }

  @PostMapping("/users")
  public ResponseEntity<?> create(@Valid @RequestBody User user) {
    try {
      User saved = svc.createUser(user);
      return ResponseEntity.status(201).body(saved);
    } catch (DataIntegrityViolationException e) {
      return ResponseEntity.status(409).body(java.util.Map.of("error", "email_or_phone_exists"));
    }
  }

  @GetMapping("/users/{id}")
  public ResponseEntity<?> get(@PathVariable Long id) {
    return svc.getUser(id)
      .<ResponseEntity<?>>map(ResponseEntity::ok)
      .orElse(ResponseEntity.status(404).body(java.util.Map.of("error", "not_found")));
  }

  @PutMapping("/users/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User payload) {
    return svc.updateUser(id, payload)
      .<ResponseEntity<?>>map(ResponseEntity::ok)
      .orElse(ResponseEntity.status(404).body(java.util.Map.of("error", "not_found")));
  }

  @PostMapping("/users/{id}/address")
  public ResponseEntity<?> upsertAddr(@PathVariable Long id, @RequestBody UserAddress addr) {
    try {
      UserAddress saved = svc.createOrUpdateAddress(id, addr);
      return ResponseEntity.status(201).body(saved);
    } catch (java.util.NoSuchElementException e) {
      return ResponseEntity.status(404).body(java.util.Map.of("error", "user_not_found"));
    }
  }

  @GetMapping("/users/{id}/address")
  public ResponseEntity<?> getAddr(@PathVariable Long id) {
    return svc.getAddress(id)
      .<ResponseEntity<?>>map(ResponseEntity::ok)
      .orElse(ResponseEntity.status(404).body(java.util.Map.of("error", "not_found")));
  }
}
