// backend/main.go
package main

import (
	"net/http"

	"github.com/Devashish08/frigga-assigment/backend/api"
	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/middleware"
	"github.com/Devashish08/frigga-assigment/backend/models"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func init() {
	config.LoadConfig()
	config.ConnectDB()
}

func main() {
	err := config.DB.AutoMigrate(&models.User{})
	if err != nil {
		panic("Failed to migrate database")
	}

	router := gin.Default()
	router.Use(CORSMiddleware())
	authRoutes := router.Group("/api/auth")
	{
		authRoutes.POST("/register", api.Register)
		authRoutes.POST("/login", api.Login)
	}
	apiRoutes := router.Group("/api")
	{
		apiRoutes.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "ok",
				"message": "Go backend is running!",
			})
		})

		protected := apiRoutes.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", func(c *gin.Context) {
				// Get the user from the context
				user, _ := c.Get("user")
				c.JSON(http.StatusOK, gin.H{"message": "This is a protected route", "user": user})
			})
		}
	}
	router.Run(":8080")
}
