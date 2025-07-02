// backend/models/permission.go
package models

import "gorm.io/gorm"

type PermissionLevel string

const (
	ViewPermission PermissionLevel = "VIEW"
	EditPermission PermissionLevel = "EDIT"
)

type Permission struct {
	gorm.Model
	UserID     uint            `gorm:"not null" json:"userId"`
	DocumentID uint            `gorm:"not null" json:"documentId"`
	Level      PermissionLevel `gorm:"type:varchar(10);not null" json:"level"`

	// Add a unique constraint to prevent duplicate permissions
	// A user can only have one permission level per document
	_ struct{} `gorm:"uniqueIndex:idx_user_document,fields:user_id,document_id"`
}
