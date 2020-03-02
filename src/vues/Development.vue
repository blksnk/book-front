<template>
  <section id="dev-page" ref="page">
    <div id="dev-intro" data-scroll-section data-scroll-speed="1">
      <text-element
        title="Overview"
        :paragraphs="
          `Since the bootcamp I undertook at IronHack in winter 2018, I have worked for and with various clients and made quite some websites.
          Here's a list of some of my favorites.
          `
        "
      />
    </div>
    <div id="dev-projects" data-scroll-section>
      <h3>selected projects</h3>
      <hr />
      <a
        v-for="(project, index) in siteData.dev"
        :key="'dev-project-' + index"
        :href="project.link"
        target="_blank"
        rel="noopener noreferrer"
        data-scroll
        data-scroll-speed="2"
      >
        <h2 class="fill-hover cursor-pointer">{{ project.title }}</h2>
      </a>
    </div>
    <div id="dev-outro" data-scroll-section>
      <text-element
        title="Going further"
        :paragraphs="
          `I currently work as a freelance web developer.

        Click on the link below to visit my development-oriented website.`
        "
      />

      <a
        id="dev-link"
        class="hover-underline cursor-pointer"
        href="https://veigel.dev"
        target="_blank"
        rel="noopener noreferrer"
        data-scroll
        data-scroll-speed="2"
        >Go to dev website</a
      >
    </div>
  </section>
</template>

<script>
import TextElement from "../components/TextElement.vue";
import { initLS } from "../helpers/layout.js";
export default {
  name: "Development",
  components: {
    "text-element": TextElement
  },
  props: {
    setCameraTo: {
      type: Function
    },
    workSelect: {
      type: Object,
      default: () => ({
        activeIndex: 0,
        selectionMade: false,
        redirectToUrl: "/",
        redirectDone: false
      })
    },
    gl: {
      type: Object
    },
    setActiveMeshAsWireframe: {
      type: Function
    },
    hideAllMeshesButOne: {
      type: Function
    },
    activeMesh: {
      type: Object
    },
    siteData: {
      type: Object
    }
  },
  data() {
    return {
      expandedIndex: 0,
      expanded: false
    };
  },
  methods: {
    setupGL: function() {
      this.setCameraTo({ z: 5, x: 5.5 });
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsWireframe();
    },
    initLocomotive() {
      this.scroll = initLS(this.$refs.page);
    }
  },
  mounted() {
    this.setupGL();
    this.$nextTick(this.initLocomotive);
  },
  beforeDestroy() {
    this.scroll.destroy();
  }
};
</script>

<style scoped>
#dev-page {
  width: 100%;
  padding-top: calc(var(--padding-top) + 6rem);
  padding-bottom: calc(var(--padding-bottom) * 2);
  display: grid;
  grid-template-columns: 40% 60%;
  grid-auto-rows: max-content;
}
#dev-intro {
  grid-column: 2 / 2;
  padding-right: var(--padding-horizontal);
}

#dev-projects {
  grid-column: 2 / 2;
  padding-right: var(--padding-horizontal);
  margin-bottom: 4rem;
}

#dev-projects hr {
  margin-bottom: 1rem;
}

#dev-outro {
  grid-column: 2 / 2;
  padding-right: var(--padding-horizontal);
  margin-bottom: 4rem;
}

#dev-link {
  color: var(--white);
  font-weight: 800;
  text-decoration: none;
  margin-top: 8rem;
  margin-left: 8rem;
}
</style>
