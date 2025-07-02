// backend/api/document_controller.go
package api

import (
	"net/http"

	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/models"
	"github.com/gin-gonic/gin"
)

// backend/api/document_controller.go

// GetDocuments retrieves all documents accessible to the authenticated user
func GetDocuments(c *gin.Context) {
	userCtx, _ := c.Get("user")
	user := userCtx.(models.User)

	// Get IDs of documents shared with the user
	var sharedDocIDs []uint
	config.DB.Model(&models.Permission{}).Where("user_id = ?", user.ID).Pluck("document_id", &sharedDocIDs)

	var documents []models.Document

	// NEW, MORE COMPLEX QUERY
	result := config.DB.Preload("Author").
		Where("author_id = ? OR is_public = ? OR id IN ?", user.ID, true, sharedDocIDs).
		Order("updated_at desc").
		Find(&documents)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve documents"})
		return
	}

	c.JSON(http.StatusOK, documents)
}

func CreateDocument(c *gin.Context) {
	// Get the user from context
	userCtx, _ := c.Get("user")
	user := userCtx.(models.User)

	// Bind request body
	var body struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		IsPublic bool   `json:"isPublic"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// Basic validation
	if body.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	// Create the document
	document := models.Document{
		Title:    body.Title,
		Content:  body.Content,
		IsPublic: body.IsPublic,
		AuthorID: user.ID,
	}

	result := config.DB.Create(&document)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create document"})
		return
	}

	// Preload the author information to return it in the response
	config.DB.Preload("Author").First(&document, document.ID)

	c.JSON(http.StatusCreated, document)
}

// backend/api/document_controller.go

// GetDocument retrieves a single document by its ID, checking permissions
func GetDocument(c *gin.Context) {
	id := c.Param("id")

	var document models.Document
	if err := config.DB.Preload("Author").First(&document, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	// THE FIX: Add permission check
	// If the document is private, we need to verify the user has access
	if !document.IsPublic {
		userCtx, exists := c.Get("user")
		// Check if the user is even logged in (for public link access)
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "You must be logged in to view this private document"})
			return
		}
		user := userCtx.(models.User)

		// Check if the logged-in user is the author
		if document.AuthorID != user.ID {
			// NEW PERMISSION CHECK
			var permission models.Permission
			err := config.DB.Where("document_id = ? AND user_id = ?", document.ID, user.ID).First(&permission).Error
			if err != nil { // No permission found
				c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view this document"})
				return
			}
		}
	}

	// If the document is public, or the user is the author, they can view it.
	c.JSON(http.StatusOK, document)
}

// UpdateDocument updates an existing document
func UpdateDocument(c *gin.Context) {
	id := c.Param("id")
	userCtx, _ := c.Get("user")
	user := userCtx.(models.User)

	var document models.Document
	if err := config.DB.First(&document, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	// NEW PERMISSION CHECK
	isAuthor := document.AuthorID == user.ID
	var hasEditPermission bool
	if !isAuthor {
		var permission models.Permission
		err := config.DB.Where("document_id = ? AND user_id = ? AND level = ?", document.ID, user.ID, models.EditPermission).First(&permission).Error
		hasEditPermission = err == nil
	}

	if !isAuthor && !hasEditPermission {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to edit this document"})
		return
	}

	var body struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		IsPublic bool   `json:"isPublic"`
	}
	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// Update the document fields
	document.Title = body.Title
	document.Content = body.Content
	document.IsPublic = body.IsPublic
	config.DB.Save(&document)

	c.JSON(http.StatusOK, document)
}
