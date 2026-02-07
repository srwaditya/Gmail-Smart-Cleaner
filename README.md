# Gmail Smart Cleaner 🧹

A powerful Python-based tool to intelligently clean up your Gmail inbox by filtering and removing unwanted emails based on various criteria.

## ✨ Features

- 🔐 **Secure OAuth 2.0 Authentication** with Gmail API
- 🎯 **Smart Filtering** by date, sender, label, size, subject, and more
- 🔍 **Dry Run Mode** to preview deletions before executing
- 📊 **Statistics & Analytics** to understand your inbox
- 🚀 **Batch Processing** with rate limiting for safe operations
- 💾 **Flexible Deletion** - move to trash or permanently delete
- 🎨 **User-Friendly CLI** with intuitive commands

## 📋 Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Examples](#examples)
- [Features](#features)
- [Contributing](#contributing)

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- A Google account with Gmail

### Install from source

```bash
# Clone the repository
git clone https://github.com/srwaditya/Gmail-Smart-Cleaner.git
cd Gmail-Smart-Cleaner

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install the package
pip install -e .
```

## ⚙️ Setup

### 1. Get Gmail API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API" and click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Desktop app" as the application type
   - Download the credentials file

### 2. Configure Credentials

```bash
# Create config directory if it doesn't exist
mkdir -p config

# Save your downloaded credentials as config/credentials.json
mv ~/Downloads/client_secret_*.json config/credentials.json
```

### 3. First-Time Authentication

```bash
# Run setup command to see detailed instructions
gmail-cleaner setup

# Run any command to trigger authentication
gmail-cleaner stats
```

A browser window will open asking you to authorize the application. After granting permission, you're all set!

## 📖 Usage

### Basic Commands

```bash
# Show setup instructions
gmail-cleaner setup

# List all available Gmail labels
gmail-cleaner labels

# Get statistics about your inbox
gmail-cleaner stats

# Clean emails with filters (dry-run by default)
gmail-cleaner clean [OPTIONS]
```

### Clean Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--older-than DAYS` | Delete emails older than N days | `--older-than 90` |
| `--from SENDER` | Filter by sender (supports wildcards) | `--from "noreply@*"` |
| `--label LABEL` | Filter by Gmail label | `--label Promotions` |
| `--subject TEXT` | Filter by subject | `--subject "Newsletter"` |
| `--larger-than SIZE` | Filter emails larger than size | `--larger-than 5MB` |
| `--smaller-than SIZE` | Filter emails smaller than size | `--smaller-than 1KB` |
| `--read/--unread` | Filter by read status | `--read` |
| `--has-attachment` | Filter emails with attachments | `--has-attachment` |
| `--max-emails N` | Maximum emails to process | `--max-emails 1000` |
| `--dry-run/--no-dry-run` | Preview without deleting | `--no-dry-run` |
| `--permanent` | Permanently delete (vs trash) | `--permanent` |
| `-y, --yes` | Skip confirmation prompts | `-y` |

## 💡 Examples

### Preview emails older than 90 days

```bash
gmail-cleaner clean --older-than 90 --dry-run
```

### Delete promotional emails older than 30 days

```bash
gmail-cleaner clean --older-than 30 --label Promotions --no-dry-run
```

### Delete large emails from specific sender

```bash
gmail-cleaner clean --from "noreply@example.com" --larger-than 10MB --no-dry-run
```

### Clean up unread newsletters

```bash
gmail-cleaner clean --subject "Newsletter" --unread --no-dry-run
```

### Permanently delete old spam

```bash
gmail-cleaner clean --older-than 180 --label Spam --permanent --no-dry-run
```

### Combine multiple filters

```bash
gmail-cleaner clean \
  --older-than 60 \
  --label Promotions \
  --read \
  --larger-than 1MB \
  --no-dry-run
```

### Get statistics about old emails

```bash
gmail-cleaner stats --older-than 365
```

## 🏗️ Project Structure

```
gmail-smart-cleaner/
├── cli/
│   ├── __init__.py
│   └── main.py              # CLI interface
├── config/
│   ├── __init__.py
│   ├── settings.py          # Configuration management
│   └── credentials.json     # OAuth credentials (not in repo)
├── src/
│   ├── __init__.py
│   ├── gmail_client.py      # Gmail API wrapper
│   ├── filters.py           # Email filtering logic
│   ├── cleaner.py           # Main cleaning orchestration
│   └── utils.py             # Utility functions
├── tests/
│   └── __init__.py
├── .env.example             # Example environment variables
├── .gitignore
├── requirements.txt         # Python dependencies
├── setup.py                 # Package setup
└── README.md
```

## 🔒 Security & Privacy

- **OAuth 2.0**: Uses secure OAuth authentication - no password storage
- **Local Tokens**: Authentication tokens are stored locally on your machine
- **No Data Collection**: This tool runs entirely on your machine and doesn't send data to any third party
- **Safe by Default**: Dry-run mode is enabled by default to prevent accidental deletions
- **Trash First**: Emails are moved to trash by default (not permanently deleted)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This tool permanently modifies your Gmail inbox. Always use dry-run mode first to preview changes. The authors are not responsible for any data loss.

## 🙏 Acknowledgments

- Built with [Google Gmail API](https://developers.google.com/gmail/api)
- CLI powered by [Click](https://click.palletsprojects.com/)

## 📞 Support

If you encounter any issues or have questions:
1. Check the [setup instructions](#setup)
2. Review the [examples](#examples)
3. Open an issue on GitHub

---

**Happy Cleaning! 🎉**