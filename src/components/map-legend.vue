<template>
  <vContainer>
    <div class="list-legend" v-if="religions.length > 0 || places.length > 0 || ideas.length > 0">
      <div style="width: fill; text-align: center">
        <b>Legende</b>
      </div>
      <v-list class="legend-items list" dense>
        <v-list-item class="legend-items" v-if="religions.length > 1">
          <v-list-item-content style="margin-right: 30px">
            <v-list-item-title> Orte mit mehreren Religionen </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-avatar color="#425C66" size="20"></v-avatar>
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          class="legend-items"
          v-for="item in religions.concat(ideas).concat(places)"
          :key="item.id"
        >
          <v-list-item-content style="margin-right: 30px">
            <v-list-item-title>
              {{ item.properties.bezeichnung }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-avatar v-if="places.length > 0" color="#b0dcd9" size="20"></v-avatar>
            <v-avatar v-else :color="item.color" size="20"></v-avatar>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </vContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {},
  name: 'MapLegend',
})
export default class MapLegend extends Vue {
  @Prop() public religions: any
  @Prop() public places: any
  @Prop() public ideas: any
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  padding: 0;
  list-style-type: none;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.list-legend {
  padding: 5px;
  border: 2px solid #b0dcd9;
  border-radius: 2.5px;
  background-color: hsl(0deg 0% 100% / 80%);
}

.legend-items {
  background-color: hsl(210deg 100% 93% / 0%) !important;
}
</style>
