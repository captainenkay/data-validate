import React, { Component } from 'react';
import { Card, CardBody } from "reactstrap";

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

class LastestTransactions extends Component {
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
        transaction: [],
        data: {
          columns: [
            {
              dataField: 'blockNumber',
              text: 'Block'
            },
            {
              dataField: "transactionHash",
              text: "Transaction Hash"
            },
            {
              dataField: "from",
              text: "From"
            },
            {
              dataField: "timestamp",
              text: "TimeStamp"
            },
            {
              dataField: "status",
              text: "Status"
            },
          ],
          rows: []
        }
      };
  }
    
    render() {
        
            //   {
            //     blockNumber: <a target="_blank" rel="noopener noreferrer" href={'https://testnet.bscscan.com/block/' + this.state.transaction[0].blockNumber}>{this.state.transaction[0].blockNumber}</a> ,
            //     transactionHash: <a target="_blank" rel="noopener noreferrer" href={'https://testnet.bscscan.com/tx/' + this.state.transaction[0].transactionHash}>{this.state.transaction[0].transactionHash.slice(0,30) + '...'}</a>,
            //     from: <a target="_blank" rel="noopener noreferrer" href={'https://testnet.bscscan.com/address/' + this.state.transaction[0].address}>{this.state.transaction[0].address.slice(0,30).toLowerCase() + '...'}</a>,
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 2,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">text.txt</Link> ,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-warning font-size-12">waiting</div>,
            //   },
            //   {
            //     blockNumber: 3,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">midterm.txt</Link>,
            //     from: "03 Apr, 2020 1:10",
            //     timestamp: "01 Apr, 2020 11:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 4,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">finalMMT.2022</Link>,
            //     from: "01 Apr, 2020 12:05",
            //     timestamp: "01 Apr, 2020 1:2",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 5,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "03 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-danger font-size-12">failed</div>,
            //   },
            //   {
            //     blockNumber: 6,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-warning font-size-12">waiting</div>,
            //   },
            //   {
            //     blockNumber: 7,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 8,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 9,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            //   {
            //     blockNumber: 10,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-warning font-size-12">waiting</div>,
            //   },
            //   {
            //     blockNumber: 11,
            //     transactionHash: <Link to="#" className="text-dark font-weight-bold">test.txt</Link>,
            //     from: "04 Apr, 2020 12:10",
            //     timestamp: "04 Apr, 2020 1:20",
            //     status : <div className="badge badge-soft-success font-size-12">succeeded</div>,
            //   },
            // ]
      // };

      const options = {
        hideSizePerPage: false,
        hidePageListOnlyOnePage: false,
        sizePerPageList :
          [ {
            text: '5th', value: 5
          }, {
            text: '10th', value: 10
          }, {
            text: 'All', value: this.state.data.rows.length
          } ]
        
      };

        return (
            <React.Fragment>
              <Card>
                  <CardBody>
                      <h3>Your Data Validated</h3>
                      <BootstrapTable
                        keyField='id'
                        data={ this.state.data.rows }
                        columns={ this.state.data.columns }
                        pagination={ paginationFactory(options) }
                      />
                  </CardBody>
              </Card>
            </React.Fragment>
        );
    }
}

export default LastestTransactions;