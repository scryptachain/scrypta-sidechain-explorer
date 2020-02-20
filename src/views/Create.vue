<template>
  <div class="home" style="margin-top:30px">
    <b-modal v-model="passwordShow" hide-footer title="Create new Sidechain">
      You're creating an asset with these features:<br>
      <b>Name</b>: {{ asset.name }}<br>
      <b>Symbol</b>: {{ asset.symbol }}<br>
      <b>Supply</b>: {{ asset.supply }} {{ asset.symbol }}<br>
      <b>Decimals</b>: {{ asset.decimals }}<br>
      <b>Reissuable</b>: {{ asset.reissuable }}<br>
      <b>Burnable</b>: {{ asset.burnable }}<br><br>
      <strong style="color:#f00">
        This operation will create this asset and will send the asset to your wallet: {{ user }}.<br>
        Please make sure all the informations are correct.
      </strong><br><br>
      <b-form-input v-if="!isUploading" v-model="unlockPwd" type="password" placeholder="Enter wallet password"></b-form-input><br>
      <div v-if="!isUploading" @click.prevent="unlockWallet" class="btn btn-primary">CREATE</div>
    </b-modal>
    <div class="col-sm-4 offset-sm-4" style="text-align:left">
      <h3 style="text-align:center;">
        Create new Sidechain<br>
        <span style="font-size:13px">
          using <i>{{ user }}</i>. <a href="#" v-on:click="logout">(Logout)</a>
        </span>
      </h3>    
      <hr>
      Asset name:
      <b-form-input v-model="asset.name" placeholder="Enter asset name"></b-form-input>
      Asset symbol:
      <b-form-input v-model="asset.symbol" placeholder="Enter asset symbol"></b-form-input>
      Asset supply:
      <b-form-input v-model="asset.supply" placeholder="Enter asset supply"></b-form-input>
      Asset decimals:
      <b-form-input v-model="asset.decimals" placeholder="Enter asset decimals"></b-form-input><br>
      <b-form-checkbox v-model="asset.reissuable" value="true" unchecked-value="false">
        This asset can be reissued
      </b-form-checkbox>
      <b-form-checkbox v-model="asset.burnable" value="true" unchecked-value="false">
        This asset can be burned
      </b-form-checkbox>
      <div style="text-align:center" v-if="!issueResponse">
        <div class="btn btn-primary" style="cursor:pointer" v-if="!isUploading"  v-on:click="openUnlock">CREATE ASSET</div>
        <span v-if="isUploading">Creating asset, please wait..</span>
      </div>
      <pre v-if="issueResponse" style="font-size:14px; background:#eee; border:1px solid #ccc; border-radius:5px; text-align: left; padding:20px;">{{ issueResponse }}</pre>
    </div>
    <div class="node-badge" v-if="idanode">{{ idanode }}</div>
  </div>
</template>

<style>
#app {
  text-align: center;
  font-family: "karmillaregular";
  font-size: 13px;
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
     async logout(){
      const app = this
      await app.scrypta.forgetKey()
      location.reload()
    },
    async checkUser(){
      const app = this
      let user = await app.scrypta.keyExist()
      app.public_address = this.scrypta.PubAddress;
      app.encrypted_wallet = this.scrypta.RAWsAPIKey;
      if(user.length === 34){
        app.user = user
      }else{
        window.location='/#/login'
      }
    },
    openUnlock(){
      const app = this
      if(app.asset.name !== '' && parseFloat(app.asset.supply) > 0 && app.asset.symbol !== "" && parseFloat(app.asset.decimals) >= 0){
        app.axios.get(app.idanode + '/balance/' + app.user).then(response => {
          if(response.data.balance > 1.001){
            app.axios.get(app.idanode + '/sidechain/list').then(sidechainsRes => {
              let valid = true
              let sidechains = sidechainsRes.data.data
              for(let x in sidechains){
                let sidechain = sidechains[x]
                if(sidechain.genesis.name.toLowerCase() === app.asset.name){
                  alert('This name exists yet, please choose another name!')
                  valid = false
                }
                if(sidechain.genesis.symbol.toLowerCase() === app.asset.symbol){
                  alert('This symbol exists yet, please choose another symbol!')
                  valid = false
                }
              }
              if(valid === true){
                app.passwordShow = true
              }
            })
          }else{
            alert('Not enough balance, you need at least 1.001 LYRA!')
          }
        })
      }else{
        alert('Fill all the fields!')
      }
    },
    unlockWallet(){
        if(this.unlockPwd !== ''){
          var app = this
          app.decrypted_wallet = 'WALLET LOCKED'
          app.scrypta.readKey(this.unlockPwd).then(async function (response) {
            if(response !== false){
              app.passwordShow = false
              app.isUploading = true
              let resIssue = await app.axios.post(app.idanode + "/sidechain/issue",{
                dapp_address: app.user,
                private_key: response.prv,
                pubkey: response.key,
                version: 1,
                name: app.asset.name,
                symbol: app.asset.symbol,
                supply: parseFloat(app.asset.supply),
                decimals: parseFloat(app.asset.decimals),
                reissuable: app.asset.reissuable,
                burnable: app.asset.burnable
              })
              app.issueResponse = resIssue.data
              if(app.issueResponse.issued === true || app.issueResponse.issued === 'true'){
                alert('Sidechain created correctly!')
              }
            }else{
              alert('Wrong password!')
            }
          })
        }else{
          alert('Write your password first')
        }
      },
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
      unlockPwd: "",
      user: "",
      asset: {
        name: "",
        symbol: "",
        supply: "",
        decimals: "",
        burnable: false,
        reissuable: false
      }
    };
  }
};
</script>

<style>
.node-badge {
  position: fixed;
  bottom: -3px;
  font-size: 10px;
  padding: 8px;
  right: 10px;
  z-index: 9999;
  border: 1px solid #ccc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>