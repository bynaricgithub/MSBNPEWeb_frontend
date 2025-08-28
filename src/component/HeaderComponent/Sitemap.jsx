/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import API from "../../API";
import { show } from "../../utils/Helper";
// import { Col, Container, Row } from "react-bootstrap";

const Sitemap = () => {
  const [menus, setMenus] = useState();
  const [data, setData] = useState();

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
      <li>
        <div>
          {/* {item.link === "#" && "| -📁 "} */}
          {/* {item.link !== '#' && '| -📄 '}&#xf0ac; */}
          {/* {item.link !== "#" && <>| - &#127760; </>} */}

          {/* &nbsp; */}
          <a
            href={item.link}
            target={item.link && item.link.includes("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            // data-bs-toggle="tooltip"
            // data-bs-placement="right"
            // title={process.env.REACT_APP_SERVER_PATH + item.link.slice(1)}
          >
            {item.label}
            {/* {item.link &&
                            item.link.includes("http")
                            ? item.link
                            : item.link
                        } */}
          </a>
        </div>
        {item.subMenu && (
          <ul>
            {item.subMenu.map((child, index) => (
              <FileTreeItem key={index} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  useEffect(() => {
    getLinks();
  }, []);

  useEffect(() => {
    if (data) {
      getMenus(data);
    }
  }, [data]);

  return (
    <div>
      {menus && (
        <div className="container">
          <div className="card my-5">
            <div className="announcmentHeader text-center card-header">
              <h1 className="innercommTitle">Sitemap</h1>
            </div>
            <div className="card-body">
              <div className="">
                <ul>{menus && menus.sort((a, b) => a.order_id - b.order_id).map((item, key) => <FileTreeItem item={item} key={key} />)}</ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function getLinks(values) {
    try {
      const res = await API.get("/homemenu/fetchHomeMenu", { params: values });
      let data = res.data;
      setData(data?.data);
      // show({ message: data.message, displayClass: data.status })
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default Sitemap;
