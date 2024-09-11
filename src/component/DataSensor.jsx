import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { format, isMatch } from "date-fns"; // Import functions from date-fns

function DataSensor() {
  const [data, setData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchCategory, setSearchCategory] = useState("temperature"); 
  const [sortBy, setSortBy] = useState("id"); 
  const [isAscending, setIsAscending] = useState(true); 

  const [currentPage, setCurrentPage] = useState(1); 
  const [rowsPerPage, setRowsPerPage] = useState(100); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/SensorData");
        setData(response.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const filteredData = data.filter((row) => {
    const value = row[searchCategory]; 
    return value !== undefined && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSort = (event) => {
    const sortBy = event.target.value;
    setSortBy(sortBy);
    setIsAscending(sortBy.includes("asc"));
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss"); // Format timestamp into a more searchable form
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  const currentRows = filteredData
    .sort((a, b) => {
      if (sortBy === "id") return isAscending ? a.ID - b.ID : b.ID - a.ID;
      if (sortBy === "temperature") return isAscending ? a.temperature - b.temperature : b.temperature - a.temperature;
      return 0;
    })
    .slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
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
