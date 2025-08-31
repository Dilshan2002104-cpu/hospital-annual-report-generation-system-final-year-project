package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.MonthlyAdmissionsRequestDTO;
import com.HMS.HMS.DTO.reports.MonthlyAdmissionsRowDTO;
import com.HMS.HMS.service.reports.AdmissionsReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports/admissions")
public class AdmissionsReportController {

    private final AdmissionsReportService service;

    public AdmissionsReportController(AdmissionsReportService service) {
        this.service = service;
    }

    @GetMapping("/monthly")
    public List<MonthlyAdmissionsRowDTO> monthlyJson(
            @RequestParam int year,@RequestParam int month
    ){
        var req = new MonthlyAdmissionsRequestDTO();
        req.setYear(year);
        req.setMonth(month);
        return service.getMonthlyAdmissions(req);
    }
}
