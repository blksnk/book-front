<template>
  <fragment>
    <section id="photo-collec-page" ref="page" data-scroll-container>
      <section id="photo-collec-pres-page">
        <div id="photo-collec-pres-left" data-scroll data-scroll-speed="0.5">
          <h3 id="photo-collec-subtitle">
            {{ collection.subtitle }}
          </h3>
          <hr />
          <h1 id="photo-collec-title">
            {{ collection.title }}
          </h1>
          <hr />
          <h3 id="photo-collec-date">
            {{ collection.date }}
          </h3>
        </div>

        <image-loader
          scroll
          scrollSpeed="2"
          id="photo-collec-pres-right"
          :src="collection.thumbnail.url"
        />
      </section>

      <section id="photo-collec-view-page" ref="secondPage">
        <div id="photo-collec-view-left" data-scroll data-scroll-speed="2">
          <agile
            id="main-carousel"
            ref="mainCarousel"
            :options="options1"
            :as-nav-for="asNavFor1"
          >
            <div
              class="slide"
              v-for="(slide, index) in collection.photos"
              :key="index"
              :class="`slide--${index}`"
            >
              <image-loader :src="slide.url" />
            </div>
          </agile>
          <div id="carousel-controls">
            <agile
              id="thumbnail-carousel"
              ref="thumbnailCarousel"
              :options="options2"
              :as-nav-for="asNavFor2"
            >
              <div
                class="slide slide--thumbniail"
                v-for="(slide, index) in collection.photos"
                :key="index"
                :class="`slide--${index}`"
                @click="$refs.thumbnailCarousel.goTo(index)"
              >
                <image-loader :src="slide.url" />
              </div>
            </agile>
            <div id="carousel-btns">
              <button
                @click="$refs.mainCarousel.goToPrev()"
                class="cursor-pointer"
              >
                <ion-icon name="chevron-back-sharp"></ion-icon>
              </button>
              <button
                @click="$refs.mainCarousel.goToNext()"
                class="cursor-pointer"
              >
                <ion-icon name="chevron-forward-sharp"></ion-icon>
              </button>
            </div>
          </div>
        </div>
        <div id="photo-collec-view-right">
          <text-element
            title="Description"
            :paragraphs="collection.description"
          />
        </div>
      </section>
    </section>
    <div id="btm-btn-container" ref="btnContainer">
      <div>
        <transition name="fade">
          <button
            v-if="!scrolled"
            class="hover-underline cursor-pointer"
            id="scrollDownBtn"
            @click="scrollDown"
          >
            .view collection
          </button>
        </transition>
      </div>

      <transition name="fade">
        <div>
          <button
            class="hover-underline  cursor-pointer"
            id="closeBtn"
            @click="transitionOut"
          >
            .close collection
          </button>
        </div>
      </transition>
    </div>
  </fragment>
</template>
<script>
import TextElement from "../components/TextElement.vue";
import { VueAgile } from "vue-agile";
import { wHeight, getCurrentScrollY, initLS } from "@/helpers/layout.js";
import ImageLoader from "@/components/ImageLoader.vue";
import gsap, { Power2 } from "gsap";

