package http

import (
	"cart-service/internal/cart"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func parseID(c *gin.Context, name string) (int64, bool) {
	idStr := c.Param(name)
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": name + "_invalid"})
		return 0, false
	}
	return id, true
}

func GetCartHandler(s *cart.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := parseID(c, "user_id")
		if !ok {
			return
		}
		out, err := s.ViewCart(context.Background(), userID)
		if err != nil {
			c.JSON(500, gin.H{"error": "view_failed"})
			return
		}
		c.JSON(200, out)
	}
}

type addItemPayload struct {
	RestaurantSlug    string `json:"restaurant_slug"`
	MenuItemID        int64  `json:"menu_item_id"`
	PriceSnapshotPaise int   `json:"price_paise"`
	Qty               int    `json:"qty"`
}

func AddItemHandler(s *cart.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := parseID(c, "user_id")
		if !ok {
			return
		}
		var body addItemPayload
		if err := c.BindJSON(&body); err != nil {
			c.JSON(400, gin.H{"error": "invalid_json"})
			return
		}
		out, err := s.AddItem(context.Background(), userID, body.RestaurantSlug, body.MenuItemID, body.PriceSnapshotPaise, body.Qty)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, out)
	}
}

func UpdateQtyHandler(s *cart.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, ok := parseID(c, "user_id") // userID not needed for logic, but ensure valid numeric
		if !ok {
			return
		}
		itemID, ok := parseID(c, "item_id")
		if !ok {
			return
		}
		var body struct {
			Qty int `json:"qty"`
		}
		if err := c.BindJSON(&body); err != nil || body.Qty <= 0 {
			c.JSON(400, gin.H{"error": "invalid_qty"})
			return
		}
		if _, err := s.UpdateQty(context.Background(), itemID, body.Qty); err != nil {
			c.JSON(500, gin.H{"error": "update_failed"})
			return
		}
		c.Status(204)
	}
}

func ClearCartHandler(s *cart.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, ok := parseID(c, "user_id")
			if !ok {
				return
			}
		if err := s.ClearCart(context.Background(), userID); err != nil {
			c.JSON(500, gin.H{"error": "clear_failed"})
			return
		}
		c.Status(204)
	}
}
