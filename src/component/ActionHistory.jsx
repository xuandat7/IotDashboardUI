import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for making HTTP requests

function ActionHistory() {
  const [data, setData] = useState([]); // Initialize state for data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order
  const [loading, setLoading] = useState(true); // State for loading

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/GetDataAction/fanlightlog");
        setData(response.data); // Assuming the API returns an array of data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        sortedData = [...data].sort((a, b) => a.id - b.id);
        break;
      case "-id":
        sortedData = [...data].sort((a, b) => b.id - a.id);
        break;
      case "device":
        sortedData = [...data].sort((a, b) => a.device.localeCompare(b.device));
        break;
      case "-device":
        sortedData = [...data].sort((a, b) => b.device.localeCompare(a.device));
        break;
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

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

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
            <option value="device">Sort by Device</option>
            <option value="-device">Sort by Device (reverse)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Device</th>
            <th scope="col">State</th>
            <th scope="col">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.id}</th>
                <td>{row.device}</td>
                <td>{row.state}</td>
                <td>{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
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
