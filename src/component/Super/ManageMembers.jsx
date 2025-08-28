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
import useMasterCategory from "../../utils/useMasterCategory";

const ManageMembers = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "title" },
    { text: "Subtitle", dataField: "subtitle" },
    { text: "Image", dataField: "image" },
    { text: "Type", dataField: "typeName" },
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
  const { categories } = useMasterCategory("membersTypes");

  useEffect(() => {
    if (categories.length) {
      fetchData();
    }
  }, [categories, updateModal, deleteModal]);

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Members</h3>
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
          <FontAwesomeIcon icon={faPlus} /> Add Member
        </button>
      </div>
      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              sortingTable={"members"}
              getData={fetchData}
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
            {editData ? "Edit" : "Add Member"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              subtitle: editData?.subtitle || "",
              imageName: "",
              image: "",
              type: editData?.type || "",
              // link: "",
              // linkName: "",
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // values.dept_id = state.id
              // console.log(values);
              if (editData) {
                update({ ...values }, editData);
              } else {
                add({ ...values });
              }
            }}
          >
            {({ values, handleChange, setFieldValue, isValid, dirty }) => (
              <Form>
                <div className="row">
                  {[
                    { name: "title", heading: "Title" },
                    { name: "subtitle", heading: "Subtitle" },
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
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <Field as="select" name="type" className="form-select" value={values.type} onChange={handleChange}>
                        <option value="">Select Type</option>
                        {categories.map((t, i) => (
                          <option value={t.value} key={t.value}>
                            {i + 1}. {t.label}
                          </option>
                        ))}
                      </Field>
                      <label htmlFor="type">Type</label>
                      <ErrorMessage name="type">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>

                  {/* <div className="col-sm-12">
                                <div className="form-floating mb-3">
                                    <Field
                                        id="floatingLink"
                                        name="linkName"
                                        type="file"
                                        onChange={(e) => {
                                            handleChange(e)
                                            setFieldValue("link", e.currentTarget.files[0])
                                        }}
                                        value={values.linkName}
                                        className="form-control"
                                        placeholder="Image"
                                        accept=".pdf"
                                    />
                                    <label htmlFor="floatingLink">PDF File</label>
                                    <ErrorMessage name="link">
                                        {(msg) => (<span className="text-danger font-12">{msg}</span>)}
                                    </ErrorMessage>
                                </div>
                            </div> */}
                  {/* <div className="col-sm-2">
                                {!values.image && <div className="text-center text-secondary">No image selected</div>}
                                {values.image && <img
                                    src={values.image && URL.createObjectURL(values.image)}
                                    alt="selectedImage"
                                    className="p-1"
                                    height={100} />}
                            </div> */}

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
                        className="form-control"
                        placeholder="Image"
                        accept="image/*"
                      />
                      <label htmlFor="floatingImage">Image File</label>
                      <ErrorMessage name="image">{(msg) => <span className="text-danger font-12">{msg}</span>}</ErrorMessage>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    {!values.image && <div className="text-center text-secondary">No image selected</div>}
                    {values.image && (
                      <img
                        src={values.image && URL.createObjectURL(values.image)}
                        alt="selectedImage"
                        className="p-1 img-fluid"
                        height={100}
                      />
                    )}
                  </div>
                </div>
                <hr />
                <div className="text-center py-3">
                  <button type="submit" className="mx-2 btn btn-primary" disabled={!isValid || !dirty}>
                    Submit
                  </button>
                  <button type="button" className="mx-2 btn btn-danger" onClick={(e) => setUpdateModal(false)}>
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

  async function fetchData() {
    try {
      const res = await API.get("/admin/members/listing");
      let data = res.data;
      const categoryMap = Object.fromEntries(categories.map((cat) => [String(cat.value), cat.label]));

      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              typeName: categoryMap[String(item.type)] || "N/A",
              image: <img src={process.env.REACT_APP_DATA_SERVER_PATH + item.image} alt={item.title} width={100} />,
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
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function add(values) {
    if (!values.image) {
      show({ message: "Please Select a File.", displayClass: "danger" });
      return null;
    }
    values.image = await handleFileUploadS3(values.image);
    // values.link = await handleFileUploadS3(values.link)

    // delete values.linkName
    delete values.imageName;

    try {
      const res = await API.post("/members/add", values);
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
    if (values.image) {
      await handleFileDeleteS3(editData.image);
      values.image = await handleFileUploadS3(values.image);
    }
    // if (values.link) {
    //     await handleFileDeleteS3(editData.link)
    //     values.link = await handleFileUploadS3(values.link)
    // }

    delete values.linkName;
    delete values.imageName;

    try {
      const res = await API.put("/members/update", values);
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
      await handleFileDeleteS3(values.image);
      const res = await API.delete("/members/delete", {
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
      const res = await API.put("/members/disable", values);
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

export default ManageMembers;
