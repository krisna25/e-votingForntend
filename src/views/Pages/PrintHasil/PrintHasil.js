import React, { Component } from 'react';
import ReactToPrint from "react-to-print";
// import PropTypes from "prop-types";
import Header from '../../../containers/HomeLayout/Header';
import Footer from '../../../containers/HomeLayout/Footer';
import "../../../assets/css/warning.css";
import surat from "../../../assets/img/surat.png";
import { fetchApi } from "../../../middleware/api";
import {  Col, Card, CardBody, Badge,Table, Row } from 'reactstrap';
var ResultRekapBantenSits = '';
var RekapBanten = '';
var BantenSumOfVote = 0;
var judul ='';
var statusPublish = false;
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Bantenrekapitulasi:[],
      BantenSumOfVoteState: 0,
      Dapil:this.props.dapil,
      Bagian:this.props.bagian,
    }
  }

  async componentWillMount(){
    var indexDapil = 0;
    //mendapatkan data celeg yang mendapat kursi
    const ResultRekapSits = await fetchApi('/gethasilrekapkursi');
      if(ResultRekapSits){
        if(ResultRekapSits.data.length !== 0){
          if (this.state.Dapil !== null) {
            if (this.state.Dapil === 'Banten1') {
              ResultRekapBantenSits = ResultRekapSits.data[0].hasil;
            }else if (this.state.Dapil === "Banten2") {
              ResultRekapBantenSits = ResultRekapSits.data[1].hasil;
            }else if (this.state.Dapil === "Banten3") {
              ResultRekapBantenSits = ResultRekapSits.data[2].hasil;
            }
          }
        }
      }
      var getAllRekap = await fetchApi("/getRekapitulasi");
      if(getAllRekap){
        if(getAllRekap.data.length !== 0){

          if (this.state.Dapil !== null) {
            if (this.state.Dapil === 'Banten1') {
              RekapBanten = getAllRekap.data[0].vote[0];
              indexDapil = 0;
              judul = 'BANTEN 1'

            }else if (this.state.Dapil === "Banten2") {
              RekapBanten = getAllRekap.data[1].vote[0];
              indexDapil = 1;
              judul = 'BANTEN 2'

            }else if (this.state.Dapil === "Banten3") {
              RekapBanten = getAllRekap.data[2].vote[0];
              indexDapil = 2;
              judul = 'BANTEN 3'
            }
          }
        }
      }
      //menghitung jumlah total user yang telah melakukan vote
      for (
            let index = 0;
            index <  getAllRekap.data[indexDapil].vote[0].length;
            index++ 
          ) {
            const element =  getAllRekap.data[indexDapil].vote[0][index];
              BantenSumOfVote = BantenSumOfVote + element.vote;
          }
      this.setState({
        Bantenrekapitulasi:RekapBanten,
        BantenSumOfVoteState: BantenSumOfVote,
      })
  }

  createTable = (data) => {
    if(data.length !== undefined){
      let table = []
      // Outer loop to create parent
      for (let i = 0; i < data.length; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < 6; j++) {
        //
            if(j === 0) {
              children.push(  
                    <td className="text-center" key={data[i].id} >
                      {i + 1}
                    </td>
                )
            }else if (j === 1) {
              children.push(  
                  <td className="text-center" key={j}>
                    <img style={{height:'2.7em'}} src={data[i].foto} className="img-rounded" alt={data[i].foto} />
                  </td>
              )
            }else if(j === 2){
              children.push(<td style={{width:'30em'}} key={j}>{data[i].nama}</td>)
            }else if(j === 3){
              children.push(<td style={{width:'10em'}} key={j}>{data[i].akronim}</td>)
            }else if (j === 4 ) {
            children.push(  
                <td className="text-center" key={j}>
                  <img style={{height:'2.4em'}} src={data[i].bendera} className="img-rounded" alt={data[i].bendera} />
                </td>
                )
            }else if(j === 5){
              if(data[i].id !== null){
                children.push(
                  <td className="text-center" key={j+1}>
                    <Badge color="success">Mendapat Kursi</Badge>
                  </td>
                )} else{
                  children.push(
                    <td className="text-center" key={j}>
                      <Badge color="danger">Caleg Sedang Ditentukan</Badge>
                    </td>
                  ) 
                }
            }
        }
        //Create the parent and add the children
        table.push(<tr key={i}>{children}</tr>)
      }
      return table
    }
  }

  render() {
    return (
      <div style={{margin:'2.4em'}}>
      <div className="text-center">
        <img src={surat} className="surat img-fluid" alt="surat"  style={{width:'100%',height:'120%',marginBottom:"-4em"}}/>
          <div className="centered" style={{marginBottom:"4em"}}>
              <div
                className="text-center"
                style={{ color: "black", fontSize: "2vmin", lineHeight: "1", marginBottom:'1em' }}
              >
                <b>
                  HASIL REKAPITULASI
                  <br />
                   PEMILIHAN CALON LEGISLATIF DPR RI 
                  <br />
                   PROVINSI {judul}
              </b>
            </div>
          </div>
          
      </div>
      {(this.state.Bagian ==="parpol")?(
      <div>
          <h3 className="text-center"> Hasil Partai Politik</h3>
          <Table responsive striped className="table table-bordered" >
          <thead>
          <tr>
            <th valign="center" className="text-center" rowspan="2">Nama Partai Politik</th>
            <th rowspan="2" className="text-center">Bendera</th>
            <th colspan="2" className="text-center">Perolehan Suara</th>
            <th  rowspan="2" className="text-center">Perolehan Kursi</th>
          </tr>
          <tr>
            <th className="text-center">Persentase</th>
            <th className="text-center">Jumlah Suara</th>
          </tr>
          </thead>
          <tbody>
          {this.state.Bantenrekapitulasi.map((item, i) => (
            <tr key={i}>
              <td style={{width:'25em'}}>
                <div>{item.nama}</div>
                <div className="small text-muted">
                  <span>akronim</span> | {item.akronim}
                </div>
              </td>
              <td className="text-center">
                <img style={{height:'2.4em'}} src={item.bendera} className="img-rounded" alt={item.akronim} />
              </td>
              <td  className="text-center">
                <strong>{Math.round((item.vote / this.state.BantenSumOfVoteState) * 100)}%</strong>
              </td>
              <td className="text-center">{item.vote}</td>
              <td className="text-center">{item.sits}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
      ):(
      <div>
        <h3 className="text-center"> Calon Legislatif yang mendapatkan kursi</h3>
       <Table responsive striped>
          <thead>
          <tr>
            <th className="text-center">No</th>
            <th className="text-center">Foto Caleg</th>
            <th>Nama Caleg</th>
            <th>Nama Partai </th>
            <th className="text-center">Bendera</th>
            <th className="text-center">Status</th>
          </tr>
          </thead>
          <tbody>
            {this.createTable(ResultRekapBantenSits)}
          </tbody>
        </Table>
      </div>
      )}
      </div>
    );
  }
}
   
class PrintHasil extends Component {
  constructor(props) {
    super(props);
    this.state={
      statusLifeCircle : '',

    }
  } 

  async componentWillMount(){
    const DataStatus = await fetchApi("/getStatusVote");
    const voteLifeCircle = await fetchApi("/getVoteLifeCircle");
    if (DataStatus.status === 500 || voteLifeCircle.status === 500) {
      return this.props.history.push("/500");
    }else{
        this.setState({
          statusLifeCircle : voteLifeCircle.data[0].status
        })
        statusPublish = DataStatus.data[2].status;
      }
  }
  render() {
    return (
      <div className="animated fadeIn" style={{marginBottom:'4em'}}>
           <Header/>
           <Row >
            <Col xs="12" xl="12"> 
              <Card>
                <CardBody className="bg-gray-100" style={{marginBottom:'-4em',marginLeft:'-1em'}}>
                  {(statusPublish === true && this.state.statusLifeCircle === 3) || (statusPublish === true && this.state.statusLifeCircle === 5 )? ( 
                  <div>
                  <ReactToPrint
                      trigger={() => <a className="btn btn-success" title="Print" href="#!">
                      <i className="icon-printer icons font-4xl d-block mt-2" ></i>Print Tabel
                      </a>}
                      content={() => this.componentRef}
                    />
                    <ComponentToPrint bagian={this.props.history.location.search.split('=')[2]} dapil={this.props.history.location.search.split('=')[1].split("?")[0]} ref={el => (this.componentRef = el)} />
                  </div>
                  ):(
                    <div>
                      {this.state.statusLifeCircle !== '' &&
                      <div className="jumbotron jumbotron-fluid text-center"><div className="container-fluid"><h1 className="display-3">Tidak Dapat Melakukan Print</h1><p className="lead">Maaf anda tidak dapat Melakukan Print</p></div></div>
                      }
                    </div>
                  )}
                  </CardBody>
              </Card>
            </Col>
          </Row>
          <Footer/>
      </div>
    );
  }
}

export default PrintHasil;
