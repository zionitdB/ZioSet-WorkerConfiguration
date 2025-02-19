import React, { useState } from "react";
import { getAgentRequest } from "../../services/agentUIServiceApi";
import { showToast, ToastTypes } from "../../utils/toast";
import CircularProgress from "@mui/material/CircularProgress";
import { TreeNode } from "react-organizational-chart";
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";

function CustomTreeNode({ node, label }) {
  const [children, setChildren] = useState(node.childs || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = async () => {
    if (!isExpanded) {
      setIsLoading(true);
      const response = await getAgentRequest(
        `configuration/getAllCategoryByParentId?parentCategoryId=${node.id}`
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          showToast("No more childs found for this category", ToastTypes.error);
          setIsLoading(false);
          return;
        }
        setChildren(response.data);
        setIsLoading(false);
        setIsExpanded(true);
      }
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <TreeNode
      label={
        <div
          onClick={handleExpand}
          style={{ display: "inline", color: "var(--grey-color)" }}
        >
          {label}
          {isLoading ? (
            <CircularProgress size="16px" />
          ) : isExpanded ? (
            <BiUpArrow style={{ display: "inline" }} />
          ) : (
            <BiDownArrow style={{ display: "inline" }} />
          )}
        </div>
      }
    >
      {isExpanded && children.length > 0 && (
        <>
          {children.map((child) => (
            <CustomTreeNode
              key={child.id}
              node={child}
              label={
                <div style={{ color: "var(--grey-color)" }}>
                  {child.categoryname}
                </div>
              }
            />
          ))}
        </>
      )}
    </TreeNode>
  );
}

export default CustomTreeNode;
