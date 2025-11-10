# Automatic Voting Report Generation

This application analyzes blockchain voting data using Web3.js and MySQL, then uses AI to generate human-readable summaries of turnout, demographics, and trends.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MySQL database:
   - Create a MySQL database.
   - Run the schema.sql file to create tables and insert sample data.

3. Configure environment variables in `.env`:
   - INFURA_PROJECT_ID: Your Infura project ID for Ethereum access.
   - CONTRACT_ADDRESS: The address of the voting smart contract.
   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME: MySQL connection details.
   - OPENAI_API_KEY: Your OpenAI API key.

## Usage

Run the application:
```
npm start
```

This will fetch voting data from the blockchain, store it in MySQL, analyze it, and generate an AI-powered summary.

## Assumptions

- Voting contract emits a "Vote" event with voter address, choice, age group, and timestamp.
- Eligible voters are stored in the `eligible_voters` table.
- Demographics focus on age groups.
- Trends are basic daily vote counts.
