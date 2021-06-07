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
    <SnackbarSwitch></SnackbarSwitch>
    <DarkmodeSwitch></DarkmodeSwitch>
  </vContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'Ideen',
})
export default class Ideen extends Vue {
  @Prop(String) readonly msg: String | undefined;


  // lifecycle hook
  mounted() {
  }

  created() {
  }

  beforeCreate() {
    // this.l.log('ShowCaseComponent before created');
    // this.l.log(`beforecreated:\n\t${this.getImporvedMessage}`); // undefined
    // this.l.log(this.message); // also undefined
  }

  updated() {
  }

  destroyed() {
  }
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
