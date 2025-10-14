import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ClinicPrescriptionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Clinic prescription error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Prescription System Error
            </h2>
            
            <p className="text-gray-600 mb-6">
              Something went wrong with the prescription system. This might be a temporary issue.
            </p>
            
            <button
              onClick={this.handleRetry}
              className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-800 transition-colors flex items-center mx-auto"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ClinicPrescriptionErrorBoundary;