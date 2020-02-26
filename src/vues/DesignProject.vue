<template>
  <fragment>
    <article id="design-project-page" ref="page">
      <image-loader
        ref="thumbnail"
        id="design-selected-project-thumb"
        v-on:loaded="catchThumbnailLoaded"
        data-scroll
        data-scroll-speed="0.2"
        noAnimation
        :src="project.thumbnail.url"
      />

      <section id="design-project-content" ref="content">
        <h1
          id="design-selected-project-title"
          ref="title"
          data-scroll
          data-scroll-offset="-100%"
          data-scroll-speed="2"
        >
          {{ project.projectTitle }}
        </h1>

        <text-element
          :title="project.title1"
          data-align="left"
          :paragraphs="project.paragraph1"
        />

        <image-loader
          v-if="project.image1"
          :src="project.image1.url"
          data-scroll
          :noAnimation="true"
          data-scroll-speed="2"
          alt=""
          class="design-project-img"
        />

        <text-element
          :title="project.title2"
          data-align="right"
          :paragraphs="project.paragraph2"
        />

        <image-loader
          v-if="project.image2"
          :src="project.image2.url"
          data-align="left"
          data-scroll
          data-scroll-speed="2"
          class="design-project-img"
          alt=""
        />

        <text-element
          :title="project.title3"
          data-align="left"
          :paragraphs="project.paragraph3"
        />

        <image-loader
          v-if="project.image3"
          :src="project.image3.url"
          data-align="right"
          data-scroll
          data-scroll-speed="2"
          class="design-project-img"
        />

        <section
          id="design-project-navigation"
          v-if="listLength > 1"
          data-scroll
          data-scroll-speed="0.7"
          data-scroll-offset="-100%"
        >
          <button
            class="design-project-navigation-btn"
            v-on:click="e => navigate('prev')"
          >
            <h2>prev</h2>
          </button>
          <button
            class="design-project-navigation-btn"
            v-on:click="e => navigate('next')"
          >
            <h2>next</h2>
          </button>
        </section>
      </section>
    </article>
    <div id="design-selected-project-btm-btn-container" ref="btnContainer">
      <div>
        <transition name="fade">
          <button
            class="hover-underline"
            v-if="
              !projectTransition && scrolled && !scrolledEnd && listLength > 1
            "
            v-on:click="e => navigate('prev')"
          >
            .prev
          </button>
        </transition>
        <transition name="fade">
          <button
            class="hover-underline"
            v-if="
              !projectTransition && scrolled && !scrolledEnd && listLength > 1
            "
            v-on:click="e => navigate('next')"
          >
            .next
          </button>
        </transition>
      </div>

      <div>
        <transition name="fade">
          <button
            class="hover-underline"
            v-if="scrolled"
            v-on:click="scrollToTop"
          >
            .back to top
          </button>
        </transition>

        <button class="hover-underline" v-on:click="close">
          .close project
        </button>
      </div>
    </div>
  </fragment>
</template>

<script>
import gsap, { Power2 } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import TextElement from "@/components/TextElement.vue";
import ImageLoader from "@/components/ImageLoader.vue";

import {
  rem,
  wHeight,
  wWidth,
  getCurrentScrollY,
  initLS
} from "../helpers/layout.js";

gsap.registerPlugin(ScrollToPlugin);

