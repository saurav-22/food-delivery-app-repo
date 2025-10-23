package com.foodapp.user.service;

import com.foodapp.user.entity.User;
import com.foodapp.user.entity.UserAddress;
import com.foodapp.user.repo.UserAddressRepository;
import com.foodapp.user.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {
  private final UserRepository users;
  private final UserAddressRepository addresses;

  public UserService(UserRepository users, UserAddressRepository addresses) {
    this.users = users;
    this.addresses = addresses;
  }

  @Transactional
  public User createUser(User u) {
    return users.save(u);
  }

  public Optional<User> getUser(Long id) {
    return users.findById(id);
  }

  @Transactional
  public Optional<User> updateUser(Long id, User payload) {
    return users.findById(id).map(u -> {
      if (payload.getName() != null) u.setName(payload.getName());
      if (payload.getEmail() != null) u.setEmail(payload.getEmail());
      if (payload.getPhone() != null) u.setPhone(payload.getPhone());
      return users.save(u);
    });
  }

  @Transactional
  public UserAddress createOrUpdateAddress(Long userId, UserAddress addr) {
    User u = users.findById(userId).orElseThrow();
    Optional<UserAddress> existing = addresses.findFirstByUserOrderByIdAsc(u);
    if (existing.isPresent()) {
      UserAddress a = existing.get();
      if (addr.getLabel() != null) a.setLabel(addr.getLabel());
      if (addr.getStreet() != null) a.setStreet(addr.getStreet());
      if (addr.getCity() != null) a.setCity(addr.getCity());
      if (addr.getPincode() != null) a.setPincode(addr.getPincode());
      if (addr.getLat() != null) a.setLat(addr.getLat());
      if (addr.getLng() != null) a.setLng(addr.getLng());
      if (addr.getIsDefault() != null) a.setIsDefault(addr.getIsDefault());
      return addresses.save(a);
    } else {
      addr.setUser(u);
      return addresses.save(addr);
    }
  }

  public Optional<UserAddress> getAddress(Long userId) {
    return users.findById(userId).flatMap(addresses::findFirstByUserOrderByIdAsc);
  }
}
