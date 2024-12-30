-- Create the Blog database
CREATE DATABASE BlogDB;
GO

USE BlogDB;
GO

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    UserRole NVARCHAR(10) CHECK (UserRole IN ('Admin', 'Standard')) NOT NULL,
    DateCreated DATETIME DEFAULT GETDATE()
);

CREATE TABLE Articles (
    ArticleID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Image NVARCHAR(MAX),
    AuthorID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Subtitles NVARCHAR(255),
    DateCreated DATETIME DEFAULT GETDATE() NOT NULL,
    DateEdited DATETIME,
    IsArchived BIT DEFAULT 0 NOT NULL,
    CONSTRAINT chk_Date CHECK (DateEdited IS NULL OR DateEdited >= DateCreated)
);

-- Create indexes for optimized searches
CREATE INDEX IDX_Articles_Title ON Articles (Title);
CREATE INDEX IDX_Articles_DateCreated ON Articles (DateCreated);

INSERT INTO Users (Username, PasswordHash, Email, UserRole)
VALUES
('admin', 'hashedpassword123', 'admin@example.com', 'Admin'),
('standarduser', 'hashedpassword456', 'user@example.com', 'Standard');

INSERT INTO Articles (Title, Image, AuthorID, Subtitles)
VALUES
('First Blog Post', 'image1.jpg', 1, 'Introduction to the blog'),
('React Basics', 'image2.jpg', 2, 'Learn the basics of React.js');
