import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import API from "../../API";
import { show } from "../../utils/Helper";
import FileComponent from "../CommonComponent/FileVerify";

const SyllabusData = [
  {
    heading: "Syllabus for Post Basic Diploma in Psychiatric Nursing",
    date: "25-Jul-2016",
    subTitle: "Refer Document below for syllabus of Post Basic Diploma in Psychiatric Nursing",
    downloads: [{ title: "Syllabus for Post basic diploma in Psyciatric Nursing", link: "/assets/syllabus/" }],
  },
  {
    heading: "Complete Syllabus for G N M ( General Nurse & Midwife )",
    date: "30-Jun-2016",
    subTitle: "Refer following document for the syllabus of G N M",
    downloads: [{ title: "G N M Syllabus", link: "/assets/syllabus/34_1.pdf" }],
  },
  {
    heading: "A N M ( Auxiliary Nurse & Midwife )",
    date: "18-Jun-2025",
    subTitle: "Refer following document for A N M Syllabus",
    downloads: [
      { title: "Auxiliary Nurse and Midwife Syllabus-1", link: "/assets/syllabus/35_4.pdf" },
      { title: "Auxiliary Nurse and Midwife Syllabus-2", link: "/assets/syllabus/35_5.pdf" },
    ],
  },
];

const Syllabus = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    try {
      const res = await API.get("/page-content/listing");
      const allData = res.data.data || [];

      const filtered = allData
        .filter((item) => item.type == 11)
        .map((item) => {
          const downloadsArray = parseArray(item.downloads);
          return {
            heading: item.title,
            date: item.date?.split("T")[0] || "",
            subTitle: item.description,
            downloads: downloadsArray,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending by date

      setData(filtered);
    } catch (error) {
      show({
        message: error.response?.data?.message || error.message,
        displayClass: "failure",
      });
    }
  }

  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Syllabus</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="my-4 justify-content-center">
          {data.map((item, index) => (
            <Col lg={4} md={6} sm={6} xs={12} key={index} className="my-2">
              <Card className="h-100 adCardbox downlist" style={{ boxShadow: "var(--newsEvents__box__shadow--28)" }}>
                <CardBody>
                  {" "}
                  {item.file && item.file.length > 0 && (
                    <>
                      {/* <img
                        src={item.file}
                        alt={item.title}
                        onClick={() => {
                          setContentUrl(item.file);
                          setModalShow(true);
                        }}
                        style={{
                          maxHeight: "342px",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      /> */}
                      <FileComponent file={item.file} fileTitle={item.title} fallbackFile="" fileType="image" />
                      <hr />
                    </>
                  )}
                  <h5 className="mb-1">{item.heading}</h5>
                  <small>
                    <b>Date : </b>
                    {item.date}
                  </small>
                  <hr />
                  <span>{item.subTitle}</span>
                  <p className="mb-1">
                    <b>Downloads:</b>
                  </p>
                  <ul>
                    {item.downloads.map((download, i) => (
                      <li key={i} className="d-flex">
                        <b></b>
                        {/* <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(
                                download.link.includes("http") ? download.link : process.env.REACT_APP_DATA_SERVER_PATH + download.link
                              );
                              setShowModal(true);
                            }}
                          >
                            {download.title}
                          </a> */}
                        {/* <a href={download.link} target="_blank" rel="noopener noreferrer">
                          {download.title}
                        </a> */}
                        <FileComponent file={download.link} fileTitle={download.title} fileType="pdf" />
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Syllabus;
