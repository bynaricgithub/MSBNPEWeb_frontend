import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageInstitute = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Inst Code", dataField: "inst_code" },
    { text: "Inst Name", dataField: "inst_name" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [editData, setEditData] = useState();
  const [deleteModal, setDeleteModal] = useState({ modal: false, data: "" });

  useEffect(() => {
    getList();
  }, [updateModal, deleteModal]);

  const initialValues = {
    id: editData?.id || "",
    inst_code: editData?.inst_code || "",
    inst_name: editData?.inst_name || "",
  };

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage institute</h3>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn rounded-5 btn-success"
          onClick={() => {
            setEditData(null);
            setUpdateModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Institute
        </button>
      </div>

      <div className="depttableSection my-3">
        {list.length > 0 ? (
          <CustomReactBootstrapTable
            data={list}
            columns={header}
            keyField="srno"
            headerClasses="admin-allTable_header"
            sortingTable="institute"
            getData={getList}
          />
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* --------------------- Add/Edit Modal --------------------- */}
      <Modal show={updateModal} onHide={() => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editData ? "Edit Institute" : "Add Institute"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values) => {
              editData ? update(values) : add(values);
            }}
          >
            {({ values, handleChange, isValid, dirty }) => (
              <Form>
                <div className="row">
                  {["inst_code", "inst_name"].map((field, i) => (
                    <div className="col-md-12" key={i}>
                      <div className="form-floating mb-3">
                        <Field name={field} className="form-control" placeholder={field} />
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <ErrorMessage name={field}>{(msg) => <div className="text-danger font-12">{msg}</div>}</ErrorMessage>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center py-3">
                  <button className="btn btn-primary mx-2" type="submit" disabled={!isValid || !dirty}>
                    Submit
                  </button>
                  <button className="btn btn-danger mx-2" onClick={() => setUpdateModal(false)} type="button">
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* --------------------- Delete Modal --------------------- */}
      <Modal show={deleteModal.modal} centered onHide={() => setDeleteModal({ modal: false, data: "" })}>
        <Modal.Header>
          <Modal.Title>Delete Institute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{deleteModal.data?.inst_code}</b>?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={() => deleteItem(deleteModal.data)}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={() => setDeleteModal({ modal: false, data: "" })}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  async function getList() {
    try {
      const res = await API.get("/admin/institute/listing");
      const data = res.data?.data || [];
      setList(
        data.map((item, index) => ({
          ...item,
          srno: index + 1,
          actions: (
            <div className="d-flex justify-content-evenly">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setEditData(item);
                  setUpdateModal(true);
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button className="btn btn-sm btn-danger ms-2" onClick={() => setDeleteModal({ modal: true, data: item })}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className="text-center p-1">
                <RForm.Check
                  defaultChecked={item.status === 1}
                  type="switch"
                  onClick={(e) => toggleStatus({ id: item.id, status: e.target.checked ? 1 : 0 })}
                />
              </div>
            </div>
          ),
        }))
      );
    } catch (error) {
      show({ message: error.response?.data?.message || "Error fetching data", displayClass: "failure" });
    }
  }

  async function add(values) {
    try {
      const res = await API.post("/institute/add", values);
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (error) {
      show({ message: error.response?.data?.message || "Add failed", displayClass: "failure" });
    }
  }

  async function update(values) {
    try {
      const res = await API.put("/institute/update", values);
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (error) {
      show({ message: error.response?.data?.message || "Update failed", displayClass: "failure" });
    }
  }

  async function deleteItem(item) {
    try {
      const res = await API.delete("/institute/delete", { params: { id: item.id } });
      show({ message: res.data.message, displayClass: res.data.status });
      setDeleteModal({ modal: false, data: "" });
    } catch (error) {
      show({ message: error.response?.data?.message || "Delete failed", displayClass: "failure" });
    }
  }

  async function toggleStatus(values) {
    try {
      const res = await API.put("/institute/disable", values);
      show({ message: res.data.message, displayClass: res.data.status });
    } catch (error) {
      show({ message: error.response?.data?.message || "Status update failed", displayClass: "failure" });
    }
  }
};

export default ManageInstitute;
