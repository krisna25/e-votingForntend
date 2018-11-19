import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import gambar from "../../../assets/img/forbidden.png";
import "../../../assets/css/warning.css";

class Page403 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center warning-background">
        <Container>
          <Row className="justify-content-center">
            <img src={gambar} className="img-circle warning-img" />
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">403</h1>
                <h4 className="pt-3">
                  Oops! Kamu tidak diizinkan untuk mengakses halaman ini.
                </h4>
                <p className="text-muted float-left">
                  Silahkan lakukan login <a href="/login" >disini</a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page403;
