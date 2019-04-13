<template>
  <div id="app">
    <tempo/>
    <router-view/>
  </div>
</template>

<script>
import tempo from "./components/tempo";
export default {
  name: 'app',
  components: {tempo},
  methods: {
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