export default {
  name: "PhotoCollection",
  components: {
    agile: VueAgile,
    "text-element": TextElement,
    "image-loader": ImageLoader
  },
  props: {
    collection: {
      type: Object
    },
    setCameraTo: {
      type: Function
    },
    currentXOffset: {
      type: Number,
      default: 21
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    },
    closeCollection: {
      type: Function
    }
  },
  data() {
    return {
      scroll: null,
      scrolled: false,
      asNavFor1: [],
      asNavFor2: [],
      options1: {
        dots: false,
        navButtons: false,
        fade: true,
        timing: "ease-in-out"
      },
      options2: {
        timing: "ease-in-out",
        centerMode: true,
        infinite: true,
        dots: false,
        navButtons: false,
        slidesToShow: 3,
        responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      }
    };
  },
  methods: {
    initLocomotive() {
      this.scroll = initLS(this.$refs.page, this.checkScrolled);
    },
    updateLS() {
      if (this.scroll) {
        this.scroll.update();
      }
    },
    scrollDown() {
      this.scroll.scrollTo(this.$refs.secondPage);
    },
    checkScrolled(e) {
      //second
      if (e.scroll.y >= wHeight() / 2 && !this.scrolled) {
        this.scrolled = true;
        this.adjustGL(true);
        //first
      } else if (e.scroll.y <= wHeight() / 2 && this.scrolled) {
        this.scrolled = false;
        this.adjustGL(false);
      }
    },
    setScrolled(bool) {
      this.scrolled = bool;
    },
    adjustGL(scrolled) {
      this.setScrolled(scrolled);
      if (scrolled) {
        this.setCameraTo({
          x: this.currentXOffset - 5,
          y: 2,
          z: 9
        });
      } else {
        this.setCameraTo({
          x: this.currentXOffset,
          y: -4.5,
          z: 6
        });
      }
    },
    transitionIn(callback) {
      gsap.to(this.$refs.page, {
        duration: this.tweenDuration * 2,
        y: 0,
        ease: Power2.easeOut,
        onComplete: callback || null
      });
      gsap.to(this.$refs.btnContainer, {
        duration: this.tweenDuration,
        opacity: 1
      });
    },
    transitionOut() {
      this.scroll.destroy();
      gsap.fromTo(
        this.$refs.page,
        {
          y: getCurrentScrollY(this.$refs.page)
        },
        {
          y: "100vh",
          duration: this.tweenDuration,
          ease: Power2.easeIn,
          onComplete: this.closeCollection
        }
      );
      gsap.to(this.$refs.btnContainer, {
        duration: this.tweenDuration,
        opacity: 0
      });
    }
  },
  mounted() {
    this.asNavFor1.push(this.$refs.thumbnailCarousel);
    this.asNavFor2.push(this.$refs.mainCarousel);
    this.adjustGL(false);
    this.$nextTick(() => {
      this.transitionIn(() => {
        this.initLocomotive();
      });
    });
  },
  beforeDestroy() {
    this.scroll.destroy();
  }
};
</script>
<style>
#photo-collec-page {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--black);
  transform: translateY(100vh);
}

#photo-collec-pres-page {
  height: 100vh;
  width: 100%;
  padding-top: var(--padding-top);
  display: grid;
  grid-template-columns: 60% 40%;
}

#photo-collec-pres-left {
  padding-top: calc(var(--padding-top) - 2rem);
  padding-left: var(--padding-horizontal);
  padding-right: var(--padding-horizontal);
  z-index: 5;
}

#photo-collec-title {
  position: relative;
  width: calc(100vw - 12rem);
  color: var(--white);
  margin-top: 0.5rem;
  text-align: left;
  z-index: 5;
}

#photo-collec-subtitle {
  text-align: left;
  margin-bottom: 1rem;
  text-transform: uppercase;
  z-index: 5;
}

#photo-collec-date {
  margin-top: 1rem;
  text-align: right;
  z-index: 5;
}

#photo-collec-pres-right {
  width: 100%;
  height: 100%;
  filter: brightness(0.8);
  z-index: 1;
}

#photo-collec-view-page {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 60% 40%;
  margin-top: var(--padding-top);
}

#photo-collec-view-left {
  height: 100%;
}

.slide {
  height: 100%;
  width: 100%;
}

.slide img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.agile__list,
.agile__track {
  height: 100%;
}

.agile__slide-active {
  border: none;
  outline: none;
}

#main-carousel {
  height: calc(100vh - var(--padding-top));
}

#carousel-controls {
  height: var(--padding-top);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

#thumbnail-carousel {
  height: 100%;
  width: 75%;
  flex: 0.75;
}

#thumbnail-carousel img {
  filter: grayscale(1);
  transition: 0.3s filter;
}

#thumbnail-carousel img:hover {
  filter: grayscale(0.3);
}

#carousel-btns {
  height: 100%;
  flex: 0.25;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

#carousel-btns button {
  padding: 0;
  height: 100%;
  width: 50%;
  flex: 1;
  border: none;
  transition: 0.3s background-color;
}

#carousel-btns button:hover {
  /* filter: invert(1); */
  background-color: rgba(40, 40, 40, 0.6);
}

#carousel-btns ion-icon {
  height: 1.5rem;
  width: 1.5rem;
  font-size: 1.5rem;
  color: var(--white);
}

#carousel-btns button:hover ion-icon {
  color: var(--light-grey);
}

#photo-collec-view-right {
  padding: var(--page-padding);
  padding-top: calc(var(--padding-top) + 6rem);
}

#btm-btn-container {
  position: fixed;
  bottom: 4rem;
  left: 6rem;
  right: 6rem;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
}

#scrollDownBtn,
#closeBtn {
  z-index: 6;
  pointer-events: all;
}
</style>
