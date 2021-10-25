<template>
  <vContainer>
    <v-card class="sticky-card mt-10 searchbar" outlined color="white)">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            chips
            v-model="selectedPlaces"
            :items="autocompleteItems"
            item-text="properties.bezeichnung"
            item-value="properties"
            clearable
            flat
            multiple
            solo
            text
            hide-details
            elevation="0"
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
                  {{ selectedFilter.name }}
                </template>
                <v-icon style="margin-left: 10px">expand_more</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                dense
                v-bind:key="item.id"
                v-for="item in filterChoices"
                @click="selectedFilter = item"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
    <v-btn
      fab
      small
      class="zoom"
      @click="zoom = zoom + 1"
      style="margin-top: 30px"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-slider
      style="z-index: 1; width: 100px; margin-top: 30px; margin-left: 70px"
      max="50"
      min="-50"
      color="#e4625c"
    ></v-slider>
    <v-btn fab small class="zoom" @click="zoom = zoom - 1">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn class="zoom" fab small @click="resetView()">
      <v-icon>home</v-icon>
    </v-btn>
    <v-btn class="zoom" fab small @click="zoomToMap()">
      <v-icon>map</v-icon>
    </v-btn>

    <l-map
      style="z-index: 0; position: absolute; left: 0; top: 0; right: 0"
      ref="map"
      :options="mapOptions"
      :zoom.sync="zoom"
      :center.sync="center"
    >
      <l-tile-layer
        v-if="tileSetUrl != ''"
        :url="tileSetUrl"
        :attribution="
          tileSets[selectedTileSet] && tileSets[selectedTileSet].attribution
            ? tileSets[selectedTileSet].attribution
            : ''
        "
      />

      <l-geo-json
        :geojson="allPlaces"
        :options="options"
        :optionsStyle="distanceVariableColor"
      />

      <l-geo-json :geojson="geoPlaces" :options="optionsAllItems" />

      <div v-for="item in ideaJSON" :key="item.id">
        <l-geo-json
          :geojson="displayLocationsIdea(item)"
          :options="optionsReligionIdea"
          :optionsStyle="individualColor(item)"
        />
      </div>

      <div v-for="item in religionJSON" :key="item.id">
        <l-geo-json
          :geojson="displayLocationsReligion(item)"
          :options="optionsReligionIdea"
          :optionsStyle="individualColor(item)"
        />
      </div>
    </l-map>
    <v-col class="pa-0 flex-grow-1 mr-7 listHeight">
      <map-legende
        id="legende"
        :religions="religionJSON"
        :places="geoPlaces"
        :ideas="ideaJSON"
      >
      </map-legende>
    </v-col>
    <v-card v-if="placeDetailed !== null" id="detailedView">
      <v-card-title>
        <v-row no-gutters>
          <v-col class="pa-0 ma-0 flex-grow-1">
            <div style="float: left">
              {{ placeDetailed.name }}
            </div>
          </v-col>
          <v-col cols="2">
            <div style="float: right">
              <v-icon @click="placeDetailed = null"> close </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle> {{ placeDetailed.bemerkung }} </v-card-subtitle>
      <v-card-text>
        <u>Verknüpfte Ideen:</u>
        <br />
        <div v-for="idea in placeDetailed.idee" v-bind:key="idea.id">
          {{ idea }}
        </div>
      </v-card-text>
    </v-card>
  </vContainer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LWMSTileLayer as LWmsTileLayer,
} from "vue2-leaflet";
import MapLegende from "./MapLegende.vue";
//@ts-ignore
import * as L from "leaflet";
import * as _ from "lodash";
import * as randomColor from "randomcolor";

const defaultCenter = [48.20849, 16.37208];
const defaultZoom = 13;

