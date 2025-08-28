// ManageFileUploads.js

import { faArrowUpRightFromSquare, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { handleFileDeleteS3, handleFileUploadS3, show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageFileUploads = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Date", dataField: "date" },
    { text: "Title", dataField: "title" },
    { text: "PDF", dataField: "link2" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [updateModal, setUpdateModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    modal: false,
    data: "",
  });

  useEffect(() => {
    getList();
  }, [updateModal, deleteModal]);

  const FormField = ({ name, heading }) => (
    <div className="form-floating mb-3">
      <Field name={name} type="text" className="form-control" placeholder={heading} />
      <label htmlFor={name}>{heading}</label>
      <ErrorMessage name={name}>{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
    </div>
  );

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage File Uploads</h3>
      </div>
      <button
        type="button"
        className={"btn rounded-5 btn-success"}
        onClick={() => {
          setEditData(null);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add File
      </button>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"fileuploads"}
              getData={getList}
            />
          )
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={updateModal} onHide={() => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title> {editData ? "Edit File" : "Add File"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              date: editData?.date || "",
              link: "",
              linkName: "",
            }}
            enableReinitialize
            onSubmit={(values) => {
              if (editData) {
                update(values);
              } else {
                add(values);
              }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <FormField name="title" heading="Title" />
                <div className="form-floating mb-3">
                  <Field id="floatingDate" name="date" type="date" className="form-control" />
                  <label htmlFor="floatingDate">Date</label>
                  <ErrorMessage name="date">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                </div>

                <div className="form-floating mb-3">
                  <Field
                    name="linkName"
                    type="file"
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("link", e.currentTarget.files[0]);
                    }}
                    className="form-control"
                    accept=".pdf"
                  />
                  <label>PDF File</label>
                  <ErrorMessage name="link">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                </div>

                <hr />
                <div className="text-center py-3">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </button>
                  <button type="button" className="btn btn-danger mx-2" onClick={() => setUpdateModal(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal.modal} centered onHide={() => setDeleteModal({ modal: false, data: "" })}>
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete?
          <br />
          Title: <b>{deleteModal.data?.title}</b>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-danger" onClick={() => deleteItem(deleteModal.data)}>
            Delete
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setDeleteModal({ modal: false, data: "" })}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  async function getList() {
    try {
      const res = await API.get("/admin/fileuploads/listing");
      const data = res.data;

      setList(
        data?.data?.map((item, i) => ({
          ...item,
          srno: i + 1,
          link2: (
            <a href={process.env.REACT_APP_DATA_SERVER_PATH + item.link} target="_blank" rel="noreferrer">
              Open PDF <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          ),
          actions: (
            <div className="d-flex justify-content-evenly">
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setEditData(item);
                  setUpdateModal(true);
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => setDeleteModal({ modal: true, data: item })}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className="text-center p-1">
                <RForm.Check
                  defaultChecked={item.status === 1}
                  type="switch"
                  id="custom-switch"
                  onClick={(e) =>
                    changeItemStatus({
                      id: item.id,
                      status: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </div>
            </div>
          ),
        }))
      );
    } catch (error) {
      show({
        message: error?.response?.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function add(values) {
    setLoading(true);
    if (!values.link) {
      show({ message: "Please select a PDF file.", displayClass: "danger" });
      setLoading(false);
      return;
    }

    values.link = await handleFileUploadS3(values.link, "fileuploads");
    delete values.linkName;

    try {
      const res = await API.post("/fileuploads/add", values);
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (error) {
      show({
        message: error?.response?.data?.message || error?.response?.message,
        displayClass: "failure",
      });
    }
    setLoading(false);
  }

  async function update(values) {
    setLoading(true);
    if (values.link) {
      await handleFileDeleteS3(editData.link);
      values.link = await handleFileUploadS3(values.link, "fileuploads");
    }

    delete values.linkName;

    try {
      const res = await API.put("/fileuploads/update", values);
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (error) {
      show({
        message: error?.response?.data?.message || error?.response?.message,
        displayClass: "failure",
      });
    }
    setLoading(false);
  }

  async function deleteItem(item) {
    try {
      await handleFileDeleteS3(item.link);
      const res = await API.delete("/fileuploads/delete", { params: { id: item.id } });
      setDeleteModal({ modal: false, data: "" });
      show({ message: res.data.message, displayClass: res.data.status });
    } catch (error) {
      show({
        message: error?.response?.data?.message || error?.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function changeItemStatus(values) {
    try {
      const res = await API.put("/fileuploads/disable", values);
      show({ message: res.data.message, displayClass: res.data.status });
    } catch (error) {
      show({
        message: error?.response?.data?.message || error?.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default ManageFileUploads;
