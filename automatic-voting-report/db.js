const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getEligibleVoters() {
  const [rows] = await pool.execute('SELECT * FROM eligible_voters');
  return rows;
}

async function insertVote(vote) {
  const { voter_address, choice, age_group, timestamp, block_number, transaction_hash } = vote;
  await pool.execute(
    'INSERT INTO votes (voter_address, choice, age_group, timestamp, block_number, transaction_hash) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
    [voter_address, choice, age_group, timestamp, block_number, transaction_hash]
  );
}

async function getVotes() {
  const [rows] = await pool.execute('SELECT * FROM votes');
  return rows;
}

async function getVoteStats() {
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) as total_votes,
      COUNT(DISTINCT voter_address) as unique_voters,
      age_group,
      COUNT(*) as count
    FROM votes
    GROUP BY age_group
  `);
  return rows;
}

module.exports = { getEligibleVoters, insertVote, getVotes, getVoteStats };
