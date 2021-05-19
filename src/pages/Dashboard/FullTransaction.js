import React, { Component } from 'react';
import { Card, CardBody, ListGroup, ListGroupItem} from "reactstrap";

import "./dashboard.scss";

class FullTransaction extends Component {
    async componentWillMount(){
        await this.loadLoadTransaction()
    }
    
    async loadLoadTransaction(){
        if (JSON.parse(localStorage.getItem('Transaction')) != null){
            this.setState({transaction: JSON.parse(localStorage.getItem('Transaction'))})
        }
    }

    constructor(props){
        super(props);
        this.state = {
          transaction: []
        };
    }
    
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h3>Latest Data Validated</h3>
                        <div className="float-right">
                            <ListGroup>
                                {this.state.transaction.map((transaction, key) => {
                                    return(
                                        <ListGroupItem key = {key}>
                                            <a target="_blank" rel="noopener noreferrer" href={'https://testnet.bscscan.com/tx/' + transaction.transactionHash}>{transaction.transactionHash.slice(0,30) + '...'}</a>  
                                        </ListGroupItem>
                                    )
                                })}
                            </ListGroup>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default FullTransaction;