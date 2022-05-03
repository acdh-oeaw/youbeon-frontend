<template>
  <vContainer>
    <v-row no-gutters class="mt-2">
      <v-col class="pa-0 flex-grow-1">
        <v-card style="margin-top: 3vh">
          <v-row no-gutters>
            <v-autocomplete
              flat
              chips
              v-model="selectedIdea"
              :items="nodes"
              item-text="data.name"
              item-value="cooccurence"
              solo
              multiple
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
        class="control"
        fab
        small
        @click="resetNetwork()"
      >
        <v-icon>home</v-icon>
      </v-btn>
    </div>
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
      <v-card-text v-if="ideaDetailed.accounts.length > 0">
        <u>Verknüpfte Accounts:</u>
        <div v-for="account in ideaDetailed.accounts" v-bind:key="account.id">
          <router-link
            class="hoverLink"
            tag="span"
            :to="{ name: 'account', params: { account_id: account.id } }"
            >{{ account.name }}</router-link
          >
        </div>
      </v-card-text>
      <v-card-text v-if="ideaDetailed.places.length > 0">
        <u>Verknüpfte Orte:</u>
        <div v-for="ort in ideaDetailed.places" v-bind:key="ort.id">
          <router-link
            class="hoverLink"
            tag="span"
            :to="{ name: 'place', params: { ort_id: ort.id } }"
            >{{ ort.bezeichnung }}</router-link
          >
        </div>
      </v-card-text>
      <v-card-text v-if="ideaDetailed.idee.length > 0">
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

  selectedIdeaLength = 0;

  //arrays for detailed View
  places: any[] = [];
  accounts: any[] = [];

  height = document.querySelector("#network")?.clientHeight;
  width = document.querySelector("#network")?.clientWidth;

  currentZoomLevel = d3.zoomIdentity;

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
  selectedIdea: any = [];
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

  @Watch("selectedIdea")
  buildInfluencerNetworkObject() {
    if (this.selectedIdea.length > this.selectedIdeaLength) {
      let searchedNode;
      this.nodes.forEach((node) => {
        if (node.data) {
          if (
            node.data.name === this.selectedIdea[this.selectedIdea.length - 1]
          ) {
            searchedNode = node;
          }
        }
      });
      if (searchedNode) {
        let connectedInfo = this.getDataforFeature(searchedNode);
        this.ideaDetailed = {
          name: searchedNode.data.name,
          accounts: connectedInfo.accounts,
          places: connectedInfo.places,
          idee: searchedNode.data.cooccurence,
        };
      } else {
        console.log("No Node was found for the selected Idea");
      }
    } else {
      this.ideaDetailed = null
    }
    this.nodes.forEach((node) => {
      if (node.data) {
        if (this.selectedIdea.length > 0) {
          if (this.selectedIdea.includes(node.data.name)) {
            node.data._color = "#82c782";
          } else {
            node.data._color = "#7D387D";
          }
        } else {
          node.data._color = "#7D387D";
        }
      }
    });
    if (this.bigNetwork === true) {
      this.links.forEach((link) => {
        if (this.selectedIdea.length > 0) {
          if (this.selectedIdea.includes(link.source.data.name)) {
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
    this.selectedIdeaLength = this.selectedIdea.length;
    this.generateNetwork(this.nodes, this.links);
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

  /*determinePosition(node, width, height) {
    let returnValue = 0;
    if (width > height) {
      if (this.bigNetwork === false) {
        //@ts-ignore
        return this.width / 2;
      }

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
      if (this.bigNetwork === false) {
        //@ts-ignore
        return this.height / 2;
      }
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
  }*/

  generateNetwork(nodes, links) {
    d3.selectAll("g").remove();
    let tempZoom = this.currentZoomLevel;
    // set the dimensions and margins of the graph
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
          .strength(0.005)
      )
      .force("charge", d3.forceManyBody().strength(-200)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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
        d3.forceCollide().radius((d) => (d.children ? 50 : 20))
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
        d.children ? "#fff" : d._color ? d._color : d.data._color
      )
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
        return d.children ? 50 : 25;
      })
      .style("font-size", function (d) {
        return d.children ? 14 / tempZoom.k + "px" : 14;
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

  resetNetwork() {
    this.ideaDetailed = null;
    this.selectedIdea = [];
    this.bigNetwork = true;
    this.initialNetwork();
  }

  getDataforFeature(idee) {
    let placesWithIdea: any[] = [];
    let accountsWithIdea: any[] = [];
    this.places.forEach((place) => {
      if (place.idee.includes(idee.data.id)) {
        placesWithIdea.push(place);
      }
    });
    this.accounts.forEach((account) => {
      if (account.idee.includes(idee.data.id)) {
        accountsWithIdea.push(account);
      }
    });
    return { places: placesWithIdea, accounts: accountsWithIdea };
  }

  onNodeClick(feature) {
    if (feature.data) {
      let connectedInfo = this.getDataforFeature(feature);
      this.ideaDetailed = {
        name: feature.data.name,
        accounts: connectedInfo.accounts,
        places: connectedInfo.places,
        idee: feature.data.cooccurence,
      };
      this.bigNetwork = false;
      this.selectedIdea = [];
      this.nodes = [];

      let tempNodes = [];
      this.ideaNetworkPot.forEach((religion) => {
        let tempReligion = religion.name;
        if (tempReligion === "evangelische Jugendliche") {
          if (
            feature.data.interviews.includes("evang") ||
            feature.data.interviews.includes("evan")
          ) {
            let tempHierarchy = d3.hierarchy(religion);
            //@ts-ignore
            tempNodes.push(...tempHierarchy.descendants());
          }
        } else if (tempReligion === "jüdische Jugendliche") {
          tempReligion = "jued";
        }
        if (feature.data.interviews.includes(tempReligion.substring(0, 4))) {
          let tempHierarchy = d3.hierarchy(religion);
          //@ts-ignore
          tempNodes.push(...tempHierarchy.descendants());
        }
      });
      tempNodes.forEach((idea) => {
        //@ts-ignore
        if (feature.data.cooccurence.includes(idea.data.name)) {
          this.nodes.push(idea);
        }
      });
      let centerNode = feature;
      centerNode.children = [];
      this.nodes.push(centerNode);
      this.generateNetwork(this.nodes, []);
    } else {
      this.bigNetwork = false;
      this.selectedIdea = [];
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
      this.links.forEach((link) => {
        link._color = "#aaa";
        link.thiccness = "2";
      });
      this.generateNetwork(this.nodes, []);
    }
  }

  @Watch("$route")
  startLoaded() {
    if (
      this.$route.params.idea_name != undefined &&
      this.$route.params.idea_name != ""
    ) {
      this.resetNetwork();
    }
    this.$nextTick(this.routeLoaded);
  }

  routeLoaded() {
    if (
      this.$route.params.idea_name != undefined &&
      this.$route.params.idea_name != ""
    ) {
      this.displayReligionsOrIdeas = false;
      this.nodes.forEach((element) => {
        if (element.data != undefined) {
          if (element.data.name === this.$route.params.idea_name) {
            this.selectedIdea = [];
            let connectedInfo = this.getDataforFeature(element);
            this.ideaDetailed = {
              name: element.data.name,
              accounts: connectedInfo.accounts,
              places: connectedInfo.places,
              idee: element.data.cooccurence,
            };
            this.selectedIdea.push(element.data.name);
            this.$route.params.idea_name = "";
          }
        }
      });
    }
  }

  initialNetwork() {
    this.nodes = [];
    this.links = [];
    let religions: any[] = [];

    this.currentZoomLevel = d3.zoomIdentity
      .translate(
        this.width ? this.width / 2 - 200 : 800,
        this.height ? this.height / 2 : 400
      )
      .scale(0.25);

    this.ideaNetworkPot.forEach((religion) => {
      let tempHierarchy = d3.hierarchy(religion);
      if (religion.name != "multiple") {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
        religions.push(religion);
      }
    });
    this.nodes.push(...religions);

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
            _color: "#AAA",
            thiccness: "2",
          });
        });
      }
    });

    this.$router.onReady(() => this.routeLoaded());
    this.generateNetwork(this.nodes, this.links);
  }

  mounted() {
    this.places = dataStore.orte;
    this.accounts = dataStore.influencer;
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

.hoverLink:hover {
  cursor: pointer;
}

.stuff {
  color: rgb(0, 0, 0);
}

#innitViewButton {
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

.control {
  position: absolute;
  margin: 20px;
  margin-left: 20px;
  z-index: 5;
}

.colorDisplay {
  float: right;
  width: 3px;
  height: 30px;
  margin: 10px;
  margin-right: 10px;
}
</style>
