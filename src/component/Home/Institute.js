import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import CustomTable from "../CommonComponent/CustomTable";
import API from "../../API"; // Make sure this points to your Laravel API base URL

const Institute = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);

  useEffect(() => {
    fetchInstitute();
  }, []);

  const fetchInstitute = async () => {
    try {
      const res = await API.get("/institute/listing");
      const institute = res.data?.data || [];

      const formatted = institute.map((item, index) => ({
        index: index + 1,
        inst_code: item.inst_code,
        inst_name: item.inst_name,
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching institute:", error);
      setData([]);
    }
  };

  const columns = [
    {
      text: "Sr. No.",
      dataField: "index",
      width: "80px",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
    {
      text: "Inst Code",
      dataField: "inst_code",
      thClassName: "text-center",
      tdClassName: "text-center",
      width: "120px",
    },
    {
      text: "Inst Name",
      dataField: "inst_name",
      thClassName: "text-center",
      tdClassName: "text-left",
    },
  ];

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Institute Details</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="justify-content-center mt-5">
        <Row className="mb-4">
          <Col xl={12} lg={12} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Body className="m-2 p-2">
                <CustomTable
                  columns={columns}
                  data={data}
                  totalRecords={data.length}
                  rowsPerPage={rowsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  showPagination={true}
                  showRecordCount={true}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Institute;
