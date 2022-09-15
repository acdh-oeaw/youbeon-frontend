<template>
  <vContainer>
    <div style="margin: 20px 0px 20px 0px" class="d-none d-sm-block">
      Auf dieser Ebene der YouBeOn Map sehen Sie die Ideen, die in den
      Interviews aufgekommen sind. Das YouBeOn Forscher*innen-Team hat diese
      Ideen gesammelt und benannt. Mit Zitaten aus den Interviews möchten wir
      Ihnen einen Eindruck vermitteln, was hinter diesen Benennungen steht. In
      der Mitte sehen Sie Ideen, die von Personen aus mehreren
      Religionstraditionen eingebracht wurden. Erkunden Sie wie Orte und
      Accounts durch Ideen miteinander verbunden sind.
    </div>
    <v-row no-gutters class="mt-2">
      <v-col class="pa-0 flex-grow-1">
        <v-card>
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
              deletable-chips
              hide-details
              label="Ideen durchsuchen nach..."
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
    <v-card
      v-if="ideaDetailed !== null"
      id="detailedView"
      class="d-none d-sm-block"
    >
      <v-card-title>
        <v-row no-gutters>
          <v-col class="pa-0 ma-0 flex-grow-1">
            <div id="detailedHeader">
              {{ ideaDetailed.name }}
            </div>
          </v-col>
          <v-col cols="2">
            <div style="right: 20px; position: absolute">
              <v-icon @click="ideaDetailed = null"> close </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle
        class="quotes"
        v-for="zitat in ideaDetailed.zitate"
        v-bind:key="zitat"
      >
        {{ zitat }}
      </v-card-subtitle>
      <v-card-text>
        <v-expansion-panels accordion flat hover>
          <v-expansion-panel v-if="ideaDetailed.accounts.length > 0">
            <v-expansion-panel-header id="detailedHeader">
              Verknüpfte Accounts
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                v-for="account in ideaDetailed.accounts"
                v-bind:key="account.id"
              >
                <router-link
                  class="hoverLink"
                  tag="span"
                  :to="{ name: 'account', params: { account_id: account.id } }"
                  >{{ account.name }}</router-link
                >
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="ideaDetailed.places.length > 0">
            <v-expansion-panel-header id="detailedHeader">
              Verknüpfte Orte
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="ort in ideaDetailed.places" v-bind:key="ort.id">
                <router-link
                  class="hoverLink"
                  tag="span"
                  :to="{ name: 'place', params: { ort_id: ort.id } }"
                  >{{ ort.bezeichnung }}</router-link
                >
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="ideaDetailed.idee.length > 0">
            <v-expansion-panel-header id="detailedHeader">
              Verknüpfte Ideen
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                @click="!selectedIdea.includes(idea) && selectedIdea.push(idea)"
                v-for="idea in ideaDetailed.idee"
                v-bind:key="idea.id"
              >
                <a style="cursor: pointer; color: rgba(0, 0, 0, 0.6)">{{
                  idea
                }}</a>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <v-bottom-sheet
      class="detailedViewMobile"
      v-if="ideaDetailed !== null"
      v-model="ideaDetailedBoolean"
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
              <div id="detailedHeader">
                {{ ideaDetailed.name }}
              </div>
            </v-col>
            <v-col cols="2">
              <div style="right: 20px; position: absolute">
                <v-icon @click="ideaDetailed = null"> close </v-icon>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <div
            class="quotes"
            style="margin-top: 0px"
            v-for="zitat in ideaDetailed.zitate"
            v-bind:key="zitat"
          >
            {{ zitat }}
          </div>
          <v-expansion-panels accordion flat hover>
            <v-expansion-panel v-if="ideaDetailed.accounts.length > 0">
              <v-expansion-panel-header id="detailedHeader">
                Verknüpfte Accounts
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  v-for="account in ideaDetailed.accounts"
                  v-bind:key="account.id"
                >
                  <router-link
                    class="hoverLink"
                    tag="span"
                    :to="{
                      name: 'account',
                      params: { account_id: account.id },
                    }"
                    >{{ account.name }}</router-link
                  >
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="ideaDetailed.places.length > 0">
              <v-expansion-panel-header id="detailedHeader">
                Verknüpfte Orte
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-for="ort in ideaDetailed.places" v-bind:key="ort.id">
                  <router-link
                    class="hoverLink"
                    tag="span"
                    :to="{ name: 'place', params: { ort_id: ort.id } }"
                    >{{ ort.bezeichnung }}</router-link
                  >
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="ideaDetailed.idee.length > 0">
              <v-expansion-panel-header id="detailedHeader">
                Verknüpfte Ideen
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  @click="selectedIdea.push(idea)"
                  v-for="idea in ideaDetailed.idee"
                  v-bind:key="idea.id"
                >
                  <a style="cursor: pointer; color: rgba(0, 0, 0, 0.6)">{{
                    idea
                  }}</a>
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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Component, Vue, Watch } from "vue-property-decorator";
import { dataStore } from "../store/data";
// eslint-disable-next-line
import * as d3 from "d3";

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
  keepDetail = false;

  //arrays for detailed View
  places: any[] = [];
  accounts: any[] = [];

  height: any = 800;
  width: any = 400;

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

  allReligions: any[] = [
    "alevitische Jugendliche",
    "katholische Jugendliche",
    "evangelische Jugendliche",
    "orthodoxe Jugendliche",
    "muslimische Jugendliche",
    "jüdische Jugendliche",
    "sikh Jugendliche",
  ];

  get ideaDetailedBoolean() {
    if (this.ideaDetailed != null) {
      return true;
    }
    return false;
  }

  set ideaDetailedBoolean(value) {
    if (value === false) {
      this.ideaDetailed = null;
    }
  }

  formatIdeasIntoReligions(ideas: any) {
    const returnIdeas = [
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
        const connectedInfo = this.getDataforFeature(searchedNode);
        this.ideaDetailed = {
          zitate: [...new Set(searchedNode.data.zitate)],
          name: searchedNode.data.name,
          accounts: connectedInfo.accounts,
          places: connectedInfo.places,
          idee: searchedNode.data.cooccurence,
        };
      } else {
        console.log("No Node was found for the selected Idea");
      }
    } else if (
      this.selectedIdea.length < this.selectedIdeaLength &&
      !this.keepDetail
    ) {
      this.ideaDetailed = null;
    }
    this.nodes.forEach((node) => {
      if (node.data) {
        if (this.selectedIdea.length > 0) {
          if (this.selectedIdea.includes(node.data.name)) {
            node.data._color = "#e4625e";
          } else {
            node.data._color = "#f4e2a3";
          }
        } else {
          node.data._color = "#f4e2a3";
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
    this.keepDetail = false;
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
    const tempZoom = this.currentZoomLevel;
    // set the dimensions and margins of the graph

    // Let's list the force we wanna apply on the network
    const simulation = d3
      .forceSimulation(nodes) // Force algorithm is applied to nodes
      .force(
        "link",
        d3
          .forceLink(links)
          // @ts-expect-error
          .id((d) => d.index)
          .distance(0)
          .strength(0.005)
      )
      .force("charge", d3.forceManyBody().strength(-250)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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
        d3.forceCollide().radius((d) => {
          console.log("node", d);
          // @ts-expect-error
          const name = d.name || d.data.name;
          const customRadius =
            [...name.split(" ")].sort((a, b) => b.length - a.length)[0].length *
            3;
          const weight = customRadius < 20 ? 20 : customRadius;
          // @ts-expect-error
          return d.children && this.allReligions.includes(name) ? 200 : weight;
        })
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
    // @ts-expect-error
    if (d3.select("svg")._groups[0][0] === null) {
      svg = d3
        .select("#network")
        .append("svg")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`);
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

    const node = groups
      .selectAll("circle")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", (d) =>
        d.children
          ? d.data
            ? this.allReligions.includes(d.data.name)
              ? "#E8C547"
              : "#e4625e"
            : this.allReligions.includes(d.name)
            ? "#E8C547"
            : "#e4625e"
          : d.data
          ? d.data._color
          : d._color
      )
      .attr("stroke", "#fff")
      .attr("r", (d) =>
        d.children
          ? d.data
            ? this.allReligions.includes(d.data.name)
              ? 150
              : 20
            : this.allReligions.includes(d.name)
            ? 150
            : 20
          : 20
      )
      .on("click", (d, i) => {
        this.onNodeClick(i);
      });

    const text = groups
      .selectAll("text")
      .data(function (d) {
        return [d];
      })
      .enter()
      .append("text")
      .html(function (d) {
        if (!d.children) {
          const words = (d.name || d.data.name).split(" ");
          if (words.length <= 1) {
            return (
              "<tspan x='0' dx='0' dy='0.3rem' text-anchor='middle' class='nodelabel'>" +
              words[0] +
              "</tspan>"
            );
          } else {
            // algorithm for best aesthetic
            let longestWord = [...words].sort((a, b) => b.length - a.length)[0]
              .length;
            if (longestWord < 8) longestWord = 8;
            const ret = [words[0]];

            for (let i = 1; i < words.length; i++) {
              if (
                ret[ret.length - 1].length + words[i].length <=
                longestWord + 2
              ) {
                ret[ret.length - 1] += " " + words[i];
              } else ret.push(words[i]);
            }
            console.log("words", words, ret);

            return ret
              .map(
                (word, i) =>
                  "<tspan x='0' dx='0' dy='" +
                  (i === 0 ? 0.7 - 0.5 * ret.length : 1) +
                  "rem' text-anchor='middle' class='nodelabel'>" +
                  word +
                  "</tspan>"
              )
              .join("");
          }
        } else {
          if (d.data) {
            if (
              [
                "alevitische Jugendliche",
                "katholische Jugendliche",
                "evangelische Jugendliche",
                "orthodoxe Jugendliche",
                "muslimische Jugendliche",
                "jüdische Jugendliche",
                "sikh Jugendliche",
              ].includes(d.data.name)
            ) {
              return (
                "<tspan x='0' dx='0' dy='-.2em' text-anchor='middle'>" +
                d.data.name.split(" ")[0] +
                "</tspan>" +
                "<tspan x='0' dy='1em' text-anchor='middle'>" +
                d.data.name.split(" ")[1] +
                "</tspan>"
              );
            } else {
              return d.data.name;
            }
          } else {
            if (
              [
                "alevitische Jugendliche",
                "katholische Jugendliche",
                "evangelische Jugendliche",
                "orthodoxe Jugendliche",
                "muslimische Jugendliche",
                "jüdische Jugendliche",
                "sikh Jugendliche",
              ].includes(d.name)
            ) {
              return (
                "<tspan x='0' dx='0' dy='-.2em' text-anchor='middle'>" +
                d.name.split(" ")[0] +
                "</tspan>" +
                "<tspan x='0' dy='1em' text-anchor='middle'>" +
                d.name.split(" ")[1] +
                "</tspan>"
              );
            } else {
              return d.name;
            }
          }
        }
      })
      .attr("dx", (d) =>
        d.children
          ? d.data
            ? this.allReligions.includes(d.data.name)
              ? -120
              : 25
            : this.allReligions.includes(d.name)
            ? -120
            : 25
          : 25
      )
      .attr("font-weight", (d) => (d.children ? 600 : 400))
      .on("click", (d, i) => {
        this.onNodeClick(i);
      })
      .style("font-size", (d) =>
        d.children
          ? d.data
            ? this.allReligions.includes(d.data.name)
              ? "2.5em"
              : 14
            : this.allReligions.includes(d.name)
            ? "2.5em"
            : 14
          : 14
      );
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
        // @ts-expect-error
        this.currentZoomLevel.k = this.currentZoomLevel.k * 1.3;
        svg.call(zoom).call(zoom.transform, this.currentZoomLevel);
      } else {
        // @ts-expect-error
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
    const placesWithIdea: any[] = [];
    const accountsWithIdea: any[] = [];
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
    this.keepDetail = true;
    if (feature.data) {
      const connectedInfo = this.getDataforFeature(feature);
      this.ideaDetailed = {
        zitate: [...new Set(feature.data.zitate)],
        name: feature.data.name,
        accounts: connectedInfo.accounts,
        places: connectedInfo.places,
        idee: feature.data.cooccurence,
      };
      this.bigNetwork = false;
      this.selectedIdea = [];
      this.nodes = [];

      const tempNodes = [];
      this.ideaNetworkPot.forEach((religion) => {
        if (religion.name != "multiple") {
          const tempHierarchy = d3.hierarchy(religion);
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
      const centerNode = feature;
      centerNode.children = [];
      this.nodes.push(centerNode);
      this.generateNetwork(this.nodes, []);
    } else {
      this.bigNetwork = false;
      this.selectedIdea = [];
      this.ideaNetworkPot.forEach((religion) => {
        if (religion.name === feature.name) {
          const tempHierarchy = d3.hierarchy(religion);
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
            const connectedInfo = this.getDataforFeature(element);
            this.ideaDetailed = {
              zitate: [...new Set(element.data.zitate)],
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
    const religions: any[] = [];

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.currentZoomLevel = d3.zoomIdentity
        .translate(this.width / 2 - 100, this.height / 2)
        .scale(0.13);
    } else {
      this.currentZoomLevel = d3.zoomIdentity
        .translate(this.width / 2 - 200, this.height / 2)
        .scale(0.25);
    }

    this.ideaNetworkPot.forEach((religion) => {
      const tempHierarchy = d3.hierarchy(religion);
      if (religion.name != "multiple") {
        this.nodes.push(...tempHierarchy.descendants().slice(1));
        religions.push(religion);
      }
    });
    this.nodes.push(...religions);

    const numberOfNodes = this.nodes.length;
    this.nodes.forEach((node) => {
      if (node.data != undefined) {
        //@ts-ignore
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
    this.height = document.querySelector("#network")?.clientHeight;
    this.width = document.querySelector("#network")?.clientWidth;
    this.accounts = dataStore.influencer;
    this.ideaNetworkPot = this.formatIdeasIntoReligions(dataStore.ideen);
    this.initialNetwork();
  }
}
</script>

<style>
#network {
  margin-top: 3vh;
  border: 5px solid #e8c547;
  background-color: whitesmoke;
  //background-color: #ffdb6b;
  height: 70vh;
}

#detailedHeader {
  font-family: "ChicagoFLF", Helvetica, Arial, sans-serif;
}

.quotes {
  font-style: italic;
  font-size: 13px;
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
.nodelabel {
  paint-order: stroke;
  stroke: #f4e2a3;
  stroke-width: 1.5px;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}

#innitViewButton {
  position: absolute;
  right: 100px;
  top: 250px;
}

#detailedView {
  border: 5px solid #e4625e !important;
  position: absolute;
  max-height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 450px;
  right: 30px;
  bottom: 30px;
}

.v-expansion-panel-header {
  padding: 0 !important;
}

.control {
  position: absolute !important;
  margin: 20px;
  margin-left: 20px;
  z-index: 5;
}

h1,
h2 {
  font-family: "ChicagoFLF", Helvetica, Arial, sans-serif;
}

.balls {
  border-radius: 50%;
  background-color: #e8c547;
  width: 2em;
  height: 2em;
  margin: 0.3em;
  float: left;
}

.colorDisplay {
  float: right;
  width: 3px;
  height: 30px;
  margin: 10px;
  margin-right: 10px;
}

@font-face {
  font-family: "ChicagoFLF";
  src: local("ChicagoFLF"), url(../fonts/ChicagoFLF.ttf) format("truetype");
}
</style>
