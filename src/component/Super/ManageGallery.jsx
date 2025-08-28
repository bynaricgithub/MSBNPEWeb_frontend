/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "react-bootstrap";
import RForm from "react-bootstrap/Form";
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";
import { handleFileUploadS3, handleFileDeleteS3, show } from "../../utils/Helper";
import useMasterCategory from "../../utils/useMasterCategory";

const ManageGallery = () => {
  const { categories } = useMasterCategory("imageCategories");

  const [rawList, setRawList] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [updateModal, setUpdateModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ modal: false, data: null });

  const headers = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "title" },
    { text: "Category", dataField: "categoryName" },
    { text: "Image", dataField: "image" },
    { text: "Actions", dataField: "actions" },
  ];

  // 1) Fetch rawList on mount (or when you close modals)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/gallery/listing");
        if (res.data.status !== "success" || !Array.isArray(res.data.data)) {
          throw new Error(res.data.message || "Invalid response");
        }
        setRawList(res.data.data);
      } catch (err) {
        show({ message: err.message, displayClass: "failure" });
      } finally {
        setLoading(false);
      }
    })();
  }, [updateModal, deleteModal]);

  // 2) Re‐format + filter whenever rawList, categories or selectedCategory change
  useEffect(() => {
    if (!categories.length) return;

    setLoading(true);

    // loose equality on purpose—value from select is string
    const filtered = selectedCategory ? rawList.filter((item) => String(item.category) === String(selectedCategory)) : rawList;

    // Build map from value→label
    const categoryMap = Object.fromEntries(categories.map((cat) => [String(cat.value), cat.label]));

    const formatted = filtered
      .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0))
      .map((item, i) => ({
        ...item,
        srno: i + 1,
        categoryName: categoryMap[String(item.category)] || "N/A",
        image: <img src={`${process.env.REACT_APP_DATA_SERVER_PATH}${item.image}`} alt={item.title} width={200} />,
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
                id={`switch-${item.id}`}
                onClick={(e) => changeItemStatus({ id: item.id, status: e.target.checked ? 1 : 0 })}
              />
            </div>
          </div>
        ),
      }));

    setList(formatted);
    setLoading(false);
  }, [rawList, categories, selectedCategory]);

  // Dropdown handler
  const onCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // CRUD + toggle helpers
  async function add(values) {
    if (!values.image) {
      show({ message: "Please select an image", displayClass: "failure" });
      return;
    }
    values.image = await handleFileUploadS3(values.image);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));

    try {
      const res = await API.post("/gallery/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (err) {
      show({ message: err.message, displayClass: "failure" });
    }
  }

  async function update(values) {
    if (values.image) {
      await handleFileDeleteS3(editData.image);
      values.image = await handleFileUploadS3(values.image);
    }
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));

    try {
      const res = await API.put("/gallery/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      show({ message: res.data.message, displayClass: res.data.status });
      setUpdateModal(false);
    } catch (err) {
      show({ message: err.message, displayClass: "failure" });
    }
  }

  async function deleteItem(item) {
    try {
      await handleFileDeleteS3(item.image);
      const res = await API.delete("/gallery/delete", { params: { id: item.id } });
      show({ message: res.data.message, displayClass: res.data.status });
      setDeleteModal({ modal: false, data: null });
    } catch (err) {
      show({ message: err.message, displayClass: "failure" });
    }
  }

  async function changeItemStatus({ id, status }) {
    try {
      const res = await API.put("/gallery/disable", { id, status });
      show({ message: res.data.message, displayClass: res.data.status });
    } catch (err) {
      show({ message: err.message, displayClass: "failure" });
    }
  }

  return (
    <div className="px-3">
      <h3 className="text-center p-2">Manage Gallery</h3>

      <button
        className="btn btn-success rounded-5 mb-3"
        onClick={() => {
          setEditData(null);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add New Gallery
      </button>

      <div className="float-end mb-3">
        <select className="form-select" value={selectedCategory} onChange={onCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="depttableSection my-3">
        {loading ? (
          <CustomLoader />
        ) : (
          <CustomReactBootstrapTable
            data={list}
            columns={headers}
            keyField="srno"
            headerClasses="admin-allTable_header"
            sortingTable="gallery"
            noDataIndication={() => <div>No images found.</div>}
          />
        )}
      </div>

      {/* ---------------- Add / Edit Modal ---------------- */}
      <Modal centered size="lg" show={updateModal} onHide={() => setUpdateModal(false)}>
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editData ? "Edit Gallery Item" : "Add Gallery Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              category: editData?.category || "",
              image: null,
            }}
            onSubmit={(values) => (editData ? update(values) : add(values))}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <div className="row">
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <Field name="title" className="form-control" placeholder="Title" />
                      <label>Title</label>
                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-floating mb-3">
                      <Field as="select" name="category" className="form-select">
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </Field>
                      <label>Category</label>
                      <ErrorMessage name="category" component="div" className="text-danger" />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFieldValue("image", e.currentTarget.files[0])}
                      />
                      <label>Upload Image</label>
                      <ErrorMessage name="image" component="div" className="text-danger" />
                    </div>
                  </div>

                  {values.image && (
                    <div className="col-12 text-center mb-3">
                      <img src={URL.createObjectURL(values.image)} alt="preview" width={150} />
                    </div>
                  )}
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

      {/* ---------------- Delete Modal ---------------- */}
      <Modal centered show={deleteModal.modal} onHide={() => setDeleteModal({ modal: false, data: null })}>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deleteModal.data?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={() => deleteItem(deleteModal.data)}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={() => setDeleteModal({ modal: false, data: null })}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageGallery;
