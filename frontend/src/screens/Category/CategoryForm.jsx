import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import { ToastTypes, showToast } from "../../utils/toast";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { FormControl } from "@mui/material";
import {  postAgentRequest } from "../../services/agentUIServiceApi";

function CategoryForm({
  getCategoryData,
  selectedData,
  setSelectedData,
  setModelOpen,
  isEdit,
  categoriesDropdown
}) {

    const [category , setCategory] = useState("none");
    const [subCategory , setSubCategory] = useState("");
    const [isSubCategory , setIsSubCategory] = useState(false);
    // const [categoriesDropdown , setCategoriesDropdown] = useState([]);

  const cleanStates = () => {
    setCategory("none")
    setSelectedData(undefined);
    setModelOpen(false);
  };

  const addCategory = async () => {
    const request = {
      ...(selectedData ? { id: selectedData.id } : {}),
      ...(category !== "none" ?{parrentCategory: {id:category}} : null),
      categoryname:subCategory,

    };
    
    const { data, error } = await postAgentRequest("configuration/addNewCategory", request);
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getCategoryData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

 

  let errorMessage =''
  const validation = () => {
      
    if (subCategory === "") {
      errorMessage=`${isSubCategory ? "Enter Sub Category Name" : "Enter  New Category Name"}`
      return false
    }
    errorMessage = ''
    return true;
  };


  useEffect(() => {
    if (selectedData) {
      setCategory(selectedData.parrentCategory?.id || "none")
      setSubCategory(selectedData.categoryname)
    } else {
      setCategory("none")
      setSubCategory("")
    }
  }, [selectedData]);

  const handleSubmit = () => {
    if (validation()) {
      addCategory();
    } else {
      showToast(errorMessage , ToastTypes.error);
    }
  
  };

  const handleCategoryChange =(e)=>{
    
    setCategory(e.target.value)
  }
  const handleSubCategoryChange =(e)=>{    
    setSubCategory(e.target.value)
  }

  useEffect(()=>{
    setIsSubCategory(category !== "none" ? true : false);
  },[category])
 


  useEffect(() => {
    setIsSubCategory(category !== "none");
  }, [category]);

  return (
    <div>
      <form action="">
        <div className="UserInvForm">
          <div className="form-row">
          <FormControl style={{flexBasis:"50%",margin:"18px", cursor: isEdit ? "not-allowed" : "pointer", }}>
            <Select variant="standard" label="Hello"  value={category} onChange={handleCategoryChange} disabled={isEdit}
            style={{
               // Set cursor based on isEdit
            }}
            >
                <MenuItem value="none"  disabled>Select Category</MenuItem>
                {categoriesDropdown?.map((category) =>{
                    return <MenuItem key={category.id} value={category.id}>{category.categoryname}</MenuItem>
                })}
            </Select>
            </FormControl>
            <FormControl style={{flexBasis:"50%",margin:"3px"}}>
            <TextField
                variant="standard"
                label={isSubCategory ? "Sub Category" : "New Category"}
                value={subCategory}
                onChange={(e)=>{
                   setSubCategory(e.target.value)
                }}
            />
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
                  setSelectedData(undefined);
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


export default CategoryForm;