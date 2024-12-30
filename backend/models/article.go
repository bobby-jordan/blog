package models

import "time"

type Article struct {
	ID         uint       `gorm:"primaryKey;column:ID"`
	Title      string     `gorm:"column:Title;not null" json:"title"`
	Image      string     `gorm:"column:Image" json:"image"`
	AuthorID   uint       `gorm:"column:AuthorID" json:"author_id"`
	Author     User       `gorm:"foreignKey:AuthorID;references:UserID" json:"author"` // Map to UserID
	Subtitles  string     `gorm:"column:Subtitles" json:"subtitles"`
	CreatedAt  time.Time  `gorm:"column:CreatedAt;autoCreateTime" json:"created_at"`
	EditedAt   *time.Time `gorm:"column:EditedAt;autoUpdateTime" json:"edited_at,omitempty"`
	IsArchived bool       `gorm:"column:IsArchived;default:false" json:"is_archived"`
}

func (Article) TableName() string {
	return "Articles"
}
