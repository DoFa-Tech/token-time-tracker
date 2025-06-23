# token-time-tracker

Track and report Claude Code usage metrics to an API.

## Installation

```bash
npm install -g token-time-tracker
```

Or use directly with npx:

```bash
npx token-time-tracker <userId> [--test]
```

## Usage

### Production Mode
```bash
token-time-tracker <userId>
```

This will fetch your Claude Code usage data and send it to the configured API endpoint.

### Test Mode
```bash
token-time-tracker <userId> --test
```

In test mode, the tool will send data to `http://localhost:8787/api` instead of the production API.

## What it does

1. Fetches your Claude Code usage data using `ccusage`
2. Parses the daily usage statistics
3. Sends the data to an API endpoint with the following format:

```json
{
  "userId": "your-user-id",
  "data": {
    "daily": [
      // Daily usage data from ccusage
    ]
  }
}
```

## Requirements

- Node.js 14 or higher
- Claude Code must be installed and configured

## License

ISC