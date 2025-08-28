import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { feedbackInitialValues } from "./InitialData";
import { feedbackValidationSchema } from "./ValidationSchema";
import API from "../../API";
import { show } from "../../utils/Helper";
import { Link } from "react-router-dom";

const FeedbackCard = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const res = await API.post("/feedback", values);
      show({ message: res.data.message, displayClass: res.data.status });
      resetForm();
    } catch (error) {
      show({
        message: error.response?.data?.message || error.response?.message || "Submission failed",
        displayClass: "failure",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="feedback-card" className="card">
      <div className="login-title card-title">
        <h4 className="text-center">Feedback Form</h4>
      </div>
      <div className="card-body">
        <Formik initialValues={feedbackInitialValues} validationSchema={feedbackValidationSchema} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <div className="form-group mb-0">
                <label>Name</label>
                <Field type="text" name="name" className="form-control" placeholder="Enter your Name here" />
                <ErrorMessage name="name" component="div" className="text-danger small m-0 p-0" />
              </div>
              <div className="form-group mb-0">
                <label>Mail Id</label>
                <Field type="email" name="email" className="form-control" placeholder="Enter your Mail Id" />
                <ErrorMessage name="email" component="div" className="text-danger small m-0 p-0" />
              </div>
              <div className="form-group mb-0">
                <label>Phone Number</label>
                <Field type="text" name="number" className="form-control" placeholder="Enter your Phone Number" />
                <ErrorMessage name="number" component="div" className="text-danger small m-0 p-0" />
              </div>
              <div className="form-group mb-0">
                <label>Message</label>
                <Field as="textarea" name="feedback" className="form-control" rows="3" placeholder="Type your message here" />
                <ErrorMessage name="feedback" component="div" className="text-danger small m-0 p-0" />
              </div>

              <Field type="hidden" name="subject" value="General" />

              <div className="text-center my-3">
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      &nbsp;Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="socialLink justify-content-center d-flex gap-2 pb-3">
        <Link to="https://www.facebook.com/" target="_blank" rel="noreferrer">
          <img src="/assets/images/facebook.svg" alt="Facebook" />
        </Link>
        <Link to="https://x.com/" target="_blank" rel="noreferrer">
          <img src="/assets/images/twitter.svg" alt="Twitter" />
        </Link>
        <Link to="https://www.youtube.com/" target="_blank" rel="noreferrer">
          <img src="/assets/images/youtube.svg" alt="YouTube" />
        </Link>
      </div>
    </div>
  );
};

export default FeedbackCard;
