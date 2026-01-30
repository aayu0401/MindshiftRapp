import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaChartBar, FaCalendar, FaDownload, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { ProgressLineChart, EngagementBarChart, RiskDistributionPieChart, CompletionRateChart } from '../components/AnalyticsCharts';
import { fetchUserAnalytics, fetchClassAnalytics, fetchHighRiskStudents } from '../api/analytics.api';
import './Dashboard.css';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [highRiskStudents, setHighRiskStudents] = useState<any[]>([]);

  // Mock data for fallback
  const mockStats = [
    { icon: <FaUsers />, label: 'Active Students', value: '124', change: '+12%' },
    { icon: <FaBook />, label: 'Stories Completed', value: '342', change: '+8%' },
    { icon: <FaChartBar />, label: 'Avg. Engagement', value: '87%', change: '+5%' },
    { icon: <FaCalendar />, label: 'Sessions This Month', value: '28', change: '+15%' }
  ];

  const mockProgressData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 72 },
    { name: 'Wed', value: 68 },
    { name: 'Thu', value: 78 },
    { name: 'Fri', value: 85 },
    { name: 'Sat', value: 82 },
    { name: 'Sun', value: 88 }
  ];

  const mockEngagementData = [
    { name: 'Year 4', stories: 45, courses: 32, assessments: 28 },
    { name: 'Year 5', stories: 52, courses: 38, assessments: 35 },
    { name: 'Year 6', stories: 48, courses: 42, assessments: 40 }
  ];

  const mockRiskData = [
    { name: 'Low Risk', value: 85, color: '#10b981' },
    { name: 'Moderate Risk', value: 12, color: '#f59e0b' },
    { name: 'High Risk', value: 3, color: '#ef4444' }
  ];

  const mockCompletionData = [
    { class: 'Year 5A', completion: 92 },
    { class: 'Year 5B', completion: 85 },
    { class: 'Year 6A', completion: 88 },
    { class: 'Year 6B', completion: 78 }
  ];

  const mockHighRiskStudents = [
    { name: 'Student A', class: 'Year 5A', assessment: 'Anxiety Screening', score: 24, date: '2024-02-15' },
    { name: 'Student B', class: 'Year 6B', assessment: 'Mood Screening', score: 15, date: '2024-02-14' },
    { name: 'Student C', class: 'Year 5B', assessment: 'Behavioral Regulation', score: 14, date: '2024-02-13' }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const [analyticsData, highRiskData] = await Promise.all([
        fetchClassAnalytics(), // or fetchUserAnalytics() for students
        fetchHighRiskStudents()
      ]);

      setAnalytics(analyticsData);
      setHighRiskStudents(highRiskData);
      setUsingMockData(false);
    } catch (error) {
      console.log('Backend unavailable, using sample data');
      // Use mock data
      setAnalytics(null);
      setHighRiskStudents(mockHighRiskStudents);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const retryBackend = () => {
    loadDashboardData();
  };

  // Use API data if available, otherwise use mock data
  const stats = analytics ? [
    { icon: <FaUsers />, label: 'Active Students', value: analytics.totalStudents?.toString() || '0', change: '+12%' },
    { icon: <FaBook />, label: 'Stories Completed', value: analytics.storiesCompleted?.toString() || '0', change: '+8%' },
    { icon: <FaChartBar />, label: 'Avg. Engagement', value: `${analytics.averageEngagement || 0}%`, change: '+5%' },
    { icon: <FaCalendar />, label: 'Sessions This Month', value: analytics.sessionsThisMonth?.toString() || '0', change: '+15%' }
  ] : mockStats;

  const progressData = analytics?.weeklyProgress || mockProgressData;
  const engagementData = analytics?.engagementByYear || mockEngagementData;
  const riskData = analytics?.riskDistribution || mockRiskData;
  const completionData = analytics?.completionByClass || mockCompletionData;

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navigation />
        <div className="container section">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navigation />

      <div className="dashboard-container">
        <div className="container">
          {/* Demo Mode Badge */}
          {usingMockData && (
            <div className="demo-mode-badge">
              <span className="badge-icon">📊</span>
              <span>Demo Mode - Using sample analytics data</span>
              <button className="badge-retry" onClick={retryBackend}>
                Try Backend
              </button>
            </div>
          )}

          {/* Header */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="dashboard-title">Teacher Dashboard</h1>
              <p className="dashboard-subtitle">
                Monitor student progress and wellbeing insights
              </p>
            </div>
            <div className="dashboard-actions">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-range-select"
                aria-label="Select time range"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm">
                <FaDownload /> Export Report
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" hover={false}>
                  <div className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                      <div className="stat-change positive">{stat.change}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-row">
              <motion.div
                className="chart-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card variant="solid" hover={false}>
                  <h3 className="chart-title">Weekly Engagement Trend</h3>
                  <ProgressLineChart data={progressData} />
                </Card>
              </motion.div>

              <motion.div
                className="chart-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card variant="solid" hover={false}>
                  <h3 className="chart-title">Assessment Risk Distribution</h3>
                  <RiskDistributionPieChart data={riskData} />
                </Card>
              </motion.div>
            </div>

            <div className="chart-row">
              <motion.div
                className="chart-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card variant="solid" hover={false}>
                  <h3 className="chart-title">Activity by Year Group</h3>
                  <EngagementBarChart data={engagementData} />
                </Card>
              </motion.div>

              <motion.div
                className="chart-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card variant="solid" hover={false}>
                  <h3 className="chart-title">Class Completion Rates</h3>
                  <CompletionRateChart data={completionData} />
                </Card>
              </motion.div>
            </div>
          </div>

          {/* High Risk Alert */}
          <motion.div
            className="dashboard-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="section-header">
              <h2 className="section-heading">
                <FaExclamationTriangle /> Students Requiring Attention
              </h2>
              <p className="section-description">
                Students who scored in the high-risk range on recent assessments
              </p>
            </div>
            <Card variant="solid" hover={false}>
              <div className="risk-table">
                <div className="table-header">
                  <div>Student</div>
                  <div>Class</div>
                  <div>Assessment</div>
                  <div>Score</div>
                  <div>Date</div>
                  <div>Action</div>
                </div>
                {highRiskStudents.map((student, index) => (
                  <div key={index} className="table-row high-risk-row">
                    <div className="student-name">{student.name}</div>
                    <div className="student-class">{student.class}</div>
                    <div className="assessment-name">{student.assessment}</div>
                    <div className="risk-score high">{student.score}</div>
                    <div className="assessment-date">{student.date}</div>
                    <div className="action-cell">
                      <Button variant="primary" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Wellbeing Insights */}
          <motion.div
            className="dashboard-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="section-heading">Wellbeing Insights</h2>
            <div className="insights-grid">
              <Card variant="feature" hover={false}>
                <h3>Most Engaged Topics</h3>
                <ul className="insight-list">
                  <li>Emotional Awareness</li>
                  <li>Friendship & Relationships</li>
                  <li>Courage & Resilience</li>
                </ul>
              </Card>
              <Card variant="feature" hover={false}>
                <h3>Recommended Focus Areas</h3>
                <ul className="insight-list">
                  <li>Self-Confidence Building</li>
                  <li>Stress Management</li>
                  <li>Communication Skills</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
