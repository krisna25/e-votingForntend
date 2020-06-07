import React, { Component } from 'react';
import { fetchApi } from "../../../middleware/api";
import { tokenAuth } from "../../../middleware/cookies-manager";
import "../../../assets/css/registerAndLogin.css";
import { Card, CardBody,Carousel, CarouselCaption,Badge,CarouselControl, CarouselIndicators, CarouselItem, Col, Row, } from 'reactstrap';
import Header from '../../../containers/HomeLayout/Header';
import Footer from '../../../containers/HomeLayout/Footer';
import LifeVoteCircle from '../../../containers/HomeLayout/LifeVoteCircle';
var moment = require('moment');
var pesanStatus='';
const items = [
  {
    src:'/assets/img/carauselA.jpg',
    altText: '',
    caption: '',
  },
  {
    src: '/assets/img/carauselB.jpg',
    altText: '',
    caption: '',
  },
  {
    src: '/assets/img/carauselC.jpg',
    altText: '',
    caption: '',
  },
];
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeIndex: 0,
      votingTime:'',
      rekapitulasiTime:'',
      rekapitulasiStatus:'',
      votingStatus:'',
      loginStatus:'',
      ktp:'',
      lifecirclestatus:'',
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }


  async componentWillMount() {
    const userData = tokenAuth.tokenAuthenticated();
    try {
      const DataStatus = await fetchApi("/getStatusVote");
      const statusRekapitulasi = DataStatus.data[0].status;
      const statusVoting = DataStatus.data[1].status;
      const voteLifeCircle = await fetchApi("/getVoteLifeCircle")
      const voteLifeCircleStatus = voteLifeCircle.data[0].status;
      this.setState({
        rekapitulasiStatus:statusRekapitulasi,
        votingStatus:statusVoting,
        lifecirclestatus: Number(voteLifeCircle.data[0].status),
      })
      if (DataStatus.data[0].timeStart !== null && DataStatus.data[0].timeEnd !== null ) {
        this.setState({
          rekapitulasiTime:  DataStatus.data[0].nama +' dimulai dari '+ moment(DataStatus.data[0].timeStart).format('LLLL') + ' hingga '+ moment(DataStatus.data[0].timeEnd).format('LLLL')
        })
      }else{
        this.setState({
          rekapitulasiTime:'Waktu belum diatur'
        })
      }
      if (DataStatus.data[1].timeStart !== null && DataStatus.data[1].timeEnd !== null ) {
        this.setState({
          votingTime:  DataStatus.data[1].nama +' dimulai dari '+ moment(DataStatus.data[1].timeStart).format('LLLL') + ' hingga '+ moment(DataStatus.data[1].timeEnd).format('LLLL')
        })
      }else{
        if (voteLifeCircleStatus >= 3) {
          this.setState({
            votingTime:'Waktu sudah selesai'
          })
        }else{
          this.setState({
            votingTime:'Waktu belum diatur'
          })
        }
      
      }
    } catch (error) {
      
    }
  
    if (userData.authToken === true) {
      this.setState({
        loginStatus:true
      })
    }else{
      this.setState({
        loginStatus:false
      })
    }
  }

  render() {
    const { activeIndex } = this.state;
    const slides2 = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img className="d-block w-100" src={item.src} alt={item.altText} />
          <CarouselCaption className="text-danger"  captionText={item.caption} captionHeader={item.caption} />
        </CarouselItem>
      );
    });
    if(this.state.lifecirclestatus === 0){
      pesanStatus = <Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22px',padding:'2px'}} >E-Voting Belum dimulai..</Badge>
    }else if(this.state.lifecirclestatus === 1){
      pesanStatus =<Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22px',padding:'2px'}} >pemungutan suara sedang berlangsung..</Badge>
    }else if(this.state.lifecirclestatus === 2){
      pesanStatus =<Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22px',padding:'2px'}} >Rekapitulasi sedang berlangsung..</Badge>
    }else if(this.state.lifecirclestatus === 3){
      pesanStatus = <Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22px',padding:'2px'}} >Pengumuman hasil rekapitulasi..</Badge>
    }else if(this.state.lifecirclestatus === 4){
      pesanStatus = <Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22  px',padding:'2px'}} >Penyelesaian sengketa..</Badge>
    }else if(this.state.lifecirclestatus === 5){
      pesanStatus = <Badge className="badge-info" style={{wordBreak:'break-all', fontSize:'22  px',padding:'2px'}} >Pengumuman hasil akhir..</Badge>
    }
    return (
      <div className="animated fadeIn" style={{marginBottom:'4em'}}>
          <Row >
            <Col xs="12" xl="12"> 
              <Card>
                <Header/>
                <CardBody className="bg-gray-100" style={{marginBottom:'-4em',marginLeft:'-1em'}}>
                  <Row>
                    {this.state.lifecirclestatus !== '' &&
                    <Col xs="12" md="12" xl="12"> 
                      <h2 className='text-center'>Tahapan E-Voting Pemilihan Calon Anggota Legislatif DPR RI Provinsi Banten</h2>
                      <i>*tanda biru menandakan tahapan proses yang sedang berlangsung</i>
                      <LifeVoteCircle  lifecirclestatus = {this.state.lifecirclestatus} />
                    </Col>
                    }
                  </Row>
                  <Row> 
                    <Col xs="12" xl="8"  > 
                      <Card>
                        <CardBody >
                          <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous} >
                            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                            {slides2}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous}/>
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                          </Carousel>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs="12" xl="4"> 
                    <Card>
                        <CardBody>
                          <iframe title="video tahapan pemilu" width="100%" height="210px" src="https://www.youtube.com/embed/Nyzm_t2alVs" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                          <hr/>
                          <iframe title="edukasi pentingnya pemilu" width="100%" height="210px" src="https://www.youtube.com/embed/1zy7ujq0h-s" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Row >
                    <Col  xs="12" xl="6">
                      <div>
                        <div className="card">
                          <div className="clearfix p-0 card-body">
                            <i className="cui-box icons bg-info text-white p-4 px-5 font-1xl mr-3 float-left"></i>
                            <div className="h6 mb-0 pt-3" style={{marginTop:'-0.5em'}}>
                              {this.state.votingTime}
                            </div>
                            <div className="text-uppercase font-weight-bold font-xs">
                              Voting Status: {' '}
                              {this.state.votingStatus === true ? (
                                <span className="mr-1 badge badge-success">Aktif</span>
                              ):(
                                <span className="mr-1 badge badge-danger">Tidak Aktif</span>
                              )} 
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col  xs="12" xl="6">
                      <div>
                        <div className="card">
                          <div className="clearfix p-0 card-body">
                            <i className="fa fa-bullhorn  bg-info text-white p-4 px-5 font-1xl mr-3 float-left"></i>
                            <div className="h6 mb-0 text-info pt-3" style={{marginTop:'-0.5em'}}>
                              {pesanStatus}
                            </div>
                            <div className="text-muted text-uppercase font-weight-bold font-xs">
                              Tahapan E-voting saat ini 
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Footer/>
      </div>
    );
  }
}

export default Home;
