import React, { Component } from 'react';
import gambar from "../../../assets/img/notFound.png";
import "../../../assets/css/warning.css";
import { Col, Container, Row } from 'reactstrap';

class Page404 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center warning-background">
        <Container>
          <Row className="justify-content-center">
            <img alt="gambar warning" src={gambar} className="img-circle warning-img" />
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">
                  Oops! Anda tersesat.
                </h4>
                <p className="text-muted float-left">
                  Halaman yang anda cari tidak dapat ditemukan. <br/>Silakan kembali ke <a href="/">halaman  utama</a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page404;
