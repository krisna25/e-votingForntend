import React, { Component } from 'react';
import { fetchApi } from "../../../middleware/api";
import { postApi } from "../../../middleware/api";
import { tokenAuth } from "../../../middleware/cookies-manager";
import "../../../assets/css/registerAndLogin.css";
import Cookies from "js-cookie";
import Header from '../../../containers/HomeLayout/Header';
import Footer from '../../../containers/HomeLayout/Footer';
import InfoCaleg from '../../../containers/HomeLayout/InfoCaleg';
import Notification from '../../../containers/HomeLayout/Notification';
import LifeVoteCircle from '../../../containers/HomeLayout/LifeVoteCircle';
import { Card, CardBody, Alert,NavLink,Nav,Progress,Button,NavItem,TabContent,TabPane,CardHeader,Table, Col, Row,Badge} from 'reactstrap';
import classnames from 'classnames';
var statusPublish = false;
var Banten1SumOfVote = 0;
var Banten2SumOfVote = 0;
var Banten3SumOfVote = 0;
var loginStatus = '';
var userrole ='';
var suara ='0';
var bendera='';
var namaPartai='';
var fotoCaleg='';
var calegDapil='';
var calegid='';
var ResultRekapBanten1Sits = [];
var ResultRekapBanten2Sits = [];
var ResultRekapBanten3Sits = [];
var namaCaleg='Nama Caleg';
var dataforinfo='';



