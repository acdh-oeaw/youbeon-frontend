<template>
  <v-app>
    <v-main>
      <v-container fill-height fill-width class="pa-0 ma-0" app>
        <v-layout column>
            <v-row>
              <v-col md="1">
              </v-col>
              <v-col md="5">
                <v-spacer></v-spacer>
              </v-col>
              <v-col md="6">
                <v-tabs
                  active-class="active-tab"
                  grow
                  background-color="ci"
                  class="tabs-top"
                  centered
                  dark
                  color="accent"
                  hide-slider>
                  <v-tab to="/"><div><v-icon color="white">mdi-home-outline</v-icon>Influencer</div></v-tab>
                  <v-tab to="/idea"><div><v-icon color="white">mdi-newspaper</v-icon>Ideen</div></v-tab>
                  <v-tab to="/place"><div><v-icon color="white">mdi-database</v-icon>Orte</div></v-tab>
                </v-tabs>
              </v-col>
            </v-row>
          <v-flex xs12 fill-height class="pa-0 ma-0">
            <keep-alive>
              <router-view />
            </keep-alive>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
  #app {
    font-family: "ChicagoFLF" , Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }


  @font-face {
    font-family: "ChicagoFLF";
    src: local("ChicagoFLF"),   url(./fonts/ChicagoFLF.ttf) format("truetype");
  }
</style>
