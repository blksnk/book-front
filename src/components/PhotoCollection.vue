<template>
  <div class="collection">
    <h1 id="collection-title">
      {{ collection.title }}
    </h1>
    <div id="collection-photo-wrapper">
      <div
        class="collection-photo"
        v-for="(photo, index) in collection.photos"
        :style="{
          backgroundImage: `url(${photo.url}`
        }"
        v-bind:key="'collection-photo-' + index"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoCollection",
  props: {
    setCameraTo: {
      type: Function
    },
    gl: {
      type: Object
    },
    workSelect: {
      type: Object
    },
    useControls: {
      type: Function
    },
    currentXOffset: {
      type: Number,
      default: 21
    },
    setActiveMeshAsWireframe: {
      type: Function
    },
    siteData: {
      type: Object
    }
  },
  methods: {
    setupGL: function() {
      // this.setCameraTo({ x: this.currentXOffset - 7, y: -2, z: 6 });
      // setTimeout(() => {
      //   this.useControls(true);
      // }, 1500);
    },
    goBack: function() {
      this.router.push("/work/photo");
    }
  },
  computed: {
    collection: function() {
      return this.siteData.photo.find(
        collection => collection.id === parseInt(this.$route.params.id)
      );
    }
  },
  mounted() {
    this.setupGL();
  }
};
</script>

<style>
.collection {
  min-height: 100vh;
  width: 100%;
  padding: var(--page-padding);
  z-index: 1;
}

.collection.expanded {
  transform: translateY(calc(-100vh + 8rem));
}

#collection-title {
}

#collection-photo-wrapper {
  width: 100%;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
}

.collection-photo {
  min-height: calc((100vh - 10rem) / 2);
  max-height: calc(100vh - 10rem);
  width: 100%;
  background-position: center;
  background-size: cover;
  object-fit: cover;
}

.collection-photo:nth-child(3n + 3) {
  grid-column: span 2;
  grid-row: span 2;
  height: calc(100vh - 10rem);
}
</style>
