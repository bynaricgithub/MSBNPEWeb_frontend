/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Dropdown, Pagination } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import API from "../API";
import { show } from "./Helper";
// 	{ text: "Sr.No.", dataField: "srno" },
// data = { list }
// columns = { header }
// keyField = "srno"
// headerClasses = "admin-allTable_header text-center"

//editor
//filter
//pagination

const CustomReactBootstrapTable = ({ columns = [], data = false, headerClasses = "", loading = false, sortingTable, getData }) => {
  const [list, setList] = useState([]);
  const [sortableList, setSortableList] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");

  const [filersList, setFilersList] = useState({});

  const [enableSorting, setEnableSorting] = useState(false);

  const rowsPerPageMenu = [5, 10, 50, 100];

  useEffect(() => {
    if (data) {
      setList(data);
      setSortableList(data);
      let tempList = {};
      columns.forEach((item) => (tempList[item.dataField] = ""));
      setFilersList(tempList);
    }
  }, [data]);

  // useEffect(() => {
  //   data &&
  //     setList(
  //       data.filter((dataItem) => {
  //         let tempFilter = true;
  //         Object.keys(filersList).forEach((filterKey) => {
  //           if (filersList[filterKey] !== "") {
  //             if (!(dataItem[filterKey] + "").includes(filersList[filterKey])) {
  //               tempFilter = false;
  //             }
  //           }
  //         });
  //         return tempFilter;
  //       })
  //     );
  // }, [filersList, data]);
  useEffect(() => {
    if (!data) return;

    setList(
      data.filter((dataItem) => {
        let matchesAllFilters = Object.keys(filersList).every((filterKey) => {
          const fieldVal = (dataItem[filterKey] ?? "").toString().toLowerCase();
          const filterVal = (filersList[filterKey] ?? "").toLowerCase();
          return filterVal === "" || fieldVal.includes(filterVal);
        });

        let matchesGlobal = true;
        if (globalSearch) {
          const fullRowString = Object.values(dataItem).join(" ").toLowerCase();
          matchesGlobal = fullRowString.includes(globalSearch.toLowerCase());
        }

        return matchesAllFilters && matchesGlobal;
      })
    );
  }, [filersList, data, globalSearch]);

  // ==============================================pagination =========================================
  const [currentPage, setCurrentPage] = useState(1);

  // You can change the number of rows per page
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Calculate indices for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = list.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [columns, data, loading]);

  return (
    <div className="fade-in-top table-responsive">
      <div className="d-flex justify-content-end">
        {!enableSorting && sortingTable && (
          <button type="button" className="btn btn-primary m-2" onClick={(e) => setEnableSorting(true)}>
            Sort
          </button>
        )}

        {enableSorting && sortingTable && (
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={(e) => {
              setEnableSorting(false);
              sortData(sortingTable, sortableList);
            }}
          >
            Save
          </button>
        )}

        {enableSorting && (
          <button type="button" className="btn btn-danger m-2" onClick={(e) => setEnableSorting(false)}>
            Cancel
          </button>
        )}
        <div className="my-2">
          <input
            type="text"
            placeholder="Search Data"
            className="form-control"
            style={{ width: "200px" }}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>
      {!loading && Array.isArray(data) && data.length === 0 && (
        <div className="row container-fluid">
          <div className="col-sm-12 col-lg-8 offset-lg-2">
            <div className="card rounded-2">
              <span className="text-center m-0 p-2 ">No data Avaliable</span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================ datatable ============================================ */}
      {!loading && !enableSorting && Array.isArray(data) && data.length > 0 && data && (
        <table className="table shadow-sm rounded-2 align-middle table-hover ">
          <thead>
            <tr className={headerClasses}>
              {columns.map((item, i) => (
                <th key={i} tabIndex={-1}>
                  {item.text}
                  <br />
                  {item.filter === true && (
                    <input
                      className="form-control"
                      onChange={(e) => {
                        setFilersList((pre) => {
                          let temp = { ...pre };
                          temp[item.dataField] = e.target.value;
                          return temp;
                        });
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j} className={["srno"].includes(col.dataField) ? "text-center" : ""}>
                    {item[col.dataField]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================================================ datatable sortable ============================================ */}
      {enableSorting && (
        <div className="card">
          <div
            className="card-header text-center"
            style={{
              color: "white",
              backgroundColor: "var(--theme)",
            }}
          >
            <h4>Drag and Drop</h4>
          </div>
          <div className="card-body">
            {!loading && Array.isArray(data) && data.length > 0 && data && (
              // <ReactSortable
              //     list={sortableList}
              //     setList={setSortableList}
              //     // group="groupName"
              //     animation={300}
              //     delayOnTouchStart={true}
              //     delay={2}
              //     className=""
              // >
              //     {sortableList.map((item, i) =>
              //         <tr key={i} className="">
              //             {columns.map((col, j) => <td
              //                 key={j}
              //                 className="px-2 border"
              //             >{item[col.dataField]}</td>)}
              //         </tr>)}
              // </ReactSortable>
              <table className="table mb-0">
                <thead>
                  <tr className={headerClasses}>
                    {columns.map((item, i) => (
                      <th key={i}>{item.text}</th>
                    ))}
                  </tr>
                </thead>
                <ReactSortable tag="tbody" list={sortableList} setList={setSortableList} animation={300} delayOnTouchStart={true} delay={2}>
                  {sortableList.map((item, i) => (
                    <tr key={item.id || i}>
                      {columns.map((col, j) => (
                        <td key={j}>{item[col.dataField]}</td>
                      ))}
                    </tr>
                  ))}
                </ReactSortable>
              </table>
            )}
          </div>
        </div>
      )}
      {/* ================================================ pagination ============================================ */}
      {!loading && !enableSorting && Array.isArray(data) && data.length > 0 && data && (
        <div className="d-flex justify-content-between">
          <div>
            <Dropdown drop={"up"}>
              <Dropdown.Toggle variant="light">{rowsPerPage}</Dropdown.Toggle>

              <Dropdown.Menu className="fade-in-bottom">
                {rowsPerPageMenu.map((item, i) => (
                  <Dropdown.Item
                    key={i}
                    onClick={(e) => {
                      setRowsPerPage(item);
                      setCurrentPage(1);
                    }}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {totalPages > 0 && (
            <Pagination>
              <Pagination.First onClick={(e) => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={goToPreviousPage} disabled={currentPage === 1} />
              {currentPage - 1 > 0 && (
                <Pagination.Item onClick={goToPreviousPage} disabled={currentPage === 1}>
                  {currentPage - 1}
                </Pagination.Item>
              )}
              <Pagination.Item linkClassName="" active>
                {currentPage}
              </Pagination.Item>
              {currentPage + 1 <= totalPages && (
                <Pagination.Item onClick={goToNextPage} disabled={currentPage === totalPages}>
                  {currentPage + 1}
                </Pagination.Item>
              )}
              <Pagination.Next onClick={goToNextPage} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={(e) => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
          <Pagination>
            <Pagination.Item linkClassName="" variant="light">
              Total pages : {totalPages}
            </Pagination.Item>
          </Pagination>
          {/* <Button variant="light" size="sm" ></Button> */}
        </div>
      )}

      {/* ================================================ placeholder ============================================ */}

      {loading && (
        <div className="container mt-5">
          <table className="table shadow-sm rounded-2 overflow-hidden">
            <tbody>
              <tr className="placeholder-row">
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
              </tr>
              <tr className="placeholder-row">
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
              </tr>
              <tr className="placeholder-row">
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
                <td className="placeholder-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  async function sortData(sortingTable, values) {
    try {
      const res = await API.post("/sort/table", { sortingTable, data: values });
      let data = res.data;
      getData && getData();
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default CustomReactBootstrapTable;
