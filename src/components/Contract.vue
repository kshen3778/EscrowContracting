<template>
  <div class="hello">
    <h2>Contract {{ $route.params.id }} </h2>

    <h2>Client: {{client}} </h2>
    <h2>Provider: {{provider}} </h2>

    <h2> Your role: {{role}} </h2>

    <!--<div v-if="role === ''">
      <b-form-input v-model="currentAccount" type="text" placeholder="Enter Your Address"></b-form-input>
      <b-form-input v-model="passCode" type="text" placeholder="Enter Your Passcode"></b-form-input>
      <b-button v-on:click="authenticate()" variant="primary">Authenticate</b-button>
    </div>-->

    <div v-if="role === 'Client' && contractInstance.currentState() == 0">
      <b-button v-on:click="confirmPayment()">
              Send Payment
      </b-button>
    </div>

    <div v-if="role === 'Client' && contractInstance.currentState() == 1">
      <b-button v-on:click="confirmDelivery()">
              Confirm Work Complete
      </b-button>
    </div>

    <div v-if="role === 'Provider' && contractInstance.currentState() == 1">
      <b-button v-on:click="refundBuyer()">
              Refund Client
      </b-button>
    </div>

    <div v-if="role !== ''">
      <b-button v-on:click="setArbiter()">
              Assign Arbiter
      </b-button>
    </div>

  </div>
</template>

<script>
import web3 from 'Web3'
import firebase from 'firebase'
export default {
  name: 'Contract',
  data () {
    return {
      contractAddress: this.$route.params.id,
      web3: {},
      contractInstance: {},
      provider: "",
      client: "",
      currentAccount: "",
      role: "",
      passCode: "",
      state: 0
    }
  },

  created() {
    console.log("hi");

    this.load();


  },

  methods: {

    setArbiter(){
      var contractAddress = this.contractAddress;

      var ref = firebase.database().ref('arbiters/');
      ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        var keys = Object.keys(snapshot.val());

        //filter out taken arbiters
        var filteredKeys = [];
        for(var i=0; i<keys.length; i++){
          var ref2 = firebase.database().ref('arbiters/' + keys[i]);
          ref2.on("value", function(snapshot){
            if(snapshot.val()["contractaddress"] == ""){
              filteredKeys.push(keys[i]);
            }
          });
        }

        var num = Math.floor(Math.random() * (filteredKeys.length - 0));
        var ref2 = firebase.database().ref('arbiters/' + filteredKeys[num]);
        ref2.on("value", function(snapshot){
            console.log("Your arbiter is: " + snapshot.val()["address"]);
            ref2.update({
              "contractaddress": contractAddress
            });
            //call smart contract function
        });

        console.log("Done");

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    },

    confirmPayment(){
      console.log(this.contractInstance.buyer());
      this.web3.eth.defaultAccount = this.client;
      this.contractInstance.confirmPayment.sendTransaction({from: this.client, value: this.web3.toWei(1, "ether")}, function(err, result){
        console.log(err);
        console.log(result);
      });

    },

    confirmDelivery(){
      console.log(this.contractInstance.buyer());
      this.web3.eth.defaultAccount = this.client;
      this.contractInstance.confirmDelivery(function(err, result){
        console.log(err);
        console.log(result);
      });
    },

    refundBuyer(){
      console.log(this.contractInstance.seller());
      this.web3.eth.defaultAccount = this.provider;
      this.contractInstance.refundBuyer(function(err, result){
        console.log(err);
        console.log(result);
      });
    },

    getAccountFromArray(address){
      for(var i=0; i<this.web3.eth.accounts.length; i++){
        if(address.toUpperCase() == this.web3.eth.accounts[i].toUpperCase()){
          return i;
        }
      }

      return "Not Found";
    },

    /*authenticate(){
      var userRef = firebase.database().ref('users/' + this.currentAccount);
      var passCode = this.passCode;
      var contractAddress = this.contractAddress;
      var currentAccount = this.currentAccount;
      var obj = this;
      userRef.on('value', function(snapshot) {
        if(passCode == snapshot.val().passCode && contractAddress == snapshot.val().contractaddress){
          console.log("Authenticated");
          obj.determineRole();
        }
      },function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        this.currentAccount = "";
      });
    },*/

    load(){
      /*
      var ethereumUri = 'http://127.0.0.1:7545';   // 8540, 8545, 8180
      let web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri));
      this.web3 = web3;
      if (!web3.isConnected()) {
          return 'Unable to connect to ethereum node at ' + ethereumUri
      }else{
        var escrowContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_arbiter","type":"address"}],"name":"setArbiter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmDelivery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPayment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"refundBuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"arbiter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_buyer","type":"address"},{"name":"_seller","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
        var instance = escrowContract.at(this.contractAddress);

        this.contractInstance = instance;

        this.provider = instance.seller();
        this.client = instance.buyer();

      }*/

      var web3js = window.web3;
      if (typeof web3js !== 'undefined') {
        var web3 = new Web3(web3js.currentProvider)
        console.log(web3.eth.accounts[0]);
        var escrowContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_arbiter","type":"address"}],"name":"setArbiter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmDelivery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPayment","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"refundBuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"arbiter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_buyer","type":"address"},{"name":"_seller","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);

        var instance = escrowContract.at(this.contractAddress);
        this.contractInstance = instance;

        this.provider = instance.seller();
        this.client = instance.buyer();

        this.currentAccount = web3.eth.accounts[0];
        this.determineRole();
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        reject(new Error('Unable to connect to Metamask'))
      }
    },

    determineRole(){
      if(this.provider.toUpperCase() == this.currentAccount.toUpperCase()){
        console.log("Provider");
        this.role = "Provider";
      }else if(this.client.toUpperCase() == this.currentAccount.toUpperCase()){
        console.log("Client");
        this.role = "Client";
      }
    }

  }
}
</script>
