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
              v-if="displayReligionsOrIdeas"
              flat
              @input="getSelectedReligion(religionField.id)"
              v-model="religionField.religion"
              :items="allReligions"
              item-text="displayName"
              item-value="id"
              solo
              clearable
              hide-details
              label="Religionen filtern nach..."
              prepend-inner-icon="search"
            >
            </v-autocomplete>
            <v-autocomplete
              v-else
              flat
              v-model="selectedIdeaCooccurence"
              :items="allIdeas"
              item-text="name"
              item-value="cooccurence"
              solo
              clearable
              hide-details
              label="Ideen filtern nach..."
              prepend-inner-icon="search"
            >
            </v-autocomplete>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="!displayReligionsOrIdeas"
                  icon
                  style="margin-top: 7px"
                  v-bind="attrs"
                  v-on="on"
                  @click="addReligionField()"
                >
                  <v-icon>add_circle_outline</v-icon>
                </v-btn>
              </template>
              <span
                >Eine weitere Religion hinzufügen und die Schnittmenge
                bilden</span
              >
            </v-tooltip>
            <v-btn
              v-if="religionField.id !== 0"
              style="margin-top: 7px"
              icon
              @click="removeReligionField(religionField)"
            >
              <v-icon>remove_circle_outline</v-icon>
            </v-btn>
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
                      {{ displayReligionsOrIdeas ? "Religionen" : "Ideen" }}
                    </template>
                    <v-icon style="margin-left: 10px">expand_more</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="displayReligionsOrIdeas = true">
                    <v-list-item-title> Religionen </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="displayReligionsOrIdeas = false">
                    <v-list-item-title> Ideen </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <div
              :style="{ 'background-color': religionField.color }"
              class="colorDisplay"
            ></div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <div id="network" />
    <v-card v-if="ideaDetailed !== null" id="detailedView">
      <v-card-title>
        <v-row no-gutters>
          <v-col class="pa-0 ma-0 flex-grow-1">
            <div style="float: left">
              {{ ideaDetailed.name }}
            </div>
          </v-col>
          <v-col cols="2">
            <div style="right: 60px; position: fixed">
              <v-icon @click="ideaDetailed = null"> close </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle> {{ ideaDetailed.bemerkung }} </v-card-subtitle>
      <v-card-text>
        <u>Verknüpfte Ideen:</u>
        <div v-for="idea in ideaDetailed.idee" v-bind:key="idea.id">
          {{ idea }}
        </div>
      </v-card-text>
    </v-card>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { dataStore } from "../store/data";
// eslint-disable-next-line
import * as d3 from "d3";
import * as _ from "lodash";

@Component({
  components: {},
  name: "Idea",
})
export default class Idea extends Vue {
  dropDownItems: string[] = [];
  nodes: any = [];
  links: any = [];
  force = 300;
  allReligions: any[] = [];
  selectedReligion: any = [];
  ideaDetailed: any = null;

  allIdeas: any = [];
  //saves the COOCCURENCE of the selected Idea in an Array
  selectedIdeaCooccurence: any = null;

  //Boolean die festlegt ob im autocomplete Ideen oder Religionen angezeigt werden(Religionen = true)
  displayReligionsOrIdeas = true;

  selectableReligions: string[] = [
    "alevitentum",
    "katholisches christentum",
    "evangelisches christentum",
    "orthodoxes christentum",
    "islam",
    "judentum",
    "sikhismus",
  ];

