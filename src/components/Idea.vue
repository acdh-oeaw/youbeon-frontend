<template>
  <vContainer>
    <v-row no-gutters class="mt-2">
      <v-col class="pa-0 flex-grow-1">
        <v-card style="margin-top: 3vh">
          <v-row no-gutters>
            <v-autocomplete
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
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <div id="network" />
    <v-btn elevation="1" @click="resetNetwork" small id="innitViewButton">Reset</v-btn>
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
import { Component, Vue, Watch } from "vue-property-decorator";
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
  ideaNetworkPot: any[] = [];
  ideaDetailed: any = null;

  coordinatesForcePoints: any = [
    {
      x: 50,
      y: -500,
    },
    {
      x: 750,
      y: -900,
    },
    {
      x: 1450,
      y: -450,
    },
    {
      x: 1450,
      y: 700,
    },
    {
      x: 1000,
      y: 1000,
    },
    {
      x: -450,
      y: 100,
    },
    {
      x: 450,
      y: 800,
    },
    {
      x: -150,
      y: 100,
    },
  ];

  displayReligionsOrIdeas = false;

  allIdeas: any = [];
  //saves the COOCCURENCE of the selected Idea in an Array
  selectedIdeaCooccurence: any = null;
  bigNetwork = true;

  formatIdeasIntoReligions(ideas: any) {
    let returnIdeas = [
      {
        name: "multiple",
        children: [] as any,
      },
      {
        name: "alevitische Jugendliche",
        children: [] as any,
      },
      {
        name: "katholische Jugendliche",
        children: [] as any,
      },
      {
        name: "evangelische Jugendliche",
        children: [] as any,
      },
      {
        name: "orthodoxe Jugendliche",
        children: [] as any,
      },
      {
        name: "muslimische Jugendliche",
        children: [] as any,
      },
      {
        name: "jüdische Jugendliche",
        children: [] as any,
      },
      {
        name: "sikh Jugendliche",
        children: [] as any,
      },
    ];

    ideas.forEach((idea) => {
      if (idea.interviews.length > 1) {
        returnIdeas[0].children.push(idea);
      }
      switch (idea.interviews[0]) {
        case "alev":
          returnIdeas[1].children.push(idea);
          break;
        case "kath":
          returnIdeas[2].children.push(idea);
          break;
        case "evan":
          returnIdeas[3].children.push(idea);
          break;
        case "evang":
          returnIdeas[3].children.push(idea);
          break;
        case "orth":
          returnIdeas[4].children.push(idea);
          break;
        case "musl":
          returnIdeas[5].children.push(idea);
          break;
        case "jued":
          returnIdeas[6].children.push(idea);
          break;
        case "sikh":
          returnIdeas[7].children.push(idea);
          break;
        default:
          console.log("There are ideas with unknown religions over here dawg");
          break;
      }
    });

    return returnIdeas;
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

  determinePosition(node, width, height) {
    let returnValue = 0;
    if (width > height) {
      if (node.data != undefined) {
        returnValue = 700;
      } else {
        switch (node.name) {
          case "alevitische Jugendliche":
            returnValue = this.coordinatesForcePoints[0].x;
            break;
          case "katholische Jugendliche":
            returnValue = this.coordinatesForcePoints[1].x;
            break;
          case "evangelische Jugendliche":
            returnValue = this.coordinatesForcePoints[2].x;
            break;
          case "orthodoxe Jugendliche":
            returnValue = this.coordinatesForcePoints[3].x;
            break;
          case "muslimische Jugendliche":
            returnValue = this.coordinatesForcePoints[4].x;
            break;
          case "jüdische Jugendliche":
            returnValue = this.coordinatesForcePoints[6].x;
            break;
          case "sikh Jugendliche":
            returnValue = this.coordinatesForcePoints[5].x;
            break;
        }
      }
    } else {
      if (node.data != undefined) {
        returnValue = 0;
      } else {
        switch (node.name) {
          case "alevitische Jugendliche":
            returnValue = this.coordinatesForcePoints[0].y;
            break;
          case "katholische Jugendliche":
            returnValue = this.coordinatesForcePoints[1].y;
            break;
          case "evangelische Jugendliche":
            returnValue = this.coordinatesForcePoints[2].y;
            break;
          case "orthodoxe Jugendliche":
            returnValue = this.coordinatesForcePoints[3].y;
            break;
          case "muslimische Jugendliche":
            returnValue = this.coordinatesForcePoints[4].y;
            break;
          case "jüdische Jugendliche":
            returnValue = this.coordinatesForcePoints[6].y;
            break;
          case "sikh Jugendliche":
            returnValue = this.coordinatesForcePoints[5].y;
            break;
        }
      }
    }
    return returnValue;
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
          .forceLink(links)
          .id((d) => d.index)
          .distance(0)
          .strength(0.005)
      )
      .force("charge", d3.forceManyBody().strength(-200)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      //.force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .force(
        "x",
        d3
          .forceX()
          .x((d) => {
            return this.determinePosition(d, width, 0);
          })
          .strength(0.1)
      )
      .force(
        "y",
        d3
          .forceY()
          .y((d) => {
            return this.determinePosition(d, 0, height);
          })
          .strength(0.1)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => (d.children ? 50 : 20))
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
      .style("stroke-width", "2");

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
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", (d) => (d.children ? "#fff" : "#7D387D"))
      .attr("stroke", (d) => (d.children ? "#000" : "#fff"))
      .attr("r", (d) => (d.children ? 40 : 20))
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
        return d.data ? d.data.name : d.name;
      })
      .attr("dx", function (d) {
        return d.data ? 25 : 50;
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

  resetNetwork() {
    this.bigNetwork=false
    this.initialNetwork()
  }

  onNodeClick(feature) {
    if (feature.data) {
      this.ideaDetailed = {
        name: feature.data.name,
        idee: feature.data.cooccurence,
      };
    } else {
      this.bigNetwork = false;
      this.ideaNetworkPot.forEach((religion) => {
        if (religion.name === feature.name) {
          let tempHierarchy = d3.hierarchy(religion);
          this.nodes = tempHierarchy.descendants();
          this.links = tempHierarchy.links();
        }
      });
      this.ideaNetworkPot[0].children.forEach((multipleIdea) => {
        if (
          multipleIdea.interviews.includes(
            feature.name.split(" ")[0].slice(0, 4)
          )
        ) {
          this.nodes.push(multipleIdea);
        }
      });
      this.generateNetwork(this.nodes, this.links);
    }
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

  initialNetwork() {
    this.nodes = []
    this.links = []
    this.ideaNetworkPot.forEach((religion) => {
      let tempHierarchy = d3.hierarchy(religion);
      if (religion.name != "multiple") {
        this.nodes.push(religion);
      } else {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
      }
    });

    let numberOfNodes = this.nodes.length;
    this.nodes.forEach((node) => {
      if (node.data != undefined) {
        //@ts-ignore
        let linkArray: [number] = [];
        node.data.interviews.forEach((links) => {
          switch (links) {
            case "alev":
              linkArray.push(numberOfNodes - 7);
              break;
            case "kath":
              linkArray.push(numberOfNodes - 6);
              break;
            case "evan":
              linkArray.push(numberOfNodes - 5);
              break;
            case "evang":
              linkArray.push(numberOfNodes - 5);
              break;
            case "orth":
              linkArray.push(numberOfNodes - 4);
              break;
            case "musl":
              linkArray.push(numberOfNodes - 3);
              break;
            case "jued":
              linkArray.push(numberOfNodes - 2);
              break;
            case "sikh":
              linkArray.push(numberOfNodes - 1);
              break;
          }
        });
        linkArray.forEach((target) => {
          this.links.push({
            source: this.nodes.indexOf(node),
            target: target,
          });
        });
      }
    });

    this.$router.onReady(() => this.routeLoaded());
    this.generateNetwork(this.nodes, this.links);
  }

  mounted() {
    this.ideaNetworkPot = this.formatIdeasIntoReligions(dataStore.ideen);
    this.initialNetwork();
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

#innitViewButton{
  position: absolute;
  right: 100px;
  top: 250px;
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
