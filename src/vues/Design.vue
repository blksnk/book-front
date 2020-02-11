<template>
  <section id="design-page">
    <div id="design-project-thumbnail-container" ref="container">
      <div id="design-project-thumbnail-scroller" ref="scroller">
        <img
          class="design-project-thumbail"
          v-for="(url, index) in images"
          :src="url"
          :alt="titles[index].title"
          v-bind:key="'design-project-thumbail-' + index"
        />
      </div>
    </div>
    <div id="design-project-title-scroller">
      <h2
        v-for="(title, index) in titles"
        :class="{
          'design-project-title': true,
          selected: index === selectedIndex
        }"
        :data-text="title"
        v-on:mouseover="e => onHover(index)"
        v-bind:key="'design-project-title-' + index"
      >
        {{ title }}
      </h2>
    </div>
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
    }
  },
  data() {
    return {
      selectedIndex: 0,
      rem: parseInt(
        window
          .getComputedStyle(document.documentElement)
          .fontSize.split("px")[0]
      ),
      projects: [
        {
          title: "the long title",
          thumbnailURL:
            "https://media.itsnicethat.com/original_images/kenny-brandenberger-graphic-design-itsnicethat-5.gif",
          date: {
            year: 2020,
            month: 1
          }
        },
        {
          title: "medium title",
          thumbnailURL:
            "https://www.responsive-mind.fr/wp-content/uploads/2015/07/materialdesign_principles_metaphor.png",
          date: {
            year: 2019,
            month: 9
          }
        },
        {
          title: "short",
          thumbnailURL:
            "https://design.uqam.ca/wp-content/uploads/sites/4/2019/06/Invitation_Annuel_de_Design_2019_Gif_4.0.gif",
          date: {
            year: 2019,
            month: 7
          }
        }
      ]
    };
  },
  computed: {
    titles() {
      return this.projects.map(project => project.title);
    },
    images() {
      return this.projects.map(project => project.thumbnailURL);
    }
  },
  methods: {
    setupGL: function() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsWireframe();
      console.log(this.activeMesh.material);
      this.setCameraTo({
        z: 6,
        x: this.workSelect.activeIndex * this.gl.placementOffset - 2.5,
        y: 3
      });
    },
    onHover(index) {
      if (index !== this.selectedIndex) {
        this.selectedIndex = index;
      }
      this.scrollToImg(index);
    },
    scrollToImg(index) {
      TweenMax.to(this.$refs.scroller, 0.7, {
        y: -(this.$refs.container.clientHeight + 2 * this.rem) * index,
        ease: Power2.easeInOut
      });
    }
  },
  mounted() {
    this.setupGL();
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
  margin-top: 2rem;
  right: var(--padding-horizontal);
  top: var(--padding-top);
}

.design-project-title {
  text-align: left;
  transition: color 0.1s;
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
}

#design-project-thumbnail-scroller {
  min-height: 100%;
  width: 100%;
}

.design-project-thumbail {
  z-index: 1;
  height: calc(100vh - 8rem);
  width: 100%;
  object-fit: cover;
  margin-bottom: 2rem;
}
</style>
