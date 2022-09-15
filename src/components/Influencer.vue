<template>
  <vContainer>
    <div style="margin: 20px 0px 20px 0px" class="d-none d-sm-block">
      Auf dieser Ebene der YouBeOn Map sehen Sie die Instagram-Accounts, von
      denen die Interviewteilnehmer*innen im Gespräch erzählt haben. Sie sind
      nach Religionstraditionen geclustert (das bedeutet, dass mindestens eine
      Person aus einer Tradition einem Account in diesem Cluster folgt). In der
      Mitte sehen Sie Accounts, denen Personen aus mehreren Religionstraditionen
      folgen. Erkunden Sie die Insta-Profile und die mit den Accounts
      assoziierten Ideen.
    </div>
    <v-card class="sticky-card" style="margin-top: 1vh; z-index: 1">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            v-model="selectedInfluencer"
            :items="nodes"
            @input="buildInfluencerNetworkObject()"
            item-text="data.name"
            item-value="data"
            clearable
            chips
            solo
            multiple
            deletable-chips
            text
            flat
            hide-details
            label="Accounts durchsuchen nach..."
            prepend-inner-icon="search"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card>
    <div id="network" class="network_mobile">
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
    <v-card
      v-if="influencerDetailed !== null"
      class="detailedView d-none d-sm-block"
    >
      <v-card-title>
        <v-row no-gutters>
          <v-col class="pa-0 ma-0 flex-grow-1">
            <div
              class="hoverLink"
              id="detailedHeader"
              @click="openLinktoInsta(influencerDetailed)"
            >
              {{ influencerDetailed.name }}
              <img id="instaLogo" src="@/assets/icons/camera.png" />
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
      <v-card-text>
        <v-expansion-panels accordion flat hover style="margin-bottom: 15px">
          <v-expansion-panel>
            <v-expansion-panel-header id="detailedHeader">
              Verknüpfte Ideen
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
      </v-card-text>
    </v-card>

    <v-bottom-sheet
      class="detailedViewMobile"
      v-if="influencerDetailed !== null"
      v-model="influencerDetailedBoolean"
      hide-overlay
      persistent
      no-click-animation
      scrollable
    >
      <v-card
        height="40vh"
        style="border-top: 5px solid #e4625e !important"
        class="d-flex d-sm-none"
      >
        <v-card-title>
          <v-row no-gutters>
            <v-col class="pa-0 ma-0 flex-grow-1">
              <div
                class="hoverLink"
                id="detailedHeader"
                @click="openLinktoInsta(influencerDetailed)"
              >
                {{ influencerDetailed.name }}
                <img id="instaLogo" src="@/assets/icons/camera.png" />
              </div>
            </v-col>
            <v-col cols="2">
              <div style="right: 30px; position: fixed">
                <v-icon @click="influencerDetailed = null"> close </v-icon>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels accordion flat hover style="margin-bottom: 15px">
            <v-expansion-panel>
              <v-expansion-panel-header id="detailedHeader">
                Verknüpfte Ideen
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  v-for="idea in influencerDetailed.idee"
                  v-bind:key="idea.id"
                >
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
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </vContainer>
</template>

<script lang="ts">
import * as d3 from "d3";
import { Component, Vue, Watch } from "vue-property-decorator";
import { dataStore } from "@/app/data";

@Component({
  components: {},
  name: "Influencer",
})
export default class Influencer extends Vue {
  //Religion Variables
  selectedReligion: any = { id: 0, name: "Alle Accounts" };

  height: any = 800;
  width: any = 400;

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

  get influencerDetailedBoolean() {
    if (this.influencerDetailed != null) {
      return true;
    }
    return false;
  }

  set influencerDetailedBoolean(value) {
    if (value === false) {
      this.influencerDetailed = null;
    }
  }

