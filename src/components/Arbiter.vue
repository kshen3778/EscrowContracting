<template>
  <div class="hello" v-if="!$route.params.id">
    <h2>Arbiter</h2>
      <b-form-input v-model="arbiter_address" type="text" placeholder="Enter Your Address"></b-form-input>
      <b-button v-on:click="submit()" variant="primary">Create</b-button>

  </div>

  <div v-else-if="$route.params.id">
    Arbiter Addresss: {{$route.params.id}}
  </div>
</template>

<script>
import web3 from 'Web3'
import firebase from 'firebase'
export default {
  name: 'Arbiter',
  data () {
    return {
      arbiter_address: ""
    }
  },

  created(){
    this.arbiter_address = this.$route.params.id;
  },

  methods: {
    submit() {
      firebase.database().ref('arbiters/' + this.arbiter_address).set({
         address: this.arbiter_address,
         role: "arbiter",
         contractaddress : "",
         passCode: Math.random().toString(36).replace('0.', '')
      });
    }
  }
}
</script>
