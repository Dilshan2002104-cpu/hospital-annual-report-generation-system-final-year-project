-- Sample realistic hospital data for testing the fixed PDF reports

-- First, add some doctors
INSERT INTO doctors (employee_id, first_name, last_name, specialization, email, phone_number, qualification, experience) VALUES
(101, 'Dr. Sarah', 'Johnson', 'Nephrology', 'sarah.johnson@hospital.com', '077-1234567', 'MD, PhD Nephrology', 15),
(102, 'Dr. Michael', 'Chen', 'Nephrology', 'michael.chen@hospital.com', '077-1234568', 'MD, Nephrology', 12),
(103, 'Dr. Emily', 'Williams', 'Urology', 'emily.williams@hospital.com', '077-1234569', 'MD, MS Urology', 8),
(104, 'Dr. David', 'Brown', 'Internal Medicine', 'david.brown@hospital.com', '077-1234570', 'MD, Internal Medicine', 10),
(105, 'Dr. Lisa', 'Davis', 'Vascular Surgery', 'lisa.davis@hospital.com', '077-1234571', 'MD, MS Vascular Surgery', 7);

-- Add some patients
INSERT INTO patients (national_id, first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone) VALUES
(123456789012, 'John', 'Smith', '1985-05-15', 'MALE', '123 Main St, Colombo', '077-9876543', 'john.smith@email.com', 'Jane Smith', '077-9876544'),
(123456789013, 'Mary', 'Johnson', '1978-09-22', 'FEMALE', '456 Oak Ave, Kandy', '077-9876545', 'mary.johnson@email.com', 'Robert Johnson', '077-9876546'),
(123456789014, 'Robert', 'Wilson', '1992-03-10', 'MALE', '789 Pine Rd, Galle', '077-9876547', 'robert.wilson@email.com', 'Susan Wilson', '077-9876548'),
(123456789015, 'Sarah', 'Brown', '1965-12-05', 'FEMALE', '321 Elm St, Matara', '077-9876549', 'sarah.brown@email.com', 'Michael Brown', '077-9876550'),
(123456789016, 'Michael', 'Davis', '1990-07-18', 'MALE', '654 Maple Dr, Negombo', '077-9876551', 'michael.davis@email.com', 'Lisa Davis', '077-9876552'),
(123456789017, 'Jennifer', 'Miller', '1983-11-30', 'FEMALE', '987 Cedar Ave, Jaffna', '077-9876553', 'jennifer.miller@email.com', 'Paul Miller', '077-9876554'),
(123456789018, 'Christopher', 'Garcia', '1975-01-12', 'MALE', '147 Birch St, Trincomalee', '077-9876555', 'chris.garcia@email.com', 'Maria Garcia', '077-9876556'),
(123456789019, 'Amanda', 'Rodriguez', '1988-04-25', 'FEMALE', '258 Walnut Rd, Anuradhapura', '077-9876557', 'amanda.rodriguez@email.com', 'Carlos Rodriguez', '077-9876558'),
(123456789020, 'Daniel', 'Martinez', '1995-08-07', 'MALE', '369 Spruce Ave, Polonnaruwa', '077-9876559', 'daniel.martinez@email.com', 'Rosa Martinez', '077-9876560'),
(123456789021, 'Jessica', 'Anderson', '1980-06-14', 'FEMALE', '741 Fir St, Sigiriya', '077-9876561', 'jessica.anderson@email.com', 'Mark Anderson', '077-9876562');

-- Add appointments for 2024 (realistic distribution across months)
-- January 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789012, 101, '2024-01-15', '09:00:00', 'FOLLOW_UP', 'COMPLETED', 'Kidney function check'),
(123456789013, 101, '2024-01-18', '10:30:00', 'NEW_PATIENT', 'COMPLETED', 'Chronic kidney disease consultation'),
(123456789014, 102, '2024-01-22', '14:00:00', 'FOLLOW_UP', 'COMPLETED', 'Post-treatment evaluation'),
(123456789015, 103, '2024-01-25', '11:15:00', 'NEW_PATIENT', 'COMPLETED', 'Urological consultation'),
(123456789016, 104, '2024-01-28', '15:45:00', 'FOLLOW_UP', 'COMPLETED', 'General check-up');

