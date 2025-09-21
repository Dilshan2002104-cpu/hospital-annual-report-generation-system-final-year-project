package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;

public class ErrorResponseDTO {
    private String error;
    private String message;
    private int year;
    private LocalDateTime timestamp;
    private int status;

    public ErrorResponseDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponseDTO(String error, String message, int year, int status) {
        this.error = error;
        this.message = message;
        this.year = year;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}