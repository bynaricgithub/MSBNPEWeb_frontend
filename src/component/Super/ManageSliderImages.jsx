/* eslint-disable react-hooks/exhaustive-deps */
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { handleFileDeleteS3, handleFileUploadS3, show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageSliderImages = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "header" },
    { text: "Image", dataField: "imgPreview" },
    { text: "AlterNate Name", dataField: "alternate_name" },
    // { text: "Sub Header", dataField: "subHeader" },
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
    getSliderImages();
  }, [updateModal, deleteModal]);

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Slider Images</h3>
      </div>
      <button
        type="button"
        className={"btn rounded-5 btn-success "}
        onClick={(e) => {
          setEditData(false);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Slider Image
      </button>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"home_page_slider"}
              getData={getSliderImages}
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
            {editData ? "Edit" : "Add Slider Image"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              alternate_name: editData?.alternate_name || "",
              order_id: editData?.order_id || "",
              imageName: editData?.imageName || "",
              // subHeader: editData?.subHeader || "",
              header: editData?.header || "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // values.dept_id = state.id
              // console.log(values);
              if (editData) {
                updateSliderImages({ ...values, oldImage: editData?.image });
              } else {
                addSliderImage({ ...values });
              }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <div className="row">
                  {[
                    { name: "header", heading: "Title" },
                    { name: "alternate_name", heading: "Alternate Name" },
                  ].map((item, i) => (
                    <div key={i} className="col-12">
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
                  <div className="col-sm-12">
                    <div className="form-floating mb-3">
                      <Field
                        id="floatingImage"
                        name="imageName"
                        type="file"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("image", e.currentTarget.files[0]);
                        }}
                        value={values.imageName}
                        className="form-control "
                        placeholder="Image"
                        accept="image/*"
                      />
                      <label htmlFor="floatingImage">Image</label>
                      <ErrorMessage name="image">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>
                  {!values.image && (
                    <div className="col-sm-12">
                      <div className="text-center text-secondary">No image selected</div>
                    </div>
                  )}
                  {values.image && (
                    <div className="col-sm-6 overflow-scroll">
                      <img src={values.image && URL.createObjectURL(values.image)} alt="selectedImage" className="p-1 " height={200} />
                    </div>
                  )}
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
          Alternate Name : <b>{deleteModal.data?.title}</b>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => {
              deleteSliderImages(deleteModal.data);
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

  async function getSliderImages() {
    try {
      const res = await API.get("/admin/slider-images/listing");
      let data = res.data;
      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              imgPreview: (
                <img src={process.env.REACT_APP_DATA_SERVER_PATH + item.image} alt={item.alternate_name} style={{ width: "20%" }} />
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
                        changeSliderImageStatus({
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

  async function addSliderImage(values) {
    if (!values.image) {
      show({ message: "Please Select an Image.", displayClass: "danger" });
      return false;
    }
    delete values.imageName;
    const imageURL = await handleFileUploadS3(values.image);
    values.image = imageURL;

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
      const res = await API.post("/slider-images/add", fd, config);
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

  async function updateSliderImages(values) {
    if (values.image) {
      const newImageURL = await handleFileUploadS3(values.image);
      values.image = newImageURL;
    }
    //----------delete old file from S3 Bucket ----------------
    // await handleFileDeleteS3(values.oldImage);

    //----------upload new file to S3 Bucket ----------------

    // delete values.imageName

    try {
      const res = await API.put("/slider-images/update", values);
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

  async function deleteSliderImages(values) {
    try {
      await handleFileDeleteS3(values.image);

      const res = await API.delete("/slider-images/delete", {
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

  async function changeSliderImageStatus(values) {
    try {
      const res = await API.post("/slider-images/disable", values);
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

export default ManageSliderImages;
