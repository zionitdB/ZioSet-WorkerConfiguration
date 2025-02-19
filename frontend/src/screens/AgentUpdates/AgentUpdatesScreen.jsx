import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import {
  Autocomplete,
  TextField,
  Button,
  Tooltip,
  Stack,
  IconButton,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";

import Model from "../../components/Model";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { showToast, ToastTypes } from "../../utils/toast";
import GlobleBtn from "../../components/GlobleBtn";
import AgentUpdatesForm from "./AgentUpdatesForm";
import { Link } from "react-router-dom";

const AgentUpdatesScreen = () => {
  const [open, setOpen] = useState(false);
  const [fileModalOpen, setFilesModalOpen] = useState(false);
  const [selectedAgentUpdate, setSelectedAgentUpdate] = useState();
  const [agentUpdatesList, setAgentUpdatesList] = useState([]);
  const [updateFiles, setUpdateFiles] = useState([]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setSelectedAgentUpdate(null);
    setOpen(false);
  };

  const getCommandConfigData = async () => {
    const { data } = await getAgentRequest(`agent-update/get-all-updates`);
    console.log(data);
    setAgentUpdatesList(data);
  };

 /*  const handleEditClick = (command) => {
    setSelectedAgentUpdate(command);
    setOpen(true); // Open the form modal
  }; */

  const deleteCommand = async (selectedId) => {
    let url = `agent-update/delete-update/${selectedId}`;
    const { data } = await getAgentRequest(url);

    if (data) {
      showToast(data.message, ToastTypes.success);
      getCommandConfigData();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  useEffect(() => {
    getCommandConfigData();
  }, []);

  const columns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "uuid", headerName: "UUID", width: 200 },
    { field: "targetDateTime", headerName: "Target Date Time", width: 200 },
    {
      field: "files",
      headerName: "Files",
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={()=>{
          setUpdateFiles(params.row.files)
          setFilesModalOpen(true);
        }}>Show files</Button>
      ),
    },
    {
      field: "targetSystems",
      headerName: "Target Systems",
      width: 200,
      renderCell: (params) => (
        <Link to={`/app/targetSystems?uuid=${params.row.uuid}`}>
          {params.row.targetSystemsCount} Systems
        </Link>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 230,
      hideable: false,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={0}>
            {/* <Tooltip title="Edit">
              <IconButton>
                <ModeEditIcon
                  onClick={() => {
                    handleEditClick(params.row);
                  }}
                />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  onClick={() => {
                    deleteCommand(params.row.id);
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ),
    },
  ];

  const filesColumns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "updateTypeLabel", headerName: "Type", width: 200 },
    { field: "fileName", headerName: "File Name", width: 200 },
    { field: "serverDirectory", headerName: "Server Directory", width: 200 },
    { field: "localDirectory", headerName: "Local Directory", width: 200 },
  ];

  return (
    <div className="container">
      <div className="text">Agent Updates</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          contentTitle={
            selectedAgentUpdate ? "Update Agent Update" : "Add New Agent Update"
          }
          contentDescription={
            <AgentUpdatesForm
              getCommandConfigData={getCommandConfigData}
              selectedData={selectedAgentUpdate}
              setSelectedData={setSelectedAgentUpdate}
              setModelOpen={setOpen}
              isEditMode={!!selectedAgentUpdate}
              isModalOpen={open}
            />
          }
        />
        <Model
          open={fileModalOpen}
          handleClose={() => {
            setUpdateFiles([]);
            setFilesModalOpen(false);
          }}
          contentTitle="Files to update"
          contentDescription={
            <div id="inventoryTable">
              <Table
                columns={filesColumns}
                data={updateFiles ?? []}
                tableKey={"UpdatesFiles"}
                showExportButton={false}
              />
            </div>
          }
        />
        <div id="inventoryTable">
          <Table
            columns={columns}
            data={agentUpdatesList ?? []}
            tableKey={"AgentUpdates"}
            showExportButton={true}
            props={{
              addButton: (
                <GlobleBtn
                  onClick={handleOpen}
                  variant="text"
                  color="error"
                  value="Add New Update"
                  starIcon={<PostAddIcon />}
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentUpdatesScreen;
