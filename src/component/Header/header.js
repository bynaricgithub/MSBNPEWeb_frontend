import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeadNav from "./navbar";

import API from "../../API";
import { show } from "../../utils/Helper";
import ContentModal from "../CommonComponent/ContentModal";
import TopControl from "../HeaderComponent/TopControl";
import SearchBar from "./search";

const Header = () => {
  const [modalShow, setModalShow] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const headerRef = useRef(null);

  const openModal = (url) => {
    setContentUrl(url);
    setModalShow(true);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [stickyClass, setStickyClass] = useState("");

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDropdownToggle = (index, isMainMenu) => {
    if (isMobile) {
      setActiveDropdown((prev) => {
        const newActiveDropdown = new Set(prev);
        if (isMainMenu) {
          if (newActiveDropdown.has(index)) {
            newActiveDropdown.delete(index);
          } else {
            return [index];
          }
        } else {
          if (newActiveDropdown.has(index)) {
            newActiveDropdown.delete(index);
          } else {
            newActiveDropdown.add(index);
          }
        }
        return [...newActiveDropdown];
      });
    }
  };

  const getAllSubmenuIds = (menu) => {
    return menu.subMenu.reduce((ids, item) => [...ids, item.id, ...getAllSubmenuIds(item)], []);
  };

  const handleDropdownEnter = (id) => {
    if (!isMobile) {
      setActiveDropdown((prev) => [...prev, id]);
    }
  };

  const handleDropdownLeave = (id) => {
    if (!isMobile) {
      setActiveDropdown((prev) => prev.filter((item) => item !== id));
    }
  };

  const [data, setData] = useState();

  useEffect(() => {
    data && getMenus(data);
  }, [data]);

  function getMenus(menuData) {
    let menus = [];
    menuData.forEach((item) => {
      let strct = {
        id: "",
        label: "",
        link: "",
        order_id: "",
      };
      if (item.id === item.parent_id) {
        strct.id = item.id;
        strct.label = item.title;
        strct.link = item.menu_url;
        strct.order_id = item.order_id;
        menus.push(strct);
      }
    });

    menuData = menuData.filter((item) => !menus.find((item2) => item2.id === item.id));
    menus.forEach((item) => {
      item.subMenu = getSubmenus(menuData, item.id);
    });
    setMenus(menus);
  }

  const [menus, setMenus] = useState();

  function getSubmenus(ary, id) {
    let subMenu = [];
    ary?.forEach((item) => {
      let strct = {
        id: "",
        label: "",
        link: "",
        order_id: "",
        subMenu: [],
      };
      if (item.parent_id === id) {
        strct.id = item.id;
        strct.label = item.title;
        strct.link = item.menu_url;
        strct.order_id = item.order_id;
        strct.subMenu = getSubmenus(
          ary.filter((item2) => item2.id !== item.id),
          item.id
        );
        subMenu.push(strct);
      }
    });
    return subMenu;
  }

  function getInfiniteMenu(item) {
    if (item.subMenu.length > 0) {
      return (
        <li
          onMouseEnter={() => handleDropdownEnter(item.id)}
          onMouseLeave={() => handleDropdownLeave(item.id)}
          onClick={(e) => {
            isMobile && e.stopPropagation();
            isMobile && handleDropdownToggle(item.id);
          }}
          key={item.id}
        >
          <div className="nav-item-with-dropdown">
            <span>
              {item.label} <i className={`fa ${activeDropdown.includes(item.id) ? "fa-minus" : "fa-plus"}`}></i>
            </span>
            <ul className={`dropdown-menu2 m-0  ${activeDropdown.includes(item.id) ? "open" : ""} ${isMobile ? "mobile" : ""}`}>
              {item.subMenu
                .sort((a, b) => a.order_id - b.order_id)
                .map((item2, idx) => (
                  <React.Fragment key={idx}>{getInfiniteMenu(item2)}</React.Fragment>
                ))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.id}>
        {item.link.endsWith(".pdf") ? (
          <a onClick={() => openModal(item.link)}>{item.label}</a>
        ) : /^(https?:\/\/|ftp:\/\/|file:\/\/|mailto:|tel:)/.test(item.link) || /^(http|https):\/\/\d+\.\d+\.\d+\.\d+/.test(item.link) ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.label}
          </a>
        ) : (
          <Link to={item.link}>{item.label}</Link>
        )}
      </li>
    );
  }
  useEffect(() => {
    const handleScroll = () => {
      const stickyPoint = headerRef.current.offsetTop;

      if (window.pageYOffset > stickyPoint) {
        headerRef.current.classList.add("sticky");
      } else {
        headerRef.current.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Apply the saved theme from localStorage when the component mounts
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      switchTheme(savedTheme);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const stickNavbar = () => {
      let windowHeight = window.scrollY;
      const stickyClass = windowHeight > 250 ? "sticky-nav" : "";
      setStickyClass(stickyClass);
    };

    window.addEventListener("scroll", stickNavbar);
    getLinks();
    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  const switchTheme = (theme) => {
    if (theme === "default") {
      document.documentElement.className = "";
      localStorage.setItem("theme", "default");
    } else {
      document.documentElement.className = theme;
      localStorage.setItem("theme", theme);
    }
  };

  return (
    <>
      <div id="headerfix" ref={headerRef}>
        <TopControl switchTheme={switchTheme} />
      </div>
      <HeadNav />
      <nav className={`mainNavbar ${stickyClass}`}>
        {isMobile && (
          <>
            <div className=" d-flex justify-content-between">
              <div className="mobile-menu-button">
                <button onClick={openMobileMenu}>
                  <i className="fa fa-bars"></i>
                </button>
              </div>
              <div className="search mt-0 search-m">
                <SearchBar />
              </div>
            </div>
          </>
        )}

        <ul className={`main-menu container-fluid ${isMobileMenuOpen ? "open" : ""}`}>
          {isMobileMenuOpen && (
            <div className="mobile-menu-close-button">
              <span>Menu</span>

              <button onClick={closeMobileMenu}>
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}

          {menus &&
            menus
              .sort((a, b) => a.order_id - b.order_id)
              .map((item) => (
                <li
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                  onMouseLeave={() => handleDropdownLeave(item.id)}
                  onClick={() => isMobile && handleDropdownToggle(item.id, true)}
                  key={item.id}
                >
                  {item.subMenu.length > 0 ? (
                    <div className="nav-item-with-dropdown">
                      <span>
                        {item.label}
                        <i className={`fa ${activeDropdown.includes(item.id) ? "fa-angle-up" : "fa-angle-down"}`}></i>
                      </span>
                      <ul className={`dropdown-menu1 m-0  ${activeDropdown.includes(item.id) ? "open" : ""} ${isMobile ? "mobile" : ""}`}>
                        {item.subMenu
                          .sort((a, b) => a.order_id - b.order_id)
                          .map((item2, idx) => (
                            <React.Fragment key={idx}>{getInfiniteMenu(item2)}</React.Fragment>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="headLi">
                      {item.link.endsWith(".pdf") ? (
                        <a onClick={() => openModal(item.link)}>{item.label}</a>
                      ) : /^(https?:\/\/|ftp:\/\/|file:\/\/|mailto:|tel:)/.test(item.link) ||
                        /^(http|https):\/\/\d+\.\d+\.\d+\.\d+/.test(item.link) ? (
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      ) : (
                        <Link to={item.link}>{item.label}</Link>
                      )}
                    </div>
                  )}
                </li>
              ))}
        </ul>
      </nav>

      <ContentModal show={modalShow} handleClose={() => setModalShow(false)} content={contentUrl} />
    </>
  );

  async function getLinks() {
    try {
      const res = await API.get("/homemenu/listing");
      let data = res.data?.data;
      setData(data);
    } catch (error) {
      show({
        message: error.response.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default Header;
