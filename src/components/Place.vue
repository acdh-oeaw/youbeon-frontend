<template>
  <vContainer>
    <v-flex style="margin: 1% 5%" xs12>
      <v-autocomplete
        class="searchbar"
        chips
        v-model="selectedPlaces"
        :items="placesJSON"
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
    </v-flex>
    <v-btn fab small class="zoom" @click="zoom = zoom - 1">
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

      <l-geo-json :geojson="geoPlaces" :options="options" />
    </l-map>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LWMSTileLayer as LWmsTileLayer,
} from "vue2-leaflet";
//@ts-ignore
import * as L from "leaflet";
import * as _ from "lodash";

const defaultCenter = [48.20849, 16.37208];
const defaultZoom = 11;

@Component({
  components: {
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

  options = {
    onEachFeature: this.bindPopUpPlace(),
    pointToLayer: (feature: any, latlng: any) => {
      return L.circleMarker(latlng, {
        radius: 4,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5,
      });
    },
  };

  bindPopUpPlace() {
    return async (feature: any, layer: L.Layer): Promise<void> => {
      layer.bindPopup(
        `<div>  <u>${feature.properties.bezeichnung}</u>  </div>
        ${_(feature.properties.kategorie)
            .take(feature.properties.kategorie.length)
            .map((d) => `<div style="margin:3px; text-align:center;" >${d}</div>`)
            .value()
            .join("")}
        `
      );
    };
  }

  @Watch("selectedPlaces")
  displayPlaces() {
    this.geoPlaces = [];
    this.placesJSON.forEach((place) => {
      if (this.selectedPlaces.includes(place.properties.bezeichnung)) {
        this.geoPlaces.push(place);
      }
    });
  }

  get tileSetUrl(): string {
    return this.tileSets[this.selectedTileSet].url;
  }

  async created() {
    let fetchedData = await this.getDataFromServerAtCreated();
    this.handlePlaceData(fetchedData[0], fetchedData[1]);
  }

  async getDataFromServerAtCreated() {
    const headers = { "Content-Type": "application/json" };
    let placesFetched;
    await fetch("https://db.youbeon.eu/ort/", { headers })
      .then((response) => response.json())
      .then((data) => {
        placesFetched = data;
      });



    let categoriesFetched;
    await fetch("https://db.youbeon.eu/kategorie/", { headers })
      .then((response) => response.json())
      .then((data) => {
        categoriesFetched = data;
      });

    return [placesFetched, categoriesFetched];
  }

  //receives the content of the json, with the places
  handlePlaceData(allPlaces, allCategories) {
    let tempGeo: any[] = [];
    allPlaces.forEach((item: any) => {
      let categories = this.getCorrespondingCategories(
        item.kategorie,
        allCategories
      );
      let coord_l_array = item.koordinate_l.split(",");
      let coord_b_array = item.koordinate_b.split(",");
      let tempPlace = {
        type: "Feature",
        properties: {
          id: item.id,
          bezeichnung: item.bezeichnung,
          bemerkung: item.bemerkung,
          kategorie: categories,
        },
        geometry: {
          type: "Point",
          coordinates: [
            this.translateCoordinates(coord_l_array),
            this.translateCoordinates(coord_b_array),
          ],
        },
      };
      tempGeo.push(tempPlace);
    });
    this.placesJSON = tempGeo;
  }

  getCorrespondingCategories(categoryIDs: string[], allCategories: string[]) {
    let returnedCategories: any[] = [];
    allCategories.forEach((cat: any) => {
      if (String(cat.id) === String(categoryIDs)) {
        returnedCategories.push(cat.name);
      }
    });
    return returnedCategories;
  }

  translateCoordinates(coord: string[]) {
    return (Number(coord[2]) / 60 + Number(coord[1])) / 60 + Number(coord[0]);
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

.categoryPopUps{
  margin:3px;
  text-align: center;
}

.searchbar {
  z-index: 1;
}
</style>
