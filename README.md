# TokenTi.me Tracker
> Pulls your Claude Code token usage and costs from local JSONL files (using [ccusage](https://www.npmjs.com/package/ccusage)) and pushes them to TokenTi.me API for web analytics. Hevaily inspired and built on top of ccusage.

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

This will fetch your Claude Code usage data and send it to the TokenTi.me API endpoint. You can get your userId from the [Token Time Website](https://tokenti.me).

### Test Mode
```bash
token-time-tracker <userId> --test
```

In test mode, the tool will send data to `http://localhost:3000/api` instead of the production API.

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

MIT
