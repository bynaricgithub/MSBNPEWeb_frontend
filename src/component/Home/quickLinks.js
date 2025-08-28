import React from "react";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Quicklinks = () => {
  return (
    <Container>
      <Card className="noticeboardCard border-0">
        <Card.Header className="announcmentHeader">
          <h5 className="my-2 d-xs-none">Quick Links</h5>
        </Card.Header>

        <Card.Body className="mt-1 m-0 p-2">
          <ul className="quickLinks">
            <li>
              <Link to="/"> Home</Link>
            </li>
            <li>
              <Link to="/examination"> Examination</Link>
            </li>
            <li>
              <Link to="/affiliiation"> Affiliation</Link>
            </li>
            <li>
              <Link to="/notifications"> Notifications</Link>
            </li>
            <li>
              <Link to="/rti"> RTI</Link>
            </li>
            <li>
              <Link to="/tenders"> Tenders</Link>
            </li>
            <li>
              <Link to="/contact"> Contact Us</Link>
            </li>
            <li>
              <Link to="/links"> Useful Links</Link>
            </li>

            <li>
              <Link to="/faq"> FAQ's</Link>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Quicklinks;
