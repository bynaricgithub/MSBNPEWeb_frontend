/* eslint-disable react-hooks/exhaustive-deps */
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

const ManageNoticeBoard = () => {
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

  const [deleteModal, setDeleteModal] = useState({
    modal: false,
    data: "",
  });

  useEffect(() => {
    getList();
  }, [updateModal, deleteModal]);

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Notice Board</h3>
      </div>
      <button
        type="button"
        className={"btn rounded-5 btn-success"}
        onClick={(e) => {
          setEditData(false);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Notice Board
      </button>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"notice_boards"}
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
          <Modal.Title>
            {" "}
            {editData ? "Edit" : "Add Notice Board"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              link: "",
              linkName: "",
              imageName: "",
              type: "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // values.dept_id = state.id
              // console.log(values);
              if (editData) {
                update({ ...values });
              } else {
                add({ ...values });
              }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                {[
                  { name: "title", heading: "Title" },
                  // { name: "type", heading: "Type" },
                  // { name: "order_id", heading: "Order ID" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="form-floating mb-3">
                      <Field
                        id={"floating" + item.name}
                        name={item.name}
                        type="text"
                        value={values[item.name]}
                        className="form-control"
                        placeholder={item.name}
                      />
                      <label htmlFor={"floating" + item.name}>{item.heading}</label>
                      <ErrorMessage name={item.name}>{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>
                ))}
                <div className="row">
                  <div className="col-sm-12">
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
                  <button type="submit" className="btn btn-primary mx-2">
                    Submit
                  </button>
                  <button type="button" className="btn btn-danger mx-2" onClick={(e) => setUpdateModal(false)}>
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
      const res = await API.get("/admin/notice-board/listing");
      let data = res.data;
      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              // image: <img src={process.env.REACT_APP_SERVER_PATH + item.image} alt={item.title} width={100} />,
              link2: (
                <a
                  href={process.env.REACT_APP_DATA_SERVER_PATH + item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none"
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
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function add(values) {
    if (!values.link) {
      show({ message: "Please Select a File.", displayClass: "danger" });
      return null;
    }

    values.link = await handleFileUploadS3(values.link);

    delete values.linkName;
    let fd = new FormData();

    Object.keys(values).forEach((item) => {
      fd.append(item, values[item]);
    });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const res = await API.post("/notice-board/add", fd, config);
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

  async function update(values) {
    if (values.link) {
      await handleFileDeleteS3(editData.link);
      values.link = await handleFileUploadS3(values.link);
    }
    delete values.linkName;
    let fd = new FormData();

    Object.keys(values).forEach((item) => {
      fd.append(item, values[item]);
    });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    try {
      const res = await API.put("/notice-board/update", fd, config);
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

  async function deleteItem(values) {
    try {
      await handleFileDeleteS3(values.link);
      const res = await API.delete("/notice-board/delete", {
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
      const res = await API.put("/notice-board/disable", values);
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

export default ManageNoticeBoard;
