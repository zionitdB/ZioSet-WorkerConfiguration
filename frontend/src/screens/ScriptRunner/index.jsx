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
  useTheme,
  Radio,
  RadioGroup,
  Tabs,
  Tab,
} from "@mui/material";

import DataTable from "../../components/Table";
import {
  getAgentRequest,
  postAgentRequest,
  postFileUpload,
} from "../../services/agentUIServiceApi";
import { BiCloudUpload } from "react-icons/bi";

export default function ScriptRunnerStepper() {
  const theme = useTheme();

  // API script types
  const [scriptTypes, setScriptTypes] = useState([]);

  const steps = [
    "Script Info",
    "Dependency Documents",
    "Scheduler",
    "Target Systems",
    "Review & Submit",
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Main Form State
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
  const [startDateTime, setStartDateTime] = useState("");
  const [repeatIntervalSeconds, setRepeatIntervalSeconds] = useState("");

  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [selectedMonthDay, setSelectedMonthDay] = useState(null); 

  // const [systemsList, setSystemsList] = useState([]);
//   const [selectedSystems, setSelectedSystems] = useState([]);
// console.log("selectedSystems",selectedSystems);


const [selectedWindowsSystems, setSelectedWindowsSystems] = useState([]);
const [selectedMacSystems, setSelectedMacSystems] = useState([]);
const [selectedLinuxSystems, setSelectedLinuxSystems] = useState([]);

  const [isActive, setIsActive] = useState(true); 

const [repeatType, setRepeatType] = useState("seconds"); 
const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [windowsSystems, setWindowsSystems] = useState([]);
  const [macSystems, setMacSystems] = useState([]);
  const [linuxSystems, setLinuxSystems] = useState([]);

  const [activePlatformTab, setActivePlatformTab] = useState(0);
  const [platformList, setPlatformList] = useState([]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // const systemsColumns = [
  //   {
  //     field: "SrNo",
  //     headerName: "SrNo",
  //     hideable: false,
  //     renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
  //   },

  //   { field: "serialNo", headerName: "Serial Number", width: 200 },
  //   { field: "installedAt", headerName: "Installed At", width: 200 },
  //   { field: "employeeName", headerName: "Employee Name", width: 200 },
  //   { field: "emailId", headerName: "Email ID", width: 200 },
  //   { field: "workerAssingned", headerName: "Worker Assigned", width: 200 },
  // ];


  const platformColumns = [
  {
    field: "SrNo",
    headerName: "Sr No",
    hideable: false,
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
  },

  { field: "serialNo", headerName: "System Serial No", width: 200 },
  { field: "installed", headerName: "Installed", width: 150,
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  { field: "installedAt", headerName: "Installed At", width: 220 },
  { field: "installReqAt", headerName: "Installation Requested At", width: 250 },
  // { field: "installationResponse", headerName: "Installation Response", width: 250 },
];


  const loadScriptTypes = async () => {
    const { data } = await getAgentRequest("/api/scripts/types");
    setScriptTypes(data);
  };

  useEffect(() => {
    loadScriptTypes();
    // fetchSystemsList();
     loadPlatforms();
  }, []);

  // ---------------------------
  // FETCH TARGET SYSTEMS
  // ---------------------------
  // const fetchSystemsList = async () => {
  //   const { data } = await getAgentRequest("installed-systems/get-installed-systems-list");

  //   const formatted = data?.map((item) => ({
  //     id: item.systemSerialNo,
  //     serialNo: item.systemSerialNo,
  //     installedAt: item.installedAt,
  //   }));

  //   setSystemsList(formatted);
  // };

  // ---------------------------
  // SCRIPT TYPE CHANGE HANDLER
  // ---------------------------
  const handleScriptTypeChange = (e) => {
    const selectedEnum = e.target.value;
    setScriptType(selectedEnum);

    const selected = scriptTypes.find((t) => t.enumName === selectedEnum);

    if (selected) {
      setScriptCategory(selected.category); // TEXT or FILE
      setAllowedExtensions(selected.extensions || []);
    }

    // Reset input fields when switching
    setCommandText("");
    setScriptFile(null);
    setScriptFileId(null);
  };

  // ---------------------------
  // FILE UPLOAD HANDLER
  // ---------------------------
  const uploadFile = async (file) => {
    const user = sessionStorage.getItem('agentUser');
const uploadedBy = user?.userName||"system admin"
    const formData = new FormData();
    formData.append("file", file);

    const response = await postAgentRequest(
      `/api/script-files/upload?uploadedBy=${uploadedBy}`,
      formData
    );

    return response.data.id;
  };


  // Script file upload
  const handleScriptFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate extension
    if (allowedExtensions.length > 0) {
      const isValid = allowedExtensions.some((ext) => file.name.endsWith(ext));
      if (!isValid) {
        alert(`Only Allowed extensions Is For Selected Type is: ${allowedExtensions.join(", ")}`);
        return;
      }
    }

    setScriptFile(file);

    const id = await uploadFile(file);
    setScriptFileId(id);
  };


  const handleDependencyFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const id = await uploadFile(file);
console.log("idid",id);

      setDependencyFiles((prev) => [...prev, file]);
      setDependencyFileIds((prev) => [...prev, id]);
    }
  };

  // ---------------------------
  // WEEK DAYS
  // ---------------------------
  const toggleWeekDay = (day) => {
    setSelectedWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };





const isoDate = startDateTime ? new Date(startDateTime).toISOString() : null;


  const loadPlatforms = async () => {
    const { data } = await getAgentRequest("/api/scripts/platforms");
    setPlatformList(data);
  };

  // -------- 3 TABLE SYSTEM LIST LOADERS -------- //

  const loadWindowsSystems = async () => {
    const { data } = await getAgentRequest("/installed-systems/get-all-list");
        const formatted = data?.map((item) => ({
      id: item.systemSerialNo,
      serialNo: item.systemSerialNo,
      installedAt: item.installedAt,
      installReqAt:item.installReqAt,
    }));

    setWindowsSystems(formatted);
  };

  const loadMacSystems = async () => {
    const { data } = await getAgentRequest("/mac-installed-systems/get-all-list");
        const formatted = data?.map((item) => ({
      id: item.systemSerialNo,
      serialNo: item.systemSerialNo,
      installedAt: item.installedAt,
            installReqAt:item.installReqAt,
    }));

    setMacSystems(formatted);
  };

  const loadLinuxSystems = async () => {
    const { data } = await getAgentRequest("/installed-systems/get-all-list");
        const formatted = data?.map((item) => ({
      id: item.systemSerialNo,
      serialNo: item.systemSerialNo,
      installedAt: item.installedAt,
            installReqAt:item.installReqAt,
    }));

    setLinuxSystems(formatted);
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

const allSelectedSystems = [
  ...selectedWindowsSystems,
  ...selectedMacSystems,
  ...selectedLinuxSystems,
];

console.log("allSelectedSystems",allSelectedSystems);

  const handleSubmit = async () => {
    let repeatSeconds = 0;

    if (scheduleType === "every-sec") repeatSeconds = Number(repeatIntervalSeconds);
    if (scheduleType === "every-min") repeatSeconds = Number(repeatIntervalSeconds) * 60;
    if (scheduleType === "every-hr") repeatSeconds = Number(repeatIntervalSeconds) * 3600;

    const payload = {
      name: scriptName,
      description: scriptDescription,
      scriptType: scriptType, 
      scriptText: scriptCategory === "TEXT" ? commandText : "",

      scriptFileId: scriptCategory === "FILE" ? scriptFileId : null,

     isActive: isActive,

      dependencyFileIds: dependencyFileIds,
   targetPlatforms: selectedPlatforms,
      targetSystemSerials: allSelectedSystems,

      scheduleType: scheduleType.toUpperCase(),

      startDateTime:isoDate,
      repeatEverySeconds: repeatSeconds,

      weekDays: selectedWeekDays,
      monthDay: selectedMonthDay || 0,
    };

    console.log("FINAL PAYLOAD:", payload);

    await postAgentRequest("/api/scripts", payload);

    alert("Script created successfully!");
  };

  const formatForDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // format: YYYY-MM-DDTHH:MM
    const pad = (n) => n.toString().padStart(2, "0");
    const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return formatted;
  };

  const systems = filteredSystems();


const platformTabs = [
  { key: "windows", label: "Windows Systems", data: systems.windows,selectedSetter:selectedWindowsSystems, setter: setSelectedWindowsSystems },
  { key: "mac", label: "macOS Systems", data: systems.mac,selectedSetter:selectedMacSystems, setter: setSelectedMacSystems },
  { key: "linux", label: "Linux Systems", data: systems.linux, selectedSetter:selectedLinuxSystems,setter: setSelectedLinuxSystems },
].filter((p) => p.data.length > 0); // Only include tabs with data



// Updated Review Step
const renderReviewStep = () => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Review Script Details
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography><strong>Script Name:</strong> {scriptName}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography><strong>Script Type:</strong> {scriptType}</Typography>
      </Grid>
      {scriptCategory === "TEXT" && (
        <Grid item xs={12}>
          <Typography><strong>Command:</strong></Typography>
          <Box sx={{ p: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
            <pre style={{ margin: 0 }}>{commandText}</pre>
          </Box>
        </Grid>
      )}
      {scriptCategory === "FILE" && (
        <Grid item xs={12}>
          <Typography><strong>Script File:</strong></Typography>
          {scriptFile && <Chip label={scriptFile.name} color="primary" />}
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography><strong>Dependency Files:</strong></Typography>
        {dependencyFiles.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {dependencyFiles.map((f, i) => (
              <Chip key={i} label={f.name} color="secondary" />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No dependencies</Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography><strong>Schedule:</strong> {scheduleType}</Typography>
        {scheduleType === "REPEAT_EVERY" && <Typography>Interval: {repeatIntervalSeconds}</Typography>}
        {scheduleType === "WEEKLY" && <Typography>Week Days: {selectedWeekDays.join(", ")}</Typography>}
        {scheduleType === "MONTHLY" && <Typography>Month Day: {selectedMonthDay}</Typography>}
        <Typography>Start Date: {startDateTime}</Typography>
      </Grid>

      {/* <Grid item xs={12}>
        <Typography><strong>Target Systems:</strong></Typography>
        {selectedSystems.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {selectedSystems.map((serial) => (
              <Chip key={serial} label={serial} color="success" />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No systems selected</Typography>
        )}
      </Grid> */}
    </Grid>
  </Box>
);


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Script Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Script Name"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
              />
            </Grid>

            {/* Description */}
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

            {/* Script Type Dropdown */}
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

            {/* TEXT Category → Command box */}
            {scriptCategory === "TEXT" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Command"
                  value={commandText}
                  multiline
                  rows={3}
                  onChange={(e) => setCommandText(e.target.value)}
                />
              </Grid>
            )}

    {/* FILE Category → File uploader */}
{scriptCategory === "FILE" && (
  <Grid item xs={12}>
    <Box
      component="label"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        border: "2px dashed #1976d2",
        borderRadius: 2,
        p: 2,                    // Smaller padding
        cursor: "pointer",
        transition: "0.3s",
        backgroundColor: "rgba(25, 118, 210, 0.02)",

        "&:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.08)",
        },
      }}
    >
      <BiCloudUpload size={35} color="#1976d2" style={{ marginBottom: 6 }} />
      <Typography variant="body2">
        Upload Script File ({allowedExtensions.join(", ")})
      </Typography>

      <input type="file" hidden onChange={handleScriptFileChange} />
    </Box>

    {scriptFile && (
      <Chip
        sx={{ mt: 1 }}
        label={scriptFile.name}
        color="primary"
        variant="outlined"
      />
    )}
  </Grid>
)}


            <Grid item xs={12}>
  <FormControlLabel
    control={
      <Checkbox
        checked={isActive}
        onChange={(e) => setIsActive(e.target.checked)}
      />
    }
    label="Is Active?"
  />
</Grid>

          </Grid>
        );

      case 1:
        return (
        <Grid item xs={12}>
  <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Dependency Files
    </Typography>

    {/* Upload Area */}
   <Box
  component="label"
  sx={{
    width: "100%",             //  ✅ FULL WIDTH
    display: "block",          //  ✅ FULL WIDTH FIX
    border: "2px dashed #9c27b0",
    borderRadius: 2,
    p: 3,
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "rgba(156, 39, 176, 0.05)",
    },
  }}
>
  <BiCloudUpload size={45} color="#9c27b0" style={{ marginBottom: 8 }} />
  <Typography>Click or drag files here to upload</Typography>

  <input type="file" multiple hidden onChange={handleDependencyFilesChange} />
</Box>


    {/* Uploaded Files */}
    {dependencyFiles.length > 0 && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
          Uploaded Files:
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {dependencyFiles.map((f, i) => (
            <Chip
              key={i}
              label={f.name}
              color="secondary"
              variant="outlined"
            //   onDelete={() => handleRemoveDependency(i)}
            />
          ))}
        </Box>
      </Box>
    )}
  </Card>
</Grid>

        );

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



              {/* <FormControl fullWidth>
                <InputLabel>Schedule Type</InputLabel>
                <Select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
                  <MenuItem value="ONE_TIME">One Time</MenuItem>
                  <MenuItem value="REPEAT_EVERY">Every X Seconds</MenuItem>
                  <MenuItem value="REPEAT_EVERY">Every X Minutes</MenuItem>
                  <MenuItem value="REPEAT_EVERY">Every X Hours</MenuItem>
                          <MenuItem value="REPEAT_EVERY">Daily</MenuItem>
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                </Select>
              </FormControl> */}
    
     
            </Grid>
  <Grid item xs={12} md={6}>
{scheduleType === "REPEAT_EVERY" && (
      <FormControl fullWidth>
      <InputLabel>Repeat Type</InputLabel>
      <Select value={repeatType} onChange={(e) => setRepeatType(e.target.value)}>
        <MenuItem value="seconds">Every X Seconds</MenuItem>
        <MenuItem value="minutes">Every X Minutes</MenuItem>
        <MenuItem value="hours">Every X Hours</MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
      </Select>
    </FormControl>
)}
</Grid>

            <Grid item xs={12} md={6}>
              <TextField
        fullWidth
        type="datetime-local"
        label="Start Date-Time"
        InputLabelProps={{ shrink: true }}
        value={formatForDateTimeLocal(startDateTime)}
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


            {/* Weekly */}
            {scheduleType === "WEEKLY" && (
              <Grid item xs={12}>
                <Typography>Week Days:</Typography>
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

            {/* Monthly (ONLY ONE ALLOWED) */}
            {scheduleType === "MONTHLY" && (
              <Grid item xs={12}>
                <Typography>Select One Date:</Typography>
                <RadioGroup
                  value={selectedMonthDay}
                  onChange={(e) => setSelectedMonthDay(Number(e.target.value))}
                  row
                >
                  {monthDays.map((day) => (
                    <FormControlLabel
                      key={day}
                      value={day}
                      control={<Radio />}
                      label={day}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            )}
          </Grid>
        );

      // case 3:
      //   return (
      //     <Box>
      //       <Typography sx={{ mb: 2 }}>Select Target Systems</Typography>

       

                  
      //     </Box>
      //   );

        case 3:
  return (
    <Box>
      <Typography sx={{ mb: 2, fontWeight: 600 }}>Select Target Platforms</Typography>

      {/* <DataTable
        columns={systemsColumns}
        data={systemsList ?? []}
        tableKey={"SystemsList"}
        checkboxSelection
        onRowSelectionModelChange={setSelectedSystems}
        rowsSelectionModel={selectedSystems}
      /> */}

     <FormControl fullWidth sx={{ mt: 4, mb: 3 }}>

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

    
    <Tabs
  value={activePlatformTab}
  onChange={(e, v) => setActivePlatformTab(v)}
>
  {platformTabs.map((p, idx) => (
    <Tab key={p.key} label={p.label} />
  ))}
</Tabs>

{platformTabs.map((p, idx) => (
  activePlatformTab === idx && (
    <DataTable
      key={p.key}
      columns={platformColumns}
      data={p.data}
      tableKey={p.key + "Table"}
      checkboxSelection
      onRowSelectionModelChange={p.setter}
      rowsSelectionModel={p.selectedSetter}
    />
  )
))}


    </Box>
  );

   case 4:
      return renderReviewStep();

        
      default:
        return null;
    }
  };
 return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: 2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
      >
        Script Runner
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: "540px",
          boxShadow: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ px: 1 }}>{renderStepContent(activeStep)}</Box>
        </CardContent>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            disabled={activeStep === 0}
            variant="outlined"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Previous
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
}