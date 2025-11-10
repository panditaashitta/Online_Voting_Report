// Simulate database connection and fetching
async function fetchEligibleVoters() {
    // Simulate DB query delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockEligibleVoters;
}

async function fetchVotes() {
    // Simulate DB query delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockVotes;
}

// Generate voter IDs: 2025A1-A9, 2025B1-B9, 2025C1-C9, 2025D1-D9, 2025E1-E9, 2025F1-F8 (53 total)
function generateVoterIds() {
    const voters = [];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'];
    let ageIndex = 0;
    
    for (let i = 0; i < letters.length; i++) {
        const maxNum = (i === 5) ? 8 : 9; // F goes only to F8
        for (let j = 1; j <= maxNum; j++) {
            const voterId = `2025${letters[i]}${j}`;
            voters.push({
                voter_id: voterId,
                age_group: ageGroups[ageIndex % ageGroups.length]
            });
            ageIndex++;
        }
    }
    return voters;
}

// Mock data for demonstration (53 eligible voters)
const mockEligibleVoters = generateVoterIds();

// Generate votes with voter IDs and dates from November 11-20, 2025
function generateVotes() {
    const votes = [];
    const eligibleVoters = mockEligibleVoters;
    const startDate = new Date(2025, 10, 11, 10, 0, 0, 0); // November 11, 2025 (month is 0-indexed, so 10 = November)
    const daysRange = 10; // 11th to 20th inclusive = 10 days
    
    // Use all 53 voters for votes, distributed across the date range
    for (let i = 0; i < eligibleVoters.length; i++) {
        // Distribute votes evenly across 10 days (November 11-20)
        const dayIndex = Math.floor((i / eligibleVoters.length) * daysRange);
        const dayOffset = Math.min(dayIndex, daysRange - 1); // Ensure we don't go beyond the range
        
        const voteDate = new Date(startDate);
        voteDate.setDate(startDate.getDate() + dayOffset);
        voteDate.setHours(10 + (i % 2), 0, 0, 0); // Alternate between 10:00 and 11:00
        
        votes.push({
            voter_id: eligibleVoters[i].voter_id,
            age_group: eligibleVoters[i].age_group,
            timestamp: voteDate
        });
    }
    return votes;
}

const mockVotes = generateVotes();

// Chart instances storage
let chartInstances = [];

// Function to analyze data
async function analyzeData() {
    const eligibleVoters = await fetchEligibleVoters();
    const votes = await fetchVotes();

    const totalEligible = eligibleVoters.length;
    const totalVotes = votes.length;
    const turnout = totalEligible > 0 ? ((totalVotes / totalEligible) * 100).toFixed(2) : 0;

    // Demographics
    const demographics = {};
    votes.forEach(vote => {
        demographics[vote.age_group] = (demographics[vote.age_group] || 0) + 1;
    });
    const demographicsArray = Object.entries(demographics).map(([age_group, count]) => ({
        age_group,
        participation: ((count / totalVotes) * 100).toFixed(2),
        count: count
    }));

    // Trends (votes per day)
    const trends = {};
    votes.forEach(vote => {
        const date = vote.timestamp.toISOString().split('T')[0];
        trends[date] = (trends[date] || 0) + 1;
    });

    return { 
        turnout: `${turnout}%`, 
        totalEligible,
        totalVotes,
        demographics: demographicsArray, 
        trends 
    };
}

// Function to generate AI-like summary
function generateSummary(analysis) {
    const turnout = parseFloat(analysis.turnout);
    const highestDemo = analysis.demographics.reduce((prev, curr) => 
        parseFloat(curr.participation) > parseFloat(prev.participation) ? curr : prev
    );
    const trendEntries = Object.entries(analysis.trends);
    const trendSummary = trendEntries.length > 1 
        ? `with increasing participation over ${trendEntries.length} days.` 
        : `with ${trendEntries[0][1]} votes on ${trendEntries[0][0]}.`;

    return `The voting report shows a turnout of ${turnout}%, with ${analysis.totalVotes} votes cast out of ${analysis.totalEligible} eligible voters. The highest participation came from the ${highestDemo.age_group} age group (${highestDemo.participation}%), ${trendSummary}`;
}

