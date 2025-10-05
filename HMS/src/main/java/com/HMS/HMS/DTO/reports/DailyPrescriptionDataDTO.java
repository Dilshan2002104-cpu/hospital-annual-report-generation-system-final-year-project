package com.HMS.HMS.DTO.reports;

import java.time.LocalDate;

public class DailyPrescriptionDataDTO {
    private LocalDate date;
    private String dateLabel;
    private Long total;
    private Long completed;
    private Long pending;
    private Long inProgress;
    private Long ready;
    private Long cancelled;

    public DailyPrescriptionDataDTO() {
    }

    public DailyPrescriptionDataDTO(LocalDate date, String dateLabel, Long total, Long completed,
                                   Long pending, Long inProgress, Long ready, Long cancelled) {
        this.date = date;
        this.dateLabel = dateLabel;
        this.total = total;
        this.completed = completed;
        this.pending = pending;
        this.inProgress = inProgress;
        this.ready = ready;
        this.cancelled = cancelled;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDateLabel() {
        return dateLabel;
    }

    public void setDateLabel(String dateLabel) {
        this.dateLabel = dateLabel;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Long getCompleted() {
        return completed;
    }

    public void setCompleted(Long completed) {
        this.completed = completed;
    }

    public Long getPending() {
        return pending;
    }

    public void setPending(Long pending) {
        this.pending = pending;
    }

    public Long getInProgress() {
        return inProgress;
    }

    public void setInProgress(Long inProgress) {
        this.inProgress = inProgress;
    }

    public Long getReady() {
        return ready;
    }

    public void setReady(Long ready) {
        this.ready = ready;
    }

    public Long getCancelled() {
        return cancelled;
    }

    public void setCancelled(Long cancelled) {
        this.cancelled = cancelled;
    }
}
