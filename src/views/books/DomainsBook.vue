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
              <v-card-title class="link" v-text="domain.domainName" />
              <v-card-subtitle v-text="domain.description" />
            </div>

            <v-avatar class="ma-4" size="60" tile>
              <IconImage :asset="domainImg(domain)" />
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
import IconImage from "@/components/IconImage.vue";

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
  components: { IconImage },
  data() {
    return { domainsMeta };
  },
  methods: { domainImg, domainRoute }
});
</script>

<style scoped>
.link {
  text-decoration: underline;
  text-decoration-color: rgba(0, 0, 0, 0.35);
}
.v-card--link:hover:before {
  opacity: 0.08;
}
</style>
