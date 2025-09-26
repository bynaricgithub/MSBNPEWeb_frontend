import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import API from "../../API";
import CustomTable from "./CustomTable";
import FileComponent from "./FileVerify";

const ReusableTableContent = ({ type, title }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      const res = await API.get("/page-content/listing");
      const updatedData = res.data?.data || [];

      const formatted = updatedData
        .filter((item) => item.type === type)
        .map((item, index) => {
          const downloadsArray = parseArray(item.downloads);
          return {
            heading: item.title,
            imageUrl: item.imageUrl,
            date: item.date?.split("T")[0] || "",
            downloads: downloadsArray,
            mainUrl: item.mainUrl,
          };
        });

      setData(formatted);
    } catch (error) {
      console.error(`Error fetching type ${type} data:`, error);
      setData([]);
    }
  };

  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const dataWithIndex = data.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  const columns = [
    {
      text: "Sr. No.",
      dataField: "index",
      width: "80px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
    {
      text: "Details",
      dataField: "title",
      customRender: (_, row) => {
        return (
          <>
            <FileComponent file={row.mainUrl} fileTitle={row.heading} fileType="pdf" />
            {row.type !== 5 ? (
              row.downloads?.[0]?.link ? (
                <FileComponent file={row.downloads[0].link} fileTitle={row.downloads[0].title || null} fileType="searchpdf" />
              ) : null
            ) : (
              <ul className="mb-0 mt-2">
                {row.downloads?.map((d, i) => (
                  <li key={i}>
                    <FileComponent file={d.link} fileTitle={d.title || null} fileType="searchpdf" />
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      },
    },

    {
      text: "Link",
      dataField: "title",
      customRender: (_, row) => {
        return (
          <>
            <a href={row.mainUrl}>Download</a>
          </>
        );
      },
      width: "150px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
    {
      text: "Date of Publish",
      dataField: "date",
      width: "150px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
  ];

  return (
    <>
      {title && (
        <div className="commonSubheader">
          <Container>
            <Row>
              <Col lg={12}>
                <h1 className="innercommTitle">{title}</h1> {/* Use dynamic title */}
              </Col>
            </Row>
          </Container>
        </div>
      )}
      <Container>
        <Row className="my-2 justify-content-center cTableUlli">
          <Col lg={12}>
            <CustomTable
              columns={columns}
              data={dataWithIndex}
              totalRecords={data.length}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              showPagination={true}
              showRecordCount={true}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ReusableTableContent;
