import React from "react";

// Table Header Component
const TableHeader = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column}</th>
        ))}
      </tr>
    </thead>
  );
};

// Table Body Component
const TableBody = ({ data, columns }) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((column, colIndex) => (
            <td key={colIndex}>{row[column]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// Reusable Table Component
const Table = ({ columns, data }) => {
  return (
    <table>
      <TableHeader columns={columns} />
      <TableBody data={data} columns={columns} />
    </table>
  );
};

// Usage Example
const NewTable = () => {
  const columns = ["Name", "Age", "Email"];
  const data = [
    { Name: "John", Age: 30, Email: "john@example.com" },
    { Name: "Jane", Age: 25, Email: "jane@example.com" },
    { Name: "Doe", Age: 35, Email: "doe@example.com" },
  ];

  return (
    <div>
      <h1>Users Table</h1>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default NewTable;
