"""Utility functions for Gmail Smart Cleaner."""
from datetime import datetime, timedelta
from typing import Optional


def parse_date(date_str: str) -> Optional[datetime]:
    """
    Parse a date string into a datetime object.
    
    Args:
        date_str: Date string in various formats (YYYY-MM-DD, etc.)
        
    Returns:
        datetime object or None if parsing fails
    """
    formats = [
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    return None


def get_date_days_ago(days: int) -> datetime:
    """
    Get datetime object for N days ago.
    
    Args:
        days: Number of days ago
        
    Returns:
        datetime object
    """
    return datetime.now() - timedelta(days=days)


def format_size(size_bytes: int) -> str:
    """
    Format size in bytes to human-readable string.
    
    Args:
        size_bytes: Size in bytes
        
    Returns:
        Formatted string (e.g., "1.5 MB")
    """
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"


def parse_size(size_str: str) -> int:
    """
    Parse size string to bytes.
    
    Args:
        size_str: Size string (e.g., "5MB", "1.5GB")
        
    Returns:
        Size in bytes
    """
    size_str = size_str.upper().strip()
    
    # Order matters - check longer units first to avoid "B" matching "KB"
    units = [
        ("TB", 1024 ** 4),
        ("GB", 1024 ** 3),
        ("MB", 1024 ** 2),
        ("KB", 1024),
        ("B", 1),
    ]
    
    for unit, multiplier in units:
        if size_str.endswith(unit):
            try:
                value = float(size_str[:-len(unit)])
                return int(value * multiplier)
            except ValueError:
                raise ValueError(f"Invalid size format: {size_str}")
    
    # Try parsing as just a number (assume bytes)
    try:
        return int(size_str)
    except ValueError:
        raise ValueError(f"Invalid size format: {size_str}")


def format_email_preview(email: dict) -> str:
    """
    Format email data for preview display.
    
    Args:
        email: Email dictionary with metadata
        
    Returns:
        Formatted preview string
    """
    subject = email.get("subject", "No Subject")
    sender = email.get("from", "Unknown")
    date = email.get("date", "Unknown Date")
    size = email.get("size", 0)
    
    return f"From: {sender} | Date: {date} | Size: {format_size(size)} | Subject: {subject}"
