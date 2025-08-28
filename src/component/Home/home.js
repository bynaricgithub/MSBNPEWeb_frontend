// Home.js
import React from "react";
import { Col, Row } from "react-bootstrap";
import Slider from "./slider";
import Mainphotosection from "./mainphotosection";
import TabBox from "./tabBox";
import Quicklinks from "./quickLinks";
const Home = () => {
  return (
    <>
      <div className="pb-4">
        <div className="container ">
          <Row className="align-item-center mb-4">
            <Col xl={12} lg={12} md={12} sm={12}>
              <Mainphotosection />
            </Col>
          </Row>

          <Row className="align-item-center mb-4">
            <Col xl={12} lg={12} md={12} sm={12}>
              <Slider />
            </Col>
          </Row>
        </div>
      </div>
      <div className="py-5 bg-white">
        <div className="container">
          <Row>
            <Col xl={4} lg={4} sm={5} xs={12} className="align-items-center">
              <Quicklinks />
            </Col>
            <Col xl={8} lg={8} md={7} sm={12} className="spTable">
              <TabBox />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
