"""Main cleaning orchestration for Gmail Smart Cleaner."""
import time
from typing import List, Dict, Any, Optional

from tqdm import tqdm

from src.gmail_client import GmailClient
from src.filters import EmailFilter, CompositeFilter
from src.utils import format_email_preview, format_size
from config.settings import settings


class GmailCleaner:
    """Orchestrates Gmail cleaning operations."""

    def __init__(
        self,
        gmail_client: Optional[GmailClient] = None,
        batch_size: Optional[int] = None,
        rate_limit: Optional[int] = None
    ):
        """
        Initialize Gmail cleaner.
        
        Args:
            gmail_client: GmailClient instance (creates new if not provided)
            batch_size: Batch size for operations
            rate_limit: Rate limit in requests per second
        """
        self.client = gmail_client or GmailClient()
        self.batch_size = batch_size or settings.default_batch_size
        self.rate_limit = rate_limit or settings.rate_limit

    def find_emails(
        self,
        email_filter: Optional[EmailFilter] = None,
        max_results: int = 500
    ) -> List[Dict[str, Any]]:
        """
        Find emails matching filter criteria.
        
        Args:
            email_filter: EmailFilter instance
            max_results: Maximum number of emails to find
            
        Returns:
            List of matching email metadata
        """
        query = ""
        
        if email_filter:
            if isinstance(email_filter, CompositeFilter):
                query = email_filter.to_query()
            else:
                query = email_filter.to_query()
        
        print(f"Searching for emails with query: '{query}'")
        emails = self.client.get_emails(query=query, max_results=max_results)
        
        # Apply client-side filtering for accuracy
        if email_filter:
            emails = [email for email in emails if email_filter.matches(email)]
        
        return emails

    def clean_emails(
        self,
        email_filter: Optional[EmailFilter] = None,
        max_emails: int = 500,
        dry_run: bool = True,
        permanent: bool = False
    ) -> Dict[str, Any]:
        """
        Clean emails matching filter criteria.
        
        Args:
            email_filter: EmailFilter instance
            max_emails: Maximum number of emails to process
            dry_run: If True, only preview without deleting
            permanent: If True, permanently delete (otherwise move to trash)
            
        Returns:
            Dictionary with cleaning results
        """
        # Find matching emails
        emails = self.find_emails(email_filter, max_results=max_emails)
        
        results = {
            "found": len(emails),
            "processed": 0,
            "total_size": sum(email.get("size", 0) for email in emails),
            "dry_run": dry_run,
            "permanent": permanent
        }
        
        if not emails:
            print("No emails found matching the criteria.")
            return results
        
        # Display summary
        print(f"\nFound {len(emails)} emails")
        print(f"Total size: {format_size(results['total_size'])}")
        
        if dry_run:
            print("\n=== DRY RUN MODE - No emails will be deleted ===\n")
            print("Preview of emails to be deleted:")
            
            # Show preview of first 10 emails
            for i, email in enumerate(emails[:10], 1):
                print(f"{i}. {format_email_preview(email)}")
            
            if len(emails) > 10:
                print(f"... and {len(emails) - 10} more emails")
            
            return results
        
        # Confirm deletion
        action = "permanently deleted" if permanent else "moved to trash"
        print(f"\nThis will {action} {len(emails)} emails.")
        
        # Process emails in batches
        message_ids = [email["id"] for email in emails]
        processed = 0
        
        print(f"\nProcessing {len(emails)} emails...")
        
        with tqdm(total=len(message_ids), desc="Cleaning emails") as pbar:
            for i in range(0, len(message_ids), self.batch_size):
                batch = message_ids[i:i + self.batch_size]
                
                if permanent:
                    count = self.client.delete_emails(batch)
                else:
                    count = self.client.trash_emails(batch)
                
                processed += count
                pbar.update(len(batch))
                
                # Rate limiting
                time.sleep(1.0 / self.rate_limit)
        
        results["processed"] = processed
        
        print(f"\n✓ Successfully {action} {processed} emails")
        print(f"✓ Freed up approximately {format_size(results['total_size'])}")
        
        return results

    def preview_labels(self) -> List[Dict[str, str]]:
        """
        Get list of available Gmail labels.
        
        Returns:
            List of label dictionaries
        """
        labels = self.client.get_labels()
        
        print("\nAvailable Gmail labels:")
        print("-" * 50)
        
        for label in labels:
            print(f"  • {label['name']} (ID: {label['id']})")
        
        return labels

    def get_statistics(self, email_filter: Optional[EmailFilter] = None) -> Dict[str, Any]:
        """
        Get statistics about emails matching filter.
        
        Args:
            email_filter: EmailFilter instance
            
        Returns:
            Dictionary with statistics
        """
        emails = self.find_emails(email_filter, max_results=1000)
        
        total_size = sum(email.get("size", 0) for email in emails)
        
        # Count by label
        label_counts = {}
        for email in emails:
            for label in email.get("labels", []):
                label_counts[label] = label_counts.get(label, 0) + 1
        
        # Count by sender domain
        sender_domains = {}
        for email in emails:
            sender = email.get("from", "")
            if "@" in sender:
                domain = sender.split("@")[-1].split(">")[0].strip()
                sender_domains[domain] = sender_domains.get(domain, 0) + 1
        
        stats = {
            "total_emails": len(emails),
            "total_size": total_size,
            "total_size_formatted": format_size(total_size),
            "label_distribution": dict(sorted(label_counts.items(), key=lambda x: x[1], reverse=True)[:10]),
            "top_sender_domains": dict(sorted(sender_domains.items(), key=lambda x: x[1], reverse=True)[:10])
        }
        
        # Display statistics
        print("\n=== Email Statistics ===")
        print(f"Total emails: {stats['total_emails']}")
        print(f"Total size: {stats['total_size_formatted']}")
        
        if stats['label_distribution']:
            print("\nTop labels:")
            for label, count in list(stats['label_distribution'].items())[:5]:
                print(f"  • {label}: {count}")
        
        if stats['top_sender_domains']:
            print("\nTop sender domains:")
            for domain, count in list(stats['top_sender_domains'].items())[:5]:
                print(f"  • {domain}: {count}")
        
        return stats
