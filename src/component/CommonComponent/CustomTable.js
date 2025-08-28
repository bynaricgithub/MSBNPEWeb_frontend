import React, { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import Moment from "react-moment";

const CustomTable = ({
  columns,
  data,
  rowsPerPage,
  currentPage,
  onPageChange,
  totalRecords,
  dateFormat = "DD-MM-YYYY",
  showPagination = !!rowsPerPage,
  showRecordCount = !!totalRecords,
}) => {
  const [currentRows, setCurrentRows] = useState([]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (showPagination) {
      const indexOfLastRow = currentPage * rowsPerPage;
      const indexOfFirstRow = indexOfLastRow - rowsPerPage;
      setCurrentRows(data.slice(indexOfFirstRow, indexOfLastRow));
    } else {
      setCurrentRows(data);
    }
  }, [data, currentPage, rowsPerPage, showPagination]);

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages when count is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
      return pages;
    }

    const pageButtons = [];

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Always show first page
    pageButtons.push(
      <Pagination.Item key={1} active={currentPage === 1} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    );

    // Ellipsis before range
    if (startPage > 2) {
      pageButtons.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    // Main dynamic range (centered)
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    // Ellipsis after range
    if (endPage < totalPages - 1) {
      pageButtons.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    // Always show last page
    pageButtons.push(
      <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );

    return pageButtons;
  };

  return (
    <>
      <div className="noticeboardCard border-0 overflow-hidden">
        <div className="table-responsive">
          <Table className="pdfTables mb-1">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={col.thClassName || ""} style={{ width: col.width || "auto" }}>
                    {col.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={col.tdClassName || ""} style={{ minWidth: col.width || "auto" }}>
                        {col.dataField === "date" || col.type === "date"
                          ? row[col.dataField] && <Moment format={col.dateFormat || dateFormat}>{row[col.dataField]}</Moment>
                          : col.customRender
                          ? col.customRender(row[col.dataField], row)
                          : row[col.dataField]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex justify-content-between">
          {showRecordCount && (
            <div className="pagging mb-2">
              <p className="font-14">
                Total <b>{data.length + " "}Records</b>
              </p>
            </div>
          )}

          {showPagination && totalPages > 1 && (
            <Pagination className="mb-0 px-0">
              <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
              {renderPageNumbers()}
              <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomTable;
