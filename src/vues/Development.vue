<template>
  <section id="dev-page">
    <DevWork
      v-for="(work, index) in data.dev"
      v-bind="{
        work,
        index,
        expandedIndex,
        expanded,
        toggleExpand,
        formattedIndex: formatIndex(index + 1)
      }"
      v-bind:key="'dev-work-' + index"
    />
  </section>
</template>

<script>
import DevWork from "../components/DevWork.vue";
export default {
  name: "Development",
  components: {
    DevWork
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
    data: {
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
      this.activeMesh.material = this.gl.materials.wireframeMaterial;
    },
    formatIndex: function(index) {
      if (!index) {
        return "00";
      } else if (index < 10) {
        return `0${index}`;
      } else {
        return String(index);
      }
    },
    toggleExpand: function(index) {
      if (!this.expanded) {
        this.expandedIndex = index;
        this.expanded = true;
      } else if (this.expandedIndex !== index) {
        this.expandedIndex = index;
      } else {
        this.expanded = false;
      }
    }
  },
  mounted() {
    this.setupGL();
  }
};
</script>

<style scoped>
#dev-page {
  min-height: 100vh;
  width: 100%;
  padding: var(--page-padding);
  /* background-color: var(--black); */
  display: grid;
  grid-template-columns: auto min-content;
  grid-auto-rows: max-content;
}
</style>
