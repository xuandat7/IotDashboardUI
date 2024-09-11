import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isMatch } from "date-fns"; // Import functions from date-fns

function ActionHistory() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("device"); // Default to 'device'
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/GetDataAction/fanlightlog");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
    setSearchTerm("");
  };

  // Function to format timestamp for search comparison
  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd-MM-yyyy HH:mm:ss"); // Format timestamp into a more searchable form
  };

  const filteredData = data.filter((row) => {
    if (searchCategory === "timestamp") {
      // Check if the search term matches the formatted timestamp
      const formattedTimestamp = formatTimestamp(row.timestamp);

      // Partial match for time search
      return formattedTimestamp.includes(searchTerm);
    } else {
      return row[searchCategory]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main id="main" className="main">
      <h2 className="text-left">Action History</h2>

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

        <div className="col-md-4">
          <select className="form-control" onChange={handleCategoryChange} value={searchCategory}>
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
          {currentRows.length > 0 ? (
            currentRows.map((row) => (
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
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages).keys()].map((number) => (
              <li
                key={number + 1}
                className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(number + 1)}>
                  {number + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
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
