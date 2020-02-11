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
import axios from "axios";
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
    }
  },
  data() {
    return {
      collection: {
        title: "",
        date: new Date(),
        photos: []
      }
    };
  },
  methods: {
    setupGL: function() {
      this.setCameraTo({ x: this.currentXOffset, y: 0, z: 4 });
      // setTimeout(() => {
      //   this.useControls(true);
      // }, 1500);
    },
    goBack: function() {
      this.router.push("/work/photo");
    },
    fetchCollection: async function() {
      const data = await this.fetchData();
      this.collection = this.formatData(data);
    },
    fetchData: async function() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_URL}/photo-collections/${this.$route.params.id}`
        );
        return res.data;
      } catch (e) {
        console.error(e);
      }
    },
    formatData: function(collection) {
      return {
        ...collection,
        photos: collection.photos.map(photo => {
          return {
            ...photo,
            url: process.env.VUE_APP_API_URL + photo.url
          };
        }),
        thumbnail: {
          ...collection.thumbnail,
          url: process.env.VUE_APP_API_URL + collection.thumbnail.url
        }
      };
    }
  },
  mounted() {
    this.fetchCollection();
    this.setupGL();
  }
};
</script>

<style>
.collection {
  min-height: 100vh;
  width: 100%;
  padding: var(--page-padding);
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
  z-index: 2;
  object-fit: cover;
}

.collection-photo:nth-child(3n + 3) {
  grid-column: span 2;
  grid-row: span 2;
  height: calc(100vh - 10rem);
}
</style>
