import useWeb3 from "./useWeb3";
import { Button } from "reactstrap";
import React from 'react';
import DataValidate from '../../abis/DataValidate.json'

function SignTx() {
  const web3 = useWeb3();

  const handleSignMessage = async () =>{
    if (localStorage.getItem("address") === 'null'){
      console.log("?????")
      alert("please connect to metamask")
      return
    }

    let fileContentHash = localStorage.getItem('fileContent')
    const localStorageContent = localStorage.getItem('hashData');
    
    let files;
    if (localStorageContent === null){
      files = []
    }
    else {
      files = JSON.parse(localStorageContent)
    }
    for (let i = 0; i < files.length; i++){
      if (files[i].fileContent === fileContentHash){
        alert("file existed at " + new Date(files[i].dateValid).toLocaleString())
        return
      }
    }

    const accounts = await web3.eth.getAccounts()
    // var account = accounts[0]
    console.log(accounts)
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = DataValidate.networks[networkId]
    if (networkData){
      console.log("??????")
      const abi = DataValidate.abi
      console.log(abi)
      const address = networkData.address
      console.log(address)
      const contract = new web3.eth.Contract(abi, address)
      // const pictureHash = await contract.methods.get().call()
      console.log(contract)
    }

    try {
      


      // const signature = await web3.eth.personal.sign(
      //   'Confirm this hash \n' + fileContentHash,
			// 	localStorage.getItem("address"),
			// 	''
      // );
      // files.push({fileContent: fileContentHash,dateValid: new Date().getTime(),signature: signature})
      // localStorage.setItem('hashData',JSON.stringify(files))
      alert("submit succeed")
    }
    catch (error){
      console.log(error)
    }
  }

  return (
  <Button color="primary" type="button" className="mt-2 mr-2 waves-effect waves-light" onClick = {() => handleSignMessage()}>Submit and signed</Button>
  );
}

export default SignTx;
