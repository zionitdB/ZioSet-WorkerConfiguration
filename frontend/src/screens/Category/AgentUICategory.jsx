import React, { useState, useEffect } from "react";
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
import CategoryForm from "./CategoryForm";
import PreviewIcon from "@mui/icons-material/Preview";

function AgentUICategory() {
  const [categoryData, setCategoryData] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [detailView, setDetailView] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState([]);

  const getCategoryCount = async () => {
    let url = "configuration/getCategoryCount";
    const { data } = await getAgentRequest(url);
    const pages = Math.ceil(data / pageSize);
    setTotalPages(pages);
  };

  const getCategoryData = async () => {
    let url = `configuration/getCategoryByLimit?pageNo=${currentPage}&perPage=${pageSize}`;
    const response = await getAgentRequest(url);

    if (response.status === 200) {
      const extractedData = response.data?.map((item, index) => {
        return {
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "parrentCategory.categoryname": item.parrentCategory?.categoryname,
          createdDate: item.createdDate.substring(0, 10),
          categoryname: item.categoryname,
          parrentCategory: item.parrentCategory,
        };
      });

      setCategoryData(extractedData);
    } else {
      showToast("Something went wrong", ToastTypes.error);
    }
  };

  const getAllCategoryData = async () => {
    let url = `configuration/getAllCategories`;
    const { data } = await getAgentRequest(url);

    if (data) {
      const extractedData = data.map((item, index) => ({
        SrNo: (currentPage - 1) * pageSize + index + 1,
        id: item.id,
        "parrentCategory.categoryname": item.parrentCategory?.categoryname,
        createdDate: item.createdDate.substring(0, 10),
        categoryname: item.categoryname,
        parrentCategory: item.parrentCategory,
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
      let url = "configuration/getAllCategoryByLimitAndGroupSearch";
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
          SrNo: (currentPage - 1) * pageSize + index + 1,
          id: item.id,
          "parrentCategory.categoryname": item.parrentCategory?.categoryname,
          createdDate: item.createdDate.substring(0, 10),
          categoryname: item.categoryname,
          parrentCategory: item.parrentCategory,
        }));
        //
        setCategoryData(extractedData);
      }
    } else {
      getCategoryData();
    }
  };
  const getFilterCategoryCount = async (e) => {
    let url = "configuration/getCountAllCategoryByLimitAndGroupSearch";
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
    getCategoryCount();
  }, []);

  useEffect(() => {
    getCategoryData();
    getCategoryCount();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handlePageSizeChange = (selectedOption) => {
    const newSize = selectedOption.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when the page size changes
    // await getCategoryCount(); // Fetch data with the new page size
  };

  const handleOpen = async () => {
    await refreshCategories(); // Call to fetch categories
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
    { field: "categoryname", headerName: "Category", width: 200 },
    {
      field: "parrentCategory.categoryname",
      headerName: "Parent Category",
      width: 200,
    },
    { field: "createdDate", headerName: "Created Date", width: 200 },
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
                    setSelectedCategory(params.row);
                    setOpen(true);
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon
                  onClick={() => {
                    deleteCategory(params.row);
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ),
    },
    {
      field: "details",
      headerName: "Detailed View",
      width: 230,
      hideable: false,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={0}>
            <Tooltip title="View Detail">
              <IconButton>
                <PreviewIcon onClick={() => handleDetailView(params.row)} />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      ),
    },
  ];

  const deleteCategory = async (selectedData) => {
    let url = "configuration/deleteCategory";
    const { data } = await postAgentRequest(url, selectedData);

    if (data) {
      showToast(data.message, ToastTypes.success);
      getCategoryCount();
      getCategoryData();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  const handleDetailView = (row) => {
    navigate("/app/CategoriesTreeview", {
      state: {
        row: row,
      },
    });
  };

   // New function to refresh the categories dropdown
   const refreshCategories = async () => {
    const url = "configuration/getAllCategories";
    const { data } = await getAgentRequest(url);
    setCategoriesDropdown(data || []);
  };
 

  return (
    <div className="container">
      <div className="text">Category</div>

      <div className="table-body" style={{ marginTop: "13px" }}>
        <div className="table-btn-group"></div>

        <Model
          open={open}
          handleClose={handleClose}
          handlePrimaryButton={handlePrimaryButton}
          handleSecondaryButton={handleSecondaryButton}
          contentTitle={selectedCategory ? "Update Actions " : "Add Actions "}
          contentDescription={
            <CategoryForm
              getCategoryData={getCategoryData}
              selectedData={selectedCategory}
              setSelectedData={setSelectedCategory}
              setModelOpen={setOpen}
              isEdit={!!selectedCategory} 
              categoriesDropdown={categoriesDropdown} 
            />
          }
        />
        <div id="inventoryTable">
          <Table
            columns={columns}
            data={categoryData}
            allData={getAllCategoryData}
            tableKey={"Category Table"}
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
                getFilterCategoryCount(e);
              },
              loading: filterLoading,
              addButton: (
                <GlobleBtn
                  onClick={handleOpen}
                  variant="text"
                  color="error"
                  value="Add Category"
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
      {/* <Model
        open={detailView}
        handleClose={() => {
          setSelectedCategory(null);
          setDetailView(false);
        }}
        contentDescription={<CustomTreeView row={selectedCategory} />}
      /> */}
    </div>
  );
}

export default AgentUICategory;