export default {
  name: "DesignProject",
  components: {
    "text-element": TextElement,
    "image-loader": ImageLoader
  },
  props: {
    project: {
      type: Object
    },
    index: {
      type: Number
    },
    navigateProject: {
      type: Function
    },
    setCameraTo: {
      type: Function
    },
    currentXOffset: {
      type: Number,
      default: 7
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    },
    closeProject: {
      type: Function
    },
    listLength: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      scroll: null,
      scrolled: false,
      scrolledEnd: false,
      projectTransition: false,
      thumbnailLoaded: false,
      glOffset: {
        x: 8,
        y: -4,
        z: 11
      }
    };
  },
  methods: {
    initLocomotive() {
      this.scroll = initLS(this.$refs.page, this.checkScrolled);
    },
    navigate(dir) {
      this.transitionChange(0.2, 0, () => this.navigateProject(dir));
    },
    scrollToTop(projectChange) {
      this.scroll.scrollTo(this.$refs.thumbnail.$el, 16);

      if (projectChange) {
        this.projectTransition = true;
        this.scroll.update();
        this.scroll.on("scroll", this.revealOnReachTop);
      }
    },
    close() {
      const y = getCurrentScrollY(this.$refs.page);
      gsap.fromTo(
        this.$refs.page,
        {
          y,
          x: 0
        },
        {
          duration: this.tweenDuration,
          x: "100vw",
          y,
          ease: Power2.easeIn,
          onComplete: () => {
            this.closeProject();
          }
        }
      );
      gsap.to(this.$refs.btnContainer, {
        duration: this.tweenDuration,
        opacity: 0
      });
    },
    transitionChange(duration, opacity, callback) {
      gsap.to(this.$refs.thumbnail.$el, {
        duration,
        opacity
      });
      gsap.to(this.$refs.content, {
        duration,
        opacity,
        onComplete: callback || null
      });
    },
    revealOnReachTop(e) {
      if (e.speed >= 0) {
        this.transitionChange(this.tweenDuration, 1, () => {
          this.projectTransition = false;
        });
        this.scroll.off("scroll", this.revealOnReachTop);
      }
    },
    transitionIn(onComplete) {
      gsap.to(this.$refs.page, {
        duration: this.tweenDuration,
        x: 0,
        ease: Power2.easeOut
      });
      gsap.to(this.$refs.title, {
        duration: this.tweenDuration,
        delay: this.tweenDuration,
        opacity: 1,
        ease: Power2.easeOut,
        onComplete
      });
      gsap.to(this.$refs.btnContainer, {
        duration: this.tweenDuration,
        opacity: 1
      });
    },
    checkScrolled(e) {
      if (!this.scrolled && e.scroll.y >= window.innerHeight / 2) {
        this.scrolled = true;
      } else if (this.scrolled && e.scroll.y <= window.innerHeight / 2) {
        this.scrolled = false;
      }
      const endOffset =
        this.$refs.page.clientHeight - e.scroll.y - window.innerHeight;
      if (!this.scrolledEnd && endOffset <= 200) {
        this.scrolledEnd = true;
      } else if (this.scrolledEnd && endOffset >= 200) {
        this.scrolledEnd = false;
      }
    },
    checkScrolledToEnd() {
      return this.$refs.page.clientHeight - this.scrollY <= 200;
    },
    catchThumbnailLoaded() {
      console.log("event");
      this.thumbnailLoaded = true;
    },
    onMount() {
      this.$nextTick(() => {
        this.initLocomotive();

        this.transitionIn(() =>
          this.$nextTick(() => {
            if (this.scroll) {
              this.scroll.update();
            } else {
              this.initLocomotive();
            }
          })
        );
      });
    }
  },
  watch: {
    project() {
      this.thumbnailLoaded = false;
      this.projectTransition = true;
    },
    thumbnailLoaded(next) {
      if (next && this.scroll && this.projectTransition) {
        this.$nextTick(() => {
          this.scrollToTop(this.projectTransition);
        });
      } else if (next && !this.projectTransition) {
        this.onMount();
      }
    },
    index: function(next) {
      this.$nextTick(() => {
        this.glOffset.x *= -1;
        this.setCameraTo({
          x: this.currentXOffset + this.glOffset.x,
          y: this.glOffset.y + next * 1.5,
          z: this.glOffset.z + next * 0.5
        });
      });
    }
  },
  computed: {
    wHeight: () => wHeight(),
    wWidth: () => wWidth(),
    rem: () => rem()
  },
  mounted() {
    this.setCameraTo({
      x: this.currentXOffset + this.glOffset.x,
      y: this.glOffset.y + this.index * 1.5,
      z: this.glOffset.z + this.index * 0.5
    });
  },
  beforeDestroy() {
    this.scroll.destroy();
  }
};
</script>

<style>
#design-project-page {
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  transform: translateX(100vw);
  background-color: var(--black);
}

#design-selected-project-thumb {
  height: calc(100vh - 13.2rem);
  width: 100%;
  object-fit: cover;
}

#design-project-content {
  z-index: 6;
  background-color: var(--black);
  padding: 0 var(--padding-horizontal);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

#design-selected-project-title {
  opacity: 0;
  margin-bottom: 6rem;
  color: var(--white);
}

.design-project-img {
  width: 100%;
  height: calc(100vh - 12rem);
  z-index: 4;
  object-fit: cover;
  margin-bottom: 8rem;
  display: block;
}

#design-project-navigation {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8rem 14rem;
  padding-top: 0;
}

.design-project-navigation-btn {
  padding: 2rem;
  border: none;
  background: none;
  cursor: pointer;
}

.design-project-navigation-btn h2 {
  transition: 0.1s color;
}

.design-project-navigation-btn:hover h2 {
  color: var(--white);
}

#design-selected-project-btm-btn-container {
  position: fixed;
  right: 6rem;
  left: 6rem;
  bottom: 4rem;
  mix-blend-mode: difference;
  opacity: 0;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

#design-selected-project-btm-btn-container div {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}

#design-selected-project-btm-btn-container div:first-child {
  align-items: flex-start;
}

#design-selected-project-btm-btn-container button {
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--white);
  font-size: var(--font-size-small);
  mix-blend-mode: difference;
  margin-top: 0.5rem;
  pointer-events: all;
}

#design-selected-project-btm-btn-container button:focus {
  outline: none;
}

img[data-align] {
  width: calc(100% - 8rem);
}
</style>
