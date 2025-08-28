import React from "react";
import { Link } from "react-router-dom";

const FloatingBtn = () => {
  return (
    <div className="floatingBtn">
      <ul>
        <li>
          <Link to="tel:917122561107">
            <img src="/assets/images/phone.svg" alt="Phone" />
          </Link>
        </li>
        <li>
          <Link to="mailto:registrar@litu.edu.in">
            <img src="/assets/images/email.svg" alt="Email" />
          </Link>
        </li>
        <li>
          <Link to="/">
            <img src="/assets/images/location.svg" alt="Location" />
          </Link>
        </li>
        <li>
          <Link to="https://isgpay.com/PayCollect/PayCollect.action?payCollect=MTIwMDAwMDAwMDAyMjI5">
            <img src="/assets/images/rupee.svg" alt="Rupee" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FloatingBtn;
