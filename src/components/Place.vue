<template>
  <vContainer>
    <l-map
      style="z-index: 1; position: absolute; left: 0; top: 0; right: 0"
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
    </l-map>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LWMSTileLayer as LWmsTileLayer,
} from "vue2-leaflet";
//@ts-ignore
import * as L from "leaflet";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;

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
      name: "Minimal Ländergrenzen (dunkel)",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    },
    {
      name: "Leer",
      url: "",
    },
  ];
  selectedTileSet = 0;
  geojson:any[] = [];

  get tileSetUrl(): string {
    return this.tileSets[this.selectedTileSet].url;
  }

  created() {
    const headers = { "Content-Type": "application/json" };
    fetch("https://db.youbeon.eu/test/ort/", { headers })
      .then(response => response.json())
      .then(data => (this.handleData(data.total)));
  }

  //receives the content of the json, with the places
  handleData(data:any) {
    let tempGeo:any[] = []
    data.forEach((item:any) => {
      let coord_l_array = item.koordinate_l.split(',');
      let coord_b_array = item.koordinate_b.split(',');
      let tempPlace = {
        id: item.id,
        bezeichnung: item.bezeichnung,
        bemerkung: item.bemerkung,
        coordinates: [this.translateCoordinates(coord_b_array), this.translateCoordinates(coord_l_array)]
      }
      tempGeo.push(tempPlace)
    });
    this.geojson = tempGeo;
  }

  translateCoordinates(coord:string[]) {
    return ((Number(coord[2])/60)+Number(coord[1]))/60+Number(coord[0]);
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../node_modules/leaflet/dist/leaflet.css";
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
