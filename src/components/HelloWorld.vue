<template>
  <div class="hello">
    <h2>Escrow Contract</h2>
      <b-form-input v-model="provider_address" type="text" placeholder="Enter Provider Address"></b-form-input>
      <b-form-input v-model="client_address" type="text" placeholder="Enter Client Address"></b-form-input>
      <b-button v-on:click="submit()" variant="primary">Submit</b-button>

      <h2> Current Address: {{currentAddress}} </h2>
  </div>
</template>

<script>
import web3 from 'Web3'
import firebase from 'firebase'
export default {
  name: 'HelloWorld',
  data () {
    return {
      provider_address: "",
      client_address: "",
      currentAddress: "",
      web3obj: null
    }
  },

  created() {

    var web3js = window.web3;
    if (typeof web3js !== 'undefined') {
      var web3 = new Web3(web3js.currentProvider);
      console.log(web3);
      console.log(web3.eth.accounts[0]);
      this.currentAddress = web3.eth.accounts[0];
      console.log("Current Address before interval: " + this.currentAddress);
      var currentAddress = this.currentAddress;
      var obj = this;
      var checkAddress = setInterval (function() {
          console.log(web3.eth.accounts[0]);

          console.log("Current Address: " + currentAddress);
          if (web3.eth.accounts[0] !== currentAddress) {
              // Account has changed

              currentAddress = web3.eth.accounts[0];
              obj.updateCurrentAddress(currentAddress);
              console.log("Change detected");
              // Do something, eg reload
          }
      }, 100);

      //this.watchAddress();
    } else {
      // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
      reject(new Error('Unable to connect to Metamask'))
    }
  },


  methods: {

    updateCurrentAddress (address){
      this.currentAddress = address;
    },

    watchAddress () {
      var obj = this;
      var web3 = this.web3obj;
      var currentAddress = this.currentAddress;
      var checkAddress = setInterval (function() {
          console.log(web3.eth.accounts[0]);
          console.log("Current Address: " + currentAddress);
          if (web3.eth.accounts[0] !== currentAddress) {
              // Account has changed
              obj.currentAddress = web3.eth.accounts[0];
              console.log("Change detected");
              // Do something, eg reload
          }
      }, 100);
    },
    submit () {

      var web3;
      if (typeof window.web3 !== 'undefined') {
        const defaultAccount = window.web3.eth.defaultAccount;
        web3 = new Web3(window.web3.currentProvider);
        console.log(web3.eth.accounts);

        var _buyer = this.client_address;
        var _seller = this.provider_address;
        var escrowContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_arbiter","type":"address"}],"name":"setArbiter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmDelivery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPayment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"refundBuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"arbiter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_buyer","type":"address"},{"name":"_seller","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);

        var escrow = escrowContract.new(
           _buyer,
           _seller,
           {
             from: web3.eth.accounts[0], //change to either buyer or seller
             data: '0x608060405234801561001057600080fd5b50604051604080610818833981018060405281019080805190602001909291908051906020019092919050505081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050610748806100d06000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308551a53146100935780630c3f6acf146100ea5780631c9c088a146101235780635e10177b1461016657806362ef1f811461017d5780637150d8ae14610187578063e8a61cc8146101de578063fe25e00a146101f5575b600080fd5b34801561009f57600080fd5b506100a861024c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100f657600080fd5b506100ff610272565b6040518082600381111561010f57fe5b60ff16815260200191505060405180910390f35b34801561012f57600080fd5b50610164600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610284565b005b34801561017257600080fd5b5061017b6102c8565b005b610185610445565b005b34801561019357600080fd5b5061019c610553565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101ea57600080fd5b506101f3610579565b005b34801561020157600080fd5b5061020a6106f6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900460ff1681565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806103715750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561037c57600080fd5b600180600381111561038a57fe5b6000809054906101000a900460ff1660038111156103a457fe5b1415156103b057600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050505060026000806101000a81548160ff0219169083600381111561043d57fe5b021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806104ee5750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156104f957600080fd5b600080600381111561050757fe5b6000809054906101000a900460ff16600381111561052157fe5b14151561052d57600080fd5b60016000806101000a81548160ff0219169083600381111561054b57fe5b021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806106225750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561062d57600080fd5b600180600381111561063b57fe5b6000809054906101000a900460ff16600381111561065557fe5b14151561066157600080fd5b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050505060036000806101000a81548160ff021916908360038111156106ee57fe5b021790555050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815600a165627a7a723058206163bd8be98c4a9ed1cf400e6b7b46f030cc674b061ffa4131fa6052dcfa7db30029',
             gas: '4700000'
           }, function (e, contract){
              console.log(e, contract);
              if (typeof contract.address !== 'undefined') {
                   console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                   firebase.database().ref('users/' + _buyer).set({
                      address: _buyer,
                      role: "buyer",
                      contractaddress : contract.address,
                      passCode: Math.random().toString(36).replace('0.', '')

                   });
                   firebase.database().ref('users/' + _seller).set({
                      address: _seller,
                      role: "seller",
                      contractaddress : contract.address,
                      passCode: Math.random().toString(36).replace('0.', '')
                   });
              }
            }
          );


      } else {
        // set the provider you want from Web3.providers
        console.log("Connected to different provider");
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      }
      /*
      var ethereumUri = 'http://127.0.0.1:7545';   // 8540, 8545, 8180
      let web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri));

      if (!web3.isConnected()) {
          return 'Unable to connect to ethereum node at ' + ethereumUri
      }else{
        var _buyer = this.client_address;
        var _seller = this.provider_address;
        var escrowContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_arbiter","type":"address"}],"name":"setArbiter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmDelivery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPayment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"refundBuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"arbiter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_buyer","type":"address"},{"name":"_seller","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);

        var escrow = escrowContract.new(
           _buyer,
           _seller,
           {
             from: web3.eth.accounts[0], //change to either buyer or seller
             data: '0x608060405234801561001057600080fd5b50604051604080610818833981018060405281019080805190602001909291908051906020019092919050505081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050610748806100d06000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308551a53146100935780630c3f6acf146100ea5780631c9c088a146101235780635e10177b1461016657806362ef1f811461017d5780637150d8ae14610187578063e8a61cc8146101de578063fe25e00a146101f5575b600080fd5b34801561009f57600080fd5b506100a861024c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100f657600080fd5b506100ff610272565b6040518082600381111561010f57fe5b60ff16815260200191505060405180910390f35b34801561012f57600080fd5b50610164600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610284565b005b34801561017257600080fd5b5061017b6102c8565b005b610185610445565b005b34801561019357600080fd5b5061019c610553565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101ea57600080fd5b506101f3610579565b005b34801561020157600080fd5b5061020a6106f6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900460ff1681565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806103715750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561037c57600080fd5b600180600381111561038a57fe5b6000809054906101000a900460ff1660038111156103a457fe5b1415156103b057600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050505060026000806101000a81548160ff0219169083600381111561043d57fe5b021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806104ee5750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156104f957600080fd5b600080600381111561050757fe5b6000809054906101000a900460ff16600381111561052157fe5b14151561052d57600080fd5b60016000806101000a81548160ff0219169083600381111561054b57fe5b021790555050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806106225750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561062d57600080fd5b600180600381111561063b57fe5b6000809054906101000a900460ff16600381111561065557fe5b14151561066157600080fd5b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050505060036000806101000a81548160ff021916908360038111156106ee57fe5b021790555050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815600a165627a7a723058206163bd8be98c4a9ed1cf400e6b7b46f030cc674b061ffa4131fa6052dcfa7db30029',
             gas: '4700000'
           }, function (e, contract){
              console.log(e, contract);
              if (typeof contract.address !== 'undefined') {
                   console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                   firebase.database().ref('users/' + _buyer).set({
                      address: _buyer,
                      role: "buyer",
                      contractaddress : contract.address,
                      passCode: Math.random().toString(36).replace('0.', '')

                   });
                   firebase.database().ref('users/' + _seller).set({
                      address: _seller,
                      role: "seller",
                      contractaddress : contract.address,
                      passCode: Math.random().toString(36).replace('0.', '')
                   });
              }
            }
          );

        }

    }*/
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
