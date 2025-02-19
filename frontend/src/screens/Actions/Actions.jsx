import React, { useState, useEffect, useContext, useRef } from "react";
import Table from "../../components/Table";
import Pagination from "@mui/material/Pagination";
import "../../css/UserInventoryDetails.css";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Model from "../../components/Model";
import { useNavigate } from "react-router";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ActionsForm from "./ActionsForm";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { ToastTypes, showToast } from "../../utils/toast";
import Button from '@mui/material/Button';

function Actions() {
  const [actionData, setActionData] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const getActionsCount = async () => {
    let url = "configuration/getActionCount";
    const { data } = await getAgentRequest(url);
    const pages = Math.ceil(data / pageSize);
    setTotalPages(pages);
  };

  const getActionsData = async () => {
    let url = `configuration/getActionByLimit?pageNo=${currentPage}&perPage=${pageSize}`;
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
  
        setActionData(extractedData);
      } else {
        // If data is not an array, handle it accordingly
        showToast("Unexpected data format received", ToastTypes.error);
      }
    } else {
      showToast("Something went wrong", ToastTypes.error);
    }
  };
  

  const getAllActionsData = async () => {
    let url = `configuration/getAllActions`;
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
      let url = "configuration/getAllActionByLimitAndGroupSearch";
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
        setActionData(extractedData);
      }
    } else {
      getActionsData();
    }
  };
  const getFilterActionsCount = async (e) => {
    let url = "configuration/getCountAllActionByLimitAndGroupSearch";
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
    getActionsCount();
  }, []);

  useEffect(() => {
    getActionsData();
    getActionsCount();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when the page size changes
    // await getActionsCount(); // Fetch data with the new page size
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
  const columns = [
    { field: "SrNo", headerName: "SrNo", hideable: false },
    {
      field: "actionName",
      headerName: "ActionName",
      width: 200,
    },
    { field: "category.categoryname", headerName: "Category", width: 200 },
    {
      field: "subCategory.categoryname",
      headerName: "Sub Category",
      width: 200,
    },
    { field: "informationtype", headerName: "Information Type", width: 200 },
    {
      field: "informationdetail",
      headerName: " Information Details",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 230,
      hideable: false,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={0}>
            <Tooltip title="Edit">
              <IconButton>
                <ModeEditIcon
                  onClick={() => {
                    //
                    setSelectedAsset(params.row);
                    setOpen(true);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  onClick={() => {
                    deleteAction(params.row);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload">              
                <Button
                 variant="contained"
                 color="primary"
                //  startIcon={<DeleteIcon />}
                  onClick={() => {
                    
                  }}
                >   Upload
</Button>        
            </Tooltip>
          </Stack>
        </div>
      ),
    },
  ];

  const deleteAction = async (selectedData) => {
    let url = "configuration/deleteAction";
    const { data } = await postAgentRequest(url, selectedData);

    if (data.code === 200) {
      showToast(data.message, ToastTypes.success);
      getActionsCount();
      getActionsData();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  return (
    <div className="container">
      <div className="text">Actions</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          handlePrimaryButton={handlePrimaryButton}
          handleSecondaryButton={handleSecondaryButton}
          contentTitle={selectedAsset ? "Update Actions " : "Add Actions "}
          contentDescription={
            <ActionsForm
              getActionsData={getActionsData}
              selectedId={selectedAsset}
              setSelectedId={setSelectedAsset}
              setModelOpen={setOpen}
            />
          }
        />
        <div id="inventoryTable">
          <Table
            columns={columns}
            data={actionData}
            allData={getAllActionsData}
            tableKey={"Actions Table"}
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
                getFilterActionsCount(e);
              },
              loading: filterLoading,
              addButton: (
                <GlobleBtn
                  onClick={handleOpen}
                  variant="text"
                  color="error"
                  value="Add Action"
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

export default Actions;
