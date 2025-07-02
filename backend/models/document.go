// backend/models/document.go
package models

import "gorm.io/gorm"

type Document struct {
	gorm.Model
	Title    string `gorm:"size:255;not null" json:"title"`
	Content  string `gorm:"type:text" json:"content"`
	IsPublic bool   `gorm:"default:false;not null" json:"isPublic"` // <-- ADD THIS LINE
	AuthorID uint   `gorm:"not null" json:"authorId"`
	Author   User   `gorm:"foreignKey:AuthorID" json:"author"`
}
