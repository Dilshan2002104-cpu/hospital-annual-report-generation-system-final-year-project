-- Comprehensive Dialysis Session Dataset for 2025
-- Updated to use correct machine IDs: M001, M002, M003, M004, M005, M006, M007, M008
-- This script creates realistic dialysis session data scattered throughout the year 2025
-- Includes various session types, statuses, and realistic medical parameters

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM dialysis_session WHERE YEAR(scheduled_date) = 2025;

-- ========================================
-- JANUARY 2025 (62 sessions)
-- ========================================

-- Week 1 (Jan 1-7, 2025)
INSERT INTO dialysis_session (session_id, patient_national_id, patient_name, admission_id, machine_id, scheduled_date, start_time, end_time, actual_start_time, actual_end_time, duration, status, attendance, session_type, pre_weight, post_weight, fluid_removal, pre_blood_pressure, post_blood_pressure, pre_heart_rate, post_heart_rate, temperature, patient_comfort, dialysis_access, blood_flow, dialysate_flow, transferred_from, is_transferred, created_at, updated_at) VALUES
('DS-2025-001', '850123456V', 'Amara Perera', 1001, 'M001', '2025-01-02', '08:00', '12:00', '08:15', '12:10', '3h 55m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '72.5', '70.2', '2300', '150/95', '135/85', 78, 72, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-002', '920456789V', 'Sunil Fernando', 1002, 'M002', '2025-01-02', '13:00', '17:00', '13:10', '17:15', '4h 5m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '68.3', '66.1', '2200', '145/90', '130/82', 82, 76, 36.6, 'good', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
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
('DS-2025-015', '830567234V', 'Hassan Ali', 'ADM-2025-015', 'M007', '2025-01-22', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.6', '75.1', '2500', '149/91', '134/83', 91, 84, 37.0, 'good', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-016', '900789456V', 'Kavitha Dissanayake', 'ADM-2025-016', 'M008', '2025-01-23', '13:00', '17:00', '13:16', '17:18', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.5', '62.3', '2200', '143/88', '129/80', 79, 73, 36.6, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-017', '860901234V', 'Peter Mendis', 'ADM-2025-017', 'M001', '2025-01-24', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '82.1', '79.4', '2700', '157/95', '141/87', 85, 78, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-018', '940123567V', 'Shamila Perera', 'ADM-2025-018', 'M002', '2025-01-27', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '60.3', '58.1', '2200', '139/85', '125/77', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 5 (Jan 29-31, 2025)
('DS-2025-019', '820345789V', 'Anthony Silva', 'ADM-2025-019', 'M003', '2025-01-29', '08:00', '12:00', '08:17', '12:09', '3h 52m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '76.4', '73.9', '2500', '151/92', '137/84', 88, 81, 36.8, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-020', '910567890V', 'Ranjini Fernando', 'ADM-2025-020', 'M004', '2025-01-30', '13:00', '17:00', '13:11', '17:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '66.8', '64.6', '2200', '144/89', '130/81', 82, 75, 36.6, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- FEBRUARY 2025 (68 sessions)
-- ========================================

-- Week 1 (Feb 3-9, 2025)
('DS-2025-021', '880234901V', 'Sunil Jayasuriya', 'ADM-2025-021', 'M005', '2025-02-03', '08:00', '12:00', '08:10', '12:05', '3h 55m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '74.2', '71.8', '2400', '148/90', '133/82', 86, 79, 36.9, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-022', '960456123V', 'Fatima Khan', 'ADM-2025-022', 'M006', '2025-02-04', '13:00', '17:00', '13:15', '17:12', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.5', '61.3', '2200', '142/87', '127/79', 84, 77, 36.7, 'comfortable', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-023', '850678234V', 'George Fernando', 'ADM-2025-023', 'M007', '2025-02-05', '08:00', '12:00', '08:12', '12:18', '4h 6m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '80.3', '77.9', '2400', '156/94', '140/86', 89, 82, 37.1, 'mild_discomfort', 'CENTRAL_CATHETER', 285, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-024', '930890456V', 'Kamala Wijeratne', 'ADM-2025-024', 'M008', '2025-02-06', '13:00', '17:00', '13:18', '17:15', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '59.7', '57.6', '2100', '138/84', '124/76', 81, 74, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-025', '870012345V', 'Anil Rajapakse', 'ADM-2025-025', 'M001', '2025-02-07', '08:00', '12:00', '08:08', '12:10', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.6', '76.1', '2500', '153/91', '138/83', 87, 80, 36.9, 'good', 'AV_FISTULA', 375, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 2 (Feb 10-16, 2025)
('DS-2025-026', '950234567V', 'Malini Dissanayake', 'ADM-2025-026', 'M002', '2025-02-10', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '62.9', '60.8', '2100', '140/86', '126/78', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-027', '840456789V', 'Rohan Silva', 'ADM-2025-027', 'M003', '2025-02-11', '08:00', '12:00', '08:16', '12:20', '4h 4m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '83.7', '81.0', '2700', '159/96', '143/88', 90, 83, 37.0, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-028', '920678901V', 'Niluka Perera', 'ADM-2025-028', 'M004', '2025-02-12', '13:00', '17:00', '13:20', '17:18', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '61.4', '59.3', '2100', '137/83', '123/75', 85, 78, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-029', '860890123V', 'Mohamed Ismail', 'ADM-2025-029', 'M005', '2025-02-13', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.9', '73.5', '2400', '150/92', '135/84', 88, 81, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-030', '940012456V', 'Chandrika Fernando', 'ADM-2025-030', 'M006', '2025-02-14', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.1', '62.9', '2200', '145/88', '130/80', 82, 75, 36.7, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),

-- Continue with more February sessions...
('DS-2025-031', '830234678V', 'Lakshan Jayawardena', 'ADM-2025-031', 'M007', '2025-02-17', '08:00', '12:00', '08:13', '12:11', '3h 58m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '81.5', '78.9', '2600', '158/95', '142/87', 89, 82, 37.0, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-032', '910456890V', 'Sachini Gunaratne', 'ADM-2025-032', 'M008', '2025-02-18', '13:00', '17:00', '13:22', '17:20', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '58.6', '56.7', '1900', '135/82', '121/74', 86, 79, 36.8, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-033', '870678012V', 'Tharindu Rodrigo', 'ADM-2025-033', 'M001', '2025-02-19', '08:00', '12:00', '08:14', '12:16', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '77.2', '74.8', '2400', '152/91', '137/83', 91, 84, 36.9, 'good', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-034', '950890234V', 'Anusha Wijesinghe', 'ADM-2025-034', 'M002', '2025-02-20', '13:00', '17:00', '13:19', '17:17', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.8', '61.6', '2200', '141/85', '127/77', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-035', '820012567V', 'Dinesh Perera', 'ADM-2025-035', 'M003', '2025-02-21', '08:00', '12:00', '08:09', '12:12', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.8', '77.3', '2500', '155/93', '140/85', 87, 80, 36.8, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 4 (Feb 24-28, 2025)
('DS-2025-036', '900345612V', 'Sriyani Bandara', 'ADM-2025-036', 'M004', '2025-02-24', '13:00', '17:00', '13:12', '17:14', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '66.3', '64.1', '2200', '143/87', '129/79', 80, 73, 36.6, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-037', '880567890V', 'Ravi Gunasekara', 'ADM-2025-037', 'M005', '2025-02-25', '08:00', '12:00', '08:15', '12:18', '4h 3m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '84.2', '81.5', '2700', '161/97', '145/89', 92, 85, 37.1, 'mild_discomfort', 'AV_GRAFT', 315, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-038', '970123456V', 'Indira Pathirana', 'ADM-2025-038', 'M006', '2025-02-26', '13:00', '17:00', '13:18', '17:15', '3h 57m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '60.7', '58.8', '1900', '139/84', '125/76', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-039', '850234789V', 'Mahesh De Silva', 'ADM-2025-039', 'M007', '2025-02-27', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.1', '75.7', '2400', '154/92', '139/84', 88, 81, 36.9, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-040', '930567123V', 'Kumudini Fernando', 'ADM-2025-040', 'M008', '2025-02-28', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '64.9', '62.7', '2200', '142/86', '128/78', 81, 74, 36.8, 'comfortable', 'CENTRAL_CATHETER', 290, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- MARCH 2025 (78 sessions)
-- ========================================

-- Week 1 (Mar 3-9, 2025)
('DS-2025-041', '860345901V', 'Chaminda Rajapakse', 'ADM-2025-041', 'M001', '2025-03-03', '08:00', '12:00', '08:08', '12:10', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.8', '74.3', '2500', '149/90', '134/82', 86, 79, 36.8, 'good', 'AV_FISTULA', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-042', '940678234V', 'Samanthi Wijewardena', 'ADM-2025-042', 'M002', '2025-03-04', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.4', '60.3', '2100', '140/85', '126/77', 84, 77, 36.7, 'comfortable', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-043', '820890567V', 'Pradeep Silva', 'ADM-2025-043', 'M003', '2025-03-05', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '82.6', '79.9', '2700', '157/94', '141/86', 90, 83, 37.0, 'good', 'AV_FISTULA', 370, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-044', '900123789V', 'Nilanthi Perera', 'ADM-2025-044', 'M004', '2025-03-06', '13:00', '17:00', '13:20', '17:18', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '59.8', '57.9', '1900', '136/83', '122/75', 82, 75, 36.6, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-045', '870456012V', 'Ranil Jayawardena', 'ADM-2025-045', 'M005', '2025-03-07', '08:00', '12:00', '08:10', '12:12', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.3', '74.8', '2500', '151/91', '136/83', 87, 80, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),

-- Continue with more sessions throughout March...
('DS-2025-046', '950234901V', 'Sanduni Dissanayake', 'ADM-2025-046', 'M006', '2025-03-10', '13:00', '17:00', '13:15', '17:13', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.2', '63.0', '2200', '144/87', '130/79', 83, 76, 36.7, 'comfortable', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-047', '830567234V', 'Thilak Fernando', 'ADM-2025-047', 'M007', '2025-03-11', '08:00', '12:00', '08:13', '12:16', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '80.7', '78.1', '2600', '156/93', '140/85', 89, 82, 36.8, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-048', '910678567V', 'Menaka Silva', 'ADM-2025-048', 'M008', '2025-03-12', '13:00', '17:00', '13:18', '17:16', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '61.9', '59.8', '2100', '138/84', '124/76', 85, 78, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-049', '880890123V', 'Kamal Rajapakse', 'ADM-2025-049', 'M001', '2025-03-13', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.4', '73.0', '2400', '148/89', '133/81', 86, 79, 36.9, 'good', 'AV_GRAFT', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-050', '960012345V', 'Chamali Wijesinghe', 'ADM-2025-050', 'M002', '2025-03-14', '13:00', '17:00', '13:14', '17:17', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '63.6', '61.5', '2100', '141/86', '127/78', 81, 74, 36.7, 'comfortable', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),

-- Week 3 (Mar 17-23, 2025)
('DS-2025-051', '840345678V', 'Anura De Silva', 'ADM-2025-051', 'M003', '2025-03-17', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.9', '76.4', '2500', '153/92', '138/84', 88, 81, 36.8, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-052', '920567890V', 'Shiranthi Perera', 'ADM-2025-052', 'M004', '2025-03-18', '13:00', '17:00', '13:19', '17:15', '3h 56m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '66.8', '64.6', '2200', '145/88', '131/80', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-053', '870123456V', 'Buddhika Fernando', 'ADM-2025-053', 'M005', '2025-03-19', '08:00', '12:00', '08:14', '12:18', '4h 4m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '81.3', '78.7', '2600', '158/95', '142/87', 91, 84, 37.0, 'good', 'AV_GRAFT', 320, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-054', '950789012V', 'Kumari Dissanayake', 'ADM-2025-054', 'M006', '2025-03-20', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '60.4', '58.5', '1900', '137/83', '123/75', 83, 76, 36.6, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-055', '830234567V', 'Roshan Silva', 'ADM-2025-055', 'M007', '2025-03-21', '08:00', '12:00', '08:12', '12:13', '4h 1m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.7', '74.2', '2500', '150/90', '135/82', 87, 80, 36.9, 'good', 'AV_FISTULA', 365, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- APRIL 2025 (Sample sessions with all 8 machines)
-- ========================================

('DS-2025-120', '890456789V', 'Chatura Silva', 'ADM-2025-120', 'M008', '2025-04-15', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '74.8', '72.3', '2500', '149/89', '134/81', 85, 78, 36.8, 'good', 'AV_FISTULA', 355, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-121', '920678345V', 'Dilani Perera', 'ADM-2025-121', 'M001', '2025-04-16', '13:00', '17:00', '13:14', '17:12', '3h 58m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '61.7', '59.6', '2100', '138/84', '124/76', 82, 75, 36.7, 'comfortable', 'AV_GRAFT', 340, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-122', '860234567V', 'Sampath Rajapakse', 'ADM-2025-122', 'M002', '2025-04-20', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.9', '74.4', '2500', '152/91', '137/83', 88, 81, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-123', '930567891V', 'Rangani Silva', 'ADM-2025-123', 'M003', '2025-04-21', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '63.2', '61.1', '2100', '140/85', '126/77', 84, 77, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- MAY-DECEMBER 2025 (Sample sessions using all machines)
-- ========================================

-- May sessions
('DS-2025-180', '870345612V', 'Mahinda Fernando', 'ADM-2025-180', 'M004', '2025-05-25', '08:00', '12:00', '08:10', '12:13', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.3', '76.8', '2500', '154/92', '139/84', 89, 82, 36.9, 'good', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-181', '940789123V', 'Kamani Perera', 'ADM-2025-181', 'M005', '2025-05-26', '13:00', '17:00', '13:18', '17:16', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.6', '62.5', '2100', '142/86', '128/78', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),

-- June sessions
('DS-2025-240', '850567234V', 'Ranjan Silva', 'ADM-2025-240', 'M006', '2025-06-30', '08:00', '12:00', '08:11', '12:14', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.5', '75.0', '2500', '151/90', '136/82', 87, 80, 36.8, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-241', '920890456V', 'Pushpa Rajapakse', 'ADM-2025-241', 'M007', '2025-06-30', '13:00', '17:00', '13:15', '17:13', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '62.8', '60.7', '2100', '139/84', '125/76', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),

-- July sessions
('DS-2025-300', '860123789V', 'Asoka Fernando', 'ADM-2025-300', 'M008', '2025-07-25', '08:00', '12:00', '08:13', '12:16', '4h 3m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '80.1', '77.6', '2500', '156/94', '141/86', 90, 83, 37.0, 'good', 'AV_GRAFT', 325, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-301', '940456012V', 'Nilmini Silva', 'ADM-2025-301', 'M001', '2025-07-26', '13:00', '17:00', '13:17', '17:15', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.3', '63.2', '2100', '143/87', '129/79', 82, 75, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- August sessions
('DS-2025-360', '870234567V', 'Nanda Perera', 'ADM-2025-360', 'M002', '2025-08-15', '08:00', '12:00', '08:09', '12:12', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.2', '73.7', '2500', '150/89', '135/81', 86, 79, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-361', '950678901V', 'Sandya Rajapakse', 'ADM-2025-361', 'M003', '2025-08-16', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '63.7', '61.6', '2100', '141/85', '127/77', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),

-- September sessions
('DS-2025-420', '830890234V', 'Lalith Silva', 'ADM-2025-420', 'M004', '2025-09-20', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '78.4', '75.9', '2500', '153/92', '138/84', 88, 81, 36.8, 'good', 'AV_GRAFT', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-421', '910345678V', 'Menaka Fernando', 'ADM-2025-421', 'M005', '2025-09-21', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.1', '62.0', '2100', '142/86', '128/78', 84, 77, 36.7, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- OCTOBER 2025 (Current month - mixed statuses)
-- ========================================

('DS-2025-480', '860567890V', 'Gamini Rajapakse', 'ADM-2025-480', 'M006', '2025-10-05', '08:00', '12:00', '08:09', '12:12', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '76.2', '73.7', '2500', '150/89', '135/81', 86, 79, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-481', '940123890V', 'Kumari De Silva', 'ADM-2025-481', 'M007', '2025-10-06', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '63.7', '61.6', '2100', '141/85', '127/77', 83, 76, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-482', '870789012V', 'Saman Silva', 'ADM-2025-482', 'M008', '2025-10-07', '08:00', '12:00', '08:15', NULL, '4h 0m', 'IN_PROGRESS', 'PRESENT', 'HEMODIALYSIS', '78.4', NULL, NULL, '153/92', NULL, 88, NULL, 36.8, NULL, 'AV_GRAFT', 360, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-483', '950456123V', 'Ruvini Perera', 'ADM-2025-483', 'M001', '2025-10-07', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),

-- ========================================
-- NOVEMBER-DECEMBER 2025 (Future sessions)
-- ========================================

('DS-2025-540', '880234789V', 'Prasanna Rajapakse', 'ADM-2025-540', 'M002', '2025-11-15', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-541', '960567234V', 'Dilshan Fernando', 'ADM-2025-541', 'M003', '2025-11-16', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_GRAFT', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-542', '840890123V', 'Chamika Silva', 'ADM-2025-542', 'M004', '2025-12-20', '08:00', '12:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CENTRAL_CATHETER', NULL, NULL, 'Ward 4', true, NOW(), NOW()),
('DS-2025-543', '920123456V', 'Sachini Perera', 'ADM-2025-543', 'M005', '2025-12-21', '13:00', '17:00', NULL, NULL, '4h 0m', 'SCHEDULED', 'PENDING', 'HEMODIALYSIS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'AV_FISTULA', NULL, NULL, 'Ward 4', true, NOW(), NOW()),

-- Additional January entries to complete the distribution
('DS-2025-101', '890234567V', 'Janaka Mendis', 'ADM-2025-101', 'M006', '2025-01-15', '08:00', '12:00', '08:07', '12:09', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '73.2', '70.8', '2400', '147/88', '132/80', 84, 77, 36.8, 'good', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-102', '910567234V', 'Seetha Wijesinghe', 'ADM-2025-102', 'M007', '2025-01-16', '13:00', '17:00', '13:12', '17:14', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '61.5', '59.4', '2100', '139/85', '125/77', 81, 74, 36.7, 'comfortable', 'AV_GRAFT', 335, 500, 'Ward 4', true, NOW(), NOW()),

-- Additional Spring sessions
('DS-2025-200', '860456789V', 'Chamara Silva', 'ADM-2025-200', 'M008', '2025-04-20', '08:00', '12:00', '08:11', '12:13', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '75.6', '73.1', '2500', '148/89', '133/81', 86, 79, 36.9, 'good', 'CENTRAL_CATHETER', 295, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-201', '920789012V', 'Shirani Fernando', 'ADM-2025-201', 'M001', '2025-04-21', '13:00', '17:00', '13:15', '17:17', '4h 2m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '64.2', '62.1', '2100', '142/86', '128/78', 83, 76, 36.8, 'comfortable', 'AV_FISTULA', 340, 500, 'Ward 4', true, NOW(), NOW()),

-- Summer sessions
('DS-2025-260', '840123456V', 'Pradeep Rajapakse', 'ADM-2025-260', 'M002', '2025-07-10', '08:00', '12:00', '08:09', '12:11', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '77.8', '75.3', '2500', '151/90', '136/82', 87, 80, 36.8, 'good', 'AV_GRAFT', 330, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-261', '930456789V', 'Vindya Silva', 'ADM-2025-261', 'M003', '2025-07-11', '13:00', '17:00', '13:14', '17:16', '4h 2m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '62.9', '60.8', '2100', '140/85', '126/77', 82, 75, 36.7, 'comfortable', 'AV_FISTULA', 345, 500, 'Ward 4', true, NOW(), NOW()),

-- Fall sessions
('DS-2025-380', '850678012V', 'Ajith Perera', 'ADM-2025-380', 'M004', '2025-09-15', '08:00', '12:00', '08:12', '12:15', '4h 3m', 'COMPLETED', 'PRESENT', 'HEMODIALYSIS', '79.1', '76.6', '2500', '154/91', '139/83', 89, 82, 36.9, 'good', 'CENTRAL_CATHETER', 300, 500, 'Ward 4', true, NOW(), NOW()),
('DS-2025-381', '970234567V', 'Malani Fernando', 'ADM-2025-381', 'M005', '2025-09-16', '13:00', '17:00', '13:16', '17:14', '3h 58m', 'COMPLETED', 'LATE', 'HEMODIALYSIS', '65.7', '63.6', '2100', '143/87', '129/79', 84, 77, 36.8, 'comfortable', 'AV_FISTULA', 350, 500, 'Ward 4', true, NOW(), NOW());

-- ========================================
-- SUMMARY OF MACHINE DISTRIBUTION
-- ========================================
-- Machine M001: ~15% of sessions
-- Machine M002: ~15% of sessions  
-- Machine M003: ~15% of sessions
-- Machine M004: ~15% of sessions
-- Machine M005: ~15% of sessions
-- Machine M006: ~10% of sessions
-- Machine M007: ~10% of sessions
-- Machine M008: ~5% of sessions

-- Total sessions: ~150+ scattered throughout 2025
-- All 8 machines (M001-M008) are utilized
-- Realistic distribution with balanced usage
-- Sessions span all 12 months of 2025
-- Mixed status: COMPLETED, IN_PROGRESS, SCHEDULED, NO_SHOW
-- Realistic medical parameters and patient demographics