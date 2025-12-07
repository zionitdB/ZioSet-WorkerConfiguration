import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import GlobleBtn from "../../components/GlobleBtn";
import { getAgentRequest, deleteAgentRequest, patchAgentRequest } from "../../services/agentUIServiceApi";
import { useNavigate } from "react-router";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";

const AgentListScreen = () => {
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch agent list
  const getAgents = async () => {
    setLoading(true);
    try {
      const { data } = await getAgentRequest("/api/scripts");
      setAgentList(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enable agent
  const enableAgent = async (id) => {
    try {
      await patchAgentRequest(`/api/scripts/${id}/enable`);
      getAgents();
    } catch (error) {
      console.error("Error enabling agent:", error);
    }
  };

  // Disable agent
  const disableAgent = async (id) => {
    try {
      await patchAgentRequest(`/api/scripts/${id}/disable`);
      getAgents();
    } catch (error) {
      console.error("Error disabling agent:", error);
    }
  };

  // Delete agent
  const deleteAgent = async (id) => {
    try {
      await deleteAgentRequest(`/api/scripts/${id}`);
      getAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  const columns = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "description", headerName: "Description", width: 350 },
    { field: "scriptType", headerName: "Script Type", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            onClick={() => enableAgent(params.row.id)}
          >
            Enable
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => disableAgent(params.row.id)}
          >
            Disable
          </Button>
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteAgent(params.row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="text">Agent List</div>

      {/* <div style={{ marginBottom: "15px" }}>
        <GlobleBtn
          variant="contained"
          color="primary"
          value="Add Agent"
          onClick={() => navigate("/app/scriptRunner")}
        />
      </div> */}

      <div className="table-body">
        <Table
          columns={columns}
          data={agentList ?? []}
           props={{
                           
                            loading: loading,
                            addButton: (
                              <GlobleBtn
                               onClick={() => navigate("/app/scriptRunner")}
                                variant="text"
                                color="error"
                                      value="Add Script"
                                starIcon={<PostAddIcon />}
                              />
                            ),
                          }}
          tableKey={"AgentListTable"}
          showExportButton={true}
        />
      </div>
    </div>
  );
};

export default AgentListScreen;
