<template>
  <section id="music-page" ref="page">
    <div id="music-visual">
      <av-circle
        :line-width="1"
        :line-space="0"
        :outline-width="0"
        :progress-width="2"
        :outline-meter-space="rem"
        :bar-length="4 * rem"
        :playtime="false"
        :rotate-graph="false"
        :fft-size="parseInt(Math.pow(2, 10))"
        line-color="#FFFFFF"
        progress-color="#FFFFFF"
        bar-color="#FFFFFF"
        ref-link="audio"
        canv-class="music-canvas"
        :canv-height="canvasHeight"
        :canv-width="canvasWidth"
      />
    </div>
    <audio
      ref="audio"
      type="audio/wav"
      crossorigin="anonymous"
      autoplay="true"
      preload="auto"
      id="music-audio"
      :src="currentTrack.audio.url"
    ></audio>

    <div id="music-play-ui">
      <button
        class="music-nav-btn"
        id="music-btn-prev"
        @click="selectTrack('prev')"
      >
        <h2 class="fill-hover cursor-pointer">prev</h2>
      </button>

      <div id="music-title-slider" ref="slider">
        <h1
          class="music-title active"
          v-for="(track, index) in siteData.music"
          :key="'music-title-' + index"
          :class="{
            'music-title': true,
            current: index === currentTrackIndex,
            'cursor-prev': index < currentTrackIndex,
            'cursor-next': index > currentTrackIndex,
            'cursor-play': index === currentTrackIndex && isPaused,
            'cursor-pause': index === currentTrackIndex && !isPaused
          }"
          @click="selectTrackTitleClick(index)"
          @mouseover="onHoverEnter(index)"
        >
          {{ track.title }}
        </h1>
      </div>

      <button
        class="music-nav-btn"
        id="music-btn-next"
        @click="selectTrack('next')"
      >
        <h2 class="fill-hover cursor-pointer">next</h2>
      </button>

      <div
        id="music-area"
        @mouseover="onHoverEnter"
        @mouseleave="onHoverLeave"
        @click="playPause"
        :class="isPaused ? 'cursor-play' : 'cursor-pause'"
      ></div>
    </div>
  </section>
</template>

<script>
import gsap, { Power2 } from "gsap";
import { rem, wHeight, wWidth, getPos } from "@/helpers/layout.js";
export default {
  name: "Music",
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
    },
    siteData: {
      type: Object
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    }
  },
  data() {
    return {
      currentTrackIndex: 0,
      rem: rem(),
      canvasHeight: wHeight(),
      canvasWidth: wHeight(),
      centerX: wWidth() / 2,
      sliding: false,
      isPaused: false
    };
  },
  computed: {
    currentTrack() {
      return this.siteData.music[this.currentTrackIndex];
    }
  },
  methods: {
    setupGL() {
      this.hideAllMeshesButOne(this.activeMesh);
      this.setActiveMeshAsTransparentWireframe();
      this.setCameraTo({
        x: this.currentXOffset,
        y: 0,
        z: 6
      });
    },
    selectTrack(dir) {
      if (!this.sliding) {
        if (dir === "next") {
          if (this.currentTrackIndex < this.siteData.music.length - 1) {
            this.currentTrackIndex++;
          } else {
            this.currentTrackIndex = 0;
          }
        } else if (dir === "prev") {
          if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
          } else {
            this.currentTrackIndex = this.siteData.music.length - 1;
          }
        }
        this.slideTitles(this.currentTrackIndex);
        this.isPaused = false;
      }
    },
    selectTrackTitleClick(index) {
      if (index < this.currentTrackIndex) {
        this.selectTrack("prev");
      } else if (index > this.currentTrackIndex) {
        this.selectTrack("next");
      } else if (index === this.currentTrackIndex) {
        this.playPause();
      }
    },
    selectTrackOnKey(e) {
      console.log(e);
      if (e.code === "Space") {
        this.playPause();
      } else if (e.code === "ArrowRight") {
        this.selectTrack("next");
      } else if (e.code === "ArrowLeft") {
        this.selectTrack("prev");
      }
    },
    slideTitles(next) {
      this.sliding = true;

      const titles = this.$refs.slider.querySelectorAll(".music-title");
      const selectedTitle = titles[next];

      const titlePos = getPos(selectedTitle);

      const diff = wWidth() / 2 - titlePos.centerX;
      this.sled = getPos(this.$refs.slider).pos.x;

      const change = this.sled + diff - 6 * rem();

      gsap.to(this.$refs.slider, {
        x: change,
        duration: this.tweenDuration,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.sliding = false;
          this.sled = change;
        }
      });
    },
    onHoverEnter(index) {
      if (typeof index === "number") {
        if (index === this.currentTrackIndex) {
          this.setCameraTo({
            z: 6.5
          });
        }
      } else {
        this.setCameraTo({
          z: 6.5
        });
      }
    },
    onHoverLeave() {
      this.setCameraTo({
        z: 6
      });
    },
    playPause() {
      const { audio } = this.$refs;
      if (this.isPaused) {
        audio.play();
        this.isPaused = false;
      } else {
        audio.pause();
        this.isPaused = true;
      }
    },
    initSlider() {
      this.slideTitles(this.currentTrackIndex);
    }
  },
  mounted() {
    this.setupGL();
    this.$nextTick(this.initSlider);
    window.addEventListener("resize", this.initSlider);
    window.addEventListener("keydown", this.selectTrackOnKey);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initSlider);
    window.removeEventListener("keydown", this.selectTrackOnKey);
  }
};
</script>

<style>
#music-page {
  width: 100%;
  height: 100vh;
  position: relative;
}

#music-play-ui {
  height: 100%;
  padding: var(--padding-bottom) var(--padding-horizontal);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(4, 1fr);
  z-index: 20;
  pointer-events: none;
}

.music-nav-btn {
  pointer-events: all;
}

#music-btn-prev {
  grid-column: 1 / 1;
  grid-row: 4 / 4;
  align-self: end;
  justify-self: start;
}

#music-btn-next {
  grid-column: 5 / 5;
  grid-row: 4 / 4;
  align-self: end;
  justify-self: end;
}

#music-title-slider {
  grid-column: 1 / 6;
  grid-row: 2 / 4;
  align-self: center;
  justify-self: start;
  display: grid;
  grid-template-columns: repeat(auto-fill, max-content);
  align-items: center;
  justify-items: start;
  grid-gap: 14rem;
  pointer-events: all;
}

.music-title {
  grid-row: 1 / 1;
  pointer-events: all;
}

.current {
  color: var(--white);
}

#music-visual {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.music-canvas {
  pointer-events: none;
}

#music-area {
  grid-column: 2 / 5;
  grid-row: 1 / 5;
  pointer-events: all;
  border-radius: 50vh;
}

.cursor-pause {
  cursor: url("../assets/icons/pause-sharp.svg") 16 16, auto;
}

.cursor-play {
  cursor: url("../assets/icons/play-sharp.svg") 16 16, auto;
}

.cursor-next {
  cursor: url("../assets/icons/chevron-forward-sharp.svg") 16 16, auto;
}

.cursor-prev {
  cursor: url("../assets/icons/chevron-back-sharp.svg") 16 16, auto;
}
</style>
