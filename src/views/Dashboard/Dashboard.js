import React, { Component } from 'react';
import classnames from 'classnames';
import LifeVoteCircle from '../../containers/HomeLayout/LifeVoteCircle';
import {
  Badge,
  Button,
  Label,
  Input,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  CardGroup,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Col,
  Progress,
  Row,
  Table,
  TabContent, 
  TabPane, Nav,
  NavItem,
  NavLink, 
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  ModalFooter
} from 'reactstrap';
import Widget04 from '../../views/Widgets/Widget04'
import { fetchApi } from "../../middleware/api";
import { postApi } from "../../middleware/api";
import { tokenAuth } from "../../middleware/cookies-manager";
import Widget02 from '../../views/Widgets/Widget02';
import swal from 'sweetalert';
import DateTimePicker from 'react-datetime-picker';
import { AppSwitch } from '@coreui/react'
var moment = require('moment'); 
var Banten1SumOfVote = 0;
var Banten2SumOfVote = 0;
var Banten3SumOfVote = 0;
var BantenTotalSumOfVote = 0;
var idLifeCircle='';
var pesanRekapitulasi='';
var Banten1rekapitulasi = [];
var Banten2rekapitulasi = [];
var Banten3rekapitulasi = [];
var calegCategory = '';
var namaPartai = '';
var SumOfVoters = 0 ;
var SumOfVotersChoose = 0;
var CalegRekapitulasi =[];
var modalBackground=''; 
var ButtonTitle = '';
var banten1id = '';
var banten2id = '';
var banten3id = '';
var isEnabled = false;
var ResultRekapBanten1Sits = '';
var ResultRekapBanten2Sits = '';
var ResultRekapBanten3Sits = '';
var tabelPastikanCaleg = ''
var dateNow = moment();

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isMounted: false,
      activeTab: '1',
      activeTab1:'1',
      banten1: { category: "Banten1", seats: 6 },
      banten2: { category: "Banten2", seats: 6 },
      banten3: { category: "Banten3", seats: 10 },
      startDateTimePublish : '',
      startDateTimeVote : '',
      endDateTimePublish: '',
      endDateTimeVote :  '',
      lifecirclestatus : '',
      Banten1SumOfVoteState: 0,
      Banten2SumOfVoteState: 0,
      Banten3SumOfVoteState: 0,
      BantenTotalSumOfVoteState: 0,
      collapse: true,
      rekapitulasiStatus:false,
      votingStatus:false,
      publishStatus: false,
      detailToggle:false,
      fadeIn: true,
      Banten1kuota:'',
      Banten2kuota:'',
      Banten3kuota:'',
      Banten1:'',
      Banten2:'',
      Banten3:'',
      totalKuota:0,
      sebaranDataState:false,
      dataSebaran:'',
      pastikan:false,
    };

    this.onStatusLifeCircleButton = this.onStatusLifeCircleButton.bind(this);
    this.toggleDetail = this.toggleDetail.bind(this);
    this.toggleDetailData = this.toggleDetailData.bind(this);
    this.updateTimeStatus = this.updateTimeStatus.bind(this);
    this.onStatusVoteChange = this.onStatusVoteChange.bind(this);
    this.onStatusRekapChange = this.onStatusRekapChange.bind(this);
    this.onStatusPublishChange = this.onStatusPublishChange.bind(this);
    this.onStatusVoteChangeButton = this.onStatusVoteChangeButton.bind(this);
    this.onStatusRekapChangeButton = this.onStatusRekapChangeButton.bind(this);
    this.onStatusPublishChangeButton = this.onStatusPublishChangeButton.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onHandleSubmitSits = this.onHandleSubmitSits.bind(this);
    this.onChangeBantenKuota = this.onChangeBantenKuota.bind(this);
    this.onRekapitulasiUlang = this.onRekapitulasiUlang.bind(this);
    this.pastikanCaleg = this.pastikanCaleg.bind(this);
    this.togglePastikanCaleg = this.togglePastikanCaleg.bind(this);
    this.pilihCaleg = this.pilihCaleg.bind(this);
    this.SebaranDataCaleg = this.SebaranDataCaleg.bind(this);
    this.toggleSebaranData = this.toggleSebaranData.bind(this);
    }
  

  async SebaranDataCaleg(vote){
    this.setState({
      dataSebaran:vote,
      sebaranDataState:!this.state.sebaranDataState
    })
    console.log(this.state.sebaranDataState)
    console.log(vote)
  }

  async pilihCaleg(dapil,data,idkursi){
    const result = await postApi('/pastikanCaleg',{dapil:dapil,data:data,idkursi:idkursi})
    if(result){
      var ResultRekapSits = await fetchApi('/gethasilrekapkursi');
      if(ResultRekapSits){
          for (let index = 0; index < ResultRekapSits.data.length; index++) {
            const element = ResultRekapSits.data[index];
            if(element.dapil === "Banten1"){
              ResultRekapBanten1Sits = element.hasil
            }else if(element.dapil === "Banten2"){
              ResultRekapBanten2Sits = element.hasil
            }else if(element.dapil === "Banten3"){
              ResultRekapBanten3Sits = element.hasil
          }
          console.log("data sits 1 ", ResultRekapBanten1Sits )
          this.setState({
            Banten1SumOfCalegSitsState : ResultRekapBanten1Sits,
            Banten2SumOfCalegSitsState : ResultRekapBanten2Sits,
            Banten3SumOfCalegSitsState : ResultRekapBanten3Sits,
            pastikan:!this.state.pastikan
          })
        }
      }
      await swal({
        title: "Yeay, Berhasil!",
        text: "Berhasil dipilih!",
        icon: "success",
      })
    }else{
      await swal({
        title: "Opps, Gagal!",
        text: "Gagal melakukan perubahan!",
        icon: "error",
      })
    }
  }

  async pastikanCaleg(data,dapil,idkursi){
    console.log("data ",data)
    tabelPastikanCaleg = this.createTablePastikan(data,dapil,idkursi)
    this.setState({
      pastikan:!this.state.pastikan
    })
  }

  togglePastikanCaleg(){
    this.setState({
      pastikan:!this.state.pastikan,
    })
  }

  toggleSebaranData(){
    this.setState({
      sebaranDataState:!this.state.sebaranDataState,
    })
  }
 async onRekapitulasiUlang(){
   var ResultRekapSits = '';
   var Banten1Rekap = '';
   var Banten2Rekap = '';
   var Banten3Rekap = '';
    try {
      Banten1Rekap = await postApi("/Rekapitulasi", this.state.banten1);
      Banten1rekapitulasi =  Banten1Rekap.data.vote[0]
      for (
        let index = 0;
        index < Banten1rekapitulasi.length;
        index++ 
      ) {
        const element = Banten1rekapitulasi[index];
        Banten1SumOfVote = Banten1SumOfVote + element.vote;
      }
      this.setState({
        Banten1SumOfVoteState: Banten1SumOfVote,
     
      });
    } catch (error) {
      console.log(error)
    }

    try {
        Banten2Rekap = await postApi("/Rekapitulasi", this.state.banten2);
        Banten2rekapitulasi = Banten2Rekap.data.vote[0];
      for (
        let index = 0;
        index < Banten2rekapitulasi.length;
        index++
      ) {
        const element = Banten2rekapitulasi[index];
        Banten2SumOfVote = Banten2SumOfVote + element.vote;
      }
      this.setState({
        Banten2SumOfVoteState: Banten2SumOfVote,
      });
    } catch (error) {
      console.log(error)
    }

    try {
      Banten3Rekap = await postApi("/Rekapitulasi", this.state.banten3);
        Banten3rekapitulasi= Banten3Rekap.data.vote[0];
      for (
        let index = 0;
        index <Banten3rekapitulasi.length;
        index++
      ) {
        const element = Banten3rekapitulasi[index];
        Banten3SumOfVote = Banten3SumOfVote + element.vote;
      }
      this.setState({
        Banten3SumOfVoteState: Banten3SumOfVote
      });
    } catch (error) {
      console.log(error)
    }

    try {
      ResultRekapSits = await fetchApi('/sitRekap');
      if(ResultRekapSits){
        for (let index = 0; index < ResultRekapSits.data.length; index++) {
            const element = ResultRekapSits.data[index];
            if(element.dapil === "Banten1"){
              ResultRekapBanten1Sits = element.hasil
            }else if(element.dapil === "Banten2"){
              ResultRekapBanten2Sits = element.hasil
            }else if(element.dapil === "Banten3"){
              ResultRekapBanten3Sits = element.hasil
          }
        }
        this.setState({
          Banten1SumOfCalegSitsState : ResultRekapBanten1Sits,
          Banten2SumOfCalegSitsState : ResultRekapBanten2Sits,
          Banten3SumOfCalegSitsState : ResultRekapBanten3Sits,
        })
      }
    } catch (error) {
      console.log(error)
    }
    if (Banten1Rekap !== ''  && Banten2Rekap !== '' && Banten2Rekap !== '' && ResultRekapSits !== '') {
      if(this.state.lifecirclestatus === 2){
        var status = 2
        const result = await postApi('/updateStatusLifeCircle', {id:idLifeCircle,status:3})
        if(result){
          this.setState({
            lifecirclestatus:3
          })
        }
        if(result){
          await swal({
            title: "Yeay, Berhasil!",
            text: "Rekapitulasi ulang berhasil dilakukan!",
            icon: "success",
          })
        }
      }else{
        await swal({
          title: "Yeay, Berhasil!",
          text: "Rekapitulasi ulang berhasil dilakukan!",
          icon: "success",
        })
      }
    }else{
      await swal({
        title: "Oops, Gagal!",
        text: "rekapitulasi ulang gagal dilakukan!",
        icon: "error",
      })
    }
      

 }
  

  toggleDetailData(caleg,category,bendera,akronim){
    var background = ''
    if (category === 'Banten1') {
      background = 'modal-danger modal-lg'
    } else if(category === 'Banten2'){
      background = 'modal-success modal-lg'
    } else if(category === 'Banten3'){
      background = 'modal-primary modal-lg'
    }
     calegCategory =  category;
     namaPartai = akronim
     CalegRekapitulasi =  caleg;
     modalBackground =background;
    this.setState({
      detailToggle:!this.state.detailToggle,
      benderaPartai:bendera,
    })
  }

  async onStatusVoteChange(id){
    var id = id ; 
    var status = ''
    if (this.state.votingStatus === true) {
      var status = false
    }else{
      var status = true
    }
    if (this.state.votingStatusButton === true) {
      const result = await postApi('/updateStatus', {id, status})
      if (result.status === 200) {
        await swal({
          title: "Yeay, Berhasil!",
          text: "Status berhasil Diubah!",
          icon: "success",
        })
        this.setState({
          votingStatus:!this.state.votingStatus
        })
      }
    }
  } 

  async onStatusRekapChange(id){
    var id = id ; 
    var status = ''
    if (this.state.rekapitulasiStatus === true) {
      var status = false
    }else{
      var status = true
    }
    const result = await postApi('/updateStatus', {id, status})
    if (result.status === 200) {
      await swal({
        title: "Yeay, Berhasil!",
        text: "Status berhasil Diubah!",
        icon: "success",
      })
      this.setState({
        rekapitulasiStatus:!this.state.rekapitulasiStatus
      })
    }
  } 
  async onStatusLifeCircleButton(id,ket){
    var id = id ; 
    var idButton = idButton;
    var status = this.state.lifecirclestatus;
    if (status >= 3 || ket === 'ulang') {
      if(status === 5 || ket === 'ulang'){
        const willRefresh = await swal({
          title: "Anda Yakin?",
          text: "Proses ini akan mengembalikan tahapan ke tahap awal. Hasil vote dan rekapitulasi akan kosong kembali",
          icon: "warning",
          dangerMode: true,
          buttons: true,
        })
        if (willRefresh) {
          status = 0    
          this.updatelife(id,status)
          var ResultRekapSits = await fetchApi('/sitRekap');
          if(ResultRekapSits){
            for (let index = 0; index < ResultRekapSits.data.length; index++) {
                const element = ResultRekapSits.data[index];
                if(element.dapil === "Banten1"){
                  ResultRekapBanten1Sits = element.hasil
                }else if(element.dapil === "Banten2"){
                  ResultRekapBanten2Sits = element.hasil
                }else if(element.dapil === "Banten3"){
                  ResultRekapBanten3Sits = element.hasil
              }
            }
          }
          this.setState({
            Banten1SumOfVoteState: Banten1SumOfVote,
            Banten1SumOfCalegSitsState : ResultRekapBanten1Sits,
            Banten2SumOfCalegSitsState : ResultRekapBanten2Sits,
            Banten3SumOfCalegSitsState : ResultRekapBanten3Sits,
            SumOfVotersChoose:0,
          });
        }
      }else{
        status = status + 1
        this.updatelife(id,status)
      }
    }
  }

  async updatelife(id,status){
    var statuslife = status;
    const result = await postApi('/updateStatusLifeCircle', {id, status})
    if (result) {
      await swal({
        title: "Yeay, Berhasil!",
        text: "Status berhasil Diubah!",
        icon: "success",
      })
      if(status === 5 ){
        var id = this.state.publishStatusid
        var status = true
        const publishupdate =  await postApi('/updateStatus',{id,status})
        if(publishupdate){
          this.setState({
            publishStatus: true,
          })
        }
      }else if( status === 0){
        //ubah kembali status ke status awal
        var statusBackToFalse = '';
        var newvote = ''
        var arr1 = [banten1id,banten2id,banten3id]
        var arr = [this.state.rekapitulasiStatusid ,this.state.votingStatusid,this.state.publishStatusid]
        //new rekapitulasi
        for (let index = 0; index < arr1.length; index++) {
          const element = arr1[index];
          newvote =  await postApi('/rekapnewvote',{id:element})
        }
        //update status
        for (let index = 0; index < arr.length; index++) {
          const id = arr[index];
          statusBackToFalse =  await postApi('/updateStatus',{id,status:false})
          if (statusBackToFalse){
            if(id === this.state.rekapitulasiStatusid){
              this.setState({
                rekapitulasiStatus:false,
                Banten1SumOfVoteState : 0
              })
            }else if(id === this.state.votingStatusid){
                this.setState({
                  votingStatus:false,
                  Banten2SumOfVoteState:0
              })
            }else if(id === this.state.publishStatusid){
              this.setState({
                publishStatus: false,
                Banten3SumOfVoteState:0,
                BantenTotalSumOfVoteState:0,
                SumOfVotersChoose:0
              })
            }
          }
        }
      }
      var getAllRekap = await fetchApi("/getRekapitulasi");
      Banten1rekapitulasi =  getAllRekap.data[0].vote[0]
      Banten2rekapitulasi =  getAllRekap.data[1].vote[0]
      Banten3rekapitulasi =  getAllRekap.data[2].vote[0]

      this.setState({
        lifecirclestatus: statuslife 
      })
    }else{
      await swal({
        title: "Gagal!",
        text: "Status gagal Diubah!",
        icon: "error",
      })
    }
  }

  async onStatusPublishChange(id){
    var id = id ; 
    var idButton = idButton;
    var status = ''
    if (this.state.publishStatus === true) {
      var status = false
    }else{
      var status = true
    }
   
    const result = await postApi('/updateStatus', {id, status})
    if (result.status === 200) {
      await swal({
        title: "Yeay, Berhasil!",
        text: "Status berhasil Diubah!",
        icon: "success",
      })
      this.setState({
        publishStatus:!this.state.publishStatus
      })
    }
  } 

  async onStatusVoteChangeButton(id){
    var id = id ; 
    var status = ''
    if (this.state.votingStatusButton === true) {
      var status = false
    }else{
      var status = true
    }
   
    const result = await postApi('/updateStatus', {id, status})
    if (result.status === 200) {
      this.setState({
        votingStatusButton:!this.state.votingStatusButton
      })
      console.log("berhasil")
    }else {
      console.log("tidak berhasil")
    }
  } 

  async onStatusRekapChangeButton(id){
    var id = id ; 
    var status = ''
    if (this.state.rekapitulasiStatusButton === true) {
      var status = false
    }else{
      var status = true
    }
    const result = await postApi('/updateStatus', {id, status})
    if (result.status === 200 ) {
      console.log("berhasil")
      this.setState({
        rekapitulasiStatusButton:!this.state.rekapitulasiStatusButton
      })
    }else {
      console.log("tidak berhasil")
    }
  } 

  async onStatusPublishChangeButton(id){
    var id = id ; 
    var status = ''
    if (this.state.publishStatusButton === true) {
      var status = false
    }else{
      var status = true
    }
    const result = await postApi('/updateStatus', {id, status})
    if (result.status === 200 ) {
      this.setState({
        publishStatusButton:!this.state.publishStatusButton
      })
      console.log("berhasil")
    }else {
      console.log("tidak berhasil")
    }
  } 

  toggleDetail(){
    this.setState({
      detailToggle:!this.state.detailToggle,
    })
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  toggleTab1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
  }

  toggleCollapse() {
    this.setState({ collapse: !this.state.collapse });
  }


  onChangeVoteStatusStart = startDateTimeVote => this.setState({ startDateTimeVote })
  onChangeVoteStatusEnd = endDateTimeVote => this.setState({ endDateTimeVote })
  onChangeRekapStatusStart = startDateTimeRekap => this.setState({ startDateTimeRekap })
  onChangeRekapStatusEnd = endDateTimeRekap => this.setState({ endDateTimeRekap })
  onChangePublishStatusStart = startDateTimePublish => this.setState({ startDateTimePublish })
  onChangePublishStatusEnd = endDateTimePublish => this.setState({ endDateTimePublish })



  onChangeBantenKuota(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  

  async onHandleSubmitSits(){
    const { Banten1, Banten2, Banten3} = this.state;
    const kursi = await postApi('/kursiUpdate',this.state);
    if(kursi){
      this.setState({
        banten1: { category: kursi.data[0].dapil, seats: kursi.data[0].kursi },
        banten2: { category: kursi.data[1].dapil, seats: kursi.data[1].kursi },
        banten3: { category: kursi.data[2].dapil, seats: kursi.data[2].kursi },
        totalKuota : kursi.data[0].kursi + kursi.data[1].kursi + kursi.data[2].kursi,
      })
     
      await swal({
        title: "Yeay, Berhasil!",
        text: "Kuota kursi berhasil diubah!",
        icon: "success",
      })
    }else{
      await swal({
        title:"Oops, Kesalahan!",
        text: "Kuota kursi gagal diubah!",
        icon: "error",
      })
    }
  }


  async updateTimeStatus(id,start,end,keterangan){
   if (start !== '' && end !== '') {
      if (moment(end).isAfter(start) === true && moment(dateNow).isBefore(start) === true) {
        const result = await postApi('/updateTimeStatusVote',{id,start,end})
        if (result.status === 200) {
          await swal({
            title: "Yeay, Berhasil",
            text: "Waktu berhasil diatur",
            icon: "success",
          })
        }else{
          console.log("gagal")
        }
      }else{
        await swal({
          title: "Oops, Kesalahan",
          text: "Waktu mulai harus kecil sebelum tanggal berakhir atau yang ditentukan harus waktu yang akan datang ",
          icon: "warning",
        })
      }
   }else{
      await swal({
        title: "Oops, Kesalahan!",
        text: "Masih ada waktu yang belum diatur, jangan biarkan waktu kosong!",
        icon: "warning",
      })
    }
  }

  
  async componentWillMount() {
    var banyakPemilih = 0;
    var User = {};
    try{
      const kursi = await fetchApi("/getkursi");
      if(kursi.status === 200){
        this.setState({
          banten1: { category: kursi.data[0].dapil, seats: kursi.data[0].kursi },
          banten2: { category: kursi.data[1].dapil, seats: kursi.data[1].kursi },
          banten3: { category: kursi.data[2].dapil, seats: kursi.data[2].kursi },
          totalKuota :kursi.data[0].kursi + kursi.data[1].kursi + kursi.data[2].kursi,

        })
      }
      
      var a = 0;
      User = await fetchApi("/getAllUsers");
      if(User.status === 500){
        User = await fetchApi("/getAllUsers");
      }
      if(User){
        for (let index = 0; index < User.data.length; index++) {
          if (User.data[index].log !== null) {
            a = a + 1
          }
        }
      }
        SumOfVotersChoose = a
    }catch(err){
      console.log(err)
    }
    try{
      const Pemilih = await fetchApi("/getAllKtp");
      banyakPemilih = Pemilih.data.length
      SumOfVoters =  banyakPemilih;
    }catch(err){
      console.log(err)
    }

    try{
      //status voting
     
      const DataStatus = await fetchApi("/getStatusVote");
      const voteLifeCircle = await fetchApi("/getVoteLifeCircle");
      const statusLifeCircle = voteLifeCircle.data[0].status;
      idLifeCircle = voteLifeCircle.data[0]._id;
      const statusPublishid = DataStatus.data[2]._id;
      const statusVotingid = DataStatus.data[1]._id;
      const statusRekapitulasiid = DataStatus.data[0]._id;
      const statusPublishidButton = DataStatus.data[5]._id;
      const statusVotingidButton = DataStatus.data[3]._id;
      const statusRekapitulasiidButton = DataStatus.data[4]._id;
      const statusPublish = DataStatus.data[2].status;
      const statusVoting = DataStatus.data[1].status;
      const statusRekapitulasi = DataStatus.data[0].status;
      const statusPublishButton = DataStatus.data[5].status;
      const statusVotingButton = DataStatus.data[3].status;
      const statusRekapitulasiButton = DataStatus.data[4].status;

      if (DataStatus.data[0].timeStart !== null && DataStatus.data[0].timeEnd !== null) {
        this.setState({
          startDateTimeRekap: new Date(DataStatus.data[0].timeStart),
          endDateTimeRekap:new Date(DataStatus.data[0].timeEnd),
        })
      }
       if(DataStatus.data[1].timeStart !== null && DataStatus.data[1].timeEnd !== null){
        this.setState({
          startDateTimeVote:new Date(DataStatus.data[1].timeStart),
          endDateTimeVote:new Date(DataStatus.data[1].timeEnd),
        })
      }
      if(DataStatus.data[2].timeStart !== null && DataStatus.data[2].timeEnd !== null){
        this.setState({
          startDateTimePublish:new Date(DataStatus.data[2].timeStart),
          endDateTimePublish:new Date(DataStatus.data[2].timeEnd),
        })
      }
      this.setState({
        rekapitulasiStatus:statusRekapitulasi,
        votingStatus: statusVoting,
        publishStatus: statusPublish,
        rekapitulasiStatusButton:statusRekapitulasiButton,
        votingStatusButton: statusVotingButton,
        publishStatusButton: statusPublishButton,
        rekapitulasiStatusid:statusRekapitulasiid,
        votingStatusid: statusVotingid,
        publishStatusid: statusPublishid,
        rekapitulasiStatusidButton:statusRekapitulasiidButton,
        votingStatusidButton: statusVotingidButton,
        publishStatusidButton: statusPublishidButton,
        lifecirclestatus: statusLifeCircle,
      })
     
      if (statusRekapitulasi === false) {
        this.setState({
          JudulPesan:" Proses Belum dimulai!",
          Pesan:"Saat ini proses rekapitulasi belum dimulai. Silahkan menunggu"
        })
      }else if(statusPublish === false) {
        this.setState({
          JudulPesan:"hasil belum tersedia!",
          Pesan:"Saat ini anda belum dapat melihat hasil. Akses tidak diberikan."
        })
  
      }
    }catch(err){
      console.log(err)
    }
    try {
        const userData = tokenAuth.tokenAuthenticated();
        if (userData.authToken === true) {
          this.setState({
            loginStatus:true
          })
          if (userData.dataToken.log !== null && userData.dataToken.role !== 0 ) {
            const logUser = userData.dataToken.log.split('/');
            this.setState({
              id:logUser[1]
            })
            try{
              const resultOfCaleg = await postApi('/getCalegbyId',this.state)
              namaPartai = resultOfCaleg.data[0].idParpol.akronim;

              this.setState({
                namaCaleg:resultOfCaleg.data[0].name,
                suara: resultOfCaleg.data[0].vote,
                bendera: resultOfCaleg.data[0].idParpol.bendera,
                fotoCaleg: resultOfCaleg.data[0].img,
              })
            }catch(err){
              console.log(err)
            }
          }
        }else{
          this.setState({
            loginStatus:false
          })
        }
    } catch (error) {
      console.log(error)
    }

    try{
      //mengambil data hasil rekapitulasi
      var getAllRekap = await fetchApi("/getRekapitulasi");
      //masukan id untuk rekap suara keseluruhan
      banten1id = getAllRekap.data[0]._id;
      banten2id = getAllRekap.data[1]._id;
      banten3id = getAllRekap.data[2]._id;


      //mengambil hasil rekap kursi untuk caleg
      var ResultRekapSits = await fetchApi('/gethasilrekapkursi');
      if(ResultRekapSits){
          for (let index = 0; index < ResultRekapSits.data.length; index++) {
            const element = ResultRekapSits.data[index];
            if(element.dapil === "Banten1"){
              ResultRekapBanten1Sits = element.hasil
            }else if(element.dapil === "Banten2"){
              ResultRekapBanten2Sits = element.hasil
            }else if(element.dapil === "Banten3"){
            ResultRekapBanten3Sits = element.hasil
          }
        }
      }
      //menghitung jumlah user yang telah melakukan vote
      for (let index1 = 0; index1 < getAllRekap.data.length; index1++) {
        if(getAllRekap.data[index1].vote[0] !== "new vote"){
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

      //mengecek apakah hasil rekap tidak kosong disetiap dapil
      if( getAllRekap.data[0].vote[0] !== "new vote"){
        //memasukan nilai rekapitilasi banten 1
        Banten1rekapitulasi =  getAllRekap.data[0].vote[0]
        this.setState({
          Banten1SumOfVoteState: Banten1SumOfVote,
          Banten1SumOfCalegSitsState :ResultRekapBanten1Sits,
        })
      }
      if( getAllRekap.data[1].vote[0] !== "new vote"){
        //memasukan nilai rekapitilasi banten 2
        Banten2rekapitulasi = getAllRekap.data[1].vote[0];

        this.setState({
          Banten2SumOfVoteState: Banten2SumOfVote,
          Banten2SumOfCalegSitsState :ResultRekapBanten2Sits,
        })
      }
      if( getAllRekap.data[2].vote[0] !== "new vote"){
        //memasukan nilai rekapitilasi banten 3
        Banten3rekapitulasi = getAllRekap.data[2].vote[0]
        this.setState({
          Banten3SumOfVoteState: Banten3SumOfVote,
          Banten3SumOfCalegSitsState : ResultRekapBanten3Sits,
        });
      }

      
    }catch(err){

    }

    BantenTotalSumOfVote = Banten1SumOfVote + Banten2SumOfVote + Banten3SumOfVote;

    this.setState({
      BantenTotalSumOfVoteState : BantenTotalSumOfVote
    })
    Banten1SumOfVote = 0;
    Banten2SumOfVote = 0;
    Banten3SumOfVote = 0;
    BantenTotalSumOfVote = 0;

  }
  createTablePastikan = (data,dapil,idkursi) => {
    if(data.length !== undefined){
      let table = []
      // Outer loop to create parent
      for (let i = 0; i < data.length; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < 7; j++) {
        //
           if (j === 1) {
              children.push(  
                  <td style={{width:'3em'}} className="text-center" key={j}>
                    <img style={{height:'2.5em'}} src={data[i].foto} className="img-rounded" alt={data[i].foto} />
                  </td>
              )
            }else if(j === 2){
              children.push(<td style={{width:'20em'}} key={j}>{data[i].nama}</td>)
            }else if(j === 3){
              children.push(<td style={{width:'10em'}} key={j}>{data[i].akronim}</td>)
            }else if (j === 4 ) {
            children.push(  
                <td className="text-center" key={j}>
                  <img style={{height:'2.4em'}} src={data[i].bendera} className="img-rounded" alt={data[i].bendera} />
                </td>
                )
            }else if(j === 5){
              if(this.state.lifecirclestatus === 3){
                children.push(
                  <td className="text-center" key={j}>
                    <Button title= "Lihat"  outline color="primary" onClick={()=> this.SebaranDataCaleg(data[i].vote)}>
                        <i className="fa fa-eye " ></i>
                    </Button>
                  </td>
                ) 
              } 
            }else if(j === 6){
              if(this.state.lifecirclestatus === 3){
                children.push(
                  <td className="text-center" key={j}>
                    <Button title= "Pilih" outline color="primary" onClick={()=> this.pilihCaleg(dapil,data[i],idkursi)}>
                        <i className="fa fa-check-square-o " ></i>
                    </Button>
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


  
  createTable = (data,dapil) => {
    if(data.length !== undefined){
      let table = []
      // Outer loop to create parent
      for (let i = 0; i < data.length; i++) {
        let children = []
        //Inner loop to create children
        for (let j = 0; j < 6; j++) {
        //
            if(j == 0) {
              children.push(  
                    <td className="text-center" key={data[i].id} >
                      {i + 1}
                    </td>
                )
            }else if (j === 1) {
              children.push(  
                  <td style={{width:'3em'}} className="text-center" key={j}>
                    <img style={{height:'2.5em'}} src={data[i].foto} className="img-rounded" alt={data[i].foto} />
                  </td>
              )
            }else if(j === 2){
              children.push(<td style={{width:'20em'}} key={j}>{data[i].nama}</td>)
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
                )
                if(this.state.lifecirclestatus === 3){
                  children.push(
                    <td className="text-center" key={8}>
                        {/* <Button outline color="primary" onClick="">
                            <i className="fa fa-exchange " ></i>&nbsp;Ganti
                        </Button> */}
                    </td>
                  ) 
                }
              } else{
                  children.push(
                    <td className="text-center" key={j}>
                      <Badge color="danger">Caleg Sedang Ditentukan</Badge>
                    </td>
                  ) 
                  if(this.state.lifecirclestatus  === 3 ){
                    children.push(
                      <td className="text-center" key={8}>
                        <Button outline color="success" onClick={()=> this.pastikanCaleg(data[i].data,dapil,data[i].idkursi)}>
                            <i className="fa fa-child" ></i>&nbsp;Pastikan
                        </Button>
                        {/* <Button outline color="primary" onClick="">
                          <i className="fa fa-exchange " ></i>&nbsp;Ganti
                        </Button> */}
                      </td>
                    ) 
                  }
                }
            }
        }
        //Create the parent and add the children
        table.push(<tr key={i}>{children}</tr>)
      }
      return table
    }
  }
  // componentWillUnmount(){
  //   bypass = 0
  // }
  render() {
    const{Banten1,Banten2,Banten3} = this.state
    isEnabled =
      Banten1.length > 0 && Banten2.length > 0 && Banten3.length > 0;

    if(this.state.lifecirclestatus == 0){
      ButtonTitle = 'E-voting belum dimulai';
      pesanRekapitulasi = <b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">E-Voting Belum dimulai..</b>
    }else if(this.state.lifecirclestatus == 1){
      ButtonTitle = 'E-voting sedang berlangsung';
      pesanRekapitulasi =<b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">pemungutan suara sedang berlangsung..</b>
    }else if(this.state.lifecirclestatus == 2){
      ButtonTitle = 'Rekapitulasi sedang berlangsung ';
      pesanRekapitulasi =<b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">Rekapitulasi sedang berlangsung..</b>
    }else if(this.state.lifecirclestatus == 3){
      ButtonTitle = 'Lanjut ke tahapan Sengketa ';
      pesanRekapitulasi = <b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">Pengumuman hasil rekapitulasi..</b>
    }else if(this.state.lifecirclestatus == 4){
      ButtonTitle = 'Lanjut ke tahapan hasil akhir ';
      pesanRekapitulasi = <b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">Penyelesaian sengketa..</b>
    }else if(this.state.lifecirclestatus == 5){
      ButtonTitle = 'Lanjut ke tahapan awal lagi  ';
      pesanRekapitulasi = <b style={{wordBreak:'break-all', fontSize:'20  px',padding:'2px'}} className="homeBackground text-white">Pengumuman hasil akhir..</b>
    }
    
    return (
     
      <div className="animated fadeIn">
          <div>
              {this.state.lifecirclestatus !== '' && 
              <Col xs="12" md="12" xl="12"> 
                <h2 className='text-center'>Tahapan E-Voting Pemilihan Calon Anggota Legislatif DPR RI Provinsi Banten</h2>
                <i>*tanda biru menandakan tahapan proses yang sedang berlangsung</i>
                <LifeVoteCircle  lifecirclestatus = {this.state.lifecirclestatus} />
              </Col>
              }
            <CardGroup className="mb-4">
              <Widget04 icon="icon-people" color="info" header={String(SumOfVoters)} value="0">Total Pemilih</Widget04>
              <Widget04 icon="icon-user-follow" color="success" header={String(Math.round((SumOfVotersChoose / SumOfVoters) * 100)) + "%"} value={String(Math.round((SumOfVotersChoose / SumOfVoters) * 100))}>Pemilih Menggunakan Hak Pilih</Widget04>
              {this.state.votingStatus === true ?(
                <Widget04 icon="fa fa-pencil-square-o" color="success" header="Aktif" value="100">Status Voting</Widget04>
              ):(
                <Widget04 icon="fa fa-pencil-square-o" color="danger" header="Tidak aktif" value="100">Status Voting</Widget04>
              )} 
              {this.state.rekapitulasiStatus === true ?(
                <Widget04 icon="fa fa-calculator" color="success" header="Aktif" value="100">Status Rekapitulasi</Widget04>
              ):(
                <Widget04 icon="fa fa-calculator" color="danger" header="Tidak aktif" value="100">Status Rekapitulasi</Widget04>
              )} 
              {this.state.publishStatus === true ?(
                <Widget04 icon="fa fa-share-square-o" color="success" header="Aktif" value="100">Status Publish</Widget04>
              ):(
                <Widget04 icon="fa fa-share-square-o" color="danger" header="Tidak aktif" value="100">Status Publish</Widget04>
              )} 
            </CardGroup>
            <Row>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.Banten1SumOfVoteState+" Suara"} mainText="Vote Banten 1" icon="cui-box icons " color="danger" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.Banten2SumOfVoteState+" Suara"} mainText="Vote Banten 2" icon="cui-box icons " color="success" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.Banten3SumOfVoteState+" Suara"} mainText="Vote Banten 3" icon="cui-box icons " color="primary" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.BantenTotalSumOfVoteState+" Suara"} mainText="Total Vote" icon="cui-box icons " color="warning" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.banten1.seats+" Kursi"} mainText="Kuota Kursi Banten 1" icon="fa fa-institution  icons " color="danger" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.banten2.seats+" Kursi"} mainText="Kuota Kursi Banten 2" icon="fa fa-institution icons " color="success" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.banten3.seats+" Kursi"} mainText="Kuota Kursi Banten 3" icon="fa fa-institution icons " color="primary" />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={this.state.totalKuota+" Kursi"} mainText="Total Kuota Kursi" icon="fa fa-institution icons " color="warning" />
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" lg="4">
                <Card>
                  <CardHeader className="bg-success">
                    <strong>Pengaturan Mulai dan Berhenti Voting</strong><br/>
                    <small> Voting status</small>
                  </CardHeader>
                  <CardBody className="text-center ">
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="ccnumber">Masukan Waktu Mulai dan berhenti:</Label><br/>
                            <DateTimePicker
                              name="StartVote"
                              onChange={this.onChangeVoteStatusStart}
                              value={this.state.startDateTimeVote}
                              required = {true}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <strong>Hingga</strong>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                            <DateTimePicker
                              name="EndVote"
                              onChange={this.onChangeVoteStatusEnd}
                              value={this.state.endDateTimeVote}
                              required = {true}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          {this.state.lifecirclestatus === 0 ?(
                            <Button  className="btn-pill btn btn-success btn-block"  onClick={()=> this.updateTimeStatus(this.state.votingStatusid,this.state.startDateTimeVote,this.state.endDateTimeVote,'voting')}>Masukan</Button>
                          ):(
                            <Button disabled className="btn-pill btn btn-success btn-block"  onClick={()=> this.updateTimeStatus(this.state.votingStatusid,this.state.startDateTimeVote,this.state.endDateTimeVote,'voting')}>Masukan</Button>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr/>
                    <Row>
                      <Col>
                        <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-warning"></i> Tombol aktifkan &  non aktifkan secara langsung </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="2" sm="2">
                      <AppSwitch className={'mx-1'}  checked={this.state.votingStatusButton} variant={'3d'} outline={'alt'} color={'success'}  label onClick={() => this.onStatusVoteChangeButton(this.state.votingStatusidButton)} dataOn={'\u2713'} dataOff={'\u2715'} />
                      </Col>
                      <Col xs="8" sm="8" style={{marginRight:'-2.5em'}}>
                        <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-hand-o-left"></i> On/Off Switch Status<br/> On/Off Status <i className="fa fa-hand-o-right"></i></span>
                      </Col>
                      <Col xs="1" sm="1">
                        {this.state.votingStatusButton === true ?(
                          <AppSwitch className={'mx-1'}  checked={this.state.votingStatus} variant={'3d'} outline={'alt'} color={'success'}  label onClick={() => this.onStatusVoteChange(this.state.votingStatusid)} />
                        ):(
                          <AppSwitch className={'mx-1'}  checked={this.state.votingStatus} variant={'3d'} outline={'alt'} color={'success'}  label onClick={() => this.onStatusVoteChange(this.state.votingStatusid)} disabled />
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
               
                <Card className="homeBackground">
                  <CardHeader className="homeBackground text-white">
                    <strong>Kuota Kursi DPR Provinsi Banten</strong><br/>
                    <small>Form ini hanya dapat digunakan sebelum voting dimulai</small>
                  </CardHeader>
                  <CardBody>
                    <Form action="" method="post">
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Banten 1</InputGroupText>
                          </InputGroupAddon>
                          <Input 
                            type="text" 
                            id="Banten1" 
                            name="Banten1" 
                            autoComplete="Banten1" 
                            onChange={e => this.onChangeBantenKuota(e)}
                            />
                          <InputGroupAddon addonType="append">
                            <InputGroupText><i className="fa fa-institution"></i></InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Banten 2</InputGroupText>
                          </InputGroupAddon>
                          <Input 
                            type="text" 
                            id="Banten2" 
                            name="Banten2" 
                            autoComplete="Banten2"  
                            onChange={e => this.onChangeBantenKuota(e)}
                            />
                          <InputGroupAddon addonType="append">
                            <InputGroupText><i className="fa fa-institution"></i></InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>Banten 3</InputGroupText>
                          </InputGroupAddon>
                          <Input 
                            type="text" 
                            id="Banten3" 
                            name="Banten3" 
                            autoComplete="Banten3" 
                            onChange={e => this.onChangeBantenKuota(e)}
                            />
                          <InputGroupAddon addonType="append">
                            <InputGroupText><i className="fa fa-institution"></i></InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="form-actions">
                        {this.state.lifecirclestatus === 0 ? (
                          <Button size="sm" color="muted" disabled={!isEnabled} onClick={() => this.onHandleSubmitSits()}>Submit</Button>
                        ):(
                          <Button size="sm" color="muted" disabled onClick={() => this.onHandleSubmitSits()}>Submit</Button>
                        )}
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
               
              </Col>
              <Col xs="12" sm="12" lg="4">
                <Card>
                  <CardHeader className="homeBackground text-white">
                    <strong  className="text-center">Status Tahapan E-Voting</strong><br/>
                    <small>Berikut adalah keterangan tahapan yang sedang berlangsung</small>
                  </CardHeader>
                  <CardBody className="text-center ">
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="ccnumber">Saat ini</Label><br/>
                            {pesanRekapitulasi}
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr/>
                    <Row>
                      <Col>
                        <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-warning"></i> Tombol aktifkan & non aktifkan secara langsung </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="2" sm="2" lg="2" >
                        <AppSwitch title="coba" className={'mx-1'}  checked={this.state.rekapitulasiStatusButton}  variant={'3d'} outline={'alt'} color={'primary'}  label onClick={() => this.onStatusRekapChangeButton(this.state.rekapitulasiStatusidButton)} dataOn={'\u2713'} dataOff={'\u2715'} />
                      </Col>
                      <Col xs="8" sm="8" lg="8" style={{marginRight:'-2.5em'}}>
                        <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-hand-o-left"></i> On/Off Switch Status<br/> On/Off Status <i className="fa fa-hand-o-right"></i></span>
                      </Col>
                      <Col xs="1" sm="1" lg="1">
                        {this.state.rekapitulasiStatusButton === true ?(
                          <AppSwitch className={'mx-1'}  checked={this.state.rekapitulasiStatus}  variant={'3d'} outline={'alt'} color={'primary'}  label onClick={() => this.onStatusRekapChange(this.state.rekapitulasiStatusid)} />
                        ):(
                          <AppSwitch className={'mx-1'}  checked={this.state.rekapitulasiStatus}  variant={'3d'} outline={'alt'} color={'primary'}  label onClick={() => this.onStatusRekapChange(this.state.rekapitulasiStatusid)} disabled/>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    Tombol kontrol e-voting
                    <div className="card-header-actions">
                      <a className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggleCollapse}><i className="icon-arrow-up"></i></a>
                    </div>
                  </CardHeader>
                  <Collapse  isOpen={this.state.collapse} id="collapseExample">
                  {this.state.lifecirclestatus === 2 ?(
                    <CardBody className='text-center'>
                     <Alert className="bg-danger">
                        <h4><i className="fa fa-warning"></i> Rekapitulasi Gagal !!</h4>
                      </Alert>
                    <span  style={{fontSize:'12px'}}>
                      <b>Silahkan gunakan Tombol dibawa ini untuk melakukan rekapitulasi ulang</b>
                    </span>
                    <Col col="2" className="mb-3 mb-xl-0 text-center">
                      <Button outline color="primary"   onClick={()=> this.onRekapitulasiUlang()}>
                        <i className="fa fa-refresh" ></i>&nbsp;Rekapitulasi ulang
                      </Button>
                    </Col>
                    </CardBody>
                  ):(
                      <CardBody className='text-center'>
                        <span  style={{fontSize:'12px'}}> 
                          Tombol ini digunakan untuk melanjutkan tahapan E-voting dari tahapan pengumuman hasil setelah rekapitulasi hingga tahapan hasil akhir. 
                          <b>Gunakan Tombol ini dengan bijak!</b>
                        </span>
                        <Col col="2" className="mb-3 mb-xl-0 text-center">
                          {this.state.lifecirclestatus >= 3 ?(
                            <Button color="ghost-success" onClick={()=> this.onStatusLifeCircleButton(idLifeCircle)}>{ButtonTitle}</Button>
                          ):(
                            <Button disabled color="ghost-success">{ButtonTitle}</Button>
                          )}
                        </Col>
                      </CardBody>
                  )}
                  </Collapse>
                </Card>
              </Col>
              <Col xs="12" sm="12" lg="4">
                <Card>
                  <CardHeader className='bg-danger'>
                    <strong>Pengaturan Mulai dan Berhenti Publish Hasil</strong><br/>
                    <small> Publish status</small>
                  </CardHeader>
                  <CardBody className="text-center ">
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label htmlFor="ccnumber">Masukan Waktu Mulai dan berhenti:</Label><br/>
                            <DateTimePicker
                              name="StartVote"
                              onChange={this.onChangePublishStatusStart}
                              value={this.state.startDateTimePublish}
                              required = {true}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                          <strong>Hingga</strong>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                            <DateTimePicker
                              name="EndVote"
                              onChange={this.onChangePublishStatusEnd}
                              value={this.state.endDateTimePublish}
                              required = {true}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup>
                            {this.state.lifecirclestatus === 3 || this.state.lifecirclestatus === 5 ?(
                            <Button className="btn-pill btn btn-danger btn-block"  onClick={()=> this.updateTimeStatus(this.state.publishStatusid,this.state.startDateTimePublish,this.state.endDateTimePublish,'publish')}>Masukan</Button>
                          ):(
                            <Button className="btn-pill btn btn-danger btn-block" disabled onClick={()=> this.updateTimeStatus(this.state.publishStatusid,this.state.startDateTimePublish,this.state.endDateTimePublish,'publish')}>Masukan</Button>
                          ) }
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr/>
                    <Row>
                      <Col>
                        <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-warning"></i> Tombol aktifkan & non aktifkan secara langsung </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="2" sm="2">
                        <AppSwitch className={'mx-1'}  checked={this.state.publishStatusButton} variant={'3d'} outline={'alt'} color={'danger'}  label onClick={() => this.onStatusPublishChangeButton(this.state.publishStatusidButton)} dataOn={'\u2713'} dataOff={'\u2715'} />
                      </Col>
                      <Col xs="8" sm="8" style={{marginRight:'-2.5em'}}>
                      <span className="text-muted" style={{fontSize:'12px'}}><i className="fa fa-hand-o-left"></i> On/Off Switch Status<br/> On/Off Status <i className="fa fa-hand-o-right"></i></span>
                      </Col>
                      <Col xs="1" sm="1">
                        {this.state.publishStatusButton === true ?(
                        <AppSwitch className={'mx-1'}  checked={this.state.publishStatus} variant={'3d'} outline={'alt'} color={'danger'}  label onClick={() => this.onStatusPublishChange(this.state.publishStatusid)} />
                        ):(
                          <AppSwitch className={'mx-1'}  checked={this.state.publishStatus} variant={'3d'} outline={'alt'} color={'danger'}  label onClick={() => this.onStatusPublishChange(this.state.publishStatusid)} disabled />
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className='homeBackground text-white'>
                    <strong>Pengaturan untuk melakukan pemungutan suara / e-voting ulang dan rekapitulasi ulang</strong><br/>
                    <small> fitur ini hanya dapat digunakan dalam proses menyelesaian sengketa.</small>
                  </CardHeader>
                  <CardBody className="text-center ">
                    <Col col="2" className="mb-3 mb-xl-0 text-center">
                    <FormGroup>
                      <Label htmlFor="ccnumber">pemungutan suara ulang. (Voting ulang)</Label><br/>
                        {this.state.lifecirclestatus === 4 ? (
                          <Button outline color="primary"   onClick={()=> this.onStatusLifeCircleButton(idLifeCircle,'ulang')}>
                            <i className="fa fa-refresh" ></i>&nbsp;E-voting ulang
                          </Button>
                        ):(
                          <Button outline color="primary" disabled onClick={()=> this.onStatusLifeCircleButton(idLifeCircle,'ulang')}>
                            <i className="fa fa-refresh" ></i>&nbsp;E-voting ulang
                          </Button>
                        )}
                      </FormGroup>
                      <FormGroup>
                      <Label htmlFor="ccnumber">Rekapitulasi Ulang</Label><br/>
                        {this.state.lifecirclestatus === 4 ? (
                          <Button outline color="primary"   onClick={()=> this.onRekapitulasiUlang()}>
                            <i className="fa fa-refresh" ></i>&nbsp;Rekapitulasi ulang
                          </Button>
                        ):(
                          <Button outline color="primary" disabled onClick={()=> this.onRekapitulasiUlang()}>
                            <i className="fa fa-refresh" ></i>&nbsp;Rekapitulasi ulang
                          </Button>
                        )}
                      </FormGroup>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="12">
                <Card>
                  <CardHeader className="homeBackground text-white">
                    <span className="float-right  flag-icon flag-icon-id h3"></span>
                    <strong>Hasil Perolehan Suara Setiap Partai</strong>
                  </CardHeader>
                  {this.state.lifecirclestatus > 2 ? (
                  <CardBody>
                    <Row>
                      <Col xs="12" md="12" className="mb-4">
                        <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '1' })}
                              onClick={() => { this.toggleTab('1'); }}
                            >
                              Banten I
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '2' })}
                              onClick={() => { this.toggleTab('2'); }}
                            >
                              Banten II
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: this.state.activeTab === '3' })}
                              onClick={() => { this.toggleTab('3'); }}
                            >
                              Banten III
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                              <thead className="thead-light">
                              <tr>
                                <th className="text-center"><i className="fa fa-sort-numeric-asc"></i></th>
                                <th>Nama Partai</th>
                                <th className="text-center">Bendera</th>
                                <th>Persentase Suara</th>
                                <th className="text-center">Kursi</th>
                                <th>Aksi</th>
                              </tr>
                              </thead>
                              <tbody>
                                {Banten1rekapitulasi.map((item, i) => (
                                  <tr key={item.id}>
                                    <td className="text-center" style={{width:'1em'}}>
                                      <div className="avatar">
                                      {i+1}
                                      </div>
                                    </td>
                                    <td style={{width:'23em'}}>
                                      <div>{item.nama}</div>
                                      <div className="small text-muted">
                                        <span>Akronim</span> | {item.akronim}
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
                                    <td className="text-center">
                                      {item.sits}
                                    </td>
                                    <td>
                                      <Button className="bg-danger" title='Daftar Caleg' onClick={() => this.toggleDetailData(item.caleg,"Banten1",item.bendera,item.akronim)}><i className="fa fa-users"></i></Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </TabPane>
                          <TabPane tabId="2">
                            <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                              <thead className="thead-light">
                              <tr>
                                <th className="text-center"><i className="fa fa-sort-numeric-asc"></i></th>
                                <th>Nama Partai</th>
                                <th className="text-center">Bendera</th>
                                <th>Persentase Suara</th>
                                <th className="text-center">Kursi</th>
                                <th>Aksi</th>
                              </tr>
                              </thead>
                              <tbody>
                                {Banten2rekapitulasi.map((item, i) => (
                                  <tr key={item.id}>
                                    <td className="text-center" style={{width:'1em'}}>
                                      <div className="avatar">
                                      {i+1}
                                      </div>
                                    </td>
                                    <td style={{width:'23em'}}>
                                      <div>{item.nama}</div>
                                      <div className="small text-muted">
                                        <span>Akronim</span> | {item.akronim}
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
                                    <td className="text-center">
                                      {item.sits}
                                    </td>
                                    <td>
                                      <Button className="bg-success" title='Daftar Caleg' onClick={() => this.toggleDetailData(item.caleg,"Banten2",item.bendera,item.akronim)}><i className="fa fa-users"></i></Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </TabPane>
                          <TabPane tabId="3">
                            <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                              <thead className="thead-light">
                              <tr>
                                <th className="text-center"><i className="fa fa-sort-numeric-asc"></i></th>
                                <th>Nama Partai</th>
                                <th className="text-center">Bendera</th>
                                <th>Persentase Suara</th>
                                <th className="text-center">Kursi</th>
                                <th>Aksi</th>
                              </tr>
                              </thead>
                              <tbody>
                                {Banten3rekapitulasi.map((item, i) => (
                                  <tr key={item.id}>
                                    <td className="text-center" style={{width:'1em'}}>
                                      <div className="avatar">
                                      {i+1}
                                      </div>
                                    </td>
                                    <td style={{width:'23em'}}>
                                      <div>{item.nama}</div>
                                      <div className="small text-muted">
                                        <span>Akronim</span> | {item.akronim}
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
                                      <Progress animated className="progress-xs" color="primary"  value={Math.round((item.vote / this.state.Banten3SumOfVoteState) * 100)} />
                                    </td>
                                    <td className="text-center">
                                      {item.sits}
                                    </td>
                                    <td>
                                      <Button className="bg-primary" title='Daftar Caleg' onClick={() => this.toggleDetailData(item.caleg,"Banten3",item.bendera,item.akronim)}><i className="fa fa-users"  ></i></Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </TabPane>
                        </TabContent>
                      </Col>
                    </Row>
                    <Modal isOpen={this.state.detailToggle} toggle={this.toggleDetail}
                      className = {modalBackground}>
                      <ModalHeader toggle={this.toggleDetail}>
                          <img style={{height:'3em'}} src={this.state.benderaPartai} className="img-rounded" alt={namaPartai} />  Daftar Calon Legislatif dari Partai {namaPartai} 
                      </ModalHeader>
                        <ModalBody>
                          <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                            <thead className="thead-light">
                              <tr>
                                <th className="text-center"><i className="fa fa-users"></i></th>
                                <th>Nama Calon Legislatif</th>
                                <th>Suara</th>
                                <th className="text-center">Asal Suara</th>
                              </tr>
                            </thead>
                              <tbody>
                                {CalegRekapitulasi.map((item, i) => (
                                  <tr key={item.id}>
                                    <td className="text-center" style={{width:'7em'}}>
                                      <div className="avatar">
                                        <img style={{height:'2.8em'}} src={item.img} className="img-avatar responsive" alt={item.nama} />
                                      </div>
                                    </td>
                                    <td style={{width:'18em'}}>
                                      <div>{item.nama}</div>
                                      <div className="small text-muted">
                                      <span>Calon legislatif dapil</span> | {calegCategory}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                        {item.vote}
                                    </td>
                                    <td className="text-center">
                                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                                        <thead  className="thead-light">
                                          <tr>
                                            <th > 
                                              Kota / Kabupaten
                                            </th>
                                            <th className="text-center" >
                                              Jumlah suara
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {item.descVote.map((itemvote, i) => (
                                            <tr key={itemvote.id}>
                                              <td >
                                                {itemvote.region}
                                              </td>
                                              <td className="text-center">
                                                {itemvote.vote}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                        </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onClick={this.toggleDetail}>Selesai</Button>
                      </ModalFooter>
                    </Modal>
                  </CardBody>
                  ):(
                    <CardBody>
                      <Alert color="primary">
                          HASIL BELUM DIPEROLEH
                      </Alert>
                    </CardBody>
                  )}
                </Card>
              </Col>
              <Col  xs="12" sm="12" lg="12">
                <Card>
                  <CardHeader className="homeBackground text-white">
                    <strong>Tabel Hasil Perolehan Kursi Calon Legislatif DPR RI Provinsi Banten</strong><br/>
                    <small>Tabel Perolehan Kursi</small>
                  </CardHeader>
                  {this.state.lifecirclestatus > 2 ? (
                  <CardBody className="text-center ">
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab1 === '1' })}
                            onClick={() => { this.toggleTab1('1'); }}
                          >
                            Banten I
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab1 === '2' })}
                            onClick={() => { this.toggleTab1('2'); }}
                          >
                             Banten II
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab1 === '3' })}
                            onClick={() => { this.toggleTab1('3'); }}
                          >
                            Banten III
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={this.state.activeTab1}>
                        <TabPane tabId="1">
                          <Table responsive striped>
                            <thead>
                              <tr>
                                <th className="text-center">No</th>
                                <th className="text-center">Foto Caleg</th>
                                <th>Nama Caleg</th>
                                <th>Nama Partai </th>
                                <th className="text-center">Bendera</th>
                                <th className="text-center">Status</th>
                                {this.state.lifecirclestatus === 3 &&
                                  <th className="text-center">Aksi</th>
                                }
                              </tr>
                            </thead>
                              {this.state.Banten1SumOfCalegSitsState !== undefined && 
                                <tbody>
                                  {this.createTable(this.state.Banten1SumOfCalegSitsState,"Banten1")}
                                </tbody>
                              }
                            </Table>
                        </TabPane>
                        <TabPane tabId="2">
                        <Table responsive striped>
                            <thead>
                              <tr>
                                <th className="text-center">No</th>
                                <th className="text-center">Foto Caleg</th>
                                <th>Nama Caleg</th>
                                <th>Nama Partai </th>
                                <th className="text-center">Bendera</th>
                                <th className="text-center">Status</th>
                                {this.state.lifecirclestatus === 3 &&
                                  <th className="text-center">Aksi</th>
                                }
                              </tr>
                            </thead>
                              {this.state.Banten2SumOfCalegSitsState !== undefined && 
                                <tbody>
                                  {this.createTable(this.state.Banten2SumOfCalegSitsState,"Banten2")}
                                </tbody>
                              }
                            </Table>
                        </TabPane>
                        <TabPane tabId="3">
                        <Table responsive striped>
                            <thead>
                              <tr>
                                <th className="text-center">No</th>
                                <th className="text-center">Foto Caleg</th>
                                <th>Nama Caleg</th>
                                <th>Nama Partai </th>
                                <th className="text-center">Bendera</th>
                                <th className="text-center">Status</th>
                                {this.state.lifecirclestatus === 3 &&
                                  <th className="text-center">Aksi</th>
                                }
                              </tr>
                            </thead>
                              {this.state.Banten3SumOfCalegSitsState !== undefined && 
                                <tbody>
                                  {this.createTable(this.state.Banten3SumOfCalegSitsState,"Banten3")}
                                </tbody>
                              }
                            </Table>
                            
                        </TabPane>
                      </TabContent> 
                    </CardBody>
                     ):(
                      <CardBody>
                        <Alert color="primary">
                            HASIL BELUM DIPEROLEH
                        </Alert>
                      </CardBody>
                    )}
                  </Card>
              </Col>
            </Row>
            <Modal isOpen={this.state.pastikan} toggle={this.togglePastikanCaleg}
              className ="homeBackground">
              <ModalHeader toggle={this.togglePastikanCaleg}>
                 Pastikan Calon Legislatif
              </ModalHeader>
              <ModalBody>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th className="text-center">Foto Caleg</th>
                    <th>Nama Caleg</th>
                    <th>Nama Partai </th>
                    <th className="text-center">Bendera</th>
                    <th className="text-center">Sebaran Data</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                      {tabelPastikanCaleg}
                </tbody>
              </Table>
                {this.state.dataSebaran !== '' &&
                <Modal isOpen={this.state.sebaranDataState} toggle={this.toggleSebaranData}>
                  <ModalHeader toggle={this.toggleSebaranData} className="bg-primary">
                    Lihat Sebaran
                  </ModalHeader>
                  <ModalBody>
                    <h3>Sebaran Data Caleg</h3>
                  <Table responsive striped>
                    <tbody>
                    {this.state.dataSebaran.map((item, i) => (
                      <tr key={item.id}>
                        <td>{item.region}</td>
                        <td>{item.vote}</td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggleSebaranData}>Selesai</Button>
                  </ModalFooter>
                </Modal>
                }
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.togglePastikanCaleg}>Selesai</Button>
              </ModalFooter>
            </Modal>
           
          </div>
      </div>
    );
  }
}

export default Dashboard;
