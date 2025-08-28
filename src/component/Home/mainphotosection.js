import React, { useEffect, useState } from "react";
import API from "../../API";
import { show } from "../../utils/Helper";
import FileComponent from "../CommonComponent/FileVerify";

function Mainphotosection({ type = 2 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="mainphotos-grid-container">
      {data &&
        data.map((member, index) => (
          <div className="grid-item" key={index}>
            <FileComponent file={member.image} fileTitle={member.title} fallbackFile="" fileType="homeImage" />

            <div className="grid-info">
              <h3 className="photoTitle">{member.title}</h3>
              <h4 className="photoSubtitle">{member.subtitle}</h4>
            </div>
          </div>
        ))}
    </div>
  );

  async function getList() {
    try {
      const res = await API.get("members/listing");
      const allData = res.data.data || [];

      // Filter by type and sort by order_id
      const filtered = allData.filter((item) => item.type == type).sort((a, b) => a.order_id - b.order_id); // Sort in ascending order

      setData(filtered);
    } catch (error) {
      show({
        message: error.response?.data?.message || error.message,
        displayClass: "failure",
      });
    }
  }
}

export default Mainphotosection;
