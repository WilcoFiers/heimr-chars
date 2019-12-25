<template>
  <HeimrLayout>
    <router-view></router-view>
  </HeimrLayout>
</template>

<script lang="ts">
import Vue from "vue";
import HeimrLayout from "@/components/HeimrLayout.vue";

export default Vue.extend({
  name: "HeimrChar",
  components: { HeimrLayout }
});
</script>

<style lang="scss">
@import "~vuetify/src/styles/main.sass";

html .v-application {
  h1 {
    @extend .display-1;
  }
  h2 {
    @extend .headline;
  }
  h3 {
    @extend .title;
    @extend .font-weight-regular;
  }
  h4 {
    @extend .subtitle-1;
  }
  h5 {
    @extend .subtitle-2;
  }
  h1,
  h2 {
    margin-bottom: 4px; // half .v-application p
  }
  h3,
  h4,
  h5 {
    line-height: 1;
  }

  li,
  dd,
  dt {
    padding: 0 0 3px 6px;
  }
  ul,
  ol,
  dl {
    margin-bottom: 13px;
    padding-left: 36px;
  }

  td,
  th {
    padding: 8px 16px;
  }
  th {
    @extend .font-weight-medium;
  }
  tr:nth-child(odd) {
    background: rgba(0, 0, 0, 0.06);
  }
  table {
    @extend .elevation-2;
    border-collapse: collapse;
    min-width: 30%;
    margin-bottom: 24px;
    // display: inline-block; // Ensure the elevation includes the caption
    background: white;
  }

  th {
    text-align: left;
    white-space: nowrap;
  }
  tr:hover {
    background: rgba(0, 0, 0, 0.12);
  }
  table > caption {
    @extend .title;
    border-bottom: solid 1px rgba(0, 0, 0, 0.4);
  }
}
</style>
