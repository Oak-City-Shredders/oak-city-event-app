import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'; // Adjust import based on your setup

interface ErrorBoundaryState {
  error: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode; // Explicitly define children prop
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
    this.sendErrorToServer(error, errorInfo);
  }

  sendErrorToServer = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      await FirebaseAnalytics.logEvent({
        name: 'javascript_error',
        params: {
          message: error.message,
          stack: error.stack || 'No stack',
          componentStack: errorInfo.componentStack || 'No component stack',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error('Failed to send error:', e);
    }
  };

  render() {
    if (this.state.error) {
      return <h1>Something went wrong: {this.state.error}</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
