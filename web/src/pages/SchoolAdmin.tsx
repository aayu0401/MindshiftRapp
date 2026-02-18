import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUserPlus, FaUsers, FaUpload, FaTrash, FaCheck, FaTimes,
    FaEnvelope, FaUserShield, FaDownload, FaSearch, FaChevronDown,
    FaGraduationCap, FaChalkboardTeacher, FaSpinner, FaFileAlt
} from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card } from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import './SchoolAdmin.css';

type UserRole = 'student' | 'teacher';

interface PendingUser {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    status: 'pending' | 'sending' | 'sent' | 'error';
}

interface ExistingUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    joinedAt: string;
    status: 'active' | 'pending';
}

// Mock existing users
const mockExistingUsers: ExistingUser[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@school.edu', role: 'teacher', joinedAt: '2024-01-15', status: 'active' },
    { id: '2', name: 'Michael Chen', email: 'm.chen@school.edu', role: 'teacher', joinedAt: '2024-01-20', status: 'active' },
    { id: '3', name: 'Emma Williams', email: 'emma.w@school.edu', role: 'student', joinedAt: '2024-02-01', status: 'active' },
    { id: '4', name: 'James Brown', email: 'j.brown@school.edu', role: 'student', joinedAt: '2024-02-05', status: 'active' },
    { id: '5', name: 'Olivia Davis', email: 'o.davis@school.edu', role: 'student', joinedAt: '2024-02-10', status: 'pending' },
];

