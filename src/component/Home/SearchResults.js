import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import API from "../../API";
import CustomTable from "../CommonComponent/CustomTable";
import FileComponent from "../CommonComponent/FileVerify";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    if (query) {
      fetchSearchResults(query); // Fetch results based on the query
    }
  }, [query, currentPage]);

  const fetchSearchResults = async (searchQuery) => {
    try {
      setLoading(true);
      console.log("Search Query Sent to API:", searchQuery); // Log query for debugging

      // Call the primary search API
      const res = await API.get("/search", { params: { query: searchQuery, per_page: rowsPerPage, page: currentPage } });
      console.log("API Response:", res.data); // Log the response to see its structure

      // Check the structure of the response
      if (!res.data || !res.data.data) {
        console.error("API response structure is incorrect:", res.data);
        setData([]);
        setLoading(false);
        return;
      }

      const filteredData = res.data?.data || {};

      let allData = [];

      if (filteredData.table_content && filteredData.table_content.data) {
        allData = allData.concat(filteredData.table_content.data);
      }
      if (filteredData.notice_boards && filteredData.notice_boards.data) {
        allData = allData.concat(filteredData.notice_boards.data);
      }

      if (allData.length === 0) {
        console.log("No results found");
      }

      // Sort and format data
      const sortedData = allData.sort((a, b) => new Date(b.date) - new Date(a.date));
      const formattedData = sortedData.map((item, index) => ({
        ...item,
        index: index + 1,
        title: item.title || "No title available", // Fallback to heading or link_title if title is missing
        date: item.date || "No date available", // Added "date" field for the publish date
      }));

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setData([]);
      setLoading(false);
    }
  };

  const columns = [
    {
      text: "Sr. No.",
      dataField: "index",
      width: "70px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
    {
      text: "Details",
      dataField: "title",
      customRender: (_, row) => {
        const title = row.title || row.link; // If title is not available, show the link instead

        return (
          <>
            {/* Display the title if available, otherwise show the link */}
            <div dangerouslySetInnerHTML={{ __html: title }} />
            {row.type !== 5 ? (
              row.downloads?.[0]?.link ? (
                <FileComponent file={row.downloads[0].link} fileTitle={row.downloads[0].title || "Download"} fileType="searchpdf" />
              ) : null
            ) : (
              <ul className="mb-0 mt-2">
                {row.downloads?.map((d, i) => (
                  <li key={i}>
                    <FileComponent file={d.link} fileTitle={d.title || "Download"} fileType="searchpdf" />
                  </li>
                ))}
              </ul>
            )}
            {row.imageUrl && <FileComponent file={row.imageUrl} fileTitle={row.title} fallbackFile="" fileType="search" />}
          </>
        );
      },
    },

    {
      text: "Date Published",
      dataField: "date",
      width: "150px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
  ];

  return (
    <>
      <Card className="noticeboardCard border-0">
        <Card.Header className="announcmentHeader text-center br-0">Search Results</Card.Header>
        <Card.Body className="py-3 container">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {data.length === 0 ? (
                <div>No results found for "{query}"</div>
              ) : (
                <CustomTable
                  columns={columns}
                  data={data}
                  totalRecords={data.length}
                  rowsPerPage={rowsPerPage}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  showPagination={false}
                  showRecordCount={false}
                />
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default SearchResults;
