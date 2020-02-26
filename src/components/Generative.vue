<template>
  <canvas id="generative-canvas" ref="canvas" resize></canvas>
</template>

<script>
import {
  setupPaper,
  initGenerativeArt,
  refreshGenerativeArt,
  generateRgbColor
} from "@/helpers/generativeArt.js";
import { rem } from "@/helpers/layout.js";

export default {
  name: "Generative",
  props: {
    activeTrackIndex: {
      type: Number
    }
  },
  data() {
    return {
      options: {
        minWidth: 1,
        maxWidth: 4,
        maxCount: 100,
        // margin: rem(),
        circle: {
          minCount: 1,
          maxCount: 3,
          minRadius: 2 * rem(),
          maxRadius: 8 * rem(),
          margin: 2 * rem()
        },
        border: {
          color: generateRgbColor(255, 255, 255),
          width: 1
        }
      }
    };
  },
  methods: {
    generate() {
      initGenerativeArt(this.$refs.canvas, this.options);
    },
    refresh() {
      refreshGenerativeArt(this.$refs.canvas, this.options);
    }
  },
  mounted() {
    setupPaper(this.$refs.canvas);
    this.generate();
  },
  watch: {
    activeTrackIndex() {
      this.refresh();
    }
  }
};
</script>

<style>
#generative-canvas {
  height: 100%;
  width: 100%;
}
</style>
