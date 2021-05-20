import React, {Component} from 'react';
import { Card, CardBody, Button, Form, Input, Row, Col} from "reactstrap";
import Web3 from 'web3';
import DataValidate from '../../abis/DataValidate.json'
import logodark from "../../assets/images/logo-dark.png"
import {degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class Dropzone extends Component{
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  componentDidMount(){
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload()
    });
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = DataValidate.networks[networkId]
    if(networkData) {
      const abi = DataValidate.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      for (var i = 1; i <= totalSupply; i++) {
        const hash = await contract.methods.dataValidateHashes(i - 1).call()
        this.setState({
          hashes: [...this.state.hashes, hash]
        })
      }
      if (JSON.parse(localStorage.getItem('Transaction')) != null){
        this.setState({transaction: JSON.parse(localStorage.getItem('Transaction'))})
      }
    }
    else{
      window.alert("smart contract do not deploy to detect network")
    }
  }
  
  constructor(props){
    super(props);
    this.state = {
      account:'',
      buffer: null,
      contract: null,
      totalSupply: 0,
      hashes: [],
      transaction: [],
      fileName: '',
    };
  }

  async loadWeb3() {
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("Please use metamask!")
    }
  }

  check(){
    if (this.state.buffer === null){
      alert("input file first")
      return
    }
    if (this.state.fileName.split('.').pop() === "pdf"){
      ipfs.add(this.state.buffer, (error,result) => {
        const url = 'https:ipfs.infura.io/ipfs/' + result[0].hash
        for (let i = 0; i < this.state.hashes.length; i++){
          if(url === this.state.transaction[i].initialIpfs){
            if(this.state.account === this.state.transaction[i].address){
              alert("exist file in blockchain and the owner is you")
              return
            }
            alert("exist file in blockchain and the owner is " + this.state.transaction[i].address)
            return
          }
        }
        if(error){
          console.log(error)
          return
        }
        alert("file valid")
        return
      })
    }

    if (this.state.fileName.split('.').pop() === "png" || this.state.fileName.split('.').pop() === "jpg"){
      ipfs.add(this.state.buffer, (error,result) => {
        var ipfsResult = result[0].hash
        for (let i = 0; i < this.state.hashes.length; i++){
          if(ipfsResult === this.state.transaction[i].input){
            if(this.state.account === this.state.transaction[i].address){
              alert("exist file in blockchain and the owner is you")
              return
            }
            alert("exist file in blockchain and the owner is " + this.state.transaction[i].address)
            return
          }
        }
        if(error){
          console.log(error)
          return
        }
        alert("file valid")
        return
      })
    }
  }

  handleFileChange = (event) => {
    event.preventDefault()
    const file = event.target.files[0];

    if (!file){
      return
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result), fileName: file.name})
    }
    reader.onerror = () => {
      console.log('file error', reader.error)
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    if (this.state.buffer === null){
      alert("input file first")
      return
    }
    if (this.state.fileName.split('.').pop() === "pdf"){
      ipfs.add(this.state.buffer, async (error,result) => {
        const url = 'https:ipfs.infura.io/ipfs/' + result[0].hash
        for (let i = 0; i < this.state.hashes.length; i++){
          if(url === this.state.transaction[i].initialIpfs){
            if(this.state.account === this.state.transaction[i].address){
              alert("exist file in blockchain and the owner is you")
              return
            }
            alert("exist file in blockchain and the owner is " + this.state.transaction[i].address)
            return
          }
        }
        if(error){
          console.log(error)
          return
        }
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        const pngImageBytes = await fetch(logodark).then(res => res.arrayBuffer())
        const pngImage = await pdfDoc.embedPng(pngImageBytes)
        const pngDims = pngImage.scale(0.1)

        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = await pdfDoc.getPages()

        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()

        for (var i = 0; i < pages.length; i++){
          pages[i].drawText('Validated by VBC Data Validate', {
            x: width/4,
            y: height - (height/4),
            size: 30,
            font: helveticaFont,
            color: rgb(0.753, 0.753, 0.753),
            rotate: degrees(-45),
          })

          pages[i].drawImage(pngImage, {
            x: 20,
            y: 20,
            width: pngDims.width,
            height: pngDims.height,
          })

        }
        const pdfBytes = await pdfDoc.save()
        const editedBuffer = Buffer(pdfBytes)
        ipfs.add(editedBuffer, (error,result) => {
          var ipfsResult = result[0].hash
          if(error){
            console.log(error)
            return
          }
          this.state.contract.methods.mint(ipfsResult).send({ from: this.state.account}).once('receipt', (receipt) => {
            var result = {address: this.state.account, transactionHash: receipt.transactionHash, input: ipfsResult, blockNumber: receipt.blockNumber, fileName: this.state.fileName, initialIpfs: url}
            this.setState({
              hashes: [ipfsResult,...this.state.hashes],
              transaction:[result, ...this.state.transaction]
            })
            localStorage.setItem('Transaction', JSON.stringify(this.state.transaction))
          })
        })
      })  
    }
    if (this.state.fileName.split('.').pop() === "png" || this.state.fileName.split('.').pop() === "jpg"){
      ipfs.add(this.state.buffer, (error,result) => {
        var ipfsResult = result[0].hash
        for (let i = 0; i < this.state.hashes.length; i++){
          if(ipfsResult === this.state.transaction[i].input){
            if(this.state.account === this.state.transaction[i].address){
              alert("exist file in blockchain and the owner is you")
              return
            }
            alert("exist file in blockchain and the owner is " + this.state.transaction[i].address)
            return
          }
        }
        if(error){
          console.log(error)
          return
        }
        this.state.contract.methods.mint(ipfsResult).send({ from: this.state.account}).once('receipt', (receipt) => {
          var result = {address: this.state.account, transactionHash: receipt.transactionHash, input: ipfsResult, blockNumber: receipt.blockNumber, fileName: this.state.fileName}
          this.setState({
            hashes: [ipfsResult,...this.state.hashes],
            transaction:[result, ...this.state.transaction]
          })
          localStorage.setItem('Transaction', JSON.stringify(this.state.transaction))
        })
      })
    }
    if(this.state.fileName.split('.').pop() !== "png" && this.state.fileName.split('.').pop() !== "jpg" && this.state.fileName.split('.').pop() !== "pdf"){
      alert("Please choose pdf, png, jpg file")
    }
  }

  render(){
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <div>
              <Form onSubmit = {this.onSubmit}>
                <Input type = "file" onChange = {this.handleFileChange}/>
                <br/>
                <Button color="primary" className="mt-2 mr-2 waves-effect waves-light" onClick = {() => this.check()}>Check</Button>
                <Button color="primary" className="mt-2 mr-2 waves-effect waves-light">Submit</Button>
              </Form>
            </div>
          </CardBody>
        </Card>

        {/* <Card>
          <CardBody>
            <h3>Your Data Validated</h3> */}
            {/* <div> */}
              <Row>
                {this.state.transaction.map((transaction, key) => {
                  if (transaction.address === this.state.account){
                    if (transaction.fileName.split('.').pop() === "pdf"){
                      return(
                        <Col key={key} className='col-sm-4'>
                          <Card >
                            <CardBody>
                              <Row>
                                <a target="_blank" rel="noopener noreferrer">
                                    <img align="center" width = "100%" src={logodark}/>
                                </a>
                              </Row>
                              <hr width="100%" size= "5px" align="center"/>
                              <Row align="center">
                                <a target="_blank" rel="noopener noreferrer" href={'https:ipfs.infura.io/ipfs/' + transaction.input}>{transaction.fileName.slice(0,20)}</a>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      )
                    }
                    if (transaction.fileName.split('.').pop() === "png" || transaction.fileName.split('.').pop() === "jpg"){
                      return(
                        <Col key={key} className='col-sm-4'>
                          <Card>
                            <CardBody>
                              <Row>
                                <a target="_blank" rel="noopener noreferrer">
                                    <img width= "100%" align="center" src={'https:ipfs.infura.io/ipfs/' + transaction.input}/>
                                </a>
                              </Row>
                              <hr width="100%" size= "5px" align="center"/>
                              <Row align="center">
                                <a target="_blank" rel="noopener noreferrer" href={'https:ipfs.infura.io/ipfs/' + transaction.input}>{transaction.fileName.slice(0,20)}</a>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      )
                    }
                  }
                })}
              </Row>

               {/* <ListGroup>
                 {this.state.transaction.map((transaction, key) => {
                   if (transaction.address === this.state.account){
                     if (transaction.fileName.split('.').pop() === "pdf"){
                       return(
                         <ListGroupItem key = {key}>
                           <Row>
                             {transaction.transactionHash}
                           </Row>
                           <Row>
                             <Col>
                               <a target="_blank" rel="noopener noreferrer" href={'https:testnet.bscscan.com/tx/' + transaction.transactionHash}>View Transaction</a>
                             </Col>
                             <Col>
                               <a target="_blank" rel="noopener noreferrer" href={'https:ipfs.infura.io/ipfs/' + transaction.input}>View File</a>
                             </Col>
                           </Row>
                           <Row>
                             <Col>
                               <a target="_blank" rel="noopener noreferrer">
                                 <img width = "200" height= "100"src={logodark}/>
                               </a>
                               <p>{transaction.fileName.slice(0,8) + '...'}</p>
                             </Col>
                           </Row>
                         </ListGroupItem>
                       )
                     }
                     else{
                       return(
                         <ListGroupItem key = {key}>
                           <Row>
                             {transaction.transactionHash}
                           </Row>
                           <Row>
                             <Col>
                               <a target="_blank" rel="noopener noreferrer" href={'https:testnet.bscscan.com/tx/' + transaction.transactionHash}>View Transaction</a>
                             </Col>
                             <Col>
                               <a target="_blank" rel="noopener noreferrer" href={'https:ipfs.infura.io/ipfs/' + transaction.input}>View File</a>
                             </Col>
                           </Row>
                           <Row>
                             <a target="_blank" rel="noopener noreferrer">
                               <img alt="" width = "50%" height= "50%"src={'https:ipfs.infura.io/ipfs/' + transaction.input}/>
                             </a>
                           </Row>
                         </ListGroupItem>
                       )
                     }
                   }
                 })}
               </ListGroup> */}
            {/* </div> */}
          {/* </CardBody>
        </Card> */}
      </React.Fragment>
    )
  }
}

export default Dropzone
