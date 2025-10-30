package main

import (
	"log"
	"os"

	"cart-service/internal/cart"
	httpdelivery "cart-service/internal/http"
	"cart-service/internal/db"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("SERVICE_PORT")
	if port == "" {
		port = "8084"
	}

	// connect to DB
	if err := db.Connect(); err != nil {
		log.Fatalf("db connect failed: %v", err)
	}

	// run migrations by default; allow disabling via RUN_MIGRATIONS=false
	if os.Getenv("RUN_MIGRATIONS") != "false" {
		if err := db.RunMigrations(); err != nil {
			log.Fatalf("db migrations failed: %v", err)
		}
	}

	svc := cart.NewService()

	r := httpdelivery.SetupRouter(svc)

	// fallback health (router already sets one but keep a simple check)
	/* r.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	}) */

	log.Println("cart-service listening on :" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
