# Gmail Smart Cleaner

A Chrome extension that intelligently helps you clean up and organize your Gmail inbox.

## Features

- Smart email filtering and organization
- Bulk email management
- Automated cleanup suggestions
- User-friendly interface

## Project Structure

```
gmail-smart-cleaner/
├── manifest.json          # Extension configuration
├── src/
│   ├── css/
│   │   └── styles.css     # Extension styling
│   ├── html/
│   │   └── fullscreen.html # Full-screen interface
│   ├── images/            # Extension icons and assets
│   └── js/
│       ├── api.js         # Gmail API integration
│       ├── auth.js        # Authentication logic
│       ├── background.js  # Background service worker
│       ├── popup.js       # Popup script
│       └── ui.js          # UI components and interactions
└── README.md              # This file
```

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right corner)
4. Click "Load unpacked" and select the project directory
5. The extension will appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Authorize the extension to access your Gmail account
3. Use the interface to manage and clean your inbox

## Development

### File Descriptions

- **manifest.json**: Chrome extension configuration file
- **api.js**: Handles Gmail API calls and email operations
- **auth.js**: Manages user authentication and OAuth flow
- **background.js**: Background service worker for persistent operations
- **popup.js**: Script for the popup interface
- **ui.js**: UI utilities and component management
- **styles.css**: Styling for all extension interfaces
- **fullscreen.html**: Full-page interface template

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]
