<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 ma-0" app>
        <v-layout column>
          <div :class="['header_navigation', $route.name === 'place' && 'see_through']">
            <v-row id="navrow" style="height: 100px">
              <v-col md="1">
                <router-link to="/"
                  ><img class="logo mt-2" src="@/assets/images/logo.png"
                /></router-link>
              </v-col>
              <v-col md="5"></v-col>
              <v-col md="6">
                <v-icon
                  @click="drawer = true"
                  x-large
                  class="d-flex d-sm-none"
                  id="phone_nav"
                  style="float: right; margin: 20px"
                  >menu</v-icon
                >
                <v-tabs
                  class="d-none d-sm-block"
                  active-class="active-tab"
                  grow
                  height="76px"
                  background-color="rgb(255, 0, 0, 0.0)"
                  centered
                  color="#000"
                  hide-slider
                >
                  <v-tab to="/"
                    ><div :class="['tabs_top', $route.name === 'place' && 'underline']">
                      Orte
                    </div></v-tab
                  >
                  <v-tab to="/account"
                    ><div :class="['tabs_top', $route.name === 'account' && 'underline']">
                      Accounts
                    </div></v-tab
                  >
                  <v-tab to="/idea"
                    ><div :class="['tabs_top', $route.name === 'idea' && 'underline']">
                      Ideen
                    </div></v-tab
                  >
                  <v-tab href="https://www.youbeon.eu/youbeon-map">
                    <div class="tabs_top">
                      FAQs
                    </div>
                  </v-tab>
                </v-tabs>
              </v-col>
            </v-row>
          </div>
          <v-menu
            style="z-index: 9999; width: 100%"
            v-model="drawer"
            bottom
            min-width="100%"
            attach="#navrow"
            content-class="elevation-0"
            nudge-bottom="80"
          >
            <v-list nav dense>
              <v-list-item-group>
                <v-list-item to="/"
                  ><div
                    :class="['tabs_top', $route.name === 'place' && 'underline']"
                    @click="drawer = false"
                  >
                    Orte
                  </div>
                </v-list-item>
                <v-list-item to="/account">
                  <div
                    :class="['tabs_top', $route.name === 'account' && 'underline']"
                    @click="drawer = false"
                  >
                    Accounts
                  </div>
                </v-list-item>
                <v-list-item to="/idea">
                  <div
                    :class="['tabs_top', $route.name === 'idea' && 'underline']"
                    @click="drawer = false"
                  >
                    Ideen
                  </div>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <div style="z-index: 8; width: 100%; height: 5px; background-color: #b0dcd9"></div>
          <v-dialog
            overlay-opacity="0"
            width="20vw"
            content-class="intro_popUp"
            v-model="introPopUp"
          >
            <v-card-title id="popUp_title">Willkommen</v-card-title>
            <v-card-text style="height: 375px">
              {{ popUpcontent.para1 }}
              <br />
              <br />
              {{ popUpcontent.para2 }}
              <br />
              <v-btn
                id="popUp_btn"
                color="#b0dcd9"
                elevation="0"
                width="150px"
                @click="introPopUp = false"
              >
                Los Geht's >>>
              </v-btn>
            </v-card-text>
          </v-dialog>

          <v-flex xs12 fill-height class="pa-0 ma-0">
            <keep-alive>
              <router-view v-if="loading === false" />
              <v-skeleton-loader
                v-else
                style="margin: 5% auto"
                max-width="90%"
                max-height="800"
                type="sentences, image, imagefb"
              ></v-skeleton-loader>
            </keep-alive>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { info_popUp } from '@/app/data'
import { initialize as initData } from '@/app/data'

@Component({
  components: {},
})
export default class App extends Vue {
  loading = true
  drawer = false
  mounted() {
    initData().then(() => {
      this.loading = false
    })
  }

  introPopUp = true
  popUpcontent = info_popUp
}
</script>

<style>
#app {
  color: #000;
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#pop-up-title {
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: rgb(176 220 217);
}

/* stylelint-disable-next-line selector-class-pattern */
.v-card__title {
  border: 5px solid rgb(176 220 217);
  border-bottom: none;
  border-radius: 0 !important;
  background-color: #fff;
}

/* stylelint-disable-next-line selector-class-pattern */
.v-card__text {
  border: 5px solid rgb(176 220 217);
  border-top: none;
  border-radius: 0 !important;
  background-color: #fff;
}

#pop-up-button {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-weight: 600;
  text-transform: none !important;
}

.header-navigation {
  z-index: 8;
  background-color: #e9e9e9;
  font-family: ChicagoFLF, Helvetica, Arial, sans-serif;
  transition: 0.5s;
}

#phone-nav:hover {
  cursor: pointer;
}

.tabs-top {
  align-content: bottom;
  font-size: 1.6em;
  text-transform: none !important;
}

.logo {
  height: 76px;
  margin-left: 10px;
}

.underline {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.see-through {
  background-color: rgb(233 233 233 / 70%);
}

@font-face {
  font-family: ChicagoFLF;
  src: local('ChicagoFLF'), url('@/assets/fonts/chicago-flf.ttf') format('truetype');
}
</style>
