<template>
  <div class="text-element" data-scroll :data-scroll-speed="speed || '1'">
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
    <transition name="fade">
      <div v-if="links" class="text-element-link-container">
        <span
          v-for="(link, index) in links"
          :key="'text-element-link-' + index"
        >
          <a
            class="text-element-link hover-underline cursor-pointer"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.title }}
          </a>
          <span v-if="index < links.length - 1" class="text-element-link-mdash">
            &mdash;
          </span>
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatParagraphs, replaceEmDash } from "../helpers/layout.js";

export default {
  name: "text-element",
  props: {
    title: {
      type: String,
      default: "Default Title"
    },
    paragraphs: {
      type: String,
      default: `Dolore commodo non ullamco dolore dolor sed cillum aliquip occaecat qui proident enim laborum irure irure dolor cupidatat in duis ut aliqua esse veniam dolor irure in labore id cupidatat adipisicing minim amet quis ut ad minim velit.

        Lorem ipsum culpa sunt non veniam consequat non voluptate nulla est incididunt.`
    },
    links: {
      type: Array
    },
    speed: {
      type: Number,
      default: 1
    }
  },
  computed: {
    formattedParagraphs() {
      return formatParagraphs(replaceEmDash(this.paragraphs));
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
  font-weight: 700;
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

.text-element-link-container {
  margin-top: 1rem;
  grid-column: 2 / 2;
}

.text-element-link {
  display: inline-block;
  color: var(--white);
  font-weight: 600;
  font-size: var(--font-size-small);
  z-index: 5;
}

.text-element-link-mdash {
  display: inline-block;
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--light-grey);
  margin: 0 0.2rem;
}
</style>
