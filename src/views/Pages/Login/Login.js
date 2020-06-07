import React, { Component } from 'react';
import { postApi } from "../../../middleware/api";
import { tokenAuth } from "../../../middleware/cookies-manager";
import "../../../assets/css/registerAndLogin.css";
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row,Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import swal from 'sweetalert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      name: "",
      noKtp: "",
      noKk: "",
      noKkForgot:"",
      noKtpForgot:"",
      newPassword:"",
      password: "",
      passwordHasing:"",
      confirmpassword: "",
      showAlert: "",
      showAlert1: "",
      showAlert2: "",
      showAlert3: "",
      showAlert4: "",
      showAlert5: "",
      showAlert6: "",
      statusLogin: "",
      valueOfMessage: "",
      valueOfMessage1: "",
      valueOfMessage2: "",
      valueOfMessage3: "",
      valueOfMessage4: "",
      valueOfMessage5: "",
      valueOfMessage6: "",
      loginMessage: "",
      activeIndex: 0,
      forgotPassword: false,
    };
    this.onHandleChangeForgot = this.onHandleChangeForgot.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.toggleRegister = this.toggleRegister.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onHandleSubmitLogin = this.onHandleSubmitLogin.bind(this);
    this.toggleForgotPassword =  this.toggleForgotPassword.bind(this);
    this.onHandleForgotPassword = this.onHandleForgotPassword.bind(this);
  }

  async componentWillMount(){
    const userData = tokenAuth.tokenAuthenticated();
    if(userData.authToken === true){
      return this.props.history.push("/home");
    }
  }

  toggleRegister() {
    this.setState({
      register: !this.state.register
    });
  }

 
  toggleForgotPassword() {
    this.setState({
    forgotPassword: !this.state.forgotPassword
    });
  }

  onHandleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  onHandleChangeForgot(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  onHandleChangeLogin(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  async onHandleSubmit() {
    const { noKtp, noKk, password, confirmpassword } = this.state;
    const errors = {};
    if (noKtp === "") {
      errors.noKtp = "Nomor ktp dibutuhkan!";
      this.setState({
        showAlert1: true,
        valueOfMessage1: "Nomor ktp dibutuhkan!"
      });
    } else {
      errors.noKtp = "";
      this.setState({
        showAlert1: false
      });
    }
    if (noKk === "") {
      errors.noKk = "Nomor KK dibutuhkan!";
      this.setState({
        showAlert2: true,
        valueOfMessage2: "Nomor KK dibutuhkan!"
      });
    } else {
      errors.noKk = "";
      this.setState({
        showAlert2: false
      });
    }
    if (password === "") {
      errors.password = "Password dibutuhkan!";
      this.setState({
        showAlert3: true,
        valueOfMessage3: "Password dibutuhkan!"
      });
    } else {
      errors.password = "";
      this.setState({
        showAlert3: false
      });
    }
    if (confirmpassword !== password) {
      errors.confirmpassword = "Password tidak sama!";
      this.setState({
        showAlert4: true,
        valueOfMessage4: "Passwords tidak sama!"
      });
    } else {
      errors.confirmpassword = "";
      this.setState({
        showAlert4: false
      });
    }
    if (
      errors.noKk === "" &&
      errors.noKtp === "" &&
      errors.password === "" &&
      errors.confirmpassword === ""
    ) {
      try {
        const willVerifikasi = await swal({
          title: "Verifikasi!",
          text: "Masukan no Ktp kerabat anda yang berada dalam satu Kartu Keluarga",
          icon: "warning",
          button:true,
          content:{
            element: "input",
            attributes: {
              placeholder: "Masukan nomor ktp kerabat anda dalam satu KK",
              type: "text",
              id:'verifikasi',
            }
          }
        })
        if(willVerifikasi){
          this.setState({
            noKkForgot: noKk
          })
          const KtpVerifikasi = document.getElementById("verifikasi").value;
          const verifikasi = await postApi("/cekKtpRef", this.state);
          if(!verifikasi){
            swal({
              title: "Verifikasi Gagal,Kesalahan 500",
              text: "Silahkan coba kembali lain waktu",
              icon: "error",
            })
          }else if (verifikasi.status === 404) {
            swal({
              title: "Verifikasi Gagal",
              text: "Verifikasi anda gagal ",
              icon: "error",
            })
            this.setState({
              register: !this.state.register
            });
          }else{ 
            var countCek = 0
            if (KtpVerifikasi !== noKtp) {
              for (let index = 0; index < verifikasi.data.length; index++) {
                if (KtpVerifikasi === verifikasi.data[index].nik) {
                  var { status } = await postApi("/signup", this.state);
                  this.setState({
                    showAlert: false,
                    showAlert1: false,
                    showAlert2: false,
                    showAlert3: false,
                    showAlert4: false
                  });    
                }else{
                  countCek = countCek + 1
                }
              }
              if (countCek === verifikasi.data.length ) {
                swal({
                  title: "Verifikasi Gagal",
                  text: "Verifikasi anda gagal ",
                  icon: "error",
                })
                this.setState({
                  register: !this.state.register
                });
              }
              
            }else{
              swal({
                title: "No KTP sama!",
                text: "jangan memasukan nomor KTP anda kembali ",
                icon: "error",
              })
            }
          }
        }
      } catch (e) {
        this.setState({
          showAlert: true,
          valueOfMessage: "No. Ktp anda sudah terdaftar"
        });
      }
      if (status === 200) {
        this.setState({
          register: !this.state.register
        });
        swal({
          title: "Registrasi berhasil!",
          text: "proses regisrasi anda berhasil Password Anda adalah  "+ password +". silahkan foto atau Screen Shot halaman ini untuk menyimpan password anda",
          icon: "success",
        })
        
      } else if (status === 404) {
        this.setState({
          showAlert: true,
          valueOfMessage:
            "No. Ktp atau No. KK anda tidak kami temukan dalam database. Pastikan anda terdaftar sebagai DPT"
        });
      }
    }
  }

  async onHandleSubmitLogin() {
    // const { noKtp, noKk, password } = this.state;
    const res = await postApi("/login", this.state);
    if (res) {
      if (res.status === 200) {
        tokenAuth.setCookies(res.data.data.token, res.data.data.user);
        if (res.data.data.user.role === 1) {
          return this.props.history.push("/dashboard/vote");
        } else if (res.data.data.user.role === 0) {
          return this.props.history.push("/dashboard");
        }
        this.setState({ statusLogin: false });
      } else if (res.status === 404) {
        this.setState({
          statusLogin: true,
          loginMessage: "Data yang anda masukan salah Silahkan cek kembali"
        });
      } else if (res.status === 403) {
        this.setState({
          statusLogin: true,
          loginMessage: "Password yang anda masukan salah"
        });
      } else {
        this.setState({
          statusLogin: true,
          loginMessage: "Data yang anda masukan salah"
        });
      }
    }else{
      return this.props.history.push("/500");
    }
  }

  async onHandleForgotPassword(){

    const { noKtpForgot, noKkForgot} = this.state;
    const errors = {};
    if (noKtpForgot === "") {
      errors.noKtpForgot = "Nomor ktp dibutuhkan!";
      this.setState({
        showAlert5: true,
        valueOfMessage5: "Nomor ktp dibutuhkan!"
      });
    } else {
      errors.noKtpForgot = "";
      this.setState({
        showAlert5: false
      });
    }
    if (noKkForgot === "") {
      errors.noKkForgot = "Nomor KK dibutuhkan!";
      this.setState({
        showAlert6: true,
        valueOfMessage6: "Nomor KK dibutuhkan!"
      });
    } else {
      errors.noKkForgot = "";
      this.setState({
        showAlert6: false
      });
    }

    if (errors.noKkForgot === "" && errors.noKtpForgot === "" ) {
      const result = await postApi("/cekKtpdanKK", this.state);
        if (!result) {
          swal({
            title: "Kesalahan 500!",
            text: "Terjadi kesalahan pada server, silahkan coba kembali lain beberapa saat lagi",
            icon: "error",
          })
        }else if(result.status === 404 ){
          swal({
            title: "Data tidak ditemukan!",
            text: "Data anda tidak ada, pastikan data yang anda masukan sudah benar ",
            icon: "error",
          })
        }else{
          const willResetPassword = await swal({
            title: "Data ditemukan",
            text: "Hai, "+ result.data.ktp.nama+" data anda ditemukan. Silahkan masukan nomor ktp salah satu keluarga anda yang masuk dalam satu Kartu keluarga",
            icon: "success",
            button:true,
            content:{
              element: "input",
              attributes: {
                placeholder: "Masukan nomor ktp kerabat anda dalam satu KK",
                type: "text",
                id:'cekKtpKeluarga',
              }
            }
          })
          if (willResetPassword){
            const ktpRef = document.getElementById("cekKtpKeluarga").value;
            const resultOfKtpRef = await postApi('/cekKtpRef', this.state);
            var countCek = 0;
            if (resultOfKtpRef) {
              if (this.state.noKtpForgot !== ktpRef) {
                for (let index = 0; index < resultOfKtpRef.data.length; index++) {
                  if (ktpRef === resultOfKtpRef.data[index].nik) {
                    const ResetPassword = await swal({
                      title: "Masukan Password Baru",
                      text: "Hai, "+ result.data.ktp.nama+" data anda kerabat anda ditemukan. Silahkan Masukan Password baru anda",
                      icon: "success",
                      button:true,
                      content:{
                        element: "input",
                        attributes: {
                          placeholder: "Masukan password baru anda disini",
                          type: "text",
                          id:'newPassword',
                        }
                      }
                    })
                    if (ResetPassword) {
                      this.setState({
                        newPassword: document.getElementById("newPassword").value
                      })
                      const passhashing = await postApi("/getHashing",this.state)
                      this.setState({
                        passhashing : passhashing.data
                      })
                      const postNewPass = await postApi("/ForgotPassword",this.state)
                      if (postNewPass.status === 200) {
                        swal({
                          title: "Password berhasil diubah!",
                          text: " Ingat password baru anda adalah  "+this.state.newPassword +" Silahkan Foto Atau Screen Shot Halaman ini",
                          icon: "success",
                        })
                        this.setState({
                        forgotPassword: !this.state.forgotPassword
                        });
                      }else{
                        swal({
                          title: "Password gagal dirubah!",
                          text: " password anda gagal di ubah",
                          icon: "error",
                        })
                        this.setState({
                        forgotPassword: !this.state.forgotPassword
                        });
                      }
                    }
                  }else{
                    countCek = countCek + 1
                  }
                }
                if (countCek === resultOfKtpRef.data.length) {
                  swal({
                    title: "Ktp tidak Ada!",
                    text: "Ktp kerabat anda tidak ditemukan, silahkan cek kembali ",
                    icon: "error",
                  })
                }
              }
              else{
                swal({
                  title: "Ktp sama!",
                  text: "jangan memasukan KTP anda kembali. silahkan masukan no KTP kerabat anda dalam satu Kartu Keluarga! ",
                  icon: "warning",
                })
              }
            }else{
              return this.props.history.push("/500");
            }
          }
        }
    }
  }

  render() {
    const { noKtp, noKk, password } = this.state;
    const isEnabled =
      noKk.length > 0 && password.length > 0 && noKtp.length > 0;
    return (
      <div className="animated fadeIn app flex-row align-items-center loginbackground">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4 homeBackground text-white">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Masuk ke dalam akun anda dengan nomor KTP dan nomor KK anda yang telah terdaftar.</p>
                    <div
                      className="alert alert-warning text-center"
                      style={this.state.statusLogin ? {} : { display: "none" }}
                    >
                      <i className="fa fa-warning"></i> <strong>Warning</strong> <br/>{this.state.loginMessage}
                    </div>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" 
                        placeholder="Masukan Nomor Kartu Tanda Penduduk" 
                        name="noKtp"
                        id="noKtp"
                        required="required"
                        onChange={e => this.onHandleChangeLogin(e)}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-people"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" 
                        placeholder="Masukan Nomor Kartu Keluarga"  
                        name="noKk"
                        id="noKk"
                        required="required"
                        onChange={e => this.onHandleChangeLogin(e)}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Masukan Password" 
                        name="password"
                        id="password"
                        required="required"
                        onChange={e => this.onHandleChangeLogin(e)} />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="secondary" 
                          className="px-4"  
                          disabled={!isEnabled}
                          onClick={this.onHandleSubmitLogin}>
                          Login
                        </Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0 text-muted" onClick={this.toggleForgotPassword}> Lupa Password?</Button>
                      </Col>
                    </Row>
                    <Row className="d-lg-none">
                      <Col xs="12" className="pt-3">
                      <h2 className="text-center">Registrasi</h2>
                      <p className="text-center">Silahkan melakukan Registrasi terlebih dahulu sebelum anda melakukan login. 
                        Jika anda sudah melakukan registrasi sebelumnya anda dapat langsung melakukan login. 
                        Pastikan bahwa KTP anda terdaftar sebagai DPT</p>
                      <Button color="dark" 
                          onClick={this.toggleRegister}
                          style={{position:'blok', width:'100%',marginTop:'2em'}}
                          >
                          Registrasi Sekarang!
                        </Button>
                        <p><small>kembali ke halaman <Button className="btn btn-ghost-success" onClick={()=>this.props.history.push("/home")} ><i className="cui-home"></i>Home</Button></small></p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="py-5 d-md-down-none d-md-12" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Registrasi</h2>
                      <p>Silahkan melakukan Registrasi terlebih dahulu sebelum anda melakukan login. 
                        Jika anda sudah melakukan registrasi sebelumnya anda dapat langsung melakukan login. 
                        Pastikan bahwa KTP anda terdaftar sebagai DPT</p>
                      <Button className="mt-3 homeBackground text-white" onClick={this.toggleRegister}>Registrasi Sekarang!</Button>
                      <p><small>kembali ke halaman <Button className="btn btn-ghost-primary" onClick={()=>this.props.history.push("/home")} ><i className="cui-home"></i>Home</Button></small></p>
                      <Modal isOpen={this.state.register} toggle={this.toggleRegister}
                            className={'modal-default  ' + this.props.className}>
                        <ModalHeader toggle={this.toggleRegister}>Registrasi E-Voting</ModalHeader>
                        <ModalBody className="homeBackground">
                            <Card className="p-4 homeBackground text-white">
                            <CardBody>
                              <div className="text-center"> 
                                <h1>Registrasi</h1>
                                <p className="text-muted">Masukan data anda dengan tepat</p>
                                  <div
                                    className="alert alert-danger text-center"
                                    style={this.state.showAlert ? {} : { display: "none" }}
                                  >
                                    <i className="fa fa-warning"></i> {this.state.valueOfMessage}
                                  </div>
                              </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-user"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                  type="text" 
                                  placeholder=" Masukan Nomor Kartu Tanda Penduduk" 
                                  name="noKtp"
                                  id="noKtp"
                                  required="required"
                                  onChange={e => this.onHandleChange(e)}
                                  />
                              </InputGroup>
                                  <div
                                    className="alert alert-danger text-center"
                                    style={this.state.showAlert1 ? {} : { display: "none" }}
                                  >
                                    <i className="fa fa-warning"></i> {this.state.valueOfMessage1}
                                  </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-people"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" 
                                  placeholder="Masukan Nomor Kartu Keluarga"  
                                  name="noKk"
                                  id="noKk"
                                  required="required"
                                  onChange={e => this.onHandleChange(e)}
                                  />
                              </InputGroup>
                                <div
                                  className="alert alert-danger text-center"
                                  style={this.state.showAlert2 ? {} : { display: "none" }}
                                >
                                  <i className="fa fa-warning"></i> {this.state.valueOfMessage2}
                                </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-lock"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                  type="password" 
                                  placeholder="Masukan Password" 
                                  name="password"
                                  id="password"
                                  required="required"
                                  onChange={e => this.onHandleChange(e)} />
                              </InputGroup>
                                <div
                                  className="alert alert-danger text-center"
                                  style={this.state.showAlert3 ? {} : { display: "none" }}
                                >
                                  <i className="fa fa-warning"></i> {this.state.valueOfMessage3}
                                </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-lock"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input type="password" placeholder="Masukan kembali Password" 
                                  name="confirmpassword"
                                  id="confirmpassword"
                                  required="required"
                                  onChange={e => this.onHandleChange(e)}/>
                              </InputGroup>
                                <div
                                  className="alert alert-danger text-center"
                                  style={this.state.showAlert4 ? {} : { display: "none" }}
                                >
                                  <i className="fa fa-warning"></i> {this.state.valueOfMessage4}
                                </div>
                            </CardBody>
                          </Card>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.onHandleSubmit}>Daftar</Button>
                          <Button color="secondary" onClick={this.toggleRegister}>Batal</Button>
                        </ModalFooter>
                      </Modal>
                      <Modal isOpen={this.state.forgotPassword} toggle={this.toggleForgotPassword}
                            className={'modal-default ' + this.props.className}>
                        <ModalHeader toggle={this.toggleForgotPassword}>Anda Lupa Password ?</ModalHeader>
                        <ModalBody className="homeBackground">
                            <Card className="p-4 homeBackground text-white">
                            <CardBody>
                              <div className="text-center"> 
                                <h1>Lupa Password</h1>
                                <p className="text-muted">Masukan data anda dengan tepat</p>
                                  <div
                                    className="alert alert-danger text-center"
                                    style={this.state.showAlert ? {} : { display: "none" }}
                                  >
                                    <i className="fa fa-warning"></i> {this.state.valueOfMessage}
                                  </div>
                              </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-user"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                  type="text" 
                                  placeholder="Masukan Nomor Kartu Tanda Penduduk Anda" 
                                  name="noKtpForgot"
                                  id="noKtpForgot"
                                  required="required"
                                  onChange={e => this.onHandleChangeForgot(e)}
                                  />
                              </InputGroup>
                                  <div
                                    className="alert alert-danger text-center"
                                    style={this.state.showAlert5 ? {} : { display: "none" }}
                                  >
                                    <i className="fa fa-warning"></i> {this.state.valueOfMessage5}
                                  </div>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-people"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" 
                                  placeholder=" Masukan Nomor Kartu Keluarga Anda"  
                                  name="noKkForgot"
                                  id="noKkForgot"
                                  required="required"
                                  onChange={e => this.onHandleChangeForgot(e)}
                                  />
                              </InputGroup>
                                <div
                                  className="alert alert-danger text-center"
                                  style={this.state.showAlert6 ? {} : { display: "none" }}
                                >
                                  <i className="fa fa-warning"></i> {this.state.valueOfMessage6}
                                </div>
                            </CardBody>
                          </Card>
                        </ModalBody>
                        <ModalFooter>
                          <Button className="homeBackground text-white  " onClick={this.onHandleForgotPassword}>Masukan</Button>
                          <Button color="secondary" onClick={this.toggleForgotPassword}>Batal</Button>
                        </ModalFooter>
                      </Modal>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
