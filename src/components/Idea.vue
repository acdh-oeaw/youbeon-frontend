<template>
  <vContainer>
    <v-row no-gutters class="mt-10">
      <v-col class="pa-0 flex-grow-1 mr-7">
        <v-autocomplete
          clearable
          v-model="selectedReligion"
          :items="allReligions"
          elevation="0"
          item-text="name"
          item-value="id"
          :filter="filterSelectedReligions"
          solo
          text
          hide-details
          label="Religionen filtern nach..."
        >
        </v-autocomplete>
      </v-col>
      <v-col class="pa-0 flex-grow-1 ml-7">
        <v-autocomplete
          clearable
          :items="allReligions"
          v-model="selectedComparison"
          elevation="0"
          item-text="name"
          item-value="id"
          :filter="filterSelectedReligions"
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
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
    force: 5000,
    nodeLabels: true,
  };
  allReligions: any[] = [];
  selectedReligion: any = [];
  selectedComparison: any = [];
  religionIdeas: any[] = [];
  comparisonIdeas: any[] = [];

  @Watch("selectedReligion")
  getSelectedReligion() {
    this.getIdeasForReligions(false);
  }

  filterSelectedReligions(item, queryText, itemText) {
    console.log(item)
    if(item !== this.selectedReligion && item !== this.selectedComparison) {
      return false
    } else {
      return true
    }
  }

  @Watch("selectedComparison")
  getComparisonReligion() {
    this.getIdeasForReligions(true);
  }

  async getIdeasForReligions(comparison: boolean) {
    let tempIdeas: any;
    let tempIdeasCount: any;
    const headers = { "Content-Type": "application/json" };
    await fetch(
      "https://db.youbeon.eu/idee/menge/?religion=" +
        String(comparison === true ? this.selectedComparison : this.selectedReligion),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        tempIdeasCount = data;
      });
      await fetch(
        "https://db.youbeon.eu/idee/filter/?ids=" + Object.getOwnPropertyNames(tempIdeasCount).toString(),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        tempIdeas = data;
      });
      let color = comparison === true ? '#FF8D06' : '#B0DCD9'
      tempIdeas.forEach(idea => {
        idea._color = color
        idea._size = tempIdeasCount[idea.id]*15
      });
      if(comparison === true) {
        this.comparisonIdeas = tempIdeas
      } else {
        this.religionIdeas = tempIdeas
      }
  }

  @Watch('religionIdeas')
  @Watch('comparisonIdeas')
  combineIntoNodeObject() {
    this.nodes = this.religionIdeas.concat(this.comparisonIdeas)
  }

  mounted() {
    const headers = { "Content-Type": "application/json" };
    fetch("https://db.youbeon.eu/religion/", { headers })
      .then((response) => response.json())
      .then((data) => {
        this.allReligions = data;
      });
  }
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
