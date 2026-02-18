import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaChartBar, FaCalendar, FaDownload, FaExclamationTriangle, FaSpinner, FaBrain, FaShieldAlt } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import { ProgressLineChart, EngagementBarChart, RiskDistributionPieChart, CompletionRateChart } from '../components/AnalyticsCharts';
import { fetchUserAnalytics, fetchClassAnalytics, fetchHighRiskStudents } from '../api/analytics.api';
import LiveActivityFeed from '../components/LiveActivityFeed';
import SmartInsightCard from '../components/SmartInsightCard';
import { useRealtime } from '../context/RealtimeContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  // Mock data for fallback
  const mockStats = [
    { icon: <FaUsers />, label: 'Active Students', value: '124', change: '+12%' },
    { icon: <FaBook />, label: 'Stories Completed', value: '342', change: '+8%' },
    { icon: <FaChartBar />, label: 'Avg. Engagement', value: '87%', change: '+5%' },
    { icon: <FaCalendar />, label: 'Sessions This Month', value: '28', change: '+15%' }
  ];

  const mockHighRiskStudents = [
    { name: 'Student A', class: 'Year 5A', assessment: 'Anxiety Screening', score: 24, date: '2024-02-15' },
    { name: 'Student B', class: 'Year 6B', assessment: 'Mood Screening', score: 15, date: '2024-02-14' },
    { name: 'Student C', class: 'Year 5B', assessment: 'Behavioral Regulation', score: 14, date: '2024-02-13' }
  ];

  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [highRiskStudents, setHighRiskStudents] = useState<any[]>([]);

  const [stats, setStats] = useState<any[]>(mockStats);
  const [greeting, setGreeting] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* Real-time Integration */
  const { socket, isConnected, onlineCounts } = useRealtime();

  useEffect(() => {
    if (!socket) return;

    // Listen for high-risk alerts from the backend
    socket.on('high-risk-alert', (alert: any) => {
      toast.error(`Alert: ${alert.studentName} flagged for ${alert.riskType}`, {
        duration: 8000,
        icon: '🚨',
        style: {
          background: '#fee2e2',
          color: '#ef4444',
          border: '1px solid #ef4444'
        }
      });

      // Add to start of list
      setHighRiskStudents(prev => [{
        name: alert.studentName,
        class: alert.className,
        assessment: alert.assessmentType,
        score: alert.score,
        date: 'Just Now'
      }, ...prev]);
    });

    return () => {
      socket.off('high-risk-alert');
    };
  }, [socket]);

  // Fallback Simulation if no socket
  useEffect(() => {
    if (isConnected) return; // Don't simulate if really connected

    const interval = setInterval(() => {
      setStats(currentStats => currentStats.map(stat => {
        // ... (keep existing random logic)
        if (Math.random() > 0.7) {
          const value = parseInt(stat.value.toString().replace(/[^0-9]/g, ''));
          if (!isNaN(value)) {
            const increment = Math.floor(Math.random() * 3);
            const suffix = stat.value.toString().includes('%') ? '%' : '';
            return { ...stat, value: (value + increment) + suffix };
          }
        }
        return stat;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

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

      const apiStats = [
        { icon: <FaUsers />, label: 'Active Students', value: (analyticsData?.activeStudents ?? analyticsData?.averageEngagement ?? 0).toString(), change: '+12%' },
        { icon: <FaBook />, label: 'Stories Completed', value: (analyticsData?.averageCompletionRate ?? analyticsData?.completionRate ?? 0).toString(), change: '+8%' },
        { icon: <FaChartBar />, label: 'Avg. Engagement', value: `${analyticsData?.averageEngagementScore || analyticsData?.averageEngagement || 0}%`, change: '+5%' },
        { icon: <FaCalendar />, label: 'Sessions This Month', value: (analyticsData?.highRiskStudents ?? (analyticsData?.riskDistribution ? Object.values(analyticsData.riskDistribution).reduce((a: any, b: any) => Number(a) + Number(b), 0) : 0)).toString(), change: '+15%' }
      ];
      setStats(apiStats);
    } catch (error) {
      console.log('Backend unavailable, using sample data');
      // Use mock data
      setAnalytics(null);
      setHighRiskStudents(mockHighRiskStudents);
      setUsingMockData(true);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const retryBackend = () => {
    loadDashboardData();
  };



  const progressData = analytics?.weeklyProgress || mockProgressData;
  const engagementData = analytics?.engagementByYear || mockEngagementData;

  // Transform riskDistribution object to array if needed
  const riskData = analytics?.riskDistribution
    ? (Array.isArray(analytics.riskDistribution)
      ? analytics.riskDistribution
      : Object.entries(analytics.riskDistribution).map(([key, val]) => ({
        name: key === 'LOW' ? 'Low Risk' : key === 'MODERATE' ? 'Moderate Risk' : 'High Risk',
        value: val,
        color: key === 'LOW' ? '#10b981' : key === 'MODERATE' ? '#f59e0b' : '#ef4444'
      })))
    : mockRiskData;

  const completionData = analytics?.completionByClass || mockCompletionData;

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navigation />
        <div className="container section">
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <h2 className="loading-text-hitech">Initializing Nexus Hub...</h2>
            <p className="hero-subtitle-hitech">Synchronizing neural data archives</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Command Center Background HUD */}
      <div className="dashboard-hud">
        <motion.div
          className="parallax-layer"
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 45, damping: 25 }}
        >
          <div className="scanline"></div>
          <div className="grid-overlay"></div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </motion.div>
      </div>

      <Navigation />

      <div className="dashboard-container">
        <div className="container">
          {/* Command Header HUD */}
          <motion.div
            className="command-header-hud"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="header-top-hud">
              <div className="system-status-ribbon">
                <div className={`status-node ${isConnected ? 'online' : 'offline'}`}>
                  <span className="node-pulse"></span>
                  SYSTEM {isConnected ? 'LIVE' : 'SYNCING'}
                </div>
                <div className="status-node">
                  <FaUsers />
                  ONLINE: <span className="online-count">{onlineCounts?.students || 0}</span>
                </div>
                {usingMockData && (
                  <div className="status-node alert" onClick={retryBackend} style={{ cursor: 'pointer' }}>
                    <FaExclamationTriangle />
                    DEMO MODE ACTIVE - RECONNECT
                  </div>
                )}
              </div>
              <div className="header-time-hud">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • HUB OS v2.0
              </div>
            </div>

            <div className="header-main-hud">
              <div className="greeting-hud">
                <h1 className="hero-title-hitech">Guardian <span className="text-neon-blue">Nexus</span></h1>
                <p className="hero-subtitle-hitech">{greeting}, Educator. Performance protocols initialized.</p>
              </div>
              <div className="hud-actions">
                <Button variant="outline" size="sm" className="hud-btn"><FaDownload /> Data Extract</Button>
                <select
                  title="Time Range"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="hud-select"
                >
                  <option value="week">Past 7 Days</option>
                  <option value="month">Past 30 Days</option>
                  <option value="year">Full Year</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Engagement Grid HUD */}
          <div className="engagement-hud-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card variant="glass" className="hud-stat-card-glow" hover={true}>
                  <div className="hud-stat-header">
                    <div className="hud-stat-icon-glow">{stat.icon}</div>
                    <div className="hud-stat-change">{stat.change}</div>
                  </div>
                  <div className="hud-stat-body">
                    <div className="hud-stat-value-big">{stat.value}</div>
                    <div className="hud-stat-label-muted">{stat.label}</div>
                  </div>
                  <div className="hud-stat-progress-bar">
                    <div className="progress-fill" style={{ width: '70%' }}></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="dashboard-main-grid-hud">
            {/* Analytics Lab */}
            <div className="analytics-lab">
              <section className="hud-section">
                <div className="section-header-hud">
                  <FaBrain className="header-icon" />
                  <h2>Intelligence Core</h2>
                </div>
                <div className="chart-grid-hud">
                  <Card variant="deep" className="hud-chart-card">
                    <h3>Engagement Trajectory</h3>
                    <div className="chart-wrapper">
                      <ProgressLineChart data={progressData} />
                    </div>
                  </Card>

                  <Card variant="deep" className="hud-chart-card">
                    <h3>Risk Distribution Matrix</h3>
                    <div className="chart-wrapper">
                      <RiskDistributionPieChart data={riskData} />
                    </div>
                  </Card>
                </div>
              </section>

              <div className="secondary-chart-grid">
                <Card variant="deep" className="hud-chart-card">
                  <h3>Demographic Resilience</h3>
                  <div className="chart-wrapper">
                    <EngagementBarChart data={engagementData} />
                  </div>
                </Card>
                <Card variant="deep" className="hud-chart-card">
                  <h3>Completion Efficiency</h3>
                  <div className="chart-wrapper">
                    <CompletionRateChart data={completionData} />
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar HUD */}
            <div className="sidebar-hud">
              <SmartInsightCard />

              <section className="hud-section mt-lg">
                <div className="section-header-hud alert">
                  <FaExclamationTriangle className="header-icon" />
                  <h2>Critical Alerts</h2>
                </div>
                <Card variant="glass" className="risk-alerts-card">
                  <div className="risk-students-list-hud">
                    {Array.isArray(highRiskStudents) && highRiskStudents.length > 0 ? (
                      highRiskStudents.map((student, index) => (
                        <motion.div
                          key={index}
                          className="risk-student-hud-item"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="risk-indicator pulse-red"></div>
                          <div className="risk-info">
                            <div className="risk-name">{student.name}</div>
                            <div className="risk-meta">{student.class} • {student.assessment}</div>
                          </div>
                          <div className="risk-score">S:{student.score}</div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="no-risk-hud">All systems stable. No alerts in range.</div>
                    )}
                  </div>
                </Card>
              </section>

              {user?.role === 'school' && (
                <section className="hud-section mt-lg">
                  <div className="section-header-hud cyan">
                    <FaShieldAlt className="header-icon" />
                    <h2>Access Protocol Review</h2>
                  </div>
                  <Card variant="premium" className="access-control-card">
                    <div className="access-grid">
                      <div className="access-group">
                        <h4 className="access-role">Teachers</h4>
                        <ul className="access-list">
                          <li>Create Therapeutic Stories</li>
                          <li>Review Student Analytics</li>
                          <li>Manage Class Assignments</li>
                          <li>Trigger High-Risk Alerts</li>
                        </ul>
                      </div>
                      <div className="access-group">
                        <h4 className="access-role">Students</h4>
                        <ul className="access-list">
                          <li>Access Narrative Archive</li>
                          <li>Guided Breathing & ZenBot</li>
                          <li>Personal Reflection Journal</li>
                          <li>Self-Assessment Modules</li>
                        </ul>
                      </div>
                    </div>
                    <div className="access-footer">
                      <span className="info-text">System-defined permissions active</span>
                      <Button variant="primary" size="sm" href="/school-admin">
                        <FaUsers /> Manage Users
                      </Button>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
