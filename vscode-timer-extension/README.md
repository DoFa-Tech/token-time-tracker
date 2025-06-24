# Token Ti.me Auto Tracker

Pushes your Claude Code usage data to Token Ti.me API every 15 minutes.

## Features

- Automatically tracks and pushes Claude Code usage data every 15 minutes
- Configurable user ID from Token Ti.me
- Runs seamlessly in the background while VS Code is open

## Configuration

This extension contributes the following settings:

* `timerExtension.userId`: User ID that you can get from the Token Ti.me website: /profile > Settings

## Usage

1. Install the extension
2. Get your User ID from Token Ti.me website (navigate to /profile > Settings)
3. Open VS Code settings (Cmd/Ctrl + ,)
4. Search for "Token Ti.me Auto Tracker"
5. Enter your User ID
6. The extension will automatically start pushing usage data every 15 minutes

## Development

To modify the logic that runs every 15 minutes, edit the `index.js` file.

## Requirements

VS Code version 1.74.0 or higher.

## Release Notes

### 0.0.1

Initial release with automatic Claude Code usage tracking for Token Ti.me.