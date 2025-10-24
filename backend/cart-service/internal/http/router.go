package http

import (
	"cart-service/internal/cart"

	"github.com/gin-gonic/gin"
)

func SetupRouter(s *cart.Service) *gin.Engine {
	r := gin.Default()

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	r.GET("/cart/:user_id", GetCartHandler(s))
	r.POST("/cart/:user_id/items", AddItemHandler(s))
	r.PUT("/cart/:user_id/items/:item_id", UpdateQtyHandler(s))
	r.DELETE("/cart/:user_id", ClearCartHandler(s))

	return r
}
