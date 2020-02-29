<template>
  <section id="exp-page">
    <div id="exp-left" ref="left">
      <text-element
        title="What is this?"
        :paragraphs="
          `
        I like to explore various concepts and design ideas during my free time. The easiest way for me to do so is by creating simple web pages, allowing me to efficiently put my ideas into practice.
        You'll find some of the ideas I've come up with over the past year. I've recently taken a liking to experimenting with generative and random art.
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
        v-on:mouseover="() => onHover(index)"
        v-on:mouseleave="onLeave"
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
import gsap, { Power2 } from "gsap";
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
      loadedCount: 0,
      images: []
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
        x: this.currentXOffset,
        y: -3,
        z: 16
      });
    },
    placeImages() {
      this.images = this.$refs.right.querySelectorAll(".exp-img");
      this.images.forEach((image, index) => {
        const { height, width } = image.getBoundingClientRect();
        const y = this.randomImgPos(height, wHeight(), 8 * rem(), 4 * rem());
        const x = this.randomImgPos(width, wWidth() * 0.4);
        console.log(x, y);
        gsap.to(image, {
          y,
          x,
          duration: this.tweenDuration,
          delay: this.tweenDuration * (index / 2),
          ease: Power2.easeOut
        });
      });
    },
    randomImgPos(el, w, marginTop, marginBottom) {
      const diff = w - el;
      marginTop = marginTop ? marginTop : 0;
      marginBottom = marginBottom ? marginBottom : 0;
      const val = Math.min(
        Math.max(parseInt(Math.random() * diff), marginTop),
        diff - marginBottom
      );
      return val;
    },
    generateImgSize(index) {
      console.log(index);
      const rand = parseInt(Math.round(Math.random() * 2));
      console.log(rand);
      switch (rand) {
        case 0:
          return "img-l";
        case 1:
          return "img-m";
        case 2:
          return "img-s";
      }
    },
    onHover(index) {
      const activeImg = this.images[index];
      const toFadeOut = Array.from(this.images).filter(
        img => img !== activeImg
      );
      gsap.to(activeImg, {
        opacity: 1,
        duration: this.tweenDuration / 2
      });

      gsap.to(toFadeOut, {
        opacity: 0,
        duration: this.tweenDuration / 2
      });
    },
    onLeave() {
      gsap.to(this.images, {
        opacity: 1,
        duration: this.tweenDuration / 2
      });
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
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
}

#exp-left {
  width: 100%;
  min-height: 100vh;
  padding-top: calc(var(--padding-top) + 6rem);
  padding-left: var(--padding-horizontal);
  padding-right: 2rem;
  padding-bottom: var(--padding-top);
}

#exp-left h2 {
  overflow-wrap: normal;
  z-index: 25;
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
  width: calc(16vw);
  height: calc(16vw);
}

.img-m {
  width: calc(24vw);
  height: calc(24vw);
  /* height: calc(28vw / 4 * 3); */
}

.img-l {
  width: calc(32vw);
  height: calc(32vw);
  /* height: calc(34vw / 16 * 9); */
}
</style>
