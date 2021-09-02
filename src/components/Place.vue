<template>
  <vContainer>
    <v-col class="pa-0 flex-grow-1 mr-7" style="margin-top: 40px">
      <v-autocomplete
        class="searchbar"
        chips
        v-model="selectedPlaces"
        :items="allReligions"
        item-text="properties.bezeichnung"
        item-value="id"
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
    <v-btn
      fab
      small
      class="zoom"
      @click="zoom = zoom - 1"
      style="margin-top: 30px"
    >
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn fab small class="zoom" @click="zoom = zoom + 1">
      <v-icon>add</v-icon>
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

      <l-geo-json :geojson="allPlaces" :options="options" />

      <div v-for="item in religionJSON" :key="item.id">
        <l-geo-json
          :geojson="displayLocations(item)"
          :options="optionsReligion"
          :optionsStyle="individualColor(item)"
        />
      </div>
    </l-map>
    <v-col class="pa-0 flex-grow-1 mr-7 listHeight">
      <map-legende id="legende" :religions="religionJSON" :places="geoPlaces">
      </map-legende>
    </v-col>
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
  religionJSON: any[] = [];
  allPlaces: any[] = [];

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

  individualColor(religion: any) {
    return {
      fillColor: religion.color,
    };
  }

  optionsReligion = {
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

  bindPopUpPlace() {
    return async (feature: any, layer: L.Layer): Promise<void> => {
      layer.bindPopup(
        `<div style="text-align:center;"> 
            ${feature.properties.bezeichnung}
            <hr style="margin-bottom: 5px"></hr>
         </div>
         <u>Kategorien:</u>
        ${_(feature.properties.kategorie)
          .take(feature.properties.kategorie.length)
          .map((d) => `<div >${d}</div>`)
          .value()
          .join("")}
        </br>
        <u>Ideen:</u>
        ${_(feature.properties.idee)
          .take(feature.properties.idee.length)
          .map((d) => `<div >${d}</div>`)
          .value()
          .join("")}
        `
      );
    };
  }

  @Watch("selectedPlaces")
  displayPlaces() {
    this.religionJSON = [];
    this.geoPlaces = [];
    this.placesJSON.forEach((place) => {
      if (this.selectedPlaces.includes(place.id)) {
        this.religionJSON.push(place);
      } else if (this.selectedPlaces.includes(place.properties.bezeichnung)) {
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
          tempReligion = {
            id: religion.id,
            religion: true,
            color: this.randomColor(110),
            properties: {
              bezeichnung: religion.name,
            },
          };
          this.allReligions.push(tempReligion);
        });
      });
    this.handlePlaceData(fetchedData[0], fetchedData[1], fetchedData[2]);
  }

  displayLocations(religion: any) {
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
        return data;
      });

    return [placesFetched, categoriesFetched, ideasFetched];
  }

  //receives the content of the json, with the places
  async handlePlaceData(allPlaces, allCategories, allIdeas) {
    let tempGeo: any[] = [];
    let counter = 0;
    allPlaces.forEach((item: any) => {
      let categories = this.getCorrespondingCategories(
        item.kategorie,
        allCategories
      );
      console.log(categories)
      let ideas = this.getCorrespondingIdeas(item.idee, allIdeas);
      console.log(ideas)
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
      } else {
        counter++;
      }
    });
    this.placesJSON = tempGeo.concat(this.allReligions);
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
    console.log(allIdeas, ideaIDs)
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
  right: 60px;
  bottom: 50px;
  float: right;
  z-index: 1;
  width: auto;
}

.listHeight {
  margin-top: 62vh;
}

/*
@media only screen and (max-width: 800px) {
  .listHeight {
    margin-top: 63vh;
  }
}

@media only screen and (max-width: 1200px) {
  .listHeight {
    max-height: 63vh;
  }
}

@media only screen and (max-width: 2000px) {
  .listHeight {
    max-height: 80vh;
  }
}
*/

.searchbar {
  z-index: 1;
}
</style>
