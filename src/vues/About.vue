<template>
  <section id="about-page" ref="page">
    <div id="about-pres" ref="pres">
      <h1 ref="title">well hello</h1>
      <text-element
        title="About me"
        :paragraphs="
          `Hi, I'm Jean-Nicolas Veigel, a design enthousiast.
            
          I currently work as a freelance web developer, but I am also very interested in various forms of art and design.

          I like to experiment with new and exciting concepts and ideas, through different media, be it photography, development, graphic design or music.

          You'll find all revelant information about my journey below, and some of the projects I've created in the work section of this website

          Feel free to drop me a line.
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
        :paragraphs="
          `2018&mdash; Web Development Bootcamp, IronHack, Paris

        2017&mdash; DUT Techniques de Commercialisation, First year, IUT Robert Schuman, Strasbourg

        2016&mdash; Baccalauréat ES, Mention Bien, Gymnase Jean Sturm, Strasbourg`
        "
      />
    </div>

    <div class="about-info-top about-info about-info-right">
      <text-element
        title="Experience"
        :paragraphs="
          `
          2019&mdash; Freelance work as web developer

          2019&mdash; Wolfox, Service, Paris

          2018&mdash; CIC Bank, Summer job, Strasbourg Schiltigheim          

          2017&mdash; CIC Bank, Internship, Strasbourg Schiltigheim

          2013&mdash; TERTIA Solutions, Internship, Strasbourg Entzheim
          `
        "
      />
    </div>
    <div class="about-info-btm about-info about-info-left">
      <text-element
        title="Skills"
        :paragraphs="
          `I am proficient in most of the Adobe Creative Cloud Suite &mdash; Photoshop, Illustrator, Lightroom, Premiere Pro, XD and After Effects.

          When working on websites, I use several languages (Javascript, HMTL and CSS), frameworks (React, Angular, Vue, Redux), back-end services (Google Firebase and Developer Console, Amazon Web Services, Cloudinary) and databases (MongoDB, NoSQL, PostgreSQL).
          `
        "
      />
    </div>

    <div class="about-info-btm about-info about-info-right">
      <text-element
        title="Inspiration"
        :paragraphs="
          `
            My work is influenced by various trends and artists. I like to present data in a minimal way, using mainly typography.

            The recent resurgence of the brutalist movement has also had a great effect on me. The Japanese culture is also fascinating to me.

            Here are some of the artists that have helped shape my vision, in no particular order:

            Felipe Pantone &mdash; Ghostemain &mdash; Graeme Swinton &mdash; $uicideBoy$ &mdash; Eliott Grunewald &mdash; Julien Gachadoat &mdash; polygon1993 &mdash; Pierre Châtel
          `
        "
      />
    </div>

    <div id="about-contact">
      <h3>contact information</h3>
      <hr />
      <a href="mailto:hello@veigel.dev">
        <h2 class="fill-hover">hello@veigel.dev</h2>
      </a>
      <a href="tel:+33658238758">
        <h2 class="fill-hover">+33 6 58 23 87 58</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://instagram.com/chxmpetre"
      >
        <h2 class="fill-hover">insta /chxmpetre</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/blksnk"
      >
        <h2 class="fill-hover">github /blksnk</h2>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://linkedin.com/in/jnveigel"
      >
        <h2 class="fill-hover">linkedin /jnveigel</h2>
      </a>
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
        throttle(this.checkScroll, 50, {
          leading: true,
          trailing: true
        })
      );
      // this.scroll = initLS(this.$refs.page, this.checkScroll);
    },
    checkScroll(e) {
      const { y } = e.scroll;
      const pHeight = this.$refs.page.clientHeight - wHeight();
      const val = ((y / pHeight) * 100 * (21 - 7)) / 100 + 7;
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
          duration: this.tweenDuration * 2,
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
          duration: this.tweenDuration * 2,
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
  /* margin-bottom: 1rem; */
}
</style>
