<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Domains</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          tempore alias nisi laudantium suscipit repellendus necessitatibus ea
          quisquam modi soluta cupiditate dolores voluptatem et molestias, omnis
          similique corrupti cumque. Natus!
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col :cols="4" v-for="domain in domains" :key="domain.domainName">
        <v-card :to="toDomain(domain)">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">{{
                domain.domainName
              }}</v-list-item-title>
              <v-list-item-subtitle
                >Greyhound divisely hello coldly
                fonwderfully</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-avatar tile size="80" color="grey">
              <v-img :src="domainImg(domain)" contain class="black" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domains, domainImg } from "@/heimr-data";
import { Domain } from "@/types";

export default Vue.extend({
  name: "DomainSelection",
  data() {
    return { domains };
  },
  methods: {
    toDomain({ domainName }: Domain): string {
      const domainUrl = domainName.toLowerCase().replace(/\s+/g, "_");
      const { charId } = this.$route.params;
      return `/characters/${charId}/domains/${domainUrl}`;
    },

    domainImg(domain: Domain): string {
      return domainImg(domain);
    }
  }
});
</script>
