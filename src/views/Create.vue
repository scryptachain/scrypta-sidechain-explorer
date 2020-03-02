<template>
  <div class="home">
    <b-modal v-model="passwordShow" hide-footer title="Create new Sidechain">
      You're creating an asset with these features:
      <br />
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
      <br />
      <br />
      <strong style="color:#f00">
        This operation will create this asset and will send the asset to your wallet: {{ user }}.
        <br />Please make sure all the informations are correct.
      </strong>
      <br />
      <br />
      <b-form-input
        v-if="!isUploading"
        v-model="unlockPwd"
        type="password"
        placeholder="Enter wallet password"
      ></b-form-input>
      <br />
      <div v-if="!isUploading" @click.prevent="unlockWallet" class="btn btn-primary">CREATE</div>
    </b-modal>
    <div class="page-body">
      <div class="row" style="min-height: 100vh; background-image: url('bg-sidechain.jpg');">
        <div class="col-sm-5 my-auto boxed-desktop">
          <div class="boxed-left" >
            <img src="/img/planum.png" alt="" width="65%" class="image-logo">
            <p style="font-size:30px; color: white; margin-top:20px;">
             SIDECHAIN LAYER
            </p>
            <h5 style="color: white; text-align: justify;">
              <br />Planum sidechain layer allow to anyone to create and issue his own tokenized asset. Any tokenized assets, once generated with his own metrics, have his independent life cycle in a secured sidechain layer, which runs on top of the Scrypta blockchain. ‌
            </h5>
          </div>
        </div>
        <div class="col-sm-7 my-auto">
          <div class="container logo-mobile" style="margin-top: 50px;">
          <img src="/img/planum.png" alt="" width="65%" class="image-logo">
          </div>
          <h1 style="text-align:center; color: white;">
            <strong>CREATE YOUR OWN DIGITAL ASSET</strong>
            <br />
            <span style="font-size:13px">
              using
              <i>{{ user }}</i>.
              <a href="#" v-on:click="logout">(Logout)</a>
            </span>
          </h1>
          <div class="col-sm-8 mx-auto">
            <div class="row">
            <b-button
              variant="light"
              v-b-toggle.collapse-2
              class="m-1 myclass"
              style="width: 100%; font-size: 20px;"
            >
              <strong>ASSET BASICS</strong>
            </b-button>
            <b-collapse id="collapse-2" style="display: block;">
              <b-card style="opacity: 0.9">
                <div class="row">
                  <div class="col-sm-6 my-auto">
                    <b-form-input v-model="asset.name" placeholder="Enter asset name"></b-form-input>
                    <b-form-input
                      v-model="asset.symbol"
                      placeholder="Enter asset symbol"
                      style="margin-top: 10px"
                    ></b-form-input>
                  </div>
                  <div class="col-sm-6 my-auto" style="text-align: justify; font-size: 16px;">
                    <p>Type the name and the alphanumeric symbol of your asset, this is a purely descriptive field and the uniqueness is not guaranteed. For your safety and that of your users, create a name that characterizes the project. ‌</p>
                  </div>
                </div>
              </b-card>
            </b-collapse>
            </div>

            <div class="row" style="margin-top: 20px;">
            <b-button
              variant="light"
              v-b-toggle.collapse-3
              class="m-1 myclass"
              style="width: 100%; font-size: 20px;"
            >
              <strong>ASSET METRICS</strong>
            </b-button>
            <b-collapse id="collapse-3">
              <b-card style="opacity: 0.9">
                <div class="row">
                  <div class="col-sm-6 my-auto">
                    <b-form-input v-model="asset.supply" placeholder="Enter asset supply"></b-form-input>
                    <p style="margin-top: 30px;"><strong>*Set the decimals division of the asset</strong></p>
                    <range-slider class="slider" min="0" max="8" step="1" v-model="asset.decimals"></range-slider>
                    {{
                    asset.decimals
                    }}
                    <br />
                  </div>
                  <div class="col-sm-6 my-auto" style="text-align: justify; font-size: 16px;">
                    <p>Enter the total supply of your digital asset. This represent the total number of assets issued. Set also the decimals of your digital asset.</p>
                  </div>
                </div>
              </b-card>
            </b-collapse>
            </div>

            <div class="row" style="margin-top: 20px;">
            <b-button
              variant="light"
              v-b-toggle.collapse-4
              class="m-1 myclass"
              style="width: 100%; font-size: 20px;"
            >
              <strong>ASSET FEATURES</strong>
            </b-button>
            <b-collapse id="collapse-4">
              <b-card style="opacity: 0.9">
                <div class="row">
                  <div class="col-sm-6 my-auto" style="text-align: left; margin-top: 10px;">
                    <b-form-checkbox style="font-size: 18px;"
                      v-model="asset.reissuable"
                      value="true"
                      unchecked-value="false"
                    >This asset can be reissued</b-form-checkbox>
                    <b-form-checkbox style="font-size: 18px; margin-top: 10px;"
                      v-model="asset.burnable"
                      value="true"
                      unchecked-value="false"
                    >This asset can be burned</b-form-checkbox>
                  </div>
                  <div class="col-sm-6 my-auto" style="text-align: justify; font-size: 16px;">
                    <p>You have the option to make the asset "reissuable" (owner can add any amount of supply also after the asset is issued), or "burnable" (anyone can destroy a portion or the whole supply of the asset sending assets to the sidechain's address) ‌</p>
                  </div>
                </div>
              </b-card>
            </b-collapse>
            </div>

            <div style="text-align:center; margin-top: 25px; margin-bottom: 25px;" v-if="!issueResponse">
              <div
                class="btn btn-light-mod rounded-pill"
                style="cursor:pointer"
                v-if="!isUploading"
                v-on:click="openUnlock"
              >CREATE ASSET</div>
              <span v-if="isUploading">Creating asset, please wait..</span>
            </div>
            <pre
              v-if="issueResponse"
              style="font-size:14px; background:#eee; border:1px solid #ccc; border-radius:5px; text-align: left; padding:20px;"
            >{{ issueResponse }}</pre>
            
          </div>
        </div>
      </div>
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

.boxed-left {
  width: 75%;
  border-radius: 15px;
  border: 2px solid #D7293B;
  outline: 2px white;
  margin: auto;
  padding: 60px;
  background-color: #002537;
  opacity: 0.85;
}
.page-body {
  margin: 0px;
  min-height: 100vh;
  padding: 0px;
  overflow-x: hidden;
}
.slider {
  width: 100%;
}
.text-logout{
  margin-top: 150px;
}

.btn.myclass {
  background-color:#002537;
  color: white ;
  border: 2px solid white;
  border-radius: 10px;
  height: 80px;
  opacity: 0.85;
}
.btn.btn-light-mod {
  border: 2px solid white;
  background-color: #D7293B;
  color: white;
}
.image-logo {
  opacity: 1;
}
body{
  overflow-x: hidden;
}

@media screen and (max-width: 600px){
.boxed-desktop {
display: none;
}
.text-logout {
  margin-top: 10px;
  margin-bottom: 10px;
}
}
@media screen and (min-width: 600px){
.logo-mobile {
  display: none;
}
}
</style>

<script>
import RangeSlider from "vue-range-slider";
// you probably need to import built-in style
import "vue-range-slider/dist/vue-range-slider.css";
export default {
  name: "home",
  mounted: async function() {
    const app = this;
    app.idanode = await app.scrypta.connectNode();
    app.checkUser();
  },
  components: {
    RangeSlider
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
      } else {
        window.location = "/#/login";
      }
    },
    openUnlock() {
      const app = this;
      if (
        app.asset.name !== "" &&
        parseFloat(app.asset.supply) > 0 &&
        app.asset.symbol !== "" &&
        parseFloat(app.asset.decimals) >= 0
      ) {
        app.axios.get(app.idanode + "/balance/" + app.user).then(response => {
          if (response.data.balance > 1.001) {
            app.axios
              .get(app.idanode + "/sidechain/list")
              .then(sidechainsRes => {
                let valid = true;
                let sidechains = sidechainsRes.data.data;
                for (let x in sidechains) {
                  let sidechain = sidechains[x];
                  if (sidechain.genesis.name.toLowerCase() === app.asset.name) {
                    alert("This name exists yet, please choose another name!");
                    valid = false;
                  }
                  if (
                    sidechain.genesis.symbol.toLowerCase() === app.asset.symbol
                  ) {
                    alert(
                      "This symbol exists yet, please choose another symbol!"
                    );
                    valid = false;
                  }
                }
                if (valid === true) {
                  app.passwordShow = true;
                }
              });
          } else {
            alert("Not enough balance, you need at least 1.001 LYRA!");
          }
        });
      } else {
        alert("Fill all the fields!");
      }
    },
    unlockWallet() {
      if (this.unlockPwd !== "") {
        var app = this;
        app.decrypted_wallet = "WALLET LOCKED";
        app.scrypta.readKey(this.unlockPwd).then(async function(response) {
          if (response !== false) {
            app.passwordShow = false;
            app.isUploading = true;
            let resIssue = await app.axios.post(
              app.idanode + "/sidechain/issue",
              {
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
              }
            );
            app.issueResponse = resIssue.data;
            if (
              app.issueResponse.issued === true ||
              app.issueResponse.issued === "true"
            ) {
              alert("Sidechain created correctly!");
            }
          } else {
            alert("Wrong password!");
          }
        });
      } else {
        alert("Write your password first");
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
      unlockPwd: "",
      user: "",
      asset: {
        name: "",
        symbol: "",
        supply: "",
        decimals: 0,
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