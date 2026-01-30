import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles.css'

// Simple error display
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a1628',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>Error Loading App</h1>
      <pre style={{
        background: '#152844',
        padding: '20px',
        borderRadius: '8px',
        overflow: 'auto',
        color: '#ef4444'
      }}>
        {error.message}
        {'\n\n'}
        {error.stack}
      </pre>
    </div>
  )
}

// Try to load the app
let AppComponent: any

try {
  const AppModule = await import('./App.tsx')
  AppComponent = AppModule.default
} catch (error) {
  console.error('Failed to load App:', error)
  AppComponent = () => <ErrorDisplay error={error as Error} />
}

const root = document.getElementById('root')
if (!root) {
  document.body.innerHTML = '<div style="color: red; padding: 40px;">ERROR: Root element not found!</div>'
} else {
  try {
    createRoot(root).render(
      <StrictMode>
        <BrowserRouter>
          <AppComponent />
        </BrowserRouter>
      </StrictMode>
    )
  } catch (error) {
    console.error('Failed to render:', error)
    root.innerHTML = `
      <div style="background: #0a1628; color: white; padding: 40px; min-height: 100vh;">
        <h1 style="color: #ef4444;">Render Error</h1>
        <pre style="background: #152844; padding: 20px; border-radius: 8px; color: #ef4444;">
${error instanceof Error ? error.message + '\n\n' + error.stack : String(error)}
        </pre>
      </div>
    `
  }
}
