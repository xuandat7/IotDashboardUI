import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function DataSensor() {
  const [data, setData] = useState({ rows: [], count: 0, page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("temperature");
  const [sortBy, setSortBy] = useState("id");
  const [isAscending, setIsAscending] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/SensorData", {
          params: { page: currentPage, limit: rowsPerPage },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, rowsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const filteredData = data.rows.filter((row) => {
    const value = row[searchCategory];
    return (
      value !== undefined &&
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSort = (event) => {
    const sortBy = event.target.value;
    setSortBy(sortBy);
    setIsAscending(sortBy.includes("asc"));
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss");
  };

  const totalPages = Math.ceil(data.count / rowsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;

    if (totalPages <= 7) {
      // Nếu tổng số trang ít hơn 7, hiển thị tất cả các trang
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
      // Nếu tổng số trang nhiều hơn 7, hiển thị dấu "..." và chỉ các trang cần thiết
      // Trang đầu
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

      // Hiển thị dấu "..." nếu trang hiện tại > 4
      if (currentPage > maxPagesToShow + 1) {
        pagination.push(
          <li key="ellipsis-start" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      // Các trang ở giữa (3 trang trước và 3 trang kế tiếp)
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

      // Hiển thị dấu "..." nếu trang hiện tại chưa gần cuối
      if (currentPage < totalPages - maxPagesToShow) {
        pagination.push(
          <li key="ellipsis-end" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }

      // Trang cuối
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
          </select>
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
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Temperature</th>
            <th scope="col">Humidity</th>
            <th scope="col">Light</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row) => (
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
