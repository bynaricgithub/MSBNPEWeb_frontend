import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { feedbackInitialValues } from "./InitialData";
import { feedbackValidationSchema } from "./ValidationSchema";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import API from "../../API";
import { show } from "../../utils/Helper";

async function submitFeedback(values, resetForm, setLoading) {
  setLoading(true);
  try {
    const res = await API.post("/feedback", values);
    resetForm();
    console.log(res.data);
    show({ message: res.data.message, displayClass: res.data.status });
  } catch (error) {
    show({ message: error.response?.data?.message || error.response?.message, displayClass: "failure" });
  } finally {
    setLoading(false);
  }
}

const FeedbackForm = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (values, { resetForm }) => {
    submitFeedback(values, resetForm, setLoading);
  };

  const getFormField = ({ name, heading, placeholder, type = "text", as = "input" }, values) => (
    <div className="col-sm-12 mb-3">
      <label htmlFor={name} className="pb-1">
        <b>{heading}</b>
      </label>
      <Field as={as} type={type} name={name} id={name} className="form-control" placeholder={placeholder} value={values[name]} />
      <ErrorMessage name={name}>{(msg) => <div className="text-danger px-2">{msg}</div>}</ErrorMessage>
    </div>
  );

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Feedback Form</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10} xs={12}>
            <Card className="p-4">
              <CardBody>
                <Formik initialValues={feedbackInitialValues} validationSchema={feedbackValidationSchema} onSubmit={handleSubmit}>
                  {({ values }) => (
                    <Form>
                      <div className="row">
                        {getFormField({ name: "name", heading: "Name :", placeholder: "Enter your name" }, values)}
                        {getFormField({ name: "email", heading: "Email :", type: "email", placeholder: "Enter your email" }, values)}
                        {getFormField({ name: "number", heading: "Phone Number :", placeholder: "Enter your phone no." }, values)}
                        {getFormField({ name: "subject", heading: "Subject :", placeholder: "Enter subject" }, values)}

                        <div className="col-sm-12 mb-3">
                          <label htmlFor="feedback" className="pb-1">
                            <b>Your Feedback :</b>
                          </label>
                          <Field
                            as="textarea"
                            name="feedback"
                            id="feedback"
                            className="form-control"
                            placeholder="Enter Feedback"
                            rows="4"
                          />
                          <ErrorMessage name="feedback">{(msg) => <div className="text-danger px-2">{msg}</div>}</ErrorMessage>
                        </div>
                      </div>
                      <div className="text-center">
                        <hr />
                        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              &nbsp;Loading...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FeedbackForm;
