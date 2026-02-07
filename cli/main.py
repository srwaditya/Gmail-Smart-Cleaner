#!/usr/bin/env python3
"""Command-line interface for Gmail Smart Cleaner."""
import sys
import click

from src.gmail_client import GmailClient
from src.cleaner import GmailCleaner
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
from src.utils import parse_size


@click.group()
@click.version_option(version="0.1.0")
def cli():
    """Gmail Smart Cleaner - Clean up your Gmail inbox efficiently."""
    pass


@cli.command()
@click.option("--older-than", type=int, help="Delete emails older than N days")
@click.option("--from", "sender", help="Filter by sender (supports wildcards: *@domain.com)")
@click.option("--label", help="Filter by Gmail label (e.g., Promotions, Social)")
@click.option("--subject", help="Filter by subject (supports wildcards)")
@click.option("--larger-than", help="Filter emails larger than size (e.g., 5MB)")
@click.option("--smaller-than", help="Filter emails smaller than size (e.g., 1KB)")
@click.option("--read/--unread", default=None, help="Filter by read status")
@click.option("--has-attachment/--no-attachment", default=None, help="Filter by attachment presence")
@click.option("--max-emails", type=int, default=500, help="Maximum number of emails to process")
@click.option("--dry-run/--no-dry-run", default=True, help="Preview without deleting (default: true)")
@click.option("--permanent", is_flag=True, help="Permanently delete (default: move to trash)")
@click.option("--yes", "-y", is_flag=True, help="Skip confirmation prompt")
def clean(
    older_than,
    sender,
    label,
    subject,
    larger_than,
    smaller_than,
    read,
    has_attachment,
    max_emails,
    dry_run,
    permanent,
    yes
):
    """Clean emails based on specified filters."""
    try:
        # Build filters
        filters = []
        
        if older_than:
            filters.append(DateFilter(days_old=older_than))
            click.echo(f"📅 Filtering emails older than {older_than} days")
        
        if sender:
            filters.append(SenderFilter(sender))
            click.echo(f"👤 Filtering emails from: {sender}")
        
        if label:
            filters.append(LabelFilter(label))
            click.echo(f"🏷️  Filtering emails with label: {label}")
        
        if subject:
            filters.append(SubjectFilter(subject))
            click.echo(f"📧 Filtering emails with subject: {subject}")
        
        if larger_than:
            size = parse_size(larger_than)
            filters.append(SizeFilter(min_size=size))
            click.echo(f"📊 Filtering emails larger than: {larger_than}")
        
        if smaller_than:
            size = parse_size(smaller_than)
            filters.append(SizeFilter(max_size=size))
            click.echo(f"📊 Filtering emails smaller than: {smaller_than}")
        
        if read is not None:
            filters.append(ReadStatusFilter(is_read=read))
            status = "read" if read else "unread"
            click.echo(f"✉️  Filtering {status} emails")
        
        if has_attachment is not None:
            filters.append(HasAttachmentFilter(has_attachment=has_attachment))
            status = "with" if has_attachment else "without"
            click.echo(f"📎 Filtering emails {status} attachments")
        
        # Create composite filter
        email_filter = None
        if filters:
            if len(filters) == 1:
                email_filter = filters[0]
            else:
                email_filter = CompositeFilter(filters, operator="AND")
        
        # Initialize cleaner
        click.echo("\n🔐 Authenticating with Gmail...")
        cleaner = GmailCleaner()
        
        # Confirm if not dry run and not auto-confirmed
        if not dry_run and not yes and not permanent:
            if not click.confirm("\n⚠️  This will move emails to trash. Continue?"):
                click.echo("Operation cancelled.")
                return
        
        if not dry_run and permanent and not yes:
            if not click.confirm("\n⚠️  This will PERMANENTLY DELETE emails. Are you sure?"):
                click.echo("Operation cancelled.")
                return
        
        # Clean emails
        results = cleaner.clean_emails(
            email_filter=email_filter,
            max_emails=max_emails,
            dry_run=dry_run,
            permanent=permanent
        )
        
        if dry_run:
            click.echo("\n💡 Tip: Run with --no-dry-run to actually delete emails")
        
    except FileNotFoundError as e:
        click.echo(f"\n❌ Error: {e}", err=True)
        click.echo("\n📖 Setup instructions:")
        click.echo("1. Go to https://console.cloud.google.com/")
        click.echo("2. Create a new project or select existing one")
        click.echo("3. Enable Gmail API")
        click.echo("4. Create OAuth 2.0 credentials (Desktop app)")
        click.echo("5. Download credentials and save as config/credentials.json")
        sys.exit(1)
    except Exception as e:
        click.echo(f"\n❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
def labels():
    """List all available Gmail labels."""
    try:
        click.echo("🔐 Authenticating with Gmail...")
        cleaner = GmailCleaner()
        cleaner.preview_labels()
    except Exception as e:
        click.echo(f"\n❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
@click.option("--older-than", type=int, help="Filter emails older than N days")
@click.option("--from", "sender", help="Filter by sender")
@click.option("--label", help="Filter by Gmail label")
def stats(older_than, sender, label):
    """Show statistics about emails matching filters."""
    try:
        # Build filters
        filters = []
        
        if older_than:
            filters.append(DateFilter(days_old=older_than))
        
        if sender:
            filters.append(SenderFilter(sender))
        
        if label:
            filters.append(LabelFilter(label))
        
        # Create composite filter
        email_filter = None
        if filters:
            if len(filters) == 1:
                email_filter = filters[0]
            else:
                email_filter = CompositeFilter(filters, operator="AND")
        
        # Initialize cleaner
        click.echo("🔐 Authenticating with Gmail...")
        cleaner = GmailCleaner()
        
        # Get statistics
        cleaner.get_statistics(email_filter)
        
    except Exception as e:
        click.echo(f"\n❌ Error: {e}", err=True)
        sys.exit(1)


@cli.command()
def setup():
    """Show setup instructions for Gmail API."""
    click.echo("\n📖 Gmail Smart Cleaner Setup Instructions\n")
    click.echo("=" * 60)
    click.echo("\n1. Create a Google Cloud Project:")
    click.echo("   • Go to https://console.cloud.google.com/")
    click.echo("   • Click 'Select a project' → 'New Project'")
    click.echo("   • Enter a project name and click 'Create'")
    click.echo("\n2. Enable Gmail API:")
    click.echo("   • In the Cloud Console, go to 'APIs & Services' → 'Library'")
    click.echo("   • Search for 'Gmail API'")
    click.echo("   • Click on it and press 'Enable'")
    click.echo("\n3. Create OAuth 2.0 Credentials:")
    click.echo("   • Go to 'APIs & Services' → 'Credentials'")
    click.echo("   • Click 'Create Credentials' → 'OAuth client ID'")
    click.echo("   • Choose 'Desktop app' as application type")
    click.echo("   • Enter a name and click 'Create'")
    click.echo("\n4. Download Credentials:")
    click.echo("   • Click the download button (⬇) next to your OAuth 2.0 Client ID")
    click.echo("   • Save the file as 'config/credentials.json' in this project")
    click.echo("\n5. Run Gmail Smart Cleaner:")
    click.echo("   • Run any command (e.g., 'gmail-cleaner stats')")
    click.echo("   • A browser window will open for authentication")
    click.echo("   • Grant the requested permissions")
    click.echo("   • You're all set!")
    click.echo("\n" + "=" * 60)
    click.echo("\n💡 Quick start: gmail-cleaner clean --older-than 90 --label Promotions --dry-run")


if __name__ == "__main__":
    cli()
