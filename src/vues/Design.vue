<template>
  <section id="design-page" v-on:mousewheel="onScroll">
    <div
      id="design-project-thumbnail-container"
      ref="container"
      v-if="!selectionMade"
    >
      <div id="design-project-thumbnail-scroller" ref="scroller">
        <img
          class="design-project-thumbail"
          v-for="(project, index) in siteData.design"
          :src="project.thumbnail.url"
          :alt="titles[index].title"
          v-bind:key="'design-project-thumbail-' + index"
        />
      </div>
    </div>
    <transition name="fade">
      <div
        id="design-project-title-scroller"
        ref="titles"
        v-if="!selectionMade"
      >
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

    <DesignProject
      v-if="selectionMade"
      v-bind="{
        project: selectedProject,
        index: selectedIndex,
        navigateProject,
        setCameraTo,
        currentXOffset,
        closeProject,
        tweenDuration
      }"
    />
  </section>
</template>

<script>
import gsap, { Power2 } from "gsap";
import DesignProject from "./DesignProject.vue";
export default {
  name: "design",
  components: {
    DesignProject
  },
  props: {
    setCameraTo: {
      type: Function
    },
    workSelect: {
      type: Object
    },
    currentXOffset: {
      type: Number,
      default: 7
    },
    tweenDuration: {
      type: Number,
      default: 0.7
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
    setActiveMeshAsTransparentWireframe: {
      type: Function
    },
    setActiveMeshAsWireframe: {
      type: Function
    },
    siteData: {
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
      scrollY: 0,
      lockInput: true,
      cHeight: 0
    };
  },
  computed: {
    titles() {
      return this.siteData.design.map(project => project.title);
    },
    selectedProject() {
      return this.siteData.design[this.selectedIndex];
    }
  },
  methods: {
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsTransparentWireframe();
      this.setCameraTo({
        z: 6,
        x: this.currentXOffset - 2.5,
        y: 4
      });
    },
    transitionIn() {
      gsap.fromTo(
        this.$refs.container,
        {
          y: "100vh"
        },
        {
          duration: this.tweenDuration * 2,
          y: 0,
          ease: Power2.easeOut
        }
      );
      gsap.to(this.$refs.titles, {
        y: 0,
        duration: this.tweenDuration * 2,
        ease: Power2.easeOut,
        delay: this.tweenDuration,
        onComplete: () => {
          this.lockInput = false;
        }
      });
    },
    closeProject() {
      this.selectionMade = false;
      this.$nextTick(() => {
        this.transitionResume();
      });
    },
    transitionResume() {
      console.log("tr resume");
      this.scrollToImg(this.selectedIndex, 0);
      gsap.set(this.$refs.container, {
        y: 0,
        x: "-100%"
      });

      gsap.set(this.$refs.titles, {
        y: "100Vh",
        x: 0,
        opacity: 0
      });
      gsap.fromTo(
        this.$refs.container,
        {
          x: "-100%"
        },
        {
          duration: 0.7,
          x: 0,
          ease: Power2.easeOut
        }
      );
      gsap.fromTo(
        this.$refs.titles,
        {
          y: "100vh",
          opacity: 0
        },
        {
          duration: 0.7,
          opacity: 1,
          y: 0,
          delay: 0.7,
          onComplete: () => {
            this.lockInput = false;
          }
        }
      );
    },
    navigateProject(dir) {
      const length = this.siteData.design.length - 1;
      if (dir === "next") {
        console.log("next");
        if (this.selectedIndex < length) {
          this.selectedIndex++;
        } else if (this.selectedIndex === length) {
          this.selectedIndex = 0;
        }
      } else if (dir === "prev") {
        console.log(this.selectedIndex, length);
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        } else if (this.selectedIndex === 0) {
          this.selectedIndex = length;
        }
      }
    },
    transitionSelect() {
      const { container, titles } = this.$refs;
      gsap.set(titles, {
        pointerEvents: "none"
      });
      gsap.to(titles, {
        duration: 0.7,
        opacity: 0
      });
      gsap.to(container, {
        x: "-100%",
        duration: 0.7,
        delay: 0.7,
        ease: Power2.easeIn,
        onComplete: () => {
          this.selectionMade = true;
        }
      });
    },
    onHover(index) {
      if (
        index !== this.selectedIndex &&
        !this.selectionMade &&
        !this.lockInput
      ) {
        this.selectedIndex = index;
        this.scrollToImg(index, 0.7);
      }
    },
    onClick(index) {
      if (!this.lockInput && !this.selectionMade) {
        this.selectedIndex = index;
        this.lockInput = true;
        this.transitionSelect();
      }
    },
    scrollToImg(index, duration) {
      if (!duration) {
        gsap.set(this.$refs.scroller, {
          y: -(parseInt(this.cHeight) + 2 * this.rem - 128) * index
        });
      } else {
        gsap.to(this.$refs.scroller, {
          y: -(parseInt(this.cHeight) + 2 * this.rem - 128) * index,
          ease: Power2.easeInOut,
          duration
        });
      }
    },
    onScroll(e) {
      const { titles } = this.$refs;
      if (!this.selectionMade && titles.clientHeight >= window.innerHeight) {
        const { deltaY } = e;
        let change = this.scrollY + deltaY * 1.5;
        const isEnd =
          titles.clientHeight - change <= window.innerHeight - 12 * this.rem;

        if (change - deltaY <= 0 && deltaY < 0) {
          change = 0;
        }
        if (isEnd && deltaY > 0) {
          change = titles.clientHeight - window.innerHeight + 12 * this.rem;
        }

        gsap.to(titles, {
          y: -change,
          duration: 0.1,
          ease: Power2.easeInOut
        });
        this.scrollY = change;
      }
    }
  },
  mounted() {
    this.setupGL();
    this.transitionIn();
    this.cHeight = window
      .getComputedStyle(this.$refs.container)
      .getPropertyValue("height")
      .split("px")[0];
  }
};
</script>

<style scoped>
#design-page {
  padding: 0 0 0 0;
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
  cursor: pointer;
}

.design-project-title.selected {
  width: 100%;
  transition-duration: 0.5s;
  color: var(--white);
}

#design-project-thumbnail-container {
  margin-top: 8rem;
  z-index: 1;
  height: 100%;
  width: 60%;
  overflow: hidden;
  transform: translateY(100vh);
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
