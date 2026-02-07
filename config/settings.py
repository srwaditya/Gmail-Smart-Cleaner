"""Configuration settings for Gmail Smart Cleaner."""
import os
from pathlib import Path
from typing import Optional, List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Gmail API settings
    gmail_credentials_path: str = "config/credentials.json"
    token_path: str = "token.json"
    
    # Gmail API scopes
    scopes: List[str] = ["https://www.googleapis.com/auth/gmail.modify"]
    
    # Default batch size for operations
    default_batch_size: int = 100
    
    # Default dry run mode
    default_dry_run: bool = True
    
    # Rate limiting (requests per second)
    rate_limit: int = 10
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        env_file_encoding = "utf-8"


def get_settings() -> Settings:
    """Get application settings."""
    return Settings()


# Get project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Default settings instance
settings = get_settings()
