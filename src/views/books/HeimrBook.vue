<template>
  <v-container>
    <v-row>
      <v-col xl="9">
        <article v-html="html" />
        <ol>
          <li v-for="(subsection, i) in subsections" :key="i">
            <router-link :to="toRoute(subsection)">{{
              subsection.sectionName
            }}</router-link>
          </li>
        </ol>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col sm="4" xl="3">
        <v-btn v-if="previousSection" :to="toRoute(previousSection)" text>
          <v-icon left>mdi-arrow-left</v-icon>
          <span class="d-sm-none" v-text="'Back'" />
          <span
            class="d-none d-sm-block"
            v-text="previousSection.sectionName"
          />
        </v-btn>
      </v-col>
      <v-col sm="4" xl="3" class="text-center">
        <v-btn v-if="parentSection" :to="toRoute(parentSection)" text exact>
          <span class="d-none d-sm-block" v-text="parentSection.sectionName" />
          <span class="d-sm-none" v-text="'Up'" />
          <v-icon right>mdi-arrow-up</v-icon>
        </v-btn>
      </v-col>
      <v-col sm="4" xl="3" class="text-right">
        <v-btn v-if="nextSection" :to="toRoute(nextSection)" text>
          <span class="d-none d-sm-block" v-text="nextSection.sectionName" />
          <span class="d-sm-none" v-text="'Next'" />
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import bookData from "@/assets/heimr-books.json";
import { HeimrBook } from "@/types";
import { domainsBook } from "./DomainsBook.vue";
const ruleBooks = bookData.heimrBooks as HeimrBook[];

export default Vue.extend({
  name: "HeimrBook",
  computed: {
    bookSection(): HeimrBook | undefined {
      const pathMatch = this.$route.params.pathMatch.toLowerCase();
      return this.findSection(pathMatch);
    },

    html(): string {
      if (!this.bookSection) {
        // TODO: render 404 instead
        return `Could not find path`;
      }
      return this.bookSection.html;
    },

    subsections(): HeimrBook[] {
      if (!this.bookSection) {
        return [];
      }

      return this.bookSection.subsections.map(sectionPath => {
        const section = this.findSection(sectionPath);
        if (!section)
          throw new Error(`Unknown book section with path ${sectionPath}`);
        return section;
      });
    },

    parentSection(): HeimrBook | undefined {
      if (!this.bookSection) {
        return undefined;
      }
      const thisPath = this.bookSection.sectionPath;
      const parentSection = ruleBooks.find(book => {
        return book.subsections.some(sectionPath => sectionPath === thisPath);
      });
      if (!parentSection && thisPath.substr(0, 8) === "domains/") {
        return domainsBook;
      }
      return parentSection;
    },

    sectionIndex(): number {
      if (!this.bookSection || !this.parentSection) {
        return -1;
      }
      const thisPath = this.bookSection.sectionPath;
      return this.parentSection.subsections.findIndex(
        sectionPath => sectionPath === thisPath
      );
    },

    nextSection(): HeimrBook | undefined {
      if (!this.bookSection || !this.parentSection) {
        return undefined;
      }
      const nextSectionPath = this.parentSection.subsections[
        this.sectionIndex + 1
      ];
      return this.findSection(nextSectionPath);
    },

    previousSection(): HeimrBook | undefined {
      if (!this.bookSection || !this.parentSection) {
        return undefined;
      }
      const previousSectionPath = this.parentSection.subsections[
        this.sectionIndex - 1
      ];
      return this.findSection(previousSectionPath);
    }
  },

  methods: {
    findSection(sectionPath: string): HeimrBook | undefined {
      return ruleBooks.find(book => book.sectionPath === sectionPath);
    },
    toRoute(heimrBook: HeimrBook): string {
      return `/books/${heimrBook.sectionPath}`;
    }
  }
});
</script>
