import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import Breadcrumbs from '../../components/Common/Breadcrumb';

import FullTransaction from "./FullTransaction";
import LastestTransactions from "./LastestTransactions";
import Dropzone from "./Dropzone";

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "Data Validation", link : "#" },
                { title : "Overview", link : "#" },
            ],
            reports : [
                { icon : "ri-stack-line", title : "BITCOIN", timeLeft : "01:00:00",timeLeftFull:'May 1, 2021 00:00:00', desc : "Time Pending", color: "#ffbb44" },
                { icon : "ri-stack-line", title : "ETHEREUM",timeLeft : "00:01:15",timeLeftFull:'May 30, 2021 00:00:00', desc : "Time Pending", color: "#4ac18e" },
                { icon : "ri-stack-line", title : "CIVIC",timeLeft : "00:00:50",timeLeftFull:'Apr 10, 2021 00:00:00', desc : "Time Pending", color: "#ea553d" },
            ]
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Data Validtion" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xl={8}>
                                <Dropzone/>
                            </Col>

                            <Col xl={4}>
                                <FullTransaction/>
                            </Col>
                        </Row>
                        <LastestTransactions/>
                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default Overview;
