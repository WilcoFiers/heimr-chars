<template>
  <v-container class="pb-0">
    <v-row>
      <v-col class="py-0">
        <v-toolbar dense>
          <v-btn icon exact :to="{ name: 'AutomataList' }">
            <!-- not yet implemented -->
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h1 class="title ma-0">
            <v-btn
              text
              @click="showEditTitle"
              v-if="!editTitle"
              class="title-button"
            >
              {{ automata ? automata.title : "" }}
              <v-icon small right>mdi-pencil</v-icon>
            </v-btn>

            <v-text-field
              v-else
              aria-label="document title"
              :value="automata.title"
              @blur="saveTitle"
              class="title-field"
              ref="titleField"
            />
          </h1>
          <v-spacer />
          <v-btn text disabled>
            <!-- not yet implemented -->
            <v-icon small left>mdi-arrow-down-bold</v-icon>Download
          </v-btn>
          <v-btn text disabled>
            <!-- not yet implemented -->
            <v-icon small left>mdi-share</v-icon>Share
          </v-btn>
          <v-btn text to="/books/domains/primordial-magic">
            <!-- not yet implemented -->
            <v-icon small left>mdi-help</v-icon>Help
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row class="flex-row-reverse">
      <v-col cols="12" lg="3">
        <v-card min-height="150">
          <v-card-text>
            <v-form v-if="activeCell">
              <v-autocomplete
                label="Glyph name"
                :items="glyphNames"
                :value="activeCell.glyph"
                @input="glyph => updateActive({ glyph })"
                @blur="saveGlyph"
                clearable
                autocomplete="off"
                ref="glyphField"
              />
              <v-text-field
                v-if="activeCell && pickFields[0]"
                :label="pickFields[0].label"
                :value="activeCell.pick1"
                @input="pick1 => updateActive({ pick1 })"
                @blur="savePick"
              />
              <v-text-field
                v-if="activeCell && pickFields[1]"
                :label="pickFields[1].label"
                :value="activeCell.pick2"
                @input="pick2 => updateActive({ pick2 })"
                @blur="savePick"
              />
            </v-form>
            <p v-else>No cell selected</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="9" class="text-center">
        <v-sheet class="pa-3" elevation="3">
          <div class="hexgrid-container">
            <HexGrid
              v-if="grid && gridData"
              :grid="grid"
              :gridData="gridData"
              @focus="focusCell"
              @select="$refs.glyphField.focus()"
            />
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { State, Automata, GlyphCell } from "@/types";
import HexGrid, { GridCell, Coords } from "@/heimr/AutomataGrid";
import { glyphCards } from "@/heimr-data";
import HexGridComp from "@/components/HexGrid.vue";

type PickField = {
  key: string;
  label: string;
  disabled: boolean;
  type: string;
};

type GridData = {
  [propName: string]: GlyphCell | undefined;
};

const cellDiameter = 85;
const borderWidth = 2;

export default Vue.extend({
  components: { HexGrid: HexGridComp },
  data() {
    return {
      editTitle: false as Boolean,
      glyphNames: glyphCards.map(({ name }) => name.split("<")[0].trim()),
      activeCellKey: undefined as undefined | string,
      gridData: undefined as GridData | undefined
    };
  },

  computed: {
    automata(): Automata | undefined {
      return (this.$store.state as State).automata.current;
    },

    gridCells(): GlyphCell[] | undefined {
      return (this.$store.state as State).automata.cells;
    },

    grid(): HexGrid | undefined {
      if (!this.automata) {
        return undefined;
      }
      const { width, height } = this.automata;
      const dimensions = { cellDiameter, borderWidth, width, height };
      return new HexGrid(dimensions);
    },

    activeCell(): GlyphCell | undefined {
      if (!this.activeCellKey || !this.gridData) {
        return undefined;
      }
      return this.gridData[this.activeCellKey];
    },

    pickFields(): PickField[] {
      if (!this.activeCell) {
        return [];
      }
      const glyphName = this.activeCell.glyph || "";
      const glyphSpec = glyphCards.find(glyph =>
        glyph.name.includes(glyphName)
      );
      const pickFields: PickField[] = [];

      if (!glyphName || !glyphSpec) {
        return pickFields;
      }
      let [, pick1, pick2] = glyphSpec.name.split("<");

      if (pick1) {
        pickFields.push({
          key: "pick1",
          label: "Pick the " + pick1.split(">")[0].trim(),
          type: "textfield",
          disabled: false
        });
      }

      if (pick2) {
        pickFields.push({
          key: "pick2",
          label: "Pick the " + pick2.split(">")[0].trim(),
          type: "textfield",
          disabled: false
        });
      }
      return pickFields;
    }
  },

  methods: {
    showEditTitle() {
      this.editTitle = true;
      setTimeout(() => {
        const textField = this.$refs.titleField as HTMLInputElement;
        textField.focus();
      }, 50);
    },

    async saveTitle({ target }: Event) {
      const { value } = (target as any) as { value: string };
      await this.$store.dispatch("updateAutomata", { title: value });
      this.editTitle = false;
    },

    focusCell(cellKey: string) {
      this.activeCellKey = cellKey;
      if (this.gridData && !this.activeCell) {
        this.$set(this.gridData, cellKey, {});
      }
    },

    updateActive(newValues: { [propName: string]: string | undefined }) {
      if (!this.activeCellKey || !this.gridData) {
        return;
      }
      const activeCell = this.gridData[this.activeCellKey];
      Object.entries(newValues).forEach(([key, value]) => {
        if (value !== undefined) {
          this.$set(activeCell, key, value);
        } else {
          this.$delete(activeCell, key);
        }
      });
    },

    saveGlyph() {
      if (!this.activeCell) {
        return;
      }
      const cellKey = this.activeCellKey;
      const glyphCell = this.activeCell;
      const glyphName = glyphCell.glyph || "";
      const glyphSpec = glyphCards.find(glyph =>
        glyph.name.includes(glyphName)
      );

      const pickFields: PickField[] = [];
      if (!glyphName || !glyphSpec) {
        this.updateActive({ pick1: undefined, pick2: undefined });
        return this.$store.dispatch("setGlyphCell", { cellKey });
      }

      const [, pick1, pick2] = glyphSpec.name.split("<");
      // TODO: Also delete if the valid is inappropriate for the field
      if (!pick1) {
        this.updateActive({ pick1: undefined, pick2: undefined });
      } else if (!pick2) {
        this.updateActive({ pick2: undefined });
      }

      return this.$store.dispatch("setGlyphCell", { cellKey, glyphCell });
    },

    savePick() {
      if (this.activeCell && this.activeCellKey) {
        return this.$store.dispatch("setGlyphCell", {
          cellKey: this.activeCellKey,
          glyphCell: this.activeCell
        });
      }
    }
  },

  watch: {
    gridCells: {
      immediate: true,
      handler(glyphCells: GlyphCell[] | undefined) {
        if (this.gridData || !glyphCells) {
          return; // This will only run once, after the initial load completes
        }
        const gridData: GridData = {};
        glyphCells.forEach(glyphCell => {
          gridData[glyphCell.id] = { ...glyphCell };
        });
        // Update all at once instead of having to do Vue.set:
        this.gridData = gridData;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.title-field {
  margin: 0 18px -22px;
}
.title-button {
  text-transform: none;
  font-size: 16px;
}
.hexgrid-container {
  max-height: calc(100vh - 190px);
  min-height: 300px;
  overflow: auto;
}
</style>
