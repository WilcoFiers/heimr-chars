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
