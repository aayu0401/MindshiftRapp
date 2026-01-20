import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
    data: Array<{ name: string; value: number }>;
}

export function ProgressLineChart({ data }: ProgressChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#b8c5d6" />
                <YAxis stroke="#b8c5d6" />
                <Tooltip
                    contentStyle={{
                        background: '#152844',
                        border: '1px solid rgba(0, 212, 170, 0.3)',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#00d4aa" strokeWidth={2} dot={{ fill: '#00d4aa' }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

interface EngagementBarChartProps {
    data: Array<{ name: string; stories: number; courses: number; assessments: number }>;
}

export function EngagementBarChart({ data }: EngagementBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#b8c5d6" />
                <YAxis stroke="#b8c5d6" />
                <Tooltip
                    contentStyle={{
                        background: '#152844',
                        border: '1px solid rgba(0, 212, 170, 0.3)',
                        borderRadius: '8px'
                    }}
                />
                <Legend />
                <Bar dataKey="stories" fill="#00d4aa" />
                <Bar dataKey="courses" fill="#8b5cf6" />
                <Bar dataKey="assessments" fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
    );
}

interface RiskDistributionProps {
    data: Array<{ name: string; value: number; color: string }>;
}

export function RiskDistributionPieChart({ data }: RiskDistributionProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: '#152844',
                        border: '1px solid rgba(0, 212, 170, 0.3)',
                        borderRadius: '8px'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

interface CompletionRateProps {
    data: Array<{ class: string; completion: number }>;
}

export function CompletionRateChart({ data }: CompletionRateProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#b8c5d6" domain={[0, 100]} />
                <YAxis type="category" dataKey="class" stroke="#b8c5d6" />
                <Tooltip
                    contentStyle={{
                        background: '#152844',
                        border: '1px solid rgba(0, 212, 170, 0.3)',
                        borderRadius: '8px'
                    }}
                />
                <Bar dataKey="completion" fill="#00d4aa" />
            </BarChart>
        </ResponsiveContainer>
    );
}
