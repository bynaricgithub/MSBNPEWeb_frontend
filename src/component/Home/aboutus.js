import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
const Aboutus = () => {
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">About Us</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="justify-content-center mt-5">
        <Row className="mb-4">
          <Col xl={6} lg={6} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Header className="announcmentHeader">
                <h5 className="my-2 d-xs-none">Vision</h5>
              </Card.Header>

              <Card.Body className="mt-1 m-0 p-2">
                <p className="p-2 text-dark">
                  Maharashtra Nursing Council is dedicated to safe guard the health of the society at large by public interest by regulating
                  the nursing profession by registration, providing highest standard of Nursing and Midwifery education and practice in the
                  state of Maharashtra & Goa State.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Header className="announcmentHeader">
                <h5 className="my-2 d-xs-none">Mission</h5>
              </Card.Header>

              <Card.Body className="mt-1 m-0 p-2">
                <p className="p-2 text-dark">
                  Our Mission is to prepare safe competent, compassionate nursing professionals for life long learning, evidence based
                  practice, autonomous administration and social commitment.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={12} lg={12} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Header className="announcmentHeader">
                <h5 className="my-2 d-xs-none">Office Bearers</h5>
              </Card.Header>

              <Card.Body className="mt-1 m-0 p-4">
                <h5 className="text-dark mb-2 font-18">Hon. President </h5>
                <p className="text-dark mb-2 ">Dr. Ramling B. Mali</p>
                <h5 className="text-dark mb-2 font-18">I/c Registrar </h5>
                <p className="text-dark mb-2 ">Smt. Archana M. Badhe </p>
                <br />
                <h6 className="font-16">
                  <a href="/assets/pdf/ExpresidentandExregistrar.pdf" target="_blank">
                    Ex-Presidents &amp; Registrars
                  </a>
                </h6>
                <h6 className="font-16">
                  <a href="/assets/pdf/ExpresidentandExregistrar.pdf" target="_blank">
                    Ex-Presidents &amp; Registrars
                  </a>
                </h6>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Aboutus;
