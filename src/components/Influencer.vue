<template>
  <vContainer>
    <v-card class="sticky-card" style="margin-top: 4vh">
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
    <div id="network" />
    <v-card v-if="influencerDetailed !== null" class="detailedView">
      <v-card-title>
        <div class="hoverLink" @click="openLinktoInsta(influencerDetailed)">
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
        <u>Verknüpfte Ideen:</u>
        <br />
        <div v-for="idea in influencerDetailed.idee" v-bind:key="idea.id">
          {{ idea }}
        </div>
      </v-card-text>
    </v-card>
  </vContainer>
</template>

<script lang="ts">
import * as d3 from "d3";
import { Component, Vue, Watch } from "vue-property-decorator";
import * as _ from "lodash";

@Component({
  components: {},
  name: "Influencer",
})
export default class Influencer extends Vue {
  //Religion Variables
  religions: any = [];
  selectedReligion: any = { id: 0, name: "Alle Accounts" };

  //Influencer Variables
  allInfluencer: any = [];
  // Array of currently visible Influencers
  listInfluencer: any = [];
  // Array of selected Influencer in autocomplete field
  selectedInfluencer: any = [];
  influencerDetailed: any = null;

  gdp: any = [
    { country: "USA", value: 20.5 },
    { country: "China", value: 13.4 },
    { country: "Germany", value: 4.0 },
    { country: "Japan", value: 4.9 },
    { country: "France", value: 2.8 },
  ];

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

  force = 400;

  get options() {
    return {
      force: this.force,
      nodeSize: 50,
      fontSize: 14,
      linkWidth: 7,
      forces: {
        X: 0.2,
        Y: 0.5,
        ManyBody: true,
        Center: true,
      },
      nodeLabels: true,
    };
  }

  // will change color with better network software hopefully
  /**@Watch("selectedInfluencer")
  changeColorofSelectedInfluencer() {
    this.networkInfluencer.forEach((inf) => {
      inf._color = "#dcfaf3";
      if (this.selectedInfluencer.includes(inf)) {
        inf._color = "#8B008B";
      }
    });
  }**/

  //takes the selected Influences and transfroms them into an Object readable by d3
  buildInfluencerNetworkObject() {
    let networkInfluencer: any[] = [];
    this.force = 100;
    let links: any[] = [];
    let centerNode = {
      id: 0,
      name: this.selectedReligion.name,
      _size: 70,
      _color: "#b0dcd9",
    };
    if (this.selectedReligion.id != 0) {
      networkInfluencer = [centerNode];
      this.force = 3000;
    }
    this.listInfluencer.forEach((influencer) => {
      influencer._color = "#dcfaf3";
      if (networkInfluencer.includes(centerNode))
        links.push({
          source: 0,
          target: influencer.id,
        });
      networkInfluencer.push(influencer);
      if (!networkInfluencer.includes(centerNode)) {
        networkInfluencer = _.take(this.shuffle(networkInfluencer), 25);
      }
    });
    this.generateNetwork(networkInfluencer, links);
  }

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
    this.allInfluencer.forEach((i) => {
      i._cssClass = "nodeSpecific";
    });
    this.listInfluencer = this.allInfluencer;
    this.buildInfluencerNetworkObject();
    this.religions = fetchedData[1].filter((r: any) => {
      return this.selectableReligions.includes(r.name.toLowerCase());
    });
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
      .force("charge", d3.forceManyBody().strength(-this.force)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      //.force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .force("x", d3.forceX().x(width/(2/3.5)).strength(0.005))
      .force("y", d3.forceY().y(height/(3/2)).strength(0.02))
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
        simulation.force("charge").strength(-2);
        simulation.force("x").strength(0.0001);
        simulation.force("y").strength(0.0001);
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        simulation.force("charge").strength(-(localforce/10));
        simulation.force("x").strength(0.0001);
        simulation.force("y").strength(0.001);
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

    //zoom
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
      .attr("r", 20)
      .attr("cx", 0)
      .attr("cy", 0)
      .style("fill", function (d) {
        return d._color;
      })
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
        return d.name;
      })
      .attr("dx", 25)
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
        data.splice(0, 0, { id: 0, name: "Alle Accounts" });
      });

    return [influencer, religions];
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
