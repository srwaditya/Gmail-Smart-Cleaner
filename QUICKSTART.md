# Gmail Smart Cleaner - Quick Reference

## Installation

```bash
pip install -e .
```

## Setup

1. Get credentials from Google Cloud Console
2. Save as `config/credentials.json`
3. Run `gmail-cleaner setup` for detailed instructions

## Common Commands

### Clean old promotional emails (dry-run)
```bash
gmail-cleaner clean --older-than 90 --label Promotions
```

### Actually delete old promotional emails
```bash
gmail-cleaner clean --older-than 90 --label Promotions --no-dry-run
```

### Delete large emails from specific sender
```bash
gmail-cleaner clean --from "noreply@example.com" --larger-than 10MB --no-dry-run
```

### Clean multiple criteria
```bash
gmail-cleaner clean --older-than 60 --label Social --read --no-dry-run
```

### View available labels
```bash
gmail-cleaner labels
```

### Get inbox statistics
```bash
gmail-cleaner stats
```

## Filter Options

| Option | Description | Example |
|--------|-------------|---------|
| `--older-than N` | Emails older than N days | `--older-than 90` |
| `--from PATTERN` | Sender (supports wildcards) | `--from "noreply@*"` |
| `--label NAME` | Gmail label | `--label Promotions` |
| `--subject PATTERN` | Subject pattern | `--subject "Newsletter"` |
| `--larger-than SIZE` | Size filter | `--larger-than 5MB` |
| `--smaller-than SIZE` | Size filter | `--smaller-than 100KB` |
| `--read` / `--unread` | Read status | `--unread` |
| `--has-attachment` | Has attachments | `--has-attachment` |
| `--max-emails N` | Max to process | `--max-emails 1000` |
| `--dry-run` | Preview only | `--dry-run` (default) |
| `--no-dry-run` | Actually delete | `--no-dry-run` |
| `--permanent` | Permanent delete | `--permanent` |
| `-y` | Skip confirmation | `-y` |

## Common Labels

- `Promotions` - Marketing emails
- `Social` - Social network notifications
- `Updates` - Order confirmations, receipts
- `Forums` - Forum/mailing list emails
- `Spam` - Spam folder
- `Trash` - Trash folder
- `Inbox` - Inbox
- `Sent` - Sent emails

## Safety Tips

1. **Always use dry-run first** - The default is `--dry-run` which previews deletions
2. **Start small** - Test with a small `--max-emails` value first
3. **Use trash by default** - Emails can be recovered from trash for 30 days
4. **Backup important data** - Consider using Google Takeout before mass deletions
5. **Review filters carefully** - Double-check your filter criteria

## Examples by Use Case

### Clean up old newsletters
```bash
gmail-cleaner clean --older-than 30 --subject "*newsletter*" --no-dry-run
```

### Remove old social notifications
```bash
gmail-cleaner clean --older-than 60 --label Social --no-dry-run
```

### Delete large old attachments
```bash
gmail-cleaner clean --older-than 180 --has-attachment --larger-than 10MB --no-dry-run
```

### Clean read promotional emails
```bash
gmail-cleaner clean --label Promotions --read --older-than 7 --no-dry-run
```

### Permanently delete old spam
```bash
gmail-cleaner clean --label Spam --older-than 90 --permanent --no-dry-run -y
```

## Troubleshooting

### "Credentials file not found"
- Make sure `config/credentials.json` exists
- Run `gmail-cleaner setup` for instructions

### "Invalid grant" or authentication errors
- Delete `token.json` and re-authenticate
- Check that credentials are still valid in Google Cloud Console

### Rate limit errors
- The tool has built-in rate limiting
- If you still hit limits, reduce batch size or add delays

### No emails found
- Check your filter criteria
- Try running `gmail-cleaner stats` with same filters to verify
- Some labels may have different names (use `gmail-cleaner labels`)

## Development

### Run tests
```bash
pytest tests/ -v
```

### Install dev dependencies
```bash
pip install -r requirements-dev.txt
```

### Run with coverage
```bash
pytest tests/ --cov=src --cov=cli --cov=config
```
