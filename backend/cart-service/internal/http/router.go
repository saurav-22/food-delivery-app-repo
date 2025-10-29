package http

import (
	"cart-service/internal/cart"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"  // Add this import
)

func SetupRouter(s *cart.Service) *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"*"},
		AllowCredentials: false,
		MaxAge: 12 * time.Hour,
	}))

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	r.GET("/cart/:user_id", GetCartHandler(s))
	r.POST("/cart/:user_id/items", AddItemHandler(s))
	r.PUT("/cart/:user_id/items/:item_id", UpdateQtyHandler(s))
	r.DELETE("/cart/:user_id", ClearCartHandler(s))

	return r
}