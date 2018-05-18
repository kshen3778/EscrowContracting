<template>
  <div class="hello">
    <h2>Contract {{ $route.params.id }} </h2>

    <h2>Client: {{client}} </h2>
    <h2>Provider: {{provider}} </h2>

    <h2> You are the {{role}}. </h2>
    <div v-if="role === null">
      <b-form-input v-model="currentAccount" type="text" placeholder="Enter Your Address"></b-form-input>
      <b-form-input v-model="passCode" type="text" placeholder="Enter Your Passcode"></b-form-input>
      <b-button v-on:click="authenticate()" variant="primary">Authenticate</b-button>
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
      role: null,
      passCode: ""
    }
  },

  created() {
    console.log("hi");

    this.load();
    /*var ethereumUri = 'http://127.0.0.1:7545';   // 8540, 8545, 8180
    var web3 = window.web3;
    if(typeof web3 !== 'undefined') {
        console.log("1");
        console.log(web3.currentProvider);
        web3 = new Web3(web3.currentProvider);
        console.log(web3);
        //console.log(web3.eth.accounts[0]);
    } else {
        console.log("2");
    }*/

  },

  methods: {

    authenticate(){
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
    },

    load(){
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

      }
    },

    determineRole(){
      console.log("Determining Role for " + this.currentAccount);
      console.log(this.provider);
      console.log(this.client);
      if(this.provider.toUpperCase() == this.currentAccount.toUpperCase()){
        console.log("Provider");
        this.role = "Service Provider";
      }else if(this.client.toUpperCase() == this.currentAccount.toUpperCase()){
        console.log("Client");
        this.role = "Client";
      }
    }

  }
}
</script>
