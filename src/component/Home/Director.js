import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const Directorate = () => {
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Directorate</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-5">
        <Row className="mb-4 justify-content-center">
          <Col xl={7} lg={7} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Body className="mt-1 p-2 text-center">
                <div style={{ position: "relative" }}>
                  <img src="/assets/images/6.jpg" alt="Directorate Image" className="img-fluid img-rounded img-thumbnail" />
                </div>
                <p className="my-2 text-dark">The Director is the head of the Department and is assisted by The Joint Directors</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Directorate;