  displayNameReligions: any[] = [
    ["alevitentum", "alevitische Jugendliche"],
    ["katholisches christentum", "katholische Jugendliche"],
    ["evangelisches christentum", "evangelische Jugendliche"],
    ["orthodoxes christentum", "orthodoxe Jugendliche"],
    ["islam", "muslimische Jugendliche"],
    ["judentum", "jüdische Jugendliche"],
    ["sikhismus", "sikh Jugendliche"],
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
      let nodeSize = 20;
      if (tempIdeasCount[idea.id] > 1) {
        nodeSize = 40;
      } else if (tempIdeasCount[idea.id] > 4) {
        nodeSize = 60;
      }
      idea._labelClass = "stuff";
      idea._color = this.selectedReligion[changedOne].color;
      idea._size = nodeSize;
    });
    this.selectedReligion[changedOne].ideas = tempIdeas;
    this.combineIntoNodeObjectReligion();
  }

  @Watch("selectedIdeaCooccurence")
  displayCooccurenceOfIdea() {
    if (this.selectedIdeaCooccurence != undefined) {
      this.combineIntoNodeObjectIdeas();
    }
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

  combineIntoNodeObjectReligion() {
    let intersection: any[] = [];
    let links: any[] = [];
    this.selectedReligion.forEach((religion) => {
      if (religion.religion !== undefined) {
        if (intersection.length === 0) {
          intersection = religion.ideas;
        } else {
          let ids: number[] = [];
          intersection.forEach((el) => {
            ids.push(el.id);
          });
          intersection = religion.ideas.filter((value: any) =>
            ids.includes(value.id)
          );
        }
      }
    });
    /**intersection.forEach((idea) => {
      let relevantCooc = intersection.filter((value: any) =>
        idea.cooccurence.includes(value.name)
      );
      relevantCooc.forEach((coocIdea) => {
        links.push({
          source: idea.id,
          target: coocIdea.id,
        });
      });
    });
    console.log(links);
    this.links = links;**/
    this.nodes = intersection;
    this.generateNetwork(this.nodes, this.links);
  }

  combineIntoNodeObjectIdeas() {
    let tempIdeas: any = [];
    this.allIdeas.forEach((idea) => {
      if (this.selectedIdeaCooccurence.includes(idea.name)) {
        idea._color = "#7D387D";
        idea._size = 20;
        tempIdeas.push(idea);
      }
    });
    this.nodes = tempIdeas;
    this.generateNetwork(this.nodes, []);
  }

  generateNetwork(nodes, links) {
    d3.selectAll("g").remove();
    // set the dimensions and margins of the graph
    let height;
    let width;

    height = document.querySelector("#network")?.clientHeight;
    width = document.querySelector("#network")?.clientWidth;

    // Let's list the force we wanna apply on the network
    const simulation = d3
      .forceSimulation(nodes) // Force algorithm is applied to nodes
      .force(
        "link",
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d) {
            return d.id;
          }) // This provide  the id of a node
          .links(links) // and this the list of links
      )
      .force(
        "link",
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d) {
            return d.id;
          }) // This provide  the id of a node
          .links(links) // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-this.force)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      //.force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .force(
        "x",
        d3
          .forceX()
          .x(width / 2)
          .strength(0.05)
      )
      .force(
        "y",
        d3
          .forceY()
          .y(height / 2)
          .strength(0.05)
      )
      .force(
        "collision",
        d3.forceCollide().radius(function (d) {
          return d.radius;
        })
      );

    let drag = (simulation) => {
      const localforce = this.force;
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    // append the svg object to the body of the page
    let svg;
    if (d3.select("svg")._groups[0][0] === null) {
      svg = d3
        .select("#network")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    } else {
      svg = d3.select("svg");
    }

    const g = svg.append("g");
    const handleZoom = (e) => g.attr("transform", e.transform);
    const zoom = d3.zoom().on("zoom", handleZoom);

    d3.select("svg").call(zoom);

    let link;
    // Initialize the links
    link = g
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke", "#aaa")
      .style("stroke-width", "5");

    var groups = g
      .selectAll(".group")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "group");
    groups.exit().remove();
    groups
      .attr("transform", function (d) {
        var x = d.x * 20 + 50;
        var y = d.y + 20;
        return "translate(" + x + "," + y + ")";
      })
      .call(drag(simulation));

    var node = groups
      .selectAll("circle")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("circle")
      .attr("r", function (d) {
        return d._size;
      })
      .attr("cx", 0)
      .attr("cy", 0)
      .style("fill", function (d) {
        return d._color;
      })
      .on("click", (d, i) => {
        this.onNodeClick(i);
      });

    var text = groups
      .selectAll("text")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("text")
      .text(function (d) {
        return d.name;
      })
      .attr("dx", function (d) {
        return d._size + 5;
      })
      .style("font-size", "14px");

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    simulation.on("tick", () => {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      groups.attr("transform", function (d) {
        var x = d.x + 6;
        var y = d.y - 6;
        return "translate(" + x + "," + y + ")";
      });
    });
  }

  onNodeClick(feature) {
    this.ideaDetailed = {
      name: feature.name,
      idee: feature.cooccurence,
    };
  }

  addReligionField(): void {
    this.selectedReligion.push({
      id: Math.random() * 100 + 1,
      religion: undefined,
      color: "#7D387D",
      ideas: {},
    });
  }

  removeReligionField(religionField) {
    const index = this.selectedReligion.indexOf(religionField);
    if (index > -1) {
      this.selectedReligion.splice(index, 1);
    }
    this.combineIntoNodeObjectReligion();
  }

  @Watch("$route")
  startLoaded() {
    this.$nextTick(this.routeLoaded);
  }

  routeLoaded() {
    if (this.$route.params.id != undefined) {
      this.displayReligionsOrIdeas = false;
      let idea = this.allIdeas.filter((obj) => {
        if (obj.name === this.$route.params.id) return obj;
      });
      this.selectedIdeaCooccurence = idea[0].cooccurence;
    }
  }

  async mounted() {
    let religionData = dataStore.religionen;
    this.allReligions = religionData.filter((r: any) => {
      return this.selectableReligions.includes(r.name.toLowerCase());
    });
    this.displayNameReligions.forEach((displayReligion) => {
      this.allReligions.forEach((allReligion) => {
        if (displayReligion.includes(allReligion.name.toLowerCase())) {
          allReligion.displayName = displayReligion[1];
        }
      });
    });
    this.selectedReligion = [
      {
        id: 0,
        color: "#7D387D",
        religion: undefined,
        ideas: {},
      },
    ];

    this.allIdeas = dataStore.ideen;
    let placeholderIdeas = _.take(this.shuffle(this.allIdeas), 25);
    placeholderIdeas.forEach((i) => {
      i._color = "#7D387D";
      i._size = 20;
    });
    this.nodes = placeholderIdeas;

    this.$router.onReady(() => this.routeLoaded());
    this.generateNetwork(this.nodes, this.links);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#network {
  margin-top: 5vh;
  border: 2px solid #b0dcd9;
  background-color: rgba(255, 219, 107, 0.5);
  //background-color: #ffdb6b;
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

#detailedView {
  border: 4px solid #b0dcd9 !important;
  position: absolute;
  max-height: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 450px;
  right: 30px;
  bottom: 30px;
}

.colorDisplay {
  float: right;
  width: 3px;
  height: 30px;
  margin: 10px;
  margin-right: 10px;
}
</style>
