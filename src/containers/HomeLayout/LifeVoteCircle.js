import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

let status;
class LifeVoteCircle extends Component {
render() {
    const {lifecirclestatus} = this.props;
    status = lifecirclestatus;
    let faseVote;
    let faseRekap;
    let fasePublish;
    let faseSengketa;
    let faseFixHasil;
    if (status === 1) {
        faseVote = <li className="steps__item  steps__item--active  steps__item--first"><a href="#" onClick={()=>this.props.history.push("/login")} className="steps__link">Voting</a></li>;
    } else if (status > 1){
        faseVote = <li className="steps__item  steps__item--done  steps__item--first"><span className="steps__link">Voting</span></li>
    } else {
        faseVote = <li className="steps__item  steps__item--first"><span className="steps__link">Voting</span></li>
    }
    if (status === 2) {
        faseRekap = <li className="steps__item  steps__item--active"><span className="steps__link">Rekapitulasi</span></li>;
    } else if (status > 2){
        faseRekap = <li className="steps__item  steps__item--done"><span className="steps__link">Rekapitulasi</span></li>;
    } else {
        faseRekap = <li className="steps__item "><span className="steps__link">Rekapitulasi</span></li>;
    }
    if (status === 3) {
        fasePublish = <li className="steps__item  steps__item--active"><a href="#" onClick={()=>this.props.history.push("/home/hasil")} className="steps__link">Hasil Setelah Rekapitulasi</a></li>;
    } else if (status > 3){
        fasePublish = <li className="steps__item  steps__item--done"><span className="steps__link">Hasil Setelah Rekapitulasi</span></li>;
    } else {
        fasePublish = <li className="steps__item "><span className="steps__link">Hasil Setelah Rekapitulasi</span></li>;
    }
    if (status === 4) {
        faseSengketa = <li className="steps__item  steps__item--active"><span  className="steps__link">Penyelesaian Sengketa</span></li>;
    } else if (status > 4){
        faseSengketa = <li className="steps__item  steps__item--done"><span className="steps__link">Penyelesaian Sengketa</span></li>;
    } else {
        faseSengketa = <li className="steps__item "><span className="steps__link">Penyelesaian Sengketa</span></li>;
    }
    if (status === 5) {
        faseFixHasil = <li className="steps__item  steps__item--active steps__item--last"><a href="#" onClick={()=>this.props.history.push("/home/hasil")} className="steps__link">Hasil akhir</a></li>;
    } else if (status > 5){
        faseFixHasil = <li className="steps__item  steps__item--done steps__item--last"><span className="steps__link">Hasil akhir</span></li>;
    } else {
        faseFixHasil = <li className="steps__item steps__item--last"><span className="steps__link">Hasil akhir</span></li>;
    }
    return (
        <React.Fragment>
            <ol className="steps">
                {faseVote}
                {faseRekap}
                {fasePublish}
                {faseSengketa}
                {faseFixHasil}
            </ol>  
        </React.Fragment>
    )}
}
export default withRouter(LifeVoteCircle);
