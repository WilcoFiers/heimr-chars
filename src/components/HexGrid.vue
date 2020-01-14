<template>
  <!-- eslint-disable vue-a11y/click-events-have-key-events -->
  <svg :width="grid.gridSize.width" :height="grid.gridSize.height">
    <svg
      v-for="(cell, cellKey) in grid.cells"
      :key="cellKey"
      :x="cell.top"
      :y="cell.left"
    >
      <a
        @click="activate(cellKey, $event)"
        @keydown="navigate"
        :ref="cellKey"
        :class="{ hexCell: true, activeCell: active === cellKey }"
        :tabindex="tabIndex(cellKey)"
        href="#"
        role="button"
      >
        <polygon :points="cell.hexPoints" />
        <template v-for="(str, i) in cellContents[cellKey]">
          <text
            :key="i"
            :x="cell.center"
            :y="cell.center + i * 20 - cellContents[cellKey].length * 10 + 10"
            text-anchor="middle"
            v-text="str"
          />
        </template>
      </a>
    </svg>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { NewGlyphCell } from "@/types";
import { GridCell, strToCoords, coordsToStr } from "@/heimr/AutomataGrid";

export default Vue.extend({
  name: "HexGrid",
  props: ["grid", "gridData"],
  data() {
    return { active: undefined as string | undefined };
  },
  computed: {
    cellContents(): { [propName: string]: string[] } {
      const gridData = this.gridData as { [propName: string]: NewGlyphCell };
      const cellPairs = Object.entries(gridData).map(
        ([key, { glyph, pick1, pick2 }]) => {
          const contents: string[] = [];
          if (glyph === "Create Inverse") {
            contents.push("Create", "Inverse");
          } else if (glyph && glyph.includes(" ")) {
            contents.push(glyph.split(" ")[0]);
          } else if (typeof glyph === "string") {
            contents.push(glyph);
          }

          if (pick1) {
            contents.push(pick1);
          }
          if (pick2) {
            contents.push(pick2);
          }
          return [key, contents];
        }
      );
      return Object.fromEntries(cellPairs);
    }
  },

  methods: {
    tabIndex(cellKey: string) {
      if (this.active === cellKey) {
        return 0;
      }
      if ((!this.active || !this.grid.cells[this.active]) && cellKey === "A0") {
        return 0;
      }
      return -1;
    },

    activate(cellKey: string, event?: Event) {
      if (this.active === cellKey) {
        this.$emit("select", cellKey);
      } else {
        this.active = cellKey;
        this.$emit("focus", cellKey);
      }
      if (event) {
        event.preventDefault();
      }
    },

    navigate(e: {
      key: string;
      preventDefault: () => {};
      stopPropagation: () => {};
    }) {
      let { x, y } = strToCoords(this.active || "A0");
      if (e.key === "ArrowRight") {
        x += 1;
      } else if (e.key === "ArrowLeft") {
        x -= 1;
      } else if (e.key === "ArrowDown") {
        y += 1;
      } else if (e.key === "ArrowUp") {
        y -= 1;
      } else {
        return; // Let default behaviour happen
      }
      const newCellKey = coordsToStr({ x, y });
      if (!this.grid.cells[newCellKey]) {
        return; // cell doesn't exist
      }

      // @ts-ignore
      this.$refs[newCellKey][0].focus();
      this.activate(newCellKey);
      e.preventDefault();
    }
  }
});
</script>

<style lang="scss" scoped>
.hexCell polygon {
  stroke: black;
  stroke-width: 2px;
  fill: rgba(0, 0, 0, 0);
}
.hexCell text {
  text-align: center;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 200, 0.3);
  display: block;
}
.hexCell.activeCell polygon {
  fill: rgba(0, 0, 0, 0.1);
}

.hexCell:focus {
  outline: none;
  polygon {
    fill: rgba(0, 0, 0, 0.25);
  }
}
</style>
