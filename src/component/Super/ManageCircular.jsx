/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowUpRightFromSquare, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { circularTypes, handleFileDeleteS3, handleFileUploadS3, show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";
import useMasterCategory from "../../utils/useMasterCategory";

const ManageCircular = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Date", dataField: "date" },
    { text: "Last Date", dataField: "last_date", type: "date" },
    { text: "Title", dataField: "title" },
    { text: "Department", dataField: "dept" },
    { text: "Institution or Organization", dataField: "inst" },
    { text: "Type", dataField: "type2" },
    { text: "PDF", dataField: "link2" },
    { text: "Order ID", dataField: "order_id" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState();
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [updateModal, setUpdateModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    modal: false,
    data: "",
  });
  const { categories: types } = useMasterCategory("circularTypes");

  const FormField = ({ name, heading, values }) => (
    <div>
      <div className="form-floating mb-3">
        <Field
          id={"floating" + name}
          name={name}
          type="text"
          // value={values[name]}
          className="form-control"
          placeholder={name}
        />
        <label htmlFor={"floating" + name}>{heading}</label>
        <ErrorMessage name={name}>{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
      </div>
    </div>
  );

  useEffect(() => {
    getList();
  }, [updateModal, deleteModal]);

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Pages</h3>
      </div>
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className={"btn rounded-5 btn-success"}
          onClick={(e) => {
            setEditData(false);
            setUpdateModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Tab Data
        </button>
        <div className="float-end">
          <select className="form-select" onChange={(e) => setFilter(e.target.value)}>
            <option value="">Filter</option>
            {types.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list.filter((item) => !filter || item.type == filter)}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"circulars"}
              getData={getList}
            />
          )
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* -------------------------------------------------------- Add/Edit Modal ----------------------------------------------------------- */}
      <Modal show={updateModal} onHide={(e) => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title> {editData ? "Edit" : "Add Content"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              date: editData?.date || "",
              last_date: editData?.last_date || "",
              dept: editData?.dept || "",
              inst: editData?.inst || "",
              type: editData?.type || "",
              link: "",
              linkName: "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              if (editData) {
                update({ ...values });
              } else {
                add({ ...values });
              }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <div className="col-sm-12">
                  <div className="form-floating mb-3">
                    <Field id="floatingType" name="type" as="select" value={values.type} className="form-control" placeholder="Type">
                      <option value="" disabled>
                        {" "}
                        Select{" "}
                      </option>
                      {types?.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Field>
                    <label htmlFor="floatingType">Select Type</label>
                  </div>
                </div>
                <FormField name="title" heading="Title" />
                {values.type == 1 && <FormField name="dept" heading="Department" />}
                {["1", "2"].includes(values.type) && (
                  <FormField name="inst" heading={values.type == 1 ? "Institution" : values.type == 2 ? "Organization" : ""} />
                )}
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-floating mb-3">
                      <Field id="floatingDate" name="date" type="date" value={values.date} className="form-control" />
                      <label htmlFor="floatingDate">Select Date</label>
                      <ErrorMessage name="date">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>
                  {values.type == 2 && (
                    <div className="col-sm-6">
                      <div className="form-floating mb-3">
                        <Field id="floatingDate1" name="last_date" type="date" value={values.last_date} className="form-control" />
                        <label htmlFor="floatingDate1">Select Last Date</label>
                        <ErrorMessage name="last_date">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                      </div>
                    </div>
                  )}
                  <div className="col-sm-6">
                    <div className="form-floating mb-3">
                      <Field
                        id="floatingLink"
                        name="linkName"
                        type="file"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("link", e.currentTarget.files[0]);
                        }}
                        value={values.linkName}
                        className="form-control"
                        accept=".pdf"
                      />
                      <label htmlFor="floatingLink">PDF File</label>
                      <ErrorMessage name="link">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>
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
                  <button type="button" className="btn btn-danger mx-2" onClick={(e) => setUpdateModal(false)} disabled={loading}>
                    Cancel
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
              deleteItem(deleteModal.data);
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

  async function getList() {
    try {
      const res = await API.get("/admin/circular/listing");
      let data = res.data;
      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              type2: item.type ? types[item.type - 1]?.label : "",
              link2: (
                <a
                  href={process.env.REACT_APP_DATA_SERVER_PATH + item.link}
                  target="_blank"
                  className="text-decoration-none"
                  rel="noreferrer"
                >
                  Open PDF <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
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
                        changeItemStatus({
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
        message: error?.response?.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function add(values) {
    setLoading(true);
    if (!values.link) {
      show({ message: "Please Select a File.", displayClass: "danger" });
      setLoading(false);
      return null;
    }

    values.link = await handleFileUploadS3(values.link, "circulars");

    delete values.linkName;

    try {
      const res = await API.post("/circular/add", values);
      let data = res.data;
      setUpdateModal(false);
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
    setLoading(false);
  }

  async function update(values) {
    setLoading(true);
    if (values.link) {
      await handleFileDeleteS3(editData.link);
      values.link = await handleFileUploadS3(values.link, "circulars");
    }
    delete values.linkName;

    try {
      const res = await API.put("/circular/update", values);
      let data = res.data;
      setUpdateModal(false);
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
    setLoading(false);
  }

  async function deleteItem(values) {
    try {
      await handleFileDeleteS3(values.link);
      const res = await API.delete("/circular/delete", {
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

  async function changeItemStatus(values) {
    try {
      const res = await API.put("/circular/disable", values);
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

export default ManageCircular;
