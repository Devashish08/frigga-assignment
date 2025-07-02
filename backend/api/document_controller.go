// backend/api/document_controller.go
package api

import (
	"net/http"

	"github.com/Devashish08/frigga-assigment/backend/config"
	"github.com/Devashish08/frigga-assigment/backend/models"
	"github.com/gin-gonic/gin"
)

func GetDocuments(c *gin.Context) {

	userCtx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	user := userCtx.(models.User)

	var documents []models.Document

	result := config.DB.Preload("Author").Where("author_id = ?", user.ID).Find(&documents)
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

func GetDocument(c *gin.Context) {
	// Get document ID from the URL parameter
	id := c.Param("id")

	var document models.Document
	// Find the document and preload its author
	result := config.DB.Preload("Author").First(&document, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	// In a later phase, we'll add permission checks here.
	// For now, any authenticated user can view any document.

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

	// Authorization check: only the author can edit
	if document.AuthorID != user.ID {
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
