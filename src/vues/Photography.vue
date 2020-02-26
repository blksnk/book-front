<template>
  <section id="photo-page" ref="page">
    <div id="photo-grid" ref="grid" v-if="!selectionMade">
      <div
        class="photo-row"
        v-for="(row, rowIndex) in siteData.photo"
        v-bind:key="'photo-row-' + rowIndex"
        data-scroll-section
      >
        <image-loader
          v-for="(image, index) in row"
          :key="`row-image-${rowIndex}-${index}`"
          :rowIndex="rowIndex"
          :imageIndex="index"
          :src="image.thumbnail.url"
          v-on:loaded="() => catchLoad(selectionMade ? onPageResume : onLoaded)"
          :click="() => selectCollection(rowIndex, index)"
          class="photo-item"
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
import ImageLoader from "@/components/ImageLoader.vue";
import { wHeight, initLS } from "@/helpers/layout.js";
import gsap, { Power2 } from "gsap";
export default {
  name: "Photography",
  components: {
    "photo-collection": PhotoCollection,
    "image-loader": ImageLoader
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
      scroll: null,
      selectionMade: false,
      selectedCollection: null,
      loadedCount: 0
    };
  },
  computed: {
    imageCount: function() {
      let count = 0;
      const { length } = this.siteData.photo;
      for (let i = 0; i < length; i++) {
        count += this.siteData.photo[i].length;
      }
      return count;
    }
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
      this.loadedCount = 0;
      this.selectionMade = false;

      // this.$nextTick(() => this.transitionIn(() => this.scroll.init()));
    },
    onPageResume() {
      this.$nextTick(this.transitionIn(this.scrollInit));
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
    },
    onLoaded() {
      this.setupGL();
      this.$nextTick(() => {
        this.transitionIn(this.initLocomotive);
      });
    },
    catchLoad(callback) {
      if (this.loadedCount < this.imageCount) {
        this.loadedCount++;

        if (this.loadedCount === this.imageCount) {
          callback();
        }
      }
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.destroy();
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
  min-height: 100vh;
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
