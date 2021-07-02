<template>
  <vContainer>
    <v-card class="sticky-card mt-2">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            item-text="bezeichnung"
            item-value="id"
            clearable
            deletable-chips
            solo
            text
            flat
            hide-details
            label="Suche..."
          >
          </v-autocomplete>
        </v-col>
        <div class="vl"></div>
        <v-col class="pa-0 ma-0" cols="auto">
          <v-menu max-height="80vh" offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                style="margin-top:5px"
                text
                v-on="on"
                v-bind="attrs"
              >
                test
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                dense
                v-bind:key="item.id"
                v-for="item in dropDownItems"
              >
                <v-list-item-title>item.title</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
    <d3-network
      id="network"
      :net-nodes="nodes"
      :net-links="links"
      :options="options"
    >
    </d3-network>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// eslint-disable-next-line
import D3Network from "vue-d3-network";

@Component({
  components: {
    D3Network,
  },
  name: "Influencer",
})
export default class Influencer extends Vue {
  dropDownItems: string[] = [];
  nodes: any = [];
  links: any = [];
  options = {
    force: 2000,
    nodeLabels: true,
  };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="vue-d3-network/dist/vue-d3-network.css"></style>
<style scoped lang="scss">
#network {
  margin-top: 5vh;
  border: 2px solid #b0dcd9;
  background-color: #e5e5e5;
  height: 70vh;
}

.vl {
  border-left: 2px solid #e5e5e5;
  height: 30px;
  margin-top: 7px;
}
</style>
