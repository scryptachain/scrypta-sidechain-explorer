<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <v-gravatar :email="$route.params.sidechain" />
              </figure>
            </div>
              <div class="media-content">
                <p class="title is-4" style="margin:0 0 0 0">Manage {{ sidechain.sidechain[0].data.genesis.name }} - {{ sidechain.sidechain[0].data.genesis.symbol }}</p>
                <p class="title is-6" style="margin:15px 0 0 0">{{ $route.params.sidechain }}</p>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Details</h3>
                <b>Name</b>
                : {{ asset.name }}
                <br />
                <b>Symbol</b>
                : {{ asset.symbol }}
                <br />
                <b>Supply</b>
                : {{ asset.supply }} {{ asset.symbol }}
                <br />
                <b>Decimals</b>
                : {{ asset.decimals }}
                <br />
                <b>Reissuable</b>
                : {{ asset.reissuable }}
                <br />
                <b>Burnable</b>
                : {{ asset.burnable }}
              </div>
            </div>
          </div>
          <div class="column" v-if="asset.reissuable">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Reissue Sidechain</h3>
                <b-field label="Amount to reissue">
                    <b-input v-model="supplyReissue"></b-input>
                </b-field>
                <b-button v-on:click="reissueSidechain" style="margin-top:10px;" type="is-primary" size="is-large">REISSUE</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
let ScryptaCore = require("@scrypta/core");
let math = require("mathjs")

export default {
  name: 'Explorer',
  watch: {
    supplyReissue: function () {
      const app = this
      setTimeout(function(){
        app.fixStep()
      },1000)
    }
  },
  data() {
    return {
      scrypta: new ScryptaCore(true),
      math: math,
      address: "",
      wallet: "",
      supplyReissue: 0,
      sidechain: {
        sidechain: [{
          data: {
            genesis: {
              reissuable: true
            }
          }
        }]
      },
      asset: {},
      isLogging: true,
      isLoading: true,
      searcher: ""
    };
  },
  computed: {
    filteredList() {
      return this.sidechains.filter(sidechains => {
        return sidechains.name.toLowerCase().includes(this.searcher.toLowerCase()) ||
          sidechains.address.toLowerCase().includes(this.searcher.toLowerCase())
      })
    }
  },
  async mounted() {
    const app = this;
    app.wallet = await app.scrypta.importBrowserSID();
    app.wallet = await app.scrypta.returnDefaultIdentity();
    if (app.wallet.length > 0) {
      let SIDS = app.wallet.split(":");
      app.address = SIDS[0];
      let identity = await app.scrypta.returnIdentity(app.address);
      app.wallet = identity;
      app.isLogging = false;
      app.fetchSidechain()
    } else {
      app.isLogging = false;
    }
  },
  methods: {
    fixStep(){
      const app = this
      let decimals = app.asset.decimals
      let supply = app.supplyReissue.toString()
      if(supply.indexOf(',') !== -1){
        supply = app.supplyReissue.replace(',','.')
      }
      supply = parseFloat(supply)
      app.supplyReissue = app.math.round(supply, decimals)
    },
    fetchSidechain(){
      const app = this
      app.scrypta.post('/sidechain/get', {sidechain_address: app.$route.params.sidechain}).then(async response => {
        app.sidechain = response
        app.asset = app.sidechain.sidechain[0].data.genesis
        app.isLoading = false
      })
    },
    reissueSidechain(){
      const app = this;
      if(app.supplyReissue > 0){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.scrypta.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let resIssue = await app.scrypta.post(
                "/sidechain/reissue",
                {
                  dapp_address: app.wallet.address,
                  private_key: key.prv,
                  pubkey: key.key,
                  supply: parseFloat(app.supplyReissue),
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                resIssue.reissue.sxid !== undefined
              ) {
                this.$buefy.toast.open({
                    message: 'Asset issued correctly!',
                    type: 'is-success'
                })
                setTimeout(function(){
                  location.reload()
                },500)
              }
            }
          }
        });
      }
    }
  }
}
</script>