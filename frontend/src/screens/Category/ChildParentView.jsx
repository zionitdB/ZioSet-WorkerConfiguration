import React, { useState } from "react";
import "./ChildParentView.css";
import { getAgentRequest } from "../../services/agentUIServiceApi";
import { showToast, ToastTypes } from "../../utils/toast";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";

const ChildParentView = ({ data }) => {
  const [nodes, setNodes] = useState([{ id: data.id, label: data.label }]);
  const [loadingNodeId, setLoadingNodeId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [viewClicked, setViewClicked] = useState(false);

  const handleExpandCollapse = async (id) => {
    if (expandedNodes[id]) {
      // If the node is expanded, collapse it but keep it visible
      setExpandedNodes((prevState) => ({
        ...prevState,
        [id]: false,
      }));
      const index = nodes.findIndex((node) => node.id === id);
      setNodes((prevNodes) => prevNodes.slice(0, index + 1));
    } else {
      // If the node is collapsed, expand it by calling the API
      setLoadingNodeId(id);

      try {
        const response = await getAgentRequest(
          `configuration/getAllCategoriesTreeById?categoryId=${id}`
        );
        if (response.status === 200) {
          if (!response.data) {
            showToast("No more children", ToastTypes.error);
            setLoadingNodeId(null);
            return;
          }
          if (response.data?.parent !== null) {
            const newNode = {
              id: response.data.parent.id,
              label: response.data.parent.categoryname,
            };
            setNodes((prevNodes) => [...prevNodes, newNode]);
            setExpandedNodes((prevState) => ({
              ...prevState,
              [id]: true,
            }));
          } else {
            showToast("No parent found", ToastTypes.error);
          }
        }
      } catch (error) {
        showToast("Error fetching data", ToastTypes.error);
      } finally {
        setLoadingNodeId(null);
      }
    }
  };

  return (
    <div className="diagram-container">
      {viewClicked &&
        nodes?.map((node, index) => (
          <div key={node.id} className="node-container">
            <div className="arrow">&darr;</div>
            <div
              className="node"
              onClick={() => handleExpandCollapse(node.id)}
              // style={{ display: "flex", alignItems: "center" }}
            >
              {node.label}
              {loadingNodeId === node.id ? (
                <div style={{ textAlign: "center" }}>
                  <CircularProgress size={14} />
                </div>
              ) : expandedNodes[node.id] ? (
                <div style={{ textAlign: "center" }}>
                  <BiDownArrow />
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <BiUpArrow />
                </div>
              )}
            </div>
          </div>
        ))}
      <Button
        variant="outlined"
        onClick={() => {
          setExpandedNodes({});
          setNodes([{ id: data.id, label: data.label }]);
          setViewClicked(!viewClicked);
        }}
      >
        View Parent Hierarchy
      </Button>
    </div>
  );
};

export default ChildParentView;
