import React from 'react'

export default function TestPage() {
    return (
        <div style={{ padding: '50px', background: '#0a1628', color: 'white', minHeight: '100vh' }}>
            <h1>Test Page - App is Working!</h1>
            <p>If you can see this, React is rendering correctly.</p>
            <p>Current time: {new Date().toLocaleString()}</p>
        </div>
    )
}
