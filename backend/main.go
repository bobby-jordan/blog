package main

import (
	"blog/backend/database"
	"blog/backend/handlers"
	"blog/backend/models"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer database.Close(db)

	db.AutoMigrate(&models.User{}, &models.Article{})

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // React app origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/users", func(c *gin.Context) {
		handlers.GetAllUsers(c, db)
	})
	r.GET("/users/:id", func(c *gin.Context) {
		handlers.GetUserByID(c, db)
	})
	r.POST("/users", func(c *gin.Context) {
		handlers.CreateUser(c, db)
	})
	r.PUT("/users/:id", func(c *gin.Context) {
		handlers.UpdateUser(c, db)
	})
	r.DELETE("/users/:id", func(c *gin.Context) {
		handlers.DeleteUser(c, db)
	})

	r.GET("/articles", func(c *gin.Context) {
		handlers.GetAllArticles(c, db)
	})
	r.GET("/articles/:id", func(c *gin.Context) {
		handlers.GetArticleByID(c, db)
	})
	r.POST("/articles", func(c *gin.Context) {
		handlers.CreateArticle(c, db)
	})
	r.PUT("/articles/:id", func(c *gin.Context) {
		handlers.UpdateArticle(c, db)
	})
	r.DELETE("/articles/:id", func(c *gin.Context) {
		handlers.DeleteArticle(c, db)
	})

	r.Run(":8080")
}
