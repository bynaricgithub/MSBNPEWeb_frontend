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
import useMasterCategory from "../../utils/useMasterCategory";

const ManageFAQ = () => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ modal: false, data: "" });
  const { categories } = useMasterCategory("faqCategories");

  useEffect(() => {
    if (categories.length) {
      fetchData();
    }
  }, [categories, updateModal, deleteModal]);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/faq/listing");
      const data = res.data?.data || [];
      const categoryMap = Object.fromEntries(categories.map((cat) => [String(cat.value), cat.label]));
      setList(
        data.map((item, i) => ({
          ...item,
          srno: i + 1,
          categoryLabel: categoryMap[String(item.faq_category_id)] || "N/A",
          actions: (
            <div className="d-flex gap-2 justify-content-center">
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
                  onClick={(e) => toggleStatus(item.id, e.target.checked ? 1 : 0)}
                />
              </div>
            </div>
          ),
        }))
      );
    } catch (err) {
      show({ message: "Failed to load FAQs", displayClass: "failure" });
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await API.put("/faq/disable", { id, status });
      show({ message: "Status updated", displayClass: "success" });
    } catch {
      show({ message: "Failed to update status", displayClass: "failure" });
    }
  };

  const deleteItem = async (item) => {
    try {
      await API.delete("/faq/delete", { params: { id: item.id } });
      setDeleteModal({ modal: false, data: "" });
      show({ message: "Deleted successfully", displayClass: "success" });
    } catch {
      show({ message: "Failed to delete", displayClass: "failure" });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        await API.put("/faq/update", values);
      } else {
        await API.post("/faq/add", values);
      }
      show({ message: "Saved successfully", displayClass: "success" });
      setUpdateModal(false);
    } catch (err) {
      show({ message: err?.response?.data?.message || "Save failed", displayClass: "failure" });
    }
  };

  const columns = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Category", dataField: "categoryLabel" },
    { text: "Question", dataField: "question" },
    { text: "Answer", dataField: "answer" },
    { text: "Actions", dataField: "actions" },
  ];

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage FAQs</h3>
      </div>

      <button
        className="btn btn-success rounded-5 mb-1"
        onClick={() => {
          setEditData(null);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add FAQ
      </button>

      <div className="depttableSection my-3">
        {list.length > 0 ? (
          <CustomReactBootstrapTable
            data={list}
            columns={columns}
            keyField="srno"
            headerClasses="admin-allTable_header"
            sortingTable="faq"
            getData={fetchData}
          />
        ) : (
          <CustomLoader />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={updateModal} onHide={() => setUpdateModal(false)} centered>
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editData ? "Edit" : "Add"} FAQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              id: editData?.id || "",
              faq_category_id: editData?.faq_category_id || "",
              question: editData?.question || "",
              answer: editData?.answer || "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <div className="form-floating mb-3">
                  <Field
                    as="select"
                    name="faq_category_id"
                    className="form-select"
                    value={String(values.faq_category_id || "")} // <- force string
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={String(cat.value)}>
                        {cat.label}
                      </option>
                    ))}
                  </Field>

                  <label htmlFor="faq_category_id">Category</label>
                  <ErrorMessage name="faq_category_id" component="div" className="text-danger font-12" />
                </div>

                <div className="form-floating mb-3">
                  <Field name="question" className="form-control" placeholder="Question" />
                  <label htmlFor="question">Question</label>
                  <ErrorMessage name="question" component="div" className="text-danger font-12" />
                </div>

                <div className="form-floating mb-3">
                  <Field as="textarea" name="answer" className="form-control" placeholder="Answer" />
                  <label htmlFor="answer">Answer</label>
                  <ErrorMessage name="answer" component="div" className="text-danger font-12" />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary mx-2">
                    Submit
                  </button>
                  <button type="button" className="btn btn-secondary mx-2" onClick={() => setUpdateModal(false)}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal.modal} onHide={() => setDeleteModal({ modal: false, data: "" })} centered>
        <Modal.Header>
          <Modal.Title>Delete FAQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{deleteModal.data?.question}</b>?
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
};

export default ManageFAQ;
