// import React, { useState, useEffect } from "react";
// import Table from "../../components/Table";
// import FormInput from "../../components/FormInput";
// import GlobleBtn from "../../components/GlobleBtn";
// import { getAgentRequest } from "../../services/agentUIServiceApi";
// import { Pagination, useTheme } from "@mui/material";

// const ExecutionResultScreen = () => {
//   const [installedSystemList, setInstalledSystemList] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//     const [srNumber, setSrNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);


//   const dataList = installedSystemList?.content||[];
// const dataCount = installedSystemList?.totalElements||0;
// const totalPages =  installedSystemList?.totalPages||1;

//   const getInstalledSystemsList = async () => {
//     setLoading(true);
//     try {
//       const { data } = await getAgentRequest(`api/execution-results?serialNumber=${srNumber}&finishedAfter=${startDate}:47.508Z&finishedBefore=${endDate}:47.508Z&page=${currentPage}&size=${pageSize}`);
//       setInstalledSystemList(data);
//     } catch (error) {
//       console.error("Error fetching installed systems:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const getInstalledSystemsByDateRange = async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       // const url = `installed-systems/get-installed-systems-by-date-range?startDate=${startDate}&endDate=${endDate}`;
//            const url = `api/execution-results?serialNumber=${srNumber}&finishedAfter=${startDate}:47.508Z&finishedBefore=${endDate}:47.508Z&page=${currentPage}&size=${pageSize}`;
     
//       const { data } = await getAgentRequest(url);
//       setInstalledSystemList(data);
//     } catch (error) {
//       console.error("Error fetching filtered installed systems:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetFilter = () => {
//     setStartDate("");
//     setEndDate("");
//     getInstalledSystemsList();
//   };

//   // const deleteSystem = async (serialNumber) => {
//   //   let url = `installed-systems/delete-by-system-serial-number?serialNumber=${serialNumber}`;
//   //   const { data } = await getAgentRequest(url);

//   //   if (data && data.code == 200) {
//   //     showToast(data.message, ToastTypes.success);
//   //     getInstalledSystemsList();
//   //   } else {
//   //     showToast(data.message, ToastTypes.error);
//   //   }
//   // };

//   useEffect(() => {
//     getInstalledSystemsList();
//   },[currentPage, pageSize]);

// const columns = [
//   {
//     field: "SrNo",
//     headerName: "SrNo",
//     hideable: false,
//     width: 80,
//     renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
//   },
//   { field: "scriptName", headerName: "Script Name", width: 200 },
//   { field: "scriptRunId", headerName: "Script Run ID", width: 180 },
//   { field: "executionStartDateTime", headerName: "Execution Start", width: 200 },
//   { field: "executionFinishDateTime", headerName: "Finish Date & Time", width: 200 },
//   { field: "resultCode", headerName: "Result Code", width: 150 },
//   { field: "successOutput", headerName: "Success Output", width: 250 },
//   { field: "errorOutput", headerName: "Error Output", width: 250 },
// ];

//   const theme = useTheme();


//     const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };
//   const handlePageSizeChange = (selectedOption) => {
//     const newSize = selectedOption.value;
//     setPageSize(newSize);
//     setCurrentPage(1); // Reset to the first page when the page size changes
//     // await getCommandConfigCount(); // Fetch data with the new page size
//   };


//   return (
//     <div className="container">
//       <div className="text">Execution Result</div>
      
//       {/* Date Filter Section */}
//       <div  style={{ 
//         marginTop: "13px", 
//         marginBottom: "13px", 
//         borderRadius: "8px",
//         display: "flex",
//         alignItems: "center",
//         gap: "15px",
//         flexWrap: "wrap",
//          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
//       }}>
//         <div >
//   <FormInput
//     label="Serial Number"
//     type="text"
//     value={srNumber}
//     onChange={(e) => setSrNumber(e.target.value)}
//     style={{ width: "500px" }}
//     // placeholder="Enter Serial Number"
//   />
// </div>

// <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
//   <FormInput
//     label="Finished After"
//     type="datetime-local"
//     value={startDate}
//     onChange={(e) => setStartDate(e.target.value)}
//     style={{ width: "250px" }}
//   />
// </div>

// <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
//   <FormInput
//     label="Finished Before"
//     type="datetime-local"
//     value={endDate}
//     onChange={(e) => setEndDate(e.target.value)}
//     style={{ width: "250px" }}
//   />
// </div>

        
//         <div style={{ display: "flex", gap: "10px" }}>
//           <GlobleBtn
//             variant="contained"
//             color="primary"
//             value="Filter"
//             onClick={getInstalledSystemsByDateRange}
//             style={{ minWidth: "100px" }}
            
//           />
          
