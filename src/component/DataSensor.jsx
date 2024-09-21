import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import * as moment from "moment-timezone";

function DataSensor() {
  const [data, setData] = useState({ rows: [], count: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/SensorData", {
          params: {
            page: currentPage,
            limit: rowsPerPage,
            sortField: sortBy,
            sortOrder: isAscending ? "asc" : "desc",
            search: searchTerm, // Send the search term
            field: searchCategory === "all" ? undefined : searchCategory, // Conditionally send field param
          },
        });
        setData({
          rows: response.data.rows,
          count: response.data.count,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    currentPage,
    rowsPerPage,
    sortBy,
    isAscending,
    searchTerm,
    searchCategory,
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchTerm(""); // Clear search term when category changes
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setIsAscending(!isAscending); // Toggle sorting order
    } else {
      setSortBy(column);
      setIsAscending(true); // Default to ascending when switching columns
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return isAscending ? <FaSortUp /> : <FaSortDown />;
    } else {
      return <FaSort />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment
      .tz(timestamp, "Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss");
  };

  const totalPages = Math.ceil(data.count / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      pagination.push(
        <li
          key={1}
          className={`page-item ${currentPage === 1 ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );

      if (currentPage > maxPagesToShow + 1) {
        pagination.push(
          <li key="ellipsis-start" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pagination.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }

      if (currentPage < totalPages - maxPagesToShow) {
        pagination.push(
          <li key="ellipsis-end" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      pagination.push(
        <li
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pagination;
  };

  return (
    <main id="main" className="main">
      <h2 className="text-left">Data Sensor</h2>
      <div className="row mb-3 mt-3">
        <div className="col-md-2">
          <select
            className="form-select"
            value={searchCategory}
            onChange={handleCategoryChange}
          >
            <option value="Temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="light">Light</option>
            <option value="createdAt">Time</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="col-lg-10">
          <input
            type="text"
            className="form-control"
            placeholder={`Search by ${
              searchCategory === "all" ? "any field" : searchCategory
            }...`}
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">
              <div className="d-flex align-items-center">
                <span>ID</span>

                <button
                  onClick={() => handleSort("id")}
                  className="btn btn-link"
                >
                  {renderSortIcon("id")}
                </button>
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center">
                <span>Temperature</span>
                <button
                  onClick={() => handleSort("temperature")}
                  className="btn btn-link"
                >
                  {renderSortIcon("temperature")}
                </button>
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center">
                <span>Humidity</span>
                <button
                  onClick={() => handleSort("humidity")}
                  className="btn btn-link"
                >
                  {renderSortIcon("humidity")}
                </button>
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center">
                <span>Light</span>
                <button
                  onClick={() => handleSort("light")}
                  className="btn btn-link"
                >
                  {renderSortIcon("light")}
                </button>
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center">
                <span>Time</span>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="btn btn-link"
                >
                  {renderSortIcon("createdAt")}
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.length > 0 ? (
            data.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.id}</th>
                <td>{row.temperature}</td>
                <td>{row.humidity}</td>
                <td>{row.light}</td>
                <td>{formatTimestamp(row.createdAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
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
                <label>Limit:</label>
                <input
                  type="number"
                  className="form-control mx-2"
                  value={rowsPerPage}
                  onChange={(e) =>
                    setRowsPerPage(parseInt(e.target.value) || 1)
                  }
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
                    onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(currentPage + 1)}
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

export default DataSensor;
