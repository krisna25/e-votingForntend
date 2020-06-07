import React, { Component } from 'react';
import gambar from "../../../assets/img/warning.png";
import "../../../assets/css/warning.css";
import { Col, Container, Row } from 'reactstrap';

class Page500 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center warning-background">
      <Container>
        <Row className="justify-content-center">
          <img src={gambar} className="rounded warning-img" alt="gambar" />
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">500</h1>
              <h4 className="pt-3">
                Oops! terjadi kesalahan.
              </h4>
              <p className="text-muted float-left">
                permintaan yang anda minta saat ini tidak dapat diproses. <br/>karena terjadi kesalahan pada internal server
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    );
  }
}

export default Page500;
