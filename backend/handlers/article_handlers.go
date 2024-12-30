package handlers

import (
	"log"
	"net/http"
	"strconv"

	"blog/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllArticles(c *gin.Context, db *gorm.DB) {
	var articles []models.Article
	result := db.Preload("Author").Find(&articles)

	log.Printf("Query Result: %+v, RowsAffected: %d, Error: %v", articles, result.RowsAffected, result.Error)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if len(articles) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No articles found"})
		return
	}

	c.JSON(http.StatusOK, articles)
}

func GetArticleByID(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	var article models.Article

	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	c.JSON(http.StatusOK, article)
}

func CreateArticle(c *gin.Context, db *gorm.DB) {
	var article models.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		log.Printf("Request Body: %+v", c.Request.Body) // Debugging log
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if article.AuthorID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Author ID is required"})
		return
	}

	if err := db.Create(&article).Error; err != nil {
		log.Printf("Error creating article: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create article"})
		return
	}

	log.Printf("Article created successfully: %+v", article)
	c.JSON(http.StatusCreated, article)
}

func UpdateArticle(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	var article models.Article

	if err := db.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}

	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update article"})
		return
	}

	c.JSON(http.StatusOK, article)
}

func DeleteArticle(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	articleID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid article ID"})
		return
	}

	if err := db.Delete(&models.Article{}, articleID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete article"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Article deleted successfully"})
}
