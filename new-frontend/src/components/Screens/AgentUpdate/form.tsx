



import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Trash2, FileText, HardDrive, Download, Upload, Calendar, 
  CheckCircle2, Save, Loader2, AlertCircle, Clock, Database,
  Trash
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/common/DataTable";
import { 
  useGetUsersByGroupSearch, 
  useGetUserCountByGroupSearch, 
  useAddAgentUpdate,
  useGetInstalledSystems
} from "./hooks";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import CustomModal from "@/components/common/Modal/DialogModal";
import Breadcrumb from "@/components/common/breadcrumb";

const formatDate = (date: string) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AgentUpdateForm = () => {
  const addMutation = useAddAgentUpdate();
  const getUsersByGroupSearch = useGetUsersByGroupSearch();
  const getUserCountByGroupSearch = useGetUserCountByGroupSearch();
  const { data: installSystem } = useGetInstalledSystems();

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error'>('saving');

const initialFormState = {
  targetDateTime: "",
  systemSerialNumbers: [] as string[],
  files: [
    {
      updateType: "STORE",
      fileName: "",
      serverDirectory: "",
      localDirectory: "",
    },
  ],
};



 const [formData, setFormData] = useState(initialFormState);


  // --- Table/Search State ---
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchDataCount, setSearchDataCount] = useState(0);
  console.log("searchDataCount",searchDataCount);
  
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [filterColumns, setFilterColumns] = useState<any[]>([]);

  const installSystemData = isSearchActive ? filteredData : installSystem;

  const [uploadedSerialNumbers, setUploadedSerialNumbers] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSerialListModal, setShowSerialListModal] = useState(false);

  // --- Handlers ---

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

      const serials = jsonData
        .map((row) => row["Serial Number"]?.toString().trim())
        .filter(Boolean);

      setUploadedSerialNumbers(serials);
      
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 300);
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ "Serial Number": "" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "serial_numbers_template.xlsx");
  };

  const updateFile = (index: number, field: string, value: string) => {
    const updatedFiles = [...formData.files];
    let newFile = { ...updatedFiles[index], [field]: value };

    if (field === "updateType" && value === "WORKS") {
      newFile.serverDirectory = "/";
      newFile.localDirectory = "/";
    }

    updatedFiles[index] = newFile;
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleGroupSearch = (filters: Record<string, any>) => {
    const activeFilters = Object.entries(filters)
      .filter(([_, v]) => v.filter && v.filter.trim() !== "")
      .map(([key, v]) => ({ columnName: key, value: v.filter }));

    if (activeFilters.length === 0) {
      setFilteredData([]);
      setIsSearchActive(false);
      setPage(1);
      return;
    }

    const payload = { columns: activeFilters, pageNo: page, perPage: rowsPerPage };
    setFilterColumns(activeFilters);
    setIsSearchActive(true);

    getUsersByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    getUserCountByGroupSearch.mutate(payload, { onSuccess: (count) => setSearchDataCount(count || 0) });
  };

  useEffect(() => {
    if (isSearchActive && filterColumns?.length) {
      const payload = { columns: filterColumns, pageNo: page, perPage: rowsPerPage };
      getUsersByGroupSearch.mutate(payload, { onSuccess: (data) => setFilteredData(data) });
    }
  }, [page, rowsPerPage]);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    return interval;
  };



