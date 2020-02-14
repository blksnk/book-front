<template>
  <section id="design-page" v-on:mousewheel="onScroll">
    <div id="design-project-thumbnail-container" ref="container">
      <div id="design-project-thumbnail-scroller" ref="scroller">
        <img
          class="design-project-thumbail"
          v-for="(project, index) in data.design"
          :src="project.thumbnail.url"
          :alt="titles[index].title"
          v-bind:key="'design-project-thumbail-' + index"
        />
      </div>
    </div>
    <transition name="fade">
      <div id="design-project-title-scroller" ref="titles">
        <h2
          v-for="(title, index) in titles"
          :class="{
            'design-project-title': true,
            selected: index === selectedIndex
          }"
          :data-text="title"
          v-on:mouseover="e => onHover(index)"
          v-on:click="e => onClick(index)"
          v-bind:key="'design-project-title-' + index"
        >
          {{ title }}
        </h2>
      </div>
    </transition>
  </section>
</template>

<script>
import { TweenMax, Power2 } from "gsap";
export default {
  name: "design",
  props: {
    setCameraTo: {
      type: Function
    },
    setWireframeOpacity: {
      type: Function
    },
    workSelect: {
      type: Object
    },
    currentXOffset: {
      type: Number,
      default: 7
    },
    gl: {
      type: Object
    },
    activeMesh: {
      type: Object
    },
    hideAllMeshesButOne: {
      type: Function
    },
    setActiveMeshAsWireframe: {
      type: Function
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      selectedIndex: 0,
      selectionMade: false,
      rem: parseInt(
        window
          .getComputedStyle(document.documentElement)
          .fontSize.split("px")[0]
      ),
      show: true,
      scrollY: 0
    };
  },
  computed: {
    titles() {
      return this.data.design.map(project => project.title);
    }
  },
  methods: {
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsWireframe();
      this.setCameraTo({
        z: 6,
        x: this.currentXOffset - 2.5,
        y: 4
      });
    },
    transitionIn() {
      TweenMax.to(this.$refs.container, 1.4, {
        y: 0,
        ease: Power2.easeOut
      });
      TweenMax.to(this.$refs.titles, 1.4, {
        y: 0,
        ease: Power2.easeOut,
        delay: 0.7
      });
    },
    transitionSelect() {
      const { container, titles } = this.$refs;
      TweenMax.set(titles, {
        pointerEvents: "none"
      });
      TweenMax.to(titles, 0.7, {
        opacity: 0
      });
      TweenMax.to(container, 1.4, {
        width: "100vw",
        y: -10 * this.rem,
        delay: 0.7,
        ease: Power2.easeInOut
      });
      setTimeout(() => {
        this.setCameraTo({
          y: -2,
          x: this.currentXOffset + 5,
          z: 8
        });
      }, 700);
    },
    onHover(index) {
      if (index !== this.selectedIndex && !this.selectionMade) {
        this.selectedIndex = index;
        this.scrollToImg(index);
      }
    },
    onClick(index) {
      this.selectedIndex = index;
      this.selectionMade = true;
      this.transitionSelect();
    },
    scrollToImg(index) {
      TweenMax.to(this.$refs.scroller, 0.7, {
        y: -(this.$refs.container.clientHeight + 2 * this.rem) * index,
        ease: Power2.easeInOut
      });
    },
    onScroll(e) {
      const { titles } = this.$refs;
      if (!this.selectionMade && titles.clientHeight >= window.screen.height) {
        const { deltaY } = e;
        let change = this.scrollY + deltaY * 1.5;
        const isEnd =
          titles.clientHeight - change <= window.screen.height - 12 * this.rem;

        if (change - deltaY <= 0 && deltaY < 0) {
          change = 0;
        }
        if (isEnd && deltaY > 0) {
          change = titles.clientHeight - window.screen.height + 12 * this.rem;
        }

        TweenMax.to(titles, 0.1, {
          y: -change,
          ease: Power2.easeInOut
        });
        this.scrollY = change;
      }
    }
  },
  mounted() {
    this.setupGL();
    this.transitionIn();
  }
};
</script>

<style scoped>
#design-page {
  padding: 8rem 4rem 0 0;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

#design-project-title-scroller {
  position: absolute;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-row-gap: 1rem;
  padding-top: 4rem;
  right: var(--padding-horizontal);
  left: calc(30% + var(--padding-horizontal));
  top: var(--padding-top);
  transform: translateY(100vh);
  z-index: 22 !important;
}

.design-project-title {
  text-align: left;
  transition: color 0.1s;
  z-index: 22;
}

.design-project-title.selected {
  width: 100%;
  transition-duration: 0.5s;
  color: var(--white);
}

#design-project-thumbnail-container {
  z-index: 1;
  height: 100%;
  width: 60%;
  overflow: hidden;
  transform: translateY(100%);
}

#design-project-thumbnail-scroller {
  min-height: 100%;
  height: 100%;
  width: 100%;
}

.design-project-thumbail {
  z-index: 1;
  height: calc(100vh - 8rem);
  min-height: calc(100vh - 8rem);
  width: 100%;
  object-fit: cover;
  margin-bottom: 2rem;
}
</style>
