package com.HMS.HMS.DTO.reports;

public class QualityMetricsDTO {
    private double infectionRate;
    private double complicationRate;
    private double patientSatisfaction;
    private double staffCompliance;
    private double equipmentReliability;
    private double protocolAdherence;

    public QualityMetricsDTO() {}

    public QualityMetricsDTO(double infectionRate, double complicationRate, double patientSatisfaction,
                             double staffCompliance, double equipmentReliability, double protocolAdherence) {
        this.infectionRate = infectionRate;
        this.complicationRate = complicationRate;
        this.patientSatisfaction = patientSatisfaction;
        this.staffCompliance = staffCompliance;
        this.equipmentReliability = equipmentReliability;
        this.protocolAdherence = protocolAdherence;
    }

    // Getters and setters
    public double getInfectionRate() { return infectionRate; }
    public void setInfectionRate(double infectionRate) { this.infectionRate = infectionRate; }

    public double getComplicationRate() { return complicationRate; }
    public void setComplicationRate(double complicationRate) { this.complicationRate = complicationRate; }

    public double getPatientSatisfaction() { return patientSatisfaction; }
    public void setPatientSatisfaction(double patientSatisfaction) { this.patientSatisfaction = patientSatisfaction; }

    public double getStaffCompliance() { return staffCompliance; }
    public void setStaffCompliance(double staffCompliance) { this.staffCompliance = staffCompliance; }

    public double getEquipmentReliability() { return equipmentReliability; }
    public void setEquipmentReliability(double equipmentReliability) { this.equipmentReliability = equipmentReliability; }

    public double getProtocolAdherence() { return protocolAdherence; }
    public void setProtocolAdherence(double protocolAdherence) { this.protocolAdherence = protocolAdherence; }
}