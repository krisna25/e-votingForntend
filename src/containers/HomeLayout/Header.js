import React, { Component } from 'react';
import swal from 'sweetalert';
import {CardHeader, Nav, NavItem, NavLink,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { postApi } from "../../middleware/api";
import { tokenAuth } from "../../middleware/cookies-manager";
import { withRouter } from "react-router-dom";
import { AppHeaderDropdown} from '@coreui/react';


const propTypes = {
    children: PropTypes.node,
  };
const defaultProps = {};

class Header extends Component {
    constructor(props) {
        super(props);
        this.handleCekData = this.handleCekData.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
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
          if(!result){
            return this.props.history.push("/500");
          }else if(result.status === 404 ){
            swal({
              title: "Anda tidak terdaftar!",
              text: "Anda tidak terdaftar dalam Daftar Pemilih Tetap (DPT) KPUD Provinsi Banten, silahkan cek kembali data anda",
              icon: "error",
            })
          }else{
            swal({
              title: "Anda terdaftar!",
              text: "Hai "+result.data.nama+", anda telah terdaftar dalam Daftar Pemilih Tetap (DPT) KPUD Provinsi Banten, silahkan lakukan registrasi ",
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
        this.props.history.push("/login");
        }
    }

  render() {
    const userData = tokenAuth.tokenAuthenticated();
    var loginStatus = userData.authToken;
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <CardHeader className="text-white homeBackground"style={{ fontSize: "2.5vmin",fontWeight:'bold' }}>
            <Nav pills>
                {loginStatus === true &&
                <NavItem>
                    {userData.dataToken.role === 1?(
                        <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block"  onClick={()=>this.props.history.push("/dashboard/vote")}><i className="cui-envelope-letter text-white">  </i> Vote</NavLink>
                    ):(
                        <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block"  onClick={()=>this.props.history.push("/dashboard")}><i className="fa fa-dashboard text-white">  </i> Dashboard</NavLink>
                    )}
                 </NavItem>
                }
                <NavItem>
                    <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block"  onClick={()=>this.props.history.push("/home")}><i className="fa fa-home text-white">  </i> Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block" onClick={()=>this.props.history.push("/home/hasil")} ><i className="fa fa-table text-white">  </i> Hasil</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block" target='_blank' href="https://infopemilu.kpu.go.id/"><i className="fa fa-info text-white"> </i> Info Pemilu</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink style={{fontWeight:'bold'}} className="text-white btn btn-lg btn-ghost-dark btn-block" onClick={this.handleCekData} > <i className="fa fa-search text-white"> </i> Cek Data Saya</NavLink>
                </NavItem>
                <AppHeaderDropdown className=" flex-row ml-md-auto ml-sm-auto d-sm-flex " direction="down">
                    {loginStatus === true ? (
                    <DropdownToggle nav>
                        <img style={{height:'40px'}} src={userData.dataToken.ktp.foto} className="img-avatar" alt={userData.dataToken.ktp.nama} />
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
                            <NavLink onClick={()=>this.props.history.push("/login")}><i className="fa fa-sign-in"></i>Login</NavLink>
                        </DropdownItem>
                    )}
                    </DropdownMenu>
                
                </AppHeaderDropdown>
            </Nav>
        </CardHeader>
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default  withRouter(Header);