  async showNodeDetails(node) {
    const headers = { "Content-Type": "application/json" };
    const tempInfluencerDetailed = node.data;
    if (!isNaN(Number(tempInfluencerDetailed.kategorie[0]))) {
      await fetch(
        "https://db.youbeon.eu/kategorie/filter/?ids=" +
          tempInfluencerDetailed.kategorie.toString(),
        { headers }
      )
        .then((response) => response.json())
        .then((data) => {
          const tempKategorie: any[] = [];
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
          const tempIdee: any[] = [];
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

  onNodeClick(event, node) {
    if (!node.children) {
      this.selectedInfluencer = [node.data];
      this.buildInfluencerNetworkObject();
      this.showNodeDetails(node);
    } else {
      this.selectedInfluencer = [];
      this.bigNetwork = false;
      this.allInfluencer.forEach((religion) => {
        if (religion.name === node.name) {
          const tempHierarchy = d3.hierarchy(religion);
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
    const returnInfluencer = [
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
              console.error(
                "Encountered unknown account. This should not happen."
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
    const religions: any[] = [];

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.currentZoomLevel = d3.zoomIdentity
        .translate(this.width / 2 - 75, this.height / 2)
        .scale(0.1);
    } else {
      this.currentZoomLevel = d3.zoomIdentity
        .translate(this.width / 2 - 100, this.height / 2)
        .scale(0.17);
    }

    this.allInfluencer.forEach((religion) => {
      const tempHierarchy = d3.hierarchy(religion);
      if (religion.name != "multiple") {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
        religions.push(religion);
      } else {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
      }
    });
    this.nodes.push(...religions);

    const numberOfNodes = this.nodes.length;
    this.nodes.forEach((node) => {
      if (node.data != undefined && node.data.interviews != undefined) {
        // @ts-expect-error Ignore for now
        const linkArray: [number] = [];
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
            const tempInfluencerDetailed = element.data;
            if (!isNaN(Number(tempInfluencerDetailed.idee[0]))) {
              const filteredIdeas: any[] = [];
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
    this.height = document.querySelector("#network")?.clientHeight;
    this.width = document.querySelector("#network")?.clientWidth;
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
              returnValue = this.coordinatesForcePoints[3].x;
              break;
            case "evan":
              returnValue = this.coordinatesForcePoints[2].x;
              break;
            case "evang":
              returnValue = this.coordinatesForcePoints[2].x;
              break;
            case "orth":
              returnValue = this.coordinatesForcePoints[1].x;
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
            returnValue = this.coordinatesForcePoints[3].x;
            break;
          case "evangelische Jugendliche":
            returnValue = this.coordinatesForcePoints[2].x;
            break;
          case "orthodoxe Jugendliche":
            returnValue = this.coordinatesForcePoints[1].x;
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
              returnValue = this.coordinatesForcePoints[3].y;
              break;
            case "evan":
              returnValue = this.coordinatesForcePoints[2].y;
              break;
            case "evang":
              returnValue = this.coordinatesForcePoints[2].y;
              break;
            case "orth":
              returnValue = this.coordinatesForcePoints[1].y;
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
            returnValue = this.coordinatesForcePoints[3].y;
            break;
          case "evangelische Jugendliche":
            returnValue = this.coordinatesForcePoints[2].y;
            break;
          case "orthodoxe Jugendliche":
            returnValue = this.coordinatesForcePoints[1].y;
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

  //@Watch("selectedInfluencer")
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
            this.selectedInfluencer[this.selectedInfluencer.length - 1].id
          ) {
            searchedNode = node;
          }
        }
      });
      if (searchedNode) {
        this.showNodeDetails(searchedNode);
      } else {
        console.error("No node found for the selected idea.");
      }
    } else if (this.selectedInfluencer.length < this.selectedInfluencerLength) {
      this.influencerDetailed = null;
      //this.selectedInfluencer = null;
    }
    this.nodes.forEach((node) => {
      if (node.data) {
        if (this.selectedInfluencer.length > 0) {
          if (this.selectedInfluencer.includes(node.data)) {
            node.data._color = "#E4625E";
          } else {
            node.data._color = "#daeee8";
          }
        } else {
          node.data._color = "#daeee8";
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
          // @ts-expect-error Ignore for now
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
        // @ts-expect-error Ignore for now
        d3.forceCollide().radius((d) => (d.children ? 200 : 30))
      );

    const drag = (simulation) => {
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
    // @ts-expect-error Ignore for now
    if (d3.select("svg")._groups[0][0] === null) {
      svg = d3
        .select("#network")
        .append("svg")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`);
      //.attr("preserveAspectRatio", "xMinYMin meet")
    } else {
      svg = d3.select("svg");
    }

    const g = svg.append("g");
    const handleZoom = (e) =>
      g.attr("transform", e.transform, (this.currentZoomLevel = e.transform));
    const zoom = d3.zoom().on("zoom", handleZoom);
    svg.call(zoom).call(zoom.transform, this.currentZoomLevel);

    // Initialize the links
    const link = g
      .selectAll("line")
      .data(links)
      .join("line")
      .style("stroke", (d) => d._color)
      .style("stroke-width", (d) => d.thiccness);

    const groups = g
      .selectAll(".group")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "group");
    groups.exit().remove();
    groups
      .attr("transform", function (d) {
        const x = d.x * 20 + 50;
        const y = d.y + 20;
        return "translate(" + x + "," + y + ")";
      })
      .call(drag(simulation));

    groups
      .selectAll("circle")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", (d) =>
        d.children ? "#B4DCD2" : d._color ? d._color : d.data._color
      )
      .attr("stroke", "#fff")
      .attr("r", (d) => (d.children ? 150 : 20))
      .on("click", (d, i) => {
        this.onNodeClick(d, i);
      });

    groups
      .selectAll("text")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("text")
      .html(function (d) {
        if (!d.children) {
          if (d.data) {
            return d.data.name;
          } else {
            return d.name;
          }
        } else {
          if (d.data) {
            return (
              "<tspan x='0' dx='0' dy='-.2em' text-anchor='middle'>" +
              d.data.name.split(" ")[0] +
              "</tspan>" +
              "<tspan x='0' dy='1em' text-anchor='middle'>" +
              d.data.name.split(" ")[1] +
              "</tspan>"
            );
          } else {
            return (
              "<tspan x='0' dx='0' dy='-.2em' text-anchor='middle'>" +
              d.name.split(" ")[0] +
              "</tspan>" +
              "<tspan x='0' dy='1em' text-anchor='middle'>" +
              d.name.split(" ")[1] +
              "</tspan>"
            );
          }
        }
      })
      .attr("font-weight", (d) => (d.children ? 600 : 400))
      .attr("dx", function (d) {
        return d.children ? -120 : 25;
      })
      .style("font-size", function (d) {
        return d.children ? "2.3em" : 14;
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
        const x = d.x + 6;
        const y = d.y - 6;
        return "translate(" + x + "," + y + ")";
      });
    });

    d3.selectAll(".zoomies").on("click", (e) => {
      if (e.originalTarget.innerHTML === "add") {
        // @ts-expect-error Ignore for now
        this.currentZoomLevel.k = this.currentZoomLevel.k * 1.3;
        svg.call(zoom).call(zoom.transform, this.currentZoomLevel);
      } else {
        // @ts-expect-error Ignore for now
        this.currentZoomLevel.k = this.currentZoomLevel.k * 0.7;
        svg.call(zoom).call(zoom.transform, this.currentZoomLevel);
      }
    });
  }
}
</script>

<style scoped>
#network {
  max-width: 100%;
  margin-top: 3vh;
  border: 5px solid #b4dcd2;
  background-color: whitesmoke;
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
  border: 5px solid #e4625e !important;
  position: absolute;
  max-height: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 450px;
  right: 30px;
  bottom: 30px;
}

h1,
h2 {
  font-family: "ChicagoFLF", Helvetica, Arial, sans-serif;
}

#detailedHeader {
  font-family: "ChicagoFLF", Helvetica, Arial, sans-serif;
}

.balls {
  margin-top: 0.5em;
  border-radius: 50%;
  background-color: #b4dcd2;
  width: 2em;
  height: 2em;
  margin: 0.3em;
  float: left;
}

#instaLogo {
  height: 20px;
  width: 20px;
  margin-left: 10px;
}

#innitViewButton {
  position: absolute;
  right: 100px;
  top: 250px;
}

.v-expansion-panel-header {
  padding: 0 !important;
}

.hoverLink:hover {
  cursor: pointer;
}
</style>
