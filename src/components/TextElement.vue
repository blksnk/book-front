<template>
  <div
    class="text-element"
    data-scroll
    :data-scroll-speed="speed"
    data-scroll-offset="-100%"
  >
    <transition name="fade">
      <span class="text-element-title">{{ title }}</span>
    </transition>
    <transition name="fade">
      <div class="text-element-paragraph-container">
        <p
          class="text-element-paragraph"
          v-for="(paragraph, index) in formattedParagraphs"
          v-bind:key="paragraph + index"
        >
          {{ paragraph }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatParagraphs } from "../helpers/layout.js";

export default {
  name: "text-element",
  props: {
    title: {
      type: String,
      default: "Default Title"
    },
    paragraphs: {
      type: String,
      default: "default paragraph"
    },
    speed: {
      type: Number,
      default: 1
    }
  },
  computed: {
    formattedParagraphs() {
      return formatParagraphs(this.paragraphs);
    }
  }
};
</script>

<style>
.text-element {
  display: grid;
  grid-template-columns: 8rem 16rem;
  grid-auto-rows: auto;
  margin-right: 8rem;
  margin-bottom: 4rem;
  z-index: 5;
}

.text-element-title {
  color: var(--white);
  font-weight: 800;
  font-size: var(--font-size-small);
  grid-column: 1 / 1;
  z-index: 5;
}

.text-element-paragraph-container {
  grid-column: 2 / 2;
  z-index: 5;
}

.text-element-paragraph {
  color: var(--light-grey);
  font-weight: 500;
  font-size: var(--font-size-small);
  margin-bottom: 1rem;
  z-index: 5;
}

.text-element-paragraph:last-child {
  margin-bottom: 0;
}
</style>
