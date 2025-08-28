/* eslint-disable react-hooks/exhaustive-deps */
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { handleFileDeleteS3, show, uploadFileInChunks } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageLatestUpdate = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "title" },
    { text: "Link", dataField: "link2" },
    { text: "Order ID", dataField: "order_id" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState();

  const [updateModal, setUpdateModal] = useState(false);
  const [editData, setEditData] = useState();

  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    modal: false,
    data: "",
  });

  useEffect(() => {
    getLatestUpdates();
  }, [updateModal, deleteModal]);

  const FormField = ({ name, heading }) => (
    <div>
      <div className="form-floating mb-3">
        <Field
          id={"floating" + name}
          name={name}
          type="text"
          // value={values[name]}
          className="form-control"
          placeholder={heading}
        />
        <label htmlFor={"floating" + name}>
          <font color="red">* </font>
          {heading}
        </label>
        <ErrorMessage name={name}>{(msg) => <div className="alert alert-danger">{msg}</div>}</ErrorMessage>
      </div>
    </div>
  );

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Latest Update</h3>
      </div>
      <button
        type="button"
        className={"btn rounded-5 btn-success "}
        onClick={(e) => {
          setEditData(false);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Latest Update
      </button>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"latest_update"}
              getData={getLatestUpdates}
            />
          )
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* -------------------------------------------------------- Add/Edit Modal ----------------------------------------------------------- */}
      <Modal show={updateModal} onHide={(e) => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>
            {" "}
            {editData ? "Edit" : "Add Latest Update"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              link: editData?.link || "",
              type: editData ? "URL" : "",
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              setLoading(true);
              if (editData) {
                await updateLatestUpdates(values);
              } else {
                await addLatestUpdates(values);
              }
              setLoading(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="form-floating mb-3">
                  <Field id={"floatingType"} name={"type"} as="select" value={values.type} className="form-control" placeholder={"Type"}>
                    <option value="">Select Type</option>
                    <option value="PDF">PDF</option>
                    <option value="URL">URL</option>
                  </Field>
                  <label htmlFor={"floatingType"}>
                    <font color="red">* </font>Type
                  </label>
                </div>
                <FormField name="title" heading="Title" />
                {values.type == "URL" && <FormField name="link" heading="Link" />}
                <div className="row">
                  {values.type == "PDF" && (
                    <div className="form-floating mb-3">
                      <input
                        id="floatingFile"
                        type="file"
                        accept="application/pdf"
                        className="form-control"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (file) {
                            const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
                            if (!isPdf) {
                              alert("Please upload a valid PDF file.");
                              event.target.value = ""; // Reset the input
                              return;
                            }
                            setFieldValue("link", file);
                          }
                        }}
                      />
                      <label htmlFor={"floatingFile"}>
                        <font color="red">* </font>Select File
                      </label>
                    </div>
                  )}
                  {/* <div className="col-sm-2">
                                {!values.image && <div className="text-center text-secondary">No image selected</div>}
                                {values.image && <img
                                    src={values.image && URL.createObjectURL(values.image)}
                                    alt="selectedImage"
                                    className="p-1"
                                    height={100} />}
                            </div> */}
                </div>
                <hr />
                <div className="text-center py-3">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Loading...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <button type="button" className="btn btn-danger mx-2" disabled={loading} onClick={(e) => setUpdateModal(false)}>
                    Close
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* -------------------------------------------------------- Delete Modal ----------------------------------------------------------- */}
      <Modal
        show={deleteModal.modal}
        centered
        onHide={(e) =>
          setDeleteModal({
            modal: false,
            data: "",
          })
        }
      >
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete ?<br />
          Title : <b>{deleteModal.data?.title}</b>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => {
              deleteLatestUpdates(deleteModal.data);
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) =>
              setDeleteModal({
                modal: false,
                data: "",
              })
            }
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  async function getLatestUpdates() {
    try {
      const res = await API.get("/admin/latest-update/listing");
      let data = res.data;
      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              link2: (
                <a
                  href={item.link.includes("http") ? item.link : process.env.REACT_APP_DATA_SERVER_PATH + item.link}
                  target="_blank"
                  className="text-decoration-none"
                  rel="noreferrer"
                >
                  {item.link}
                </a>
              ),
              actions: (
                <div className="d-flex justify-content-evenly">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning"
                    onClick={(e) => {
                      setEditData(item);
                      setUpdateModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger ms-2"
                    onClick={(e) =>
                      setDeleteModal({
                        modal: true,
                        data: item,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <div className="text-center p-1">
                    <RForm.Check
                      defaultChecked={item.status === 1 ? true : false}
                      type="switch"
                      id="custom-switch"
                      onClick={(e) => {
                        changeStatusLatestUpdates({
                          id: item.id,
                          status: e.target.checked ? 1 : 0,
                        });
                      }}
                    />
                  </div>
                </div>
              ),
            };
          })
      );
      // show({ message: data.message, displayClass: data.status })
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function addLatestUpdates(values) {
    try {
      if (!values.link) {
        show({ message: "Please Select a File or Link.", displayClass: "danger" });
        return null;
      }
      if (values.link instanceof File || values.link instanceof Blob) {
        values.link = await uploadFileInChunks(values.link, "latestUpdate");
        values.link = process.env.REACT_APP_DATA_SERVER_PATH + values.link;
      }

      const res = await API.post("/latest-update/add", values);
      let data = res.data;
      setUpdateModal(false);
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function updateLatestUpdates(values) {
    try {
      if (!values.link) {
        show({ message: "Please Select a File or Link.", displayClass: "danger" });
        return null;
      }
      if (values.link instanceof File || values.link instanceof Blob) {
        values.link = await uploadFileInChunks(values.link, "latestUpdate");
        values.link = process.env.REACT_APP_DATA_SERVER_PATH + values.link;
      }

      const res = await API.put("/latest-update/update", values);
      let data = res.data;
      setUpdateModal(false);
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function deleteLatestUpdates(values) {
    try {
      await handleFileDeleteS3(values.link);

      const res = await API.delete("/latest-update/delete", {
        params: { id: values.id },
      });
      let data = res.data;
      setDeleteModal({
        modal: false,
        data: "",
      });
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function changeStatusLatestUpdates(values) {
    try {
      const res = await API.put("/latest-update/disable", values);
      let data = res.data;
      setDeleteModal({
        modal: false,
        data: "",
      });
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default ManageLatestUpdate;
