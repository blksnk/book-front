<template>
  <section id="category-container">
    <div id="category-wrapper">
      <CategoryTitle
        v-for="(item, index) in listItems"
        v-bind:key="index"
        v-bind:title="item.title"
        v-bind:onHover="() => onHover(index)"
        v-bind:onClick="() => onClick('/work' + item.url)"
        v-bind:id="`title${index}`"
        v-bind:active="workSelect.activeIndex === index"
        v-bind:hide="workSelect.selectionMade"
      ></CategoryTitle>
    </div>
  </section>
</template>

<script>
import CategoryTitle from "./CategoryTitle.vue";
export default {
  name: "CategoryWrapper",
  components: {
    CategoryTitle
  },
  props: {
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
    setWireframeOpacity: {
      type: Function
    },
    setCameraTo: {
      type: Function
    },
    useControls: {
      type: Function
    },
    resetSelection: {
      type: Function
    }
  },
  data() {
    return {
      listItems: [
        {
          title: "development",
          url: "/dev"
        },
        {
          title: "design",
          url: "/design"
        },
        {
          title: "music",
          url: "/music"
        },
        {
          title: "photography",
          url: "/photo"
        },
        {
          title: "experiments",
          url: "/exp"
        }
      ]
    };
  },
  methods: {
    onClick: function(url) {
      this.$router.app.selectCategory(url);
    },
    onHover: function(index) {
      this.$router.app.setActiveIndex(index);
    },
    setupGL: function() {
      this.setWireframeOpacity(1);
      this.setCameraTo({
        x: this.workSelect.activeIndex * this.gl.placementOffset,
        y: 0,
        z: 4
      });
      this.resetSelection();
      this.useControls(false);
    },
    handleEvent(payload) {
      console.log(payload);
    }
  },
  mounted() {
    this.setupGL();
  }
};
</script>

<style scoped>
#category-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  justify-self: center;
  pointer-events: none;
  z-index: 21;
}

#category-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, min-content);
  padding: 4rem 6rem;
  pointer-events: all;
}

#title0 {
  grid-column: 1 / 3;
  grid-row: 1 / 1;
}

#title1 {
  grid-column: 1 / 1;
  grid-row: 2 / 2;
}

#title2 {
  grid-column: 2 / 2;
  grid-row: 2 / 2;
  justify-self: end;
}

#title3 {
  grid-column: 1 / 3;
  grid-row: 3 / 3;
  justify-self: end;
}

#title4 {
  grid-column: 1 / 3;
  grid-row: 4 / 4;
}

@media (max-width: 750px) {
  #category-wrapper {
    padding: 4rem 2rem;
  }
}
</style>
