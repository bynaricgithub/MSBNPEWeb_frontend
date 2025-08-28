import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";

function ScreenReaderAccess() {
  return (
    <>
      <div className="commonSubheader">
        <Container>
          <Row>
            <Col lg={12}>
              <h1 className="innercommTitle">Screen Reader Access</h1>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="justify-content-center my-5">
        <Table responsive className="pdfTables">
          <thead>
            <tr>
              <th className="tbl_heading" scope="col">
                Screen Reader
              </th>
              <th className="tbl_heading" scope="col">
                Website
              </th>
              <th classNAme="tbl_heading" scope="col">
                Free / Commercial
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Screen Access For All (SAFA)</td>
              <td>
                <a href="https://safa.sourceforge.net/" target={"_blank"}>
                  https://safa.sourceforge.net/
                </a>
              </td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Non Visual Desktop Access (NVDA)</td>
              <td>
                <a href="https://www.nvaccess.org/ " target={"_blank"}>
                  https://www.nvaccess.org/
                </a>
              </td>
              <td>Free</td>
            </tr>
            <tr>
              <td>System Access To Go</td>
              <td id="safa">
                <a href="https://www.satogo.com/ " target={"_blank"}>
                  https://www.satogo.com/
                </a>
              </td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Thunder</td>
              <td>
                <a href="https://www.webbie.org.uk/thunder/" target={"_blank"}>
                  https://www.webbie.org.uk/thunder/
                </a>
              </td>
              <td>Free</td>
            </tr>
            <tr>
              <td>WebAnywhere</td>
              <td>
                <a href="https://webinsight.cs.washington.edu/wa/" target={"_blank"}>
                  https://webinsight.cs.washington.edu/wa/
                </a>
              </td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Hal</td>
              <td>
                <a href="https://yourdolphin.com/ScreenReader" target={"_blank"}>
                  https://yourdolphin.com/ScreenReader
                </a>
              </td>
              <td>Commercial</td>
            </tr>
            <tr>
              <td>JAWS</td>
              <td>
                <a href="https://support.freedomscientific.com/Downloads/JAWS" id="safa7">
                  https://support.freedomscientific.com/Downloads/JAWS
                </a>
              </td>
              <td>Commercial</td>
            </tr>
            <tr>
              <td>Supernova</td>
              <td>
                <a href="https://yourdolphin.com/SuperNova/Home" target={"_blank"}>
                  https://yourdolphin.com/SuperNova/Home
                </a>
              </td>
              <td>Commercial</td>
            </tr>
            <tr>
              <td>Window-Eyes</td>
              <td>
                <a href="https://www.gwmicro.com/Window-Eyes/" target={"_blank"}>
                  https://www.gwmicro.com/Window-Eyes/
                </a>
              </td>
              <td>Commercial</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default ScreenReaderAccess;