-- February 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789017, 101, '2024-02-05', '09:30:00', 'FOLLOW_UP', 'COMPLETED', 'Dialysis assessment'),
(123456789018, 102, '2024-02-08', '13:00:00', 'NEW_PATIENT', 'COMPLETED', 'Kidney transplant evaluation'),
(123456789019, 105, '2024-02-12', '10:00:00', 'FOLLOW_UP', 'COMPLETED', 'Vascular access review'),
(123456789020, 101, '2024-02-15', '16:30:00', 'FOLLOW_UP', 'COMPLETED', 'Medication adjustment'),
(123456789021, 103, '2024-02-20', '11:45:00', 'NEW_PATIENT', 'COMPLETED', 'Bladder dysfunction'),
(123456789012, 102, '2024-02-25', '14:15:00', 'FOLLOW_UP', 'COMPLETED', 'Lab results review');

-- March 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789013, 101, '2024-03-03', '08:45:00', 'FOLLOW_UP', 'COMPLETED', 'CKD progression monitoring'),
(123456789014, 105, '2024-03-07', '12:30:00', 'NEW_PATIENT', 'COMPLETED', 'Arteriovenous fistula assessment'),
(123456789015, 102, '2024-03-10', '15:00:00', 'FOLLOW_UP', 'COMPLETED', 'Pre-dialysis preparation'),
(123456789016, 101, '2024-03-14', '09:15:00', 'FOLLOW_UP', 'COMPLETED', 'Blood pressure management'),
(123456789017, 104, '2024-03-18', '13:45:00', 'NEW_PATIENT', 'COMPLETED', 'Diabetes and kidney disease'),
(123456789018, 103, '2024-03-22', '10:30:00', 'FOLLOW_UP', 'COMPLETED', 'Post-operative follow-up'),
(123456789019, 101, '2024-03-26', '16:00:00', 'FOLLOW_UP', 'COMPLETED', 'Anemia management'),
(123456789020, 102, '2024-03-29', '11:00:00', 'FOLLOW_UP', 'COMPLETED', 'Transplant readiness assessment');

-- April 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789021, 101, '2024-04-02', '09:00:00', 'FOLLOW_UP', 'COMPLETED', 'Dialysis adequacy review'),
(123456789012, 105, '2024-04-05', '14:30:00', 'NEW_PATIENT', 'COMPLETED', 'Vascular complications'),
(123456789013, 102, '2024-04-09', '10:15:00', 'FOLLOW_UP', 'COMPLETED', 'Immunosuppression monitoring'),
(123456789014, 104, '2024-04-12', '15:45:00', 'FOLLOW_UP', 'COMPLETED', 'Cardiac risk assessment'),
(123456789015, 101, '2024-04-16', '08:30:00', 'FOLLOW_UP', 'COMPLETED', 'Bone disease management'),
(123456789016, 103, '2024-04-19', '12:00:00', 'NEW_PATIENT', 'COMPLETED', 'Kidney stone evaluation'),
(123456789017, 102, '2024-04-23', '16:15:00', 'FOLLOW_UP', 'COMPLETED', 'Post-transplant surveillance'),
(123456789018, 101, '2024-04-26', '11:30:00', 'FOLLOW_UP', 'COMPLETED', 'Fluid management'),
(123456789019, 105, '2024-04-30', '13:15:00', 'FOLLOW_UP', 'COMPLETED', 'Access dysfunction');

