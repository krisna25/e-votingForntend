import React, { Component } from 'react';
import { Col,Card,CardHeader,CardBody,Jumbotron,Row } from 'reactstrap';
var JudulPesan = '';
var Pesan = '';
class NotificationVote extends Component {

  render() {
    const {lifecirclestatus,pesanvote,voteStatus} = this.props;
      if (lifecirclestatus === 0){
          JudulPesan = "E-Voting belum dimulai!";
          Pesan = "Proses voting atau pengambilan suara saat ini belum dimulai. Tunggu berita atau kabar selanjutnya. Tetap semangat untuk memberikan kontribusi kepada negeri ini. "+ pesanvote;
      }else if(voteStatus === false) {
          JudulPesan = "akses voting ditutup!";
          Pesan = "Saat ini anda belum dapat melakukan voting. Akses tidak diberikan.";
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

export default NotificationVote;