//   const formatTargetDateTime = (value: string) => {
//   if (!value) return null;
//   const date = new Date(value);
//   return date.toISOString().slice(0, 19); // removes ms + Z
// };



 const handleFinalSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.targetDateTime) {
    toast.error("Please select a Deployment Target Date & Time.");
    return;
  }

  if (formData.files.length === 0) {
    toast.error("Please add at least one file configuration.");
    return;
  }

  const invalidFile = formData.files.find(
    (f) => !f.fileName || !f.serverDirectory || !f.localDirectory
  );
  if (invalidFile) {
    toast.error("Please ensure all file fields (Name, Server path, Local path) are filled.");
    return;
  }

  const combinedSerials = Array.from(
    new Set([...formData.systemSerialNumbers, ...uploadedSerialNumbers])
  );

  if (combinedSerials.length === 0) {
    toast.error("Please select target systems manually or upload an Excel list.");
    return;
  }

  setShowModal(true);
  setSaveStatus("saving");

  const progressInterval = simulateProgress();

  const payload = {
    ...formData,
    systemSerialNumbers: combinedSerials,
    targetDateTime: formData.targetDateTime,
  };

  addMutation.mutate(payload, {
   onSuccess: (data: any) => {
  clearInterval(progressInterval);
  setProgress(100);

  if (data?.code === 200) {
    setSaveStatus("success");

    setFormData(initialFormState);
    setUploadedSerialNumbers([]);
    setUploadProgress(0);
    setIsUploading(false);

    setFilteredData([]);
    setIsSearchActive(false);
    setSearchDataCount(0);
    setPage(1);
    setFilterColumns([]);

  } else {
    setSaveStatus("error");
  }
},

  });
};


  const systemColumns = useMemo(() => [
    { field: "serialNo", headerName: "Serial Number", flex: 1 },
    { 
      field: "installedAt", 
      headerName: "Installed At", 
      flex: 1, 
      cellRenderer: (p: any) => p.value ? formatDate(p.value) : "-" 
    },
  ], []);

  const modalColumns = useMemo(() => [
  { 
    field: "serialNo", 
    headerName: "Serial Number", 
    flex: 1,
    cellRenderer: (p: any) => <span className="font-mono">{p.value}</span>
  },
  {
    field: "actions",
    headerName: "Action",
    width: 100,
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => (
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:bg-destructive/10"
        onClick={() => {
          const serialToDelete = params.data.serialNo;
          const updated = uploadedSerialNumbers.filter((sn) => sn !== serialToDelete);
          setUploadedSerialNumbers(updated);
          setFormData(prev => ({
            ...prev,
            systemSerialNumbers: prev.systemSerialNumbers.filter(sn => sn !== serialToDelete)
          }));
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    ),
  },
], [uploadedSerialNumbers]);


const modalRowData = useMemo(() => {
  return uploadedSerialNumbers.map((sn, index) => ({
    id: index, 
    serialNo: sn
  }));
}, [uploadedSerialNumbers]);

  return (
    <>
      <div className="container mx-auto p-6 max-w-7xl space-y-6">
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/agentManagement/agentUpdate">Agent Updates</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Agent Form</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}


     <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: "Module Dashboard",
                  path: "/dashboard",
                },
                {
                  label: "Agent Update",
                      path: "/agentInstallation/agentUpdate",
                },
                 {
                  label: "Agent Form",
                      path: "/agentInstallation/agentUpdate",
                },
              ]}
            />
          </div>



        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                <span className="text-primary">Agent</span> Update Deployment
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure and schedule system updates across your infrastructure
              </p>
            </div>
            <Button 
              onClick={handleFinalSubmit} 
              disabled={addMutation.isPending}
              size="lg"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Deployment
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Deployment Schedule
                </CardTitle>
                <CardDescription>
                  Set the target date and time for deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetDateTime">Target Date & Time *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="targetDateTime"
                      type="datetime-local"
                      value={formData.targetDateTime}
                      onChange={(e) => setFormData({ ...formData, targetDateTime: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      File Configurations
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Configure files for deployment
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        files: [
                          ...p.files,
                          {
                            updateType: "STORE",
                            fileName: "",
                            serverDirectory: "",
                            localDirectory: "",
                          },
                        ],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add File
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="max-h-125 mb-4 overflow-y-auto">
                {formData.files.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files configured</p>
                  </div>
                )}

                <Accordion type="multiple" defaultValue={formData.files.map((_, i) => `file-${i}`)} className="space-y-3">
                  {formData.files.map((file, index) => (
                    <AccordionItem
                      key={index}
                      value={`file-${index}`}
                      className="border rounded-lg "
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary" />
                            <div className="text-left">
                              <p className="text-sm font-medium">
                                {file.fileName || `File ${index + 1}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {file.updateType}
                              </p>
                            </div>
                          </div>
                          {file.updateType === "WORKS" && (
                            <Badge variant="secondary" className="text-xs">
                              Auto Paths
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 ">
                        <div className="relative space-y-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                files: p.files.filter((_, i) => i !== index),
                              }))
                            }
                            className="absolute top-0 right-0 h-7 w-7 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Update Type *</Label>
                            <Select
                              value={file.updateType}
                              onValueChange={(val) => updateFile(index, "updateType", val)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="STORE">Store</SelectItem>
                                <SelectItem value="WORKS">Works</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">File Name *</Label>
                            <Input
                              placeholder="Enter fileName"
                              value={file.fileName}
                              onChange={(e) => updateFile(index, "fileName", e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Server Directory *</Label>
                            <Input
                              disabled={file.updateType === "WORKS"}
                              value={file.serverDirectory}
                              onChange={(e) => updateFile(index, "serverDirectory", e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Local Directory *</Label>
                            <Input
                              disabled={file.updateType === "WORKS"}
                              value={file.localDirectory}
                              onChange={(e) => updateFile(index, "localDirectory", e.target.value)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Target Systems
                </CardTitle>
                <CardDescription>
                  Select systems for deployment or upload via Excel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4 mt-6">
                    <div className="rounded-md border">
                      <DataTable
                        rowData={installSystemData}
                        colDefs={systemColumns}
                        isLoading={getUsersByGroupSearch.isPending}
                        pagination
                        showCheckbox
                        onFilterChange={handleGroupSearch}
                        onRowSelection={(rows: any[]) => setFormData(p => ({ 
                          ...p, 
                          systemSerialNumbers: rows.map(r => r.serialNo) 
                        }))}
                        showFilter={false} 
                        showActions={false}
                        showExportButton={false}
                        onRowsPerPageChange={undefined}
                      />
                    </div>
                    
                    {formData.systemSerialNumbers.length > 0 && (
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                          {formData.systemSerialNumbers.length} system{formData.systemSerialNumbers.length !== 1 ? 's' : ''} selected manually
                        </span>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="bulk" className="mt-6">
                    <div className="space-y-6">
                      {isUploading && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">Processing file...</p>
                          <Progress value={uploadProgress} className="h-2 rounded" />
                        </div>
                      )}
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed hover:border-primary p-12 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">Upload System List</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                          Upload an Excel or CSV file containing your system serial numbers (Column: "Serial Number")
                        </p>
                        <label>
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => e.target.files?.[0] && handleExcelUpload(e.target.files[0])}
                          />
                          <Button asChild>
                            <span className="cursor-pointer">Choose File</span>
                          </Button>
                        </label>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                      </div>

                      {uploadedSerialNumbers.length > 0 && (
                        <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">
                              {uploadedSerialNumbers.length} serial numbers found from Excel
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowSerialListModal(true)}
                          >
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Combined Totals Summary */}
                {(formData.systemSerialNumbers.length > 0 || uploadedSerialNumbers.length > 0) && (
                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">
                          Total Deployment Target: {Array.from(new Set([...formData.systemSerialNumbers, ...uploadedSerialNumbers])).length} unique systems
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


      <Dialog open={showModal} onOpenChange={() => saveStatus !== 'saving' && setShowModal(false)}>
        <DialogContent className="sm:max-w-105 p-0 overflow-hidden border-none shadow-2xl">
           <div className="p-8 text-center">
                {saveStatus === 'saving' && (
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                    <Database className="absolute h-8 w-8 text-primary" />
                  </div>
                )}
                {saveStatus === 'success' && (
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                )}
                
                <h2 className="text-xl font-bold text-slate-900">
                  {saveStatus === 'saving' ? 'Applying Configuration' : saveStatus === 'success' ? 'Deployment Ready' : 'Sync Failed'}
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed px-4">
                    {saveStatus === 'saving' ? 'We are syncing your update configuration with the central registry.' : saveStatus === 'success' ? 'The deployment has been scheduled and agents are being notified.' : 'There was an error connecting to the deployment server.'}
                </p>
                
                <div className="mt-8">
                    <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Task Status</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>
           </div>

           {saveStatus !== 'saving' && (
             <div className="bg-slate-50 px-8 py-4 flex justify-center border-t border-slate-100">
                <Button onClick={() => setShowModal(false)} className="w-full h-11">
                  {saveStatus === 'success' ? 'Done' : 'Try Again'}
                </Button>
             </div>
           )}
        </DialogContent>
      </Dialog>


   <Dialog open={showSerialListModal} onOpenChange={setShowSerialListModal}>
  <DialogContent className="max-w-4xl p-0 overflow-hidden">
    {/* Header */}
    <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/20">
      <div>
        <h2 className="text-lg font-semibold">Uploaded Serial Numbers</h2>
        <p className="text-sm text-muted-foreground">
          Reviewing {uploadedSerialNumbers.length} entries from bulk upload
        </p>
      </div>
      <Badge variant="outline" className="h-6">Excel Source</Badge>
    </div>

    {/* DataTable Area */}
    <div className="p-4 overflow-hidden">
      <div className="rounded-md border bg-card">
        <DataTable
                rowData={modalRowData}
                colDefs={modalColumns}
                isLoading={false}
                pagination={true}
                showCheckbox={false}
                showFilter={true}
                showActions={false}
                showExportButton={false} onRowsPerPageChange={undefined}        />
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-end gap-2 border-t px-6 py-4 bg-muted/10">
      <Button 
        variant="outline" 
        onClick={() => setShowSerialListModal(false)}
      >
        Close
      </Button>
    </div>
  </DialogContent>
</Dialog>




      <CustomModal
        isOpen={showSerialListModal}
        onClose={() => setShowSerialListModal(false)}
        dialogTitle={ "Uploaded Serial Numbers"}
        dialogDescription={ `Reviewing ${uploadedSerialNumbers.length} entries from bulk upload`}
        formId="user-form"
        width="max-w-5xl"
        height="h-auto"
      >
   
    <div className="p-4 overflow-hidden">
      <div className="rounded-md border bg-card">
        <DataTable
                rowData={modalRowData}
                colDefs={modalColumns}
                isLoading={false}
                pagination={true}
                showCheckbox={false}
                showFilter={false}
                showActions={false}
                showExportButton={false}
                showRowsPerPage={false}
                
                 onRowsPerPageChange={undefined}        />
      </div>
    </div>
      </CustomModal>

    </>
  );
};

export default AgentUpdateForm;