-- May 2024 (higher volume month)
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789020, 101, '2024-05-03', '09:45:00', 'FOLLOW_UP', 'COMPLETED', 'Peritoneal dialysis review'),
(123456789021, 102, '2024-05-06', '14:00:00', 'NEW_PATIENT', 'COMPLETED', 'Living donor evaluation'),
(123456789012, 104, '2024-05-10', '10:30:00', 'FOLLOW_UP', 'COMPLETED', 'Hypertension control'),
(123456789013, 103, '2024-05-13', '15:30:00', 'FOLLOW_UP', 'COMPLETED', 'Urinary tract infection'),
(123456789014, 101, '2024-05-17', '08:15:00', 'FOLLOW_UP', 'COMPLETED', 'Mineral bone disorder'),
(123456789015, 105, '2024-05-20', '12:45:00', 'NEW_PATIENT', 'COMPLETED', 'Peripheral vascular disease'),
(123456789016, 102, '2024-05-24', '16:00:00', 'FOLLOW_UP', 'COMPLETED', 'Graft function monitoring'),
(123456789017, 101, '2024-05-27', '11:15:00', 'FOLLOW_UP', 'COMPLETED', 'Electrolyte imbalance'),
(123456789018, 104, '2024-05-31', '13:30:00', 'FOLLOW_UP', 'COMPLETED', 'Cardiovascular screening');

-- Continue with remaining months (June-December) with varying volumes
-- June 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789019, 101, '2024-06-04', '09:30:00', 'FOLLOW_UP', 'COMPLETED', 'Dialysis access planning'),
(123456789020, 103, '2024-06-07', '14:15:00', 'NEW_PATIENT', 'COMPLETED', 'Prostate and kidney issues'),
(123456789021, 102, '2024-06-11', '10:45:00', 'FOLLOW_UP', 'COMPLETED', 'Rejection surveillance'),
(123456789012, 105, '2024-06-14', '15:00:00', 'FOLLOW_UP', 'COMPLETED', 'Stenosis evaluation'),
(123456789013, 101, '2024-06-18', '08:00:00', 'FOLLOW_UP', 'COMPLETED', 'Phosphorus management'),
(123456789014, 104, '2024-06-21', '12:30:00', 'FOLLOW_UP', 'COMPLETED', 'Diabetes monitoring'),
(123456789015, 102, '2024-06-25', '16:45:00', 'FOLLOW_UP', 'COMPLETED', 'BK virus screening'),
(123456789016, 101, '2024-06-28', '11:00:00', 'FOLLOW_UP', 'COMPLETED', 'Calcium metabolism');

-- July 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789017, 103, '2024-07-02', '09:15:00', 'FOLLOW_UP', 'COMPLETED', 'Bladder capacity assessment'),
(123456789018, 101, '2024-07-05', '13:45:00', 'FOLLOW_UP', 'COMPLETED', 'Hemodialysis optimization'),
(123456789019, 105, '2024-07-09', '10:00:00', 'NEW_PATIENT', 'COMPLETED', 'Thrombosis management'),
(123456789020, 102, '2024-07-12', '15:15:00', 'FOLLOW_UP', 'COMPLETED', 'Medication compliance'),
(123456789021, 104, '2024-07-16', '08:45:00', 'FOLLOW_UP', 'COMPLETED', 'Risk factor modification'),
(123456789012, 101, '2024-07-19', '12:15:00', 'FOLLOW_UP', 'COMPLETED', 'Quality of life assessment'),
(123456789013, 103, '2024-07-23', '16:30:00', 'FOLLOW_UP', 'COMPLETED', 'Sexual dysfunction'),
(123456789014, 105, '2024-07-26', '11:30:00', 'FOLLOW_UP', 'COMPLETED', 'Access salvage procedure'),
(123456789015, 101, '2024-07-30', '14:00:00', 'FOLLOW_UP', 'COMPLETED', 'Nutritional counseling');

