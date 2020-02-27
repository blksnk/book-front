<template>
  <section id="about-page" ref="page">
    <div id="about-pres" ref="pres">
      <h1 ref="title">genmetsu means desillusion</h1>
      <text-element
        title="About me"
        :paragraphs="siteData.about.presentation"
      />
    </div>
    <image-loader
      id="about-img"
      ref="img"
      :src="siteData.about.thumbnail.url"
      data-scroll
      data-scroll-direction="horizontal"
      noAnimation
      data-scroll-speed="-2"
      v-on:loaded="transitionIn"
    />
    <div class="about-info-top about-info about-info-left">
      <text-element title="Education" :paragraphs="siteData.about.education" />
    </div>

    <div class="about-info-top about-info about-info-right">
      <text-element
        title="Experience"
        :paragraphs="siteData.about.experience"
      />
    </div>
    <div class="about-info-btm about-info about-info-left">
      <text-element title="Skills" :paragraphs="siteData.about.skills" />
    </div>

    <div class="about-info-btm about-info about-info-right">
      <text-element
        title="Inspiration"
        :paragraphs="siteData.about.inspiration"
      />
    </div>

    <div id="about-contact">
      <h3>contact information</h3>
      <hr />
      <a href="mailto:hello@veigel.dev">
        <h2 class="fill-hover">hello@veigel.dev</h2>
      </a>
      <a href="tel:+33658238758">
        <h2 class="fill-hover">+33 6 58 23 87 58</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://instagram.com/chxmpetre"
      >
        <h2 class="fill-hover">insta /chxmpetre</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/blksnk"
      >
        <h2 class="fill-hover">github /blksnk</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://linkedin.com/in/jn-veigel"
      >
        <h2 class="fill-hover">linkedin /jnveigel</h2>
      </a>
    </div>
  </section>
</template>

<script>
import { initLS, wHeight, wWidth, rem } from "../helpers/layout.js";
import { throttle } from "@/helpers/math.js";
import gsap, { Power2 } from "gsap";
import TextElement from "../components/TextElement.vue";
import ImageLoader from "@/components/ImageLoader.vue";
export default {
  name: "About",
  components: {
    "text-element": TextElement,
    "image-loader": ImageLoader
  },
  props: {
    setCameraTo: {
      type: Function
    },
    resetSelection: {
      type: Function
    },
    setActiveIndex: {
      type: Function
    },
    setAllMeshesAsTransparentWireframe: {
      type: Function
    },
    tweenDuration: {
      default: 0.7
    },
    siteData: {
      type: Object
    }
  },
  data() {
    return {
      scroll: null,
      scrolled: 0
    };
  },
  methods: {
    setupGL() {
      this.resetSelection();
      this.setAllMeshesAsTransparentWireframe();
      this.setActiveIndex(2);
      this.setCameraInit();
    },
    setCameraInit() {
      this.setCameraTo({
        x: 7,
        y: -10,
        z: 16,
        r: {
          x: 0,
          y: 0,
          z: 90
        }
      });
    },
    initLocomotive() {
      this.scroll = initLS(
        this.$refs.page,
        throttle(this.checkScroll, 50, {
          leading: true,
          trailing: false
        })
      );
    },
    checkScroll(e) {
      const { y } = e.scroll;
      const pHeight = this.$refs.page.clientHeight - wHeight();
      const val = ((y / pHeight) * 100 * (21 - 7)) / 100 + 7;
      this.setCameraTo({
        x: val,
        y: -10,
        z: 16,
        r: {
          x: 0,
          y: 0,
          z: 90
        }
      });
    },
    transitionIn() {
      const text = this.$refs.page.querySelectorAll("div.text-element");
      this.setupGL();
      gsap.fromTo(
        this.$refs.img.$el,
        {
          y: "-100vh"
        },
        {
          y: 0,
          duration: this.tweenDuration * 2,
          ease: Power2.easeOut,
          onComplete: this.initLocomotive
        }
      );
      gsap.fromTo(
        this.$refs.title,
        {
          x: -wWidth() - 6 * rem()
        },
        {
          x: 0,
          duration: this.tweenDuration * 2,
          delay: this.tweenDuration,
          ease: Power2.easeOut
        }
      );
      gsap.fromTo(
        text,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: this.tweenDuration * 2,
          delay: this.tweenDuration * 2
        }
      );
    }
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.destroy();
    }
  }
};
</script>

<style>
#about-page {
  width: 100%;
  padding-bottom: var(--padding-bottom);
  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(auto-fill, minmax(max-content, 100vh));
}

#about-pres {
  grid-column: 1 / 3;
  padding-top: calc(var(--padding-top) * 2 - 2rem);
  padding-left: var(--padding-horizontal);
  padding-right: var(--padding-horizontal);
  z-index: 2;
  min-height: 100vh;
  margin-bottom: 4rem;
}

#about-pres h1 {
  color: var(--white);
  width: calc(100vw - 12rem);
  margin-bottom: 4rem;
  transform: translateX(-100% - var(--padding-horizontal));
}

#about-img {
  height: calc(100vh - var(--padding-top));
  width: 100%;
  grid-column: 3 / 6;
  z-index: 1;
  filter: grayscale(1);
}

.about-info {
  /* margin-bottom: var(--padding-bottom); */
}

.about-info-top {
  grid-row: 2 / 2;
}

.about-info-btm {
  grid-row: 3 / 3;
}

.about-info-left {
  grid-column: 1 / 3;
  padding-left: var(--padding-horizontal);
}

.about-info-right {
  grid-column: 3 / 5;
}

#about-contact {
  grid-row: 4 / 4;
  grid-column: 1 / 5;
  width: calc(50% + var(--padding-top) * 3);
  margin-top: 4rem;
  padding-left: var(--padding-horizontal);
  padding-right: var(--paddin-right);
}

#about-contact hr {
  margin-bottom: 1rem;
}

#about-contact h2 {
  overflow-wrap: break-word;
  /* margin-bottom: 1rem; */
}
</style>
