import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import { ToastTypes, showToast } from "../../utils/toast";
import Table from "../../components/Table";

import "../../css/FormInput.css";
import {
  FormControl,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { getApplicationRequest } from "../../services/applicationServiceApi";

let stopProcessId = 1;
function AgentUpdatesForm({
  getCommandConfigData,
  selectedData,
  setSelectedData,
  setModelOpen,
  isEditMode,
  isModalOpen,
}) {
  const [systemsList, setSystemsList] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [stopProcesses, setStopProcesses] = useState([]);

  const [formRows, setFormRows] = useState({
    fileName: "",
    downloadEndpoint: "",
    directoryAction: false,
    directoryName: "",
    updateCategory: "",
    targetDateTime: "",
  });

  const handleInputChange = (field, value) => {
    setFormRows({ ...formRows, [field]: value });
  };

  const handleStopProcessChange = (field, index, value) => {
    const updatedStopProcesses = [...stopProcesses];
    updatedStopProcesses[index][field] = value;
    setStopProcesses(updatedStopProcesses);
  };

  const handleDeleteStopProcess = (index) => {
    const updatedStopProcesses = stopProcesses.filter((_, i) => i !== index);
    setStopProcesses(updatedStopProcesses);
  };

  const handleAddStopProcess = () => {
    setStopProcesses([...stopProcesses, { id: stopProcessId }]);
    stopProcessId++;
  };

  const cleanStates = () => {
    setSelectedData(undefined);
    setModelOpen(false);
    setSelectedSystems([]);
    setStopProcesses([]);
    stopProcessId = 1;
    setFormRows({
      targetDateTime: "",
    });
  };

  const addCommand = async () => {
    const files = stopProcesses.map((e) => {
      return {
        updateType: e.updateType,
        fileName: e.fileName,
        serverDirectory: e.serverDirectory,
        localDirectory: e.localDirectory,
      };
    });
    const request = {
      ...formRows,
      systemSerialNumbers: selectedSystems,
      files: files,
    };

    const { data, error } = await postAgentRequest(
      "agent-update/add-update",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getCommandConfigData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  const updateCommand = async () => {
    const request = {
      ...(selectedData ? { id: selectedData.id } : ""),
    };

    const { data, error } = await postAgentRequest(
      "configuration/updateCommandConfiguration",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getCommandConfigData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  let errorMessage = "";
  const validation = () => {
    if (!formRows.targetDateTime?.trim()) {
      errorMessage = "Enter Target Date Time";
      return false;
    }

    for (const e of stopProcesses) {
      if (!e.updateType?.trim()) {
        errorMessage = "Enter update type";
        return false;
      }
      if (!e.fileName?.trim()) {
        errorMessage = "Enter file name";
        return false;
      }
      if (!e.serverDirectory?.trim()) {
        errorMessage = "Enter server directory";
        return false;
      }
      if (!e.localDirectory?.trim()) {
        errorMessage = "Enter local directory";
        return false;
      }
    }
    errorMessage = "";
    return true;
  };

  const handleSubmit = () => {
    if (validation()) {
      if (isEditMode) {
        updateCommand();
      } else {
        addCommand();
      }
    } else {
      showToast(errorMessage, ToastTypes.error);
    }
  };

  // const getSystemsList = async () => {
  //   const { data } = await getApplicationRequest("asset/getAllAsset");

  //   if (data && data.length > 0) {
  //     const transformedData = data?.map((item) => ({
  //       id: item.serialNo,
  //       serialNo: item.serialNo,
  //       employeeName: item.employeeName,
  //       emailId: item.emailId,
  //       workerAssingned: item.workerAssingned
  //     }));
  //     setSystemsList(transformedData);
  //   }
  // };

  const getSystemsList = async () => {
    const { data } = await getAgentRequest("installed-systems/get-installed-systems-list");

    if (data && data.length > 0) {
      const transformedData = data?.map((item) => ({
        id: item.systemSerialNo,
        serialNo: item.systemSerialNo,
        installedAt: item.installedAt,
      }));
      setSystemsList(transformedData);
    }
  };

  useEffect(() => {
    getSystemsList();
  }, []);

  /*   useEffect(() => {
    if (isEditMode && selectedData && selectedData.commandId) {
      setFormRows([
        {
          commandstr: selectedData.commandstr,
          schemastr: selectedData.schemastr,
          commandId: selectedData.commandId || NewCommandId,
        },
      ]);
    } else {
      setFormRows([{ commandstr: "", schemastr: "" }]);
    }
  }, [isModalOpen]); */

  const systemsColumns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "serialNo", headerName: "Serial Number", width: 200 },
    { field: "installedAt", headerName: "Installed At", width: 200 },
    { field: "employeeName", headerName: "Employee Name", width: 200 },
    { field: "emailId", headerName: "Email ID", width: 200 },
    { field: "workerAssingned", headerName: "Worker Assigned", width: 200 },
  ];

  const stopProcessColumns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    {
      field: "updateType",
      headerName: "Update Type",
      width: 150,
      renderCell: (params) => (
        <Select
          variant="standard"
          label="Update Type"
          onChange={(e) =>
            handleStopProcessChange(
              "updateType",
              params.api.getAllRowIds().indexOf(params.id),
              e.target.value
            )
          }
          style={{ width: "100%" }}
        >
          <MenuItem value="STORE">Store</MenuItem>
          <MenuItem value="WORKS">Works</MenuItem>
        </Select>
      ),
    },

    {
      field: "fileName",
      headerName: "File Name",
      width: 250,
      renderCell: (params) => (
        <Input
          placeholder="File Name (with extension)"
          value={params.row.fileName}
          onChange={(e) =>
            handleStopProcessChange(
              "fileName",
              params.api.getAllRowIds().indexOf(params.id),
              e.target.value
            )
          }
        />
      ),
    },
    {
      field: "serverDirectory",
      headerName: "Server Directory",
      width: 180,
      renderCell: (params) => (
        <Input
          placeholder="Separated by /"
          value={params.row.serverDirectory}
          onChange={(e) =>
            handleStopProcessChange(
              "serverDirectory",
              params.api.getAllRowIds().indexOf(params.id),
              e.target.value
            )
          }
        />
      ),
    },
    {
      field: "localDirectory",
      headerName: "Local Directory",
      width: 180,
      renderCell: (params) => (
        <Input
          placeholder="Directory name"
          value={params.row.localDirectory}
          onChange={(e) =>
            handleStopProcessChange(
              "localDirectory",
              params.api.getAllRowIds().indexOf(params.id),
              e.target.value
            )
          }
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            handleDeleteStopProcess(
              params.api.getAllRowIds().indexOf(params.id)
            )
          }
          style={{ padding: "0" }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <div className="UserInvForm">
        <form>
          <FormControl
            style={{ margin: "12px", padding: "0 8px", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                width: "100%",
              }}
            >
              <TextField
                labelId="update-date-time-label"
                type="datetime-local"
                variant="standard"
                label="Target Date Time"
                onChange={(e) =>
                  handleInputChange("targetDateTime", e.target.value)
                }
                value={formRows.targetDateTime}
                style={{ flex: 1, marginLeft: "8px" }}
              />
            </div>
          </FormControl>
        </form>

        <div id="inventoryTable" style={{ margin: "20px" }}>
          <h3>Files</h3>
          <Table
            showExportButton
            props={{
              addButton: (
                <GlobleBtn
                  variant="text"
                  color="primary"
                  value="Add New File"
                  style={{ border: "2px" }}
                  onClick={handleAddStopProcess}
                />
              ),
            }}
            columns={stopProcessColumns}
            data={stopProcesses ?? []}
            tableKey={"updateFiles"}
          />
        </div>

        <div id="inventoryTable" style={{ margin: "20px" }}>
          <h3>Systems List</h3>
          <Table
            columns={systemsColumns}
            data={systemsList ?? []}
            tableKey={"SystemsList"}
            checkboxSelection
            onRowSelectionModelChange={setSelectedSystems}
            rowsSelectionModel={selectedSystems}
          />
        </div>

        <div className="form-row submit-btn">
          <Stack spacing={2} direction="row">
            <GlobleBtn
              variant="text"
              color="primary"
              value="Submit"
              style={{ border: "2px" }}
              onClick={handleSubmit}
            />
            <GlobleBtn
              variant="text"
              color="error"
              value="Cancel"
              onClick={cleanStates}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default AgentUpdatesForm;
