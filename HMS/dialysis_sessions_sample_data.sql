-- Sample Realistic Dialysis Session Data
-- This script inserts 50 realistic dialysis sessions with varying statuses and data

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM dialysis_session;

-- Insert Sample Sessions
-- Note: Adjust patient_national_id, patient_name, admission_id, and machine_id to match your existing data

-- COMPLETED Sessions (20 records)
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2024-001', '850123456V', 'John Silva', 'ADM-2024-001', '2024-10-01', '08:00', '12:00', '08:15', '12:05', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '72.5', '70.2', '2300', '150/95', '135/85', 'Ward 4', true, NOW(), NOW()),
('DS-2024-002', '920456789V', 'Mary Fernando', 'ADM-2024-002', '2024-10-01', '13:00', '17:00', '13:10', '17:15', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '68.3', '66.1', '2200', '145/90', '130/82', 'Ward 4', true, NOW(), NOW()),
('DS-2024-003', '780234567V', 'David Perera', 'ADM-2024-003', '2024-10-02', '08:00', '12:00', '08:05', '12:10', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '85.4', '82.8', '2600', '160/100', '140/88', 'Ward 4', true, NOW(), NOW()),
('DS-2024-004', '881122334V', 'Sarah Wickramasinghe', 'ADM-2024-004', '2024-10-02', '13:00', '17:00', '13:20', '17:05', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '59.2', '57.5', '1700', '138/85', '125/78', 'Ward 4', true, NOW(), NOW()),
('DS-2024-005', '950987654V', 'Ahmed Hassan', 'ADM-2024-005', '2024-10-03', '08:00', '12:00', '08:10', '12:15', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.9', '76.3', '2600', '155/92', '138/84', 'Ward 4', true, NOW(), NOW()),
('DS-2024-006', '870345678V', 'Lakshmi Patel', 'ADM-2024-006', '2024-10-03', '13:00', '17:00', '13:05', '17:20', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '65.7', '63.4', '2300', '142/88', '128/80', 'Ward 4', true, NOW(), NOW()),
('DS-2024-007', '820567890V', 'Robert De Silva', 'ADM-2024-007', '2024-10-04', '08:00', '12:00', '08:12', '12:08', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '81.2', '78.6', '2600', '158/96', '142/86', 'Ward 4', true, NOW(), NOW()),
('DS-2024-008', '900234567V', 'Priya Jayawardena', 'ADM-2024-008', '2024-10-04', '13:00', '17:00', '13:15', '17:10', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '62.4', '60.2', '2200', '140/87', '126/79', 'Ward 4', true, NOW(), NOW()),
('DS-2024-009', '860789012V', 'Michael Rodrigo', 'ADM-2024-009', '2024-10-05', '08:00', '12:00', '08:08', '12:12', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.8', '73.1', '2700', '152/94', '136/85', 'Ward 4', true, NOW(), NOW()),
('DS-2024-010', '910456123V', 'Nisha Mendis', 'ADM-2024-010', '2024-10-05', '13:00', '17:00', '13:18', '17:15', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '58.9', '56.8', '2100', '136/84', '122/76', 'Ward 4', true, NOW(), NOW()),
('DS-2024-011', '840678901V', 'James Fernando', 'ADM-2024-011', '2024-10-06', '08:00', '12:00', '08:06', '12:18', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '83.5', '80.7', '2800', '162/98', '144/88', 'Ward 4', true, NOW(), NOW()),
('DS-2024-012', '920890123V', 'Amara Wijesinghe', 'ADM-2024-012', '2024-10-06', '13:00', '17:00', '13:12', '17:08', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '67.2', '64.9', '2300', '146/90', '132/82', 'Ward 4', true, NOW(), NOW()),
('DS-2024-013', '870123789V', 'Kumar Rajapakse', 'ADM-2024-013', '2024-10-07', '08:00', '12:00', '08:14', '12:06', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.3', '76.8', '2500', '154/93', '139/85', 'Ward 4', true, NOW(), NOW()),
('DS-2024-014', '950345901V', 'Diana Gunasekara', 'ADM-2024-014', '2024-10-07', '13:00', '17:00', '13:22', '17:12', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '61.8', '59.6', '2200', '141/86', '127/78', 'Ward 4', true, NOW(), NOW()),
('DS-2024-015', '830567234V', 'Hassan Ali', 'ADM-2024-015', '2024-10-08', '08:00', '12:00', '08:11', '12:14', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.6', '75.1', '2500', '149/91', '134/83', 'Ward 4', true, NOW(), NOW()),
('DS-2024-016', '900789456V', 'Kavitha Dissanayake', 'ADM-2024-016', '2024-10-08', '13:00', '17:00', '13:16', '17:18', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '64.5', '62.3', '2200', '143/88', '129/80', 'Ward 4', true, NOW(), NOW()),
('DS-2024-017', '860901234V', 'Peter Mendis', 'ADM-2024-017', '2024-10-09', '08:00', '12:00', '08:09', '12:11', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '82.1', '79.4', '2700', '157/95', '141/87', 'Ward 4', true, NOW(), NOW()),
('DS-2024-018', '940123567V', 'Shamila Perera', 'ADM-2024-018', '2024-10-09', '13:00', '17:00', '13:14', '17:16', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '60.3', '58.1', '2200', '139/85', '125/77', 'Ward 4', true, NOW(), NOW()),
('DS-2024-019', '820345789V', 'Anthony Silva', 'ADM-2024-019', '2024-10-10', '08:00', '12:00', '08:17', '12:09', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.4', '73.9', '2500', '151/92', '137/84', 'Ward 4', true, NOW(), NOW()),
('DS-2024-020', '910567890V', 'Ranjini Fernando', 'ADM-2024-020', '2024-10-10', '13:00', '17:00', '13:11', '17:14', '4h 0m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '66.8', '64.6', '2200', '144/89', '130/81', 'Ward 4', true, NOW(), NOW());

-- IN_PROGRESS Sessions (15 records)
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2024-021', '880234901V', 'Sunil Jayasuriya', 'ADM-2024-021', CURRENT_DATE, '08:00', '12:00', '08:10', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '74.2', NULL, NULL, '148/90', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-022', '960456123V', 'Fatima Khan', 'ADM-2024-022', CURRENT_DATE, '13:00', '17:00', '13:15', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '63.5', NULL, NULL, '142/87', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-023', '850678234V', 'George Fernando', 'ADM-2024-023', CURRENT_DATE, '08:00', '12:00', '08:12', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '80.3', NULL, NULL, '156/94', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-024', '930890456V', 'Kamala Wijeratne', 'ADM-2024-024', CURRENT_DATE, '13:00', '17:00', '13:18', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '59.7', NULL, NULL, '138/84', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-025', '870012345V', 'Anil Rajapakse', 'ADM-2024-025', CURRENT_DATE, '08:00', '12:00', '08:08', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '78.6', NULL, NULL, '153/91', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-026', '950234567V', 'Malini Dissanayake', 'ADM-2024-026', CURRENT_DATE, '13:00', '17:00', '13:14', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '62.9', NULL, NULL, '140/86', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-027', '840456789V', 'Rohan Silva', 'ADM-2024-027', CURRENT_DATE, '08:00', '12:00', '08:16', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '83.7', NULL, NULL, '159/96', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-028', '920678901V', 'Niluka Perera', 'ADM-2024-028', CURRENT_DATE, '13:00', '17:00', '13:20', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '61.4', NULL, NULL, '137/83', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-029', '860890123V', 'Mohamed Ismail', 'ADM-2024-029', CURRENT_DATE, '08:00', '12:00', '08:11', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '75.9', NULL, NULL, '150/92', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-030', '940012456V', 'Chandrika Fernando', 'ADM-2024-030', CURRENT_DATE, '13:00', '17:00', '13:16', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '65.1', NULL, NULL, '145/88', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-031', '830234678V', 'Lakshan Jayawardena', 'ADM-2024-031', CURRENT_DATE, '08:00', '12:00', '08:13', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '81.5', NULL, NULL, '158/95', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-032', '910456890V', 'Sachini Gunaratne', 'ADM-2024-032', CURRENT_DATE, '13:00', '17:00', '13:22', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '58.6', NULL, NULL, '135/82', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-033', '870678012V', 'Tharindu Rodrigo', 'ADM-2024-033', CURRENT_DATE, '08:00', '12:00', '08:14', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '77.2', NULL, NULL, '152/91', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-034', '950890234V', 'Anusha Wijesinghe', 'ADM-2024-034', CURRENT_DATE, '13:00', '17:00', '13:19', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '63.8', NULL, NULL, '141/85', NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-035', '820012567V', 'Dinesh Perera', 'ADM-2024-035', CURRENT_DATE, '08:00', '12:00', '08:09', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '79.8', NULL, NULL, '155/93', NULL, 'Ward 4', true, NOW(), NOW());

-- SCHEDULED Sessions (15 records - future dates)
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2024-036', '900234789V', 'Asanka Silva', 'ADM-2024-036', CURRENT_DATE + INTERVAL '1 day', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-037', '960456901V', 'Nimali Fernando', 'ADM-2024-037', CURRENT_DATE + INTERVAL '1 day', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-038', '840678123V', 'Ranil Jayasuriya', 'ADM-2024-038', CURRENT_DATE + INTERVAL '2 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-039', '920890345V', 'Shanika Perera', 'ADM-2024-039', CURRENT_DATE + INTERVAL '2 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-040', '860012456V', 'Bandula Wickramasinghe', 'ADM-2024-040', CURRENT_DATE + INTERVAL '3 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-041', '940234678V', 'Ramani Dissanayake', 'ADM-2024-041', CURRENT_DATE + INTERVAL '3 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-042', '820456890V', 'Sanjeewa Rodrigo', 'ADM-2024-042', CURRENT_DATE + INTERVAL '4 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-043', '900678012V', 'Yasmin Ahmed', 'ADM-2024-043', CURRENT_DATE + INTERVAL '4 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-044', '870890234V', 'Damith Gunasekara', 'ADM-2024-044', CURRENT_DATE + INTERVAL '5 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-045', '950012567V', 'Kushani Mendis', 'ADM-2024-045', CURRENT_DATE + INTERVAL '5 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-046', '830234789V', 'Thilak Silva', 'ADM-2024-046', CURRENT_DATE + INTERVAL '6 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-047', '910456012V', 'Nirosha Fernando', 'ADM-2024-047', CURRENT_DATE + INTERVAL '6 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-048', '860678234V', 'Chaminda Perera', 'ADM-2024-048', CURRENT_DATE + INTERVAL '7 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-049', '940890456V', 'Dilini Rajapakse', 'ADM-2024-049', CURRENT_DATE + INTERVAL '7 days', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2024-050', '820012678V', 'Nuwan Jayawardena', 'ADM-2024-050', CURRENT_DATE + INTERVAL '8 days', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, 'Ward 4', true, NOW(), NOW());

-- Summary of inserted data:
-- Total Sessions: 50
-- Completed: 20 (with full vital signs and weight data)
-- In Progress: 15 (with pre-treatment data only)
-- Scheduled: 15 (future sessions with no data yet)

COMMIT;
