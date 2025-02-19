import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import { ToastTypes, showToast } from "../../utils/toast";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { FormControl, Input } from "@mui/material";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";

function ActionsForm({
  getActionsData,
  selectedId,
  setSelectedId,
  setModelOpen,
}) {
  const [category, setCategory] = useState("none");
  const [subCategory, setSubCategory] = useState("none");
  const [categoriesDropdown, setCategoriesDropdown] = useState([]);
  const [subCategoriesDropdown, setSubCategoriesDropdown] = useState([]);

  const handleInputChange = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [formData, setFormData] = useState({
    infoType: "",
    infoDetails: "",
    actionName: "",
  });

  const handleFileChange = (e) => {
    handleInputChange('file', e.target.files[0]);
  };

  const cleanStates = () => {
    setSelectedId(undefined);

    setFormData({
      infoType: "",
      infoDetails: "",
      actionName: "",
    });
    setCategory("none");
    setSubCategory("none");
    setSubCategoriesDropdown([]);
    setModelOpen(false);
  };

  const addActions = async () => {
    const request = {
      ...(selectedId ? { id: selectedId.id } : {}),
      category: { id: category },
      ...(subCategory === "none" ? null : { subCategory: { id: subCategory } }),
      informationtype: formData.infoType,
      informationdetail: formData.infoDetails,
      actionName: formData.actionName,
    };

    const { data, error } = await postAgentRequest(
      "configuration/addNewAction",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getActionsData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  let errorMessage = "";
  const validation = () => {
    if (formData.actionName === "" || formData.actionName?.trim() === "") {
      errorMessage = "Enter Action Name";
      return false;
    }

    if (category === "none") {
      errorMessage = "Select Category";
      return false;
    }

    if (formData.actionName === "" || formData.actionName?.trim() === "") {
      errorMessage = "Enter Action Name";
      return false;
    }
    if (formData.infoType === "" || formData.infoType?.trim() === "") {
      errorMessage = "Enter Information Type";
      return false;
    }

    if (formData.infoDetails === "" || formData.infoDetails?.trim() === "") {
      errorMessage = "Enter  project name";
      return false;
    }
    errorMessage = "";
    return true;
  };

  useEffect(() => {
    if (selectedId) {
      setFormData({
        infoType: selectedId.informationtype,
        infoDetails: selectedId.informationdetail,
        actionName: selectedId.actionName,
      });
      setCategory(selectedId.category?.id || "none");
      setSubCategory(selectedId.subCategory?.id || "none");
    } else {
      setFormData({
        infoType: "",
        infoDetails: "",
        actionName: "",
      });
      setCategory("none");
      setSubCategory("none");
    }
  }, [selectedId]);

  const handleSubmit = () => {
    if (validation()) {
      addActions();
    } else {
      showToast(errorMessage, ToastTypes.error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  const getCategories = async () => {
    let url = "configuration/getAllCategories";
    const { data } = await getAgentRequest(url);

    setCategoriesDropdown(data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getSubCategories();
  }, [category]);

  const getSubCategories = async () => {
    if (category === "none") return;
    let url = `configuration/getAllCategoryByParentId?parentCategoryId=${category}`;
    const { data } = await getAgentRequest(url);

    setSubCategoriesDropdown(data);
  };

  return (
    <div>
      <form action="">
        <div className="UserInvForm">
          <div className="form-row">
            <FormControl
              style={{ flexBasis: "100%", margin: "12px", padding: "0 10px" }}
            >
              <TextField
                variant="standard"
                multiline
                label="Action Name"
                value={formData.actionName}
                onChange={(e) => {
                  handleInputChange("actionName", e.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className="form-row">
            <FormControl style={{ flexBasis: "50%", margin: "18px" }}>
              <Select
                variant="standard"
                value={category}
                onChange={handleCategoryChange}
              >
                <MenuItem value="none" disabled>
                  Select Category
                </MenuItem>
                {categoriesDropdown?.map((category) => {
                  return (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryname}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl style={{ flexBasis: "50%", margin: "18px" }}>
              <Select
                require
                variant="standard"
                label="subCategory"
                value={subCategory}
                onChange={handleSubCategoryChange}
              >
                <MenuItem value="none" disabled>
                  Select Sub Category
                </MenuItem>
                {subCategoriesDropdown?.map((category) => {
                  return (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryname}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="form-row">
            <FormControl
              style={{ flexBasis: "50%", margin: "12px", padding: "0 8px" }}
            >
              <TextField
                variant="standard"
                label="Information Type"
                onChange={(e) => {
                  handleInputChange("infoType", e.target.value);
                }}
                value={formData.infoType}
              />
            </FormControl>
            <FormControl style={{ flexBasis: "50%", margin: "12px", padding: "0 10px" }}>
      {/* Text input for information details */}
      <TextField
        variant="standard"
        multiline
        label="Information Details"
        value={formData.infoDetails}
        onChange={(e) => handleInputChange("infoDetails", e.target.value)}
      />
      {/* OR text separator */}
      <p style={{ textAlign: 'center', margin: '10px 0', fontSize: '14px', color: '#555' }}>OR</p>
      {/* File upload input */}
      <Input
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: '.pdf, .docx, .txt' }} // Adjust file types as needed
      />
      {/* Optional: Display selected file name */}
      {formData.file && <p>Selected File: {formData.file.name}</p>}
    </FormControl>
          </div>

          <div className="form-row submit-btn">
            <Stack spacing={2} direction="row">
              <GlobleBtn
                variant="text"
                color="primary"
                value="Submit"
                style={{ border: "2px" }}
                onClick={() => {
                  handleSubmit();
                }}
              />
              <GlobleBtn
                variant="text"
                color="error"
                value="Cancel"
                onClick={() => {
                  setSelectedId(undefined);
                  cleanStates();
                }}
              />
            </Stack>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ActionsForm;
