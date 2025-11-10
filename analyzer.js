const { getEligibleVoters, getVoteStats } = require('./db');

async function analyzeData() {
  const eligible = await getEligibleVoters();
  const stats = await getVoteStats();

  const totalEligible = eligible.length;
  const totalVotes = stats.reduce((sum, stat) => sum + stat.count, 0);
  const turnout = totalEligible > 0 ? ((totalVotes / totalEligible) * 100).toFixed(2) : 0;

  // Demographics: participation by age group
  const demographics = stats.map(stat => ({
    age_group: stat.age_group,
    participation: ((stat.count / totalVotes) * 100).toFixed(2)
  }));

  // Trends: Assume simple trend, e.g., votes over time (group by day)
  // For simplicity, just count votes per day
  const votes = await require('./db').getVotes();
  const trends = {};
  votes.forEach(vote => {
    const date = vote.timestamp.toISOString().split('T')[0];
    trends[date] = (trends[date] || 0) + 1;
  });

  return {
    turnout: `${turnout}%`,
    demographics,
    trends
  };
}

module.exports = { analyzeData };
