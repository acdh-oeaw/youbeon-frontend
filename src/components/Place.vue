<template>
  <vContainer>
    <v-card class="sticky-card mt-10 searchbar" outlined color="white)">
      <v-row no-gutters>
        <v-col class="pa-0 flex-grow-1">
          <v-autocomplete
            v-model="selectedPlaces"
            :items="autocompleteItems"
            item-text="properties.bezeichnung"
            item-value="properties"
            flat
            multiple
            solo
            deletable-chips
            small-chips
            text
            hide-details
            elevation="0"
            label="Suche..."
            prepend-inner-icon="search"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="pa-0 ma-0 d-none d-sm-block" cols="auto">
          <v-switch
            dense
            class="switch"
            v-model="filterNonReligionPlaces"
          ></v-switch>
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
                {{ selectedFilter.name }}
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
          :geojson="filterReligiousPlaces(displayLocationsIdea(item))"
          :options="optionsIdea"
          :optionsStyle="individualColor(item)"
        />
      </div>

      <div v-for="item in religionJSON" :key="item.id">
        <l-geo-json
          :geojson="filterReligiousPlaces(displayLocationsReligion(item))"
          :options="optionsReligion(item)"
        />
      </div>

      <div v-if="religionJSON.length > 1">
        <l-geo-json
          :geojson="
            filterReligiousPlaces(
              displayLocationsMultipleReligions(religionJSON)
            )
          "
          :options="optionsMultiple"
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
            <div style="right: 60px; position: fixed">
              <v-icon @click="placeDetailed = null"> close </v-icon>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle v-if="placeDetailed.bemerkung">
        {{ placeDetailed.bemerkung }}
      </v-card-subtitle>
      <v-card-text>
        <v-expansion-panels accordion flat hover>
          <v-expansion-panel style="background-color:rgba(0, 0, 0, 0.0)">
            <v-expansion-panel-header color="rgba(0, 0, 0, 0.0)">
              Verknüpfte Religionen:
            </v-expansion-panel-header>
            <v-expansion-panel-content color="rgba(0, 0, 0, 0.0)">
              <div
                v-for="religion in placeDetailed.religion"
                v-bind:key="religion.id"
              >
                {{ religion }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel style="background-color:rgba(0, 0, 0, 0.0)" v-if="placeDetailed.idee.length > 0">
            <v-expansion-panel-header color="rgba(0, 0, 0, 0.0)">
              Verknüpfte Ideen:
            </v-expansion-panel-header>
            <v-expansion-panel-content color="rgba(0, 0, 0, 0.0)">
              <div v-for="idea in placeDetailed.idee" v-bind:key="idea.id">
                <router-link
                  class="link"
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
import { dataStore } from "../store/data";
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
  filterNonReligionPlaces = false;

  religionJSON: any[] = [];
  ideaJSON: any[] = [];
  allPlaces: any[] = [];
  colorsMaybe: any[] = [];
  allColors = {
    "Christentum (orthodox)": ["#E5625E", "#f1a9a6"], //Red
    Islam: ["#424C55", "#8e9499"], // Grey
    Alevitentum: ["#623E88", "#a18bb8"], // Violet
    Judentum: ["#B4DCD2", "#d6ece6"], //Blue
    Sikhismus: ["#E8C547", "#f2df9a"], //yellow
    "Christentum (evangelisch)": ["#B57795", "#d6b4c5"], //Magenta
    "Katholisches Christentum": ["#698F3F", "#acc195"], //olive
  };

  selectableReligions: string[] = [
    "alle accounts",
    "alevitentum",
    "katholisches christentum",
    "christentum (evangelisch)",
    "christentum (orthodox)",
    "islam",
    "judentum",
    "sikhismus",
  ];

  displayNameReligions: any[] = [
    ["alevitentum", "alevitische Jugendliche"],
    ["katholisches christentum", "katholische Jugendliche"],
    ["christentum (evangelisch)", "evangelische Jugendliche"],
    ["christentum (orthodox)", "orthodoxe Jugendliche"],
    ["islam", "muslimische Jugendliche"],
    ["judentum", "jüdische Jugendliche"],
    ["sikhismus", "sikh Jugendliche"],
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
    this.selectedPlaces = [];
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

  optionsReligion(religion: any) {
    return {
      onEachFeature: this.bindPopUpPlace(),
      pointToLayer: (feature: any, latlng: any) => {
        let color;
        if (feature.properties.religiousPlace === true) {
          color = religion.color;
        } else {
          color = religion.nonreligionColor;
        }
        return L.circleMarker(latlng, {
          radius: 5,
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
          fillColor: color,
          color: "black",
        });
      },
    };
  }

  optionsMultiple = {
    onEachFeature: this.bindPopUpPlace(),
    pointToLayer: (feature: any, latlng: any) => {
      let color;
      if (feature.properties.religiousPlace === true) {
        color = "#8F7E4F";
      } else {
        color = "#c1b89e";
      }
      return L.circleMarker(latlng, {
        zIndexOffset: 1000,
        radius: 5,
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        color: "black",
        fillColor: color,
      });
    },
  };

  optionsIdea = {
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
      color = "#999";
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
          religion: this.turnInterviewIDintoReligion(
            feature.properties.religion
          ),
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
        if (typeof place.color === "string") {
          this.ideaJSON.push(place);
          let placesInIdea = this.allPlaces.filter((f: any) => {
            return f.properties.idee.includes(place.properties.bezeichnung);
          });
          let placesNotInVienna = placesInIdea.filter((place) => {
            //Vienna Coordinates
            let latitudeRangeVienna = [48.165, 48.258];
            let longitudeRangeVienna = [16.221, 16.524];
            return (
              place.geometry.coordinates[0] > longitudeRangeVienna[1] ||
              place.geometry.coordinates[0] < longitudeRangeVienna[0] ||
              place.geometry.coordinates[1] > latitudeRangeVienna[1] ||
              place.geometry.coordinates[1] < latitudeRangeVienna[0]
            );
          });
          if (placesNotInVienna.length === placesInIdea.length) {
            this.zoom = 3;
            this.center = defaultCenter;
          }
        }
      } else if (
        this.selectedPlaces.some((sel) => {
          return sel.bezeichnung === place.properties.bezeichnung;
        })
      ) {
        this.geoPlaces.push(place);
        let lastPlace = this.geoPlaces.filter((f: any) => {
          return (
            this.selectedPlaces[this.selectedPlaces.length - 1] === f.properties
          );
        });
        if (lastPlace.length > 0) {
          this.center = [
            lastPlace[0].geometry.coordinates[1],
            lastPlace[0].geometry.coordinates[0],
          ];
        }
      }
    });
    this.$nextTick(function () {
      this.zoom++;
      this.zoom--;
    });
  }

  get tileSetUrl(): string {
    return this.tileSets[this.selectedTileSet].url;
  }

  async created() {
    let fetchedData = await this.getDataFromServerAtCreated();

    let religionData = dataStore.religionen;

    let tempReligion;
    religionData.forEach((religion) => {
      let tempBezeichnung;
      if (this.selectableReligions.includes(religion.name.toLowerCase())) {
        this.displayNameReligions.forEach((displayReligion) => {
          if (displayReligion.includes(religion.name.toLowerCase())) {
            tempBezeichnung = displayReligion[1];
          }
        });
        var selColor = this.allColors[religion.name];
        tempReligion = {
          id: religion.id,
          color: selColor[0],
          nonreligionColor: selColor[1],
          properties: {
            name: religion.name,
            bezeichnung: tempBezeichnung,
            religion: true,
          },
        };
        this.allReligions.push(tempReligion);
      }
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

  filterReligiousPlaces(places) {
    if (this.filterNonReligionPlaces === true) {
      return places.features.filter((f: any) => {
        if (f.properties.religiousPlace === true) {
          return f;
        }
      });
    }
    return places;
  }

  //Ugly Method; if there is time => update it
  displayLocationsMultipleReligions(selectedReligions) {
    let selectedReligionPlaces = this.allPlaces.filter((f: any) => {
      return f.properties.religion.length > 1;
    });

    let returnedPlaces = selectedReligionPlaces.filter((place: any) => {
      let filteredPlaces = place.properties.religion.filter((f: any) => {
        return selectedReligions.some((religion) => {
          return (
            this.namesAreWeird(
              religion.properties.name.toLowerCase().substring(0, 4)
            ) === f.toLowerCase().split("-")[1].substring(0, 4)
          );
        });
      });
      let trimmedFilteredPlace: any[] = [];
      filteredPlaces.forEach((place) => {
        trimmedFilteredPlace.push(place.split("-")[1].substring(0, 4));
      });
      let uniqueFilteredPlaces = [...new Set(trimmedFilteredPlace)];
      return uniqueFilteredPlaces.length > 1;
    });

    return {
      features: returnedPlaces,
    };
  }

  displayLocationsReligion(religion: any) {
    let placesWithReligion = this.allPlaces.filter((f: any) => {
      if (f.properties != undefined && f.properties.religion != undefined) {
        let neueReligionsFormatierung = religion.properties.name.split("(");
        if (neueReligionsFormatierung.length > 1) {
          neueReligionsFormatierung = neueReligionsFormatierung[1];
        } else {
          neueReligionsFormatierung = neueReligionsFormatierung[0];
        }
        let value = f.properties.religion.findIndex(
          (item) =>
            this.namesAreWeird(
              neueReligionsFormatierung.toLowerCase().substring(0, 4)
            ) === item.toLowerCase().split("-")[1].substring(0, 4)
        );
        return value > -1;
      }
    });
    if (this.religionJSON.length > 1) {
      let placesWithMultipleReligions = this.displayLocationsMultipleReligions(
        this.religionJSON
      );
      placesWithReligion = placesWithReligion.filter(
        (n) => !placesWithMultipleReligions.features.includes(n)
      );
    }
    return {
      features: placesWithReligion,
    };
  }

  namesAreWeird(wrongName: string) {
    if (wrongName === "isla") {
      return "musl";
    } else if (wrongName === "jude") {
      return "jued";
    } else {
      return wrongName;
    }
  }

  getDataFromServerAtCreated() {
    let placesFetched = dataStore.orte;

    let categoriesFetched = dataStore.kategorien;

    let ideasFetched = dataStore.ideen;

    let tempIdea;
    let colors = randomColor({ count: ideasFetched.length });
    ideasFetched.forEach((idea, index) => {
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
          religion: item.interview,
          religiousPlace: item.religion[0] != undefined ? true : false,
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

  turnInterviewIDintoReligion(shortForm: string[]) {
    let longForm: any[] = [];
    shortForm.forEach((oneReligion) => {
      switch (oneReligion.split("-")[1]) {
        case "musl":
          longForm.push("Islam");
          break;
        case "orth":
          longForm.push("Christentum (orthodox)");
          break;
        case "kath":
          longForm.push("Katholisches Christentum");
          break;
        case "alev":
          longForm.push("Alevitentum");
          break;
        case "jued":
          longForm.push("Judentum");
          break;
        case "sikh":
          longForm.push("Sikhismus");
          break;
        case "evan":
          longForm.push("Christentum (evangelisch)");
          break;
      }
    });
    return [...new Set(longForm)];
  }

  @Watch("$route")
  startLoaded() {
    if (this.$route.params.ort_id != undefined) {
      this.selectedFilter = { id: 2, name: "Alle Orte" };
    }
    this.$nextTick(this.routeLoaded);
  }

  routeLoaded() {
    if (this.$route.params.ort_id != undefined) {
      this.autocompleteItems.forEach((item) => {
        if (this.$route.params.ort_id === item.properties.id) {
          this.selectedPlaces.push(item.properties);
          this.placeDetailed = {
            idee: item.properties.idee,
            religion: this.turnInterviewIDintoReligion(
              item.properties.religion
            ),
            name: item.properties.bezeichnung,
            bermerkung: item.properties.bemerkung,
          };
        }
      });
    }
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
  z-index: 5;
  clear: both;
  float: left;
}

.link:hover {
  cursor: pointer;
}

.categoryPopUps {
  margin: 3px;
  text-align: center;
  text-decoration: none !important;
}

.switch {
  margin: 13px 5px 0px 5px;
  padding: 0px;
}

#legende {
  transition: 0.5s;
  position: fixed;
  max-width: 350px;
  left: 60px;
  bottom: 30px;
  float: right;
  z-index: 1;
  width: auto;
}

.v-expansion-panel-header{
  padding: 0 !important;
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
  border: 5px solid #E4625E !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
  max-height: 50%;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  width: 450px;
  right: 30px;
  bottom: 30px;
}

.searchbar {
  z-index: 1;
}
</style>
