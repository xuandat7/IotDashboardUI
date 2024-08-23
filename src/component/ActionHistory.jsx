import React, { useState } from "react";
import dataJson from "../data/actionHistoryData.json"; // Import JSON data

function ActionHistory() {
  const [data, setData] = useState(dataJson.rows); // Load the rows from JSON file
  const [columns] = useState(dataJson.columns); // Load the columns from JSON file
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  // const rowsPerPage = 5; // Number of rows per page

  // Handle search functionality
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to the first page on search
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
      case "name":
        sortedData = [...data].sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "-name":
        sortedData = [...data].sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      // Add more cases as needed
      default:
        sortedData = data;
    }

    setData(sortedData);
  };

  // Filter data based on search term
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
      <h2 className="text-left">Action History</h2>

      {/* Search Bar and Sort Dropdown */}
      <div className="row mt-3 mb-3">
        <div className="col-lg-2">
          <div className="form-group d-flex align-items-center">
            <label>Rows:</label>
            <input
              type="number"
              className="form-control mx-2"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              min="1"
            />
          </div>
        </div>

        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-2">
          <select className="form-control" onChange={handleSort}>
            <option value="id">Sort by ID ↑</option>
            <option value="-id">Sort by ID ↓</option>
            <option value="name">Sort by Name</option>
            <option value="-name">Sort by Name (reverse)</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>

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
              <tr key={row.id}>
                <th scope="row">{row.ID}</th>
                <td>{row.Name}</td>
                <td>{row.Time}</td>
                <td>{row["Date Update"]}</td>
                <td>{row.Status}</td>
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

export default ActionHistory;