// Function to create Chart.js bar chart
function createBarChart(data, title, containerId, type = 'bar') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Destroy existing chart if it exists
    const existingChart = chartInstances.find(ch => ch.canvas.id === containerId);
    if (existingChart) {
        existingChart.destroy();
    }

    const canvas = document.createElement('canvas');
    canvas.id = containerId;
    container.innerHTML = `<h3>${title}</h3>`;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    const chart = new Chart(ctx, {
        type: type,
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                label: title,
                data: data.map(d => d.value),
                backgroundColor: type === 'bar' 
                    ? [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ]
                    : 'rgba(99, 102, 241, 0.8)',
                borderColor: type === 'bar'
                    ? [
                        'rgba(99, 102, 241, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)'
                    ]
                    : 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: type === 'line' ? {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            } : {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });

    chartInstances.push(chart);
    return chart;
}

// Function to create Chart.js pie/doughnut chart
function createPieChart(data, title, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Destroy existing chart if it exists
    const existingChart = chartInstances.find(ch => ch.canvas.id === containerId);
    if (existingChart) {
        existingChart.destroy();
    }

    const canvas = document.createElement('canvas');
    canvas.id = containerId;
    container.innerHTML = `<h3>${title}</h3>`;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    const colors = [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
    ];

    const borderColors = [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
    ];

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: colors.slice(0, data.length),
                borderColor: borderColors.slice(0, data.length),
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });

    chartInstances.push(chart);
    return chart;
}

// Function to display voter list
function displayVoterList(votes, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<h3>Voter Details</h3>';
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Voter ID</th>
                <th>Age Group</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            ${votes.map(vote => `
                <tr>
                    <td>${vote.voter_id}</td>
                    <td>${vote.age_group}</td>
                    <td>${vote.timestamp.toLocaleString()}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.appendChild(table);
}

// Event listener for button
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateReport');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const reportOutput = document.getElementById('reportOutput');
    const reportContent = document.getElementById('reportContent');

    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            // Show loading state
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.6';
            loadingSpinner.style.display = 'flex';
            reportOutput.style.display = 'none';

            // Clear previous charts
            chartInstances.forEach(chart => chart.destroy());
            chartInstances = [];

            try {
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const analysis = await analyzeData();
                const summary = generateSummary(analysis);
                const eligibleVoters = await fetchEligibleVoters();
                const votes = await fetchVotes();

                // Calculate statistics
                const nonVoters = analysis.totalEligible - analysis.totalVotes;

                reportContent.innerHTML = `
                    <div class="report-summary">
                        <h2>📊 Report Summary</h2>
                        <p>${summary}</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Total Eligible Voters</div>
                            <div class="stat-value">${analysis.totalEligible}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Votes Cast</div>
                            <div class="stat-value">${analysis.totalVotes}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Turnout Rate</div>
                            <div class="stat-value">${analysis.turnout}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Non-Voters</div>
                            <div class="stat-value">${nonVoters}</div>
                        </div>
                    </div>

                    <div id="chartsContainer">
                        <div id="turnoutChart" class="chart"></div>
                        <div id="demographicsChart" class="chart"></div>
                        <div id="trendsChart" class="chart"></div>
                    </div>
                    
                    <div id="voterList" class="voter-list"></div>
                `;

                // Create charts with animation delay
                setTimeout(() => {
                    createBarChart([
                        { label: 'Eligible Voters', value: eligibleVoters.length },
                        { label: 'Votes Cast', value: votes.length },
                        { label: 'Non-Voters', value: nonVoters }
                    ], 'Turnout Overview', 'turnoutChart');

                    const demographicsData = analysis.demographics.map(demo => ({
                        label: demo.age_group,
                        value: demo.count
                    }));
                    createPieChart(demographicsData, 'Participation by Age Group', 'demographicsChart');

                    const trendsData = Object.entries(analysis.trends)
                        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                        .map(([date, count]) => ({
                            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            value: count
                        }));
                    createBarChart(trendsData, 'Voting Trends Over Time', 'trendsChart', 'line');
                }, 100);

                // Display voter list
                setTimeout(() => {
                    displayVoterList(votes, 'voterList');
                }, 200);

                // Show report with animation
                reportOutput.classList.add('show');
                reportOutput.style.display = 'block';

                // Scroll to report
                setTimeout(() => {
                    reportOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);

            } catch (error) {
                console.error('Error generating report:', error);
                reportContent.innerHTML = `
                    <div class="report-summary" style="border-left-color: var(--danger-color);">
                        <h2>❌ Error</h2>
                        <p>An error occurred while generating the report. Please try again.</p>
                    </div>
                `;
                reportOutput.classList.add('show');
                reportOutput.style.display = 'block';
            } finally {
                // Hide loading state
                loadingSpinner.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.style.opacity = '1';
            }
        });
    }
});
