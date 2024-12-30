package models

import "time"

type User struct {
	UserID       uint      `gorm:"primaryKey;column:UserID" json:"id"`
	Username     string    `gorm:"column:Username;not null" json:"username"`
	PasswordHash string    `gorm:"column:PasswordHash" json:"-"`
	Email        string    `gorm:"column:Email;not null" json:"email"`
	UserRole     string    `gorm:"column:UserRole;not null" json:"user_role"`
	DateCreated  time.Time `gorm:"column:DateCreated;autoCreateTime" json:"date_created"`
}

func (User) TableName() string {
	return "Users"
}
