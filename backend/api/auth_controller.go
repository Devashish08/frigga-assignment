package api

import (
	"net/http"

	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var body struct {
		Name     string
		Email    string
		Password string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Name:     body.Name,
		Email:    body.Email,
		Password: string(hash),
	}

	result := config.DB.Create(&user)
	if result.Error != nil {
		// Check for unique constraint violation (duplicate email)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create user. Email may already be in use."})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}
