// src/components/DebugErrorBoundary.js
import React, { Component } from 'react';

/**
 * Error boundary component to catch and handle errors gracefully
 * Especially useful for tracking down the "message channel closed" error
 */
class DebugErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };

    // Keep an error log for debugging
    this.errorLog = [];
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Add to error log for debugging
    this.errorLog.push({
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // You could also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <button 
            onClick={() => {
              // Reset the error boundary state
              this.setState({ hasError: false, error: null, errorInfo: null });
              // Force reload the application
              window.location.reload();
            }}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: '#0071e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default DebugErrorBoundary;