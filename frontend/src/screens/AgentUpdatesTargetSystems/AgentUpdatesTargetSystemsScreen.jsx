import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { Tooltip, Stack, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAgentRequest } from "../../services/agentUIServiceApi";
import { showToast, ToastTypes } from "../../utils/toast";

const AgentUpdatesTargetSystemsScreen = () => {
  const [agentUpdatesList, setAgentUpdatesList] = useState([]);
  const [updateUuid, setUpdateUuid] = useState(null);

  const getCommandConfigData = async (uuid) => {
    const { data } = await getAgentRequest(`agent-update/get-systems/${uuid}`);
    setAgentUpdatesList(data);
  };

  const deleteCommand = async (selectedId) => {
    let url = `agent-update/delete-target-system-by-id/${selectedId}`;
    const { data } = await getAgentRequest(url);

    if (data) {
      showToast(data.message, ToastTypes.success);
      getCommandConfigData(updateUuid);
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      setUpdateUuid(uuid);
      getCommandConfigData(uuid);
    }
  }, []);

  const columns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "systemSerialNumber", headerName: "Serial Number", width: 200 },
    { field: "isUpdated", headerName: "Updated", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 230,
      hideable: false,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={0}>
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

  return (
    <div className="container">
      <div className="text">Agent Updates Target Systems</div>
      <h4 style={{textAlign: 'center'}}>Update UUID: {updateUuid}</h4>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <div id="inventoryTable">
          <Table
            columns={columns}
            data={agentUpdatesList ?? []}
            tableKey={"AgentUpdatesTargetSystems"}
            showExportButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentUpdatesTargetSystemsScreen;
