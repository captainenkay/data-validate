import { useStoreApi } from "./storeAPI";
import useWeb3 from "./useWeb3";
import { Button } from "@material-ui/core";
import React from 'react';

import "./Connect.css";

function Connect() {
  const { address, setAddress, setBalance } = useStoreApi();
  const web3 = useWeb3();

  var fixedLengthAddress = address;
  localStorage.setItem("address",address)

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(accounts => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  function changeState(){
    if (address == null){
      return 'Connect'
    }
    return fixedLengthAddress.slice(0,8) + '...'
  }

  return (
    <div className="Connect">
      <header className="Connect-header">
        <Button
          onClick={() => getUserAccount()}
          variant="outlined"
          color="primary"
        >
          {changeState()}
        </Button>
      </header>
    </div>
  );
}

export default Connect;
