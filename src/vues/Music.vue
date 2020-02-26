<template>
  <section id="music-page">
    <div id="music-left" ref="page" data-scroll-container>
      <text-element
        title="Even music?"
        :speed="0"
        :paragraphs="
          `Dolor adipisicing sint dolore dolore elit dolore culpa nulla velit proident eu ullamco cillum consectetur.

      Et in sint nostrud.`
        "
      />
      <h3 data-scroll data-scroll-speed="2">track list</h3>
      <hr data-scroll data-scroll-speed="2" />
      <h2
        data-scroll
        data-scroll-speed="1"
        v-for="(track, index) in tracks"
        :key="'music-track-title-' + index"
        @click="selectTrack(index)"
        :class="{
          'fill-hover': true,
          'cursor-pointer': true,
          active: index === activeTrackIndex
        }"
      >
        {{ track.title }}
      </h2>
    </div>

    <div id="music-right">
      <generative
        v-bind="{
          activeTrackIndex
        }"
      />
    </div>
  </section>
</template>

<script>
import TextElement from "../components/TextElement.vue";
import Generative from "@/components/Generative.vue";
import { initLS } from "@/helpers/layout.js";
export default {
  name: "Music",
  components: {
    "text-element": TextElement,
    generative: Generative
  },
  props: {
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
    }
  },
  data() {
    return {
      scroll: null,
      activeTrackIndex: 0,
      tracks: [
        {
          title: "title 1"
        },
        {
          title: "title 2"
        },
        {
          title: "title 3"
        },
        {
          title: "title 4"
        },
        {
          title: "title 1"
        },
        {
          title: "title 2"
        },
        {
          title: "title 3"
        },
        {
          title: "title 4"
        }
      ]
    };
  },
  methods: {
    initLocomotive() {
      this.scroll = initLS(this.$refs.page);
      console.log(this.scroll);
    },
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsTransparentWireframe();
      this.setCameraTo({
        x: this.currentXOffset + 1,
        y: -3,
        z: 11
      });
    },
    selectTrack(index) {
      this.activeTrackIndex = index;
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

<style>
#music-page {
  display: grid;
  width: 100%;
  grid-template-columns: 60% 40%;
  height: 100vh;
}

#music-left {
  grid-column: 1 / 1;
  padding-left: var(--padding-horizontal);
  margin-right: var(--padding-horizontal);
  padding-top: calc(var(--padding-top) * 2);
  padding-bottom: calc(var(--padding-bottom) * 2);
}

#music-left h2.active {
  color: var(--white);
}

#music-right {
  grid-column: 2 / 2;
  display: flex;
  height: 100vh;
  padding-top: var(--padding-top);

  align-items: flex-end;
}
</style>
