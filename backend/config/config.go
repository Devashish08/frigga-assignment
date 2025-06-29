package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadConfig loads all environment variables from .env file
func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}
}

// GetJWTSecret returns the JWT secret key from environment variables
func GetJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET environment variable not set")
	}
	return secret
}

// GetDatabaseURL returns the database connection string
func GetDatabaseURL() string {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}
	return dsn
}
