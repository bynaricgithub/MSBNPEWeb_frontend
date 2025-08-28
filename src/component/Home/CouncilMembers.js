import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import API from "../../API";
import { show } from "../../utils/Helper";
import HomeCss from "./home.module.css";
import FileComponent from "../CommonComponent/FileVerify";

const staticMembers = [
  { title: "Dr. Ramling B. Mali", subtitle: "Hon. President", image: "/assets/images/members/1.jpg" },
  { title: "Mr. Arun N. Kadam", subtitle: "Hon. Vice-President", image: "/assets/images/members/2.jpg" },
  {
    title: "Dr. Mahadeo B. Shinde",
    subtitle: "Hon. Chairman Education/Registration & CNE Committee",
    image: "/assets/images/members/3.jpg",
  },
  { title: "Smt. Prachi H. Dharap", subtitle: "Hon. Chairman Finance Committee", image: "/assets/images/members/4.png" },
  { title: "Smt. Manisha J. Shinde", subtitle: "Hon. Chairman Vigilance Committee", image: "/assets/images/members/5.jpg" },
  { title: "Dr. Ajay Chandanwale", subtitle: "Hon. Member DMER", image: "/assets/images/members/6.jpg" },
  { title: "Mrs. (Dr.) Nilima Sonawane", subtitle: "Hon. Member ADHS (Nursing), Govt. of Mah.", image: "/assets/images/members/7.jpg" },
  { title: "Smt. Archana M. Badhe", subtitle: "Hon. Member SNS, Govt. of Mah.", image: "/assets/images/members/8.jpg" },
  { title: "Smt. Rucha R. Salgaonkar", subtitle: "Hon. Member SNS, BMC", image: "/assets/images/members/9.jpg" },
  { title: "Mr. Pawan K. Dhawad", subtitle: "Hon. Member", image: "/assets/images/members/10.jpg" },
  { title: "Smt. Ekta S. Rangari", subtitle: "Hon. Member", image: "/assets/images/members/11.jpg" },
  { title: "Smt. Anusaya N. Sawargave", subtitle: "Hon. Member", image: "/assets/images/members/12.jpg" },
  { title: "Mr. Vivek H. Bhalerao", subtitle: "Hon. Member", image: "/assets/images/members/13.jpg" },
  { title: "Dr. Vijaykumar Kapse", subtitle: "Hon. Member", image: "/assets/images/members/14.jpg" },
  { title: "Dr. Sudhir B. Deshmukh", subtitle: "Hon. Member", image: "/assets/images/members/15.jpg" },
  { title: "Smt. Vaishali C. Raut", subtitle: "Hon. Member", image: "/assets/images/members/16.jpg" },
  { title: "Smt. Sujata P. Jadhav", subtitle: "Hon. Member", image: "/assets/images/members/17.jpg" },
];

const CouncilMember = ({ type = 1 }) => {
  // const [data, setData] = useState(staticMembers);
  const [data, setData] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Council Members</h1>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Card className="noticeboardCard border-0 my-4 p-2">
          <Card.Body>
            <div className={HomeCss.spotlight2}>
              {data && (
                <Row className="justify-content-center">
                  {data.map((item, i) => (
                    <Col xl={3} md={3} sm={4} xs={6} key={i} className="item text-center">
                      <div className={`${HomeCss.box} my-2 mx-0`} style={{ borderRadius: "8px" }}>
                        {/* <Image
                          src={item.image ? `${process.env.REACT_APP_DATA_SERVER_PATH}${item.image}` : item.image}
                          alt={item.title}
                          height="200px"
                          width="100%"
                        /> */}

                        <FileComponent file={item.image} fileTitle={item.title} fallbackFile="" fileType="image2" />

                        <h3 className="SliderphotoTitle">{item.title}</h3>
                        <h4 className="photoSubtitle">{item.subtitle}</h4>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
  async function getList() {
    try {
      const res = await API.get("/members/listing");
      const result = res.data?.data || [];

      const filtered = result.filter((item) => item.type == type).sort((a, b) => a.order_id - b.order_id);

      setData(filtered);
    } catch (error) {
      show({
        message: error.response?.data?.message || error.message || "Failed to load council members.",
        displayClass: "failure",
      });
    }
  }
};

export default CouncilMember;
