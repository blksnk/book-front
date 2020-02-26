<template>
  <div ref="loader" id="loader">
    <span id="loader-title">genmetsu.</span>

    <span id="loader-wrapper">
      <span>Loading</span>
      <span id="loader-anim"> {{ parseInt(current.number) }}% </span>
    </span>
  </div>
</template>

<script>
import gsap, { Power2 } from "gsap";
export default {
  name: "Loader",
  props: {
    preloaded: {
      type: Boolean,
      default: false
    },
    tweenDuration: {
      type: Number,
      default: 0.7
    }
  },
  data() {
    return {
      current: {
        number: 0,
        finished: false
      }
    };
  },
  methods: {
    loadingAnimation() {
      console.log(this.preloaded);

      gsap.to(this.current, {
        number: 75,
        duration: this.tweenDuration * 3,
        ease: Power2.easeInOut,
        onComplete: this.loadedAnimation
      });
    },
    loadedAnimation() {
      if (this.preloaded) {
        console.log(this.preloaded);
        gsap.killTweensOf(this.current, "number");
        gsap.to(this.current, {
          number: 100,
          duration: this.tweenDuration * 2,
          ease: Power2.easeInOut,
          onComplete: () => {
            if (!this.finished) {
              this.finished = true;
              this.transitionOut();
            }
          }
        });
      }
    },
    transitionOut() {
      gsap.to(this.$refs.loader, {
        opacity: 0,
        duration: this.tweenDuration,
        ease: Power2.easeIn,
        onComplete: () => {
          this.$emit("loaded");
        }
      });
    }
  },
  mounted() {
    this.loadingAnimation();
  },
  watch: {
    preloaded(next) {
      if (next) {
        this.loadedAnimation();
      }
    }
  }
};
</script>

<style>
#loader {
  z-index: 100;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  padding: 4rem 6rem;
  background-color: var(--white);
  color: var(--black);
  font-size: var(--font-size-small);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  /* mix-blend-mode: multiply; */
}

#loader-wrapper {
  display: flex;
  flex-direction: column;
  justify-items: flex-end;
  align-items: flex-start;
}

#loader-anim {
  margin-left: 2rem;
}
</style>
