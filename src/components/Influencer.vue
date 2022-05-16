<template>
  <vContainer>
    <v-card class="sticky-card" style="margin-top: 4vh">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            v-model="selectedInfluencer"
            :items="nodes"
            item-text="data.name"
            item-value="data.id"
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
      </v-row>
    </v-card>
    <div id="network">
      <v-btn fab small id="zoom_in" class="zoomies control">
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn
        fab
        small
        class="control zoomies"
        id="zoom_out"
        style="margin-top: 70px"
      >
        <v-icon>remove</v-icon>
      </v-btn>
      <v-btn
        :disabled="bigNetwork"
        style="margin-top: 120px"
        class="control heightButton"
        fab
        small
        @click="resetNetwork()"
      >
        <v-icon>home</v-icon>
      </v-btn>
    </div>
    <v-card v-if="influencerDetailed !== null" class="detailedView">
      <v-card-title>
        <v-row no-gutters>
          <v-col class="pa-0 ma-0 flex-grow-1">
            <div class="hoverLink" @click="openLinktoInsta(influencerDetailed)">
              {{ influencerDetailed.name }}
              <v-icon style="margin-left: 5px">link</v-icon>
            </div>
          </v-col>
          <v-col cols="2">
            <div style="right: 60px; position: fixed">
              <v-icon @click="influencerDetailed = null"> close </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle> {{ influencerDetailed.bemerkung }} </v-card-subtitle>
      <v-expansion-panels accordion flat hover style="margin-bottom:30px;">
        <v-expansion-panel>
          <v-expansion-panel-header>
            Verknüpfte Ideen:
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="idea in influencerDetailed.idee" v-bind:key="idea.id">
              <router-link
                class="hoverLink"
                tag="span"
                :to="{ name: 'idea', params: { idea_name: idea } }"
                >{{ idea }}</router-link
              >
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </vContainer>
</template>

<script lang="ts">
import * as d3 from "d3";
import { Component, Vue, Watch } from "vue-property-decorator";
import * as _ from "lodash";
import { dataStore } from "../store/data";

@Component({
  components: {},
  name: "Influencer",
})
export default class Influencer extends Vue {
  //Religion Variables
  selectedReligion: any = { id: 0, name: "Alle Accounts" };

  height = document.querySelector("#network")?.clientHeight;
  width = document.querySelector("#network")?.clientWidth;

  currentZoomLevel = d3.zoomIdentity;

  //network variables
  nodes: any = [];
  links: any = [];
  force = 400;

  bigNetwork = true;

  //Influencer Variables
  allInfluencer: any = [];
  allIdeas: any = [];
  // Array of currently visible Influencers
  listInfluencer: any = [];
  // Array of selected Influencer in autocomplete field
  selectedInfluencer: any = [];
  selectedInfluencerLength = 0;
  influencerDetailed: any = null;

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

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  openLinktoInsta(influencer) {
    window.open(influencer.link, "_blank");
  }

