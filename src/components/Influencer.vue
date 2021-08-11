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
            chips
            solo
            multiple
            deletable-chips
            text
            flat
            hide-details
            label="Suche..."
            prepend-inner-icon="search"
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
                <v-icon style="margin-left: 10px">expand_more</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                dense
                v-bind:key="item.id"
                v-for="item in religions"
                @click="selectedReligion = item"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
    <d3-network
      @node-click="onNodeClick"
      id="network"
      :net-nodes="networkInfluencer"
      :net-links="links"
      :options="options"
    >
    </d3-network>
    <v-card v-if="influencerDetailed !== null" class="detailedView">
      <v-card-title>
        <div class="hoverLink" @click="openLinktoInsta">
          {{ influencerDetailed.name }}
          <v-icon style="margin-left: 5px">link</v-icon>
        </div>
        <v-icon
          style="position: absolute; right: 20px; top: 20px"
          @click="influencerDetailed = null"
        >
          close
        </v-icon></v-card-title
      >
      <v-card-subtitle> {{ influencerDetailed.bemerkung }} </v-card-subtitle>
      <v-card-text>
        <u>Verbundene Kategorien:</u>
        <br />
        {{ influencerDetailed.kategorie.toString() }}
        <br />
        <u>Verbundene Ideen:</u>
        <br />
        {{ influencerDetailed.idee.toString() }}
      </v-card-text>
    </v-card>
  </vContainer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
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
  selectedReligion: any = { id: 0, name: "Alle Influencer" };

  //Influencer Variables
  allInfluencer: any = [];
  listInfluencer: any = [];
  selectedInfluencer: any = [];
  influencerDetailed: any = null;

  //network diagram
  networkInfluencer: any = [];
  links: any = [];
  options = {
    force: 4000,
    nodeSize: 50,
    linkWidth: 7,
    nodeLabels: true,
  };

  //takes the selected Influences and transfroms them into an Object D3Network understands
  //see https://www.npmjs.com/package/vue-d3-network for clarification
  @Watch("selectedInfluencer")
  buildInfluencerNetworkObject() {
    this.networkInfluencer = [];
    this.links = [];
    let centerNode = {
      id: 0,
      name: this.selectedReligion.name,
      _size: 70,
      _color: "#b0dcd9",
    };
    if (this.selectedReligion.id != 0) {
      this.networkInfluencer = [centerNode];
      this.options.force = 100000;
    }
    this.listInfluencer.forEach((influencer) => {
      if (
        this.selectedInfluencer.includes(influencer.id) ||
        this.selectedInfluencer[0] === undefined
      ) {
        if (this.networkInfluencer.includes(centerNode))
          this.links.push({
            sid: 0,
            tid: influencer.id,
          });
        this.networkInfluencer.push(influencer);
      }
    });
  }

  openLinktoInsta() {
    window.open("https://www.instagram.com", "_blank");
  }

  async onNodeClick(event, node) {
    const headers = { "Content-Type": "application/json" };
    let tempInfluencerDetailed = node;
    if (!isNaN(Number(tempInfluencerDetailed.kategorie[0]))) {
      await fetch(
        "https://db.youbeon.eu/kategorie/filter/?ids=" +
          node.kategorie.toString(),
        { headers }
      )
        .then((response) => response.json())
        .then((data) => {
          let tempKategorie: any[] = [];
          data.forEach((kategorie: any) => {
            if (kategorie.name) {
              tempKategorie.push(kategorie.name);
            }
          });
          tempInfluencerDetailed.kategorie = tempKategorie;
        });
    }
    if (!isNaN(Number(tempInfluencerDetailed.idee[0]))) {
      await fetch(
        "https://db.youbeon.eu/idee/filter/?ids=" + node.idee.toString(),
        { headers }
      )
        .then((response) => response.json())
        .then((data) => {
          let tempIdee: any[] = [];
          data.forEach((idee: any) => {
            if (idee.name) {
              tempIdee.push(idee.name);
            }
          });
          tempInfluencerDetailed.idee = tempIdee;
        });
    }
    this.influencerDetailed = tempInfluencerDetailed;
  }

  @Watch("selectedReligion")
  modifyInfluencerList() {
    this.selectedInfluencer = [];
    if (this.selectedReligion.id === 0) {
      this.listInfluencer = this.allInfluencer;
    } else {
      this.listInfluencer = [];
      this.allInfluencer.forEach((influencer) => {
        if (influencer.religion.includes(this.selectedReligion.id)) {
          this.listInfluencer.push(influencer);
        }
      });
    }
    this.buildInfluencerNetworkObject();
  }

  async created() {
    let fetchedData = await this.getDataFromServerAtCreated();
    this.allInfluencer = fetchedData[0];
    this.listInfluencer = this.allInfluencer;
    this.buildInfluencerNetworkObject();
    this.religions = fetchedData[1];
  }

  async getDataFromServerAtCreated() {
    const headers = { "Content-Type": "application/json" };
    let influencer;
    await fetch("https://db.youbeon.eu/influencer/", { headers })
      .then((response) => response.json())
      .then((data) => {
        influencer = data;
      });

    let religions;
    await fetch("https://db.youbeon.eu/religion/", { headers })
      .then((response) => response.json())
      .then((data) => {
        religions = data;
        data.splice(0, 0, { id: 0, name: "Alle Influencer" });
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

.detailedView {
  border: 4px solid #b0dcd9 !important;
  position: absolute;
  width: 400px;
  right: 30px;
  bottom: 30px;
}

.hoverLink:hover {
  cursor: pointer;
}
</style>
