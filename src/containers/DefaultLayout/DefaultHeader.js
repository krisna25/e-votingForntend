import React, { Component } from 'react';
import {  DropdownItem, DropdownMenu, DropdownToggle, Nav,  NavLink} from 'reactstrap';
import PropTypes from 'prop-types';
import {  AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/evoting.png';
import sygnet from '../../assets/img/brand/evoting.png';
import { withRouter } from "react-router-dom";
import { tokenAuth } from "../../middleware/cookies-manager";
import swal from 'sweetalert';
import { postApi } from "../../middleware/api";

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleVote: "",
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleCekData = this.handleCekData.bind(this);

  }
  async componentWillMount() {
    const userData = tokenAuth.tokenAuthenticated();
    if (userData.authToken === true) {
      const ktpRegion = userData.dataToken.ktp.nik.substring(2, 4);
      if (ktpRegion === "01" || ktpRegion === "02") {
        this.setState({
          titleVote: "I"
        });
      } else if (ktpRegion === "04" || ktpRegion === "72" || ktpRegion === "73") {
        this.setState({
          titleVote: "II"
        });
      } else if (ktpRegion === "03" || ktpRegion === "71" || ktpRegion === "74") {
        this.setState({
          titleVote: "III"
        });
      }
    }
  }

  async handleCekData(){
  
    const cekData = await swal({
      title: "Cek data anda disini",
      text: "masukan nomor ktp anda ",
      icon: "warning",
      content: {
        element: "input",
        attributes: {
          placeholder: "Masukan nomor ktp anda",
          type: "text",
          id:'noKTP',
        },
      },
      dangerMode: true,
      buttons: true,
    })
    if (cekData) {
     this.setState({
        ktp: document.getElementById("noKTP").value
      })
      const result = await postApi('/getWhereKtp',this.state)
      if(result.status === 404 ){
        swal({
          title: "Anda tidak terdaftar!",
          text: "Anda tidak terdaftar pada database KPUD Provinsi Banten, silahkan cek kembali data anda",
          icon: "error",
        })
      }else{
        swal({
          title: "Anda terdaftar!",
          text: "Hai "+result.data.nama+", anda telah terdaftar pada database KPUD Provinsi Banten, silahkan lakukan registrasi ",
          icon: "success",
        })
      }
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
      
      return this.props.history.push("/login");
    }
  }
  render() {
    const userData = tokenAuth.tokenAuthenticated();
    var loginStatus = userData.authToken;
    var roleUsers  = userData.dataToken.role;
    // const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'E-Voting caleg 2019' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'E-Voting caleg 2019' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <ul className="d-md-down-none navbar-nav">
           {roleUsers !== 0 &&
            <li className="px-3 nav-item"><a onClick={this.handleCekData} className="nav-link" href="#!">Cek Data Anda</a></li>
          }
          </ul>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            {loginStatus === true ? (
              <DropdownToggle nav>
                <img  className="img-avatar"  src={userData.dataToken.ktp.foto}  alt=" booth catalog"  />
              </DropdownToggle>
            ):(
              <DropdownToggle nav>
                <i className="fa fa-user-o" ></i>
              </DropdownToggle>
            )}
            <DropdownMenu right style={{ right: 'auto' }}>
              {loginStatus === true ? (
                <DropdownItem  onClick={this.handleLogout}><i className="fa fa-sign-out"></i> 
                  Logout
                </DropdownItem>
              ):(
                <DropdownItem>
                  <NavLink href="/#/login"><i className="fa fa-sign-in"></i>Login</NavLink>
                </DropdownItem>
              )}
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
