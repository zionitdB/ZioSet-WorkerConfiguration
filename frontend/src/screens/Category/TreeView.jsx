import React, { useState, useEffect } from "react";
import CustomTreeNode from "./CustomTreeNode"; // Import the refactored CustomTreeNode component
import { Tree } from "react-organizational-chart";
import { Button } from "@mui/material";

function TreeView({ row, parent }) {
  const [rootClicked, setRootClicked] = useState(false);
  const data = row;
  return (
    <div>
      {data && (
        <Tree
          lineWidth={"2px"}
          lineColor={"green"}
          lineBorderRadius={"10px"}
          label={
            <Button
              variant="outlined"
              onClick={() => setRootClicked(!rootClicked)}
            >
              View Child Hierarchy
              {/* Parent &gt; Child */}
              {/* {parent ? parent : "click here"} */}
            </Button>
          }
        >
          {rootClicked && (
            <CustomTreeNode
              node={data}
              label={
                <div style={{ color: "var(--grey-color)" }}>
                  {data.categoryname}
                </div>
              }
            />
          )}
        </Tree>
      )}
    </div>
  );
}

export default TreeView;
