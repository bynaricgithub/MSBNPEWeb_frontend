import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Table } from "react-bootstrap";
import ContentModal from "../CommonComponent/ContentModal";

const RTI = () => {
  const [modalShow, setModalShow] = useState(false);
  const [contentUrl, setContentUrl] = useState("");

  const openModal = (url) => {
    setContentUrl(url);
    setModalShow(true);
  };

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">RTI</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col lg={12} className="my-4 text-center">
            <Card className="adCardbox">
              <CardBody className="m-3">
                {/* <h2 className="h4">Right to Information Act 2005</h2>
                <hr className="hrbold" />
                <p>
                  As per the Right to Information Act 2005, an RTI Cell has been established at the Office of the Joint Director, Technical
                  Education Department, Chhatrapati Sambhajinagar.
                </p>
                <hr className="hrbold" /> */}

                {/* <h5 className="py-3">RTI Officers Information</h5> */}
                <div className="noticeboardCard border-0 overflow-hidden">
                  <div className="table-responsive">
                    <Table className="pdfTables mb-3">
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>प्रथम अपिलीय अधिकारी</td>
                          <td> प्रबंधक</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>जनमाहिती अधिकारी</td>
                          <td> उपप्रबंधक व लेखाधिकारी</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ContentModal show={modalShow} handleClose={() => setModalShow(false)} content={contentUrl} />
    </>
  );
};

export default RTI;
