import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import Button from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary-container">
                    <Card variant="glass" className="error-boundary-card">
                        <div className="error-icon">⚠️</div>
                        <h2>Oops! Something went wrong</h2>
                        <p className="error-message">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>
                        {this.state.error && (
                            <details className="error-details">
                                <summary>Error details</summary>
                                <pre>{this.state.error.message}</pre>
                            </details>
                        )}
                        <div className="error-actions">
                            <Button variant="primary" onClick={this.handleReset}>
                                Reload Page
                            </Button>
                            <Button variant="outline" href="/">
                                Go Home
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
