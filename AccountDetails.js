namespace aspire.finsight;

// This creates the physical table in SAP HANA
entity ModuleSummary {
    key Module    : String(50);
    approved      : Integer;
    pending       : Integer;
    uploaded      : Integer;
    percentage    : Decimal(5,2);
    usageMonth    : Integer;
    usageQuarter  : Integer;
    usageYear     : Integer;
}


using { aspire.finsight as db } from '../db/schema';

// This exposes the HANA table as a web service for your UI5 frontend
service MfuDashboardService {
    entity ModuleSummary as projection on db.ModuleSummary;
}
