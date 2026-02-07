"""Gmail API client wrapper."""
import os
import pickle
from pathlib import Path
from typing import Optional, List, Dict, Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from config.settings import settings


class GmailClient:
    """Gmail API client for email operations."""

    def __init__(self, credentials_path: Optional[str] = None, token_path: Optional[str] = None):
        """
        Initialize Gmail client.
        
        Args:
            credentials_path: Path to OAuth credentials file
            token_path: Path to save/load token
        """
        self.credentials_path = credentials_path or settings.gmail_credentials_path
        self.token_path = token_path or settings.token_path
        self.scopes = settings.scopes
        self.service = None
        self._authenticate()

    def _authenticate(self):
        """Authenticate with Gmail API using OAuth 2.0."""
        creds = None
        
        # Load existing token if available
        if os.path.exists(self.token_path):
            with open(self.token_path, "rb") as token:
                creds = pickle.load(token)
        
        # If no valid credentials, authenticate
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(self.credentials_path):
                    raise FileNotFoundError(
                        f"Credentials file not found at {self.credentials_path}. "
                        "Please download OAuth credentials from Google Cloud Console."
                    )
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, self.scopes
                )
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next run
            with open(self.token_path, "wb") as token:
                pickle.dump(creds, token)
        
        # Build Gmail service
        self.service = build("gmail", "v1", credentials=creds)

    def get_emails(
        self,
        query: str = "",
        max_results: int = 500,
        include_spam_trash: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Fetch emails matching query.
        
        Args:
            query: Gmail search query
            max_results: Maximum number of emails to fetch
            include_spam_trash: Include spam and trash
            
        Returns:
            List of email metadata dictionaries
        """
        try:
            emails = []
            page_token = None
            
            while len(emails) < max_results:
                results = self.service.users().messages().list(
                    userId="me",
                    q=query,
                    maxResults=min(500, max_results - len(emails)),
                    pageToken=page_token,
                    includeSpamTrash=include_spam_trash
                ).execute()
                
                messages = results.get("messages", [])
                
                if not messages:
                    break
                
                # Fetch full message details
                for msg in messages:
                    email_data = self._get_email_metadata(msg["id"])
                    if email_data:
                        emails.append(email_data)
                
                page_token = results.get("nextPageToken")
                if not page_token:
                    break
            
            return emails
        
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []

    def _get_email_metadata(self, message_id: str) -> Optional[Dict[str, Any]]:
        """
        Get metadata for a single email.
        
        Args:
            message_id: Email message ID
            
        Returns:
            Email metadata dictionary
        """
        try:
            message = self.service.users().messages().get(
                userId="me",
                id=message_id,
                format="metadata",
                metadataHeaders=["From", "To", "Subject", "Date"]
            ).execute()
            
            headers = {
                header["name"].lower(): header["value"]
                for header in message.get("payload", {}).get("headers", [])
            }
            
            return {
                "id": message["id"],
                "thread_id": message.get("threadId"),
                "labels": message.get("labelIds", []),
                "from": headers.get("from", "Unknown"),
                "to": headers.get("to", "Unknown"),
                "subject": headers.get("subject", "No Subject"),
                "date": headers.get("date", "Unknown Date"),
                "size": int(message.get("sizeEstimate", 0)),
                "snippet": message.get("snippet", ""),
            }
        
        except HttpError as error:
            print(f"Error fetching email {message_id}: {error}")
            return None

    def trash_emails(self, message_ids: List[str]) -> int:
        """
        Move emails to trash.
        
        Args:
            message_ids: List of message IDs to trash
            
        Returns:
            Number of emails trashed
        """
        trashed_count = 0
        
        for message_id in message_ids:
            try:
                self.service.users().messages().trash(
                    userId="me",
                    id=message_id
                ).execute()
                trashed_count += 1
            except HttpError as error:
                print(f"Error trashing email {message_id}: {error}")
        
        return trashed_count

    def delete_emails(self, message_ids: List[str]) -> int:
        """
        Permanently delete emails.
        
        Args:
            message_ids: List of message IDs to delete
            
        Returns:
            Number of emails deleted
        """
        deleted_count = 0
        
        for message_id in message_ids:
            try:
                self.service.users().messages().delete(
                    userId="me",
                    id=message_id
                ).execute()
                deleted_count += 1
            except HttpError as error:
                print(f"Error deleting email {message_id}: {error}")
        
        return deleted_count

    def get_labels(self) -> List[Dict[str, str]]:
        """
        Get all Gmail labels.
        
        Returns:
            List of label dictionaries
        """
        try:
            results = self.service.users().labels().list(userId="me").execute()
            labels = results.get("labels", [])
            return [{"id": label["id"], "name": label["name"]} for label in labels]
        except HttpError as error:
            print(f"Error fetching labels: {error}")
            return []
