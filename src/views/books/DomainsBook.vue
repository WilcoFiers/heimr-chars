<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Heimr Domains</h1>
        <p>
          A domain is a collection of skills, items, conditions. Every domain
          has its own theme and challenges players in a different way.
          Characters usually have skills, conditions and items from two or three
          domains.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
        xl="4"
        v-for="domain in domainsMeta"
        :key="domain.domainName"
      >
        <v-card :to="domainRoute(domain)" height="100%">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title v-text="domain.domainName" />
              <v-card-subtitle v-text="domain.description" />
            </div>
            <v-avatar class="ma-4" size="60" tile>
              <v-img :src="domainImg(domain)" class="image" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { domainsMeta, domainImg, DomainMeta } from "@/heimr-data";
import { HeimrBook } from "@/types";

function domainRoute({ domainName }: DomainMeta): string {
  const kababName = domainName.replace(/\s/g, "-").toLowerCase();
  return `/books/domains/${kababName}`;
}

export const domainsBook: HeimrBook = {
  sectionName: "Heimr Domains",
  sectionPath: "domains",
  html: "string",
  subsections: domainsMeta.map(domain =>
    domainRoute(domain).replace("/books/", "")
  )
};

export default Vue.extend({
  name: "DomainsBook",
  data() {
    return { domainsMeta };
  },
  methods: { domainImg, domainRoute }
});
</script>

<style scoped>
.image {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 6px;
}
</style>
