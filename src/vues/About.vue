<template>
  <section id="about-page" ref="page">
    <div id="about-pres" ref="pres">
      <h1 ref="title">well hello</h1>
      <text-element
        title="About me"
        :paragraphs="
          `Commodo aliqua id ullamco incididunt sint exercitation qui ut id nulla id reprehenderit adipisicing amet eu incididunt amet labore.

          Anim aliquip elit elit aliquip in officia sit et excepteur consectetur velit laboris est est enim magna sit sunt ex ex magna ut pariatur reprehenderit do excepteur et duis et dolore occaecat velit excepteur pariatur incididunt ullamco do.

          Lorem ipsum reprehenderit sed enim aute voluptate in amet fugiat labore deserunt cupidatat dolor sunt.
          `
        "
      />
    </div>
    <img
      id="about-img"
      ref="img"
      src="@/assets/images/dark.jpg"
      data-scroll
      data-scroll-direction="horizontal"
      data-scroll-speed="-2"
    />
    <div class="about-info-top about-info about-info-left">
      <text-element
        title="Education"
        paragraphs="Adipisicing in aliquip fugiat voluptate quis dolor reprehenderit et dolore aute est ad nulla id voluptate minim sint quis."
      />
    </div>

    <div class="about-info-top about-info about-info-right">
      <text-element title="Experience" />
    </div>
    <div class="about-info-btm about-info about-info-left">
      <text-element title="Skills" />
    </div>

    <div class="about-info-btm about-info about-info-right">
      <text-element title="Inspiration" />
    </div>

    <div id="about-contact">
      <h3>contact information</h3>
      <hr />
      <h2>hello@veigel.dev</h2>
      <h2>+33 6 58 23 87 58</h2>
      <h2>insta /chxmpetre</h2>
      <h2>github /blksnk</h2>
      <h2>linkedin /jnveigel</h2>
    </div>
  </section>
</template>

<script>
import { initLS, wHeight } from "../helpers/layout.js";
import { throttle } from "@/helpers/math.js";
import gsap, { Power2 } from "gsap";
import TextElement from "../components/TextElement.vue";
export default {
  name: "About",
  components: {
    "text-element": TextElement
  },
  props: {
    setCameraTo: {
      type: Function
    },
    resetSelection: {
      type: Function
    },
    setActiveIndex: {
      type: Function
    },
    setAllMeshesAsTransparentWireframe: {
      type: Function
    },
    tweenDuration: {
      default: 0.7
    }
  },
  data() {
    return {
      scroll: null,
      scrolled: 0
    };
  },
  methods: {
    setupGL() {
      this.resetSelection();
      this.setAllMeshesAsTransparentWireframe();
      this.setActiveIndex(2);
      this.setCameraInit();
    },
    setCameraInit() {
      this.setCameraTo({
        x: 7,
        y: -10,
        z: 16,
        r: {
          x: 0,
          y: 0,
          z: 90
        }
      });
    },
    initLocomotive() {
      this.scroll = initLS(
        this.$refs.page,
        throttle(this.checkScroll, 100, {
          leading: true,
          trailing: false
        })
      );
      // this.scroll = initLS(this.$refs.page, this.checkScroll);
    },
    checkScroll(e) {
      const { y } = e.scroll;
      const pHeight = this.$refs.page.clientHeight - wHeight();
      const val = ((y / pHeight) * 100 * (21 - 7)) / 100 + 7;
      console.log(val);
      this.setCameraTo({
        x: val,
        y: -10,
        z: 16,
        r: {
          x: 0,
          y: 0,
          z: 90
        }
      });
    },
    transitionIn() {
      const text = this.$refs.page.querySelectorAll("div.text-element");
      gsap.fromTo(
        this.$refs.img,
        {
          y: "-100vh"
        },
        {
          y: 0,
          duration: this.tweenDuration * 2,
          ease: Power2.easeOut,
          onComplete: this.initLocomotive
        }
      );
      gsap.fromTo(
        this.$refs.title,
        {
          x: "-100%"
        },
        {
          x: 0,
          duration: this.tweenDuration,
          delay: this.tweenDuration,
          ease: Power2.easeOut
        }
      );
      gsap.fromTo(
        text,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: this.tweenDuration,
          delay: this.tweenDuration * 2
        }
      );
    }
  },
  mounted() {
    this.setupGL();
    this.$nextTick(this.transitionIn);
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.destroy();
    }
  }
};
</script>

<style>
#about-page {
  width: 100%;
  padding-bottom: var(--padding-bottom);
  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(auto-fill, minmax(max-content, 100vh));
}

#about-pres {
  grid-column: 1 / 3;
  padding-top: calc(var(--padding-top) * 2 - 2rem);
  padding-left: var(--padding-horizontal);
  padding-right: var(--padding-horizontal);
  z-index: 2;
  height: 100vh;
}

#about-pres h1 {
  color: var(--white);
  width: calc(100vw - 12rem);
  margin-bottom: 4rem;
  transform: translateX(-100%);
}

#about-img {
  height: calc(100vh - var(--padding-top));
  width: 100%;
  grid-column: 3 / 6;
  z-index: 1;
  filter: grayscale(1);
}

.about-info {
  /* margin-bottom: var(--padding-bottom); */
}

.about-info-top {
  grid-row: 2 / 2;
}

.about-info-btm {
  grid-row: 3 / 3;
}

.about-info-left {
  grid-column: 1 / 3;
  padding-left: var(--padding-horizontal);
}

.about-info-right {
  grid-column: 3 / 5;
}

#about-contact {
  grid-row: 4 / 4;
  grid-column: 1 / 5;
  width: calc(50% + var(--padding-top) * 3);
  margin-top: 4rem;
  padding-left: var(--padding-horizontal);
  padding-right: var(--paddin-right);
}

#about-contact hr {
  margin-bottom: 1rem;
}

#about-contact h2 {
  overflow-wrap: break-word;
  margin-bottom: 1rem;
}
</style>
