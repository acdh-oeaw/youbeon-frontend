<template>
  <vContainer>
    <h1>{{ msg }}</h1>
    <p></p>

    <v-btn
      text
      href="https://gitlab.com/acdh-oeaw/dboe/recherchetool-frontend"
      target="_blank"
    >
      <span class="mr-2">gitlab</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'Place',
})
export default class Place extends Vue {

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
</style>
