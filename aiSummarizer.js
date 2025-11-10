const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSummary(analysis) {
  const prompt = `
Generate a human-readable summary of the voting data based on the following analysis:

Turnout: ${analysis.turnout}

Demographics (participation by age group):
${analysis.demographics.map(d => `${d.age_group}: ${d.participation}%`).join('\n')}

Trends (votes per day):
${Object.entries(analysis.trends).map(([date, count]) => `${date}: ${count} votes`).join('\n')}

Provide a concise summary similar to: "Turnout was 78%, with highest participation from 18–25 age group."
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateSummary };
