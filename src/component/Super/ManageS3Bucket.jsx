/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
// import { S3Client, ListObjectsCommand } from 'aws-sdk';
import { S3 } from "aws-sdk";
import CustomReactBootstrapTable from "../../utils/CustomReactBootstrapTable";
import CustomLoader from "../../utils/CustomLoader";

const ManageS3Bucket = () => {
  const Bucket = "fra-bucket-1";
  const header = [
    { text: "Sr.No.", dataField: "srno" },
    { text: "File Title", dataField: "title" },
    { text: "Path", dataField: "Key" },
    // { text: "Order ID", dataField: "order_id" },
    // { text: "Actions", dataField: "actions" },
  ];

  // const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const s3 = new S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });
  // const [objects, setObjects] = useState([]);

  const [list, setList] = useState();

  const [error, setError] = useState(null);

  useEffect(() => {
    const listS3Objects = async () => {
      try {
        s3.listObjectsV2({ Bucket }, (err, data) => {
          // console.log(data);
          if (err) {
            console.error("Error listing S3 objects:", err);
            setError(err);
            setLoading(false);
          } else {
            if (data.Contents) {
              setList(
                (data.Contents || []).map((item, i) => ({
                  ...item,
                  srno: i + 1,
                  title: item.Key.split("/")[item.Key.split("/").length - 1],
                }))
              );
            }
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error listing S3 objects:", err);
        setError(err);
        setLoading(false);
      }
    };

    listS3Objects();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="px-3">
      <div className="text-center p-2">
        <h2>Files in S3 Bucket</h2>
      </div>
      <div className="depttableSection my-3" style={{ wordBreak: "break-word" }}>
        {list ? (
          list?.length > 0 && (
            <CustomReactBootstrapTable data={list} columns={header} keyField="srno" headerClasses="admin-allTable_header" />
          )
        ) : (
          <CustomLoader />
        )}
      </div>
      {/* <ul>
				{objects.map((object) => (
					<li key={object.Key}>{object.Key}</li>
				))}
			</ul> */}
    </div>
  );
};

export default ManageS3Bucket;
