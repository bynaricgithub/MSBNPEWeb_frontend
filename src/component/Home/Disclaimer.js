import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
const Disclaimer = () => {
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Disclaimer</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="justify-content-center mt-5">
        <Row className="mb-4">
          <Col xl={12} lg={12} sm={12} className="mb-4">
            <Card className="noticeboardCard border-0">
              <Card.Body className="mt-1 m-0 p-4">
                <p className="p-2 text-dark">
                  All information provided in official website of Maharashtra Nursing Council is provided for information purposes only and
                  does not constitute a legal contract between the Organization and any person or entity unless otherwise specified.
                  Information on official Organization web sites is subject to change without prior notice. Although every reasonable effort
                  is made to present current and accurate information, the Maharashtra Nursing Council makes no guarantees of any kind.
                  <br />
                  <br />
                  The Maharashtra Nursing Council website may contain information that is created and maintained by a variety of sources
                  both internal and external to the Organization. These sites are un-moderated forums containing the personal opinions and
                  other expressions of the persons who post the entries. In no event shall Maharashtra Nursing Council be responsible or
                  liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of
                  or reliance on any such content, goods, or services available on or through any such site or resource.
                  <br />
                  <br />
                  Any links to external Websites and/or Maharashtra Nursing Council information provided on Organizations web pages or
                  returned from Web search engines are provided as a courtesy. They should not be construed as an endorsement by Maharashtra
                  Nursing Council of the content or views of the linked materials.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Disclaimer;
