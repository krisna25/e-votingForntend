import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import Datatable from 'react-bs-datatable'; // Import this package
import { fetchApi } from '../../middleware/api';
import { postApi } from "../../middleware/api";
var moment = require('moment'); 
var data = []
const header = [
  { title: 'Foto', prop: 'foto', },
  { title: 'Nama Caleg', prop: 'nama', sortable: true, filterable: true },
  { title: 'Nama Partai', prop: 'namapartai',sortable: true, filterable: true },
  { title: 'Akronim', prop: 'akronim',sortable: true, filterable: true },
  { title: 'Dapil', prop: 'dapil',sortable: true, filterable: true },
];

const onSortFunction = {
  date(columnValue) {
    // Convert the string date format to UTC timestamp
    // So the table could sort it by number instead of by string
    return moment(columnValue, 'Do MMMM YYYY').valueOf();
  },
};

const customLabels = {
  first: '<<',
  last: '>>',
  prev: '<',
  next: '>',
  show: 'Display',
  entries: 'rows',
  noResults: 'There is no data to be displayed',
};

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataBody:[],
      dataParpol:''
    }
  }


  async componentWillMount(){
    const AllcalegData = await fetchApi('/getAll-caleg');
    const AllParpolData =  await fetchApi('/getAllParpols');
    
    if(AllParpolData && AllcalegData){

      for (let index = 0; index < AllcalegData.data.length; index++) {
        const element = AllcalegData.data[index];
        data.push({
          'foto':<img style={{height:'4.5em'}} src={element.img} className="img-rounded" alt={element.name} />,
          'nama': element.name,
          'namapartai': element.idParpol.name,
          'akronim': element.idParpol.akronim,
          'dapil': element.category
        })
      }
      this.setState({
        dataBody:data,
        dataParpol: AllParpolData.data
      })
      console.log(data)
    }
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader className="homeBackground text-white">
                <i className="fa fa-table"></i> Daftar Peserta Pemilihan Calon anggota Legislatif DPR Provinsi Banten <small className="text-muted">tabel caleg</small>
              </CardHeader>
              <CardBody>
                {data.length !== 0 &&
                <Datatable
                  tableHeader={header}
                  tableBody={data}
                  keyName="userTable"
                  tableClass="striped hover responsive"
                  rowsPerPage={5}
                  rowsPerPageOption={[5, 10, 15, 20]}
                  initialSort={{prop: "username", isAscending: true}}
                  onSort={onSortFunction}
                  labels={customLabels}
                />
                }
              </CardBody>
            </Card>
          </Col>
          <Col xl={12} sm={12} md={12}>
            <Card>
              <CardHeader className="homeBackground text-white">
                <i className="fa fa-table"></i> Daftar Partai Politik Peserta Pemilu Caleg DPR Provinsi Banten <small className="text-muted">tabel parpol</small>
              </CardHeader>
              <CardBody>
                <Table hover responsive className="table-outline mb-0 d-none d-sm-table ">
                <thead className="thead-light">
                <tr>
                  <th className="text-center"><i className="fa fa-sort-numeric-asc"></i></th>
                  <th>Nama Partai</th>
                  <th>Akronim</th>
                  <th className="text-center">Bendera</th>
                </tr>
                </thead>
                {this.state.dataParpol !== '' &&
                <tbody>
                  {this.state.dataParpol.map((item, i) => (
                    <tr key={item.id}>
                      <td className="text-center" style={{width:'1em'}}>
                        <div className="avatar">
                        {i+1}
                        </div>
                      </td>
                      <td style={{width:'23em'}}>
                       {item.name}
                      </td>
                      <td>
                        {item.akronim}
                      </td>
                      <td className="text-center">
                        <img style={{height:'2.4em'}} src={item.bendera} className="img-rounded" alt={item.akronim} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                }
              </Table>
            </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Data;
