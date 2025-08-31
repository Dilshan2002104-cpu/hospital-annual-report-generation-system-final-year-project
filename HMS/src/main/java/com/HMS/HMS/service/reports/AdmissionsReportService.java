package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.MonthlyAdmissionsRequestDTO;
import com.HMS.HMS.DTO.reports.MonthlyAdmissionsRowDTO;
import com.HMS.HMS.repository.reports.AdmissionsReportRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.lang.management.ManagementPermission;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdmissionsReportService {

    private final AdmissionsReportRepository repo;
    private final ResourceLoader resourceLoader;


    public AdmissionsReportService(AdmissionsReportRepository repo, ResourceLoader resourceLoader) {
        this.repo = repo;
        this.resourceLoader = resourceLoader;
    }

    public List<MonthlyAdmissionsRowDTO> getMonthlyAdmissions(MonthlyAdmissionsRequestDTO req){
        YearMonth ym = YearMonth.of(req.getYear(), req.getMonth());
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();

        return repo.findMonthlyAdmissionsByWard(start,end)
                .stream()
                .map(p -> new MonthlyAdmissionsRowDTO(
                        p.getWardId(),
                        p.getWardName(),
                        p.getMonth(),
                        p.getTotalAdmissions()))
                .toList();
    }

    public byte[] getMonthlyAdmissionsPdf(MonthlyAdmissionsRequestDTO req) throws Exception{
        List<MonthlyAdmissionsRowDTO> rows  = getMonthlyAdmissions(req);

        InputStream jrxml = resourceLoader
                .getResource("classpath:reports/monthly_admissions_by_ward.jrxml")
                .getInputStream();

        JasperReport report = JasperCompileManager.compileReport(jrxml);

        Map<String,Object> params = new HashMap<>();
        YearMonth ym = YearMonth.of(req.getYear(),req.getMonth());
        params.put("reportTitle","Monthly Admissions by Ward");
        params.put("reportMonth",ym.toString());

        JRBeanCollectionDataSource data = new JRBeanCollectionDataSource(rows);

        JasperPrint print = JasperFillManager.fillReport(report,params,data);
        return JasperExportManager.exportReportToPdf(print);
    }
}
