import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Select from "react-select";
import Stack from "@mui/material/Stack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "../utils/localStorageService";
/* import jsPDF from "jspdf";
import "jspdf-autotable"; */
import { DarkModeContext } from "../utils/DarkModeContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function DataTable({
  columns,
  data,
  allData,
  tableKey,
  showExportButton,
  customRenderCell,
  showPageButton,
  showPageButton2,
  pageSize,
  handlePageSizeChange,
  showPageFooter,
  showPerPageButton,
  tablePerPage,
  checkboxSelection,
  onRowSelectionModelChange,
  rowsSelectionModel,
  props,
}) {
  const handleExportClick = async () => {
    const columnsToExport = columns?.filter(
      (column) => column?.field !== "action"
    );
    const filterData = allData ? await allData() : data;

    const dataToExport = filterData?.map((row) => {
      const rowData = {};
      columnsToExport?.forEach((column) => {
        if (!(column?.field in columnsState)) {
          rowData[column?.headerName] = row[column?.field];
        }
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  /* const handlePDFExport = async () => {
    // Initialize the jsPDF instance
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight(),
      ],
    });

    const columnsToExport = columns?.filter(
      (column) => column?.field !== "action"
    );

    // Fetch all data from pagination
    const allRows = await fetchAllDataFromPagination();

    const tableRows = allRows.map((row) =>
      columnsToExport?.map((column) => row[column?.field])
    );

    // Set table format
    const startY = 10;
    const margin = 10;

    // Add table to PDF
    doc.autoTable({
      head: [columnsToExport?.map((column) => column?.headerName)],
      body: tableRows,
      startY: startY + margin,
      theme: "striped",
      styles: { fontSize: 10 },
      columnStyles: {
        // Adjust column styles as needed
      },
      didDrawPage: function (data) {
        // Add page content here if needed
      },
    });

    // Scale the PDF
    doc.scale(0.8);

    // Save PDF
    doc.save("table_data.pdf");
  };
 */
  const fetchAllDataFromPagination = async () => {
    // You may need to implement the logic to fetch all data from pagination
    // For example, you can iterate over the pages and concatenate the data
    // Here is a sample implementation if you're using an API with pagination support
    const totalPages = Math.ceil(data.length / pageSize);
    const allRows = [];

    for (let page = 1; page <= totalPages; page++) {
      const pageData = await fetchPageData(page);
      allRows?.push(...pageData);
    }

    return allRows;
  };

  const fetchPageData = async (page) => {
    // Implement the logic to fetch data for a specific page
    // For example, if you're using an API, you can make a request with pagination parameters
    // Replace this with your actual implementation
    return data?.slice((page - 1) * pageSize, page * pageSize);
  };

  // const handleExportClick = () => {
  //   const columnsToExport = columns
  //     .filter((column) => column.field !== "action")
  //     .map((column) => ({ ...column, field: column.field.toUpperCase() }));

  //   const dataToExport = data.map((row) => {
  //     const rowData = {};
  //     columnsToExport.forEach((column) => {
  //       const key = column.field.toLowerCase();
  //       const value =
  //         column.type === "date"
  //           ? new Date(row[key]).toLocaleString()
  //           : row[key];
  //       rowData[column.field] = value;
  //     });
  //     return rowData;
  //   });

  //   const ws = XLSX.utils.json_to_sheet(dataToExport);

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  //   XLSX.writeFile(wb, "exported_data.xlsx");
  // };

  const [columnsState, setColumnsState] = React.useState({});
  // const [pageSizeOptions, setPageSizeOptions] = useState([5, 10, 15, 20]);
  const pageSizeOptions = [5, 10, 15, 20, 25, 100];
  const pageSizeOptions2 = [5, 10];

  const handleColumnVisibilityChange = (updatedColumns) => {
    setColumnsState(updatedColumns);
    saveInLocalStorage(tableKey, JSON.stringify(updatedColumns));
  };

  useEffect(() => {
    const savedColumnVisibility = getFromLocalStorage(tableKey);
    if (savedColumnVisibility) {
      try {
        const json = JSON.parse(savedColumnVisibility);
        setColumnsState(json);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    const savedColumnVisibility = getFromLocalStorage(tableKey);
    if (savedColumnVisibility) {
      try {
        const json = JSON.parse(savedColumnVisibility);
        setColumnsState(json);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const totalFlex = columns.reduce((total, col) => total + (col.flex || 0), 0);

  const equalWidthColumns = columns.map((col) => ({
    ...col,
    width: `${(col.flex / totalFlex) * 100}%`,
  }));

  const { isDarkMode } = useContext(DarkModeContext);
  // Light theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      // Add your light mode palette colors here
    },
  });

  // Dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      // Add your dark mode palette colors here
    },
  });
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div>
        <div className="">
          {showExportButton && (
            <Stack
              style={{ justifyContent: "-between" }}
              direction="row"
              spacing={2}
            >
              <div>{props?.addButton}</div>
              <Button
                variant="text"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportClick}
              >
                Export
              </Button>
              {/* <Button
            variant="text"
            startIcon={<FileDownloadIcon />}
            onClick={handlePDFExport}
          >
            Pdf
          </Button> */}
            </Stack>
          )}
          {showPageButton2 && (
            <Stack
              style={{ justifyContent: "-between" }}
              direction="row"
              spacing={2}
            >
              <div className="d-flex row-per-page">
                <p>Rows per page:</p>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  value={{
                    value: pageSize || "",
                    label: (pageSize || "").toString(),
                  }}
                  onChange={handlePageSizeChange}
                  options={pageSizeOptions.map((option) => ({
                    value: option,
                    label: option.toString(),
                  }))}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#333",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: isDarkMode ? "#fff" : "#333",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#333",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? isDarkMode
                          ? "#555"
                          : "#f4f4f4"
                        : "inherit",
                      color: state.isFocused
                        ? isDarkMode
                          ? "#fff"
                          : "#333"
                        : "inherit",
                    }),
                  }}
                />
              </div>
              {/* <p className="d-flex">
            Rows per page: 
            <select value={pageSize} onChange={handlePageSizeChange}>
              {[5, 10, 15, 20].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </p> */}
            </Stack>
          )}
        </div>

        <div style={{ height: "100%", width: "100%", marginTop: 15 }}>
          <DataGrid
            autoHeight
            style={{ color: "var(--grey-color)" }}
            rows={data}
            getRowId={(row) => row?.id}
            // columns={equalWidthColumns}
            columns={columns?.map((col) => {
              if (
                col.field === "0day" ||
                (col.field &&
                  col.field.includes &&
                  col.field.includes("day") &&
                  customRenderCell)
              ) {
                return {
                  ...col,
                  renderCell: customRenderCell,
                };
              }
              return col;
            })}
            // autoHeight
            columnVisibilityModel={columnsState}
            onColumnVisibilityModelChange={handleColumnVisibilityChange}
            density="compact" // Set density to "compact"
            // pageSizeOptions={[5, 10, 15, 20, 100]}
            pageSizeOptions={pageSizeOptions}
            // pageSizeOptions={pageSizeOptions ? pageSizeOptions2 : pageSizeOptions}

            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            // onPageSizeChange={`$((newPageSize) => handlePageSizeChange(newPageSize)) || ${handlePageSizeChange}`}
            initialState={{
              pagination: {
                // paginationModel: { page: 0, pageSize: 100 },
                paginationModel: {
                  page: 0,
                  pageSize: tablePerPage || 10,
                },
                // paginationModel: { page: 0, pageSize: pageSize ? pageSize : 100 },
              },
            }}
            {...(showPageFooter ? { hideFooterPagination: true } : {})}
            checkboxSelection={checkboxSelection}
            onRowSelectionModelChange={onRowSelectionModelChange}
            rowSelectionModel={rowsSelectionModel}
            sx={{ "--DataGrid-overlayHeight": "50px" }}
            {...props}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
