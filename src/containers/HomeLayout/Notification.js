import React, { Component } from 'react';
import { Col,Card,CardHeader,CardBody,Jumbotron,Row } from 'reactstrap';
var JudulPesan ='';
var Pesan= '';
class Notification extends Component {

  render() {
    const {lifecirclestatus} = this.props;
    const {publishStatus} = this.props;
    if (lifecirclestatus === 0){
        JudulPesan="Hasil belum tersedia!";
        Pesan = "Saat ini proses Voting belum dimulai. Silahkan menunggu..!";
    }else if(lifecirclestatus === 1) {
        JudulPesan = "Hasil belum tersedia!";
        Pesan = "Saat ini proses Voting atau pemungutan suara masih berlangsung. Silahkan menunggu..!";
    }else if(lifecirclestatus === 2) {
        JudulPesan  ="Hasil Masih dalam proses!";
        Pesan = "Saat ini anda belum dapat melihat hasil. Proses Rekapitulasi masih berlangsung. Silahkan Menunggu..!.";
    }else if(lifecirclestatus === 4) {
        JudulPesan = "Hasil Masih dalam proses!";
        Pesan = "Saat ini hasil masih dalam tahapan penyelesaian sengketa oleh KPUD Provinsi Banten. Silahkan Menunggu..!";
    }
    if(publishStatus === false) {
        JudulPesan = "Hasil belum tersedia!";
        Pesan = "Saat ini anda belum dapat melihat hasil. Akses tidak diberikan.";
    }
    return (
      <React.Fragment>
        <Row className="loginbackground" style={{height:'100%',marginTop:'2.5em',paddingBottom:'2.5em', paddingTop:'1em',paddingLeft:'1em',paddingRight:'1em  '}}>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-warning"></i><strong>Pengumuman!!</strong>
              </CardHeader>
              <CardBody>
                <Jumbotron>
                  <h1 className="display-3">Maaf, {JudulPesan}</h1>
                  <p className="lead">{Pesan}</p>
                  <hr className="my-2" />
                  <p>Semua proses diatur oleh KPU</p>
                </Jumbotron>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Notification;
