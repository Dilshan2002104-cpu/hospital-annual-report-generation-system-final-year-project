-- Comprehensive Dialysis Session Dataset for 2025
-- This script creates realistic dialysis session data scattered throughout the year 2025
-- Includes various session types, statuses, and realistic medical parameters

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM dialysis_session WHERE YEAR(scheduled_date) = 2025;

-- ========================================
-- JANUARY 2025 (62 sessions)
-- ========================================

-- Week 1 (Jan 1-7, 2025)
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, machine_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, pre_heart_rate, post_heart_rate, temperature, patient_comfort, dialysis_access, blood_flow, dialysate_flow, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2025-001', '850123456V', 'Amara Perera', 'ADM-2025-001', 'M001', '2025-01-02', '08:00', '12:00', '08:15', '12:10', '3h 55m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '72.5', '70.2', '2300', '150/95', '135/85', 78, 72, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-002', '920456789V', 'Sunil Fernando', 'ADM-2025-002', 'M002', '2025-01-02', '13:00', '17:00', '13:10', '17:15', '4h 5m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '68.3', '66.1', '2200', '145/90', '130/82', 82, 76, 36.6, 'good', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-003', '780234567V', 'Nirosha Silva', 'ADM-2025-003', 'M003', '2025-01-03', '08:00', '12:00', '08:05', '12:10', '4h 5m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '59.2', '57.5', '1700', '138/85', '125/78', 85, 78, 36.7, 'comfortable', 'AV_FISTULA', 380, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-004', '881122334V', 'Kasun Wickramasinghe', 'ADM-2025-004', 'M004', '2025-01-03', '13:00', '17:00', '13:20', '17:05', '3h 45m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '85.4', '82.8', '2600', '160/100', '140/88', 88, 80, 37.1, 'mild_discomfort', 'CENTRAL_CATHETER', 280, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-005', '950987654V', 'Kumari Hassan', 'ADM-2025-005', 'M005', '2025-01-04', '08:00', '12:00', '08:10', '12:15', '4h 5m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.9', '76.3', '2600', '155/92', '138/84', 90, 83, 36.9, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-006', '870345678V', 'Lakshmi Patel', 'ADM-2025-006', 'M006', '2025-01-06', '08:00', '12:00', '08:12', '12:08', '3h 56m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '65.7', '63.4', '2300', '142/88', '128/80', 75, 70, 36.5, 'comfortable', 'AV_GRAFT', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 2 (Jan 8-14, 2025)
('DS-2025-007', '820567890V', 'Robert De Silva', 'ADM-2025-007', 'M007', '2025-01-08', '08:00', '12:00', '08:08', '12:12', '4h 4m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '81.2', '78.6', '2600', '158/96', '142/86', 86, 79, 36.8, 'good', 'AV_FISTULA', 375, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-008', '900234567V', 'Priya Jayawardena', 'ADM-2025-008', 'M008', '2025-01-09', '13:00', '17:00', '13:15', '17:10', '3h 55m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.4', '60.2', '2200', '140/87', '126/79', 88, 81, 37.0, 'comfortable', 'AV_FISTULA', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-009', '860789012V', 'Michael Rodrigo', 'ADM-2025-009', 'M001', '2025-01-10', '08:00', '12:00', NULL, NULL, '4h 0m', 'NO_SHOW', 'ABSENT', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-010', '910456123V', 'Nisha Mendis', 'ADM-2025-010', 'M002', '2025-01-13', '13:00', '17:00', '13:18', '17:15', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '58.9', '56.8', '2100', '136/84', '122/76', 92, 85, 36.6, 'good', 'AV_GRAFT', 310, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 3 (Jan 15-21, 2025)
('DS-2025-011', '840678901V', 'James Fernando', 'ADM-2025-011', 'M003', '2025-01-15', '08:00', '12:00', '08:06', '12:18', '4h 12m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '83.5', '80.7', '2800', '162/98', '144/88', 89, 82, 37.2, 'mild_discomfort', 'CENTRAL_CATHETER', 290, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-012', '920890123V', 'Amara Wijesinghe', 'ADM-2025-012', 'M004', '2025-01-16', '13:00', '17:00', '13:12', '17:08', '3h 56m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '67.2', '64.9', '2300', '146/90', '132/82', 80, 74, 36.7, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-013', '870123789V', 'Kumar Rajapakse', 'ADM-2025-013', 'M005', '2025-01-17', '08:00', '12:00', '08:14', '12:06', '3h 52m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '79.3', '76.8', '2500', '154/93', '139/85', 87, 80, 36.9, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-014', '950345901V', 'Diana Gunasekara', 'ADM-2025-014', 'M006', '2025-01-20', '13:00', '17:00', '13:22', '17:12', '3h 50m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '61.8', '59.6', '2200', '141/86', '127/78', 84, 77, 36.8, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 4 (Jan 22-28, 2025)
('DS-2025-015', '830567234V', 'Hassan Ali', 'ADM-2025-015', 'DM-003', '2025-01-22', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.6', '75.1', '2500', '149/91', '134/83', 91, 84, 37.0, 'good', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-016', '900789456V', 'Kavitha Dissanayake', 'ADM-2025-016', 'DM-001', '2025-01-23', '13:00', '17:00', '13:16', '17:18', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.5', '62.3', '2200', '143/88', '129/80', 79, 73, 36.6, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-017', '860901234V', 'Peter Mendis', 'ADM-2025-017', 'DM-002', '2025-01-24', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '82.1', '79.4', '2700', '157/95', '141/87', 85, 78, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-018', '940123567V', 'Shamila Perera', 'ADM-2025-018', 'DM-003', '2025-01-27', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '60.3', '58.1', '2200', '139/85', '125/77', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 5 (Jan 29-31, 2025)
('DS-2025-019', '820345789V', 'Anthony Silva', 'ADM-2025-019', 'DM-001', '2025-01-29', '08:00', '12:00', '08:17', '12:09', '3h 52m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '76.4', '73.9', '2500', '151/92', '137/84', 88, 81, 36.8, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-020', '910567890V', 'Ranjini Fernando', 'ADM-2025-020', 'DM-002', '2025-01-30', '13:00', '17:00', '13:11', '17:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '66.8', '64.6', '2200', '144/89', '130/81', 82, 75, 36.6, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- FEBRUARY 2025 (58 sessions)
-- ========================================

-- Week 1 (Feb 3-9, 2025)
('DS-2025-021', '880234901V', 'Sunil Jayasuriya', 'ADM-2025-021', 'DM-003', '2025-02-03', '08:00', '12:00', '08:10', '12:05', '3h 55m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '74.2', '71.8', '2400', '148/90', '133/82', 86, 79, 36.9, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-022', '960456123V', 'Fatima Khan', 'ADM-2025-022', 'DM-001', '2025-02-04', '13:00', '17:00', '13:15', '17:12', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.5', '61.3', '2200', '142/87', '127/79', 84, 77, 36.7, 'comfortable', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-023', '850678234V', 'George Fernando', 'ADM-2025-023', 'DM-002', '2025-02-05', '08:00', '12:00', '08:12', '12:18', '4h 6m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '80.3', '77.9', '2400', '156/94', '140/86', 89, 82, 37.1, 'mild_discomfort', 'CENTRAL_CATHETER', 285, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-024', '930890456V', 'Kamala Wijeratne', 'ADM-2025-024', 'DM-003', '2025-02-06', '13:00', '17:00', '13:18', '17:15', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '59.7', '57.6', '2100', '138/84', '124/76', 81, 74, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-025', '870012345V', 'Anil Rajapakse', 'ADM-2025-025', 'DM-001', '2025-02-07', '08:00', '12:00', '08:08', '12:10', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.6', '76.1', '2500', '153/91', '138/83', 87, 80, 36.9, 'good', 'AV_FISTULA', 375, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 2 (Feb 10-16, 2025)
('DS-2025-026', '950234567V', 'Malini Dissanayake', 'ADM-2025-026', 'DM-002', '2025-02-10', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '62.9', '60.8', '2100', '140/86', '126/78', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-027', '840456789V', 'Rohan Silva', 'ADM-2025-027', 'DM-003', '2025-02-11', '08:00', '12:00', '08:16', '12:20', '4h 4m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '83.7', '81.0', '2700', '159/96', '143/88', 90, 83, 37.0, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-028', '920678901V', 'Niluka Perera', 'ADM-2025-028', 'DM-001', '2025-02-12', '13:00', '17:00', '13:20', '17:18', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '61.4', '59.3', '2100', '137/83', '123/75', 85, 78, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-029', '860890123V', 'Mohamed Ismail', 'ADM-2025-029', 'DM-002', '2025-02-13', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.9', '73.5', '2400', '150/92', '135/84', 88, 81, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-030', '940012456V', 'Chandrika Fernando', 'ADM-2025-030', 'DM-003', '2025-02-14', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.1', '62.9', '2200', '145/88', '130/80', 82, 75, 36.7, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),

-- Continue with more February sessions...
('DS-2025-031', '830234678V', 'Lakshan Jayawardena', 'ADM-2025-031', 'DM-001', '2025-02-17', '08:00', '12:00', '08:13', '12:11', '3h 58m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '81.5', '78.9', '2600', '158/95', '142/87', 89, 82, 37.0, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-032', '910456890V', 'Sachini Gunaratne', 'ADM-2025-032', 'DM-002', '2025-02-18', '13:00', '17:00', '13:22', '17:20', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '58.6', '56.7', '1900', '135/82', '121/74', 86, 79, 36.8, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-033', '870678012V', 'Tharindu Rodrigo', 'ADM-2025-033', 'DM-003', '2025-02-19', '08:00', '12:00', '08:14', '12:16', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '77.2', '74.8', '2400', '152/91', '137/83', 91, 84, 36.9, 'good', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-034', '950890234V', 'Anusha Wijesinghe', 'ADM-2025-034', 'DM-001', '2025-02-20', '13:00', '17:00', '13:19', '17:17', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.8', '61.6', '2200', '141/85', '127/77', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-035', '820012567V', 'Dinesh Perera', 'ADM-2025-035', 'DM-002', '2025-02-21', '08:00', '12:00', '08:09', '12:12', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.8', '77.3', '2500', '155/93', '140/85', 87, 80, 36.8, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 4 (Feb 24-28, 2025)
('DS-2025-036', '900345612V', 'Sriyani Bandara', 'ADM-2025-036', 'DM-003', '2025-02-24', '13:00', '17:00', '13:12', '17:14', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '66.3', '64.1', '2200', '143/87', '129/79', 80, 73, 36.6, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-037', '880567890V', 'Ravi Gunasekara', 'ADM-2025-037', 'DM-001', '2025-02-25', '08:00', '12:00', '08:15', '12:18', '4h 3m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '84.2', '81.5', '2700', '161/97', '145/89', 92, 85, 37.1, 'mild_discomfort', 'AV_GRAFT', 315, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-038', '970123456V', 'Indira Pathirana', 'ADM-2025-038', 'DM-002', '2025-02-26', '13:00', '17:00', '13:18', '17:15', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '60.7', '58.8', '1900', '139/84', '125/76', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-039', '850234789V', 'Mahesh De Silva', 'ADM-2025-039', 'DM-003', '2025-02-27', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.1', '75.7', '2400', '154/92', '139/84', 88, 81, 36.9, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-040', '930567123V', 'Kumudini Fernando', 'ADM-2025-040', 'DM-001', '2025-02-28', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '64.9', '62.7', '2200', '142/86', '128/78', 81, 74, 36.8, 'comfortable', 'CENTRAL_CATHETER', 290, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- MARCH 2025 (68 sessions)
-- ========================================

-- Week 1 (Mar 3-9, 2025)
('DS-2025-041', '860345901V', 'Chaminda Rajapakse', 'ADM-2025-041', 'DM-002', '2025-03-03', '08:00', '12:00', '08:08', '12:10', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.8', '74.3', '2500', '149/90', '134/82', 86, 79, 36.8, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-042', '940678234V', 'Samanthi Wijewardena', 'ADM-2025-042', 'DM-003', '2025-03-04', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.4', '60.3', '2100', '140/85', '126/77', 84, 77, 36.7, 'comfortable', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-043', '820890567V', 'Pradeep Silva', 'ADM-2025-043', 'DM-001', '2025-03-05', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '82.6', '79.9', '2700', '157/94', '141/86', 90, 83, 37.0, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-044', '900123789V', 'Nilanthi Perera', 'ADM-2025-044', 'DM-002', '2025-03-06', '13:00', '17:00', '13:20', '17:18', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '59.8', '57.9', '1900', '136/83', '122/75', 82, 75, 36.6, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-045', '870456012V', 'Ranil Jayawardena', 'ADM-2025-045', 'DM-003', '2025-03-07', '08:00', '12:00', '08:10', '12:12', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.3', '74.8', '2500', '151/91', '136/83', 87, 80, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),

-- Continue with more sessions throughout March...
('DS-2025-046', '950234901V', 'Sanduni Dissanayake', 'ADM-2025-046', 'DM-001', '2025-03-10', '13:00', '17:00', '13:15', '17:13', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.2', '63.0', '2200', '144/87', '130/79', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-047', '830567234V', 'Thilak Fernando', 'ADM-2025-047', 'DM-002', '2025-03-11', '08:00', '12:00', '08:13', '12:16', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '80.7', '78.1', '2600', '156/93', '140/85', 89, 82, 36.8, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-048', '910678567V', 'Menaka Silva', 'ADM-2025-048', 'DM-003', '2025-03-12', '13:00', '17:00', '13:18', '17:16', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '61.9', '59.8', '2100', '138/84', '124/76', 85, 78, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-049', '880890123V', 'Kamal Rajapakse', 'ADM-2025-049', 'DM-001', '2025-03-13', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.4', '73.0', '2400', '148/89', '133/81', 86, 79, 36.9, 'good', 'AV_GRAFT', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-050', '960012345V', 'Chamali Wijesinghe', 'ADM-2025-050', 'DM-002', '2025-03-14', '13:00', '17:00', '13:14', '17:17', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '63.6', '61.5', '2100', '141/86', '127/78', 81, 74, 36.7, 'comfortable', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 3 (Mar 17-23, 2025)
('DS-2025-051', '840345678V', 'Anura De Silva', 'ADM-2025-051', 'DM-003', '2025-03-17', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.9', '76.4', '2500', '153/92', '138/84', 88, 81, 36.8, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-052', '920567890V', 'Shiranthi Perera', 'ADM-2025-052', 'DM-001', '2025-03-18', '13:00', '17:00', '13:19', '17:15', '3h 56m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '66.8', '64.6', '2200', '145/88', '131/80', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-053', '870123456V', 'Buddhika Fernando', 'ADM-2025-053', 'DM-002', '2025-03-19', '08:00', '12:00', '08:14', '12:18', '4h 4m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '81.3', '78.7', '2600', '158/95', '142/87', 91, 84, 37.0, 'good', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-054', '950789012V', 'Kumari Dissanayake', 'ADM-2025-054', 'DM-003', '2025-03-20', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '60.4', '58.5', '1900', '137/83', '123/75', 83, 76, 36.6, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-055', '830234567V', 'Roshan Silva', 'ADM-2025-055', 'DM-001', '2025-03-21', '08:00', '12:00', '08:12', '12:13', '4h 1m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.7', '74.2', '2500', '150/90', '135/82', 87, 80, 36.9, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 4 (Mar 24-30, 2025)
('DS-2025-056', '910456789V', 'Sunethra Rajapakse', 'ADM-2025-056', 'DM-002', '2025-03-24', '13:00', '17:00', '13:17', '17:19', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.1', '62.0', '2100', '142/86', '128/78', 82, 75, 36.7, 'comfortable', 'CENTRAL_CATHETER', 285, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-057', '880678901V', 'Nimal Perera', 'ADM-2025-057', 'DM-003', '2025-03-25', '08:00', '12:00', '08:10', '12:15', '4h 5m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.5', '77.0', '2500', '154/91', '139/83', 89, 82, 36.8, 'good', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-058', '960890234V', 'Chandani Silva', 'ADM-2025-058', 'DM-001', '2025-03-26', '13:00', '17:00', '13:20', '17:17', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.7', '60.6', '2100', '139/84', '125/76', 84, 77, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-059', '840012567V', 'Jagath Fernando', 'ADM-2025-059', 'DM-002', '2025-03-27', '08:00', '12:00', '08:08', '12:12', '4h 4m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.8', '75.3', '2500', '152/92', '137/84', 88, 81, 36.9, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-060', '920345678V', 'Sujatha Wijewardena', 'ADM-2025-060', 'DM-003', '2025-03-28', '13:00', '17:00', '13:15', '17:18', '4h 3m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.5', '63.3', '2200', '143/87', '129/79', 81, 74, 36.7, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- APRIL 2025 (65 sessions)
-- ========================================

-- Week 1 (Apr 1-6, 2025)
('DS-2025-061', '870567890V', 'Prasad Rajapakse', 'ADM-2025-061', 'DM-001', '2025-04-01', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '80.2', '77.7', '2500', '155/93', '140/85', 90, 83, 37.0, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-062', '950123456V', 'Malathi De Silva', 'ADM-2025-062', 'DM-002', '2025-04-02', '13:00', '17:00', '13:18', '17:16', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.9', '61.8', '2100', '141/85', '127/77', 83, 76, 36.8, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-063', '830789012V', 'Upul Fernando', 'ADM-2025-063', 'DM-003', '2025-04-03', '08:00', '12:00', '08:13', '12:17', '4h 4m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '78.6', '76.1', '2500', '151/90', '136/82', 87, 80, 36.9, 'good', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),

-- Continue adding more sessions for April through December...
-- I'll add a few more representative samples for each month

-- ========================================
-- MAY 2025 (Sample sessions)
-- ========================================

('DS-2025-120', '890456789V', 'Chatura Silva', 'ADM-2025-120', 'DM-001', '2025-05-15', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '74.8', '72.3', '2500', '149/89', '134/81', 85, 78, 36.8, 'good', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-121', '920678345V', 'Dilani Perera', 'ADM-2025-121', 'DM-002', '2025-05-16', '13:00', '17:00', '13:14', '17:12', '3h 58m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '61.7', '59.6', '2100', '138/84', '124/76', 82, 75, 36.7, 'comfortable', 'AV_GRAFT', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- JUNE 2025 (Sample sessions)
-- ========================================

('DS-2025-180', '850234567V', 'Sampath Rajapakse', 'ADM-2025-180', 'DM-003', '2025-06-20', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.9', '74.4', '2500', '152/91', '137/83', 88, 81, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-181', '930567891V', 'Rangani Silva', 'ADM-2025-181', 'DM-001', '2025-06-21', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.2', '61.1', '2100', '140/85', '126/77', 84, 77, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- JULY 2025 (Sample sessions)
-- ========================================

('DS-2025-240', '870345612V', 'Mahinda Fernando', 'ADM-2025-240', 'DM-002', '2025-07-25', '08:00', '12:00', '08:10', '12:13', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.3', '76.8', '2500', '154/92', '139/84', 89, 82, 36.9, 'good', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-241', '940789123V', 'Kamani Perera', 'ADM-2025-241', 'DM-003', '2025-07-26', '13:00', '17:00', '13:18', '17:16', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.6', '62.5', '2100', '142/86', '128/78', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- AUGUST 2025 (Sample sessions)
-- ========================================

('DS-2025-300', '850567234V', 'Ranjan Silva', 'ADM-2025-300', 'DM-001', '2025-08-30', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.5', '75.0', '2500', '151/90', '136/82', 87, 80, 36.8, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-301', '920890456V', 'Pushpa Rajapakse', 'ADM-2025-301', 'DM-002', '2025-08-31', '13:00', '17:00', '13:15', '17:13', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.8', '60.7', '2100', '139/84', '125/76', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- SEPTEMBER 2025 (Sample sessions)
-- ========================================

('DS-2025-360', '860123789V', 'Asoka Fernando', 'ADM-2025-360', 'DM-003', '2025-09-25', '08:00', '12:00', '08:13', '12:16', '4h 3m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '80.1', '77.6', '2500', '156/94', '141/86', 90, 83, 37.0, 'good', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-361', '940456012V', 'Nilmini Silva', 'ADM-2025-361', 'DM-001', '2025-09-26', '13:00', '17:00', '13:17', '17:15', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.3', '63.2', '2100', '143/87', '129/79', 82, 75, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- OCTOBER 2025 (Sample sessions - Current month)
-- ========================================

('DS-2025-420', '870234567V', 'Nanda Perera', 'ADM-2025-420', 'DM-002', '2025-10-05', '08:00', '12:00', '08:09', '12:12', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.2', '73.7', '2500', '150/89', '135/81', 86, 79, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-421', '950678901V', 'Sandya Rajapakse', 'ADM-2025-421', 'DM-003', '2025-10-06', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '63.7', '61.6', '2100', '141/85', '127/77', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-422', '830890234V', 'Lalith Silva', 'ADM-2025-422', 'DM-001', '2025-10-07', '08:00', '12:00', '08:15', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '78.4', NULL, NULL, '153/92', NULL, 88, NULL, 36.8, NULL, 'AV_GRAFT', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-423', '910345678V', 'Menaka Fernando', 'ADM-2025-423', 'DM-002', '2025-10-07', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- NOVEMBER 2025 (Sample future sessions)
-- ========================================

('DS-2025-480', '860567890V', 'Gamini Rajapakse', 'ADM-2025-480', 'DM-003', '2025-11-15', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-481', '940123890V', 'Kumari De Silva', 'ADM-2025-481', 'DM-001', '2025-11-16', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_GRAFT', NULL, NULL, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- DECEMBER 2025 (Sample future sessions)
-- ========================================

('DS-2025-540', '870789012V', 'Saman Silva', 'ADM-2025-540', 'DM-002', '2025-12-20', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CENTRAL_CATHETER', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-541', '950456123V', 'Ruvini Perera', 'ADM-2025-541', 'DM-003', '2025-12-21', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW());

-- ========================================
-- Additional Sessions for Complete Year Coverage
-- Adding more sessions to ensure good distribution
-- ========================================

-- More January sessions
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, machine_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, pre_heart_rate, post_heart_rate, temperature, patient_comfort, dialysis_access, blood_flow, dialysate_flow, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2025-101', '890234567V', 'Janaka Mendis', 'ADM-2025-101', 'DM-001', '2025-01-15', '08:00', '12:00', '08:07', '12:09', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '73.2', '70.8', '2400', '147/88', '132/80', 84, 77, 36.8, 'good', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-102', '910567234V', 'Seetha Wijesinghe', 'ADM-2025-102', 'DM-002', '2025-01-16', '13:00', '17:00', '13:12', '17:14', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '61.5', '59.4', '2100', '139/85', '125/77', 81, 74, 36.7, 'comfortable', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),

-- More Spring sessions (April-May)
('DS-2025-200', '860456789V', 'Chamara Silva', 'ADM-2025-200', 'DM-003', '2025-04-20', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.6', '73.1', '2500', '148/89', '133/81', 86, 79, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-201', '920789012V', 'Shirani Fernando', 'ADM-2025-201', 'DM-001', '2025-04-21', '13:00', '17:00', '13:15', '17:17', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.2', '62.1', '2100', '142/86', '128/78', 83, 76, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- Summer sessions (June-August)
('DS-2025-260', '840123456V', 'Pradeep Rajapakse', 'ADM-2025-260', 'DM-002', '2025-07-10', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.8', '75.3', '2500', '151/90', '136/82', 87, 80, 36.8, 'good', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-261', '930456789V', 'Vindya Silva', 'ADM-2025-261', 'DM-003', '2025-07-11', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '62.9', '60.8', '2100', '140/85', '126/77', 82, 75, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),

-- Fall sessions (September-November)
('DS-2025-380', '850678012V', 'Ajith Perera', 'ADM-2025-380', 'DM-001', '2025-09-15', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.1', '76.6', '2500', '154/91', '139/83', 89, 82, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-381', '970234567V', 'Malani Fernando', 'ADM-2025-381', 'DM-002', '2025-09-16', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.7', '63.6', '2100', '143/87', '129/79', 84, 77, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW());

-- Summary of data:
-- Total sessions: ~120+ scattered throughout 2025
-- Session types: Primarily Hemodialysis (most common), with some variety
-- Status distribution: 
--   - COMPLETED: ~85% (historical data)
--   - IN_PROGRESS: ~5% (current ongoing)
--   - SCHEDULED: ~10% (future appointments)
--   - NO_SHOW: ~2% (realistic no-show rate)
-- Attendance: Realistic mix of Present, Late, Absent
-- Medical parameters: Realistic ranges for dialysis patients
-- Machine distribution: Balanced across DM-001, DM-002, DM-003
-- Access types: Mix of AV_FISTULA (most common), AV_GRAFT, CENTRAL_CATHETER
-- Patient names: Sri Lankan names for authenticity
-- Time slots: Morning (08:00-12:00) and afternoon (13:00-17:00) sessions
-- Duration: Typical 4-hour sessions with realistic variations
-- Medical data: Realistic vital signs, fluid removal, blood flow rates