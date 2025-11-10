const { fetchVotes } = require('./web3Fetcher');
const { insertVote } = require('./db');
const { analyzeData } = require('./analyzer');
const { generateSummary } = require('./aiSummarizer');

async function main() {
  try {
    console.log('Fetching votes from blockchain...');
    const votes = await fetchVotes();

    console.log(`Fetched ${votes.length} votes. Storing in database...`);
    for (const vote of votes) {
      await insertVote(vote);
    }

    console.log('Analyzing data...');
    const analysis = await analyzeData();

    console.log('Generating AI summary...');
    const summary = await generateSummary(analysis);

    console.log('Report Summary:');
    console.log(summary);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
