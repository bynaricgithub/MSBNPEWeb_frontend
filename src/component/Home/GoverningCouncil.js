import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import CustomTable from "../CommonComponent/CustomTable";

const GoverningCouncil = () => {
  const [data] = useState([
    {
      position: "The Minister of Medical Education, State of Maharashtra",
      role: "President",
    },
    {
      position: "The Minister of State for Medical Education, State of Maharashtra",
      role: "Vice President",
    },
    {
      position:
        "The Secretary or Principal Secretary or Additional Chief Secretary, Medical Education and Drug Department, Government of Maharashtra",
      role: "Member",
    },
    {
      position: "Joint Secretary or Deputy Secretary, Medical Education and Drug Department, Government of Maharashtra",
      role: "Member",
    },
    {
      position: "Director of Medical Education and Research",
      role: "Member",
    },
    {
      position: "Director of Health Services",
      role: "Member",
    },
    {
      position: "Director of Ayurved",
      role: "Member",
    },
    {
      position: "State Nursing Superintendent",
      role: "Member",
    },
    {
      position: "Principal, Government Occupation and Physiotherapy College, Nagpur",
      role: "Member",
    },
    {
      position: "Director of the Board",
      role: "Member Secretary",
    },
  ]);

  const columns = [
    {
      text: "Position",
      dataField: "position",
      thClassName: "text-center",
      tdClassName: "text-left",
    },
    {
      text: "Role",
      dataField: "role",
      thClassName: "text-center",
      tdClassName: "text-center",
    },
  ];
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Governing Council</h1>
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
                  onPageChange={(page) => console.log(page)}
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

export default GoverningCouncil;
