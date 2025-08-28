/* eslint-disable react-hooks/exhaustive-deps */
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import API from "../../API";
import { handleFileDeleteS3, handleFileUploadS3, show } from "../../utils/Helper";

import RForm from "react-bootstrap/Form";
import CustomLoader from "../../utils/CustomLoader";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const Managevideos = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    // { text: "Title", dataField: "title" },
    // { text: "Subtitle", dataField: "subtitle" },
    { text: "Link", dataField: "link2" },
    { text: "Video", dataField: "video" },
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
    <div>
      <div className="text-center py-4">
        <h2>Manage Videos</h2>
      </div>
      <button
        type="button"
        className={"btn rounded-5 btn-success"}
        onClick={(e) => {
          setEditData(false);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Video Gallery
      </button>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable data={list} columns={header} keyField="srno" headerClasses="admin-allTable_header" />
          )
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* -------------------------------------------------------- Add/Edit Modal ----------------------------------------------------------- */}
      <Modal show={updateModal} onHide={(e) => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgBrown text-light">
          <Modal.Title>
            {editData ? "Edit" : "Add Videos"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              // title: editData?.title || "",
              link: "",
              // linkName: "",
              videoName: "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // values.dept_id = state.id
              // console.log(values);
              // if (editData) {
              //     update({ ...values }, editData)
              // } else {
              //     add({ ...values })
              // }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-floating mb-3">
                      <Field
                        id="floatingImage"
                        name="videoName"
                        type="file"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("video", e.currentTarget.files[0]);
                        }}
                        value={values.videoName}
                        className="form-control"
                        placeholder="Video"
                        accept="video/*"
                      />
                      <label htmlFor="floatingImage">Video File</label>
                      <ErrorMessage name="video">{(msg) => <div className="alert">{msg}</div>}</ErrorMessage>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    {!values.video && <div className="text-center text-secondary">No video selected</div>}
                    {values.video && (
                      <video src={values.video && URL.createObjectURL(values.video)} alt="selectedvideo" className="p-2" width={300} />
                    )}
                  </div>
                </div>
                <hr />
                <div className="text-center py-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-danger" onClick={(e) => setUpdateModal(false)}>
            Close
          </button>
        </Modal.Footer>
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
      const res = await API.get("/admin/gallery/listing");
      let data = res.data;
      setList(
        data?.data.map((item, i) => {
          return {
            ...item,
            srno: i + 1,
            video: <video src={item.video} alt={item.title} width={100} />,

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
    if (!values.video) {
      show({ message: "Please Select a File.", displayClass: "danger" });
      return null;
    }
    values.video = await handleFileUploadS3(values.video);

    // delete values.linkName
    delete values.videoName;

    try {
      const res = await API.post("/gallery/add", values);
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
    if (values.video) {
      await handleFileDeleteS3(editData.video);
      values.video = await handleFileUploadS3(values.video);
    }

    try {
      const res = await API.put("/gallery/update", values);
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
      await handleFileDeleteS3(values.video);
      const res = await API.delete("/gallery/delete", {
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
      const res = await API.put("/gallery/disable", values);
      let data = res.data;

      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default Managevideos;
