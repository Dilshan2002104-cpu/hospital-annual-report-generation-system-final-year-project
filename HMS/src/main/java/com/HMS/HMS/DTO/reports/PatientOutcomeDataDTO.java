package com.HMS.HMS.DTO.reports;

public class PatientOutcomeDataDTO {
    private int totalPatients;
    private int newPatients;
    private int regularPatients;
    private double averageSessionsPerPatient;
    private double treatmentAdherence;
    private ClinicalOutcomesDTO clinicalOutcomes;

    public PatientOutcomeDataDTO() {}

    public PatientOutcomeDataDTO(int totalPatients, int newPatients, int regularPatients,
                                 double averageSessionsPerPatient, double treatmentAdherence,
                                 ClinicalOutcomesDTO clinicalOutcomes) {
        this.totalPatients = totalPatients;
        this.newPatients = newPatients;
        this.regularPatients = regularPatients;
        this.averageSessionsPerPatient = averageSessionsPerPatient;
        this.treatmentAdherence = treatmentAdherence;
        this.clinicalOutcomes = clinicalOutcomes;
    }

    // Getters and setters
    public int getTotalPatients() { return totalPatients; }
    public void setTotalPatients(int totalPatients) { this.totalPatients = totalPatients; }

    public int getNewPatients() { return newPatients; }
    public void setNewPatients(int newPatients) { this.newPatients = newPatients; }

    public int getRegularPatients() { return regularPatients; }
    public void setRegularPatients(int regularPatients) { this.regularPatients = regularPatients; }

    public double getAverageSessionsPerPatient() { return averageSessionsPerPatient; }
    public void setAverageSessionsPerPatient(double averageSessionsPerPatient) { this.averageSessionsPerPatient = averageSessionsPerPatient; }

    public double getTreatmentAdherence() { return treatmentAdherence; }
    public void setTreatmentAdherence(double treatmentAdherence) { this.treatmentAdherence = treatmentAdherence; }

    public ClinicalOutcomesDTO getClinicalOutcomes() { return clinicalOutcomes; }
    public void setClinicalOutcomes(ClinicalOutcomesDTO clinicalOutcomes) { this.clinicalOutcomes = clinicalOutcomes; }

    public static class ClinicalOutcomesDTO {
        private int excellent;
        private int good;
        private int fair;
        private int poor;

        public ClinicalOutcomesDTO() {}

        public ClinicalOutcomesDTO(int excellent, int good, int fair, int poor) {
            this.excellent = excellent;
            this.good = good;
            this.fair = fair;
            this.poor = poor;
        }

        // Getters and setters
        public int getExcellent() { return excellent; }
        public void setExcellent(int excellent) { this.excellent = excellent; }

        public int getGood() { return good; }
        public void setGood(int good) { this.good = good; }

        public int getFair() { return fair; }
        public void setFair(int fair) { this.fair = fair; }

        public int getPoor() { return poor; }
        public void setPoor(int poor) { this.poor = poor; }
    }
}