-- August 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789016, 102, '2024-08-02', '09:00:00', 'FOLLOW_UP', 'COMPLETED', 'Annual transplant review'),
(123456789017, 101, '2024-08-06', '13:00:00', 'FOLLOW_UP', 'COMPLETED', 'Acidosis correction'),
(123456789018, 104, '2024-08-09', '10:30:00', 'FOLLOW_UP', 'COMPLETED', 'Lipid management'),
(123456789019, 103, '2024-08-13', '15:00:00', 'FOLLOW_UP', 'COMPLETED', 'Incontinence treatment'),
(123456789020, 105, '2024-08-16', '08:30:00', 'NEW_PATIENT', 'COMPLETED', 'Aneurysm screening'),
(123456789021, 101, '2024-08-20', '12:45:00', 'FOLLOW_UP', 'COMPLETED', 'Iron deficiency treatment'),
(123456789012, 102, '2024-08-23', '16:15:00', 'FOLLOW_UP', 'COMPLETED', 'CNI toxicity monitoring'),
(123456789013, 104, '2024-08-27', '11:15:00', 'FOLLOW_UP', 'COMPLETED', 'Sleep disorder evaluation'),
(123456789014, 101, '2024-08-30', '14:30:00', 'FOLLOW_UP', 'COMPLETED', 'Home dialysis training');

-- September 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789015, 103, '2024-09-03', '09:30:00', 'FOLLOW_UP', 'COMPLETED', 'Post-surgical complications'),
(123456789016, 101, '2024-09-06', '13:30:00', 'FOLLOW_UP', 'COMPLETED', 'Vitamin D deficiency'),
(123456789017, 105, '2024-09-10', '10:15:00', 'FOLLOW_UP', 'COMPLETED', 'Graft surveillance'),
(123456789018, 102, '2024-09-13', '15:45:00', 'FOLLOW_UP', 'COMPLETED', 'Infection prophylaxis'),
(123456789019, 104, '2024-09-17', '08:15:00', 'FOLLOW_UP', 'COMPLETED', 'Metabolic acidosis'),
(123456789020, 101, '2024-09-20', '12:00:00', 'FOLLOW_UP', 'COMPLETED', 'Dialysis adequacy'),
(123456789021, 103, '2024-09-24', '16:00:00', 'NEW_PATIENT', 'COMPLETED', 'Erectile dysfunction'),
(123456789012, 105, '2024-09-27', '11:45:00', 'FOLLOW_UP', 'COMPLETED', 'Balloon angioplasty follow-up');

-- October 2024 (peak month)
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789013, 101, '2024-10-01', '09:00:00', 'FOLLOW_UP', 'COMPLETED', 'Flu vaccination'),
(123456789014, 102, '2024-10-04', '13:15:00', 'FOLLOW_UP', 'COMPLETED', 'Cancer screening'),
(123456789015, 104, '2024-10-08', '10:45:00', 'FOLLOW_UP', 'COMPLETED', 'Bone health assessment'),
(123456789016, 103, '2024-10-11', '15:30:00', 'FOLLOW_UP', 'COMPLETED', 'Kidney stone prevention'),
(123456789017, 101, '2024-10-15', '08:30:00', 'FOLLOW_UP', 'COMPLETED', 'Anemia treatment response'),
(123456789018, 105, '2024-10-18', '12:30:00', 'FOLLOW_UP', 'COMPLETED', 'Access monitoring'),
(123456789019, 102, '2024-10-22', '16:45:00', 'FOLLOW_UP', 'COMPLETED', 'Drug level monitoring'),
(123456789020, 104, '2024-10-25', '11:00:00', 'FOLLOW_UP', 'COMPLETED', 'Exercise counseling'),
(123456789021, 101, '2024-10-29', '14:15:00', 'FOLLOW_UP', 'COMPLETED', 'Pre-holiday check');

