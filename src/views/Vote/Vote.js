import React, { Component } from 'react';
import { Card, CardBody, CardColumns, CardHeader,Table,Alert,Button,Row,Col} from 'reactstrap';
import { tokenAuth } from "../../middleware/cookies-manager";
import { postApi } from "../../middleware/api";
import { fetchApi } from "../../middleware/api";
import surat from "../../assets/img/surat.png"
import Cookies from "js-cookie";
import swal from 'sweetalert';
import { withRouter } from "react-router-dom";
import Notification from '../../containers/HomeLayout/NotificationVote';
var moment = require('moment');
class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCaleg: [],
      dataParpols:[],
      titleVote: "",
      dateNow: new Date(),
      voteDisable: "",
      rekapitulasiStatus :"",
      votingStatus:"",
      pesanVoting :"",
      benderaParpolTerpilih:"",
      namaPartaiTerpilih:"",
      namaCalegTerpilih:"",
      lifecirclestatus:'',
    };
    this.onHandleVote = this.onHandleVote.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async onHandleVote(idCaleg,nama,akronim,bendera) {
    const willVote = await swal({
      title: "Anda Yakin?",
      text: "Memilih caleg "+nama+" dari Partai "+ akronim +" ?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    })
    if (willVote) {
      const userData = tokenAuth.tokenAuthenticated();
      const idUser = userData.dataToken._id;
      const log = userData.dataToken.log;
      
      if (log === null) {
          const newLog = this.state.dateNow + "/" + idCaleg + "/" + idUser;
          await postApi("/addLog", { idUser, newLog });
          await postApi("/voteAll-caleg", { idCaleg });
          this.setState({ voteStatus: "finised" });
          Cookies.set("VoteStatus", "True");
          Cookies.set("namaCaleg", nama);
          Cookies.set("namaPartai", akronim);
          Cookies.set("id",idCaleg)
          Cookies.set("bendera",bendera)
          this.setState({
            namaCalegTerpilih :  nama ,
            namaPartaiTerpilih: akronim,
            benderaParpolTerpilih: bendera,
            
          })
      }
      swal("Berhasil!", "Pilihan anda sudah tervote!", "success");
    }
  }

  async handleLogout() {
    const willLogout = await swal({
      title: "Anda Yakin?",
      text: "Anda yakin ingin keluar ",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    })
    if (willLogout) {
      tokenAuth.eraseCookies();
      this.props.history.push("/login");
    }
  }

  async componentWillMount() {
    try { 
      const userData = tokenAuth.tokenAuthenticated();
      const userRole = userData.dataToken.role;
      if(userRole === 0){
        return this.props.history.push("/403");
      }
      const voteLifeCircle = await fetchApi("/getVoteLifeCircle");
      this.setState({
        lifecirclestatus: voteLifeCircle.data[0].status
      })
      const parpolData = await  fetchApi("/getAllParpols");
      //get value from cookies
      const nama = Cookies.get("namaCaleg");
      const parpol = Cookies.get("namaPartai");
      const benderaPartai = Cookies.get("bendera");
      const status = Cookies.get("VoteStatus");
      const votingStatus = await fetchApi("/getStatusVote");
      const loguser = userData.dataToken.log;
      if (votingStatus.status !== 500 ) {
        this.setState({
          votingStatus : votingStatus.data[1].status,
          rekapitulasiStatus : votingStatus.data[0].status,
          pesanVoting:"Voting akan dimulai dari "+  moment(votingStatus.data[1].timeStart).format('LLLL') +" hingga " + moment(votingStatus.data[1].timeEnd).format('LLLL')
        })
      }

      const ktp = userData.dataToken.noKtp;
      const ktpRegion = ktp.substring(2, 4);
      var data = [];
      if (ktpRegion === "01" || ktpRegion === "02") {
        data = await fetchApi("/getcalegbanten1");
        this.setState({
          titleVote: "I"
        });
      } else if (ktpRegion === "04" || ktpRegion === "72" || ktpRegion === "73") {
        data = await fetchApi("/getcalegbanten2");
        this.setState({
          titleVote: "II"
        });
      } else if (ktpRegion === "03" || ktpRegion === "71" || ktpRegion === "74") {
        data = await fetchApi("/getcalegbanten3");
        this.setState({
          titleVote: "III"
        });
      }
      if (userRole === 0) {
        this.setState({ voteDisable: false });
      } else {
        this.setState({ voteDisable: true });
      }
      this.setState({
        dataParpols: parpolData.data,
        dataCaleg: data.data
      });
      //cek status cookies agar tidak memilih 2 kali
      if (votingStatus.data[1].status === true) {
        if (loguser !== null || status === "True") {
          this.setState({ 
            voteStatus: "finised",
          });
          if (loguser !==null) {
            var log = loguser.split('/')
            var id = log[1];
            const datacalegterpilih = await postApi("/getCalegbyId",{id});
            this.setState({
              namaCalegTerpilih :  datacalegterpilih.data[0].name ,
              namaPartaiTerpilih: datacalegterpilih.data[0].idParpol.akronim +" pada "+log[0],
              benderaParpolTerpilih: datacalegterpilih.data[0].idParpol.bendera,
            })
          }else{
            this.setState({
              namaCalegTerpilih: nama,
              namaPartaiTerpilih: parpol,
              benderaParpolTerpilih: benderaPartai,
            })
          }
          swal("Selamat datang kembali", "Hasil rekapitulasi hanya dapat dilihat ketika proses voting atau pemumutan suara selesai dilakukan.","info");
        }else{
          const voteWellcome = await swal({
            title: "Selamat Datang...",
            text: "'Dengan ikut memilih berarti anda menjadi seseorang yang dapat menentukan masa depan Indonesia yang lebih cemerlang'",
            icon: "success",
            dangerMode: true,
            cancel: true,
            buttons: [true, "Langkah Memilih!"],
            
          })
          if (voteWellcome) {
            swal("langkah Memilih", "Pilih caleg pilihan anda dengan menekan gambar atau ikon lingkaran merah yang terdapat pada setiap nama caleg. kemudian konfirmasi pilihan anda dengan menekan tombol YES, jika anda ragu atau tidak yakin anda dapat menekan tombol CANCEL ");
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="animated fadeIn bg-white" style={{paddingBottom:'3em'}}>
        {this.state.votingStatus === false ? (  
          <div className="animated fadeIn">
            {this.state.lifecirclestatus !== '' &&
                <Notification  pesanvote = {this.state.pesanVoting} lifecirclestatus = {this.state.lifecirclestatus}  voteStatus = {this.state.votingStatus} />
            }
          </div>
        ) : (
        <div> 
        <img src={surat} className="surat img-fluid" alt="surat"  style={{width:'100%',height:'5%',marginBottom:"-4em"}}/>
        <div className="centered" style={{marginBottom:"4em"}}>
            <div
              className="text-center"
              style={{ color: "black", fontSize: "4vmin", lineHeight: "1", marginBottom:'1em' }}
            >
              <b>
                SURAT SUARA<br />PEMILIHAN UMUM
              </b>
            </div>
            <div className="text-center" style={{ fontSize: "2vmin" }}>
            <b>
              {this.titleVote}
              LEGISLATIF DPR PROVINSI BANTEN {this.state.titleVote}
              <br />REPUBLIK INDONESIA<br />
            </b>
          </div>
        </div>
          {this.state.voteStatus === "finised" ? (
            <div>
              <div className="col-md-6" style={{marginLeft:'25%',marginBottom:'5em'}}>
                <div className="alert alert-success fade show  " role="alert">
                  <h4 className="alert-heading">Terima Kasih..</h4>
                    <p> Anda telah berpartisipasi dalam pemilihan legislatif DPR Banten {this.state.titleVote} </p> 
                    <hr/>
                    <p className="mb-0"> Ada Telah Memilih Caleg <b> {this.state.namaCalegTerpilih} </b> dari partai <b>{this.state.namaPartaiTerpilih} </b></p> 
                </div>
                <div className="text-center">
                  <img className="img-rounded" src={this.state.benderaParpolTerpilih} style={{width:'5em'}}></img>
                </div>
              </div>
              <div className="col-md-8" style={{marginLeft:'13em'}}>
              <Row className="align-items-center">
                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <Button  color="primary" className="btn btn-primary btn-pill text-white" onClick={()=>this.props.history.push("/home")} style={{width:'100%'}}>Home</Button>
                </Col>
                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <Button  color="success" className="btn btn-success btn-pill text-white"  onClick={()=>this.props.history.push("/home/hasil")} style={{width:'100%'}}>Hasil</Button>
                </Col>
                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <Button block color="danger" className="btn-pill" onClick={this.handleLogout}>Keluar</Button>
                </Col>
              </Row>
              </div>
            </div>
          ) : (
            <div>
            {this.state.dataCaleg.length !== 0 || this.state.dataParpols.length !== 0 ?(
            <div>
            <CardColumns className="cols-2 " style={{margin:'1em'}}>
            {this.state.dataParpols.map((itemParpol, i) => (
              <Card key={itemParpol._id}>
              <CardHeader>
              <img src={itemParpol.bendera} alt="Bendera Parpol" height="42" width="42"/><b style={{marginLeft:'1em'}}> {itemParpol.name} </b> 
              </CardHeader>
              <CardBody>
                  <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center"><i className="icon-people"></i></th>
                      <th >Nama Calon</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                    </thead>
                      <tbody>
                      {this.state.dataCaleg.map((itemCaleg, i) => 
                        { return itemParpol._id === itemCaleg.idParpol._id && 
                          <tr key={itemCaleg._id}>
                            <td className="text-center">
                              <div className="avatar">
                                <img src={itemCaleg.img} className="img-avatar" alt={itemCaleg.name} />
                              </div>
                            </td>
                            <td>
                              <div>{itemCaleg.name}</div>
                              <div className="small text-muted">
                                <span>Daerah Pemilihan</span> | {itemCaleg.category}
                              </div>
                            </td>
                            <td className="text-center">
                              <Button title="Pilih" color="ghost-danger" onClick={() => this.onHandleVote(itemCaleg._id,itemCaleg.name,itemCaleg.idParpol.akronim,itemCaleg.idParpol.bendera)}><i className="fa fa-circle-o"></i> Pilih</Button>
                            </td>
                          </tr>
                        }
                      )} 
                      </tbody>
                  </Table>  
              </CardBody>
            </Card>
            ))}
          </CardColumns>
          </div>
            ):(
              <Alert className=" bg-primary text-center" style={{marginLeft:'1em',marginRight:'1em'}}>
                <strong>Data Kosong.. <i>silahkan refresh kembali</i></strong>
              </Alert>
            )}
          </div>
          )}
        </div>
        )}
      </div>
    );
  }
}

export default withRouter(Vote);