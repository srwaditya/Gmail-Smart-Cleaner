"""Tests for utility functions."""
import pytest
from datetime import datetime, timedelta

from src.utils import (
    parse_date,
    get_date_days_ago,
    format_size,
    parse_size,
    format_email_preview
)


class TestDateFunctions:
    """Test date-related utility functions."""

    def test_parse_date_valid_formats(self):
        """Test parsing valid date formats."""
        assert parse_date("2024-01-15") == datetime(2024, 1, 15)
        assert parse_date("2024/01/15") == datetime(2024, 1, 15)
        assert parse_date("15-01-2024") == datetime(2024, 1, 15)
        assert parse_date("15/01/2024") == datetime(2024, 1, 15)

    def test_parse_date_invalid(self):
        """Test parsing invalid date."""
        assert parse_date("invalid") is None
        assert parse_date("2024-13-01") is None

    def test_get_date_days_ago(self):
        """Test getting date N days ago."""
        result = get_date_days_ago(7)
        expected = datetime.now() - timedelta(days=7)
        assert abs((result - expected).total_seconds()) < 1


class TestSizeFunctions:
    """Test size-related utility functions."""

    def test_format_size(self):
        """Test formatting size in bytes."""
        assert format_size(0) == "0.00 B"
        assert format_size(1024) == "1.00 KB"
        assert format_size(1024 * 1024) == "1.00 MB"
        assert format_size(5 * 1024 * 1024) == "5.00 MB"
        assert format_size(1024 * 1024 * 1024) == "1.00 GB"

    def test_parse_size(self):
        """Test parsing size strings."""
        assert parse_size("1024") == 1024
        assert parse_size("1KB") == 1024
        assert parse_size("5MB") == 5 * 1024 * 1024
        assert parse_size("1.5GB") == int(1.5 * 1024 * 1024 * 1024)
        assert parse_size("1024B") == 1024

    def test_parse_size_invalid(self):
        """Test parsing invalid size."""
        with pytest.raises(ValueError):
            parse_size("invalid")
        with pytest.raises(ValueError):
            parse_size("XYZ")


class TestEmailPreview:
    """Test email preview formatting."""

    def test_format_email_preview(self):
        """Test formatting email preview."""
        email = {
            "subject": "Test Email",
            "from": "test@example.com",
            "date": "2024-01-15",
            "size": 1024
        }
        
        preview = format_email_preview(email)
        assert "test@example.com" in preview
        assert "Test Email" in preview
        assert "2024-01-15" in preview
        assert "1.00 KB" in preview

    def test_format_email_preview_missing_fields(self):
        """Test formatting email with missing fields."""
        email = {}
        preview = format_email_preview(email)
        assert "Unknown" in preview
        assert "No Subject" in preview
