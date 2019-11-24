<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/#/" style="margin-top:3px"><img src="./assets/logo.png" height="22" style="float:left; margin-right:10px;"> Sidechain Explorer</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
    <hr>
    <div style="font-size:11px; text-align:center; padding:4px 0 8px 0">
      This is an <a href="https://github.com/scryptachain/scrypta-sidechain-explorer" _target="blank">Open Source Project</a> by Scrypta Task Force
    </div>
  </div>
</template>
