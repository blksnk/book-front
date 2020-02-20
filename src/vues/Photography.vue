<template>
  <section id="photo-page" ref="page">
    <div id="photo-grid" ref="grid" v-if="!selectionMade">
      <div
        class="photo-row"
        v-for="(row, rowIndex) in siteData.photo"
        v-bind:key="'photo-row-' + rowIndex"
        data-scroll-section
      >
        <img
          v-on:click="() => selectCollection(rowIndex, 0)"
          class="photo-item"
          decoding="async"
          :src="row[0].thumbnail.url"
          data-scroll
          data-scroll-speed="0"
        />
        <img
          v-if="row[1]"
          v-on:click="() => selectCollection(rowIndex, 1)"
          class="photo-item"
          :src="row[1].thumbnail.url"
          data-scroll
          data-scroll-speed="0"
        />
      </div>
    </div>
    <photo-collection
      v-if="selectionMade"
      v-bind="{
        collection: selectedCollection,
        setCameraTo,
        tweenDuration,
        closeCollection
      }"
    />
  </section>
</template>

<script>
import PhotoCollection from "./PhotoCollection.vue";
import { wHeight, initLS } from "../helpers/layout.js";
import gsap, { Power2 } from "gsap";
export default {
  name: "Photography",
  components: {
    "photo-collection": PhotoCollection
  },
  props: {
    siteData: {
      type: Object
    },
    setCameraTo: {
      type: Function
    },
    setActiveMeshAsTransparentWireframe: {
      type: Function
    },
    currentXOffset: {
      type: Number,
      default: 21
    },
    activeMesh: {
      type: Object
    },
    hideAllMeshesButOne: {
      type: Function
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    }
  },
  data() {
    return {
      rows: [],
      scroll: null,
      selectionMade: false,
      selectedCollection: null
    };
  },
  methods: {
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsTransparentWireframe();
      this.setCameraTo({
        x: this.currentXOffset,
        y: -4.5,
        z: 6
      });
    },
    initLocomotive() {
      this.scroll = initLS(this.$refs.page);
    },
    selectCollection(rowIndex, collectionIndex) {
      this.selectedCollection = this.siteData.photo[rowIndex][collectionIndex];
      this.scroll.destroy();
      this.transitionSelect();
    },
    transitionSelect() {
      gsap.to(this.$refs.grid, {
        duration: this.tweenDuration,
        y: -wHeight() - this.$refs.grid.clientHeight,
        ease: Power2.easeIn,
        onComplete: () => {
          this.selectionMade = true;
        }
      });
    },
    closeCollection() {
      this.selectionMade = false;
      this.$nextTick(() => this.transitionIn(() => this.scroll.init()));
    },
    transitionIn(callback) {
      gsap.fromTo(
        this.$refs.grid,
        {
          y: -wHeight() - this.$refs.grid.clientHeight
        },
        {
          y: 0,
          duration: this.tweenDuration * 2,
          ease: Power2.easeOut,
          onComplete: callback || null
        }
      );
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.setupGL();
        this.transitionIn(this.initLocomotive);
      });
    }, 200);
  },
  beforeDestroy() {
    this.scroll.destroy();
  },
  watch: {
    siteData: function() {
      this.createRows();
    }
  }
};
</script>

<style>
#photo-page {
  width: 100%;
  position: relative;
}

#photo-grid {
  width: 100%;
  padding: var(--page-padding);
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  transform: translateY(-300vh);
}

.photo-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: calc(100vh - 24rem);
  grid-gap: 2rem;
}

.photo-item {
  height: calc(100vh - 24rem);
  object-fit: cover;
  width: 100%;
  cursor: pointer;
  transition: 0.3s filter;
}

.photo-item:hover {
  filter: brightness(0.8);
}

.photo-item:nth-child(odd) {
  grid-column: span 2;
}

.photo-item:nth-child(even) {
  grid-column: span 1;
}

.photo-row:nth-child(even) .photo-item:nth-child(odd) {
  grid-column: span 1;
}

.photo-row:nth-child(even) .photo-item:nth-child(even) {
  grid-column: span 2;
}
</style>
