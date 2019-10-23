<template>
  <div id="app">
    <m-header></m-header>
    <m-tabbar></m-tabbar>
    <keep-alive> <router-view/> </keep-alive>
    <m-player></m-player>
  </div>
</template>

<script>
import header from '@/components/header'
import tabbar from '@/components/tabbar'
import player from '@/components/player'
export default {
  name: 'App',
  components: {
    'm-header': header,
    'm-tabbar': tabbar,
    'm-player': player
  }
}
</script>

<style>

</style>
