import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import API from "../../API";
import { show } from "../../utils/Helper";
import CustomLoader from "../../utils/CustomLoader";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageMasterCategoryAndType = () => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeModal, setTypeModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await API.get("/admin/master-category-type/listing");
      const data = res.data?.data || [];
      const mapped = data.map((item, i) => ({
        ...item,
        srno: i + 1,
        actions: (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                setEditType(item);
                setTypeModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteType(item.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      }));
      setTypes(mapped);
    } catch {
      show({ message: "Failed to load types", displayClass: "failure" });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/master-category/listing");
      const data = res.data?.data || [];
      const mapped = data.map((item, i) => ({
        ...item,
        srno: i + 1,
        typeLabel: item.type?.label || "N/A",
        actions: (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                setEditCategory(item);
                setCategoryModal(true);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(item.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      }));
      setCategories(mapped);
    } catch {
      show({ message: "Failed to load categories", displayClass: "failure" });
    }
  };

  const handleTypeSubmit = async (values) => {
    setLoading(true);
    try {
      if (values.id) await API.put("/master-category-type/update", values);
      else await API.post("/master-category-type/add", values);

      show({ message: "Saved successfully", displayClass: "success" });
      setTypeModal(false);
      setEditType(null);
      fetchTypes();
    } catch {
      show({ message: "Save failed", displayClass: "failure" });
    }
    setLoading(false);
  };

  const handleCategorySubmit = async (values) => {
    setLoading(true);
    try {
      if (values.id) await API.put("/master-category/update", values);
      else await API.post("/master-category/add", values);

      show({ message: "Saved successfully", displayClass: "success" });
      setCategoryModal(false);
      setEditCategory(null);
      fetchCategories();
    } catch {
      show({ message: "Save failed", displayClass: "failure" });
    }
    setLoading(false);
  };

  const deleteType = async (id) => {
    try {
      await API.delete("/master-category-type/delete", { params: { id } });
      show({ message: "Deleted successfully", displayClass: "success" });
      fetchTypes();
    } catch {
      show({ message: "Delete failed", displayClass: "failure" });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete("/master-category/delete", { params: { id } });
      show({ message: "Deleted successfully", displayClass: "success" });
      fetchCategories();
    } catch {
      show({ message: "Delete failed", displayClass: "failure" });
    }
  };

  const typeColumns = [
    { text: "Label", dataField: "label" },
    { text: "Name", dataField: "name" },
    { text: "Actions", dataField: "actions" },
  ];

  const categoryColumns = [
    { text: "Type", dataField: "typeLabel" },
    { text: "Label", dataField: "label" },
    { text: "Value", dataField: "value" },
    { text: "Actions", dataField: "actions" },
  ];

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Master Category & Types</h3>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <button className={"btn rounded-5 btn-success"} onClick={() => setTypeModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Type
        </button>
        <button className={"btn rounded-5 btn-success mx-2"} onClick={() => setCategoryModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </button>
      </div>

      <div className="row">
        <div className="col-md-5 col-sm-12">
          <div className="card px-3 py-3">
            <div className="mb-2">
              <h5 className="text-dark">Types</h5>
            </div>
            <hr />
            {types.length ? <CustomReactBootstrapTable data={types} columns={typeColumns} keyField="srno" /> : <CustomLoader />}
          </div>
        </div>

        <div className="col-md-7 col-sm-12">
          <div className="card px-3 py-3">
            <div className="mb-2 d-flex justify-content-between">
              <h5 className="text-dark">Categories</h5>
              <select className="form-select w-auto" onChange={(e) => setFilterType(e.target.value)}>
                <option value="">All</option>
                {types.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <hr />
            {categories.length ? (
              <CustomReactBootstrapTable
                data={categories
                  .filter((item) => !filterType || item.master_category_type_id == filterType)
                  .sort((a, b) => {
                    // First, sort by the category (typeLabel or type)
                    if (a.typeLabel < b.typeLabel) return -1;
                    if (a.typeLabel > b.typeLabel) return 1;

                    // If categories are the same, sort by the value
                    return a.value - b.value;
                  })}
                columns={categoryColumns}
                keyField="srno"
              />
            ) : (
              <CustomLoader />
            )}
          </div>
        </div>
      </div>

      {/* Type Modal */}
      <Modal
        show={typeModal}
        onHide={() => {
          setTypeModal(false);
          setEditType(null);
        }}
        centered
      >
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editType ? "Edit" : "Add"} Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ id: editType?.id || "", name: editType?.name || "", label: editType?.label || "" }}
            onSubmit={handleTypeSubmit}
            enableReinitialize
          >
            {() => (
              <Form>
                <div className="form-floating mb-3">
                  <Field name="name" className="form-control" />
                  <label>Name</label>
                </div>
                <div className="form-floating mb-3">
                  <Field name="label" className="form-control" />
                  <label>Label</label>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setTypeModal(false)}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Category Modal */}
      <Modal
        show={categoryModal}
        onHide={() => {
          setCategoryModal(false);
          setEditCategory(null);
        }}
        centered
      >
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>{editCategory ? "Edit" : "Add"} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editCategory?.id || "",
              label: editCategory?.label || "",
              value: editCategory?.value || "",
              master_category_type_id: editCategory?.master_category_type_id || "",
              order_id: editCategory?.order_id || "",
              status: editCategory?.status ?? 1,
            }}
            onSubmit={handleCategorySubmit}
            enableReinitialize
          >
            {() => (
              <Form>
                <div className="form-floating mb-3">
                  <Field name="label" className="form-control" />
                  <label>Label</label>
                </div>
                <div className="form-floating mb-3">
                  <Field name="value" type="number" className="form-control" />
                  <label>Value</label>
                </div>
                <div className="form-floating mb-3">
                  <Field as="select" name="master_category_type_id" className="form-control">
                    <option value="">Select</option>
                    {types.map((type) => (
                      <option value={type.id} key={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </Field>
                  <label>Type</label>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? "Saving..." : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setCategoryModal(false)}>
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageMasterCategoryAndType;
