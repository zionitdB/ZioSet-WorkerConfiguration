import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import FormInput from "../../components/FormInput";
import GlobleBtn from "../../components/GlobleBtn";
import { getAgentRequest } from "../../services/agentUIServiceApi";
import { Pagination, useTheme } from "@mui/material";

const ExecutionResultScreen = () => {
  const [installedSystemList, setInstalledSystemList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
    const [srNumber, setSrNumber] = useState("");
  const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const dataList = installedSystemList?.content||[];
const dataCount = installedSystemList?.totalElements||0;
const totalPages =  installedSystemList?.totalPages||1;

const getInstalledSystemsList = async () => {
  setLoading(true);

  try {
    const params = new URLSearchParams();

    if (srNumber) params.append("serialNumber", srNumber);
    if (startDate) params.append("finishedAfter", `${startDate}:47.508Z`);
    if (endDate) params.append("finishedBefore", `${endDate}:47.508Z`);
    params.append("page", currentPage);
    params.append("size", pageSize);

    const { data } = await getAgentRequest(
      `api/execution-results?${params.toString()}`
    );

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
      // const url = `installed-systems/get-installed-systems-by-date-range?startDate=${startDate}&endDate=${endDate}`;
           const url = `api/execution-results?serialNumber=${srNumber}&finishedAfter=${startDate}:47.508Z&finishedBefore=${endDate}:47.508Z&page=${currentPage}&size=${pageSize}`;
     
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
  },[currentPage, pageSize]);

const columns = [
  {
    field: "SrNo",
    headerName: "SrNo",
    hideable: false,
    width: 80,
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
  },
  { field: "scriptName", headerName: "Script Name", width: 200 },
  { field: "scriptRunId", headerName: "Script Run ID", width: 180 },
  { field: "executionStartDateTime", headerName: "Execution Start", width: 200 },
  { field: "executionFinishDateTime", headerName: "Finish Date & Time", width: 200 },
  { field: "resultCode", headerName: "Result Code", width: 150 },
  { field: "successOutput", headerName: "Success Output", width: 250 },
  { field: "errorOutput", headerName: "Error Output", width: 250 },
];

  const theme = useTheme();


    const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when the page size changes
    // await getCommandConfigCount(); // Fetch data with the new page size
  };


  return (
    <div className="container">
      <div className="text">Execution Result</div>
      
      {/* Date Filter Section */}
      <div  style={{ 
        marginTop: "13px", 
        marginBottom: "13px", 
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap",
         backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
      }}>
        <div >
  <FormInput
    label="Serial Number"
    type="text"
    value={srNumber}
    onChange={(e) => setSrNumber(e.target.value)}
    style={{ width: "500px" }}
    // placeholder="Enter Serial Number"
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
  <FormInput
    label="Finished After"
    type="datetime-local"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    style={{ width: "250px" }}
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
  <FormInput
    label="Finished Before"
    type="datetime-local"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    style={{ width: "250px" }}
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
              data={dataList ?? []}
              tableKey={"InstalledSystems"}
              showExportButton={true}
                showPageButton2={true}
                     showPageFooter={true}
              props={{
                loading: loading
              }}
                  pageSize={pageSize}
                handlePageSizeChange={handlePageSizeChange}
                       tablePerPage={100}
            />
          </div>

           <div className="pagination-box">
                          <Pagination
                            count={totalPages}
                            color="primary"
                            page={currentPage}
                            onChange={handlePageChange}
                          />
                          {/* {renderPagination()} */}
                        </div>
      </div>
    </div>
  );
};

export default ExecutionResultScreen;


