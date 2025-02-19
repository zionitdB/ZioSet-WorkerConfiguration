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
import GroupCommandForm from "./GroupCommandForm";

const GroupCommandScreen = () => {
  const [open, setOpen] = useState(false);
  const [actionsList, setActionsList] = useState([]);
  const [selectedAction, setSelectedAction] = useState();
  const [commandIdList, setCommandIdList] = useState([]);
  const [selectedCommandId, setSelectedCommandId] = useState();
  const [commandConfigList, setCommandConfigList] = useState([]);
  const [selectedCommandConfig, setSelectedCommandConfig] = useState();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setSelectedCommandConfig(null);
    setOpen(false)
  };

  const actionDropdownConfig = {
    options: actionsList,
    getOptionLabel: (option) => option?.actionName,
  };

  const getActions = async () => {
    const { data } = await getAgentRequest("configuration/getAllActions");
    setActionsList(data);
  };

  const getCommandIdList = async (actionId) => {
    setSelectedCommandId(null);
    const { data } = await getAgentRequest(
      `configuration/getCommandIdListByAction?actionId=${actionId}`
    );
    console.log(data);
    setCommandIdList(data);
  };

  const getCommandConfigData = async () => {
    if (!selectedCommandId) {
      showToast("Please select Command Group Id", ToastTypes.error);
    }
    const { data } = await getAgentRequest(
      `configuration/getCommandsByCommandId?commandId=${selectedCommandId}`
    );
    console.log(data);
    setCommandConfigList(data);
  };

  const handleEditClick = (command) => {
    setSelectedCommandConfig(command);
    setIsEditMode(true); // Set edit mode to true
    setOpen(true); // Open the form modal
  };

  const deleteCommand = async (selectedData) => {
    let url = "configuration/delteCommandConfiguration";
    const { data } = await postAgentRequest(url, selectedData);

    if (data) {
      showToast(data.message, ToastTypes.success);
      getCommandConfigData();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  useEffect(() => {
    getActions();
  }, []);

  const columns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "commandstr", headerName: "Command String", width: 300 },
    { field: "schemastr", headerName: " Schema String", width: 500 },
    {
      field: "action",
      headerName: "Action",
      width: 230,
      hideable: false,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={0}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEditClick(params.row)}>
                <ModeEditIcon
                  onClick={() => {
                    setSelectedCommandConfig(params.row);
                    setOpen(true);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  onClick={() => {
                    deleteCommand(params.row);
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="text">Command Configuration</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          contentTitle={
            selectedCommandConfig
              ? "Update Command Configuration "
              : "Add Command Configuration "
          }
           contentDescription={
            <GroupCommandForm
              getCommandConfigData={getCommandConfigData}
              selectedData={selectedCommandConfig}
              setSelectedData={setSelectedCommandConfig}
              setModelOpen={setOpen}
              defaultProps={actionDropdownConfig}
              isEditMode={!!selectedCommandConfig}
              isModalOpen={open}
              selectedAction={selectedAction}
              selectedCommandId={selectedCommandId}
            />
          }
        />
        <div id="inventoryTable">
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              color: "var(--text-color)",
            }}
          >
            <Autocomplete
              style={{
                width: "300px",
                margin: "0px 0px 15px 10px",
                color: "var(--grey-color)",
              }}
              {...actionDropdownConfig}
              id="auto-highlight"
              onChange={(event, newValue) => {
                setSelectedAction(newValue);
                getCommandIdList(newValue?.id);
              }}
              autoHighlight
              renderInput={(params) => (
                <TextField
                  style={{ color: "var(--grey-color)" }}
                  {...params}
                  variant="standard"
                  label="Select Action"
                />
              )}
            />
            <Autocomplete
              style={{
                width: "300px",
                margin: "0px 0px 15px 10px",
                color: "var(--grey-color)",
              }}
              options={commandIdList}
              id="auto-highlight"
              onChange={(event, newValue) => {
                setSelectedCommandId(newValue);
              }}
              autoHighlight
              renderInput={(params) => (
                <TextField
                  style={{ color: "var(--grey-color)" }}
                  {...params}
                  variant="standard"
                  label="Select Command Group Id"
                />
              )}
            />
            <Button variant="contained" onClick={getCommandConfigData}>
              Get Command Details
            </Button>
          </div>
          {commandConfigList && commandConfigList.length > 0 ? (
            <Table
              columns={columns}
              data={commandConfigList ?? []}
              tableKey={"GroupWiseCommands"}
              showExportButton={true}
              props={{
                addButton: (
                  <GlobleBtn
                    onClick={handleOpen}
                    variant="text"
                    color="error"
                    value="Add Command in Group"
                    starIcon={<PostAddIcon />}
                  />
                ),
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupCommandScreen;
