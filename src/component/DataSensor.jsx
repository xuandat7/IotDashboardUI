import React, { useState } from "react";
import sensorData from "../data/sensorData.json"; // Import JSON data

function DataSensor() {
  const [data, setData] = useState(sensorData.rows); // Load the rows from JSON file
  const [columns] = useState(sensorData.columns); // Load the columns from JSON file
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortBy, setSortBy] = useState("id"); // State to track sorting column
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  // const rowsPerPage = 5; // Number of rows per page

  // Handle search functionality
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle sort functionality
  const handleSort = (event) => {
    const sortBy = event.target.value;
    let sortedData;

    switch (sortBy) {
      case "id":
        sortedData = [...data].sort((a, b) => a.ID - b.ID);
        break;
      case "-id":
        sortedData = [...data].sort((a, b) => b.ID - a.ID);
        break;
      case "Name":
        sortedData = [...data].sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "-Name":
        sortedData = [...data].sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      // Add more cases as needed
      default:
        sortedData = data;
    }

    setData(sortedData);
  };

  // When dropdown changes, update the sorting state and trigger sorting
  const handleDropdownChange = (e) => {
    const [column, order] = e.target.value.split("-");
    setSortBy(column);
    setIsAscending(order === "asc");
    handleSort(e);
  };

  // Filtered data based on search term
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Get total page count
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <main id="main" className="main">
      <h2 className="text-left">Data Sensor</h2>
      <div className="row mb-3 mt-3">
      <div className="col-lg-2">
          <div className="form-group d-flex align-items-center">
            <label>Rows:</label>
            <input
              type="number"
              className="form-control mx-2 "
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              min="1"
            />
          </div>
        </div>
        <div className="col-lg-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-lg-2">
          <select
            className="form-control"
            onChange={handleSort}
            style={{ width: "100%" }}
          >
            <option value="id">Sort by ID ↑</option>
            <option value="-id">Sort by ID ↓</option>
            <option value="Name">Sort by Name</option>
            <option value="-Name">Sort by Name (reverse)</option>
            {/* Add more options for other columns if needed */}
          </select>
        </div>
      </div>
      {/* Search Bar and Sort Dropdown */}

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            {columns.map((colName, index) => (
              <th key={index} scope="col">
                {colName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
              <tr key={row.ID}>
                <th scope="row">{row.ID}</th>
                <td>{row.Name}</td>
                <td>{row.Humidity}</td>
                <td>{row.Temperature}</td>
                <td>{row.Light}</td>
                <td>{row.Ran === true ? "Yes" : "No"}</td>
                <td>{row["Time Update"]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>


      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages).keys()].map((number) => (
              <li
                key={number + 1}
                className={`page-item ${
                  currentPage === number + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

    </main>
  );
}

export default DataSensor;
