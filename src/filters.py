"""Email filtering logic for Gmail Smart Cleaner."""
import re
from datetime import datetime
from typing import List, Dict, Any, Optional

from src.utils import get_date_days_ago, parse_size


class EmailFilter:
    """Base class for email filters."""

    def matches(self, email: Dict[str, Any]) -> bool:
        """
        Check if email matches filter criteria.
        
        Args:
            email: Email metadata dictionary
            
        Returns:
            True if email matches filter
        """
        raise NotImplementedError


class DateFilter(EmailFilter):
    """Filter emails by date."""

    def __init__(self, days_old: Optional[int] = None, before_date: Optional[datetime] = None):
        """
        Initialize date filter.
        
        Args:
            days_old: Filter emails older than N days
            before_date: Filter emails before specific date
        """
        self.days_old = days_old
        self.before_date = before_date or (get_date_days_ago(days_old) if days_old else None)

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches date filter."""
        if not self.before_date:
            return True
        
        # Parse email date (simplified - real implementation needs proper RFC 2822 parsing)
        email_date_str = email.get("date", "")
        
        # This is a simplified implementation
        # In production, use email.utils.parsedate_to_datetime
        try:
            from email.utils import parsedate_to_datetime
            email_date = parsedate_to_datetime(email_date_str)
            # Make both timezone-naive for comparison
            email_date_naive = email_date.replace(tzinfo=None)
            before_date_naive = self.before_date.replace(tzinfo=None) if self.before_date.tzinfo else self.before_date
            return email_date_naive < before_date_naive
        except (ValueError, TypeError):
            return False

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        if self.days_old:
            return f"older_than:{self.days_old}d"
        elif self.before_date:
            # Use date only without timezone for Gmail query
            date_naive = self.before_date.replace(tzinfo=None) if self.before_date.tzinfo else self.before_date
            date_str = date_naive.strftime("%Y/%m/%d")
            return f"before:{date_str}"
        return ""


class SenderFilter(EmailFilter):
    """Filter emails by sender."""

    def __init__(self, sender_pattern: str):
        """
        Initialize sender filter.
        
        Args:
            sender_pattern: Sender email pattern (supports wildcards)
        """
        self.sender_pattern = sender_pattern
        # Convert wildcards to regex
        regex_pattern = sender_pattern.replace("*", ".*").replace("?", ".")
        self.regex = re.compile(regex_pattern, re.IGNORECASE)

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches sender filter."""
        sender = email.get("from", "")
        return bool(self.regex.search(sender))

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        return f"from:{self.sender_pattern}"


class LabelFilter(EmailFilter):
    """Filter emails by label."""

    def __init__(self, label: str):
        """
        Initialize label filter.
        
        Args:
            label: Gmail label name
        """
        self.label = label

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches label filter."""
        labels = email.get("labels", [])
        # Handle both label IDs and names
        return self.label.upper() in [l.upper() for l in labels] or \
               f"CATEGORY_{self.label.upper()}" in labels

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        # Common label mappings
        label_map = {
            "promotions": "category:promotions",
            "social": "category:social",
            "updates": "category:updates",
            "forums": "category:forums",
            "spam": "in:spam",
            "trash": "in:trash",
            "inbox": "in:inbox",
            "sent": "in:sent",
        }
        
        label_lower = self.label.lower()
        if label_lower in label_map:
            return label_map[label_lower]
        
        return f"label:{self.label}"


class SizeFilter(EmailFilter):
    """Filter emails by size."""

    def __init__(self, min_size: Optional[int] = None, max_size: Optional[int] = None):
        """
        Initialize size filter.
        
        Args:
            min_size: Minimum size in bytes
            max_size: Maximum size in bytes
        """
        self.min_size = min_size
        self.max_size = max_size

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches size filter."""
        size = email.get("size", 0)
        
        if self.min_size and size < self.min_size:
            return False
        if self.max_size and size > self.max_size:
            return False
        
        return True

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        queries = []
        
        if self.min_size:
            # Gmail uses size in bytes
            queries.append(f"larger:{self.min_size}")
        
        if self.max_size:
            queries.append(f"smaller:{self.max_size}")
        
        return " ".join(queries)


class SubjectFilter(EmailFilter):
    """Filter emails by subject."""

    def __init__(self, subject_pattern: str):
        """
        Initialize subject filter.
        
        Args:
            subject_pattern: Subject pattern (supports wildcards)
        """
        self.subject_pattern = subject_pattern
        # Convert wildcards to regex
        regex_pattern = subject_pattern.replace("*", ".*").replace("?", ".")
        self.regex = re.compile(regex_pattern, re.IGNORECASE)

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches subject filter."""
        subject = email.get("subject", "")
        return bool(self.regex.search(subject))

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        return f"subject:{self.subject_pattern}"


class ReadStatusFilter(EmailFilter):
    """Filter emails by read/unread status."""

    def __init__(self, is_read: bool):
        """
        Initialize read status filter.
        
        Args:
            is_read: True for read emails, False for unread
        """
        self.is_read = is_read

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches read status filter."""
        labels = email.get("labels", [])
        is_unread = "UNREAD" in labels
        return (not is_unread) == self.is_read

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        return "is:read" if self.is_read else "is:unread"


class HasAttachmentFilter(EmailFilter):
    """Filter emails by attachment status."""

    def __init__(self, has_attachment: bool = True):
        """
        Initialize attachment filter.
        
        Args:
            has_attachment: True to filter emails with attachments
        """
        self.has_attachment = has_attachment

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches attachment filter."""
        # This is simplified - would need full message fetch for accurate check
        # For now, we rely on query filtering
        return True

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        return "has:attachment" if self.has_attachment else "-has:attachment"


class CompositeFilter:
    """Combine multiple filters with AND/OR logic."""

    def __init__(self, filters: List[EmailFilter], operator: str = "AND"):
        """
        Initialize composite filter.
        
        Args:
            filters: List of EmailFilter instances
            operator: "AND" or "OR"
        """
        self.filters = filters
        self.operator = operator.upper()

    def matches(self, email: Dict[str, Any]) -> bool:
        """Check if email matches composite filter."""
        if self.operator == "AND":
            return all(f.matches(email) for f in self.filters)
        elif self.operator == "OR":
            return any(f.matches(email) for f in self.filters)
        else:
            raise ValueError(f"Invalid operator: {self.operator}")

    def to_query(self) -> str:
        """Convert filter to Gmail query string."""
        queries = [f.to_query() for f in self.filters if f.to_query()]
        
        if not queries:
            return ""
        
        if self.operator == "AND":
            return " ".join(queries)
        else:  # OR
            return " OR ".join(f"({q})" for q in queries)
