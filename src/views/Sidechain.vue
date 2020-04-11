<template>
  <div class="home" style="margin-top:30px">
    <div class="">
      <div class="col-12">
        <h3>
          {{ sidechain.name }}
          <br />
          <span style="font-size:13px">
            {{ $route.params.sidechain }}<br>
            CAP: {{ cap }} {{ sidechain.symbol }} - BURNED: {{ burned }} {{ sidechain.symbol }}
          </span>
        </h3>          
        <div class="btn btn-primary btn-sm" v-on:click="toggleShares" style="float:right; margin-top:-45px; cursor:pointer;"><span v-if="!showShares">SHOW</span><span v-if="showShares">HIDE</span> SHARES</div>
        <div class="btn btn-success btn-sm" v-on:click="toggleDetails" style="float:right; margin-top:-45px; margin-right:120px; cursor:pointer;"><span v-if="!showDetails">SHOW</span><span v-if="showDetails">HIDE</span> DETAILS</div>

        <div v-if="showShares">
          <div class="row">
            <div class="col-sm-6 offset-sm-3">
              <apexchart width="100%" type="pie" :options="options" :series="series"></apexchart>
            </div>
          </div>
        </div>

        <b-table v-if="showDetails && transactions.unconfirmed.length > 0" striped hover :items="transactions.unconfirmed" :fields="fields">
          <template v-slot:cell(details)="data">
            <a :href = "'/#/sxid/' + $route.params.sidechain + '/' + data.item.sxid"><div class="btn btn-primary">></div></a>
          </template>
        </b-table>
        <b-table v-if="showDetails" striped hover :items="transactions.confirmed" :fields="fields">
          <template v-slot:cell(details)="data">
            <a :href = "'/#/sxid/' + $route.params.sidechain + '/' + data.item.sxid"><div class="btn btn-primary">></div></a>
          </template>
        </b-table>

        <b-table v-if="!showDetails && compacted.unconfirmed.length > 0" striped hover :items="compacted.unconfirmed" :fields="fields">
          <template v-slot:cell(details)="data">
            <a :href = "'/#/sxid/' + $route.params.sidechain + '/' + data.item.sxid"><div class="btn btn-primary">></div></a>
          </template>
        </b-table>
        <b-table v-if="!showDetails" striped hover :items="compacted.confirmed" :fields="fields">
          <template v-slot:cell(details)="data">
            <a :href = "'/#/sxid/' + $route.params.sidechain + '/' + data.item.sxid"><div class="btn btn-primary">></div></a>
          </template>
        </b-table>
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
</style>

<script>
export default {
  name: "home",
  mounted: async function() {
    const app = this;
    app.idanode = await app.scrypta.connectNode();
    app.fetchSidechain();
  },
  methods: {
    toggleShares(){
      const app = this
      if(app.showShares === false){
        app.showShares = true
      }else{
        app.showShares = false
      }
    },
    toggleDetails(){
      const app = this
      if(app.showDetails === false){
        app.showDetails = true
      }else{
        app.showDetails = false
      }
    },
    fetchSidechain() {
      const app = this;
      app.axios.get(app.idanode + "/sidechain/list").then(response => {
        for (let x in response.data.data) {
          let sidechain = response.data.data[x];
          if (sidechain.address === app.$route.params.sidechain) {
            let parsed = {
              name:
                sidechain.genesis.name + " (" + sidechain.genesis.symbol + ")",
                address: sidechain.address,
                supply: sidechain.genesis.supply + " " + sidechain.genesis.symbol,
                symbol: sidechain.genesis.symbol,
                owner: sidechain.genesis.owner
            };
            app.sidechain = parsed;
          }
        }
      });
      app.axios
        .post(app.idanode + "/sidechain/shares", {
          sidechain_address: app.$route.params.sidechain
        })
        .then(response => {
          let shares = response.data.shares
          app.series = []
          for(let x in shares){
            app.series.push(shares[x].shares)
            app.options.labels.push(x + ' ' + shares[x].balance + ' ' + app.sidechain.symbol)
          }
          app.cap = response.data.cap
          if(shares[app.$route.params.sidechain] !== undefined){
            app.cap = app.cap - shares[app.$route.params.sidechain].balance
            app.burned = shares[app.$route.params.sidechain].balance
          }
          app.cap = app.cap.toFixed(app.sidechain.decimals)
        })
      app.axios
        .post(app.idanode + "/sidechain/scan", {
          sidechain_address: app.$route.params.sidechain
        })
        .then(response => {
          let transactions = { confirmed: [], unconfirmed: [] };
          let compacted = { confirmed: [], unconfirmed: [] };
          for (let x in response.data.data) {
            let value = 0;
            let to = "";
            for (let y in response.data.data[x].transaction.outputs) {
              if (y != response.data.data[x]["address"]) {
                value += response.data.data[x].transaction.outputs[y];
                to = y;
              }
            }
            if(to === ""){
              for (let y in response.data.data[x].transaction.outputs) {
                value += response.data.data[x].transaction.outputs[y];
                to = y;
              }
            }
            let from = "";
            if (response.data.data[x].transaction["inputs"][0]['vout'] === 'genesis') {
              from = 'GENESIS'
            }else if(response.data.data[x].transaction["inputs"][0]['vout'] === 'reissue') {
              from = 'REISSUE'
            }else{
              from = response.data.data[x]["address"]
            }
            if(from !== undefined){
              let Block
              if(response.data.data[x].block > 0){
                Block = response.data.data[x].block
              }else{
                Block = 'unconfirmed'
              }
              let date = new Date(response.data.data[x].transaction.time)
              let year = date.getFullYear()
              let month = date.getMonth() + 1
              let day = date.getDate()
              let hours = date.getHours()
              let minutes = "0" + date.getMinutes()
              let formattedTime = day + '/' + month + '/' + year +' at ' + hours + ':' + minutes.substr(-2)

              let transaction = {
                sxid: response.data.data[x].sxid,
                value: value + " " + app.sidechain.symbol,
                from: from,
                to: to,
                block: Block,
                time: formattedTime
              };
              let compact = {
                sxid: response.data.data[x].sxid.substr(0,4) + '...' + response.data.data[x].sxid.substr(-4),
                value: value + " " + app.sidechain.symbol,
                from: from.substr(0,4) + '...' + from.substr(-4),
                to: to.substr(0,4) + '...' + to.substr(-4),
                block: Block,
                time: formattedTime
              };
              if(response.data.data[x].block > 0){
                transactions.confirmed.push(transaction);
                compacted.confirmed.push(compact);
              }else{
                transactions.unconfirmed.push(transaction);
                compacted.unconfirmed.push(compact);
              }
            }
          }
          app.transactions = transactions;
          app.compacted = compacted;
        });
    }
  },
  data() {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      idanode: "",
      transactions: {
        confirmed: [],
        unconfirmed: []
      },
      compacted: {
        confirmed: [],
        unconfirmed: []
      },
      sidechain: [],
      burned: 0,
      cap: 0,
      options: {
        labels: []
      },
      series: [],
      showShares: false,
      showDetails: false,
      fields: [
        "sxid",
        "value",
        "from",
        "to",
        "block",
        "time",
        "details"
      ]
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