import React, { useState } from 'react';
import sensorData from '../data/sensorData.json'; // Import JSON data

function DataSensor() {
  const [data, setData] = useState(sensorData.rows); // Load the rows from JSON file
  const [columns] = useState(sensorData.columns); // Load the columns from JSON file
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const rowsPerPage = 5; // Number of rows per page

  // Handle search functionality
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle sort functionality
  const handleSort = () => {
    const sortedData = [...data].sort((a, b) =>
      isAscending ? a.id - b.id : b.id - a.id
    );
    setData(sortedData);
    setIsAscending(!isAscending);
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

      {/* Search Bar and Sort Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '50%' }}
        />

        {/* Sort Button */}
        <button className="btn btn-primary ml-3" onClick={handleSort}>
          Sort by ID {isAscending ? '↑' : '↓'}
        </button>
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
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
                <th scope="row">{row.id}</th>
                <td>{row.Name}</td>
                <td>{row.Humidity}</td>
                <td>{row.Temperature}</td>
                <td>{row.Light}</td>
                <td>{row.Ran === true ? 'Yes' : 'No'}</td>
                <td>{row['Time Update']}</td>
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
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
                  currentPage === number + 1 ? 'active' : ''
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
                currentPage === totalPages ? 'disabled' : ''
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
