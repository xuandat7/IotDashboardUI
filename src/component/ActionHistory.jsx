import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaSort, FaSearch } from "react-icons/fa"; // Import icons

function ActionHistory() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(""); // For sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // For sorting order (asc/desc)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to fetch data
  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/GetDataAction/allData`
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle search category change
  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchTerm(""); // Clear search term when category changes
    setCurrentPage(1); // Reset to first page on category change
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss");
  };

  // Filter data based on search term and category
  const filteredData = data.filter((row) => {
    if (searchTerm === "") return true; // No filtering if no search term

    if (searchCategory === "all") {
      // Search all fields
      return (
        row.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatTimestamp(row.timestamp).includes(searchTerm)
      );
    } else if (searchCategory === "timestamp") {
      const formattedTimestamp = formatTimestamp(row.timestamp);
      return formattedTimestamp.includes(searchTerm);
    } else {
      return row[searchCategory]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
  });

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Apply pagination to sorted and filtered data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Render pagination
  const renderPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (i <= maxPagesToShow || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pagination.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </button>
          </li>
        );
      } else if (i === maxPagesToShow + 1 || i === totalPages - 1) {
        pagination.push(
          <li key={i} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    return pagination;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="main" className="main">
      <h2 className="text-left">Action History</h2>

      <div className="row mt-3 mb-3">
        <div className="col-md-4">
          <select
            className="form-control"
            onChange={handleCategoryChange}
            value={searchCategory}
          >
            <option value="device">Device</option>
            <option value="state">State</option>
            <option value="timestamp">Timestamp</option>
            <option value="all">All</option> {/* Added "All" option */}
          </select>
        </div>

        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${searchCategory}...`}
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: "100%" }}
            />
            
          </div>
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">
              ID
              <button onClick={() => handleSort("id")} className="btn btn-link">
                <FaSort />
              </button>
            </th>
            <th scope="col">
              Device
              <button
                onClick={() => handleSort("device")}
                className="btn btn-link"
              >
                <FaSort />
              </button>
            </th>
            <th scope="col">
              State
              <button
                onClick={() => handleSort("state")}
                className="btn btn-link"
              >
                <FaSort />
              </button>
            </th>
            <th scope="col">
              Timestamp
              <button
                onClick={() => handleSort("timestamp")}
                className="btn btn-link"
              >
                <FaSort />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.id}</th>
                <td>{row.device}</td>
                <td>{row.state}</td>
                <td>{formatTimestamp(row.timestamp)}</td>
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

      {totalPages > 1 && (
        <nav>
          <div className="row">
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
            <div className="col-lg-10">
              <ul className="pagination justify-content-end">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {renderPagination()}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </main>
  );
}

export default ActionHistory;
