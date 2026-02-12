import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CloudUpload,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Monitor,
  Info,
  RotateCw,
  HardDrive,
  Settings,
  FileText,
  Layers,
  X,
  Plus,
  AlertCircle,
  Upload,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";

import CustomModal from "@/components/common/Modal/DialogModal";
import { Progress } from "@/components/ui/progress";
import Breadcrumb from "@/components/common/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/context/auth-context";
import {  useGetAllAssetByLimitAndGroupSearch, useGetCountAllAssetByLimitAndGroupSearch, useGetSystemList, useGetSystemListCount, useSubmitScriptForTemplate, useUploadFile } from "../ScriptRunner/hooks";

const STEPS = ["Configuration", "Scheduling","Format", "Targeting", "Finalize"];

const WEEK_DAYS = [
  { label: "Mon", value: "MONDAY" },
  { label: "Tue", value: "TUESDAY" },
  { label: "Wed", value: "WEDNESDAY" },
  { label: "Thu", value: "THURSDAY" },
  { label: "Fri", value: "FRIDAY" },
  { label: "Sat", value: "SATURDAY" },
  { label: "Sun", value: "SUNDAY" },
];

export default function ScriptTemplateRun() {
  const location = useLocation();
  const template = location.state?.template;
  const [activeStep, setActiveStep] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const targetPlatformsCsv = template?.targetPlatformsCsv || "";
  const selectedPlatformsData: string[] = targetPlatformsCsv
    .split(",")
    .map((p: any) => p.trim())
    .filter((p: any) => p.length > 0);

  const [form, setForm] = useState<any>({
    templateId: template?.id || 0,
    scriptName: "",
    scriptDescription: "",

    scriptFileName: "",
    scriptType: template?.scriptType || "",
    scriptFileId: template?.scriptFileId || null,
    dependencyFiles: [],
    dependencyFileIds: template?.dependencyFileIds || [],
    isActive: template?.active ?? true,
    params:
      template?.parameters?.reduce(
        (acc: any, p: any) => ({
          ...acc,
          [p.paramName]: p.defaultValue || "",
        }),
        {},
      ) || {},
      
    scheduleType: "ONE_TIME",
    startDateTime: "",
    repeatIntervalSeconds: "",
    repeatType: "minutes",
    selectedWeekDays: [],
    selectedMonthDay: 0,
    selectedPlatforms: selectedPlatformsData || [],
    selectedWindowsSystems: [],
    selectedMacSystems: [],
    selectedLinuxSystems: [],
        parsingFormat:'',
  });

  const uploadMutation = useUploadFile();
  const submitMutation = useSubmitScriptForTemplate();

    const navigate = useNavigate();

    
  const availableTabs = useMemo(() => {
    const tabs = [];
    if (selectedPlatformsData.includes("ANY"))
      return ["WINDOWS", "MAC", "LINUX"];

    if (selectedPlatformsData.some((p) => p.startsWith("WINDOWS")))
      tabs.push("WINDOWS");
    if (
      selectedPlatformsData.some(
        (p) => p.startsWith("MAC") || p.startsWith("MAC"),
      )
    )
      tabs.push("MAC");
    if (selectedPlatformsData.some((p) => p.startsWith("LINUX")))
      tabs.push("LINUX");

    return tabs;
  }, [selectedPlatformsData]);
  const [activePlatform, setActivePlatform] = useState<string>(
    availableTabs[0] || "",
  );

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activePlatform)) {
      setActivePlatform(availableTabs[0]);
    }
  }, [availableTabs]);

  const { data: systems, isLoading: loading } = useGetSystemList(
    `/api/sam/getAssetsByLimit?pageNo=${page}&perPage=${rowsPerPage}&osType=${activePlatform}`,
  );

  const { data: systemCount } = useGetSystemListCount(activePlatform);

  const sysTableData = useMemo(
    () => (filteredData.length ? filteredData : systems || []),
    [filteredData, systems],
  );

  const totalItems = isSearchActive
    ? searchDataCount
    : systemCount || sysTableData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const onParamFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMutation.mutateAsync(file);
      setForm({
        ...form,
        scriptFileId: res.id,
        scriptFileName: file.name,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const onAddDependency = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadMutation.mutateAsync(file);
    setForm({
      ...form,
      dependencyFiles: [...form.dependencyFiles, file],
      dependencyFileIds: [...form.dependencyFileIds, res.id],
    });
  };

  const [uploadedSerialNumbers, setUploadedSerialNumbers] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSerialListModal, setShowSerialListModal] = useState(false);

  const handleExcelUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      let progressVal = 0;
      const interval = setInterval(() => {
        progressVal += 20;
        if (progressVal >= 80) clearInterval(interval);
        setUploadProgress(progressVal);
      }, 300);

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

    const devices = jsonData
      .map((row) => ({
        serialNo: row["Serial Number"]?.toString().trim(),
        hostName: row["Host Name"]?.toString().trim(),
      }))
      .filter(item => item.serialNo || item.hostName);

      setUploadedSerialNumbers(devices);
      // example output:
      // [{ serialNo: "ABC123", hostName: "HOST-01" }]

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 300);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Serial Number": "",
        "Host Name": "",
      },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "serial_and_host_template.xlsx");
  };


  const {user}=useAuth();

  const handleSubmit = () => {
    let repeatSeconds = 0;
    if (form.scheduleType === "REPEAT_EVERY") {
      const val = Number(form.repeatIntervalSeconds);
      if (form.repeatType === "seconds") repeatSeconds = val;
      if (form.repeatType === "minutes") repeatSeconds = val * 60;
      if (form.repeatType === "hours") repeatSeconds = val * 3600;
      if (form.repeatType === "daily") repeatSeconds = 86400;
    }

    const payload = {
      name: form.scriptName,
      description:form.scriptDescription,
      templateId: form.templateId,
      scriptFileId: form.scriptFileId,
      dependencyFileIds: form.dependencyFileIds,
      isActive: form.isActive,
          addedBy: user?.id || 0,
      targetPlatforms: form.selectedPlatforms,
   serialNoHostName: [
  ...form.selectedWindowsSystems,
  ...form.selectedMacSystems,
  ...form.selectedLinuxSystems,
  ...uploadedSerialNumbers,
],

format:form.parsingFormat,
      scriptType: form.scriptType,
      params: form.params,
      scheduleType: form.scheduleType,
      startDateTime: form.startDateTime
        ? new Date(form.startDateTime).toISOString()
        : null,
      repeatEverySeconds: repeatSeconds,
      weekDays: form.selectedWeekDays,
      monthDay: form.selectedMonthDay || 0,
    };
    submitMutation.mutate(payload);
  };

  const getUsersByGroupSearch = useGetAllAssetByLimitAndGroupSearch();
  const getUserCountByGroupSearch = useGetCountAllAssetByLimitAndGroupSearch();

  const handleGroupSearch = (filters: Record<string, any>) => {
    const hasFilters = Object.values(filters).some(
      (f) => f.filter && f.filter.trim() !== "",
    );

    if (!hasFilters) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = {
      columns: Object.entries(filters)
        .filter(([_, value]) => value.filter && value.filter.trim() !== "")
        .map(([key, value]) => ({
          columnName: key,
          value: value.filter,
        })),
      osType: activePlatform,
      pageNo: 1,
      perPage: rowsPerPage,
    };

    setFilterColumns(payload.columns);
    setIsSearchActive(true);
    setPage(1);

    getUsersByGroupSearch.mutate(payload, {
      onSuccess: (data) => setFilteredData(data),
    });
    getUserCountByGroupSearch.mutate(payload, {
      onSuccess: (count) => setSearchDataCount(count || 0),
    });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = {
        columns: filterColumns,
        osType: activePlatform,
        pageNo: page,
        perPage: rowsPerPage,
      };

      getUsersByGroupSearch.mutate(payload, {
        onSuccess: (data) => setFilteredData(data),
      });
      getUserCountByGroupSearch.mutate(payload, {
        onSuccess: (count) => setSearchDataCount(count || 0),
      });
    }
  }, [page, rowsPerPage, activePlatform]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr No",
        valueGetter: (params: any) =>
          (page - 1) * rowsPerPage + (params.node.rowIndex + 1),
        width: 80,
        filter: false,
      },
      { field: "serialNo", headerName: "Serial Number" },
      { field: "hostName", headerName: "Host Name" },
      { field: "employeeName", headerName: "Employee Name" },
      { field: "employeeNo", headerName: "Employee Number" },
      { field: "assetId", headerName: "Asset ID" },
      { field: "projectName", headerName: "Project Name" },
      { field: "make", headerName: "Make" },
      { field: "model", headerName: "Model" },
    ],
    [page, rowsPerPage],
  );

  
    const transformSystemData = (data: any[]) =>
    data.map((item) => ({
      ...item,
      serialNo: item.serialNo || "-",
      hostName: item.hostName || "-",
      employeeName: item.employeeName || "-",
      employeeNo: item.employeeNo || "-",
      assetId: item.assetId || "-",
      projectName: item.projectName || "-",
      make: item.make || "-",
      model: item.model || "-",
    }));
  
  
    const exportPayload = useMemo(
    () => ({
      columns: filterColumns,
      osType: activePlatform,
      pageNo: 1,
      perPage: isSearchActive ? searchDataCount : totalItems||10000,
    }),
    [filterColumns, activePlatform, isSearchActive, searchDataCount, totalItems],
  );
  
  
  const getAllSystems = useGetSystemList(
    `/api/sam/getAssetsByLimit?pageNo=1&perPage=${exportPayload.perPage}&osType=${activePlatform}`
  );
  
  const allSystemsForExport = async (): Promise<any[]> => {
    if (isSearchActive) {
      return new Promise<any[]>((resolve, reject) => {
        getUsersByGroupSearch.mutate(exportPayload, {
          onSuccess: (data) => resolve(transformSystemData(data)),
          onError: reject,
        });
      });
    } else {
      return new Promise<any[]>((resolve, reject) => {
        getAllSystems
          .refetch()
          .then((res: any) => resolve(transformSystemData(res.data || [])))
          .catch(reject);
      });
    }
  };



