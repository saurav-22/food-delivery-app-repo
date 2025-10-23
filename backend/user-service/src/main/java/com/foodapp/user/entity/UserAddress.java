package com.foodapp.user.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_addresses")
public class UserAddress {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  private String label = "primary";
  private String street;
  private String city;
  private String pincode;
  private Double lat;
  private Double lng;
  private Boolean isDefault = true;

  @Column(name = "created_at", columnDefinition = "TIMESTAMPTZ")
  private OffsetDateTime createdAt = OffsetDateTime.now();

  @Column(name = "updated_at", columnDefinition = "TIMESTAMPTZ")
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getLabel() { return label; }
  public void setLabel(String label) { this.label = label; }
  public String getStreet() { return street; }
  public void setStreet(String street) { this.street = street; }
  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
  public String getPincode() { return pincode; }
  public void setPincode(String pincode) { this.pincode = pincode; }
  public Double getLat() { return lat; }
  public void setLat(Double lat) { this.lat = lat; }
  public Double getLng() { return lng; }
  public void setLng(Double lng) { this.lng = lng; }
  public Boolean getIsDefault() { return isDefault; }
  public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
