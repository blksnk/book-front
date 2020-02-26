<template>
  <img :id="id" @click="onClick" ref="img" :alt="alt || ''" />
</template>

<script>
import { loadImg } from "@/helpers/fetchers.js";
import { fadeIn } from "@/helpers/animation.js";

export default {
  name: "ImageLoader",
  props: ["src", "alt", "id", "tweenDuration", "click", "noAnimation"],
  methods: {
    onMount() {
      loadImg(this.src, this.$refs.img, this.onLoaded);
    },
    onLoaded() {
      if (!this.noAnimation) {
        this.$nextTick(() => {
          fadeIn(this.$refs.img, this.tweenDuration, "out");
        });
      }
      this.$nextTick(() => {
        this.$emit("loaded");
      });
    },
    onClick() {
      if (this.click) {
        this.click();
      }
    }
  },
  mounted() {
    this.onMount();
  },
  watch: {
    src(next, prev) {
      if (next !== prev) {
        this.onMount();
      }
    }
  }
};
</script>

<style>
.imageLoader {
  opacity: 0;
}
</style>