const isStep0Valid = () => {
  // Script name required
  if (!form.scriptName.trim()) return false;

  for (const param of template?.parameters || []) {
    // TEXT & ARGUMENT
    if (
      (param.paramType === "TEXT" || param.paramType === "ARGUMENT") &&
      param.required &&
      !form.params[param.paramName]?.toString().trim()
    ) {
      return false;
    }

    // SCRIPT FILE
    if (
      param.paramType === "SCRIPT_FILE" &&
      param.required &&
      !form.scriptFileId
    ) {
      return false;
    }

    // DEPENDENCY FILE
    if (
      param.paramType === "DEPENDENCY_FILE" &&
      param.required &&
      (!form.dependencyFileIds || form.dependencyFileIds.length === 0)
    ) {
      return false;
    }
  }

  return true;
};

const isStep1Valid = () => {
  if (!form.scheduleType) return false;

  if (!form.startDateTime) return false;

  if (form.scheduleType === "REPEAT_EVERY") {
    if (
      !form.repeatIntervalSeconds ||
      Number(form.repeatIntervalSeconds) <= 0
    ) {
      return false;
    }
  }

  if (form.scheduleType === "WEEKLY") {
    if (!form.selectedWeekDays || form.selectedWeekDays.length === 0) {
      return false;
    }
  }

  if (form.scheduleType === "MONTHLY") {
    if (!form.selectedMonthDay || form.selectedMonthDay < 1) {
      return false;
    }
  }

  return true;
};

