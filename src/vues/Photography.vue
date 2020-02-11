<template>
  <section>
    <transition v-if="show" name="fade">
      <div id="photo-collection-container">
        <PhotoCollectionThumbnail
          v-for="(collection, index) in collections"
          v-bind="{
            onClick: viewCollection,
            onHover: selectCollection,
            name: collection.title,
            src: collection.thumbnail.url,
            id: collection.id,
            index
          }"
          v-bind:key="'collection-thumbail-' + index"
        />
      </div>
    </transition>
  </section>
</template>

<script>
import PhotoCollectionThumbnail from "../components/PhotoCollectionThumbnail.vue";
import axios from "axios";

export default {
  name: "Photography",
  components: {
    PhotoCollectionThumbnail
  },
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
    hideAllMeshesButOne: {
      type: Function
    },
    activeMesh: {
      type: Object
    },
    setActiveMeshAsWireframe: {
      type: Function
    }
  },
  data() {
    return {
      selectedIndex: 0,
      collections: [],
      show: false
    };
  },
  computed: {
    selectedCollection: function() {
      return this.collections[this.selectedIndex];
    }
  },
  methods: {
    setupGL: function() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsWireframe();
      this.setCameraTo({
        z: 4,
        x: this.workSelect.activeIndex * this.gl.placementOffset,
        y: -4
      });
    },
    formatData: function(data) {
      return data.map(collection => {
        return {
          ...collection,
          thumbnail: {
            ...collection.thumbnail,
            url: process.env.VUE_APP_API_URL + collection.thumbnail.url
          }
        };
      });
    },
    fetchCollections: async function() {
      const data = await this.fetchData();
      const formatted = this.formatData(data);
      console.log(formatted);
      this.collections = formatted;
      this.show = true;
    },
    fetchData: async function() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/photo-collections`
      );
      return res.data;
    },
    selectCollection: function(index) {
      this.selectedIndex = index;
    },
    viewCollection: function(id) {
      console.log(id);
      this.$router.push(`/work/photo/collection/${id}`);
    }
  },
  mounted() {
    this.setupGL();
    this.fetchCollections();
  }
};
</script>

<style>
#photo-collection-container {
  height: 100vh;
  width: 100vw;
  padding: var(--page-padding);
  padding-right: 5rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(max-content, 1fr));
  /* grid-template-rows: auto; */
  grid-gap: 2rem;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