//           <GlobleBtn
//             variant="outlined"
//             color="secondary"
//             value="Reset"
//             onClick={resetFilter}
//             style={{ minWidth: "100px" }}
            
//           />
//         </div>
//       </div>

//       <div className="table-body" style={{ marginTop: "13px" }}>
//         <div className="table-btn-group"></div>

//           <div id="inventoryTable">
//             <Table
//               columns={columns}
//               data={dataList ?? []}
//               tableKey={"InstalledSystems"}
//               showExportButton={true}
//                 showPageButton2={true}
//                      showPageFooter={true}
//               props={{
//                 loading: loading
//               }}
//                   pageSize={pageSize}
//                 handlePageSizeChange={handlePageSizeChange}
//                        tablePerPage={100}
//             />
//           </div>

//            <div className="pagination-box">
//                           <Pagination
//                             count={totalPages}
//                             color="primary"
//                             page={currentPage}
//                             onChange={handlePageChange}
//                           />
//                           {/* {renderPagination()} */}
//                         </div>
//       </div>
//     </div>
//   );
// };

// export default ExecutionResultScreen;





import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  useTheme,
} from "@mui/material";

import DataTable from "../../components/Table";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { BiCloudUpload } from "react-icons/bi";

export default function ScriptRunnerStepper() {
  const theme = useTheme();

  // -------- STATE DECLARATIONS -------- //

  const [scriptTypes, setScriptTypes] = useState([]);
  const [platformList, setPlatformList] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Script Info",
    "Dependency Documents",
    "Scheduler",
    "Target Systems",
    "Review & Submit",
  ];

  const [scriptName, setScriptName] = useState("");
  const [scriptDescription, setScriptDescription] = useState("");
  const [scriptType, setScriptType] = useState("");
  const [scriptCategory, setScriptCategory] = useState(""); // TEXT or FILE
  const [allowedExtensions, setAllowedExtensions] = useState([]);

  const [commandText, setCommandText] = useState("");
  const [scriptFile, setScriptFile] = useState(null);
  const [scriptFileId, setScriptFileId] = useState(null);

  const [dependencyFiles, setDependencyFiles] = useState([]);
  const [dependencyFileIds, setDependencyFileIds] = useState([]);

  const [scheduleType, setScheduleType] = useState("ONE_TIME");
  const [repeatType, setRepeatType] = useState("seconds");
  const [repeatIntervalSeconds, setRepeatIntervalSeconds] = useState("");
  const [startDateTime, setStartDateTime] = useState("");

  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [selectedMonthDay, setSelectedMonthDay] = useState(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [windowsSystems, setWindowsSystems] = useState([]);
  const [macSystems, setMacSystems] = useState([]);
  const [linuxSystems, setLinuxSystems] = useState([]);

  const [selectedSystems, setSelectedSystems] = useState([]);

  const [activePlatformTab, setActivePlatformTab] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // -------- LOAD INITIAL DATA -------- //

  useEffect(() => {
    loadScriptTypes();
    loadPlatforms();
  }, []);

  const loadScriptTypes = async () => {
    const { data } = await getAgentRequest("/api/scripts/types");
    setScriptTypes(data);
  };

  const loadPlatforms = async () => {
    const { data } = await getAgentRequest("/api/scripts/platforms");
    setPlatformList(data);
  };

  // -------- 3 TABLE SYSTEM LIST LOADERS -------- //

  const loadWindowsSystems = async () => {
    const { data } = await getAgentRequest("/installed-systems/get-windows-systems");
    setWindowsSystems(data);
  };

  const loadMacSystems = async () => {
    const { data } = await getAgentRequest("/installed-systems/get-macos-systems");
    setMacSystems(data);
  };

  const loadLinuxSystems = async () => {
    const { data } = await getAgentRequest("/installed-systems/get-linux-systems");
    setLinuxSystems(data);
  };

  // Run fetch when platform selection changes
  useEffect(() => {
    if (selectedPlatforms.includes("ANY")) {
      loadWindowsSystems();
      loadMacSystems();
      loadLinuxSystems();
      return;
    }

    if (selectedPlatforms.some(x => x.startsWith("WINDOWS"))) loadWindowsSystems();
    if (selectedPlatforms.some(x => x.startsWith("MACOS"))) loadMacSystems();
    if (selectedPlatforms.some(x => x.startsWith("LINUX"))) loadLinuxSystems();
  }, [selectedPlatforms]);

  // -------- SCRIPT TYPE CHANGE HANDLER -------- //

  const handleScriptTypeChange = (e) => {
    const val = e.target.value;
    setScriptType(val);

    const selected = scriptTypes.find((t) => t.enumName === val);
    if (selected) {
      setScriptCategory(selected.category);
      setAllowedExtensions(selected.extensions || []);
    }

    setCommandText("");
    setScriptFile(null);
    setScriptFileId(null);
  };

  // -------- FILE UPLOAD -------- //

  const uploadFile = async (file) => {
    const user = JSON.parse(sessionStorage.getItem("agentUser"));
    const uploadedBy = user?.userName || "system admin";

    const formData = new FormData();
    formData.append("file", file);

    const res = await postAgentRequest(
      `/api/script-files/upload?uploadedBy=${uploadedBy}`,
      formData
    );

    return res.data.id;
  };

  const handleScriptFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = await uploadFile(file);
    setScriptFile(file);
    setScriptFileId(id);
  };

  const handleDependencyFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      const id = await uploadFile(file);
      setDependencyFiles((prev) => [...prev, file]);
      setDependencyFileIds((prev) => [...prev, id]);
    }
  };

  // -------- WEEKLY HANDLER -------- //

  const toggleWeekDay = (day) => {
    setSelectedWeekDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  // -------- FILTER PLATFORM SYSTEMS -------- //

  const filteredSystems = () => {
    if (selectedPlatforms.includes("ANY")) {
      return {
        windows: windowsSystems,
        mac: macSystems,
        linux: linuxSystems,
      };
    }

    return {
      windows: selectedPlatforms.some((p) => p.startsWith("WINDOWS"))
        ? windowsSystems
        : [],
      mac: selectedPlatforms.some((p) => p.startsWith("MACOS"))
        ? macSystems
        : [],
      linux: selectedPlatforms.some((p) => p.startsWith("LINUX"))
        ? linuxSystems
        : [],
    };
  };

  // -------- SUBMIT HANDLER -------- //

  const handleSubmit = async () => {
    let repeatSeconds = 0;
    if (scheduleType === "REPEAT_EVERY") {
      if (repeatType === "seconds") repeatSeconds = Number(repeatIntervalSeconds);
      if (repeatType === "minutes") repeatSeconds = Number(repeatIntervalSeconds) * 60;
      if (repeatType === "hours") repeatSeconds = Number(repeatIntervalSeconds) * 3600;
      if (repeatType === "daily") repeatSeconds = 86400;
    }

    const payload = {
      name: scriptName,
      description: scriptDescription,
      scriptType,
      scriptText: scriptCategory === "TEXT" ? commandText : "",
      scriptFileId: scriptCategory === "FILE" ? scriptFileId : null,
      dependencyFileIds,
      targetPlatforms: selectedPlatforms,
      targetSystemSerials: selectedSystems,
      scheduleType,
      startDateTime,
      repeatEverySeconds: repeatSeconds,
      weekDays: selectedWeekDays,
      monthDay: selectedMonthDay || 0,
      isActive,
    };

    console.log("FINAL PAYLOAD:", payload);

    await postAgentRequest("/api/scripts", payload);
    alert("Script created successfully!");
  };

  // -------- RENDER UI -------- //

  const systemsColumns = [
    { field: "serialNo", headerName: "Serial Number", width: 200 },
    { field: "installedAt", headerName: "Installed At", width: 200 },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const systems = filteredSystems();

  const renderStepContent = (step) => {
    switch (step) {

      // ----------------- STEP 0 : SCRIPT INFO ------------------ //
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Script Name"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={scriptDescription}
                onChange={(e) => setScriptDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Script Type</InputLabel>
                <Select value={scriptType} onChange={handleScriptTypeChange}>
                  {scriptTypes.map((t) => (
                    <MenuItem key={t.enumName} value={t.enumName}>
                      {t.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {scriptCategory === "TEXT" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Command"
                  rows={3}
                  multiline
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                />
              </Grid>
            )}

            {scriptCategory === "FILE" && (
              <Grid item xs={12}>
                <Box
                  component="label"
                  sx={{
                    border: "2px dashed #1976d2",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <BiCloudUpload size={35} color="#1976d2" />
                  <Typography>Upload Script File</Typography>
                  <input type="file" hidden onChange={handleScriptFileChange} />
                </Box>

                {scriptFile && <Chip sx={{ mt: 1 }} label={scriptFile.name} />}
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                }
                label="Is Active?"
              />
            </Grid>
          </Grid>
        );

      // ----------------- STEP 1 : DEPENDENCY FILES ------------------ //
      case 1:
        return (
          <Box>
            <Typography variant="h6">Dependency Files</Typography>

            <Box
              component="label"
              sx={{
                width: "100%",
                border: "2px dashed #9c27b0",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <BiCloudUpload size={45} color="#9c27b0" />
              <Typography>Upload Dependency Files</Typography>
              <input type="file" multiple hidden onChange={handleDependencyFilesChange} />
            </Box>

            {dependencyFiles.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {dependencyFiles.map((file, i) => (
                  <Chip key={i} label={file.name} color="secondary" />
                ))}
              </Box>
            )}
          </Box>
        );

      // ----------------- STEP 2 : SCHEDULER ------------------ //
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Schedule Type</InputLabel>
                <Select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
                  <MenuItem value="ONE_TIME">One Time</MenuItem>
                  <MenuItem value="REPEAT_EVERY">Repeat Every</MenuItem>
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {scheduleType === "REPEAT_EVERY" && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Repeat Type</InputLabel>
                  <Select value={repeatType} onChange={(e) => setRepeatType(e.target.value)}>
                    <MenuItem value="seconds">Seconds</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date-Time"
                InputLabelProps={{ shrink: true }}
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </Grid>

            {scheduleType === "REPEAT_EVERY" && repeatType !== "daily" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={`Repeat Every (${repeatType})`}
                  value={repeatIntervalSeconds}
                  onChange={(e) => setRepeatIntervalSeconds(e.target.value)}
                />
              </Grid>
            )}

            {scheduleType === "WEEKLY" && (
              <Grid item xs={12}>
                <Typography>Week Days</Typography>
                {weekDays.map((d) => (
                  <FormControlLabel
                    key={d}
                    control={
                      <Checkbox
                        checked={selectedWeekDays.includes(d)}
                        onChange={() => toggleWeekDay(d)}
                      />
                    }
                    label={d}
                  />
                ))}
              </Grid>
            )}

            {scheduleType === "MONTHLY" && (
              <Grid item xs={12}>
                <Typography>Select One Date</Typography>
                <RadioGroup
                  row
                  value={selectedMonthDay}
                  onChange={(e) => setSelectedMonthDay(Number(e.target.value))}
                >
                  {monthDays.map((d) => (
                    <FormControlLabel key={d} value={d} control={<Radio />} label={d} />
                  ))}
                </RadioGroup>
              </Grid>
            )}
          </Grid>
        );

      // ----------------- STEP 3 : TARGET SYSTEMS ------------------ //
      case 3:
        return (
          <Box>
            <Typography sx={{ mb: 2, fontWeight: 600 }}>Select Target Platforms</Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Platforms</InputLabel>
              <Select
                multiple
                value={selectedPlatforms}
                onChange={(e) => setSelectedPlatforms(e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map((v) => platformList.find((p) => p.enumName === v)?.displayName)
                    .join(", ")
                }
              >
                {platformList.map((p) => (
                  <MenuItem key={p.enumName} value={p.enumName}>
                    <Checkbox checked={selectedPlatforms.includes(p.enumName)} />
                    {p.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Platform Tabs */}
            <Tabs value={activePlatformTab} onChange={(e, v) => setActivePlatformTab(v)}>
              {systems.windows.length > 0 && <Tab label="Windows Systems" />}
              {systems.mac.length > 0 && <Tab label="macOS Systems" />}
              {systems.linux.length > 0 && <Tab label="Linux Systems" />}
            </Tabs>

            {/* TAB CONTENTS */}
            {activePlatformTab === 0 && systems.windows.length > 0 && (
              <DataTable
                columns={systemsColumns}
                data={systems.windows}
                tableKey="WindowsSystems"
                checkboxSelection
                onRowSelectionModelChange={setSelectedSystems}
                rowsSelectionModel={selectedSystems}
              />
            )}

            {activePlatformTab === 1 && systems.mac.length > 0 && (
              <DataTable
                columns={systemsColumns}
                data={systems.mac}
                tableKey="MacSystems"
                checkboxSelection
                onRowSelectionModelChange={setSelectedSystems}
                rowsSelectionModel={selectedSystems}
              />
            )}

            {activePlatformTab === 2 && systems.linux.length > 0 && (
              <DataTable
                columns={systemsColumns}
                data={systems.linux}
                tableKey="LinuxSystems"
                checkboxSelection
                onRowSelectionModelChange={setSelectedSystems}
                rowsSelectionModel={selectedSystems}
              />
            )}
          </Box>
        );

      // ----------------- STEP 4 : REVIEW ------------------ //
      case 4:
        return (
          <Box>
            <Typography variant="h6">Review Script Details</Typography>
            <Typography><b>Name:</b> {scriptName}</Typography>
            <Typography><b>Type:</b> {scriptType}</Typography>
            <Typography><b>Platforms:</b> {selectedPlatforms.join(", ")}</Typography>
            <Typography><b>Selected Systems:</b> {selectedSystems.join(", ")}</Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  // -------- MAIN UI WRAPPER -------- //

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 2 }}>
      <Typography sx={{ mb: 3 }} variant="h4" align="center">
        Script Runner
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ p: 3 }}>
        <CardContent>{renderStepContent(activeStep)}</CardContent>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Previous
          </Button>

          {activeStep < 4 ? (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)}>
              Next
            </Button>
          ) : (
            <Button color="success" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}
