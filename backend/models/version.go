// backend/models/version.go
package models

import "gorm.io/gorm"

type Version struct {
	gorm.Model
	DocumentID uint   `gorm:"not null" json:"documentId"`
	Title      string `gorm:"size:255;not null" json:"title"`
	Content    string `gorm:"type:text" json:"content"`
	AuthorID   uint   `gorm:"not null" json:"authorId"` // The user who made this specific change
	Author     User   `gorm:"foreignKey:AuthorID" json:"author"`
}
