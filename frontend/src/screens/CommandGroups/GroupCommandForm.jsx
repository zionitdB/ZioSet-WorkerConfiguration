import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import GlobleBtn from "../../components/GlobleBtn";
import { ToastTypes, showToast } from "../../utils/toast";
import "../../css/FormInput.css";
import TextField from "@mui/material/TextField";
import { Autocomplete, FormControl, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { postAgentRequest } from "../../services/agentUIServiceApi";

function GroupCommandForm({
  getCommandConfigData,
  selectedData,
  setSelectedData,
  setModelOpen,
  defaultProps,
  isEditMode,
  isModalOpen,
  selectedAction,
  selectedCommandId
}) {
  const [action, setAction] = useState(null);
  const [formRows, setFormRows] = useState([{ commandstr: "", schemastr: "" }]);
  const [NewCommandId, setNewCommandId] = useState(0);

  const handleInputChange = (index, field, value) => {
    const newRows = [...formRows];
    newRows[index][field] = value;
    setFormRows(newRows);
  };

  const addNewRow = () => {
    setFormRows([...formRows, { commandstr: "", schemastr: "" }]);
  };

  const deleteRow = (index) => {
    const newRows = formRows.filter((_, i) => i !== index);
    setFormRows(newRows);
  };

  const cleanStates = () => {
    setSelectedData(undefined);
    setFormRows([{ commandstr: "", schemastr: "" }]);
    setAction(null);
    setModelOpen(false);
    setNewCommandId(null);
  };

  const addCommand = async () => {
    const newRows = formRows.map((e) => ({
      ...e,
      commandId: NewCommandId,
    }));

    const request = {
      ...(selectedData ? { id: selectedData.id } : ""),
      action: { id: action.id },
      list: newRows,
    };

    const { data, error } = await postAgentRequest(
      "configuration/addNewCommandConfiguration",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getCommandConfigData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };
  const updateCommand = async () => {
    const request = {
      ...(selectedData ? { id: selectedData.id } : ""),
      action: { id: action.id },
      list: formRows.map((row) => ({
        ...row,
        commandId: NewCommandId,
      })),
    };

    const { data, error } = await postAgentRequest(
      "configuration/updateCommandConfiguration",
      request
    );
    if (error) {
      showToast("Something went wrong", ToastTypes.error);
    }
    if (!data) return;
    if (data?.code === 200) {
      getCommandConfigData();
      showToast(data.message, ToastTypes.success);
      cleanStates();
    } else {
      showToast(data.message, ToastTypes.error);
    }
  };

  let errorMessage = "";
  const validation = () => {
    if (!action) {
      errorMessage = "Select Action";
      return false;
    }

    for (const row of formRows) {
      if (row.commandstr === "" || row.commandstr.trim() === "") {
        errorMessage = "Enter Command String";
        return false;
      }
      if (row.schemastr === "" || row.schemastr.trim() === "") {
        errorMessage = "Enter Schema String";
        return false;
      }
    }

    errorMessage = "";
    return true;
  };

  const handleSubmit = () => {
    if (validation()) {
      if (isEditMode) {
        updateCommand();
      } else {
        addCommand();
      }
    } else {
      showToast(errorMessage, ToastTypes.error);
    }
  };

  useEffect(() => {
    if (isEditMode && selectedData && selectedData.commandId) {
      setNewCommandId(selectedData.commandId);
      setFormRows([
        {
          commandstr: selectedData.commandstr,
          schemastr: selectedData.schemastr,
          commandId: selectedData.commandId || NewCommandId,
        },
      ]);
      setAction(selectedData.action || null);
    } else {
      setNewCommandId(selectedCommandId);
      setAction(selectedAction);
      // Reset form for new entry
      setFormRows([{ commandstr: "", schemastr: "" }]);
    }
  }, [isModalOpen]);


  return (
    <div>
      <form>
        <div className="UserInvForm">
          <div className="form-row">
            <FormControl
              style={{ flexBasis: "50%", margin: "12px", padding: "0 8px" }}
            >
              <TextField
                focused
                variant="standard"
                multiline
                label="Command Id"
                onChange={(e) => setNewCommandId(e.target.value)}
                value={NewCommandId}
              />
            </FormControl>

            <Autocomplete
              fullWidth
              style={{ margin: "15px" }}
              {...defaultProps}
              id="auto-highlight"
              value={action}
              onChange={(event, newValue) => setAction(newValue)}
              autoHighlight
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select Action"
                />
              )}
            />
          </div>
          <div className="form-row">
            
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <GlobleBtn
              variant="text"
              color="primary"
              value="Add Row"
              style={{ border: "2px", marginTop: "10px" }}
              onClick={addNewRow}
              disabled={isEditMode}
            />
          </div>
          {formRows.map((row, index) => (
            <div
              className="form-row"
              key={index}
              style={{ display: "flex", alignItems: "center" }}
            >
              <FormControl
                style={{ flexBasis: "50%", margin: "12px", padding: "0 8px" }}
              >
                <TextField
                  variant="standard"
                  multiline
                  label="Command String"
                  onChange={(e) =>
                    handleInputChange(index, "commandstr", e.target.value)
                  }
                  value={row.commandstr}
                />
              </FormControl>
              <FormControl
                style={{ flexBasis: "50%", margin: "12px", padding: "0 10px" }}
              >
                <TextField
                  variant="standard"
                  multiline
                  label="Schema String"
                  value={row.schemastr}
                  onChange={(e) =>
                    handleInputChange(index, "schemastr", e.target.value)
                  }
                />
              </FormControl>
              {formRows.length > 1 && (
                <IconButton
                  onClick={() => deleteRow(index)}
                  aria-label="delete"
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}

          <div className="form-row submit-btn">
            <Stack spacing={2} direction="row">
              <GlobleBtn
                variant="text"
                color="primary"
                value="Submit"
                style={{ border: "2px" }}
                onClick={handleSubmit}
              />
              <GlobleBtn
                variant="text"
                color="error"
                value="Cancel"
                onClick={cleanStates}
              />
            </Stack>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GroupCommandForm;
