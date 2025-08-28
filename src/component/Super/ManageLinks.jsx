import {
  faArrowUpRightFromSquare,
  // faCaretDown,
  // faCaretUp,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import RForm from "react-bootstrap/Form";
import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { show, uploadFileInChunks } from "../../utils/Helper";
import CustomReactSortable from "../../utils/CustomReactSortable";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageLinks = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Title", dataField: "title" },
    { text: "Menu URL", dataField: "menu_url" },
    { text: "Parent", dataField: "parent_name" },
    { text: "Order ID", dataField: "order_id" },
    { text: "Actions", dataField: "actions" },
  ];

  const [list, setList] = useState();
  const [data, setData] = useState();

  const [loading, setLoading] = useState(false);

  const [fetchData, setfetchData] = useState(false);

  const [updateModal, setUpdateModal] = useState(false);
  const [editData, setEditData] = useState();

  const [showMenu, setShowMenu] = useState(false);
  const [menus, setMenus] = useState();

  const [sorting, setSorting] = useState([]);
  // const [showSortingMenu, setShowSortingMenu] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    modal: false,
    data: "",
  });

  function getMenus(menuData) {
    let menus = [];
    menuData.forEach((item, i, ary) => {
      let strct = {
        id: "",
        label: "",
        link: "",
        order_id: "",
        parent_id: "",
        // subMenu: []
      };
      if (item.id === item.parent_id) {
        strct.id = item.id;
        strct.label = item.title;
        strct.link = item.menu_url;
        strct.order_id = item.order_id;
        strct.parent_id = item.parent_id;
        menus.push(strct);
      }
    });

    menuData = menuData.filter((item) => !menus.find((item2) => item2.id === item.id));
    menus.forEach((item) => {
      item.subMenu = getSubmenus(menuData, item.id);
    });
    // console.log(menus);
    setMenus(menus);
    getSortableDNDMenu([
      {
        id: 0,
        parent_id: "#",
        label: "Main Menu",
        subMenu: menus,
      },
    ]);
    // setSorting(menus);
  }

  function getSubmenus(ary, id) {
    let subMenu = [];
    ary?.forEach((item) => {
      let strct = {
        id: "",
        label: "",
        link: "",
        order_id: "",
        parent_id: "",
        subMenu: [],
      };
      if (item.parent_id === id) {
        strct.id = item.id;
        strct.label = item.title;
        strct.link = item.menu_url;
        strct.order_id = item.order_id;
        strct.parent_id = item.parent_id;
        strct.subMenu = getSubmenus(
          ary.filter((item2) => item2.id !== item.id),
          item.id
        );
        subMenu.push(strct);
      }
    });
    return subMenu;
  }

  const FileTreeItem = ({ item }) => {
    return (
      <>
        <div style={{ marginLeft: `${20}px` }}>
          {item.link === "#" && "| -📁 "}
          {/* {item.link !== '#' && '| -📄 '}&#xf0ac; */}
          {item.link !== "#" && <>| - &#127760; </>}
          {item.label}
          &nbsp;
          <a
            href={item.link && item.link.includes("http") ? item.link : process.env.REACT_APP_SERVER_PATH + item.link.slice(1)}
            target="_blank"
            rel="noopener noreferrer"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={process.env.REACT_APP_SERVER_PATH + item.link.slice(1)}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </div>
        {item.subMenu && (
          <div style={{ marginLeft: `${40}px` }}>
            {item.subMenu.map((child, index) => (
              <FileTreeItem key={index} item={child} />
            ))}
          </div>
        )}
      </>
    );
  };

  const FindParent = (id, parent_id, listData) => {
    let str = "";
    function findP(id, parent_id, listData) {
      if (parent_id != id) {
        let parent = listData.find((item) => item.id === parent_id);
        if (parent) {
          str += " -> " + parent.title;
          if (parent.id !== parent.parent_id) {
            findP(parent.id, parent.parent_id, listData);
          }
        }
        return str;
      }
    }
    return findP(id, parent_id, listData);
  };

  const getSortableDNDMenu = (data) => {
    if (data.length > 0) {
      data
        .sort((a, b) => a.order_id - b.order_id)
        .forEach((item) => {
          if (item.subMenu.length > 0) {
            setSorting((pre) => [
              ...pre,
              <div className="col-xl-3 col-lg-3 col-sm-4">
                <div className="masonry-item" key={item.id}>
                  <div
                    className="card fade-in-top mb-3"
                    style={{
                      cursor: "default",
                      userSelect: "none",
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        color: "white",
                        backgroundColor: "var(--theme)",
                      }}
                    >
                      <b>{item.label}</b>
                      {list && item.parent_id !== item.id && FindParent(item.id, item.parent_id, list)}
                    </div>
                    <div className="card-body">
                      <CustomReactSortable
                        parent_id={item.parent_id}
                        list={item.subMenu.sort((a, b) => a.order_id - b.order_id)}
                        onUpdate={(e, parent_id) => reorderMenu(e, parent_id)}
                      />
                    </div>
                  </div>
                </div>
              </div>,
            ]);
            getSortableDNDMenu(item.subMenu);
          }
        });
    }
  };

  useEffect(() => {
    data && getMenus(data);
  }, [data]);

  useEffect(() => {
    getLinks();
  }, [updateModal, deleteModal, fetchData]);

  const FormField = ({ name, heading }) => (
    <div>
      <div className="form-floating mb-3">
        <Field
          id={"floating" + name}
          name={name}
          type="text"
          // value={values[name]}
          className="form-control"
          placeholder={heading}
        />
        <label htmlFor={"floating" + name}>
          <font color="red">* </font>
          {heading}
        </label>
        <ErrorMessage name={name}>{(msg) => <div className="alert alert-danger">{msg}</div>}</ErrorMessage>
      </div>
    </div>
  );

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h2>Manage Links</h2>
      </div>
      <div className="d-flex justify-content-between">
        {/* ============================================ Switch Button ============================================= */}
        {list && (
          <span className="d-flex py-2">
            Links&nbsp;&nbsp;
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={showMenu}
                id="flexSwitchCheckDefault"
                onChange={(e) => setShowMenu(e.target.checked)}
              />
            </div>
            Tree
          </span>
        )}
        <button
          type="button"
          className={"btn rounded-5 btn-success"}
          onClick={(e) => {
            setEditData(false);
            setUpdateModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Link
        </button>
      </div>

      {showMenu && menus && (
        <div className="fade-in-top my-2 card p-4">
          <h4 className="mb-0">Menu Tree</h4>
          <hr />
          {menus && menus.sort((a, b) => a.order_id - b.order_id).map((item, key) => <FileTreeItem item={item} key={key} />)}
        </div>
      )}

      {!showMenu && (
        <>
          <div className="col-lg-12 col-sm-12">
            <div className="depttableSection table-responsive" style={{ wordBreak: "break-word" }}>
              {list ? (
                list?.length > 0 && (
                  <CustomReactBootstrapTable data={list} columns={header} keyField="srno" headerClasses="admin-allTable_header" />
                )
              ) : (
                <CustomLoader />
              )}
            </div>

            <hr />
            <div className="card p-3 mb-4">
              <div className="text-center">
                <h5 className="my-3">Edit - Drag and Drop Menu for Rearrange</h5>
              </div>
              <div className="row">{sorting}</div>
            </div>
          </div>
        </>
      )}

      {/* -------------------------------------------------------- Add/Edit Modal ----------------------------------------------------------- */}
      <Modal show={updateModal} onHide={(e) => setUpdateModal(false)} centered size="lg">
        <Modal.Header className="bgTheme text-light">
          <Modal.Title>
            {" "}
            {editData ? "Edit" : "Add Link"} {editData?.title}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: editData?.id || "",
              title: editData?.title || "",
              parent_id: editData?.parent_id || "",
              menu_url: editData?.menu_url || "",
              order_id: editData?.order_id || "",
              type: editData ? "URL" : "",
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              // values.dept_id = state.id
              // console.log(values);
              setLoading(true);
              if (editData) {
                await updateLink(values);
              } else {
                await addLink(values);
              }
              setLoading(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="form-floating mb-3">
                  <Field id={"floatingType"} name={"type"} as="select" value={values.type} className="form-control" placeholder={"Type"}>
                    <option value="">Select Type</option>
                    <option value="PDF">Link with PDF</option>
                    <option value="URL">Link with URL</option>
                  </Field>
                  <label htmlFor={"floatingType"}>
                    <font color="red">* </font>Type
                  </label>
                </div>
                <FormField name={"title"} heading={"Title"} />
                {values.type == "URL" && <FormField name={"menu_url"} heading={"Menu URL"} />}
                {values.type == "PDF" && (
                  <div className="form-floating mb-3">
                    <input
                      id="floatingFile"
                      type="file"
                      accept="application/pdf"
                      className="form-control"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
                          if (!isPdf) {
                            alert("Please upload a valid PDF file.");
                            event.target.value = ""; // Reset the input
                            return;
                          }
                          setFieldValue("menu_url", file);
                        }
                      }}
                    />
                    <label htmlFor={"floatingFile"}>
                      <font color="red">* </font>Select File
                    </label>
                  </div>
                )}
                <div className="form-floating mb-3">
                  <Field
                    id={"floatingparent_id"}
                    name={"parent_id"}
                    as="select"
                    value={values.parent_id}
                    className="form-control"
                    placeholder={"Parent ID"}
                  >
                    <option value="">Select Parent ID</option>
                    {editData?.id && <option value={editData?.id}>Main Menu</option>}
                    {list &&
                      list?.map(
                        (item) =>
                          item.menu_url === "#" && (
                            <option value={item.id} key={item.id}>
                              {item.title}
                              {/* {item.parent_name !== "Main Menu" && ` < ` + item.parent_id} */}
                              {item.parent_id !== item.id && FindParent(item.id, item.parent_id, list)}
                            </option>
                          )
                      )}
                  </Field>
                  <label htmlFor={"floatingparent_id"}>Parent ID</label>
                  <ErrorMessage name={"parent_id"}>{(msg) => <div className="alert alert-danger">{msg}</div>}</ErrorMessage>
                </div>
                <hr />
                <div className="text-center py-3">
                  <button type="submit" className="btn btn-primary mx-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        &nbsp;Loading...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <button type="button" className="btn btn-danger mx-2" onClick={(e) => setUpdateModal(false)} disabled={loading}>
                    Close
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* --------------------------------------------------------- Delete Modal ------------------------------------------------------------ */}
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
              deleteLink({ id: deleteModal.data?.id });
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

  async function getLinks(values) {
    try {
      const res = await API.get("/homemenu", { params: values });
      let data = res.data;
      setSorting([]);
      setData(data?.data);
      setList(
        data?.data.map((item, i, arr) => {
          return {
            ...item,
            srno: i + 1,
            parent_name: item.parent_id === item.id ? "Main Menu" : FindParent(item.id, item.parent_id, res.data.data),
            menu_url: item.menu_url.includes("http") ? (
              <a href={item.menu_url} target="_blank" rel="noopener noreferrer">
                {item.menu_url}
              </a>
            ) : (
              item.menu_url
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
                      changeLinkStatus({
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

  async function addLink(values) {
    try {
      if (!values.menu_url) {
        show({ message: "Please Select a File or Link.", displayClass: "danger" });
        return null;
      }
      if (values.menu_url instanceof File || values.menu_url instanceof Blob) {
        values.menu_url = await uploadFileInChunks(values.menu_url, "homemenuFiles");
        values.menu_url = process.env.REACT_APP_DATA_SERVER_PATH + values.menu_url;
      }
      const res = await API.post("/homemenu", values);
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

  async function updateLink(values) {
    try {
      if (!values.menu_url) {
        show({ message: "Please Select a File or Link.", displayClass: "danger" });
        return null;
      }
      if (values.menu_url instanceof File || values.menu_url instanceof Blob) {
        values.menu_url = await uploadFileInChunks(values.menu_url, "homemenuFiles");
        values.menu_url = process.env.REACT_APP_DATA_SERVER_PATH + values.menu_url;
      }
      const res = await API.put("/homemenu", values);
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

  async function deleteLink(values) {
    try {
      const res = await API.delete("/homemenu", { params: { id: values.id } });
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

  async function changeLinkStatus(values) {
    try {
      const res = await API.post("/homemenu/disable", values);
      let data = res.data;
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  async function reorderMenu(values, parent_id) {
    try {
      const res = await API.post("/reorder/menu", { data: values, parent_id });
      let data = res.data;
      setfetchData((pre) => !pre);
      show({ message: data.message, displayClass: data.status });
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }

  // async function reorderUp(values) {
  // 	try {
  // 		const res = await API.post("/reorder/up", values);
  // 		let data = res.data;
  // 		setfetchData((pre) => !pre);
  // 		show({ message: data.message, displayClass: data.status });
  // 	} catch (error) {
  // 		show({
  // 			message: error.response.data?.message || error.response?.message,
  // 			displayClass: "failure",
  // 		});
  // 	}
  // }

  // async function reorderDown(values) {
  // 	try {
  // 		const res = await API.post("/reorder/down", values);
  // 		let data = res.data;
  // 		setfetchData((pre) => !pre);
  // 		show({ message: data.message, displayClass: data.status });
  // 	} catch (error) {
  // 		show({
  // 			message: error.response.data?.message || error.response?.message,
  // 			displayClass: "failure",
  // 		});
  // 	}
  // }
};

export default ManageLinks;
