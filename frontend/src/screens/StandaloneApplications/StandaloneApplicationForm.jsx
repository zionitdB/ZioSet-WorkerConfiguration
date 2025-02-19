import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import { ToastTypes, showToast } from "../../utils/toast";

import TextField from "@mui/material/TextField";
import { FormControl, Input } from "@mui/material";
import {
  getAgentRequest,
  postAgentRequest,
} from "../../services/agentUIServiceApi";

function StandaloneApplicationForm({
  getStandaloneApplicationList,
  selectedId,
  setSelectedId,
  setModelOpen,
}) {

  const handleInputChange = async (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [formData, setFormData] = useState({
    standaloneApplicationName: "",
  });

  const cleanStates = () => {
    setSelectedId(undefined);

    setFormData({
      standaloneApplicationName: "",
    });

    setModelOpen(false);
  };

  const addApplication = async () => {
    const request = {
      ...(selectedId ? { id: selectedId.id } : {}),
      standaloneApplicationName: formData.standaloneApplicationName,
    };

    const { data, error } = await postAgentRequest(
      "standaloneApplicationController/addNewStandaloneApplication",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getStandaloneApplicationList();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  let errorMessage = "";
  const validation = () => {
    if (formData.standaloneApplicationName === "" || formData.standaloneApplicationName?.trim() === "") {
      errorMessage = "Enter application Name";
      return false;
    }

    errorMessage = "";
    return true;
  };

  useEffect(() => {
    if (selectedId) {
      setFormData({
        standaloneApplicationName: selectedId.standaloneApplicationName,
      });
    } else {
      setFormData({
        standaloneApplicationName: "",
      });
    }
  }, [selectedId]);

  const handleSubmit = () => {
    if (validation()) {
      addApplication();
    } else {
      showToast(errorMessage, ToastTypes.error);
    }
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
                label="Application Name"
                value={formData.standaloneApplicationName}
                onChange={(e) => {
                  handleInputChange("standaloneApplicationName", e.target.value);
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

export default StandaloneApplicationForm;
