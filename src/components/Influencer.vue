<template>
  <vContainer>
    <v-card class="sticky-card mt-10">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            v-model="selectedInfluencer"
            :items="listInfluencer"
            item-text="name"
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
          <v-menu max-height="80vh" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                style="margin-top: 5px"
                text
                v-on="on"
                v-bind="attrs"
              >
                <template>
                  {{ selectedReligion.name }}
                </template>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item dense v-bind:key="item.id" v-for="item in religions" @click="selectedReligion = item">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// eslint-disable-next-line
import D3Network from "vue-d3-network";

@Component({
  components: {
    D3Network,
  },
  name: "Influencer",
})
export default class Influencer extends Vue {

  //Religion Variables
  religions: any = [];
  selectedReligion: any = {id:0,name: 'Keine Religion'};

  //Influencer Variables
  allInfluencer: any = [];
  listInfluencer: any = [];
  selectedInfluencer: any = []

  //network diagram
  nodes: any = [];
  links: any = [];
  options = {
    force: 2000,
    nodeLabels: true,
  };


  @Watch('selectedReligion')
  modifyInfluencerList() {
    console.log(this.selectedReligion)
    if(this.selectedReligion === {id:0 ,name: 'Keine Religion'}) {
      this.listInfluencer === this.allInfluencer
    } else {
      this.allInfluencer.forEach(influencer => {
        if(influencer.religion.includes(this.selectedReligion.id)) {
          this.listInfluencer.pop(influencer)
        }
      });
    }
  }

  async created() {
    let fetchedData = await this.getDataFromServerAtCreated();
    this.allInfluencer = fetchedData[0];
    this.listInfluencer = this.allInfluencer;
    this.religions = fetchedData[1];
  }

  async getDataFromServerAtCreated() {
    const headers = { "Content-Type": "application/json" };
    let influencer;
    await fetch("https://db.youbeon.eu/test/influencer/", { headers })
      .then((response) => response.json())
      .then((data) => {
        influencer = data;

      });

    let religions;
    await fetch("https://db.youbeon.eu/test/religion/", { headers })
      .then((response) => response.json())
      .then((data) => {
        religions = data;
        data.splice(0, 0, {id:0,name: 'Keine Religion'})
      });

    return [influencer, religions];
  }
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
