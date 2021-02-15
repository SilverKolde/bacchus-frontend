<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <router-link to="/" class="white--text text-decoration-none">
       <h2>Bacchus</h2>
      </router-link>
      <v-spacer></v-spacer>
      <router-link to="/closed" class="white--text text-decoration-none">
        <h5>ENDED AUCTIONS</h5>
      </router-link>
    </v-app-bar>
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
};
</script>
