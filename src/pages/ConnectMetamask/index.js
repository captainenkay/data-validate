import React from "react";
import "./index.css";
import Connect from "./Connect";
import { StoreProvider } from "./store";
import { Component } from "react";

class ConnectMetamask extends Component{
  render(){
    return (
      <React.StrictMode>
        <StoreProvider>
          <Connect />
        </StoreProvider>
      </React.StrictMode>
    )
  }
}

export default ConnectMetamask