export default function SchoolAdmin() {
    const [activeTab, setActiveTab] = useState<'manage' | 'add-single' | 'bulk'>('manage');
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [existingUsers, setExistingUsers] = useState<ExistingUser[]>(mockExistingUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
    const [isSending, setIsSending] = useState(false);

    // Single Add Form
    const [singleEmail, setSingleEmail] = useState('');
    const [singleName, setSingleName] = useState('');
    const [singleRole, setSingleRole] = useState<UserRole>('student');

    // Bulk Upload
    const [bulkText, setBulkText] = useState('');
    const [bulkRole, setBulkRole] = useState<UserRole>('student');
    const [csvPreview, setCsvPreview] = useState<PendingUser[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleAddSingle = () => {
        if (!singleEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(singleEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        const newUser: PendingUser = {
            id: generateId(),
            email: singleEmail.trim(),
            name: singleName.trim() || undefined,
            role: singleRole,
            status: 'pending'
        };
        setPendingUsers(prev => [...prev, newUser]);
        setSingleEmail('');
        setSingleName('');
        toast.success(`${singleRole === 'teacher' ? 'Teacher' : 'Student'} added to invite list`);
    };

    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            parseCsvText(text);
        };
        reader.readAsText(file);
    };

    const parseCsvText = (text: string) => {
        const lines = text.split('\n').filter(l => l.trim());
        const parsed: PendingUser[] = [];
        lines.forEach(line => {
            const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
            const email = parts[0];
            const name = parts[1] || undefined;
            const role: UserRole = (parts[2]?.toLowerCase() === 'teacher') ? 'teacher' : 'student';
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                parsed.push({ id: generateId(), email, name, role, status: 'pending' });
            }
        });
        if (parsed.length === 0) {
            toast.error('No valid emails found. Format: email, name (optional), role (optional)');
            return;
        }
        setCsvPreview(parsed);
        toast.success(`${parsed.length} users parsed from file`);
    };

    const handleBulkTextParse = () => {
        const lines = bulkText.split('\n').filter(l => l.trim());
        const parsed: PendingUser[] = lines.map(line => {
            const parts = line.split(',').map(p => p.trim());
            return {
                id: generateId(),
                email: parts[0],
                name: parts[1] || undefined,
                role: bulkRole,
                status: 'pending' as const
            };
        }).filter(u => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email));

        if (parsed.length === 0) {
            toast.error('No valid emails found');
            return;
        }
        setCsvPreview(parsed);
        toast.success(`${parsed.length} users ready to invite`);
    };

    const addCsvToPending = () => {
        setPendingUsers(prev => [...prev, ...csvPreview]);
        setCsvPreview([]);
        setBulkText('');
        toast.success(`${csvPreview.length} users added to invite queue`);
    };

    const removePending = (id: string) => {
        setPendingUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleSendInvites = async () => {
        if (pendingUsers.length === 0) {
            toast.error('No users in the invite queue');
            return;
        }
        setIsSending(true);
        // Simulate sending invites
        for (let i = 0; i < pendingUsers.length; i++) {
            setPendingUsers(prev => prev.map((u, idx) => idx === i ? { ...u, status: 'sending' } : u));
            await new Promise(r => setTimeout(r, 400));
            setPendingUsers(prev => prev.map((u, idx) => idx === i ? { ...u, status: 'sent' } : u));
        }
        setIsSending(false);
        toast.success(`✅ ${pendingUsers.length} invitations sent successfully!`);
        // After a delay, clear sent users and add to existing
        setTimeout(() => {
            const newUsers: ExistingUser[] = pendingUsers.map(u => ({
                id: u.id,
                name: u.name || u.email.split('@')[0],
                email: u.email,
                role: u.role,
                joinedAt: new Date().toISOString().split('T')[0],
                status: 'pending' as const
            }));
            setExistingUsers(prev => [...newUsers, ...prev]);
            setPendingUsers([]);
        }, 1500);
    };

    const downloadTemplate = () => {
        const csv = 'email,name,role\njohn.doe@school.edu,John Doe,student\njane.smith@school.edu,Jane Smith,teacher';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindshiftr_invite_template.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Template downloaded!');
    };

    const filteredUsers = existingUsers.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: existingUsers.length,
        teachers: existingUsers.filter(u => u.role === 'teacher').length,
        students: existingUsers.filter(u => u.role === 'student').length,
        pending: existingUsers.filter(u => u.status === 'pending').length,
    };

    return (
        <div className="school-admin-page">
            <Navigation />

            {/* Background */}
            <div className="admin-bg">
                <div className="admin-orb admin-orb-1" />
                <div className="admin-orb admin-orb-2" />
            </div>

            <div className="admin-container">
                {/* Header */}
                <motion.div
                    className="admin-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="admin-header-badge">
                        <FaUserShield />
                        School Admin Portal
                    </div>
                    <h1 className="admin-title">
                        User <span className="admin-title-accent">Access</span> Management
                    </h1>
                    <p className="admin-subtitle">
                        Invite students and teachers to your school's MindshiftR workspace — individually or in bulk.
                    </p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    className="admin-stats-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {[
                        { icon: <FaUsers />, label: 'Total Members', value: stats.total, color: 'blue' },
                        { icon: <FaChalkboardTeacher />, label: 'Teachers', value: stats.teachers, color: 'purple' },
                        { icon: <FaGraduationCap />, label: 'Students', value: stats.students, color: 'green' },
                        { icon: <FaEnvelope />, label: 'Pending Invites', value: stats.pending, color: 'amber' },
                    ].map((stat, i) => (
                        <Card key={i} variant="glass" className={`admin-stat-card stat-${stat.color}`}>
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </Card>
                    ))}
                </motion.div>

                {/* Tab Navigation */}
                <div className="admin-tabs">
                    {[
                        { id: 'manage', label: 'Manage Users', icon: <FaUsers /> },
                        { id: 'add-single', label: 'Add Individual', icon: <FaUserPlus /> },
                        { id: 'bulk', label: 'Bulk Import', icon: <FaUpload /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ===== MANAGE USERS TAB ===== */}
                    {activeTab === 'manage' && (
                        <motion.div
                            key="manage"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="admin-tab-content"
                        >
                            <div className="manage-toolbar">
                                <div className="search-box">
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <div className="filter-group">
                                    <button
                                        className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                                        onClick={() => setFilterRole('all')}
                                    >All</button>
                                    <button
                                        className={`filter-btn ${filterRole === 'teacher' ? 'active' : ''}`}
                                        onClick={() => setFilterRole('teacher')}
                                    ><FaChalkboardTeacher /> Teachers</button>
                                    <button
                                        className={`filter-btn ${filterRole === 'student' ? 'active' : ''}`}
                                        onClick={() => setFilterRole('student')}
                                    ><FaGraduationCap /> Students</button>
                                </div>
                            </div>

                            <Card variant="glass" className="users-table-card">
                                <div className="users-table-header">
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Role</span>
                                    <span>Joined</span>
                                    <span>Status</span>
                                </div>
                                {filteredUsers.length === 0 ? (
                                    <div className="empty-state">
                                        <FaUsers />
                                        <p>No users found matching your search.</p>
                                    </div>
                                ) : (
                                    filteredUsers.map((user, i) => (
                                        <motion.div
                                            key={user.id}
                                            className="user-row"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className="user-name-cell">
                                                <div className={`user-avatar avatar-${user.role}`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{user.name}</span>
                                            </div>
                                            <div className="user-email">{user.email}</div>
                                            <div>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role === 'teacher' ? <FaChalkboardTeacher /> : <FaGraduationCap />}
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="user-date">{user.joinedAt}</div>
                                            <div>
                                                <span className={`status-badge status-${user.status}`}>
                                                    {user.status === 'active' ? <FaCheck /> : <FaEnvelope />}
                                                    {user.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* ===== ADD SINGLE TAB ===== */}
                    {activeTab === 'add-single' && (
                        <motion.div
                            key="add-single"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="admin-tab-content"
                        >
                            <div className="add-single-layout">
                                <Card variant="glass" className="add-form-card">
                                    <h3 className="form-title">
                                        <FaUserPlus /> Add Individual User
                                    </h3>
                                    <p className="form-subtitle">Enter the user's details and they'll receive an email invitation to join your school's workspace.</p>

                                    <div className="form-group">
                                        <label className="form-label">Email Address *</label>
                                        <div className="input-with-icon">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                placeholder="user@school.edu"
                                                value={singleEmail}
                                                onChange={e => setSingleEmail(e.target.value)}
                                                className="form-input"
                                                onKeyDown={e => e.key === 'Enter' && handleAddSingle()}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Full Name (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. John Smith"
                                            value={singleName}
                                            onChange={e => setSingleName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Access Role *</label>
                                        <div className="role-selector">
                                            <button
                                                className={`role-option ${singleRole === 'student' ? 'active' : ''}`}
                                                onClick={() => setSingleRole('student')}
                                            >
                                                <FaGraduationCap />
                                                <span>Student</span>
                                                <small>Access to stories, assessments & ZenBot</small>
                                            </button>
                                            <button
                                                className={`role-option ${singleRole === 'teacher' ? 'active' : ''}`}
                                                onClick={() => setSingleRole('teacher')}
                                            >
                                                <FaChalkboardTeacher />
                                                <span>Teacher</span>
                                                <small>Full analytics, AI creator & class management</small>
                                            </button>
                                        </div>
                                    </div>

                                    <Button variant="primary" className="add-btn-full" onClick={handleAddSingle}>
                                        <FaUserPlus /> Add to Invite Queue
                                    </Button>
                                </Card>

                                {/* Invite Queue */}
                                <div className="invite-queue">
                                    <div className="queue-header">
                                        <h3>Invite Queue <span className="queue-count">{pendingUsers.length}</span></h3>
                                        {pendingUsers.length > 0 && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleSendInvites}
                                                disabled={isSending}
                                            >
                                                {isSending ? <FaSpinner className="spin" /> : <FaEnvelope />}
                                                Send All Invites
                                            </Button>
                                        )}
                                    </div>

                                    {pendingUsers.length === 0 ? (
                                        <div className="queue-empty">
                                            <FaEnvelope />
                                            <p>No users queued yet. Add users above to build your invite list.</p>
                                        </div>
                                    ) : (
                                        <div className="queue-list">
                                            <AnimatePresence>
                                                {pendingUsers.map(user => (
                                                    <motion.div
                                                        key={user.id}
                                                        className={`queue-item status-${user.status}`}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <div className={`queue-role-dot role-${user.role}`} />
                                                        <div className="queue-info">
                                                            <div className="queue-email">{user.email}</div>
                                                            <div className="queue-meta">
                                                                {user.name && <span>{user.name} · </span>}
                                                                <span className={`role-badge-sm role-${user.role}`}>{user.role}</span>
                                                            </div>
                                                        </div>
                                                        <div className="queue-status">
                                                            {user.status === 'pending' && (
                                                                <button className="remove-btn" onClick={() => removePending(user.id)}>
                                                                    <FaTimes />
                                                                </button>
                                                            )}
                                                            {user.status === 'sending' && <FaSpinner className="spin status-icon" />}
                                                            {user.status === 'sent' && <FaCheck className="sent-icon" />}
                                                            {user.status === 'error' && <FaTimes className="error-icon" />}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ===== BULK IMPORT TAB ===== */}
                    {activeTab === 'bulk' && (
                        <motion.div
                            key="bulk"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="admin-tab-content"
                        >
                            <div className="bulk-layout">
                                <Card variant="glass" className="bulk-upload-card">
                                    <h3 className="form-title"><FaUpload /> Bulk Import Users</h3>
                                    <p className="form-subtitle">Upload a CSV file or paste emails directly. Format: <code>email, name (optional), role (optional)</code></p>

                                    {/* CSV Upload Zone */}
                                    <div
                                        className="csv-drop-zone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv,.txt"
                                            onChange={handleCsvUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <FaFileAlt className="drop-icon" />
                                        <p className="drop-title">Drop your CSV here or click to browse</p>
                                        <p className="drop-subtitle">Supports .csv and .txt files</p>
                                        <button className="download-template-btn" onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}>
                                            <FaDownload /> Download Template
                                        </button>
                                    </div>

                                    <div className="bulk-divider">
                                        <span>or paste emails manually</span>
                                    </div>

                                    {/* Default Role for Pasted Emails */}
                                    <div className="form-group">
                                        <label className="form-label">Default Role for Pasted Emails</label>
                                        <div className="role-toggle">
                                            <button
                                                className={`role-toggle-btn ${bulkRole === 'student' ? 'active' : ''}`}
                                                onClick={() => setBulkRole('student')}
                                            ><FaGraduationCap /> Student</button>
                                            <button
                                                className={`role-toggle-btn ${bulkRole === 'teacher' ? 'active' : ''}`}
                                                onClick={() => setBulkRole('teacher')}
                                            ><FaChalkboardTeacher /> Teacher</button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Paste Emails (one per line)</label>
                                        <textarea
                                            className="bulk-textarea"
                                            placeholder={`student1@school.edu, John Smith\nstudent2@school.edu\nteacher@school.edu, Ms. Jones, teacher`}
                                            value={bulkText}
                                            onChange={e => setBulkText(e.target.value)}
                                            rows={8}
                                        />
                                    </div>

                                    <Button variant="primary" className="add-btn-full" onClick={handleBulkTextParse}>
                                        <FaSearch /> Parse & Preview
                                    </Button>
                                </Card>

                                {/* Preview Panel */}
                                <div className="bulk-preview-panel">
                                    <div className="queue-header">
                                        <h3>Preview <span className="queue-count">{csvPreview.length}</span></h3>
                                        {csvPreview.length > 0 && (
                                            <Button variant="primary" size="sm" onClick={addCsvToPending}>
                                                <FaCheck /> Add to Queue
                                            </Button>
                                        )}
                                    </div>

                                    {csvPreview.length === 0 ? (
                                        <div className="queue-empty">
                                            <FaUpload />
                                            <p>Upload a CSV or paste emails to see a preview here before sending.</p>
                                        </div>
                                    ) : (
                                        <div className="preview-list">
                                            {csvPreview.map((user, i) => (
                                                <motion.div
                                                    key={user.id}
                                                    className="preview-item"
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                >
                                                    <div className={`queue-role-dot role-${user.role}`} />
                                                    <div className="queue-info">
                                                        <div className="queue-email">{user.email}</div>
                                                        {user.name && <div className="queue-meta">{user.name}</div>}
                                                    </div>
                                                    <span className={`role-badge-sm role-${user.role}`}>{user.role}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pending Queue Summary */}
                                    {pendingUsers.length > 0 && (
                                        <div className="queue-summary">
                                            <div className="summary-info">
                                                <FaEnvelope />
                                                <span>{pendingUsers.length} users ready to invite</span>
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleSendInvites}
                                                disabled={isSending}
                                            >
                                                {isSending ? <FaSpinner className="spin" /> : <FaEnvelope />}
                                                Send Invites
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
