<template>
  <section id="exp-page">
    <div id="exp-left" ref="left">
      <text-element
        title="What is this?"
        :paragraphs="
          `
        I like to explore various concepts and design ideas during my free time. The easiest way for me to do so is by creating simple web pages, allowing me to efficiently put my ideas into practice.
        You'll find  some of the experiments I've created over the past year.
        This list is regularly updated with new content.
      `
        "
      />
      <h3>experiments</h3>
      <hr />
      <a
        v-for="(exp, index) in siteData.exp"
        :key="'exp-link' + index"
        :href="exp.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 class="fill-hover">
          {{ exp.title }}
        </h2>
      </a>
    </div>

    <div id="exp-right" ref="right">
      <image-loader
        v-for="(exp, index) in siteData.exp"
        :src="exp.thumbnail.url"
        :key="'exp-img-' + index"
        v-on:loaded="loadedCount++"
        :class="`exp-img ${generateImgSize(index)}`"
        alt=""
      />
    </div>
  </section>
</template>

<script>
import { initLS, wHeight, wWidth, rem } from "@/helpers/layout.js";
import gsap from "gsap";
import ImageLoader from "@/components/ImageLoader.vue";
import TextElement from "@/components/TextElement.vue";
export default {
  name: "Experiments",
  components: {
    "image-loader": ImageLoader,
    "text-element": TextElement
  },
  props: {
    siteData: {
      type: Object
    },
    setCameraTo: {
      type: Function
    },
    setActiveMeshAsTransparentWireframe: {
      type: Function
    },
    currentXOffset: {
      type: Number,
      default: 28
    },
    activeMesh: {
      type: Object
    },
    hideAllMeshesButOne: {
      type: Function
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    }
  },
  data() {
    return {
      scroll: null,
      projects: [{ url: "@" }],
      loadedCount: 0
    };
  },
  methods: {
    initLocomotive() {
      this.scroll = initLS(this.$refs.left);
    },
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsTransparentWireframe();
      this.setCameraTo({
        x: this.currentXOffset - 4,
        y: 4,
        z: 10
      });
    },
    placeImages() {
      const images = this.$refs.right.querySelectorAll(".exp-img");
      images.forEach((image, index) => {
        const { height, width } = image.getBoundingClientRect();
        const y = this.randomImgPos(height, wHeight(), 2 * rem(), 4 * rem());
        const x = this.randomImgPos(width, wWidth() * 0.6);
        console.log(x, y);
        gsap.to(image, {
          y,
          x,
          duration: this.tweenDuration,
          delay: this.tweenDuration * (index / 2)
        });
      });
    },
    randomImgPos(el, w, marginTop, marginBottom) {
      const diff = w - el;
      marginTop = marginTop ? marginTop : 0;
      marginBottom = marginBottom ? marginBottom : 0;
      const val = Math.min(
        Math.max(parseInt(Math.random() * diff), marginTop),
        w - marginBottom
      );
      return val;
    },
    generateImgSize(index) {
      if (index === 0) {
        return "img-l";
      } else {
        if (parseInt(Math.round(Math.random()))) {
          return "img-m";
        } else {
          return "img-s";
        }
      }
    }
  },
  watch: {
    loadedCount(next) {
      if (next === this.siteData.exp.length) {
        this.placeImages();
      }
    }
  },
  mounted() {
    this.setupGL();
    this.$nextTick(this.initLocomotive);
  }
};
</script>

<style>
#exp-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: auto;
}

#exp-left {
  width: 100%;
  min-height: 100vh;
  padding-top: calc(var(--padding-top) + 6rem);
  padding-left: var(--padding-horizontal);
  padding-right: 2rem;
  padding-bottom: var(--padding-bottom);
}

#exp-left h2 {
  overflow-wrap: break-word;
}

#exp-right {
  width: 100%;
  height: 100%;
  position: relative;
}

.exp-img {
  position: absolute;
  transform: translateX(60vw);
}

.img-s {
  width: calc(25vw);
  height: calc(25vw);
}

.img-m {
  width: calc(40vw);
  height: calc(40vw / 4 * 3);
}

.img-l {
  width: calc(60vw);
  height: calc(60vw / 16 * 9);
}
</style>
