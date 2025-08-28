import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import CustomTable from "../CommonComponent/CustomTable";
import API from "../../API"; // Make sure this points to your Laravel API base URL

const Programs = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await API.get("/programs/listing");
      const programs = res.data?.data || [];

      const formatted = programs.map((item, index) => ({
        index: index + 1,
        category: item.category,
        duration: item.duration,
        examination: item.examination,
        registration: item.registration,
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching Programs:", error);
      setData([]);
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
      text: "Registration Categories",
      dataField: "category",
      thClassName: "text-center",
    },
    {
      text: "Training Duration",
      dataField: "duration",
      thClassName: "text-center",
    },
    {
      text: "Examination",
      dataField: "examination",
      thClassName: "text-center",
    },
    {
      text: "Registration",
      dataField: "registration",
      thClassName: "text-center",
    },
  ];

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Registration Category Details</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="justify-content-center mt-5">
        <Row className="mb-4">
          <Col xl={12} lg={12} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Body className="mt-1 m-0 p-2">
                <CustomTable
                  columns={columns}
                  data={data}
                  totalRecords={data.length}
                  rowsPerPage={rowsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  showPagination={false}
                  showRecordCount={false}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Programs;
