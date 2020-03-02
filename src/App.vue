<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="light">
      <b-navbar-brand href="/#/" style="margin-top:3px">
        <img src="./assets/planum.png" height="22" style="float:left; margin-right:10px;" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              v-model="address"
              class="mr-sm-2"
              placeholder="Search address or sxid"
            ></b-form-input>
            <b-button size="sm" v-on:click="searchAssets" class="my-2 my-sm-0">Search</b-button>
          </b-nav-form>
          <a href="/#/create"> 
            <b-button size="sm" class="btn-success my-2 my-sm-0" style="margin-left:10px">CREATE</b-button>
          </a>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
    <hr />
    <div style="font-size:11px; text-align:center; padding:4px 0 8px 0">
      This is an
      <a
        href="https://github.com/scryptachain/scrypta-sidechain-explorer"
        _target="blank"
      >Open Source Project</a> by <a href="https://scrypta.foundation" target="_blank">Scrypta Foundation</a>
    </div>
  </div>
</template>
<style>
.node-badge{
  background-color: white;
}
</style>
<script>
export default {
  name: "home",
  data() {
    return {
      address: '',
      axios: window.axios,
      scrypta: window.ScryptaCore,
      idanode: ""
    }
  },
  mounted: async function() {
    const app = this;
    app.idanode = await app.scrypta.connectNode();
  },
  methods: {
    async searchAssets() {
      const app = this
      if(this.address.length === 34){
        window.location = '/#/scan/' + this.address
      }
      if(this.address.length === 64){
        app.axios.get(app.idanode + "/sidechain/list").then(async response => {
        for (let x in response.data.data) {
          let sidechain = response.data.data[x];
          let check = await app.axios
            .post(app.idanode + "/sidechain/transaction", {
              sidechain_address: sidechain.address,
              sxid: app.address
            })
          if(check.data.transaction !== undefined){
            window.location = '/#/sxid/' + check.data.transaction.data.transaction.sidechain + '/' + app.address
          }
        }
      });
      }
    }
  }
}
</script>