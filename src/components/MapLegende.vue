<template>
  <vContainer>
    <div id="list_legy" v-if="religions.length > 0 || places.length > 0 || ideas.length > 0">
      <div style="text-align: center; width: fill">
        <b>Legende</b>
      </div>
      <v-list class="legend_items list" dense>
        <!--<v-list-item class="legend_items" v-if="places.length > 0">
          <v-list-item-content style="margin-right: 30px">
            <v-list-item-title>
              Individuell ausgewählte Orte
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-avatar color="#b0dcd9" size="20"></v-avatar>
          </v-list-item-action>
        </v-list-item>-->
        <v-list-item class="legend_items" v-if="religions.length > 1">
          <v-list-item-content style="margin-right: 30px">
            <v-list-item-title>
              Orte mit mehreren Religionen
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-avatar color="#967444" size="20"></v-avatar>
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          class="legend_items"
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
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: "MapLegende",
})
export default class MapLegende extends Vue {
  @Prop() public religions: any;
  @Prop() public places: any;
  @Prop() public ideas: any;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

.legend_items {
  background-color: rgba($color: #ddeeff, $alpha: 0) !important;
}

#list_legy {
  background-color: rgba($color: #fff, $alpha: 0.8);
  border: 2px solid #b0dcd9;
  padding: 5px;
  border-radius: 2.5px;
}
</style>