-- November 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789012, 103, '2024-11-01', '09:45:00', 'FOLLOW_UP', 'COMPLETED', 'Urodynamic study review'),
(123456789013, 105, '2024-11-05', '13:00:00', 'FOLLOW_UP', 'COMPLETED', 'Endovascular procedure'),
(123456789014, 101, '2024-11-08', '10:30:00', 'FOLLOW_UP', 'COMPLETED', 'Holiday travel preparation'),
(123456789015, 102, '2024-11-12', '15:15:00', 'FOLLOW_UP', 'COMPLETED', 'Annual laboratory review'),
(123456789016, 104, '2024-11-15', '08:45:00', 'FOLLOW_UP', 'COMPLETED', 'Vaccination updates'),
(123456789017, 101, '2024-11-19', '12:15:00', 'FOLLOW_UP', 'COMPLETED', 'Fluid restriction counseling'),
(123456789018, 103, '2024-11-22', '16:30:00', 'FOLLOW_UP', 'COMPLETED', 'Fertility consultation'),
(123456789019, 105, '2024-11-26', '11:30:00', 'FOLLOW_UP', 'COMPLETED', 'Access declotting'),
(123456789020, 102, '2024-11-29', '14:00:00', 'FOLLOW_UP', 'COMPLETED', 'Year-end review');

-- December 2024
INSERT INTO appointments (patient_national_id, doctor_employee_id, appointment_date, appointment_time, appointment_type, status, reason) VALUES
(123456789021, 101, '2024-12-03', '09:15:00', 'FOLLOW_UP', 'COMPLETED', 'Winter care planning'),
(123456789012, 104, '2024-12-06', '13:45:00', 'FOLLOW_UP', 'COMPLETED', 'Blood pressure adjustment'),
(123456789013, 103, '2024-12-10', '10:00:00', 'FOLLOW_UP', 'COMPLETED', 'Prostate monitoring'),
(123456789014, 105, '2024-12-13', '15:00:00', 'FOLLOW_UP', 'COMPLETED', 'Vascular assessment'),
(123456789015, 101, '2024-12-17', '08:00:00', 'FOLLOW_UP', 'COMPLETED', 'End-of-year labs'),
(123456789016, 102, '2024-12-20', '12:30:00', 'FOLLOW_UP', 'COMPLETED', 'Holiday medication management'),
(123456789017, 104, '2024-12-23', '16:15:00', 'FOLLOW_UP', 'COMPLETED', 'New Year planning'),
(123456789018, 101, '2024-12-27', '11:00:00', 'FOLLOW_UP', 'COMPLETED', 'Post-holiday follow-up'),
(123456789019, 103, '2024-12-30', '14:30:00', 'FOLLOW_UP', 'COMPLETED', 'Year-end closure');

-- Add some wards
INSERT INTO ward (ward_name, ward_type, capacity, current_occupancy) VALUES
('Nephrology Ward A', 'GENERAL', 20, 15),
('Nephrology Ward B', 'GENERAL', 25, 18),
('ICU Nephrology', 'ICU', 10, 7),
('Dialysis Unit 1', 'DIALYSIS', 15, 12),
('Transplant Unit', 'SPECIAL', 12, 8);

-- Add some admissions for 2024
INSERT INTO admission (patient_national_id, ward_id, admission_date, discharge_date, admission_reason, status) VALUES
(123456789012, 1, '2024-01-20', '2024-01-25', 'Kidney biopsy procedure', 'DISCHARGED'),
(123456789013, 2, '2024-02-15', '2024-02-20', 'Dialysis catheter placement', 'DISCHARGED'),
(123456789014, 3, '2024-03-10', '2024-03-18', 'Acute kidney injury', 'DISCHARGED'),
(123456789015, 4, '2024-04-05', NULL, 'Chronic dialysis treatment', 'ACTIVE'),
(123456789016, 5, '2024-05-12', '2024-05-20', 'Kidney transplant surgery', 'DISCHARGED'),
(123456789017, 1, '2024-06-08', '2024-06-12', 'Fluid overload management', 'DISCHARGED'),
(123456789018, 2, '2024-07-22', '2024-07-28', 'Infection treatment', 'DISCHARGED'),
(123456789019, 3, '2024-08-14', '2024-08-19', 'Electrolyte imbalance', 'DISCHARGED'),
(123456789020, 4, '2024-09-30', NULL, 'Peritoneal dialysis training', 'ACTIVE'),
(123456789021, 5, '2024-11-15', '2024-11-25', 'Post-transplant complications', 'DISCHARGED');