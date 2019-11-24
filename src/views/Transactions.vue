<template>
  <div class="home" style="margin-top:30px">
    <div class>
      <div class="col-12">
        <h3>
          {{ $route.params.address }}
          <br />
          <span style="font-size:13px">Transactions in sidechain {{ $route.params.sidechain }}</span>
        </h3>
        <b-table striped hover :items="transactions" :fields="fields">
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
    app.fetchAssets();
  },
  methods: {
    fetchAssets() {
      const app = this;
      app.axios.post(app.idanode + "/sidechain/transactions", { dapp_address: app.$route.params.address, sidechain_address: app.$route.params.sidechain }).then(response => {
        for(let x in response.data.transactions){
          if(response.data.transactions[x].from === '' || response.data.transactions[x].from === undefined){
            response.data.transactions[x].from = 'GENESIS'
          }
        }
        app.transactions = response.data.transactions
      })
    }
  },
  data() {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      idanode: "",
      transactions: [],
      fields: [
        "sxid",
        "from",
        "to",
        "amount",
        { key: "block", sortable: true },
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