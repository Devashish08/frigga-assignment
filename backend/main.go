// backend/main.go
package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/Devashish08/frigga-assigment/backend/api"
	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/middleware"
	"github.com/Devashish08/frigga-assigment/backend/models"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Allow multiple origins for development and production
		allowedOrigins := []string{
			"http://localhost:3000",
			"https://frigga-assignment.vercel.app", // Update with your actual Vercel URL
		}

		origin := c.Request.Header.Get("Origin")
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}

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
	err := config.DB.AutoMigrate(&models.User{}, &models.Document{}, &models.Permission{}, &models.Version{})
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
				user, _ := c.Get("user")
				c.JSON(http.StatusOK, gin.H{"message": "This is a protected route", "user": user})
			})
			protected.GET("/documents", api.GetDocuments)
			protected.POST("/documents", api.CreateDocument)
			protected.GET("/documents/search", api.SearchDocuments) // Add search route
			protected.GET("/documents/:id", api.GetDocument)
			protected.PUT("/documents/:id", api.UpdateDocument)

			protected.GET("/users/search", api.SearchUsers)

			docPermissionRoutes := protected.Group("/documents/:id")
			docPermissionRoutes.Use(func(c *gin.Context) {
				id, err := strconv.ParseUint(c.Param("id"), 10, 32)
				if err != nil {
					c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
					return
				}
				c.Set("doc_id_as_uint", uint(id))
				c.Next()
			})
			{
				docPermissionRoutes.POST("/permissions", api.AddPermission)
				docPermissionRoutes.GET("/versions", api.GetDocumentVersions)
			}
		}
	}

	// Get port from environment variable or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router.Run(":" + port)
}
