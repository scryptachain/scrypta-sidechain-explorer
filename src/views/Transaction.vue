<template>
  <div class="home" style="margin-top:30px">
    <div class>
      <div class="col-12">
        <h3>
          {{ sidechain.name }}
          <br />
          <span style="font-size:13px">{{ $route.params.sidechain }}</span>
          <br />
          <i style="font-size:11px">{{ $route.params.sxid }}</i>
        </h3>
      </div>
      <div class="col-md-6 offset-md-3">
        <pre
          style="font-size:14px; background:#eee; border:1px solid #ccc; border-radius:5px; text-align: left; padding:20px;"
        >{{ transaction }}</pre>
        <br />
        <a :href="'https://proof.scryptachain.org/#/uuid/' + transaction.uuid" target="_blank">
          <div class="btn btn-success">SHOW PROOF OF EXISTENCE</div>
        </a>
        <br />
        <br />
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
        .post(app.idanode + "/sidechain/transaction", {
          sidechain_address: app.$route.params.sidechain,
          sxid: app.$route.params.sxid
        })
        .then(response => {
          app.transaction = response.data.transaction;
        });
    }
  },
  data() {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      idanode: "",
      transaction: { uuid: "" },
      sidechain: [],
      fields: [
        "sxid",
        "value",
        "from",
        "to",
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