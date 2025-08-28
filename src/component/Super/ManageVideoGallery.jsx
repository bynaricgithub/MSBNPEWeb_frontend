import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import RForm from "react-bootstrap/Form";

import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";
import { show } from "../../utils/Helper";
import useMasterCategory from "../../utils/useMasterCategory";

const ManageVideoGallery = () => {
  const [rawList, setRawList] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ modal: false, data: null });

  const { categories } = useMasterCategory("videoCategories");

  // — your fetch of rawList —
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await API.get("/video-gallery/listing");
        setRawList(res.data.data || []);
      } catch (err) {
        show({ message: err.message || "Failed to load videos", displayClass: "failure" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // — map + filter into `list` whenever dependencies change —
  useEffect(() => {
    if (!categories.length) return;

    setLoading(true);
    const filtered = selectedCategory ? rawList.filter((item) => String(item.category) === String(selectedCategory)) : rawList;

    const categoryMap = Object.fromEntries(categories.map((cat) => [String(cat.value), cat.label]));

    const formatted = filtered.map((item, i) => ({
      ...item,
      srno: i + 1,
      categoryName: categoryMap[String(item.category)] || "N/A",
      file: (
        <iframe width="200" height="120" src={item.file.replace("watch?v=", "embed/")} title={item.title} frameBorder="0" allowFullScreen />
      ),
      actions: (
        <div className="d-flex gap-2 justify-content-center">
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
              onClick={(e) => changeItemStatus({ id: item.id, status: e.target.checked ? 1 : 0 })}
            />
          </div>
        </div>
      ),
    }));

    setList(formatted);
    setLoading(false);
  }, [rawList, categories, selectedCategory, updateModal, deleteModal]);

  // — handler for your dropdown —
  const onCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // — your CRUD functions —
  async function add(values, setSubmitting) {
    try {
      const res = await API.post("/video-gallery/add", values);
      setSubmitting(false);
      setUpdateModal(false);
      show({ message: res.data.message, displayClass: res.data.status });
      // refresh
      const fresh = await API.get("/video-gallery/listing");
      setRawList(fresh.data.data || []);
    } catch (error) {
      setSubmitting(false);
      show({ message: error.message || "Failed to add", displayClass: "failure" });
    }
  }

  async function update(values, setSubmitting) {
    try {
      const res = await API.put("/video-gallery/update", values);
      setSubmitting(false);
      setUpdateModal(false);
      show({ message: res.data.message, displayClass: res.data.status });
      const fresh = await API.get("/video-gallery/listing");
      setRawList(fresh.data.data || []);
    } catch (error) {
      setSubmitting(false);
      show({ message: error.message || "Failed to update", displayClass: "failure" });
    }
  }

  async function deleteItem(values) {
    try {
      const res = await API.delete("/video-gallery/delete", { params: { id: values.id } });
      setDeleteModal({ modal: false, data: null });
      show({ message: res.data.message, displayClass: res.data.status });
      const fresh = await API.get("/video-gallery/listing");
      setRawList(fresh.data.data || []);
    } catch (error) {
      show({ message: error.message || "Delete failed", displayClass: "failure" });
    }
  }

  // ← **here** is your missing definition!
  async function changeItemStatus({ id, status }) {
    try {
      const res = await API.put("/video-gallery/disable", { id, status });
      show({ message: res.data.message, displayClass: res.data.status });
      // optionally refresh
      const fresh = await API.get("/video-gallery/listing");
      setRawList(fresh.data.data || []);
    } catch (error) {
      show({
        message: error.response?.data?.message || error.message,
        displayClass: "failure",
      });
    }
  }

  const headers = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "title" },
    { text: "Video", dataField: "file" },
    { text: "Category", dataField: "categoryName" },
    { text: "Actions", dataField: "actions" },
  ];

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Video Gallery</h3>
      </div>

      <button
        className="btn rounded-5 btn-success mb-3"
        onClick={() => {
          setEditData(null);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Video
      </button>

      <div className="mb-3 float-end">
        <select id="categoryFilter" className="form-select" value={selectedCategory} onChange={onCategoryChange}>
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
            noDataIndication={() => <div>No videos found.</div>}
          />
        )}
      </div>

      {/* Add/Edit and Delete Modals*/}
      <Modal show={updateModal} onHide={() => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editData ? "Edit" : "Add"} Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              category: editData?.category || "",
              file: editData?.file || "",
            }}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              if (editData) update(values, setSubmitting);
              else add(values, setSubmitting);
            }}
          >
            {({ isValid, dirty, isSubmitting }) => (
              <Form>
                <div className="row">
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <Field name="title" type="text" className="form-control" />
                      <label htmlFor="title">Title</label>

                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <Field name="file" type="text" className="form-control" />
                      <label htmlFor="file">YouTube URL</label>

                      <ErrorMessage name="file" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating mb-3">
                      <Field as="select" name="category" className="form-select">
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </Field>
                      <label htmlFor="category">Category</label>
                      <ErrorMessage name="category" component="div" className="text-danger" />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary" disabled={!isValid || !dirty || isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setUpdateModal(false)} disabled={isSubmitting}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal.modal} onHide={() => setDeleteModal({ modal: false, data: null })} centered>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete video: <strong>{deleteModal.data?.title}</strong>?
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

export default ManageVideoGallery;
