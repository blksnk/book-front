<template>
  <section id="photo-page" ref="page">
    <div id="photo-grid" ref="grid" v-if="show && !selectionMade">
      <div
        class="photo-row"
        v-for="(row, rowIndex) in rows"
        v-bind:key="'photo-row-' + rowIndex"
        data-scroll-section
      >
        <img
          v-on:click="() => selectCollection(row[0].id)"
          class="photo-item"
          :src="row[0].thumbnail.url"
          data-scroll
          data-scroll-speed="0"
        />
        <img
          v-if="row[1]"
          v-on:click="() => selectCollection(row[1].id)"
          class="photo-item"
          :src="row[1].thumbnail.url"
          data-scroll
          data-scroll-speed="0"
        />
      </div>
    </div>
    <photo-collection
      v-if="show && selectionMade"
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
import locomotiveScroll from "locomotive-scroll";
import PhotoCollection from "./PhotoCollection.vue";
import { wHeight } from "../helpers/layout.js";
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
      show: false,
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
        y: -4,
        z: 4
      });
    },
    createRows() {
      const rows = this.siteData.photo.reduce(function(
        result,
        value,
        index,
        array
      ) {
        if (index % 2 === 0) result.push(array.slice(index, index + 2));
        return result;
      },
      []);
      this.rows = rows;
      this.show = true;
      this.$nextTick(() => {
        this.setupGL();
        this.transitionIn(() => this.scroll.update());
      });
    },
    initLocomotive() {
      this.scroll = new locomotiveScroll({
        el: this.$refs.page,
        smooth: true,
        smoothMobile: true,
        inertia: 0.8,
        getSpeed: true
      });
    },
    selectCollection(id) {
      this.selectedCollection = this.siteData.photo.find(
        collection => collection.id === id
      );
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
      this.setupGL();
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
    this.$nextTick(() => {
      this.createRows();
      this.initLocomotive();
    });
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
