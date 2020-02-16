<template>
  <fragment>
    <article id="design-project-page" ref="page">
      <img
        ref="thumbnail"
        id="design-selected-project-thumb"
        data-scroll
        data-scroll-offset="-100%"
        data-scroll-speed="0.2"
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
          {{ project.title }}
        </h1>

        <text-element
          title="Description"
          data-align="left"
          :paragraphs="formatText(project.description)"
        />
        <!-- <text-element title="Date" data-align="right" :paragraphs="[project.date]"/> -->

        <img
          v-if="project.images[1]"
          :src="project.images[0].url"
          data-scroll
          data-scroll-speed="2"
          data-scroll-offset="-100%"
          alt=""
          class="design-project-img"
        />

        <text-element
          title="Problem"
          data-align="right"
          :paragraphs="formatText(project.paragraph1)"
        />

        <img
          v-if="project.images[1]"
          :src="project.images[1].url"
          data-align="left"
          data-scroll
          data-scroll-speed="2"
          data-scroll-offset="-100%"
          class="design-project-img"
          alt=""
        />

        <text-element
          title="Solution"
          data-align="left"
          :paragraphs="formatText(project.paragraph2)"
        />

        <img
          v-if="project.images[2]"
          :src="project.images[2].url"
          data-align="right"
          data-scroll
          data-scroll-speed="2"
          data-scroll-offset="-100%"
          class="design-project-img"
          alt=""
        />

        <section
          id="design-project-navigation"
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
  </fragment>
</template>

<script>
import gsap, { Power2 } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import locomotiveScroll from "locomotive-scroll";
import TextElement from "../components/TextElement.vue";

gsap.registerPlugin(ScrollToPlugin);

export default {
  name: "DesignProject",
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
    }
  },
  components: {
    "text-element": TextElement
  },
  data() {
    return {
      scroll: null,
      scrolled: false,
      glOffset: {
        x: -8,
        y: -4,
        z: 8
      }
    };
  },
  methods: {
    initLocomotive() {
      this.scroll = new locomotiveScroll({
        el: this.$refs.page,
        smooth: true,
        smoothMobile: true,
        inertia: 0.8,
        getSpeed: true
      });
      this.scroll.on("scroll", this.checkScrolled);
    },
    navigate(dir) {
      this.transitionChange(0.2, 0, () => this.navigateProject(dir));
    },
    scrollToTop(projectChange) {
      this.scroll.scrollTo(this.$refs.thumbnail, 16);

      if (projectChange) {
        this.scroll.update();
        this.scroll.on("scroll", this.revealOnReachTop);
      }
    },
    close() {
      const y = this.getCurrentScrollY();
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
      gsap.to(this.$refs.thumbnail, {
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
      console.log(e);
      if (e.speed >= 0) {
        this.transitionChange(this.tweenDuration, 1);
        this.scroll.off("scroll", this.revealOnReachTop);
      }
    },
    formatText(paragraph) {
      const formatted = paragraph.split("\n").filter(item => item !== "");
      return formatted;
    },
    transitionIn() {
      gsap.to(this.$refs.page, {
        duration: this.tweenDuration,
        x: 0,
        ease: Power2.easeOut
      });
      gsap.to(this.$refs.title, {
        duration: this.tweenDuration,
        delay: 0.7,
        opacity: 1,
        ease: Power2.easeOut
      });
      gsap.to(this.$refs.btnContainer, {
        duration: this.tweenDuration,
        opacity: 1
      });
    },
    checkScrolled(e) {
      if (!this.scrolled && e.scroll.y >= 25) {
        this.scrolled = true;
      } else if (this.scrolled && e.scroll.y <= 25) {
        this.scrolled = false;
      }
    },
    getCurrentScrollY() {
      const { y, top } = this.$refs.page.getBoundingClientRect();
      return Math.max(y, top);
    }
  },
  watch: {
    project: function() {
      this.$nextTick(() => {
        this.scrollToTop(true);
      });
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
  mounted() {
    this.setCameraTo({
      x: this.currentXOffset + this.glOffset.x,
      y: this.glOffset.y + this.index * 1.5,
      z: this.glOffset.z + this.index * 0.5
    });
    this.transitionIn();
    this.$nextTick(function() {
      this.initLocomotive();
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
  bottom: 4rem;
  mix-blend-mode: difference;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
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
}

#design-selected-project-btm-btn-container button:focus {
  outline: none;
}

[data-align="left"] {
  align-self: flex-start;
}

[data-align="right"] {
  align-self: flex-end;
}

[data-align="center"] {
  align-self: center;
}

img[data-align] {
  width: calc(100% - 16rem);
}
</style>
