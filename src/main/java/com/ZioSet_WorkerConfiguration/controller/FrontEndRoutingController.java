package com.ZioSet_WorkerConfiguration.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontEndRoutingController {

    @RequestMapping(value = {
        "/", 
        "/Login", 
        "/redirect",
        "/ErrorPage",
        "/Overview",
        "/Home",
        "/InstallLicenseDashboard",
        "/SystemDashboard",
        "/SystemDashboard/Table",
        "/UserInventoryDetails",
        "/Getlocation",
        "/BundleApplication",
        "/Category",
        "/RolePermission",
        "/AccessManagement",
        "/WorkerLicenceKey",
        "/Permissions",
        "/Role",
        "/Permission",
        "/Email",
        "/EmailReceiver",
        "/EmailActivity",
        "/AuthorizedApplication",
        "/CustomerSuppliedSoftware",
        "/Console",
        "/Model",
        "/DemoTable",
        "/licenceDetialsInstalled",
        "/LicenseDetailsBundle",
        "/ProjectDetails",
        "/CategoriesDetails",
        "/LicenceGrouping",
        "/LicenseInventorySummery",
        "/ReportUnassignedWorker",
        "/LastDetectionReport",
        "/PurchaseExpiry",
        "/PurchaseStock",
        "/StockStatus",
        "/UsedApplicationReport",
        "/DuplicateLicenceCount",
        "/ExtraRunningApplication",
        "/SaasController",
        "/Profile",
        "/ForTablePage",
        "/CostSaving",
        "/SaasOverview",
        "/Compliance",
        "/CostSaving/Insights",
        "/Endpoint/ActiveEndpointTable",
        "/Endpoint/InactiveInventroy",
        "/License/InstallLicense",
        "/License/TodayFetchLicenseTable",
        "/License/TodayUnFetchLicenseTable",
        "/Purchase/PurchaseTable",
        "/Purchase/PurchaseExpiringList",
        "/Software/IdelSoftwareList",
        "/Software/NonComplainceTable",
        "/Software/StandAloneSoftware",
        "/SaasApplication",
        "/Bundle/BundleTable",
        "/Category/CategoryTable",
        "/SaasOverview/SaasOverviewFirstTable",
        "/SaasOverview/SaasOverviewTable",
        "/SaasOverview/SaasReport",
        "/System/SystemTable",
        "/Database/DatabaseTable",
        "/InstallLicenseDashboard/PublisherList",
        "/InstallLicenseDashboard/ProductList",
        "/InstallLicenseDashboard/BundleList",
        "/InstallLicenseDashboard/Category",
        "/Tour",
        "/Projectwisecost",
        "/Endpoint/TotalEndPoint",
        "/LastDetectionCount",
        "/PurchaseDetails",
        "/Reconciliation",
        "/CIODashboard",
        "/ciopublisher",
        "/FailedSystemList",
        "/ciocompliance",
        "/CIOProject",
        "/ComplianceApplication",
        "/ScheduleApplication",
        "/LicenceDetialsInstalled",
        "/projectCostTable",
        "/permissionApproval",
        "/RequestLists",
        "/services"
    
    })
    public String index(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        response.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://20.219.1.165:8085; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http:; frame-src 'self'; frame-ancestors 'none'; font-src 'self' https://fonts.gstatic.com; media-src 'self'; object-src 'none'; manifest-src 'self'; worker-src 'self'; form-action 'self';");
        return "forward:/index.html";
    }
}
