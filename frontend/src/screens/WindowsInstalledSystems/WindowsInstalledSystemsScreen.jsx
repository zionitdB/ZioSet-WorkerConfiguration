import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import FormInput from "../../components/FormInput";
import GlobleBtn from "../../components/GlobleBtn";
import { getAgentRequest } from "../../services/agentUIServiceApi";

const InstalledSystemsScreen = () => {
  const [installedSystemList, setInstalledSystemList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const getInstalledSystemsList = async () => {
    setLoading(true);
    try {
      const { data } = await getAgentRequest("installed-systems/get-all-list");
      setInstalledSystemList(data);
    } catch (error) {
      console.error("Error fetching installed systems:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInstalledSystemsByDateRange = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }
    
    setLoading(true);
    try {
      const url = `installed-systems/get-installed-systems-by-date-range?startDate=${startDate}&endDate=${endDate}`;
      const { data } = await getAgentRequest(url);
      setInstalledSystemList(data);
    } catch (error) {
      console.error("Error fetching filtered installed systems:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    getInstalledSystemsList();
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
      
      {/* Date Filter Section */}
      <div  style={{ 
        marginTop: "13px", 
        marginBottom: "13px", 
        backgroundColor: "#f9f9f9", 
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FormInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "200px" }}
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FormInput
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "200px" }}
          />
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <GlobleBtn
            variant="contained"
            color="primary"
            value="Filter"
            onClick={getInstalledSystemsByDateRange}
            style={{ minWidth: "100px" }}
            
          />
          
          <GlobleBtn
            variant="outlined"
            color="secondary"
            value="Reset"
            onClick={resetFilter}
            style={{ minWidth: "100px" }}
            
          />
        </div>
      </div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

          <div id="inventoryTable">
            <Table
              columns={columns}
              data={installedSystemList ?? []}
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

export default InstalledSystemsScreen;
