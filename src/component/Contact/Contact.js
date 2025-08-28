import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import CustomTable from "../CommonComponent/CustomTable";

function Contactus() {
  const contactData = [
    {
      id: 1,
      department: "Registration / Renewal",
      emails: ["registration@mnccouncil.org"],
      phone: "02249183319",
    },
    {
      id: 2,
      department: "General",
      emails: ["general@mnccouncil.org", "mncgeneral2015@gmail.com"],
      phone: "02249183312",
    },
    {
      id: 3,
      department: "Examination / Results",
      emails: ["exam@mnccouncil.org", "mncexam@gmail.com"],
      phone: "02249183313",
    },
    {
      id: 4,
      department: "IT Department",
      emails: ["itsupport@mnccouncil.org"],
      phone: "02249183314",
    },
    {
      id: 5,
      department: "CPD",
      emails: ["cpdsupport@mnccouncil.org"],
      phone: "02249183312",
    },
  ];

  const contactColumns = [
    {
      text: "Person / Department",
      dataField: "department",
      thClassName: "text-start",
      tdClassName: "text-start",
    },
    {
      text: "Email",
      dataField: "emails",
      thClassName: "text-start",
      tdClassName: "text-start",
      customRender: (emails) =>
        emails.map((email, index) => (
          <div key={index}>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        )),
    },
    {
      text: "Contact No",
      dataField: "phone",
      thClassName: "text-start",
      tdClassName: "text-start",
      customRender: (phone) => <a href={`tel:${phone}`}>{phone}</a>,
    },
  ];

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Contact Us</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-5">
        <Row>
          <Col lg={12} md={12} sm={12} className="mb-4">
            <Card className="announcmentCard border-0">
              <Card.Header className="announcmentHeader text-center">Contact Details</Card.Header>

              <Card.Body>
                <Card.Text>
                  <ul className="contact px-3 text-dark font-16">
                    <li>
                      <b>
                        <i className="fa fa-envelope"></i>
                        MAHARASHTRA STATE BOARD OF NURSING AND PARAMEDICAL EDUCATION
                      </b>
                      <br />
                      <p>
                        <b>Directorate of Medical Education & Research,</b>
                        <br />
                        4th Floor, St. George’s Hospital Compound, P. D’Melo Road, Near C.S.M.T., Mumbai – 400 001
                      </p>
                    </li>

                    <li>
                      <b className="pb-1">
                        <i className="fa fa-phone"></i>
                        Tel No. : <a href="tel:022-22611015">022-22611015</a>
                      </b>
                      <br />
                      <b className="pb-1">
                        <i className="fa fa-envelope"></i>
                        Email. : <a href="mailto:msbnpe@gmail.com">msbnpe@gmail.com</a>
                      </b>
                      <br />
                      <b className="pb-1">
                        <i className="fa fa-envelope"></i>
                        For Exam Related : <a href="mailto:exam.msbnpe@gmail.com">exam.msbnpe@gmail.com</a>
                      </b>

                      <br />
                      <b className="pb-1">
                        <i className="fa fa-phone"></i>
                        Help Line for MahaDBT and Office Related : <a href="tel:8652281026">8652281026</a>
                      </b>
                      <br />

                      <b className="pb-1">
                        <i className="fa fa-phone"></i>
                        For Technical Support : <a href="tel:8976279931">8976279931</a>
                      </b>
                    </li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} md={12} sm={12} className="mb-4">
            <Card className="announcmentCard border-0">
              <Card.Body>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.815537156226!2d72.83586180622795!3d18.939557323629973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1f4aa222545%3A0xc5ea2c53dfda7bf2!2sMaharashtra%20State%20Board%20of%20Nursing%20and%20Paramedical%20Education%20Mumbai!5e0!3m2!1sen!2sus!4v1756357281547!5m2!1sen!2sus"
                  height="350px"
                  width="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Card.Body>
            </Card>
          </Col>

          {/* <Col lg={12} md={12} sm={12} className="mb-5">
            <Card className="announcmentCard border-0">
              <Card.Body>
                <CustomTable
                  columns={contactColumns}
                  data={contactData}
                  totalRecords={contactData.length}
                  rowsPerPage={10}
                  currentPage={1}
                  onPageChange={() => {}}
                  showPagination={false}
                  showRecordCount={false}
                />
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
}

export default Contactus;