const isStep2Valid = () => {

  return true;
};


const isStep3Valid = () => {
  const totalTargets =
    form.selectedWindowsSystems.length +
    form.selectedMacSystems.length +
    form.selectedLinuxSystems.length +
    uploadedSerialNumbers.length;

  return totalTargets > 0;
};


const isCurrentStepValid = () => {
  switch (activeStep) {
    case 0:
      return isStep0Valid();
    case 1:
      return isStep1Valid();
         case 2:
      return isStep2Valid();
    case 3:
      return isStep3Valid();
    default:
      return true;
  }
};



const isSuccess = submitMutation.isSuccess;



  return (
    <div className="mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-700">
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              label: "Module Dashboard",
              path: "/app/dashboard",
            },
            {
              label: "Script Templates",
              path: "/app/scriptRunner/scriptTemplate",
            },
            {
              label: "Script Template Run",
              path: "/app/scriptRunner/scriptTemplateRun",
            },
          ]}
        />
      </div>

      <div className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-xs">
            <Settings className="w-4 h-4" /> Script Automation
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {"Automate Script Template"}
          </h1>
          <p className="text-muted-foreground max-w-2xl italic">
            {"Configure and deploy this template across your infrastructure."}
          </p>
        </div>
        <div className="hidden md:block">
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm rounded-full border-primary/30 bg-primary/5"
          >
            Template ID: {form.templateId}
          </Badge>
        </div>
      </div>
{!isSuccess ? (
  <>
      <div className="relative flex justify-between max-w-4xl mx-auto mb-12">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500 z-0"
          style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, i) => (
          <div
            key={step}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-4 
              ${activeStep >= i ? "bg-primary border-background text-white scale-110 shadow-lg" : "bg-background border-muted text-muted-foreground"}`}
            >
              {activeStep > i ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="font-bold">{i + 1}</span>
              )}
            </div>
            <span
              className={`text-xs font-bold uppercase ${activeStep >= i ? "text-primary" : "text-muted-foreground"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <Card className=" border-none ring-1 ring-border overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="p-8 min-h-125">
            {activeStep === 0 && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6 grid grid-cols-2 gap-2">
  {/* Script Name */}
  <div className="space-y-2">
    <Label className="font-bold">
      Script Name <span className="text-destructive">*</span>
    </Label>
    <Input
      value={form.scriptName}
      onChange={(e) =>
        setForm({ ...form, scriptName: e.target.value })
      }
      className={`h-12 ${
        !form.scriptName.trim()
          ? "border-red-300 bg-red-50/30"
          : ""
      }`}
      placeholder="Enter script name"
    />

  </div>


  <div className="space-y-2">
    <Label className="font-bold">Script Description</Label>
   
     <Input
      value={form.scriptDescription}
      onChange={(e) =>
        setForm({ ...form, scriptDescription: e.target.value })
      }
      className="h-12"
      placeholder="Enter script description"
    />
  </div>
</div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-4 text-lg font-semibold border-l-4 border-primary pl-3">
                      <FileText className="w-5 h-5 text-primary" /> Parameters &
                      Script Files
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {template?.parameters?.map((param: any) => (
                        <div key={param.paramName} className="space-y-2">
                          <Label className="flex items-center gap-1.5 font-bold text-sm">
                            {param.paramName}
                            {param.required && (
                              <Badge
                                variant="destructive"
                                className="h-4 px-1 text-[10px]"
                              >
                                Required
                              </Badge>
                            )}
                          </Label>

                          {(param.paramType === "TEXT" ||
                            param.paramType === "ARGUMENT") && (
                            <Input
                              value={form.params[param.paramName]}
                              className={`h-12 ${param.required && !form.params[param.paramName] ? "border-red-300 bg-red-50/30" : "bg-background"}`}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  params: {
                                    ...form.params,
                                    [param.paramName]: e.target.value,
                                  },
                                })
                              }
                              placeholder={`Enter value for ${param.paramName}...`}
                            />
                          )}

                          {param.paramType === "SCRIPT_FILE" && (
                            <div className={`space-y-6 p-6 rounded-3xl border ${
  param.required && !form.scriptFileId
    ? "border-red-400 bg-red-50/20"
    : "border-muted-foreground/30"
}`}
>
                              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                                <Layers className="w-5 h-5 text-primary" />{" "}
                                Script File
                              </div>
                              <p className="text-xs text-muted-foreground font-medium italic">
                                Add supporting files needed by the main script.
                              </p>

                              <div className="group relative border-2 border-dashed border-primary/30 rounded-2xl h-24 flex flex-col items-center justify-center bg-background hover:bg-primary/5 hover:border-primary transition-all cursor-pointer">
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  onChange={(e) => onParamFileUpload(e)}
                                />
                                {form.params[param.paramName] ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <CloudUpload className="w-5 h-5" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                  Attach Script File
                                </span>
                              </div>

                              <div className="space-y-2 mt-4 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar">
                                {form.scriptFileName && (
                                  <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-primary/10 text-sm shadow-sm animate-in fade-in zoom-in-95">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                        <FileText className="w-4 h-4" />
                                      </div>
                                      <span className="font-mono text-[11px] font-bold text-primary truncate max-w-35">
                                        {form.scriptFileName}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {!form.scriptFileId && (
                                  <div className="text-center py-4 opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                      No file added
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {param.paramType === "DEPENDENCY_FILE" && (
                            <div className={`space-y-6 p-6 rounded-3xl border ${
  param.required && param.required && form.dependencyFileIds.length === 0

    ? "border-red-400 bg-red-50/20"
    : "border-muted-foreground/30"
}`}
>
                              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                                <Layers className="w-5 h-5 text-primary" />{" "}
                                Dependencies
                              </div>
                              <p className="text-xs text-muted-foreground font-medium italic">
                                Add supporting files needed by the main script.
                              </p>

                              <div className="group relative border-2 border-dashed border-primary/30 rounded-2xl h-24 flex flex-col items-center justify-center bg-background hover:bg-primary/5 hover:border-primary transition-all cursor-pointer">
                                <input
                                  type="file"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  onChange={onAddDependency}
                                />
                                <Plus className="w-6 h-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                  Attach Dependency
                                </span>
                              </div>

                              <div className="space-y-2 mt-4 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar">
                                {form.dependencyFiles.map(
                                  (f: File, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-3 bg-background rounded-xl border border-primary/10 text-sm shadow-sm animate-in fade-in zoom-in-95"
                                    >
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="font-mono text-[11px] font-bold text-primary truncate max-w-35">
                                          {f?.name}
                                        </span>
                                      </div>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                                        onClick={() => {
                                          const newFiles = [
                                            ...form.dependencyFiles,
                                          ];
                                          const newIds = [
                                            ...form.dependencyFileIds,
                                          ];
                                          newFiles.splice(i, 1);
                                          newIds.splice(i, 1);
                                          setForm({
                                            ...form,
                                            dependencyFiles: newFiles,
                                            dependencyFileIds: newIds,
                                          });
                                        }}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ),
                                )}
                                {form.dependencyFileIds.length === 0 && (
                                  <div className="text-center py-4 opacity-40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                      No dependencies added
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold italic underline">
                    Execution Schedule
                  </h3>
                  <p className="text-muted-foreground">
                    Decide when and how often this script should trigger.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Schedule Type</Label>
                    <Select
                      value={form.scheduleType}
                      onValueChange={(val) =>
                        setForm({ ...form, scheduleType: val })
                      }
                    >
                      <SelectTrigger className="h-14 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONE_TIME">
                          One Time Execution
                        </SelectItem>
                        <SelectItem value="REPEAT_EVERY">
                          Recurring Interval
                        </SelectItem>
                        <SelectItem value="WEEKLY">
                          Specific Days (Weekly)
                        </SelectItem>
                        <SelectItem value="MONTHLY">Day of Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Start Date &
                      Time
                    </Label>
                    <Input
                      type="datetime-local"
                      className="h-10 bg-background"
                      value={form.startDateTime}
                      onChange={(e) =>
                        setForm({ ...form, startDateTime: e.target.value })
                      }
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Leave blank to execute immediately (for one-time runs)
                    </p>
                  </div>
                </div>

                {form.scheduleType === "REPEAT_EVERY" && (
                  <Card className="bg-primary/5 border-primary/20 shadow-none">
                    <CardContent className="pt-6 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Interval Unit</Label>
                        <Select
                          value={form.repeatType}
                          onValueChange={(val) =>
                            setForm({ ...form, repeatType: val })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="seconds">Seconds</SelectItem>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Interval ({form.repeatType})</Label>
                        <Input
                          type="number"
                          placeholder="Enter number "
                          value={form.repeatIntervalSeconds}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              repeatIntervalSeconds: e.target.value,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {form.scheduleType === "WEEKLY" && (
                  <div className="flex flex-wrap justify-center gap-2 p-4 bg-muted/30 rounded-xl">
                    {WEEK_DAYS.map((day) => (
                      <Button
                        key={day.value}
                        variant={
                          form.selectedWeekDays.includes(day.value)
                            ? "default"
                            : "outline"
                        }
                        className="rounded-full w-14 h-14"
                        onClick={() => {
                          const days = form.selectedWeekDays.includes(day.value)
                            ? form.selectedWeekDays.filter(
                                (d: string) => d !== day.value,
                              )
                            : [...form.selectedWeekDays, day.value];
                          setForm({ ...form, selectedWeekDays: days });
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                )}

                {form.scheduleType === "MONTHLY" && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <Label className="text-sm font-bold uppercase tracking-wider">
                        Select Day of Month
                      </Label>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-2xl border border-dashed border-primary/20">
                      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={
                                form.selectedMonthDay === day
                                  ? "default"
                                  : "outline"
                              }
                              className={`h-10 w-10 p-0 text-xs font-bold transition-all ${
                                form.selectedMonthDay === day
                                  ? "scale-110 shadow-md"
                                  : "hover:bg-primary/10"
                              }`}
                              onClick={() =>
                                setForm({ ...form, selectedMonthDay: day })
                              }
                            >
                              {day}
                            </Button>
                          ),
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
                        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[12px] font-bold text-primary uppercase tracking-tight">
                            Scheduling Note
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            For months shorter than{" "}
                            <strong>{form.selectedMonthDay || "31"}</strong>{" "}
                            days (e.g., months with 28, 29, or 30 days), the
                            execution will automatically trigger on the{" "}
                            <strong>last day of that month</strong> to ensure
                            consistency.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
{activeStep === 2 && (
  <div className="space-y-8 animate-in fade-in">

  
    {/* FORMAT */}
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-primary">
        Output / Parsing Format
      </h3>

   <Textarea
  className="font-mono text-sm bg-slate-900 text-green-400 min-h-100"
  placeholder={`Example:
{
  "status": "success",
  "data": []
}`}
  value={form.parsingFormat}
  onChange={(e) =>
    setForm({ ...form, parsingFormat: e.target.value })
  }
/>


      <p className="text-xs text-muted-foreground">
        Supports JSON or any custom parsing format
      </p>
    </div>
  </div>
)}

            {activeStep === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="manual" className="mt-6 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <Tabs
                        value={activePlatform}
                        onValueChange={(val) => {
                          setActivePlatform(val);
                          setPage(1);
                        }}
                      >
                        <TabsList className="bg-muted p-1 rounded-xl h-12">
                          {(form.selectedPlatforms.includes("ANY") ||
                            form.selectedPlatforms.some((p: string) =>
                              p.startsWith("WINDOWS"),
                            )) && (
                            <TabsTrigger
                              value="WINDOWS"
                              className="px-6 rounded-lg gap-2"
                            >
                              <Monitor className="w-4 h-4" /> Windows
                            </TabsTrigger>
                          )}

                          {(form.selectedPlatforms.includes("ANY") ||
                            form.selectedPlatforms.some((p: string) =>
                              p.startsWith("MAC"),
                            )) && (
                            <TabsTrigger
                              value="MAC"
                              className="px-6 rounded-lg gap-2"
                            >
                              <RotateCw className="w-4 h-4" /> macOS
                            </TabsTrigger>
                          )}

                          {(form.selectedPlatforms.includes("ANY") ||
                            form.selectedPlatforms.some((p: string) =>
                              p.startsWith("LINUX"),
                            )) && (
                            <TabsTrigger
                              value="LINUX"
                              className="px-6 rounded-lg gap-2"
                            >
                              <HardDrive className="w-4 h-4" /> Linux
                            </TabsTrigger>
                          )}
                        </TabsList>
                      </Tabs>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                          Selected (Current View)
                        </p>
                        <p className="text-2xl font-black text-primary">
                          {activePlatform === "WINDOWS"
                            ? form.selectedWindowsSystems.length
                            : activePlatform === "MAC"
                              ? form.selectedMacSystems.length
                              : form.selectedLinuxSystems.length}
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-2xl overflow-hidden bg-background">
                      <DataTable
                        rowData={sysTableData || []}
                        key={activePlatform}
                        colDefs={columnDefs}
                        showCheckbox
                        selectedRows={
                          activePlatform === "WINDOWS"
                            ? form.selectedWindowsSystems
                            : activePlatform === "MAC"
                              ? form.selectedMacSystems
                              : form.selectedLinuxSystems
                        }
                    onRowSelection={(currentlySelectedRows: any[]) => {
  const key =
    activePlatform === "WINDOWS"
      ? "selectedWindowsSystems"
      : activePlatform === "MAC"
        ? "selectedMacSystems"
        : "selectedLinuxSystems";

  const mappedCurrentPageSelection = currentlySelectedRows.map((row) => ({
    serialNo: row.serialNo,
    hostname: row.hostName,
  }));

  setForm((prev: any) => {
    const otherPagesSelection = prev[key].filter(
      (savedRow: any) =>
        !sysTableData.some(
          (currentPageRow: any) =>
            currentPageRow.serialNo === savedRow.serialNo
        )
    );

    return {
      ...prev,
      [key]: [...otherPagesSelection, ...mappedCurrentPageSelection],
    };
  });
}}

                        isLoading={loading}
                        showActions={false}
                        pagination={false}
                        showPagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onFilterChange={handleGroupSearch}
                         fileName="targetSysten"
        allData={allSystemsForExport}
                        rowIdField="serialNo"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="bulk" className="mt-6 space-y-6">
                    {isUploading && (
                      <Progress value={uploadProgress} className="h-2" />
                    )}

                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">Upload System List</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Excel must contain a column named <b>Serial Number</b>
                      </p>

                      <label>
                        <Input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleExcelUpload(e.target.files[0])
                          }
                        />
                        <Button asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>

                    {uploadedSerialNumbers.length > 0 && (
                      <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/40">
                        <span className="text-sm font-semibold">
                          {uploadedSerialNumbers.length} serial numbers uploaded
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowSerialListModal(true)}
                        >
                          View
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Info className="w-24 h-24" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Check className="text-primary" /> Configuration Summary
                  </h3>
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase text-primary mb-2 tracking-widest">
                      Active Parameters
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {template?.parameters?.map((param: any) => {
                        const isFile =
                          param.paramType === "SCRIPT_FILE" ||
                          param.paramType === "DEPENDENCY_FILE";
                        const value = form.params[param.paramName];

                        if (isFile) return null;

                        return (
                          <div
                            key={param.paramName}
                            className="bg-background/50 p-2 rounded-lg border text-xs flex justify-between items-center"
                          >
                            <span className="text-muted-foreground">
                              {param.paramName}:
                            </span>
                            <span className="font-mono font-bold">
                              {value || "---"}
                            </span>
                          </div>
                        );
                      })}

                      {form.scriptFileName && (
                        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 text-xs flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-primary" />
                            <span className="text-muted-foreground">
                              Main Script:
                            </span>
                          </div>
                          <span className="font-mono font-bold text-primary">
                            {form.scriptFileName}
                          </span>
                        </div>
                      )}

                      {form.dependencyFiles.length > 0 && (
                        <div className="bg-background/50 p-2 rounded-lg border text-xs flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3 h-3" />
                            <span className="text-muted-foreground">
                              Dependencies:
                            </span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="h-5 text-[10px]"
                          >
                            {form.dependencyFiles.length} Files Attached
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="text-primary" /> Schedule & Scope
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-background p-3 rounded-xl border shadow-sm">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">
                          Execution Type
                        </p>
                        <p className="font-bold">
                          {form.scheduleType.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-background p-3 rounded-xl border shadow-sm">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">
                          Target Count
                        </p>
                        <p className="font-bold">
                          {form.selectedWindowsSystems.length +
                            form.selectedMacSystems.length +
                            form.selectedLinuxSystems.length +
                            uploadedSerialNumbers.length}{" "}
                          Devices
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p>
                      Verify all settings. Deployment will trigger automatically
                      based on the schedule provided.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. NAVIGATION FOOTER */}
          <div className="p-6 border-t bg-muted/30 backdrop-blur-md flex justify-between items-center rounded-b-xl">
            <Button
              variant="ghost"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(activeStep - 1)}
              className="gap-2 font-bold px-6"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-4">
              <p className="hidden sm:block text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                Step {activeStep + 1} of {STEPS.length}
              </p>
              <Button
             disabled={
    (activeStep === 0 && !isStep0Valid()) ||
    (activeStep === 1 && !isStep1Valid()) ||
    (activeStep === 2 && !isStep2Valid())||(activeStep === 3 && !isStep3Valid())
  }
  onClick={() => {
    if (!isCurrentStepValid()) return;

    activeStep < STEPS.length - 1
      ? setActiveStep(activeStep + 1)
      : handleSubmit();
  }}

                className={`px-8 h-11 font-bold shadow-lg transition-all ${
                  activeStep === STEPS.length - 1
                    ? "bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95"
                    : "hover:scale-105 active:scale-95"
                }`}
              >
                {activeStep === STEPS.length - 1
                  ? "Confirm & Deploy"
                  : "Next Step"}
                {activeStep < STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </div>


        </CardContent>
      </Card>
      </>
) : (
  <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95">
    <div className="relative max-w-2xl w-full  bg-linear-to-br from-green-50 to-white border border-green-200 rounded p-10 shadow-xl overflow-hidden">

      {/* Glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center shadow-inner">
          <Check className="w-14 h-14 text-green-600 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-green-700 tracking-tight">
          Deployment Successful
        </h1>

        <p className="text-muted-foreground max-w-lg mx-auto">
          Your script has been successfully scheduled and will execute
          automatically on the selected systems.
        </p>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-left">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-xs uppercase text-muted-foreground font-bold">
              Script Name
            </p>
            <p className="font-bold text-primary truncate">
              {form.scriptName}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-xs uppercase text-muted-foreground font-bold">
              Execution Type
            </p>
            <p className="font-bold">
              {form.scheduleType.replace("_", " ")}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-xs uppercase text-muted-foreground font-bold">
              Target Devices
            </p>
            <p className="font-bold">
              {form.selectedWindowsSystems.length +
                form.selectedMacSystems.length +
                form.selectedLinuxSystems.length +
                uploadedSerialNumbers.length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <p className="text-xs uppercase text-muted-foreground font-bold">
              Status
            </p>
            <Badge className="bg-green-600 text-white">
              Scheduled & Active
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex  gap-4 pt-6">
          <Button
            variant="outline"
            className="rounded-full px-8"
            onClick={()=> navigate("/app/scriptRunner/scriptTemplate")}
          >
            Back to Templates
          </Button>
        </div>
      </div>
    </div>
  </div>
)}
      <CustomModal
        isOpen={showSerialListModal}
        onClose={() => setShowSerialListModal(false)}
        dialogTitle="Uploaded Serial Numbers"
        width="w-230!"
      >
        <DataTable
          rowData={uploadedSerialNumbers}
          colDefs={[
            { field: "serialNo", headerName: "Serial Number" },
            { field: "hostName", headerName: "Host Name" },
          ]}
          pagination
          showFilter={false}
          showCheckbox={false}
          showActions={false}
          showRowsPerPage={false}
          showExportButton={false}
          isLoading={false}
          onRowsPerPageChange={undefined}
        />
      </CustomModal>
    </div>
  );
}