@Component({
  components: {
    MapLegende,
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
    LWmsTileLayer,
  },
  name: "Place",
})
export default class Place extends Vue {
  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
  };
  zoom: number = defaultZoom;
  center: number[] = defaultCenter;
  map: any = null;
  pointerSize = 5;

  tileSets = [
    {
      name: "Humanitarian Open Tiles",
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png ",
    },
    {
      name: "Minimal Ländergrenzen (hell)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    },
    {
      name: "Leer",
      url: "",
    },
  ];
  selectedTileSet = 0;
  geoPlaces: any[] = [];
  placesJSON: any[] = [];
  selectedPlaces: any[] = [];
  allReligions: any[] = [];
  allIdeas: any[] = [];
  placeDetailed: any = null;

  religionJSON: any[] = [];
  ideaJSON: any[] = [];
  allPlaces: any[] = [];
  colorsMaybe: any[] = [];
  allColors = [
    "#FF6347",
    "#FFA500",
    "#1E90FF",
    "#3CB371",
    "#6A5ACD",
    "#FFB6C1",
    "#DC143C",
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

  filterChoices = [
    { id: 0, name: "Religionen" },
    { id: 1, name: "Ideen" },
    { id: 2, name: "Alle Orte" },
  ];
  selectedFilter = { id: 0, name: "Religionen" };

  autocompleteItems: any[] = [];

  resetView() {
    this.zoom = defaultZoom;
    this.center = defaultCenter;
  }

  zoomToMap() {
    this.zoom = 3;
    this.center = defaultCenter;
  }

  @Watch("selectedFilter")
  changeautoFilter() {
    this.selectedPlaces = [];
    switch (this.selectedFilter.name) {
      case "Religionen":
        this.autocompleteItems = this.allReligions;
        break;
      case "Ideen":
        this.autocompleteItems = this.allIdeas;
        break;
      case "Alle Orte":
        this.autocompleteItems = this.allPlaces;
        break;
    }
  }

  individualColor(religion: any) {
    return {
      fillColor: religion.color,
    };
  }

  optionsReligionIdea = {
    onEachFeature: this.bindPopUpPlace(),
    pointToLayer: (feature: any, latlng: any) => {
      return L.circleMarker(latlng, {
        radius: 5,
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        color: "black",
      });
    },
  };

  optionsAllItems = {
    onEachFeature: this.bindPopUpPlace(),
    pointToLayer: (feature: any, latlng: any) => {
      return L.circleMarker(latlng, {
        radius: 5,
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: "#b0dcd9",
        color: "black",
      });
    },
  };

  options = {
    onEachFeature: this.bindPopUpPlace(),
    pointToLayer: (feature: any, latlng: any) => {
      return L.circleMarker(latlng, {
        radius: 5,
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: "white",
        color: "black",
      });
    },
  };

  get distanceVariableColor() {
    let color = "white";
    if (this.zoom < 6) {
      color = "#e4625c";
    }
    return {
      fillColor: color,
    };
  }

  bindPopUpPlace() {
    return async (feature: any, layer: L.Layer): Promise<void> => {
      layer.on("click", (e) => {
        this.placeDetailed = {
          idee: feature.properties.idee,
          name: feature.properties.bezeichnung,
          bermerkung: feature.properties.bemerkung,
        };
      });
    };
  }

  @Watch("selectedPlaces")
  displayPlaces() {
    this.religionJSON = [];
    this.geoPlaces = [];
    this.ideaJSON = [];
    this.placesJSON.forEach((place) => {
      if (
        this.selectedPlaces.some((sel) => {
          return (
            sel.bezeichnung === place.properties.bezeichnung &&
            sel.religion === true
          );
        })
      ) {
        this.religionJSON.push(place);
      } else if (
        this.selectedPlaces.some((sel) => {
          return (
            sel.bezeichnung === place.properties.bezeichnung &&
            sel.idea === true
          );
        })
      ) {
        this.ideaJSON.push(place);
      } else if (
        this.selectedPlaces.some((sel) => {
          return sel.bezeichnung === place.properties.bezeichnung;
        })
      ) {
        this.geoPlaces.push(place);
      }
    });
  }

  get tileSetUrl(): string {
    return this.tileSets[this.selectedTileSet].url;
  }

  async created() {
    let fetchedData = await this.getDataFromServerAtCreated();

    const headers = { "Content-Type": "application/json" };
    await fetch("https://db.youbeon.eu/religion/", { headers })
      .then((response) => response.json())
      .then((data) => {
        let tempReligion;
        data.forEach((religion) => {
          if (this.selectableReligions.includes(religion.name.toLowerCase())) {
            let selColor = _.sample(this.allColors);
            this.allColors.splice(this.allColors.indexOf(selColor), 1);
            tempReligion = {
              id: religion.id,
              color: selColor,
              properties: {
                bezeichnung: religion.name,
                religion: true,
              },
            };
            this.allReligions.push(tempReligion);
          }
        });
      });
    this.autocompleteItems = this.allReligions;
    this.handlePlaceData(fetchedData[0], fetchedData[1], fetchedData[2]);
  }

  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map;
    });
  }

  displayLocationsIdea(idea: any) {
    return {
      features: this.allPlaces.filter((f: any) => {
        return f.properties.idee.includes(idea.properties.bezeichnung);
      }),
    };
  }

  displayLocationsReligion(religion: any) {
    return {
      features: this.allPlaces.filter((f: any) => {
        return f.properties.religion === religion.id;
      }),
    };
  }

  async getDataFromServerAtCreated() {
    const headers = { "Content-Type": "application/json" };
    let placesFetched = await fetch("https://db.youbeon.eu/ort/", { headers })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    let categoriesFetched = await fetch("https://db.youbeon.eu/kategorie/", {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    let ideasFetched = await fetch("https://db.youbeon.eu/idee", { headers })
      .then((response) => response.json())
      .then((data) => {
        let tempIdea;
        let colors = randomColor({ count: data.length });
        data.forEach((idea, index) => {
          let placesFiltered = placesFetched.filter((p: any) => {
            return p.idee.includes(idea.id);
          });
          if (placesFiltered.length > 0) {
            tempIdea = {
              id: idea.id,
              color: colors[index],
              properties: {
                bezeichnung: idea.name,
                idea: true,
              },
            };
            this.allIdeas.push(tempIdea);
          }
        });
        return data;
      });

    return [placesFetched, categoriesFetched, ideasFetched];
  }

  //receives the content of the json, with the places
  async handlePlaceData(allPlaces, allCategories, allIdeas) {
    let tempGeo: any[] = [];
    allPlaces.forEach((item: any) => {
      let categories = this.getCorrespondingCategories(
        item.kategorie,
        allCategories
      );
      let ideas = this.getCorrespondingIdeas(item.idee, allIdeas);
      let tempPlace = {
        type: "Feature",
        properties: {
          id: item.id,
          bezeichnung: item.bezeichnung,
          bemerkung: item.bemerkung,
          idee: ideas,
          kategorie: categories,
          religion: item.religion[0],
        },
        geometry: {
          type: "Point",
          coordinates: [
            item.koordinate_l.replace(",", "."),
            item.koordinate_b.replace(",", "."),
          ],
        },
      };
      if (tempPlace.geometry.coordinates[0] !== "noData") {
        tempGeo.push(tempPlace);
      }
    });
    this.placesJSON = tempGeo.concat(this.allReligions);
    this.placesJSON = this.placesJSON.concat(this.allIdeas);
    this.allPlaces = tempGeo;
  }

  getCorrespondingCategories(categoryIDs: string[], allCategories: string[]) {
    let returnedCategories: any[] = [];
    allCategories.forEach((cat: any) => {
      if (categoryIDs.includes(cat.id)) {
        returnedCategories.push(cat.name);
      }
    });
    return returnedCategories;
  }

  getCorrespondingIdeas(ideaIDs: string[], allIdeas: string[]) {
    let returnedIdeas: any[] = [];
    allIdeas.forEach((idea: any) => {
      if (ideaIDs.includes(idea.id)) {
        returnedIdeas.push(idea.name);
      }
    });
    return returnedIdeas;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";

.zoom {
  margin: 5px;
  margin-top: 5px;
  z-index: 1;
  clear: both;
  float: left;
}

.categoryPopUps {
  margin: 3px;
  text-align: center;
}

#legende {
  transition: 0.5s;
  position: fixed;
  max-width: 350px;
  left: 60px;
  bottom: 50px;
  float: right;
  z-index: 1;
  width: auto;
}

.listHeight {
  margin-top: 62vh;
}

.vl {
  border-left: 2px solid #e5e5e5;
  height: 30px;
  margin-top: 10px;
}

#detailedView {
  border: 4px solid #b0dcd9 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
  position: absolute;
  width: 400px;
  right: 60px;
  bottom: 50px;
}

.searchbar {
  z-index: 1;
}
</style>
