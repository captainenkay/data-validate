import React, { Component } from 'react';
import { Col, Card, CardBody, Media } from "reactstrap";
import Knob from '../AllCharts/knob/knob';
import TimeCountdown from './TimeCountdown'

class MiniWidgets extends Component {
    constructor(props){
        super(props)
        this.state = {
            bcount: '',
            ecount:'',
            ccount:'',
            bMax:0,
            eMax:0,
            cMax:0,
            date: 'May 1, 2021 00:00:00'

        }
        this.props.reports.map((report,key) => {
            if (report.title === "BITCOIN"){
                var b = report.timeLeft.split(':')
                this.state.bcount = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);
                this.state.bMax = this.state.bcount

            }
            if (report.title === "ETHEREUM"){
                var e = report.timeLeft.split(':')
                this.state.ecount = (+e[0]) * 60 * 60 + (+e[1]) * 60 + (+e[2]);
                this.state.eMax = this.state.ecount

            }
            if (report.title === "CIVIC"){
                var c = report.timeLeft.split(':')
                this.state.ccount = (+c[0]) * 60 * 60 + (+c[1]) * 60 + (+c[2]);
                this.state.cMax = this.state.ccount
            }
            return null
        })
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.reports.map((report, key) =>
                                    <Col key={key} md={4}>
                                        <Card>
                                            <CardBody>
                                                <Media>
                                                    <Media body className="overflow-hidden">
                                                        <p className="text-truncate font-size-14 mb-2">{report.title}</p>
                                                        {/* <h4 className="mb-0">{report.value}</h4> */}
                                                        <Col lg="4">
                                                            <div className="text-center" dir="ltr">
                                                                <Knob
                                                                    value = {report.title === "BITCOIN" ? this.state.bcount : (report.title === "ETHEREUM" ? this.state.ecount : this.state.ccount)}
                                                                    max = {report.title === "BITCOIN" ? this.state.bMax : (report.title === "ETHEREUM" ? this.state.eMax : this.state.cMax)}
                                                                    fgColor= {report.color}
                                                                    lineCap="round"
                                                                    height={140}
                                                                    width={140}
                                                                    onChange={(e) => { this.setState({ angle: e }); }}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Media>
                                                    <div className="text-primary">
                                                        <i className={report.icon + " font-size-24"}></i>
                                                    </div>
                                                </Media>
                                            </CardBody>

                                            <CardBody className="border-top py-3">
                                                <div className="text-truncate">
                                                    <span className="badge badge-soft-success font-size-11 mr-1"><i className="mdi mdi-menu-up"> </i> <TimeCountdown time = {report.timeLeftFull}></TimeCountdown></span>
                                                    
                                                    <span className="text-muted ml-2">{report.desc}</span>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                    )
                }
            </React.Fragment>
        );
    }
    componentDidMount(){
        this.bInterval = setInterval(() =>{
            this.setState({bcount: this.state.bcount - 1,})
        if (this.state.bcount === 0){clearInterval(this.bInterval)}}, 1000)

        this.eInterval = setInterval(() =>{
            this.setState({ecount: this.state.ecount - 1,})
        if (this.state.ecount === 0){clearInterval(this.eInterval)}}, 1000)

        this.cInterval = setInterval(() =>{
            this.setState({ccount: this.state.ccount - 1})
        if (this.state.ccount === 0){clearInterval(this.cInterval)}}, 1000)
    }
}

export default MiniWidgets;