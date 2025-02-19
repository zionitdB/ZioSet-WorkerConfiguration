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
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";
import { ToastTypes, showToast } from "../../utils/toast";
import ConfigurationForm from "./ConfigurationForm";
import { Autocomplete, TextField, Button } from "@mui/material";

function CommandConfig() {
  const [commandData, setCommandData] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedCommand, setSelectedCommand] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [actionDropdown, setActionDropdown] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
 

  const getCommandConfigCount = async () => {
    let url = "configuration/getCommandConfigurationCount";
    const { data } = await getAgentRequest(url);
    const pages = Math.ceil(data / pageSize);
    setTotalPages(pages);
  };

  const getCommandConfigData = async () => {
    let url = `configuration/getCommandConfigurationByLimit?pageNo=${currentPage}&perPage=${pageSize}`;
    const response = await getAgentRequest(url);

    if (response.status === 200) {
      const extractedData = response?.data?.map((item, index) => {
        return {
          ...item,
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "action.category.categoryname": item.action?.category?.categoryname,
          "action.subCategory.categoryname":
            item.action?.subCategory?.categoryname,
          commandstr: item.commandstr,
          commandId: item.commandId,
          schemastr: item.schemastr,
        };
      });

      setCommandData(extractedData);
    } else {
      showToast("Something went wrong", ToastTypes.error);
    }
  };

  const getCommandConfigDataByAction = async (actionId) => {
    if (!actionId) {
      setFilterData([]);
      return;
    }
    let url = `configuration/getAllCommandConfigurationByActionId?actionId=${actionId}`;
    const response = await getAgentRequest(url);

    if (response.status === 200) {
      const extractedData = response.data?.map((item, index) => {
        return {
          ...item,
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "action.category.categoryname": item.action?.category?.categoryname,
          "action.subCategory.categoryname":
            item.action?.subCategory?.categoryname,
          commandstr: item.commandstr,
          schemastr: item.schemastr,
        };
      });

      setFilterData(extractedData);
    } else {
      showToast("Something went wrong", ToastTypes.error);
    }
  };

  const getAllCommandConfigData = async () => {
    let url = `configuration/getAllCommandConfigurations`;
    const { data } = await getAgentRequest(url);

    if (data) {
      const extractedData = data.map((item, index) => ({
        ...item,
        SrNo: index + 1,
        id: item.id,
        "action.category.categoryname": item.action?.category?.categoryname,
        "action.subCategory.categoryname":
          item.action?.subCategory?.categoryname,
        commandstr: item.commandstr,
        schemastr: item.schemastr,
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
      let url = "configuration/getAllCommandConfigurationByLimitAndGroupSearch";
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
          "action.category.categoryname": item.action?.category?.categoryname,
          "action.subCategory.categoryname":
            item.action?.subCategory?.categoryname,
          commandstr: item.commandstr,
          schemastr: item.schemastr,
        }));
        //
        setCommandData(extractedData);
      }
    } else {
      getCommandConfigData();
    }
  };
  const getFilterCommandConfigCount = async (e) => {
    let url =
      "configuration/getCountAllCommandConfigurationByLimitAndGroupSearch";
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
    getCommandConfigCount();
  }, []);

  useEffect(() => {
    getCommandConfigData();
    getCommandConfigCount();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when the page size changes
    // await getCommandConfigCount(); // Fetch data with the new page size
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
      field: "action.category.categoryname",
      headerName: "Category",
      width: 200,
    },
    {
      field: "action.subCategory.categoryname",
      headerName: "Sub Category",
      width: 200,
    },
    { field: "commandId", headerName: "Command ID", width: 200 },
    { field: "commandstr", headerName: "Command String", width: 200 },
    { field: "schemastr", headerName: " Schema String", width: 200 },
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
                    setSelectedCommand(params.row);
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

  const handleEditClick = (command) => {
    setSelectedCommand(command);
    setIsEditMode(true);  // Set edit mode to true
    setOpen(true);        // Open the form modal
  };

  const deleteCommand = async (selectedData) => {
    let url = "configuration/delteCommandConfiguration";
    const { data } = await postAgentRequest(url, selectedData);

    if (data) {
      showToast(data.message, ToastTypes.success);
      getCommandConfigCount();
      getCommandConfigData();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  const defaultProps = {
    options: actionDropdown,
    getOptionLabel: (option) => option?.actionName,
  };

  const getActions = async () => {
    const { data } = await getAgentRequest("configuration/getAllActions");
    setActionDropdown(data);
  };

  useEffect(() => {
    getActions();
  }, []);

  return (
    <div className="container">
      <div className="text">Command Configuration</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          handlePrimaryButton={handlePrimaryButton}
          handleSecondaryButton={handleSecondaryButton}
          contentTitle={
            selectedCommand
              ? "Update Command Configuration "
              : "Add Command Configuration "
          }
          contentDescription={
            <ConfigurationForm
              getCommandConfigData={getCommandConfigData}
              selectedData={selectedCommand}
              setSelectedData={setSelectedCommand}
              setModelOpen={setOpen}
              defaultProps={defaultProps}
              isEditMode={!!selectedCommand}
              isModalOpen={open}
            />
          }
        />
        <div id="inventoryTable">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--text-color)",
            }}
          >
            <h4 style={{ color: "var(--grey-color)" }}>Filter By Action : </h4>
            <Autocomplete
              style={{
                width: "200px",
                margin: "0px 0px 15px 10px",
                color: "var(--grey-color)",
              }}
              {...defaultProps}
              id="auto-highlight"
              onChange={(event, newValue) => {
                getCommandConfigDataByAction(newValue?.id);
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
          </div>
          {filterData.length === 0 ? (
            <>
              <Table
                columns={columns}
                data={commandData}
                allData={getAllCommandConfigData}
                tableKey={"CommandConfig Table"}
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
                    getFilterCommandConfigCount(e);
                  },
                  loading: filterLoading,
                  addButton: (
                    <GlobleBtn
                      onClick={handleOpen}
                      variant="text"
                      color="error"
                      value="Add Command"
                      starIcon={<PostAddIcon />}
                    />
                  ),
                }}
                tablePerPage={100}
              />
              <div className="pagination-box">
                <Pagination
                  count={totalPages}
                  color="primary"
                  page={currentPage}
                  onChange={handlePageChange}
                />
                {/* {renderPagination()} */}
              </div>
            </>
          ) : (
            <Table
              columns={columns}
              data={filterData}
              tableKey={"CommandConfig2 Table"}
              showExportButton={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandConfig;
