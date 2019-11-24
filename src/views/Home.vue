<template>
  <div class="home" style="margin-top:30px">
    <div class="">
      <div class="col-12">
        <b-table striped hover :items="sidechains" :fields="fields">
          <template v-slot:cell(details)="data">
            <a :href = "'/#/sidechain/' + data.item.address"><div class="btn btn-primary">></div></a>
          </template>
        </b-table>
      </div>
    </div>
    <div class="node-badge" v-if="idanode">{{ idanode }}</div>
  </div>
</template>

<style>
  #app{
    text-align: center;
    font-family: 'karmillaregular';
    font-size:13px;
  }
</style>

<script>

export default {
  name: 'home',
  mounted : async function(){
    const app = this
    app.idanode = await app.scrypta.connectNode()
    app.fetchSidechains()
  },
  methods: {
    fetchSidechains(){
      const app = this
      app.axios.get(app.idanode + '/sidechain/list').then(response => {
        let sidechains = []
        for(let x in response.data.data){
          let sidechain = response.data.data[x]
          let parsed = {
            name: sidechain.genesis.name + ' (' + sidechain.genesis.symbol + ')',
            address: sidechain.address,
            supply: sidechain.genesis.supply + ' ' + sidechain.genesis.symbol,
            owner: sidechain.genesis.owner
          }
          sidechains.push(parsed)
        }
        app.sidechains = sidechains
      })
    }
  },
  data () {
    return {
      scrypta: window.ScryptaCore,
      axios: window.axios,
      idanode: '',
      sidechains: [],
      fields: [
          { key: 'name', sortable: true },
          'address',
          'supply',
          'owner',
          'details'
        ]
    }
  }
}
</script>

<style>
  .node-badge{
    position:fixed; 
    bottom:-3px; 
    font-size:10px; 
    padding:8px; 
    right:10px; 
    z-index:9999; 
    border: 1px solid #ccc; 
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
</style>