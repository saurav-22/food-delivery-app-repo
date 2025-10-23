package com.foodapp.user.repo;

import com.foodapp.user.entity.UserAddress;
import com.foodapp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
  Optional<UserAddress> findFirstByUserOrderByIdAsc(User user);
}
