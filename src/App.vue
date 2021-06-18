<template>
  <v-app>
    <v-main>
      <v-container class="pa-0 ma-0" app>
        <v-layout column>
            <div :class="['header_navigation', $route.name === 'place' && 'see_through']">
              <v-row style="height: 100px">
                <v-col md="1"></v-col>
                <v-col md="5"></v-col>
                <v-col md="6">
                  <v-tabs
                    active-class="active-tab"
                    grow
                    height="76px"
                    background-color="rgb(255, 0, 0, 0.0)"
                    centered
                    color="#000"
                    hide-slider
                  >
                    <v-tab to="/"
                      ><div class="tabs_top">
                        <v-icon color="white">mdi-home-outline</v-icon
                        >Influencer
                      </div></v-tab
                    >
                    <v-tab to="/idea"
                      ><div class="tabs_top">
                        <v-icon color="white">mdi-newspaper</v-icon>Ideen
                      </div></v-tab
                    >
                    <v-tab to="/place"
                      ><div class="tabs_top">
                        <v-icon color="white">mdi-database</v-icon>Orte
                      </div></v-tab
                    >
                  </v-tabs>
                </v-col>
              </v-row>
            </div>
            <div
              style="width: 100%; background-color: #b0dcd9; height: 5px; z-index: 8;"
            ></div>
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
  font-family: "ChicagoFLF", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}

.header_navigation {
  z-index: 8;
  transition: .5s;
  background-color: #e9e9e9;
}

.tabs_top {
  font-size: 1.6em;
  align-content: bottom;
}

.see_through{
  background-color:rgba(233, 233, 233, 0.7);
}

@font-face {
  font-family: "ChicagoFLF";
  src: local("ChicagoFLF"), url(./fonts/ChicagoFLF.ttf) format("truetype");
}
</style>
