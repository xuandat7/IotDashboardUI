import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function ActionHistory() {
  const [data, setData] = useState({ rows: [], count: 0, page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("device");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/GetDataAction/fanlightlog",
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchTerm("");
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss");
  };

  const filteredData = data.rows.filter((row) => {
    if (searchCategory === "timestamp") {
      const formattedTimestamp = formatTimestamp(row.timestamp);
      return formattedTimestamp.includes(searchTerm);
    } else {
      return row[searchCategory]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
  });

  const totalPages = Math.ceil(data.count / rowsPerPage);

  const renderPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;

    // Always show first page
    pagination.push(
      <li
        key={1}
        className={`page-item ${currentPage === 1 ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => setCurrentPage(1)}>
          1
        </button>
      </li>
    );

    // Show ellipsis if needed before the current pages
    if (currentPage > maxPagesToShow + 1) {
      pagination.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Show ellipsis if needed before the last page
    if (currentPage < totalPages - maxPagesToShow) {
      pagination.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Always show last page
    pagination.push(
      <li
        key={totalPages}
        className={`page-item ${currentPage === totalPages ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
      </li>
    );

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
          </select>
        </div>

        <div className="col-md-4">
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
          {filteredData.length > 0 ? (
            filteredData.map((row) => (
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