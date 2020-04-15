<template>
  <div class="page-body">
    <div class="row" style="min-height: 100vh; background-image: url('bg-sidechain.jpg');">
      <div class="col-sm-6 offset-sm-3 my-auto mx-auto">
        <div class="boxed-home">
          <img src="/img/planum-logo.png" width="65%" class="image-logo" />
          <h5 style="color: white; text-align: center; margin-top: 50px;">
            <br />An open-source and permissionless sidechains system that provide to anyone a clear interface where create, issue and track tokenized assets.
            <br />
            <br />Tokenization process is basically the translation of real world assets into blockchains converting them into digital assets and providing a trustable ownership.
            <br />
            <br />With Planum you can digitalize and convert anything into a supply of digital assets through the process of "tokenization". That way the physical good, once tokenized, become "fungible", can be transferred, fractioned, stored or traded electronically between different people in a digital way.
          </h5>
          <a href="/#/login" v-if="!user"> 
            <b-button size="sm" class="btn-danger my-2 my-sm-0" style="width: 30%; margin: 0 5px">LOGIN</b-button>
          </a>
          <a href="/#/create" v-if="user"> 
            <b-button size="sm" class="btn-danger my-2 my-sm-0" style="width: 30%; margin: 0 5px">CREATE SIDECHAIN</b-button>
          </a>
          <a href="/#/explorer">
            <b-button size="sm" class="btn-success my-2 my-sm-0" style="width: 30%; margin: 0 5px">SHOW EXPLORER</b-button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  text-align: center;
  font-family: "karmillaregular";
  font-size: 13px;
}
.page-body {
  margin: 0px;
  min-height: 100vh;
  padding: 0px;
  overflow-x: hidden;
}
.boxed-home {
  border-radius: 15px;
  border: 2px solid #d7293b;
  outline: 2px white;
  margin: auto;
  padding: 60px;
  background-color: #002537;
  opacity: 0.85;
}
.boxed-wiki {   
  border-radius: 15px;
  border: 2px solid #d7293b;
  outline: 2px white;
  background-color: #002537;
  opacity: 0.85;
}
</style>
<script>
export default {
  name: "home",
  mounted: async function() {
    const app = this;
    app.idanode = await app.scrypta.connectNode();
    app.checkUser();
  },
  methods: {
    async logout() {
      const app = this;
      await app.scrypta.forgetKey();
      location.reload();
    },
    async checkUser() {
      const app = this;
      let user = await app.scrypta.keyExist();
      app.public_address = this.scrypta.PubAddress;
      app.encrypted_wallet = this.scrypta.RAWsAPIKey;
      if (user.length === 34) {
        app.user = user;
      }
    }
  },
  data() {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      issueResponse: "",
      passwordShow: false,
      public_address: "",
      isUploading: false,
      encrypted_wallet: "",
      idanode: "",
      user: ""
    };
  }
}
</script>