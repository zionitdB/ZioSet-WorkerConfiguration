import React from "react";
import { useLocation, useNavigate } from "react-router";
import TreeView from "./TreeView";
import { Button, Divider } from "@mui/material";
import ChildParentView from "./ChildParentView";

const TreeViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/app/category");
  };
  return (
    <div className="container">
      <div className="text">Category Hierarchy</div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleBackClick}>
          Go Back
        </Button>
      </div>
      <div>
        <span
          style={{
            color: "var(--grey-color)",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Selected Category :{" "}
        </span>
        <span style={{ color: "green", marginLeft: "10px" }}>
          {location?.state?.row?.categoryname}
        </span>
      </div>
      <div style={{ color: "var(--grey-color)" }}>
        <h3 style={{ textAlign: "center", marginTop: "20px" }}>
          Parent Hierarchy
        </h3>
        <ChildParentView
          data={{
            id: location?.state?.row?.id,
            label: location?.state?.row?.categoryname,
          }}
        />
      </div>
      <Divider style={{ margin: "30px" }} />
      <div style={{ color: "var(--grey-color)" }}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Child Hierarchy
        </h3>
        <TreeView
          row={location?.state?.row}
          parent={location?.state?.row?.parrentCategory?.categoryname}
        />
      </div>
    </div>
  );
};

export default TreeViewPage;
