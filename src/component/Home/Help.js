import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Form } from "react-bootstrap";
import helpGuideData from "./helpGuideData";

const Help = () => {
  const [selectedGuide, setSelectedGuide] = useState(helpGuideData[0]);

  useEffect(() => {
    setSelectedGuide(helpGuideData[0]);
  }, []);

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col>
              <h1 className="innercommTitle">Online Applications User Guide</h1>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Card className="noticeboardCard border-0 my-4 p-2">
          <Card.Body>
            <Form.Group controlId="faqCategory" className="mb-4">
              <Form.Label>
                <b>Select Online Application for Help</b>
              </Form.Label>
              <Form.Control
                as="select"
                value={selectedGuide.value}
                onChange={(e) => {
                  const selected = helpGuideData.find((item) => item.value === e.target.value);
                  setSelectedGuide(selected);
                }}
              >
                {helpGuideData.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div className="bg-light p-3">
              <h5 className="text-dark">{selectedGuide.label}</h5>
              <p>
                <strong>Date:</strong> {selectedGuide.date}
              </p>
              <p>{selectedGuide.description}</p>
              <p>
                <strong>Links:</strong>{" "}
                <a href={selectedGuide.link.href} target="_blank" rel="noopener noreferrer">
                  {selectedGuide.link.label}
                </a>
              </p>
            </div>
            <hr />

            <Row className="justify-content-center">
              {selectedGuide.steps.map((step, idx) => (
                <Col sm={12} key={idx} className="my-2">
                  <Card className="h-100 adCardbox downlist">
                    <Card.Body>
                      <h6 className="text-danger mb-2">{step.title}</h6>
                      <p className="text-dark mb-0">{step.content}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Help;
