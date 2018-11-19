import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
         <Row className="homeBackground" style={{position:'fixed', bottom:'0px',left:'0px',right:'0px'}}>
            <Col>
              <div className="text-white text-center " style={{fontWeight:'bold',height:'3em',paddingTop:'1em'}}>
                  Krisna Arief Budiman © 2018
              </div>
            </Col>
          </Row>
      </React.Fragment>
    );
  }
}

export default Footer;
