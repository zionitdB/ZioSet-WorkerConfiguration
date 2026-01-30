import { useEffect, useMemo, useState } from "react";
import {
  CloudUpload,
  ChevronRight,
  ChevronLeft,
  Check,
  Terminal,
  Calendar,
  Monitor,
  Info,
  Trash2,
  RotateCw,
  Layout,
  Package,
  HardDrive,
  ScreenShareIcon,
  Upload,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/common/DataTable";

import {
  useGetScriptTypes,
  useGetPlatforms,
  useGetSystemList,
  useUploadFile,
  useSubmitScript,
  useGetSystemListCount,
  useGetAllAssetByLimitAndGroupSearch,
  useGetCountAllAssetByLimitAndGroupSearch,
} from "./hooks";
import * as XLSX from "xlsx";
import { Progress } from "@/components/ui/progress";
import CustomModal from "@/components/common/Modal/DialogModal";

const STEPS = [
  "Script Info",
  "Dependencies",
  "Scheduler",
  "Target Systems",
  "Review",
];

const WEEK_DAYS = [
  { label: "Mon", value: "MONDAY" },
  { label: "Tue", value: "TUESDAY" },
  { label: "Wed", value: "WEDNESDAY" },
  { label: "Thu", value: "THURSDAY" },
  { label: "Fri", value: "FRIDAY" },
  { label: "Sat", value: "SATURDAY" },
  { label: "Sun", value: "SUNDAY" },
];

export default function ScriptRunner() {
  const [activeStep, setActiveStep] = useState(0);
const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
const [showSuccess, setShowSuccess] = useState(false);

const initialFormState = {
  scriptName: "",
  scriptDescription: "",
  scriptType: "",
  scriptCategory: "",
  allowedExtensions: [],
  commandText: "",
  scriptFile: null,
  scriptFileId: null,
  dependencyFiles: [],
  dependencyFileIds: [],
  scheduleType: "ONE_TIME",
  startDateTime: "",
  repeatIntervalSeconds: "",
  repeatType: "seconds",
  selectedWeekDays: [],
  selectedMonthDay: null,
  selectedPlatforms: [],
  selectedWindowsSystems: [],
  selectedMacSystems: [],
  selectedLinuxSystems: [],
  isActive: true,
};

const [form, setForm] = useState<any>(initialFormState);


  const { data: scriptTypes } = useGetScriptTypes();
  const { data: platformList } = useGetPlatforms();
  const uploadMutation = useUploadFile();
  const submitMutation = useSubmitScript();

 
 
   const [activePlatform, setActivePlatform] = useState<string>(
   "",
   );
 
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

   

     const [uploadedSerialNumbers, setUploadedSerialNumbers] = useState<any[]>(
       [],
     );
     const [uploadProgress, setUploadProgress] = useState(0);
     const [isUploading, setIsUploading] = useState(false);
     const [showSerialListModal, setShowSerialListModal] = useState(false);
   
    //  const handleExcelUpload = (file: File) => {
    //    setIsUploading(true);
    //    setUploadProgress(0);
   
    //    const reader = new FileReader();
    //    reader.onload = (e) => {
    //      const data = e.target?.result;
    //      if (!data) return;
   
    //      let progressVal = 0;
    //      const interval = setInterval(() => {
    //        progressVal += 20;
    //        if (progressVal >= 80) clearInterval(interval);
    //        setUploadProgress(progressVal);
    //      }, 300);
   
    //      const workbook = XLSX.read(data, { type: "binary" });
    //      const sheetName = workbook.SheetNames[0];
    //      const worksheet = workbook.Sheets[sheetName];
    //      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
   
    //      const serials = jsonData
    //        .map((row) => row["Serial Number"]?.toString().trim())
    //        .filter(Boolean);
   
    //      setUploadedSerialNumbers(serials);
   
    //      setUploadProgress(100);
    //      setTimeout(() => {
    //        setIsUploading(false);
    //      }, 300);
    //    };
    //    reader.readAsBinaryString(file);
    //  };
   
    //  const handleDownloadTemplate = () => {
    //    const ws = XLSX.utils.json_to_sheet([{ "Serial Number": "" }]);
    //    const wb = XLSX.utils.book_new();
    //    XLSX.utils.book_append_sheet(wb, ws, "Template");
    //    XLSX.writeFile(wb, "serial_numbers_template.xlsx");
    //  };


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

    // ✅ Extract Serial Number + Host Name
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
      "Host Name": ""
    }
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "serial_and_host_template.xlsx");
};


  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        const basicInfo =
          form.scriptName.trim() !== "" && form.scriptType !== "";
        const scriptContent =
          form.scriptCategory === "TEXT"
            ? form.commandText.trim() !== ""
            : form.scriptFileId !== null;
        return basicInfo && scriptContent;

      case 1:
        return true;

      case 2:
        const hasStart = form.startDateTime !== "";
        const hasSchedule = form.scheduleType !== "";
        if (form.scheduleType === "REPEAT_EVERY") {
          return hasStart && hasSchedule && form.repeatIntervalSeconds !== "";
        }
        if (form.scheduleType === "WEEKLY") {
          return hasStart && hasSchedule && form.selectedWeekDays.length > 0;
        }
        if (form.scheduleType === "MONTHLY") {
          return hasStart && hasSchedule && form.selectedMonthDay !== null;
        }
        return hasStart && hasSchedule;

      case 3:
        const hasPlatform = form.selectedPlatforms.length > 0;
        const hasSystems =
          [
            ...form.selectedWindowsSystems,
            ...form.selectedMacSystems,
            ...form.selectedLinuxSystems,
          ].length > 0;
        return hasPlatform && hasSystems;

      default:
        return true;
    }
  };

  const isStepValid = validateStep(activeStep);

  const handleScriptTypeChange = (value: string) => {
    const selected = scriptTypes?.find((t: any) => t.enumName === value);
    if (selected) {
      setForm((prev: any) => ({
        ...prev,
        scriptType: value,
        scriptCategory: selected.category,
        allowedExtensions: selected.extensions || [],
      }));
    }
  };

  const onFileUpload = async (e: any, target: "main" | "dependency") => {
    const file = e.target.files[0];
    if (!file) return;

    if (target === "main" && form.allowedExtensions.length > 0) {
      const isValid = form.allowedExtensions.some((ext: string) =>
        file.name.endsWith(ext)
      );
      if (!isValid)
        return alert(
          `Allowed extensions: ${form.allowedExtensions.join(", ")}`
        );
    }

    const res = await uploadMutation.mutateAsync(file);
    if (target === "main") {
      setForm({ ...form, scriptFile: file, scriptFileId: res.id });
    } else {
      setForm({
        ...form,
        dependencyFiles: [...form.dependencyFiles, file],
        dependencyFileIds: [...form.dependencyFileIds, res.id],
      });
    }
  };




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
      description: form.scriptDescription,
      scriptType: form.scriptType,
      scriptText: form.scriptCategory === "TEXT" ? form.commandText : "",
      scriptFileId: form.scriptCategory === "FILE" ? form.scriptFileId : null,
      isActive: form.isActive,
      dependencyFileIds: form.dependencyFileIds,
      targetPlatforms: form.selectedPlatforms,
   serialNoHostName: [
  ...form.selectedWindowsSystems,
  ...form.selectedMacSystems,
  ...form.selectedLinuxSystems,
  ...uploadedSerialNumbers,
],

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


  useEffect(() => {
  if (submitMutation.isSuccess) {
    setShowSuccess(true);

    setForm(initialFormState);

    setActiveStep(0);
  }
}, [submitMutation.isSuccess]);


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
    perPage: isSearchActive ? searchDataCount : totalItems,
  }),
  [filterColumns, activePlatform, isSearchActive, searchDataCount, totalItems||10000],
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

  return (
    <div className=" mx-auto  px-4 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4 p-4 pb-4 border-b border-border">
        <div className="flex justify-center items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ScreenShareIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold justify-center items-center tracking-tight ">
              <span className="text-primary">Script</span> Runner
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor standalone software instances
            </p>
          </div>
        </div>
      </div>
  {!showSuccess ? ( 
    <>
      <div className="flex flex-col items-center space-y-8">
        
        <div className="flex w-full items-center justify-between relative max-w-5xl mx-auto px-4">
        
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted z-0" />

          <div
            className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -z-10 px-10"
            style={{
              width: `${(activeStep / (STEPS.length - 1)) * 100}%`,
              marginLeft: "0px",
            }}
          />

          {STEPS.map((label, idx) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 bg-background px-4 relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  activeStep >= idx
                    ? "bg-primary border-primary text-white shadow-[0_0_10px_rgba(var(--primary),0.3)] scale-110"
                    : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {activeStep > idx ? (
                  <Check className="w-5 h-5 stroke-[3px] animate-in zoom-in" />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                  activeStep >= idx
                    ? "text-primary"
                    : "text-muted-foreground/60"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
 
      <Card className="shadow-xl border-t-4 border-t-primary min-h-137.5 flex flex-col">
        <CardContent className="p-8 grow">
          {/* STEP 0: SCRIPT INFO */}
          {activeStep === 0 && (
            <div className="grid gap-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Script Name</Label>
                  <Input
                    value={form.scriptName}
                    onChange={(e) =>
                      setForm({ ...form, scriptName: e.target.value })
                    }
                    placeholder="Maintenance Task"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Script Type</Label>
                  <Select
                    value={form.scriptType}
                    onValueChange={handleScriptTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {scriptTypes?.map((t: any) => (
                        <SelectItem key={t.enumName} value={t.enumName}>
                          {t.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.scriptDescription}
                  onChange={(e) =>
                    setForm({ ...form, scriptDescription: e.target.value })
                  }
                  placeholder="Describe script functionality..."
                />
              </div>
              {form.scriptCategory === "TEXT" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Script Command
                  </Label>
                  <Textarea
                    className="font-mono bg-slate-900 text-green-400"
                    rows={6}
                    value={form.commandText}
                    onChange={(e) =>
                      setForm({ ...form, commandText: e.target.value })
                    }
                  />
                </div>
              )}
              {form.scriptCategory === "FILE" && (
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-primary/5 cursor-pointer relative transition-all group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => onFileUpload(e, "main")}
                    accept={form.allowedExtensions.join(",")}
                  />
                  <CloudUpload className="mx-auto h-10 w-10 text-muted-foreground group-hover:text-primary" />
                  <p className="mt-2 text-sm font-medium">Upload script file</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allowed: {form.allowedExtensions.join(", ")}
                  </p>
                  {form.scriptFile && (
                    <Badge className="mt-4" variant="secondary">
                      {form.scriptFile.name}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 1: DEPENDENCIES */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-secondary/50 cursor-pointer relative transition-all group">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => onFileUpload(e, "dependency")}
                />
                <Package className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary" />
                <p className="mt-2 text-lg font-semibold">
                  Drop dependency files here
                </p>
                <p className="text-sm text-muted-foreground">
                  Select multiple files if required
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.dependencyFiles.map((f: File, i: number) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="pl-3 pr-1 py-1 gap-2 flex items-center"
                  >
                    {f.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => {
                        const newFiles = [...form.dependencyFiles];
                        const newIds = [...form.dependencyFileIds];
                        newFiles.splice(i, 1);
                        newIds.splice(i, 1);
                        setForm({
                          ...form,
                          dependencyFiles: newFiles,
                          dependencyFileIds: newIds,
                        });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULER */}
          {activeStep === 2 && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Schedule Type</Label>
                  <Select
                    value={form.scheduleType}
                    onValueChange={(val) =>
                      setForm({ ...form, scheduleType: val })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_TIME">One Time</SelectItem>
                      <SelectItem value="REPEAT_EVERY">Repeat Every</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.scheduleType === "REPEAT_EVERY" && (
                  <div className="space-y-2">
                    <Label>Repeat Unit</Label>
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
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={form.startDateTime}
                    onChange={(e) =>
                      setForm({ ...form, startDateTime: e.target.value })
                    }
                  />
                </div>
                {form.scheduleType === "REPEAT_EVERY" &&
                  form.repeatType !== "daily" && (
                    <div className="space-y-2">
                      <Label>Interval ({form.repeatType})</Label>
                      <Input
                        type="number"
                        value={form.repeatIntervalSeconds}
                        placeholder="Enter number "
                        onChange={(e) =>
                          setForm({
                            ...form,
                            repeatIntervalSeconds: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
              </div>
              {form.scheduleType === "WEEKLY" && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-xl border">
                  <Label className="font-bold">Execution Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => (
                      <Button
                        key={day.value}
                        variant={
                          form.selectedWeekDays.includes(day.value)
                            ? "default"
                            : "outline"
                        }
                        className="flex-1 min-w-17.5"
                        onClick={() => {
                          const days = form.selectedWeekDays.includes(day.value)
                            ? form.selectedWeekDays.filter(
                                (d: string) => d !== day.value
                              )
                            : [...form.selectedWeekDays, day.value];
                          setForm({ ...form, selectedWeekDays: days });
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {form.scheduleType === "MONTHLY" && (
                <div className="space-y-3 p-4 bg-muted/20 rounded-xl border">
                  <Label className="font-bold text-primary">Day of Month</Label>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <Button
                        key={day}
                        variant={
                          form.selectedMonthDay === day ? "default" : "outline"
                        }
                        className="h-9 w-9 p-0 text-xs"
                        onClick={() =>
                          setForm({ ...form, selectedMonthDay: day })
                        }
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
             <div className="flex gap-3">
  {platformList?.map((p: any) => (
    <Button
      key={p.enumName}
      variant={
        form.selectedPlatforms.includes(p.enumName)
          ? "default"
          : "outline"
      }
      onClick={() => {
        const isCurrentlySelected = form.selectedPlatforms.includes(p.enumName);
        let newSelected: string[];

        if (p.enumName === "ANY") {
          newSelected = isCurrentlySelected 
            ? [] 
            : platformList.map((platform: any) => platform.enumName);
        } else {
          if (isCurrentlySelected) {
            newSelected = form.selectedPlatforms.filter(
              (x: string) => x !== p.enumName && x !== "ANY"
            );
          } else {
            const added = [...form.selectedPlatforms, p.enumName];
            const allOthersSelected = platformList
              .filter((pl: any) => pl.enumName !== "ANY")
              .every((pl: any) => added.includes(pl.enumName));
              
            newSelected = allOthersSelected 
              ? platformList.map((pl: any) => pl.enumName) 
              : added;
          }
        }

        setForm({ ...form, selectedPlatforms: newSelected });
      }}
      className="gap-2"
    >
      <Layout className="h-4 w-4" /> {p.displayName}
    </Button>
  ))}
</div>

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

  // map rows → payload-ready format
  const mappedCurrentPageSelection = currentlySelectedRows.map((row) => ({
    serialNo: row.serialNo,
    hostname: row.hostName,
  }));

  setForm((prev: any) => {
    // keep selections from other pages
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
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {activeStep === 4 && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary border-b pb-2">
                  <Info className="h-5 w-5" /> Script Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {form.scriptName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {form.scriptType}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Platforms:</span>{" "}
                    {form.selectedPlatforms.join(", ")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary border-b pb-2">
                  <Calendar className="h-5 w-5" /> Execution Plan
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {form.scheduleType}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Start:</span>{" "}
                    {form.startDateTime}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Systems:</span>{" "}
                    {form.selectedWindowsSystems.length +
                      form.selectedMacSystems.length +
                      form.selectedLinuxSystems.length}{" "}
                    selected
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-6 border-t bg-muted/30 flex justify-between items-center rounded-b-xl">
          <Button
            variant="outline"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <div className="flex gap-3">
            {activeStep < STEPS.length - 1 ? (
              <Button
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={!isStepValid}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !isStepValid}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitMutation.isPending ? "Deploying..." : "Schedule Script"}
              </Button>
            )}
          </div>
        </div>
      </Card>
</>
        ):(
  <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in">
    <div className="rounded-full bg-green-100 p-6">
      <Check className="h-10 w-10 text-green-600" />
    </div>

    <h2 className="text-2xl font-bold text-green-700">
      Script Scheduled Successfully
    </h2>

    <p className="text-sm text-muted-foreground text-center max-w-md">
      Your script has been scheduled and will run based on the selected configuration.
    </p>

    <div className="flex gap-3">
      <Button
        variant="default"
        onClick={() => {
          setShowSuccess(false);
          setActiveStep(0);
        }}
      >
        Schedule Another Script
      </Button>

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
            colDefs={[{ field: "serialNo", headerName: "Serial Number" },{ field: "hostName", headerName: "Host Name" }]}
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
