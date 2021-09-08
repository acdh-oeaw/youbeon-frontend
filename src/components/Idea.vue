<template>
  <vContainer>
    <v-row
      no-gutters
      class="mt-2"
      v-for="religionField in selectedReligion"
      v-bind:key="religionField.id"
    >
      <v-col class="pa-0 flex-grow-1">
        <v-card
          :style="{ 'margin-top': religionField.id === 0 ? '3vh' : '0px' }"
        >
          <v-row no-gutters>
            <v-autocomplete
              flat
              clearable
              @input="getSelectedReligion(religionField.id)"
              v-model="religionField.religion"
              :items="allReligions"
              elevation="0"
              item-text="name"
              item-value="id"
              solo
              text
              hide-details
              label="Religionen filtern nach..."
              prepend-inner-icon="search"
            >
            </v-autocomplete>
            <v-btn icon style="margin-top: 7px" @click="addReligionField()">
              <v-icon>add_circle_outline</v-icon>
            </v-btn>
            <v-btn
              v-if="religionField.id !== 0"
              style="margin-top: 7px"
              icon
              @click="removeReligionField(religionField)"
            >
              <v-icon>remove_circle_outline</v-icon>
            </v-btn>
            <div
              :style="{ 'background-color': religionField.color }"
              class="colorDisplay"
            ></div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <d3-network
      style="margin-top: 5vh"
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
    force: 3000,
    fontSize: 14,
    nodeLabels: true,
    forces: {
      X: 0.2,
      Y: 0.5,
      ManyBody: true,
      Center: true,
    },
  };
  allReligions: any[] = [];
  selectedReligion: any = [];

  selectableReligions: string[] = [
    "alle accounts",
    "alevitentum",
    "katholisches christentum",
    "evangelisches christentum",
    "orthodoxes christentum",
    "islam",
    "judentum",
    "sikhismus",
  ];

  getSelectedReligion(val) {
    let indexOfChangedReligion = -1;
    this.selectedReligion.forEach((religion) => {
      if (religion.id === val) {
        indexOfChangedReligion = this.selectedReligion.indexOf(religion);
      }
    });
    this.getIdeasForReligions(indexOfChangedReligion);
  }

  async getIdeasForReligions(changedOne: any) {
    let tempIdeas: any;
    let tempIdeasCount: any;
    const headers = { "Content-Type": "application/json" };
    await fetch(
      "https://db.youbeon.eu/idee/menge/?religion=" +
        String(this.selectedReligion[changedOne].religion),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        tempIdeasCount = data;
      });
    await fetch(
      "https://db.youbeon.eu/idee/filter/?ids=" +
        Object.getOwnPropertyNames(tempIdeasCount).toString(),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        tempIdeas = data;
      });
    tempIdeas.forEach((idea) => {
      idea._labelClass = "stuff";
      idea._color = this.selectedReligion[changedOne].color;
      idea._size = tempIdeasCount[idea.id] * 15;
    });
    this.selectedReligion[changedOne].ideas = tempIdeas;
    this.combineIntoNodeObject();
  }

  randomColor(brightness) {
    function randomChannel(brightness) {
      var r = 255 - brightness;
      var n = 0 | (Math.random() * r + brightness);
      var s = n.toString(16);
      return s.length == 1 ? "0" + s : s;
    }
    return (
      "#" +
      randomChannel(brightness) +
      randomChannel(brightness) +
      randomChannel(brightness)
    );
  }

  combineIntoNodeObject() {
    let objectforNodes: any[] = [];
    this.selectedReligion.forEach((religion) => {
      if (religion.religion !== undefined) {
        objectforNodes = objectforNodes.concat(religion.ideas);
      }
    });
    this.nodes = objectforNodes;
  }

  addReligionField(): void {
    this.selectedReligion.push({
      id: Math.random() * 100 + 1,
      religion: undefined,
      color: this.randomColor(125),
      ideas: {},
    });
  }

  removeReligionField(religionField) {
    const index = this.selectedReligion.indexOf(religionField);
    if (index > -1) {
      this.selectedReligion.splice(index, 1);
    }
    this.combineIntoNodeObject();
  }

  mounted() {
    const headers = { "Content-Type": "application/json" };
    fetch("https://db.youbeon.eu/religion/", { headers })
      .then((response) => response.json())
      .then((data) => {
        this.allReligions = data.filter((r: any) => {
          return this.selectableReligions.includes(r.name.toLowerCase());
        });
        this.selectedReligion = [
          {
            id: 0,
            color: this.randomColor(125),
            religion: undefined,
            ideas: {},
          },
        ];
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#network {
  margin-top: 5vh;
  border: 2px solid #b0dcd9;
  background-color: #e8c444;
  height: 70vh;
}

.vl {
  border-left: 2px solid #e5e5e5;
  height: 30px;
  margin-top: 7px;
}

.stuff {
  color: rgb(0, 0, 0);
}

.colorDisplay {
  float: right;
  width: 3px;
  height: 30px;
  margin: 10px;
  margin-right: 10px;
}
</style>
