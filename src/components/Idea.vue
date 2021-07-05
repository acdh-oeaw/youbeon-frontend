<template>
  <vContainer>
      <v-row no-gutters class="mt-10">
        <v-col class="pa-0 flex-grow-1 mr-7">
          <v-autocomplete
            clearable
            deletable-chips
            solo
            text
            hide-details
            label="Ideen filtern nach..."
          >
          </v-autocomplete>
        </v-col>
        <v-col  class="pa-0 flex-grow-1 ml-7">
           <v-autocomplete
            clearable
            deletable-chips
            solo
            text
            hide-details
            label="Vergleichen mit..."
          >
          </v-autocomplete>
        </v-col>
      </v-row>
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
  name: "Idea",
})
export default class Idea extends Vue {
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
