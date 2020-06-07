import React, { Component } from 'react';
import { Col, Row ,Badge} from 'reactstrap';
var _ = require('lodash');

class InfoCaleg extends Component {
//   constructor(props) {
//     super(props);
// }
  render() {
    const { id,namaPartai,dapil,fotoCaleg, namaCaleg,suara ,bendera,rekapkursi} = this.props;
    let badge;
    var samevote =  _.filter(rekapkursi,['keterangan', 'S'])
    if (_.find(rekapkursi,{'id': id}) !== undefined){
        badge = <Badge color="success">Mendapat Kursi</Badge>
    }else{
      if (_.isEmpty(samevote) === false){
        var filterarr = _.filter(samevote,['akronim',namaPartai]);
        if(_.isEmpty(filterarr) === false){
          var temp =[]
          for (let index = 0; index < filterarr.length; index++) {
            const element = filterarr[index];
            temp.push(element.data)
          }
          if (_.find(temp[0],{'id': id}) !== undefined){
            badge = <Badge color="warning">Ditentukan Parpol</Badge>
          }else{
            badge = <Badge color="danger">Tidak mendapat Kursi</Badge>
          }
        }else{
          badge = <Badge color="danger">Tidak mendapat Kursi</Badge>
        }
      }else{
        badge = <Badge color="danger">Tidak mendapat Kursi</Badge>
      }
    }
    
    return (
      <React.Fragment>
          <Row style={{width:'100%',paddingTop:'1em',paddingLeft:'1em',marginRight:'-4em'}}>
            <Col  xs="12" xl="12"  >
              {(namaCaleg.length !== 'Nama Caleg' && namaPartai.length <= 0 ?(
              <div>
                <strong className="text-uppercase"> Nama Caleg Pilihan Anda dari partai {namaPartai} </strong>
                <div className="card" style={{marginTop:'1em'}}>
                  <div className="clearfix p-0 card-body">
                    <Row>
                      <Col xl='12' md='12' sm='12'>
                          <h2>Anda Tidak Memilih</h2>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              ):(
                <div>
                <strong className="text-uppercase"> Nama Caleg Pilihan Anda dari partai {namaPartai} </strong>
                <div className="card" style={{marginTop:'1em'}}>
                  <div className="clearfix p-0 card-body">
                    <i className="bg-warning p-3 px-5 font-2xl mr-3 float-left">
                      <img  style={{height:'1.7em'}} src={fotoCaleg} className="img-avatar" alt={namaCaleg} />
                    </i>
                    <Row>
                      <Col xl='10' md='10' sm='10'>
                      <div className="h5 mb-0 text-warning pt-3">
                          {namaCaleg} {badge}
                        </div>
                        <div className="text-muted  font-weight-bold font-xs ">
                          Perolehan suara : {suara} Suara | Daerah pemilihan {dapil}
                      </div>
                      </Col>
                      <Col xl='1' md='1' sm='1'>
                        <i className=" p-2 px-3 font-2xl mr-3 float-left">
                            <img style={{height:'2.4em'}} src={bendera} className="img-rounded" alt={namaPartai} />
                        </i>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              ))}
             
            </Col>
          </Row>
      </React.Fragment>
    );
  }
}

export default InfoCaleg;
