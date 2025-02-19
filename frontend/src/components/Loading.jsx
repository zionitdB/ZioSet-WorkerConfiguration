import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const style = {
  loadingBox: {
    // position: "fixed",
    // top: 0,
    // left: 274, // Enclose '274px' in quotes
    // width: "calc(100vw - 287px)", // Use the 'calc' function for subtraction
    // height: "100vh",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // background: "white",
    // zIndex: 9999,
    // opacity: 1,
  },
};

export default function CircularIndeterminate() {
  return (
    // <div className="Loading-spinner" style={style.loadingBox}>
    //   <Box
    //     sx={{
    //       display: "flex",
    //       width: "100%",
    //       height: "100%",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <CircularProgress size={100} thickness={2} />
    //   </Box>
    <div className="loading-overlay"><CircularProgress /></div>
    // </div>
  );
}
