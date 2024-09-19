import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Sorting icons

function DataSensor() {
  const [data, setData] = useState({ rows: [], count: 0 });
  const [allData, setAllData] = useState([]); // State to hold all data for searching
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch paginated data
        const response = await axios.get(
          "http://localhost:3001/SensorData/all",
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setData({
          rows: response.data.rows,
          count: response.data.count,
        });

        // Fetch all data for searching
        const allResponse = await axios.get("http://localhost:3001/SensorData/all");
        setAllData(allResponse.data || []); // Ensure allData is always an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, rowsPerPage]);

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on search

    try {
      const response = await axios.get("http://localhost:3001/SensorData/all", {
        params: { search: term },
      });
      setAllData(response.data || []); // Ensure allData is always an array
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
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

  const sortData = (rows) => {
    return rows.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return isAscending ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return isAscending ? 1 : -1;
      return 0;
    });
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss");
  };

  // Ensure allData is an array before calling filter
  // Filter data based on search term and category
  const filteredData = allData.filter((row) => {
    if (searchTerm === "") return true; // No filtering if no search term
  
    if (searchCategory === "all") {
      // Search across all relevant fields (temperature, humidity, light, and createdAt)
      return (
        row.temperature?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.humidity?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.light?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatTimestamp(row.createdAt).includes(searchTerm)
      );
    } else if (searchCategory === "createdAt") {
      const formattedTimestamp = formatTimestamp(row.createdAt);
      return formattedTimestamp.includes(searchTerm);
    } else {
      return row[searchCategory]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
  });
  

  const sortedData = sortData(filteredData); // Sort the data before paginating

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
            className="form-control"
            value={searchCategory}
            onChange={handleCategoryChange}
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="light">Light</option>
            <option value="createdAt">Time</option>
            <option value="all">All</option> {/* Added "All" option */}
          </select>
        </div>
        <div className="col-lg-8">
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
            <th scope="col" onClick={() => handleSort("id")}>
              ID {renderSortIcon("id")}
            </th>
            <th scope="col" onClick={() => handleSort("temperature")}>
              Temperature {renderSortIcon("temperature")}
            </th>
            <th scope="col" onClick={() => handleSort("humidity")}>
              Humidity {renderSortIcon("humidity")}
            </th>
            <th scope="col" onClick={() => handleSort("light")}>
              Light {renderSortIcon("light")}
            </th>
            <th scope="col" onClick={() => handleSort("createdAt")}>
              Time {renderSortIcon("createdAt")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
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
