"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate empty fields with modern error display
    if (!formData.employeeId.trim() || !formData.password.trim()) {
      setError(
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-medium text-red-800">
              {!formData.employeeId.trim() && !formData.password.trim()
                ? "Authentication Required"
                : !formData.employeeId.trim()
                ? "Employee ID Missing"
                : "Password Required"
              }
            </span>
            <p className="text-sm text-red-600 mt-0.5">
              {!formData.employeeId.trim() && !formData.password.trim()
                ? "Please provide both your Employee ID and Password to continue"
                : !formData.employeeId.trim()
                ? "Please enter your Employee ID to proceed"
                : "Please enter your password to secure access"
              }
            </p>
          </div>
        </div>
      )
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          empId: formData.employeeId,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      )

      const data = response.data

      if (data.isSuccess) {
        // Store JWT token in localStorage
        localStorage.setItem("adminToken", data.jwtToken)
        
        // Decode JWT to get user info
        const tokenPayload = JSON.parse(atob(data.jwtToken.split('.')[1]))
        localStorage.setItem("empId", tokenPayload.sub)
        localStorage.setItem("role", tokenPayload.role)

        navigate('/admin-dashboard')
        alert("Login successful! Redirecting to dashboard...")
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      
      // Enhanced error handling with specific messages
      if (err.response) {
        const status = err.response.status
        
        switch (status) {
          case 401:
            setError(
              <div className="flex items-center space-x-2">
                <span>Invalid credentials. Please check your Employee ID and password.</span>
              </div>
            )
            break
          case 403:
            setError(
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Access denied. Admin privileges required.</span>
              </div>
            )
            break
          default:
            setError(
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{err.response.data?.message || "An error occurred. Please try again."}</span>
              </div>
            )
        }
      } else if (err.request) {
        setError(
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <span>Network error. Please check your connection and try again.</span>
          </div>
        )
      } else {
        setError(
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>An unexpected error occurred. Please try again.</span>
          </div>
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

    return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="w-full max-w-md">
        {/* Hospital Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg"
              style={{ backgroundColor: "#007BFF" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#343A40" }}>
            Hospital Admin Portal
          </h1>
          <p className="text-sm" style={{ color: "#6C757D" }}>
            National Institute of Nephrology, Dialysis and Transplantation
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-lg shadow-lg p-8 border border-gray-200" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center" style={{ color: "#343A40" }}>
              Admin Login
            </h2>
            <p className="text-center text-sm mt-2" style={{ color: "#6C757D" }}>
              Please sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md border border-red-300 bg-red-50">
                <div className="flex">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Employee ID Field */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium mb-2" style={{ color: "#343A40" }}>
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#6C757D" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your employee ID"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: "#343A40" }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#6C757D" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: "#6C757D" }}>
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium hover:underline transition-colors" style={{ color: "#007BFF" }}>
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-sm"
                style={{
                  backgroundColor: isLoading ? "#6C757D" : "#007BFF",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#0056b3"
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#007BFF"
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#6C757D" }}>
              Secure access to hospital management system
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: "#6C757D" }}>
            © 2024 National Institute of Nephrology, Dialysis and Transplantation
            <br />
            All rights reserved. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  )
}