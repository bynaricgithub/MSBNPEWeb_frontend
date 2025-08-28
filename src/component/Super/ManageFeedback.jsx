import React, { useEffect, useState } from "react";

import API from "../../API";
import CustomLoader from "../../utils/CustomLoader";
import { show } from "../../utils/Helper";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";

const ManageFeedback = () => {
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "Name", dataField: "name" },
    { text: "Email", dataField: "email" },
    { text: "Mobile", dataField: "number" },
    { text: "Subject", dataField: "subject" },
    { text: "Feedback", dataField: "feedback" },
    { text: "Submitted on", dataField: "created_at" },
  ];

  const [list, setList] = useState();

  useEffect(() => {
    getList();
  });

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h3>Manage Feedback</h3>
      </div>

      <div className="depttableSection my-3">
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable
              data={list}
              columns={header}
              keyField="srno"
              headerClasses="admin-allTable_header"
              getData={getList}
            />
          )
        ) : (
          <CustomLoader />
        )}
      </div>
    </div>
  );

  async function getList() {
    try {
      const res = await API.get("/feedback");
      let data = res.data;
      setList(
        data?.data
          .sort((a, b) => a.order_id - b.order_id)
          .map((item, i) => {
            return {
              ...item,
              srno: i + 1,
              created_at: new Date(item.created_at).toLocaleString("en-IN", {}),
            };
          })
      );
    } catch (error) {
      show({
        message: error?.response?.data?.message || error.response?.message,
        displayClass: "failure",
      });
    }
  }
};

export default ManageFeedback;
