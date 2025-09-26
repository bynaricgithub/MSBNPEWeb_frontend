import React, { Component } from "react";
import { Link } from "react-router-dom";

class HeadNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickyClass: "",
    };
    this.stickNavbar = this.stickNavbar.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.stickNavbar);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.stickNavbar);
  }

  stickNavbar() {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      // window height changed for the demo
      const stickyClass = windowHeight > 250 ? "sticky-nav" : "";
      this.setState({ stickyClass });
    }
  }

  render() {
    return (
      <div className={`navbar ${this.state.stickyClass}`}>
        <div className="container">
          <div className="align-items-center headBar row mx-0">
            <div className="d-flex col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12 align-items-center">
              <div className="mainLogo">
                <Link to="/">
                  <img src="/assets/images/logo.png" alt="Logo" />
                </Link>
              </div>
              <div className="mainTitle">
                <Link to="/">
                  <h1>महाराष्ट्र राज्य शुश्रुषा व परवायधिक शिक्षण मंडळ</h1>
                  <h5>Maharashtra State Board of Nursing and Paramedical Education</h5>
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 m-hide">
              <div className="d-flex justify-content-end">
                <div className="founderLogo">
                  <img src="/assets/images/satyamev.png" alt="Logo" />
                  <img src="/assets/images/mhsh.jpeg" alt="Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HeadNav;
