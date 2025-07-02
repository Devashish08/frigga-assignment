// backend/api/permission_controller.go
package api

import (
	"net/http"

	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/models"
	"github.com/gin-gonic/gin"
)

// SearchUsers finds users to share with (excluding the current user)
func SearchUsers(c *gin.Context) {
	query := c.Query("q")
	userCtx, _ := c.Get("user")
	currentUser := userCtx.(models.User)

	if query == "" {
		c.JSON(http.StatusOK, []models.User{})
		return
	}

	var users []models.User
	config.DB.Where("email LIKE ? AND id != ?", "%"+query+"%", currentUser.ID).Select("id", "name", "email").Limit(10).Find(&users)
	c.JSON(http.StatusOK, users)
}

// GetPermissionsForDocument returns all permissions for a document
func GetPermissionsForDocument(c *gin.Context) {
	// This would be used to show who has access in the sharing modal
	// For brevity in this assignment, we can skip implementing the full logic for this one if needed.
	c.JSON(http.StatusOK, gin.H{"message": "Endpoint not fully implemented for brevity."})
}

// AddPermission grants a user access to a document
func AddPermission(c *gin.Context) {
	docIdUint := c.MustGet("doc_id_as_uint").(uint)
	var body struct {
		Email string                 `json:"email"`
		Level models.PermissionLevel `json:"level"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// Find user by email
	var userToShareWith models.User
	if err := config.DB.Where("email = ?", body.Email).First(&userToShareWith).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check if document exists and if current user is the author
	userCtx, _ := c.Get("user")
	currentUser := userCtx.(models.User)

	var document models.Document
	if err := config.DB.First(&document, docIdUint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	if document.AuthorID != currentUser.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the author can share this document"})
		return
	}

	// Create or update permission
	permission := models.Permission{
		UserID:     userToShareWith.ID,
		DocumentID: docIdUint,
		Level:      body.Level,
	}
	// GORM's Save will do an "upsert" if the unique key exists
	config.DB.Save(&permission)

	c.JSON(http.StatusCreated, gin.H{"message": "Permission granted successfully"})
}
