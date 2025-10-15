import React, { useState } from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';

export default function PharmacyReports() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate years for dropdown (current year and previous 5 years)
  const availableYears = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      // API endpoint for annual report PDF
      const endpoint = `/api/pharmacy/reports/annual/${selectedYear}/pdf`;
      const filename = `Pharmacy_Annual_Report_${selectedYear}.pdf`;

      console.log('🔄 Generating pharmacy report for year:', selectedYear);
      console.log('🌐 API endpoint:', endpoint);

      // Check if backend is running first
      try {
        const healthCheck = await fetch('/api/pharmacy/reports/test', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!healthCheck.ok) {
          throw new Error('Backend server is not responding properly. Please ensure the Spring Boot application is running.');
        }
      } catch (networkError) {
        setIsGenerating(false);
        
        if (networkError.message.includes('Failed to fetch') || networkError.name === 'TypeError') {
          alert('Unable to connect to the server. Please check:\n• Spring Boot application is running on port 8080\n• Backend server is accessible\n• No network connectivity issues');
        } else {
          alert(networkError.message);
        }
        return;
      }

      // Make API call to generate and download report
      let response;
      try {
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
      } catch (fetchError) {
        // Handle ERR_BLOCKED_BY_CLIENT specifically
        if (fetchError.message.includes('Failed to fetch')) {
          console.log('🔄 Fetch blocked, trying alternative download method...');
          
          // Try alternative method - direct window.open
          try {
            const downloadUrl = `${window.location.origin}${endpoint}`;
            const newWindow = window.open(downloadUrl, '_blank');
            
            // Check if popup was blocked
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
              throw new Error('Popup blocked. Please allow popups for this site or try downloading directly.');
            }
            
            // Success feedback
            setTimeout(() => {
              setIsGenerating(false);
            }, 1000);
            
            console.log('✅ Report download initiated via direct link');
            return;
            
          } catch (popupError) {
            setIsGenerating(false);
            alert(`Download blocked by browser:\n\n${popupError.message}\n\nPlease:\n• Disable ad blocker for this site\n• Allow popups in browser settings\n• Try downloading manually from: ${endpoint}`);
            return;
          }
        }
        
        // Re-throw other fetch errors
        throw fetchError;
      }
      
      console.log('📡 Response status:', response.status);
      console.log('📄 Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        let errorMessage = '';
        
        // Handle different HTTP status codes
        switch (response.status) {
          case 400:
            errorMessage = 'No data available for the selected year. Please choose a different year with available data.';
            break;
          case 403:
            errorMessage = 'Access denied. Please check security configuration.';
            break;
          case 404:
            errorMessage = 'Report service not found. Please verify the API endpoint is available.';
            break;
          case 500: {
            const serverMessage = response.headers.get('X-Message');
            errorMessage = serverMessage ? `Server error: ${serverMessage}` : 'Internal server error occurred while generating the report.';
            break;
          }
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('❌ API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Get the PDF blob and download it
      const blob = await response.blob();
      console.log('📄 PDF blob size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Server returned an empty PDF file. Please try again.');
      }

      // Check if blob is actually a PDF
      if (blob.type && !blob.type.includes('pdf')) {
        throw new Error('Server returned invalid file type. Expected PDF format.');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ Report downloaded successfully:', filename);

      // Reset after short delay
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);

    } catch (error) {
      console.error('❌ Error generating report:', error);
      setIsGenerating(false);
      
      // Provide user-friendly error messages
      let userMessage = '';
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        // Check if it's likely an ad blocker issue
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT') || 
            window.location.protocol === 'https:' || 
            navigator.userAgent.includes('Chrome')) {
          userMessage = 'Download blocked by ad blocker or browser extension.\n\nPlease:\n• Disable ad blocker for this site\n• Check browser extensions\n• Try in incognito/private mode\n• Whitelist this domain in your ad blocker';
        } else {
          userMessage = 'Unable to connect to the server. Please ensure:\n• The Spring Boot application is running\n• Server is accessible on port 8080\n• No network connectivity issues';
        }
      } else if (error.message.includes('NetworkError') || error.message.includes('ECONNREFUSED')) {
        userMessage = 'Connection refused. Please check if the backend server is running on port 8080.';
      } else if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. The server might be overloaded. Please try again.';
      } else if (error.message.includes('Failed to generate report')) {
        userMessage = error.message.replace('Failed to generate report: ', '');
      } else {
        userMessage = error.message;
      }
      
      alert(`Report Generation Error:\n${userMessage}`);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Reports</h1>
            <p className="text-gray-600 mt-2">
              Generate and download comprehensive annual pharmacy analytics reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Year Selection */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Report Year</h2>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate & Download Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Real Database Integration</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Data Sources:</h4>
              <ul className="space-y-1">
                <li>• Live prescription dispensing records</li>
                <li>• Real-time inventory management data</li>
                <li>• Actual patient transaction records</li>
                <li>• Performance metrics from operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Monthly prescription trend line charts</li>
                <li>• Detailed medication dispensing tables</li>
                <li>• Professional explanatory descriptions</li>
                <li>• Year-over-year comparative analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}