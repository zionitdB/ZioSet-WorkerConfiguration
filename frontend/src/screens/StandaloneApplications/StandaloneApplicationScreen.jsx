import React, { useState, useEffect, useContext, useRef } from "react";
import Table from "../../components/Table";
import Pagination from "@mui/material/Pagination";
import "../../css/UserInventoryDetails.css";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Model from "../../components/Model";
import PostAddIcon from "@mui/icons-material/PostAdd";
import StandaloneApplicationForm from "./StandaloneApplicationForm";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { ToastTypes, showToast } from "../../utils/toast";
import Button from "@mui/material/Button";
import RefreshIcon from '@mui/icons-material/Refresh';

function StandaloneApplicationScreen() {
  const [applicationList, setApplicationList] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageSize, setPageSize] = useState(10);

  const getAllApplicationCount = async () => {
    let url = "standaloneApplicationController/getStandaloneApplicationCount";
    const { data } = await getAgentRequest(url);
    const pages = Math.ceil(data / pageSize);
    setTotalPages(pages);
  };

  const getApplicationByLimit = async () => {
    let url = `standaloneApplicationController/getStandaloneApplicationByLimit?pageNo=${currentPage}&perPage=${pageSize}`;
    const response = await getAgentRequest(url);

    if (response.status === 200) {
      const data = response?.data;

      if (Array.isArray(data)) {
        // If data is an array, process it
        const extractedData = data.map((item, index) => ({
          ...item,
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "category.categoryname": item.category?.categoryname,
          "subCategory.categoryname": item.subCategory?.categoryname,
          category: item.category,
          subCategory: item.subCategory,
        }));

        setApplicationList(extractedData);
      } else {
        // If data is not an array, handle it accordingly
        showToast("Unexpected data format received", ToastTypes.error);
      }
    } else {
      showToast("Something went wrong", ToastTypes.error);
    }
  };

  const getAllStandaloneApplications = async () => {
    let url = `standaloneApplicationController/getAllStandaloneApplications`;
    const { data } = await getAgentRequest(url);

    if (data) {
      const extractedData = data.map((item, index) => ({
        ...item,
        SrNo: index + 1,
        id: item.id,
        "category.categoryname": item.category?.categoryname,
        "subCategory.categoryname": item.subCategory?.categoryname,
        category: item.category,
        subCategory: item.subCategory,
      }));
      return extractedData;
    } else return [];
  };

  const onFilterModelChange = async (e) => {
    //
    if (
      e.items.length > 0 &&
      "value" in e.items[0] &&
      e.items[0].value !== ""
    ) {
      let url =
        "standaloneApplicationController/getAllStandaloneApplicationByLimitAndGroupSearch";
      const request = {
        columns: [
          {
            columnName: e.items[0].field,
            value: e.items[0].value,
          },
        ],
        pageNo: currentPage,
        perPage: pageSize,
      };
      const { data } = await postAgentRequest(url, request);
      //
      if (data) {
        const extractedData = data.map((item, index) => ({
          ...item,
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "category.categoryname": item.category?.categoryname,
          "subCategory.categoryname": item.subCategory?.categoryname,
          category: item.category,
          subCategory: item.subCategory,
        }));
        //
        setApplicationList(extractedData);
      }
    } else {
      getApplicationByLimit();
    }
  };
  const getFilterApplicationCount = async (e) => {
    let url =
      "standaloneApplicationController/getCountAllStandaloneApplicationByLimitAndGroupSearch";
    const request = {
      columns: [
        {
          columnName: e.items[0].field,
          value: e.items[0].value,
        },
      ],
      pageNo: currentPage,
      perPage: pageSize,
    };
    const { data } = await postAgentRequest(url, request);
    //
    setTotalPages(Math.ceil(data / pageSize));
  };
  useEffect(() => {
    getAllApplicationCount();
  }, []);

  useEffect(() => {
    getApplicationByLimit();
    getAllApplicationCount();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when the page size changes
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrimaryButton = () => {
    handleClose();
  };

  const handleSecondaryButton = () => {
    handleClose();
  };

  const changeStatus = async (application) => {
    let url = "standaloneApplicationController/updatedStatus";
    const { data } = await postAgentRequest(url, application);

    if (data.code === 200) {
      showToast(data.message, ToastTypes.success);
      getAllApplicationCount();
      getApplicationByLimit();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };
  
  const columns = [
    { field: "SrNo", headerName: "SrNo", hideable: false },
    {
      field: "standaloneApplicationName",
      headerName: "Application Name",
      width: 200,
    },

    {
      field: "addedDate",
      width: 200,
      renderCell: (params) =>
        params.row.addedDate
          ? new Date(params.row.addedDate).toLocaleDateString()
          : "",
    },

    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        params.row.active == 1 ? (
          <Button onClick={()=> changeStatus(params.row)} variant="outlined" color="success" startIcon={<RefreshIcon/>}>
            Active
          </Button>
        ) : (
          <Button onClick={()=> changeStatus(params.row)} variant="outlined" color="error" startIcon={<RefreshIcon/>}>
            Inactive
          </Button>
        )
      ),
    },

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
                    deleteStandaloneApp(params.row);
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ),
    },
  ];

  const deleteStandaloneApp = async (selectedData) => {
    let url = "standaloneApplicationController/deleteStandaloneApplication";
    const { data } = await postAgentRequest(url, selectedData);

    if (data.code === 200) {
      showToast(data.message, ToastTypes.success);
      getAllApplicationCount();
      getApplicationByLimit();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  return (
    <div className="container">
      <div className="text">Standalone Applications</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          handlePrimaryButton={handlePrimaryButton}
          handleSecondaryButton={handleSecondaryButton}
          contentTitle={
            selectedApplication
              ? "Update Standalone Application"
              : "Add Standalone Application"
          }
          contentDescription={
            <StandaloneApplicationForm
              getStandaloneApplicationList={getApplicationByLimit}
              selectedId={selectedApplication}
              setSelectedId={setSelectedApplication}
              setModelOpen={setOpen}
            />
          }
        />
        <div id="inventoryTable">
          <Table
            columns={columns}
            data={applicationList}
            allData={getAllStandaloneApplications}
            tableKey={"Standalone Applications"}
            showExportButton={true}
            showPageButton2={true}
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
            showPageFooter={true}
            props={{
              filterMode: "server",
              onFilterModelChange: async (e) => {
                setCurrentPage(1);
                onFilterModelChange(e);
                getFilterApplicationCount(e);
              },
              addButton: (
                <GlobleBtn
                  onClick={handleOpen}
                  variant="text"
                  color="error"
                  value="Add standalone application"
                  starIcon={<PostAddIcon />}
                />
              ),
            }}
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
}

export default StandaloneApplicationScreen;
