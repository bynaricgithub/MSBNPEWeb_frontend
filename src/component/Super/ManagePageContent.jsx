import { faArrowUpRightFromSquare, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";
import useMasterCategory from "../../utils/useMasterCategory";

const ManagePageContent = () => {
  const safeParse = (jsonOrArray) => {
    if (typeof jsonOrArray === "string") {
      try {
        return JSON.parse(jsonOrArray);
      } catch {
        return [];
      }
    }
    return Array.isArray(jsonOrArray) ? jsonOrArray : [];
  };

  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Date", dataField: "date" },
    { text: "Title", dataField: "title" },
    // { text: "Image", dataField: "imageDisplay" },
    { text: "Main Url", dataField: "mainUrl" },
    { text: "Type", dataField: "typeName" },
    { text: "Description", dataField: "description" },
    { text: "Downloads", dataField: "downloadsDisplay" },
    { text: "Links", dataField: "linksDisplay" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ modal: false, data: "" });

  const { categories } = useMasterCategory("circularTypes");

  useEffect(() => {
    if (categories.length) {
      fetchData();
    }
  }, [categories, updateModal, deleteModal]);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/page-content/listing");
      const data = res.data.data || [];
      const categoryMap = Object.fromEntries(categories.map((cat) => [String(cat.value), cat.label]));

      const mapped = data.map((item, i) => {
        const downloadsArray = safeParse(item.downloads);
        const linksArray = safeParse(item.links);

        return {
          ...item,

          srno: i + 1,
          date: item.date ? item.date.split("T")[0] : "",
          // last_date: item.last_date ? item.last_date.split("T")[0] : "",

          // imageUrl: item.imageUrl || "",
          // imageDisplay: item.imageUrl ? <img src={item.imageUrl} className="img-fluid" style={{ maxHeight: "50px" }} /> : "",

          typeName: categoryMap[String(item.type)] || "N/A",
          downloadsArray,
          linksArray,

          downloadsDisplay: (
            <ul className="mb-0">
              {downloadsArray.map((dl, idx) => (
                <li key={idx}>
                  <a href={dl.link} target="_blank" rel="noreferrer">
                    {dl.title} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                </li>
              ))}
            </ul>
          ),
          linksDisplay: (
            <ul className="mb-0">
              {linksArray.map((lk, idx) => (
                <li key={idx}>
                  <a href={lk.link} target="_blank" rel="noreferrer">
                    {lk.title} <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                </li>
              ))}
            </ul>
          ),

          actions: (
            <div className="d-flex justify-content-evenly">
              <button
                type="button"
                className="btn btn-sm btn-warning me-2"
                onClick={() => {
                  const downloads = safeParse(item.downloads);
                  const links = safeParse(item.links);

                  setEditData({
                    ...item,
                    downloads,
                    links,
                    date: item.date ? item.date.split("T")[0] : "",
                    // last_date: item.last_date ? item.last_date.split("T")[0] : "",
                  });

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
        };
      });

      setList(mapped);
    } catch (err) {
      show({ message: err?.response?.data?.message || "Error fetching data", displayClass: "failure" });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        id: values.id,
        title: values.title,
        type: values.type,
        date: values.date ? new Date(values.date).toISOString().split("T")[0] : "",
        // last_date: values.last_date ? new Date(values.last_date).toISOString().split("T")[0] : "",
        description: values.description,
        note: values.note,
        // imageUrl: values.imageUrl || [],
        mainUrl: values.mainUrl || [],
        downloads: values.downloads || [],
        links: values.links || [],
      };

      if (values.id) {
        await API.put("/page-content/update", payload);
      } else {
        await API.post("/page-content/add", payload);
      }

      show({ message: "Saved successfully", displayClass: "success" });
      setUpdateModal(false);
      await fetchData();
    } catch (err) {
      show({ message: err?.response?.data?.message || "Failed to save", displayClass: "failure" });
    }

    setLoading(false);
  };

  const deleteItem = async (item) => {
    try {
      await API.delete("/page-content/delete", { params: { id: item.id } });
      show({ message: "Deleted successfully", displayClass: "success" });
      setDeleteModal({ modal: false, data: "" });
      fetchData();
    } catch (err) {
      show({ message: "Failed to delete", displayClass: "failure" });
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await API.put("/page-content/disable", { id, status });
      show({ message: "Status updated", displayClass: "success" });
    } catch (err) {
      show({ message: "Error changing status", displayClass: "failure" });
    }
  };

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Page Content</h3>
      </div>
      <button
        className="btn btn-success rounded-5 mb-1"
        onClick={() => {
          setEditData(null);
          setUpdateModal(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Page Content
      </button>

      <div className="float-end">
        <select className="form-select" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          {categories
            .sort((a, b) => a.value - b.value) // Sort categories by their 'value'
            .map((t, i) => (
              <option value={t.value} key={t.value}>
                {i + 1} - {t.label}
              </option>
            ))}
        </select>
      </div>

      {list.length ? (
        <CustomReactBootstrapTable data={list.filter((item) => !filter || item.type == filter)} columns={header} keyField="srno" />
      ) : (
        <CustomLoader />
      )}

      {/* Modal */}
      <Modal show={updateModal} onHide={() => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editData ? "Edit" : "Add"} Page Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              type: editData?.type || "",
              date: editData?.date || "",
              // last_date: editData?.last_date || "",
              description: editData?.description || "",
              note: editData?.note || "",
              // imageUrl: editData?.imageUrl || "",
              mainUrl: editData?.mainUrl || "",
              downloads: Array.isArray(editData?.downloads) ? editData.downloads : [],
              links: Array.isArray(editData?.links) ? editData.links : [],
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Type</label>
                    <Field as="select" name="type" className="form-control">
                      <option value="">Select</option>
                      {categories.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <label>Date</label>
                    <Field type="date" name="date" className="form-control" />
                  </div>
                  <div className="col-md-12">
                    <label>Title</label>
                    <Field name="title" className="form-control" />
                  </div>
                  {/* <div className="col-md-6">
                    <label>Last Date</label>
                    <Field type="date" name="last_date" className="form-control" />
                  </div> */}
                  {/* <div className="col-md-12">
                    <label>Image URL</label>
                    <Field name="imageUrl" className="form-control" placeholder="Enter image URL" />
                  </div> */}

                  <div className="col-md-12">
                    <label>Main URL</label>
                    <Field name="mainUrl" className="form-control" placeholder="Enter Main URL" />
                  </div>

                  <div className="col-md-12">
                    <label>Description</label>
                    <Field as="textarea" name="description" className="form-control" />
                  </div>
                  <div className="col-md-12">
                    <label>Note</label>
                    <Field as="textarea" name="note" className="form-control" />
                  </div>
                  <div className="col-md-12">
                    <label>Downloads</label>
                    <FieldArray name="downloads">
                      {({ push, remove }) => (
                        <div>
                          {values.downloads.map((_, i) => (
                            <div key={i} className="d-flex gap-2 mb-2">
                              <Field name={`downloads.${i}.title`} className="form-control" placeholder="Title" />
                              <Field name={`downloads.${i}.link`} className="form-control" placeholder="Link" />
                              <button type="button" className="btn btn-danger" onClick={() => remove(i)}>
                                X
                              </button>
                            </div>
                          ))}
                          <button type="button" className="btn btn-secondary" onClick={() => push({ title: "", link: "" })}>
                            + Add
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className="col-md-12">
                    <label>Links</label>
                    <FieldArray name="links">
                      {({ push, remove }) => (
                        <div>
                          {values.links.map((_, i) => (
                            <div key={i} className="d-flex gap-2 mb-2">
                              <Field name={`links.${i}.title`} className="form-control" placeholder="Title" />
                              <Field name={`links.${i}.link`} className="form-control" placeholder="Link" />
                              <button type="button" className="btn btn-danger" onClick={() => remove(i)}>
                                X
                              </button>
                            </div>
                          ))}
                          <button type="button" className="btn btn-secondary" onClick={() => push({ title: "", link: "" })}>
                            + Add
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <hr />
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setUpdateModal(false)}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={deleteModal.modal} onHide={() => setDeleteModal({ modal: false, data: "" })} centered>
        <Modal.Header>
          <Modal.Title>Delete Page Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{deleteModal.data?.title}</b>?
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

export default ManagePageContent;
