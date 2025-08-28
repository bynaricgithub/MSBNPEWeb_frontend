import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Form, Spinner } from "react-bootstrap";
import API from "../../API";
import { show } from "../../utils/Helper";
import moment from "moment";

const FAQ = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("");
  const [data, setData] = useState([]);
  const [latestUpdatedAt, setLatestUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryValue) {
      getFAQs(selectedCategoryValue);
    }
  }, [selectedCategoryValue]);

  async function getCategories() {
    try {
      const res = await API.get("/master-categories/listing");
      const faqCats = res.data?.data?.faqCategories || [];

      setCategories(faqCats);
      if (faqCats.length > 0) {
        setSelectedCategoryValue(faqCats[0].value);
        setSelectedCategoryLabel(faqCats[0].label);
      }
    } catch (err) {
      show({
        message: err.response?.data?.message || err.message || "Failed to load categories.",
        displayClass: "failure",
      });
    }
  }

  async function getFAQs(categoryId) {
    setLoading(true);
    try {
      const res = await API.get(`/faq/listing?category=${categoryId}`);
      const result = res.data?.data || [];
      setData(Array.isArray(result) ? result : []);

      if (result.length > 0) {
        const latest = result.map((item) => new Date(item.updated_at)).reduce((a, b) => (a > b ? a : b));
        setLatestUpdatedAt(moment(latest).format("DD-MMM-YYYY"));
      } else {
        setLatestUpdatedAt(null);
      }
    } catch (err) {
      show({
        message: err.response?.data?.message || err.message || "Failed to load FAQs.",
        displayClass: "failure",
      });
      setData([]);
      setLatestUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">FAQ's - Frequently Asked Questions</h1>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Card className="noticeboardCard border-0 my-4 p-2">
          <Card.Body>
            <Form.Group controlId="faqCategory" className="mb-4">
              <Form.Label>
                <b>Select FAQ Category</b>
              </Form.Label>
              <Form.Control
                as="select"
                value={selectedCategoryValue || ""}
                onChange={(e) => {
                  const selected = categories.find((c) => c.value == e.target.value);
                  setSelectedCategoryValue(e.target.value);
                  setSelectedCategoryLabel(selected?.label || "");
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div className="mb-2">
              <h5 className="text-dark">{selectedCategoryLabel}</h5>
              {latestUpdatedAt && (
                <p>
                  <strong>Last Updated:</strong> {latestUpdatedAt}
                </p>
              )}
              <p>
                Following are the questions that are generally asked by candidates regarding <strong>{selectedCategoryLabel}</strong>.
              </p>
              <hr />
            </div>

            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="faq-grid">
                <Row className="justify-content-center">
                  {data.length === 0 ? (
                    <Col className="text-center">
                      <p>No FAQs found for "{selectedCategoryLabel}"</p>
                    </Col>
                  ) : (
                    data.map((item, i) => (
                      <Col sm={12} key={i} className="my-1">
                        <Card className="h-100 adCardbox downlist">
                          <Card.Body>
                            <h6 className="text-danger mb-2">
                              <i className="fa fa-question-circle me-2"></i>
                              {item.question}
                            </h6>
                            <p className="text-dark mb-2">
                              <strong>Answer:</strong> <br />
                              {item.answer}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default FAQ;