  async onNodeClick(event, node) {
    if (!node.children) {
      const headers = { "Content-Type": "application/json" };
      let tempInfluencerDetailed = node.data;
      if (!isNaN(Number(tempInfluencerDetailed.kategorie[0]))) {
        await fetch(
          "https://db.youbeon.eu/kategorie/filter/?ids=" +
            tempInfluencerDetailed.kategorie.toString(),
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
          "https://db.youbeon.eu/idee/filter/?ids=" +
            tempInfluencerDetailed.idee.toString(),
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
    } else {
      this.selectedInfluencer = [];
      this.bigNetwork = false;
      this.allInfluencer.forEach((religion) => {
        if (religion.name === node.name) {
          let tempHierarchy = d3.hierarchy(religion);
          this.nodes = tempHierarchy.descendants();
          this.links = tempHierarchy.links();
        }
      });
      this.allInfluencer[0].children.forEach((multipleIdea) => {
        if (
          multipleIdea.interviews.includes(node.name.split(" ")[0].slice(0, 4))
        ) {
          this.nodes.push(multipleIdea);
        }
      });
      this.generateNetwork(this.nodes, []);
    }
  }

  formatInfluencerIntoReligions(influencer: any) {
    let returnInfluencer = [
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
    influencer.forEach((tempInfluencer) => {
      if (tempInfluencer.interviews.length > 1) {
        returnInfluencer[0].children.push(tempInfluencer);
      } else {
        tempInfluencer.interviews.forEach((interview) => {
          switch (interview) {
            case "alev":
              returnInfluencer[1].children.push(tempInfluencer);
              break;
            case "kath":
              returnInfluencer[2].children.push(tempInfluencer);
              break;
            case "evan":
              returnInfluencer[3].children.push(tempInfluencer);
              break;
            case "evang":
              returnInfluencer[3].children.push(tempInfluencer);
              break;
            case "orth":
              returnInfluencer[4].children.push(tempInfluencer);
              break;
            case "musl":
              returnInfluencer[5].children.push(tempInfluencer);
              break;
            case "jued":
              returnInfluencer[6].children.push(tempInfluencer);
              break;
            case "sikh":
              returnInfluencer[7].children.push(tempInfluencer);
              break;
            default:
              console.log(tempInfluencer);
              console.log(
                "There are influencers with unknown religions over here dawg"
              );
              break;
          }
        });
      }
    });
    return returnInfluencer;
  }

  resetNetwork() {
    this.influencerDetailed = null;
    this.selectedInfluencer = [];
    this.bigNetwork = true;
    this.initialNetwork();
  }

  initialNetwork() {
    this.nodes = [];
    this.links = [];
    let religions: any[] = [];

    this.currentZoomLevel = d3.zoomIdentity
      .translate(
        this.width ? this.width / 2 - 100 : 800,
        this.height ? this.height / 2 : 300
      )
      .scale(0.17);

    this.allInfluencer.forEach((religion) => {
      let tempHierarchy = d3.hierarchy(religion);
      if (religion.name != "multiple") {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
        religions.push(religion);
      } else {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
      }
    });
    this.nodes.push(...religions);

    let numberOfNodes = this.nodes.length;
    this.nodes.forEach((node) => {
      if (node.data != undefined && node.data.interviews != undefined) {
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
            _color: "#AAA",
            thiccness: "2",
            target: target,
          });
        });
      }
    });
    this.generateNetwork(this.nodes, this.links);
  }

  @Watch("$route")
  startLoaded() {
    if (
      this.$route.params.account_id != undefined &&
      this.$route.params.account_id != ""
    ) {
      this.resetNetwork();
    }
    this.$nextTick(this.routeLoaded);
  }

  routeLoaded() {
    if (
      this.$route.params.account_id != undefined &&
      this.$route.params.account_id != ""
    ) {
      this.nodes.forEach(async (element) => {
        if (element.data != undefined) {
          if (element.data.id === this.$route.params.account_id) {
            this.selectedInfluencer = [];
            let tempInfluencerDetailed = element.data;
            if (!isNaN(Number(tempInfluencerDetailed.idee[0]))) {
              let filteredIdeas: any[] = [];
              this.allIdeas.forEach((idea) => {
                if (tempInfluencerDetailed.idee.includes(idea.id)) {
                  filteredIdeas.push(idea.name);
                }
              });
              tempInfluencerDetailed.idee = filteredIdeas;
            }
            this.influencerDetailed = tempInfluencerDetailed;
            this.selectedInfluencer.push(element.data.id);
            this.$route.params.account_id = "";
          }
        }
      });
    }
  }

  async mounted() {
    this.allInfluencer = this.formatInfluencerIntoReligions(
      dataStore.influencer
    );
    this.allIdeas = dataStore.ideen;
    this.initialNetwork();
    this.$router.onReady(() => this.routeLoaded());
  }

  determinePosition(node, width, height) {
    let returnValue = 0;
    if (width > height) {
      if (this.bigNetwork === false) {
        return width / 2;
      }
      if (node.data != undefined && node.data.interviews != undefined) {
        if (node.data.interviews.length > 1) {
          if (
            node.data.interviews.length === 2 &&
            node.data.interviews.includes("evan") &&
            node.data.interviews.includes("evang")
          ) {
            returnValue = this.coordinatesForcePoints[2].x;
          } else {
            returnValue = 700;
          }
        } else {
          switch (node.data.interviews[0]) {
            case "alev":
              returnValue = this.coordinatesForcePoints[0].x;
              break;
            case "kath":
              returnValue = this.coordinatesForcePoints[1].x;
              break;
            case "evan":
              returnValue = this.coordinatesForcePoints[2].x;
              break;
            case "evang":
              returnValue = this.coordinatesForcePoints[2].x;
              break;
            case "orth":
              returnValue = this.coordinatesForcePoints[3].x;
              break;
            case "musl":
              returnValue = this.coordinatesForcePoints[4].x;
              break;
            case "jued":
              returnValue = this.coordinatesForcePoints[6].x;
              break;
            case "sikh":
              returnValue = this.coordinatesForcePoints[5].x;
              break;
          }
        }
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
      if (this.bigNetwork === false) {
        return height / 2;
      }
      if (node.data != undefined && node.data.interviews != undefined) {
        if (node.data.interviews.length > 1) {
          if (
            node.data.interviews.length === 2 &&
            node.data.interviews.includes("evan") &&
            node.data.interviews.includes("evang")
          ) {
            returnValue = this.coordinatesForcePoints[2].y;
          } else {
            returnValue = 0;
          }
        } else {
          switch (node.data.interviews[0]) {
            case "alev":
              returnValue = this.coordinatesForcePoints[0].y;
              break;
            case "kath":
              returnValue = this.coordinatesForcePoints[1].y;
              break;
            case "evan":
              returnValue = this.coordinatesForcePoints[2].y;
              break;
            case "evang":
              returnValue = this.coordinatesForcePoints[2].y;
              break;
            case "orth":
              returnValue = this.coordinatesForcePoints[3].y;
              break;
            case "musl":
              returnValue = this.coordinatesForcePoints[4].y;
              break;
            case "jued":
              returnValue = this.coordinatesForcePoints[6].y;
              break;
            case "sikh":
              returnValue = this.coordinatesForcePoints[5].y;
              break;
          }
        }
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

  @Watch("selectedInfluencer")
  buildInfluencerNetworkObject() {
    if (
      this.selectedInfluencer.length > this.selectedInfluencerLength &&
      this.selectedInfluencer != null
    ) {
      let searchedNode;
      this.nodes.forEach((node) => {
        if (node.data) {
          if (
            node.data.id ===
            this.selectedInfluencer[this.selectedInfluencer.length - 1]
          ) {
            searchedNode = node;
          }
        }
      });
      if (searchedNode) {
        this.onNodeClick(null, searchedNode);
      } else {
        console.log("No Node was found for the selected Idea");
      }
    } else if (this.selectedInfluencer.length < this.selectedInfluencerLength) {
      this.influencerDetailed = null;
      //this.selectedInfluencer = null;
    }
    this.nodes.forEach((node) => {
      if (node.data) {
        if (this.selectedInfluencer.length > 0) {
          if (this.selectedInfluencer.includes(node.data.id)) {
            node.data._color = "#82c782";
          } else {
            node.data._color = "#dcfaf3";
          }
        } else {
          node.data._color = "#dcfaf3";
        }
      }
    });
    if (this.bigNetwork === true) {
      this.links.forEach((link) => {
        if (this.selectedInfluencer.length > 0) {
          if (this.selectedInfluencer.includes(link.source.data.id)) {
            link._color = "#000";
            link.thiccness = "3";
          } else {
            link._color = "#AAA";
            link.thiccness = "2";
          }
        } else {
          link._color = "#AAA";
          link.thiccness = "2";
        }
      });
    } else {
      this.links = [];
    }
    this.selectedInfluencerLength = this.selectedInfluencer.length;
    this.generateNetwork(this.nodes, this.links);
  }

  generateNetwork(nodes, links) {
    d3.selectAll("g").remove();

    this.height = document.querySelector("#network")?.clientHeight;
    this.width = document.querySelector("#network")?.clientWidth;

    // Let's list the force we wanna apply on the network
    const simulation = d3
      .forceSimulation(nodes) // Force algorithm is applied to nodes
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.index)
          .distance(0)
          .strength(0.01)
      )
      .force("charge", d3.forceManyBody().strength(-200)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      //.force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .force(
        "x",
        d3
          .forceX()
          .x((d) => {
            return this.determinePosition(d, this.width, 0);
          })
          .strength(0.1)
      )
      .force(
        "y",
        d3
          .forceY()
          .y((d) => {
            return this.determinePosition(d, 0, this.height);
          })
          .strength(0.1)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => (d.children ? 50 : 30))
      );

    let drag = (simulation) => {
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
        .attr("width", this.width)
        .attr("height", this.height);
    } else {
      svg = d3.select("svg");
    }

    const g = svg.append("g");
    const handleZoom = (e) =>
      g.attr("transform", e.transform, (this.currentZoomLevel = e.transform));
    const zoom = d3.zoom().on("zoom", handleZoom);
    svg.call(zoom).call(zoom.transform, this.currentZoomLevel);

    let link;
    // Initialize the links
    link = g
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke", (d) => d._color)
      .style("stroke-width", (d) => d.thiccness);

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
      .attr("fill", (d) =>
        d.children ? "#448A1C" : d._color ? d._color : d.data._color
      )
      .attr("stroke", (d) => (d.children ? "#000" : "#fff"))
      .attr("r", (d) => (d.children ? 40 : 20))
      .on("click", (d, i) => {
        this.onNodeClick(d, i);
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
        return d.children ? 50 : 25;
      })
      .style("font-size", (d) => {
        return d.children ? 14 / this.currentZoomLevel.k + "px" : 14;
      });

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

    d3.selectAll(".zoomies").on("click", (e) => {
      if (e.originalTarget.innerHTML === "add") {
        this.currentZoomLevel.k = this.currentZoomLevel.k * 1.3;
        svg.call(zoom).call(zoom.transform, this.currentZoomLevel);
      } else {
        this.currentZoomLevel.k = this.currentZoomLevel.k * 0.7;
        svg.call(zoom).call(zoom.transform, this.currentZoomLevel);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#network {
  max-width: 100%;
  margin-top: 5vh;
  border: 2px solid #b0dcd9;
  background-color: rgba(255, 125, 127, 0.5);
  height: 70vh;
}

.vl {
  border-left: 2px solid #e5e5e5;
  height: 30px;
  margin-top: 7px;
}

.control {
  position: absolute;
  margin: 20px;
  margin-left: 20px;
  z-index: 5;
}

.detailedView {
  border: 4px solid #b0dcd9 !important;
  position: absolute;
  max-height: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 450px;
  right: 30px;
  bottom: 30px;
}

#innitViewButton {
  position: absolute;
  right: 100px;
  top: 250px;
}

.hoverLink:hover {
  cursor: pointer;
}
</style>
