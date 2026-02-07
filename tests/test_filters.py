"""Tests for email filters."""
import pytest
from datetime import datetime, timedelta

from src.filters import (
    DateFilter,
    SenderFilter,
    LabelFilter,
    SizeFilter,
    SubjectFilter,
    ReadStatusFilter,
    HasAttachmentFilter,
    CompositeFilter
)


class TestDateFilter:
    """Test DateFilter class."""

    def test_to_query_days_old(self):
        """Test query generation for days old."""
        filter = DateFilter(days_old=30)
        assert filter.to_query() == "older_than:30d"

    def test_to_query_before_date(self):
        """Test query generation for before date."""
        date = datetime(2024, 1, 15)
        filter = DateFilter(before_date=date)
        assert filter.to_query() == "before:2024/01/15"


class TestSenderFilter:
    """Test SenderFilter class."""

    def test_to_query(self):
        """Test query generation."""
        filter = SenderFilter("test@example.com")
        assert filter.to_query() == "from:test@example.com"

    def test_matches_exact(self):
        """Test matching exact sender."""
        filter = SenderFilter("test@example.com")
        email = {"from": "test@example.com"}
        assert filter.matches(email) is True

    def test_matches_wildcard(self):
        """Test matching with wildcard."""
        filter = SenderFilter("*@example.com")
        email1 = {"from": "test@example.com"}
        email2 = {"from": "other@example.com"}
        email3 = {"from": "test@other.com"}
        
        assert filter.matches(email1) is True
        assert filter.matches(email2) is True
        assert filter.matches(email3) is False


class TestLabelFilter:
    """Test LabelFilter class."""

    def test_to_query_common_labels(self):
        """Test query generation for common labels."""
        assert LabelFilter("promotions").to_query() == "category:promotions"
        assert LabelFilter("spam").to_query() == "in:spam"
        assert LabelFilter("inbox").to_query() == "in:inbox"

    def test_to_query_custom_label(self):
        """Test query generation for custom label."""
        filter = LabelFilter("CustomLabel")
        assert filter.to_query() == "label:CustomLabel"

    def test_matches(self):
        """Test label matching."""
        filter = LabelFilter("INBOX")
        email = {"labels": ["INBOX", "UNREAD"]}
        assert filter.matches(email) is True


class TestSizeFilter:
    """Test SizeFilter class."""

    def test_to_query_min_size(self):
        """Test query generation for minimum size."""
        filter = SizeFilter(min_size=1024)
        assert filter.to_query() == "larger:1024"

    def test_to_query_max_size(self):
        """Test query generation for maximum size."""
        filter = SizeFilter(max_size=2048)
        assert filter.to_query() == "smaller:2048"

    def test_to_query_both(self):
        """Test query generation for both min and max."""
        filter = SizeFilter(min_size=1024, max_size=2048)
        query = filter.to_query()
        assert "larger:1024" in query
        assert "smaller:2048" in query

    def test_matches(self):
        """Test size matching."""
        filter = SizeFilter(min_size=1024, max_size=2048)
        
        assert filter.matches({"size": 1500}) is True
        assert filter.matches({"size": 500}) is False
        assert filter.matches({"size": 3000}) is False


class TestSubjectFilter:
    """Test SubjectFilter class."""

    def test_to_query(self):
        """Test query generation."""
        filter = SubjectFilter("Newsletter")
        assert filter.to_query() == "subject:Newsletter"

    def test_matches(self):
        """Test subject matching."""
        filter = SubjectFilter("*Newsletter*")
        
        assert filter.matches({"subject": "Weekly Newsletter"}) is True
        assert filter.matches({"subject": "Other Email"}) is False


class TestReadStatusFilter:
    """Test ReadStatusFilter class."""

    def test_to_query_read(self):
        """Test query generation for read emails."""
        filter = ReadStatusFilter(is_read=True)
        assert filter.to_query() == "is:read"

    def test_to_query_unread(self):
        """Test query generation for unread emails."""
        filter = ReadStatusFilter(is_read=False)
        assert filter.to_query() == "is:unread"

    def test_matches_read(self):
        """Test matching read emails."""
        filter = ReadStatusFilter(is_read=True)
        assert filter.matches({"labels": ["INBOX"]}) is True
        assert filter.matches({"labels": ["INBOX", "UNREAD"]}) is False


class TestHasAttachmentFilter:
    """Test HasAttachmentFilter class."""

    def test_to_query_has_attachment(self):
        """Test query generation for has attachment."""
        filter = HasAttachmentFilter(has_attachment=True)
        assert filter.to_query() == "has:attachment"

    def test_to_query_no_attachment(self):
        """Test query generation for no attachment."""
        filter = HasAttachmentFilter(has_attachment=False)
        assert filter.to_query() == "-has:attachment"


class TestCompositeFilter:
    """Test CompositeFilter class."""

    def test_and_filter(self):
        """Test AND composite filter."""
        filters = [
            DateFilter(days_old=30),
            LabelFilter("promotions")
        ]
        composite = CompositeFilter(filters, operator="AND")
        query = composite.to_query()
        
        assert "older_than:30d" in query
        assert "category:promotions" in query

    def test_or_filter(self):
        """Test OR composite filter."""
        filters = [
            LabelFilter("promotions"),
            LabelFilter("social")
        ]
        composite = CompositeFilter(filters, operator="OR")
        query = composite.to_query()
        
        assert "OR" in query
        assert "category:promotions" in query
        assert "category:social" in query
