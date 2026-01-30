import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

// Minimal test component
function TestApp() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a1628',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '40px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#00d4aa' }}>
                ✅ React is Working!
            </h1>
            <p style={{ fontSize: '24px', marginBottom: '40px' }}>
                MindshiftR App - Test Mode
            </p>
            <div style={{
                background: 'rgba(21, 40, 68, 0.8)',
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 212, 170, 0.3)',
                maxWidth: '600px'
            }}>
                <h2 style={{ marginBottom: '16px' }}>Status Check:</h2>
                <p>✅ React 18 loaded</p>
                <p>✅ Vite dev server running</p>
                <p>✅ Styles applied</p>
                <p>✅ Component rendering</p>
                <p style={{ marginTop: '20px', color: '#00d4aa' }}>
                    Time: {new Date().toLocaleString()}
                </p>
            </div>
            <button
                onClick={() => window.location.href = '/full'}
                style={{
                    marginTop: '40px',
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Load Full App
            </button>
        </div>
    )
}

const root = document.getElementById('root')
if (root) {
    createRoot(root).render(
        <StrictMode>
            <TestApp />
        </StrictMode>
    )
} else {
    console.error('Root element not found!')
}