class Hasil extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      id:'',
      Banten1SumOfVoteState: 0,
      Banten2SumOfVoteState: 0,
      Banten3SumOfVoteState: 0,
      banten1: { category: "Banten1", seats: 6 },
      banten2: { category: "Banten2", seats: 6 },
      banten3: { category: "Banten3", seats: 10 },
      Banten1rekapitulasi: [],
      Banten2rekapitulasi: [],
      Banten3rekapitulasi: [],
      statusLifeCircle : '',
      Banten1SumOfCalegSitsState: 0,
      Banten2SumOfCalegSitsState: 0,
      Banten3SumOfCalegSitsState: 0,
      pesanRekapitulasi:'',
      activeTab: '1',
      activeTabDapil:'1',
    };
    this.toggle = this.toggle.bind(this);
    this.toggleDapil = this.toggleDapil.bind(this);
  }
  
  toggleDapil(tab) {
    if (this.state.activeTabDapil !== tab) {
      this.setState({
        activeTabDapil: tab,
      });
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  async componentWillMount() {
    try {
      const kursi = await fetchApi("/getkursi");
      if(kursi.status === 200){
        this.setState({
          banten1: { category: kursi.data[0].dapil, seats: kursi.data[0].kursi },
          banten2: { category: kursi.data[1].dapil, seats: kursi.data[1].kursi },
          banten3: { category: kursi.data[2].dapil, seats: kursi.data[2].kursi },
        })
      }
      //mengambil hasil rekap kursi
      const ResultRekapSits = await fetchApi('/gethasilrekapkursi');
      console.log(ResultRekapSits.data)
      if(ResultRekapSits){
        if(ResultRekapSits.data.length !== 0){
          ResultRekapBanten1Sits = ResultRekapSits.data[0].hasil
          ResultRekapBanten2Sits = ResultRekapSits.data[1].hasil
          ResultRekapBanten3Sits = ResultRekapSits.data[2].hasil
          }
      }
      console.log(ResultRekapBanten1Sits)
     
      //token User data
      const userData = tokenAuth.tokenAuthenticated();
      //mengambil status vote dan lifecircle
      const DataStatus = await fetchApi("/getStatusVote");
      const voteLifeCircle = await fetchApi("/getVoteLifeCircle");
      if (DataStatus.status === 500 || voteLifeCircle.status === 500) {
        return this.props.history.push("/500");
      }else{
          this.setState({
            statusLifeCircle : voteLifeCircle.data[0].status
          })

          console.log(this.state.statusLifeCircle)
          statusPublish = DataStatus.data[2].status;
          var getAllRekap = await fetchApi("/getRekapitulasi");
        //memberikan pesan ketika lifevote tidak sesuai
          if(this.state.statusLifeCircle === 3 && statusPublish === true){
            this.setState({
              pesanRekapitulasi :"Ini adalah hasil rekapitulasi resmi tahap pemungutan suara. Masih terdapat tahapan sengketa yang akan dilalui. Hasil tahapan putusan sengketa yang telah di putus dan bersifat final akan dilaksanakan oleh KPUD Provinsi Banten, dimana setelah itu akan diumumkan hasil akhir perolehan suara dan kursi Calon Legislatif DPR provinsi Banten. Diharapkan semua pihak dapat menenunggu."
            })
          }else if(this.state.statusLifeCircle === 5 && statusPublish === true){
            this.setState({
              pesanRekapitulasi :"Ini adalah hasil akhir rekapitulasi setelah melalui proses penyelesaian sengketa oleh KPUD Provinsi Banten. Diharapkan semua pihak dapat menerima hasil tersebut dengan lapang dada."
            })
          }
          //mengecek apakah user melakukan login atau tidak
          if (userData.authToken === true) {
            loginStatus=true
            userrole = userData.dataToken.role
           //mengecek apakah user berstatus sebagai pemilih biasa
            if(userrole === 1){
              if (userData.dataToken.log !== null) {
                const logUser = userData.dataToken.log.split('/');
                this.setState({
                  id:logUser[1]
                })
              }else{
                this.setState({
                  id:Cookies.get("id")
                })
              }
              const resultOfCaleg = await postApi('/getCalegbyId',this.state)
              suara = resultOfCaleg.data[0].vote;
              bendera = resultOfCaleg.data[0].idParpol.bendera;
              namaCaleg = resultOfCaleg.data[0].name;
              namaPartai = resultOfCaleg.data[0].idParpol.akronim;
              fotoCaleg = resultOfCaleg.data[0].img;
              calegDapil = resultOfCaleg.data[0].category;
              calegid = resultOfCaleg.data[0]._id;
              
              if(resultOfCaleg.data[0].category === "Banten1"){
                dataforinfo = ResultRekapBanten1Sits;
              }else if(resultOfCaleg.data[0].category === "Banten2"){
                dataforinfo = ResultRekapBanten2Sits;
              }else if(resultOfCaleg.data[0].category === "Banten3"){
                dataforinfo = ResultRekapBanten3Sits;
              }
            }
          }else{
            loginStatus = false
          }
         //menghitung jumlah total user yang telah melakukan vote
          for (let index1 = 0; index1 < getAllRekap.data.length; index1++) {
            console.log("masuk for ",getAllRekap.data[index1].vote[0])
            if(getAllRekap.data[index1].vote[0] !== "new vote"){
              console.log("mausk",index1 )
              for (
                let index = 0;
                index <  getAllRekap.data[index1].vote[0].length;
                index++ 
              ) {
                const element =  getAllRekap.data[index1].vote[0][index];
                if(index1 === 0){
                  Banten1SumOfVote = Banten1SumOfVote + element.vote;
                }else if(index1 === 1){
                  Banten2SumOfVote = Banten2SumOfVote + element.vote;
                }else if(index1 === 2)
                  Banten3SumOfVote = Banten3SumOfVote + element.vote;
              }
            }
          }

          //mengecek apakah hasil rekap seluruh data ada atau tidak
          if( getAllRekap.data[0].vote[0] !== "new vote"){
            this.setState({
              Banten1rekapitulasi: getAllRekap.data[0].vote[0],
              Banten1SumOfVoteState: Banten1SumOfVote,
              Banten1SumOfCalegSitsState :ResultRekapBanten1Sits,
            })
          }
          if( getAllRekap.data[1].vote[0] !== "new vote"){
            this.setState({
              Banten2rekapitulasi: getAllRekap.data[1].vote[0],
              Banten2SumOfVoteState: Banten2SumOfVote,
              Banten2SumOfCalegSitsState : ResultRekapBanten2Sits,
            })
          }
          if( getAllRekap.data[2].vote[0] !== "new vote"){
            this.setState({
              Banten3rekapitulasi: getAllRekap.data[2].vote[0],
              Banten3SumOfVoteState: Banten3SumOfVote,
              Banten3SumOfCalegSitsState : ResultRekapBanten3Sits,
            });
          }
      }
    }
    catch (error) {
      console.log(error)
    }
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
    {console.log(this.state.statusLifeCircle)}
    return (
      <div className="animated fadeIn loginbackground" style={{padding:'0px'}} >
        <Row >
          <Col xs="12" xl="12" style={{padding:'0px'}}> 
            <Card>
              <Header/>
            </Card>
          </Col>
            {this.state.statusLifeCircle !== '' && 
              <Col xs="12" md="12" xl="12"> 
                <h2 className='text-center'>Tahapan E-Voting Pemilihan Anggota Calon Legislatif DPR RI Provinsi Banten</h2>
                <i>*tanda biru menandakan tahapan proses yang sedang berlangsung</i>
                <LifeVoteCircle  lifecirclestatus = {this.state.statusLifeCircle} />
              </Col>
            }
        </Row>
          {(statusPublish === true && this.state.statusLifeCircle === 3) || (statusPublish === true && this.state.statusLifeCircle === 5 )? ( 
            <Row style={{height:'100%',marginTop:'-1em', paddingTop:'1em',paddingRight:'2em',paddingLeft:'2em',paddingBottom:'4em'}}>
                <Col>
                  <Alert color="info" style={{width:'100%',textAlign:'center'}}>
                    <h4 className="alert-heading">Disclaimer!</h4>
                    <p>
                      {this.state.pesanRekapitulasi}
                      </p>
                    <hr />
                    <p className="mb-0">
                      Terima kasih!!
                    </p>
                  </Alert>
                  <div>
                    { loginStatus === true && userrole === 1 && 
                      <InfoCaleg id={calegid} namaPartai = {namaPartai} fotoCaleg ={fotoCaleg} namaCaleg={namaCaleg} suara={suara} bendera={bendera} dapil={calegDapil} rekapkursi={dataforinfo} />
                    } 
                  </div>
                <Col xs="12" md="12" className="mb-4">
                    
                    <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTabDapil === '1' })}
                        onClick={() => { this.toggleDapil('1'); }}
                      >
                        Dapil Banten 1
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTabDapil === '2' })}
                        onClick={() => { this.toggleDapil('2'); }}
                      >
                        Dapil Banten 2
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTabDapil === '3' })}
                        onClick={() => { this.toggleDapil('3'); }}
                      >
                        Dapil Banten 3
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTabDapil}>
                    <TabPane tabId="1">
                      <Col xs="12" md="12" className="mb-4">
                        <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '1' })}
                              onClick={() => { this.toggle('1'); }}
                            >
                              <i className="icon-drawer"></i> <span className={this.state.activeTab === '1' ? '' : 'd-none'}>Rekapitulasi Partai Politik </span>{'\u00A0'}<Badge
                              color="success"> Total Parpol {this.state.Banten1rekapitulasi.length}</Badge>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '2' })}
                              onClick={() => { this.toggle('2'); }}
                            >
                              <i className="icon-user"></i> <span
                              className={this.state.activeTab === '2' ? '' : 'd-none'}>Rekapitulasi Calon Legislatif </span>{'\u00A0'}<Badge pill color="danger">Total kursi diperebutkan {this.state.banten1.seats}</Badge>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Parpol Dapil Banten I 
                                {this.state.Banten1rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten1?bagian=parpol'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten1rekapitulasi.length === 0 ? (
                                  <Alert color="warning">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
                                  <Table responsive striped>
                                    <thead>
                                    <tr>
                                      <th>Nama Partai Politik</th>
                                      <th className="text-center">Bendera</th>
                                      <th className="text-center">Perolehan Suara</th>
                                      <th className="text-center">Perolehan Kursi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    
                                    {this.state.Banten1rekapitulasi.map((item, i) => (
                                      <tr key={item.id}>
                                        <td>
                                          <div>{item.nama}</div>
                                          <div className="small text-muted">
                                            <span>akronim</span> | {item.akronim}
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          <img style={{height:'2.4em'}} src={item.bendera} className="img-rounded" alt={item.akronim} />
                                        </td>
                                        <td style={{width:'25em'}}>
                                          <div className="clearfix">
                                            <div className="float-left">
                                              <strong>{Math.round((item.vote / this.state.Banten1SumOfVoteState) * 100)}%</strong>
                                            </div>
                                            <div className="float-right">
                                              <small className="text-muted">jumlah suara {item.vote}</small>
                                            </div>
                                          </div>
                                          <Progress animated className="progress-xs" color="danger"  value={Math.round((item.vote / this.state.Banten1SumOfVoteState) * 100)} />
                                        </td>
                                        <td className="text-center">{item.sits}</td>
                                      </tr>
                                    ))}
                                    </tbody>
                                  </Table>
                                  )}
                              </CardBody>
                            </Card>
                          </TabPane>
                          <TabPane tabId="2">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Caleg  Banten I 
                                {this.state.Banten1rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten1?bagian=caleg'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten1rekapitulasi.length === 0 ? (
                                  <Alert color="primary">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
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
                                    {this.createTable(this.state.Banten1SumOfCalegSitsState)}
                                  </tbody>
                                </Table>
                                )}
                              </CardBody>
                            </Card>
                          </TabPane>
                        </TabContent>
                      </Col>
                    </TabPane>
                    <TabPane tabId="2">
                      <Col xs="12" md="12" className="mb-4">
                      <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '1' })}
                              onClick={() => { this.toggle('1'); }}
                            >
                              <i className="icon-drawer"></i> <span className={this.state.activeTab === '1' ? '' : 'd-none'}>Rekapitulasi Partai Politik </span>{'\u00A0'}<Badge
                              color="success"> Total Parpol {this.state.Banten2rekapitulasi.length}</Badge>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '2' })}
                              onClick={() => { this.toggle('2'); }}
                            >
                              <i className="icon-user"></i> <span
                              className={this.state.activeTab === '2' ? '' : 'd-none'}>Rekapitulasi Calon Legislatif </span>{'\u00A0'}<Badge pill color="danger">Total kursi diperebutkan {this.state.banten2.seats}</Badge>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Parpol Dapil Banten II
                                {this.state.Banten2rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten2?bagian=parpol'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten2rekapitulasi.length === 0 ? (
                                  <Alert color="warning">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
                                <Table responsive striped>
                                  <thead>
                                  <tr>
                                    <th>Nama Partai Politik</th>
                                    <th className="text-center">Bendera</th>
                                    <th className="text-center">Perolehan Suara</th>
                                    <th className="text-center">Perolehan Kursi</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {this.state.Banten2rekapitulasi.map((item, i) => (
                                    <tr key={i}>
                                      <td>
                                        <div>{item.nama}</div>
                                        <div className="small text-muted">
                                          <span>akronim</span> | {item.akronim}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <img style={{height:'2.4em'}} src={item.bendera} className="img-rounded" alt={item.akronim} />
                                      </td>
                                      <td style={{width:'25em'}}>
                                        <div className="clearfix">
                                          <div className="float-left">
                                            <strong>{Math.round((item.vote / this.state.Banten2SumOfVoteState) * 100)}%</strong>
                                          </div>
                                          <div className="float-right">
                                            <small className="text-muted">jumlah suara {item.vote}</small>
                                          </div>
                                        </div>
                                        <Progress animated className="progress-xs" color="success"  value={Math.round((item.vote / this.state.Banten2SumOfVoteState) * 100)} />
                                      </td>
                                      <td className="text-center">{item.sits}</td>
                                    </tr>
                                  ))}
                                  </tbody>
                                </Table>
                                )}
                              </CardBody>
                            </Card>
                          </TabPane>
                          <TabPane tabId="2">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Caleg Dapil Banten II
                                {this.state.Banten2rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten2?bagian=caleg'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten2rekapitulasi.length === 0 ? (
                                  <Alert color="warning">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
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
                                  {this.createTable(this.state.Banten2SumOfCalegSitsState)}
                                  </tbody>
                                </Table>
                                )}
                              </CardBody>
                            </Card>
                          </TabPane>
                        </TabContent>
                      </Col>
                    </TabPane>
                    <TabPane tabId="3">
                      <Col xs="12" md="12" className="mb-4">
                      <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '1' })}
                              onClick={() => { this.toggle('1'); }}
                            >
                              <i className="icon-drawer"></i> <span className={this.state.activeTab === '1' ? '' : 'd-none'}>Rekapitulasi Partai Politik </span>{'\u00A0'}<Badge
                              color="success"> Total Parpol {this.state.Banten3rekapitulasi.length}</Badge>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '2' })}
                              onClick={() => { this.toggle('2'); }}
                            >
                              <i className="icon-user"></i> <span
                              className={this.state.activeTab === '2' ? '' : 'd-none'}>Rekapitulasi Calon Legislatif </span>{'\u00A0'}<Badge pill color="danger">Total kursi diperebutkan {this.state.banten3.seats}</Badge>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Parpol Dapil Banten III
                                {this.state.Banten3rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten3?bagian=parpol'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten3rekapitulasi.length === 0 ? (
                                  <Alert color="warning">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
                                <Table responsive striped>
                                  <thead>
                                  <tr>
                                    <th>Nama Partai Politik</th>
                                    <th className="text-center">Bendera</th>
                                    <th className="text-center">Perolehan Suara</th>
                                    <th className="text-center">Perolehan Kursi</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {this.state.Banten3rekapitulasi.map((item, i) => (
                                    <tr key={i}>
                                      <td>
                                        <div>{item.nama}</div>
                                        <div className="small text-muted">
                                          <span>akronim</span> | {item.akronim}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <img style={{height:'2.4em'}} src={item.bendera} className="img-rounded" alt={item.akronim} />
                                      </td>
                                      <td style={{width:'25em'}}>
                                        <div className="clearfix">
                                          <div className="float-left">
                                            <strong>{Math.round((item.vote / this.state.Banten3SumOfVoteState) * 100)}%</strong>
                                          </div>
                                          <div className="float-right">
                                            <small className="text-muted">jumlah suara {item.vote}</small>
                                          </div>
                                        </div>
                                        <Progress animated className="progress-xs" color="info"  value={Math.round((item.vote / this.state.Banten3SumOfVoteState) * 100)} />
                                      </td>
                                      <td className="text-center">{item.sits}</td>
                                    </tr>
                                  ))}
                                  </tbody>
                                </Table>
                                )}
                              </CardBody>
                            </Card>
                          </TabPane>
                          <TabPane tabId="2">
                            <Card>
                              <CardHeader>
                                <i className="fa fa-align-justify"></i> Hasil Rekapitulasi Caleg Dapil Banten III
                                {this.state.Banten3rekapitulasi.length !== 0 &&(
                                  <Button title="print" onClick={
                                  ()=>this.props.history.push({
                                    pathname: '/home/hasil/print',
                                    search: '?daerah=Banten3?bagian=caleg'})
                                } 
                                  className="bg-success pull-right"> <i class="icon-printer icons font-3xl" ></i></Button>
                                )}
                              </CardHeader>
                              <CardBody>
                              {this.state.Banten3rekapitulasi.length === 0 ? (
                                  <Alert color="warning">
                                      Hasil voting belum tersedia. 
                                  </Alert>
                                ):(
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
                                  {this.createTable(this.state.Banten3SumOfCalegSitsState)}
                                  </tbody>
                                </Table>
                                )}
                              </CardBody>
                            </Card>
                          </TabPane>
                        </TabContent>
                      </Col>
                    </TabPane>
                  </TabContent>
                </Col>
              </Col> 
          </Row>
          ):(
            <div>
              {this.state.statusLifeCircle !== '' &&
                <Notification  lifecirclestatus = {this.state.statusLifeCircle}  publishStatus = {statusPublish} />
              }
            </div>
          )}
           <div>
      </div>
          <Footer/>
      </div>
    );
  }
}

export default Hasil;
