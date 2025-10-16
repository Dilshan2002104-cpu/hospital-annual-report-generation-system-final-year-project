package com.HMS.HMS.service;

import com.HMS.HMS.DTO.LabRequest.TestResultSubmissionDTO;
import com.HMS.HMS.DTO.LabRequest.TestResultResponseDTO;
import com.HMS.HMS.model.LabRequest.*;
import com.HMS.HMS.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TestResultService {
    
    @Autowired
    private TestResultRepository testResultRepository;
    
    @Autowired
    private BloodGlucoseResultRepository bloodGlucoseResultRepository;
    
    @Autowired
    private CompleteBloodCountResultRepository cbcResultRepository;
    
    @Autowired
    private UrineAnalysisResultRepository urineAnalysisResultRepository;
    
    @Autowired
    private CholesterolLevelResultRepository cholesterolResultRepository;
    
    @Autowired
    private LabRequestRepository labRequestRepository;
    
    @Transactional
    public Map<String, Object> saveTestResults(TestResultSubmissionDTO submissionDTO) {
        try {
            System.out.println("=== Starting test result save process ===");
            System.out.println("Request ID: " + submissionDTO.getRequestId());
            System.out.println("Results: " + submissionDTO.getResults());
            
            // Get the lab request to extract patient and ward information
            Optional<LabRequest> labRequestOpt = labRequestRepository.findByRequestId(submissionDTO.getRequestId());
            if (!labRequestOpt.isPresent()) {
                System.err.println("Lab request not found for ID: " + submissionDTO.getRequestId());
                throw new RuntimeException("Lab request not found for ID: " + submissionDTO.getRequestId());
            }
            
            LabRequest labRequest = labRequestOpt.get();
            System.out.println("Found lab request: " + labRequest.getPatientName());
            
            Map<String, Object> response = new HashMap<>();
            List<TestResultResponseDTO> savedResults = new ArrayList<>();
            
            // Parse completion date
            LocalDateTime completedAt;
            try {
                completedAt = LocalDateTime.parse(submissionDTO.getCompletedAt(), 
                                                              DateTimeFormatter.ISO_DATE_TIME);
                System.out.println("Parsed completion date: " + completedAt);
            } catch (Exception e) {
                System.err.println("Error parsing date: " + submissionDTO.getCompletedAt());
                throw new RuntimeException("Invalid completion date format: " + submissionDTO.getCompletedAt());
            }
            
            // Process each test result
            for (Map.Entry<String, Map<String, Object>> entry : submissionDTO.getResults().entrySet()) {
                String testName = entry.getKey();
                Map<String, Object> testResults = entry.getValue();
                
                System.out.println("Processing test: " + testName);
                System.out.println("Test results: " + testResults);
                
                // Skip if no results for this test
                if (testResults == null || testResults.isEmpty()) {
                    System.out.println("Skipping empty test results for: " + testName);
                    continue;
                }
                
                try {
                    // Create main test result record
                    TestResult testResult = new TestResult(
                        submissionDTO.getRequestId(),
                        testName,
                        labRequest.getPatientNationalId(),
                        labRequest.getPatientName(),
                        labRequest.getWardName(),
                        submissionDTO.getCompletedBy(),
                        completedAt,
                        submissionDTO.getNotes()
                    );
                    
                    System.out.println("Saving test result to database...");
                    testResult = testResultRepository.save(testResult);
                    System.out.println("Test result saved with ID: " + testResult.getId());
                    
                    // Save specific test results based on test type
                    Map<String, Object> specificResults = saveSpecificTestResult(testResult, testName, testResults);
                    System.out.println("Specific results saved: " + specificResults);
                    
                    // Create response DTO
                    TestResultResponseDTO responseDTO = new TestResultResponseDTO(
                        testResult.getId(),
                        testResult.getRequestId(),
                        testResult.getTestName(),
                        testResult.getPatientNationalId(),
                        testResult.getPatientName(),
                        testResult.getWardName(),
                        testResult.getCompletedBy(),
                        testResult.getCompletedAt(),
                        testResult.getNotes(),
                        specificResults
                    );
                    
                    savedResults.add(responseDTO);
                    System.out.println("Successfully processed test: " + testName);
                    
                } catch (Exception e) {
                    System.err.println("Error processing test " + testName + ": " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Failed to save test result for " + testName + ": " + e.getMessage());
                }
            }
            
            response.put("success", true);
            response.put("message", "Test results saved successfully");
            response.put("results", savedResults);
            response.put("totalResults", savedResults.size());
            
            System.out.println("=== Test result save process completed successfully ===");
            return response;
            
        } catch (Exception e) {
            System.err.println("=== Error in test result save process ===");
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to save test results: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            return errorResponse;
        }
    }
    
    private Map<String, Object> saveSpecificTestResult(TestResult testResult, String testName, 
                                                      Map<String, Object> testResults) {
        Map<String, Object> specificResults = new HashMap<>();
        
        try {
            System.out.println("Saving specific test result for: " + testName);
            
            switch (testName) {
                case "Blood Glucose":
                    BloodGlucoseResult glucoseResult = new BloodGlucoseResult(
                        testResult,
                        getDoubleValue(testResults, "glucose"),
                        (String) testResults.get("testType")
                    );
                    glucoseResult = bloodGlucoseResultRepository.save(glucoseResult);
                    specificResults.put("glucoseLevel", glucoseResult.getGlucoseLevel());
                    specificResults.put("testType", glucoseResult.getTestType());
                    break;
                
            case "Complete Blood Count":
                CompleteBloodCountResult cbcResult = new CompleteBloodCountResult(
                    testResult,
                    getDoubleValue(testResults, "wbc"),
                    getDoubleValue(testResults, "rbc"),
                    getDoubleValue(testResults, "hemoglobin"),
                    getIntegerValue(testResults, "platelets")
                );
                cbcResult = cbcResultRepository.save(cbcResult);
                specificResults.put("wbc", cbcResult.getWbc());
                specificResults.put("rbc", cbcResult.getRbc());
                specificResults.put("hemoglobin", cbcResult.getHemoglobin());
                specificResults.put("platelets", cbcResult.getPlatelets());
                break;
                
            case "Urine Analysis":
                UrineAnalysisResult urineResult = new UrineAnalysisResult(
                    testResult,
                    (String) testResults.get("protein"),
                    (String) testResults.get("urineGlucose"),
                    getDoubleValue(testResults, "specificGravity"),
                    getDoubleValue(testResults, "ph")
                );
                urineResult = urineAnalysisResultRepository.save(urineResult);
                specificResults.put("protein", urineResult.getProtein());
                specificResults.put("urineGlucose", urineResult.getUrineGlucose());
                specificResults.put("specificGravity", urineResult.getSpecificGravity());
                specificResults.put("ph", urineResult.getPh());
                break;
                
            case "Cholesterol Level":
                CholesterolLevelResult cholesterolResult = new CholesterolLevelResult(
                    testResult,
                    getIntegerValue(testResults, "totalCholesterol"),
                    getIntegerValue(testResults, "hdlCholesterol"),
                    getIntegerValue(testResults, "ldlCholesterol"),
                    getIntegerValue(testResults, "triglycerides")
                );
                cholesterolResult = cholesterolResultRepository.save(cholesterolResult);
                specificResults.put("totalCholesterol", cholesterolResult.getTotalCholesterol());
                specificResults.put("hdlCholesterol", cholesterolResult.getHdlCholesterol());
                specificResults.put("ldlCholesterol", cholesterolResult.getLdlCholesterol());
                specificResults.put("triglycerides", cholesterolResult.getTriglycerides());
                break;
            }
            
            return specificResults;
            
        } catch (Exception e) {
            System.err.println("Error saving specific test result for " + testName + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save specific test result for " + testName + ": " + e.getMessage());
        }
    }
    
    public List<TestResultResponseDTO> getTestResultsByPatient(String patientNationalId) {
        List<TestResult> testResults = testResultRepository.findByPatientNationalIdOrderByCompletedAtDesc(patientNationalId);
        return convertToResponseDTOs(testResults);
    }
    
    public List<TestResultResponseDTO> getTestResultsByRequestId(String requestId) {
        List<TestResult> testResults = testResultRepository.findByRequestId(requestId);
        return convertToResponseDTOs(testResults);
    }
    
    public List<TestResultResponseDTO> getRecentTestResultsByPatient(String patientNationalId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<TestResult> testResults = testResultRepository.findRecentTestResultsByPatient(patientNationalId, thirtyDaysAgo);
        return convertToResponseDTOs(testResults);
    }
    
    private List<TestResultResponseDTO> convertToResponseDTOs(List<TestResult> testResults) {
        List<TestResultResponseDTO> responseDTOs = new ArrayList<>();
        
        for (TestResult testResult : testResults) {
            Map<String, Object> specificResults = getSpecificTestResults(testResult);
            
            TestResultResponseDTO dto = new TestResultResponseDTO(
                testResult.getId(),
                testResult.getRequestId(),
                testResult.getTestName(),
                testResult.getPatientNationalId(),
                testResult.getPatientName(),
                testResult.getWardName(),
                testResult.getCompletedBy(),
                testResult.getCompletedAt(),
                testResult.getNotes(),
                specificResults
            );
            
            responseDTOs.add(dto);
        }
        
        return responseDTOs;
    }
    
    private Map<String, Object> getSpecificTestResults(TestResult testResult) {
        Map<String, Object> specificResults = new HashMap<>();
        
        switch (testResult.getTestName()) {
            case "Blood Glucose":
                BloodGlucoseResult glucoseResult = bloodGlucoseResultRepository.findByTestResultId(testResult.getId());
                if (glucoseResult != null) {
                    specificResults.put("glucoseLevel", glucoseResult.getGlucoseLevel());
                    specificResults.put("testType", glucoseResult.getTestType());
                }
                break;
                
            case "Complete Blood Count":
                CompleteBloodCountResult cbcResult = cbcResultRepository.findByTestResultId(testResult.getId());
                if (cbcResult != null) {
                    specificResults.put("wbc", cbcResult.getWbc());
                    specificResults.put("rbc", cbcResult.getRbc());
                    specificResults.put("hemoglobin", cbcResult.getHemoglobin());
                    specificResults.put("platelets", cbcResult.getPlatelets());
                }
                break;
                
            case "Urine Analysis":
                UrineAnalysisResult urineResult = urineAnalysisResultRepository.findByTestResultId(testResult.getId());
                if (urineResult != null) {
                    specificResults.put("protein", urineResult.getProtein());
                    specificResults.put("urineGlucose", urineResult.getUrineGlucose());
                    specificResults.put("specificGravity", urineResult.getSpecificGravity());
                    specificResults.put("ph", urineResult.getPh());
                }
                break;
                
            case "Cholesterol Level":
                CholesterolLevelResult cholesterolResult = cholesterolResultRepository.findByTestResultId(testResult.getId());
                if (cholesterolResult != null) {
                    specificResults.put("totalCholesterol", cholesterolResult.getTotalCholesterol());
                    specificResults.put("hdlCholesterol", cholesterolResult.getHdlCholesterol());
                    specificResults.put("ldlCholesterol", cholesterolResult.getLdlCholesterol());
                    specificResults.put("triglycerides", cholesterolResult.getTriglycerides());
                }
                break;
        }
        
        return specificResults;
    }
    
    /**
     * Get all test results in the system
     */
    public List<TestResultResponseDTO> getAllTestResults() {
        try {
            List<TestResult> testResults = testResultRepository.findAll();
            List<TestResultResponseDTO> responseList = new ArrayList<>();
            
            for (TestResult testResult : testResults) {
                Map<String, Object> specificResults = getSpecificTestResults(testResult);
                
                TestResultResponseDTO responseDTO = new TestResultResponseDTO(
                    testResult.getId(),
                    testResult.getRequestId(),
                    testResult.getTestName(),
                    testResult.getPatientNationalId(),
                    testResult.getPatientName(),
                    testResult.getWardName(),
                    testResult.getCompletedBy(),
                    testResult.getCompletedAt(),
                    testResult.getNotes(),
                    specificResults
                );
                
                responseList.add(responseDTO);
            }
            
            // Sort by completion date (most recent first)
            responseList.sort((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()));
            
            return responseList;
        } catch (Exception e) {
            System.err.println("Error fetching all test results: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Helper methods for type conversion
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return null;
    }
    
    private Integer getIntegerValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return null;
    }

    /**
     * Create sample test data for demonstration
     */
    public Map<String, Object> createSampleTestData() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<String> sampleResults = new ArrayList<>();
            
            // Sample Blood Glucose Result
            TestResult glucoseTest = new TestResult(
                "LAB-BG001",
                "Blood Glucose",
                "123456789V",
                "John Doe",
                "ICU",
                "Dr. Sarah Lab Tech",
                now.minusHours(2),
                "Fasting glucose test - normal results"
            );
            glucoseTest = testResultRepository.save(glucoseTest);
            
            BloodGlucoseResult glucoseResult = new BloodGlucoseResult(
                glucoseTest,
                95.0,
                "fasting"
            );
            bloodGlucoseResultRepository.save(glucoseResult);
            sampleResults.add("Blood Glucose test for John Doe");

            // Sample Complete Blood Count
            TestResult cbcTest = new TestResult(
                "LAB-CBC002",
                "Complete Blood Count",
                "987654321V",
                "Jane Smith",
                "Cardiology",
                "Dr. Mike Lab Tech", 
                now.minusHours(1),
                "Routine CBC - all parameters normal"
            );
            cbcTest = testResultRepository.save(cbcTest);
            
            CompleteBloodCountResult cbcResult = new CompleteBloodCountResult(
                cbcTest,
                7.5,
                4.8,
                14.2,
                350000
            );
            cbcResultRepository.save(cbcResult);
            sampleResults.add("Complete Blood Count for Jane Smith");

            // Sample Urine Analysis
            TestResult urineTest = new TestResult(
                "LAB-UA003",
                "Urine Analysis",
                "456789123V",
                "Bob Wilson",
                "Nephrology",
                "Dr. Lisa Lab Tech",
                now.minusMinutes(30),
                "Routine urine analysis - no abnormalities detected"
            );
            urineTest = testResultRepository.save(urineTest);
            
            UrineAnalysisResult urineResult = new UrineAnalysisResult(
                urineTest,
                "negative",
                "negative",
                1.020,
                6.5
            );
            urineAnalysisResultRepository.save(urineResult);
            sampleResults.add("Urine Analysis for Bob Wilson");

            // Sample Cholesterol Test
            TestResult cholesterolTest = new TestResult(
                "LAB-CHOL004",
                "Cholesterol Level",
                "789123456V",
                "Alice Johnson",
                "Internal Medicine",
                "Dr. Tom Lab Tech",
                now.minusMinutes(15),
                "Lipid profile - slightly elevated LDL, recommend dietary changes"
            );
            cholesterolTest = testResultRepository.save(cholesterolTest);
            
            CholesterolLevelResult cholesterolResult = new CholesterolLevelResult(
                cholesterolTest,
                220,
                45,
                150,
                125
            );
            cholesterolResultRepository.save(cholesterolResult);
            sampleResults.add("Cholesterol Level for Alice Johnson");

            return Map.of(
                "success", true,
                "message", "Sample test data created successfully",
                "createdTests", sampleResults.size(),
                "tests", sampleResults
            );
            
        } catch (Exception e) {
            System.err.println("Error creating sample test data: " + e.getMessage());
            e.printStackTrace();
            return Map.of(
                "success", false,
                "message", "Failed to create sample data: " + e.getMessage()
            );
        }
    }
}