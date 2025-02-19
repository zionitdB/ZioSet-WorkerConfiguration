import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { getAgentRequest } from "../../services/agentUIServiceApi";

const InstalledSystemsScreen = () => {
  const [installedSystemList, setInstalledSystemList] = useState([]);

  const getInstalledSystemsList = async () => {
    const { data } = await getAgentRequest("installed-systems/get-all-list");
    setInstalledSystemList(data);
  };

  // const deleteSystem = async (serialNumber) => {
  //   let url = `installed-systems/delete-by-system-serial-number?serialNumber=${serialNumber}`;
  //   const { data } = await getAgentRequest(url);

  //   if (data && data.code == 200) {
  //     showToast(data.message, ToastTypes.success);
  //     getInstalledSystemsList();
  //   } else {
  //     showToast(data.message, ToastTypes.error);
  //   }
  // };

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

    { field: "systemSerialNo", headerName: "Serial Number", width: 200 },
    { field: "installed", headerName: "Is Installed", width: 200 },
    { field: "installReqAt", headerName: "Install Req. At", width: 200 },
    { field: "installedAt", headerName: "Installed At", width: 200 },
    { field: "installationResponse", headerName: "Response", width: 200 },
  ];

  return (
    <div className="container">
      <div className="text">Installed Systems - Windows OS</div>
      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <div id="inventoryTable">
          <Table
            columns={columns}
            data={installedSystemList ?? []}
            tableKey={"InstalledSystems"}
            showExportButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default InstalledSystemsScreen;
