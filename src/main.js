// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

var config = {
    apiKey: "AIzaSyCER5B_ju56FaIjuFWixXrP-G1OrzVAFw4",
    authDomain: "escrow-55396.firebaseapp.com",
    databaseURL: "https://escrow-55396.firebaseio.com",
    projectId: "escrow-55396",
    storageBucket: "escrow-55396.appspot.com",
    messagingSenderId: "662400880240"
};
firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
