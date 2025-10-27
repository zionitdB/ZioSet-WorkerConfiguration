import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { getAgentRequest } from "../../services/agentUIServiceApi";
import { Button } from "@mui/material";

const UnRegisteredAssetsScreen = () => {
  const [assetsList, setAssetsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInstalledSystemsList = async () => {
    setLoading(true);
    try {
      const { data } = await getAgentRequest("unregistered-assets/get-all-list");
      setAssetsList(data);
    } catch (error) {
      console.error("Error fetching installed systems:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (serialNumber) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) {
      return;
    }
    let url = `unregistered-assets/delete-by-system-serial-number?serialNumber=${serialNumber}`;
    const { error } = await getAgentRequest(url);

    if (!error) {
      showToast(data.message, ToastTypes.success);
      getInstalledSystemsList();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  useEffect(() => {
    getInstalledSystemsList();
  }, []);

  const columns = [
    {
      field: "SrNo",
      headerName: "SrNo",
      hideable: false,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    { field: "systemSerialNumber", headerName: "Serial Number", width: 200 },
    { field: "computerName", headerName: "Computer Name", width: 200 },
    { field: "operatingSystem", headerName: "OS", width: 200 },
    { field: "addedDateTime", headerName: "Added At", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => deleteAsset(params.row.systemSerialNumber)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="text">Unregistred Assets</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

          <div id="inventoryTable">
            <Table
              columns={columns}
              data={assetsList ?? []}
              tableKey={"InstalledSystems"}
              showExportButton={true}
              props={{
                loading: loading
              }}
            />
          </div>
      </div>
    </div>
  );
};

export default UnRegisteredAssetsScreen;
