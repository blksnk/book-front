import gsap, { Power2 } from "gsap";

const DEFAULT_DURATION = 0.7;

export function fadeIn(el, dur, ease) {
  gsap.fromTo(
    el,
    {
      opacity: 0
    },
    {
      opacity: 1,
      duration: dur || DEFAULT_DURATION,
      ease: selectEase(ease)
    }
  );
}

export function selectEase(type) {
  switch (type) {
    case "in":
      return Power2.easeIn;
    case "out":
      return Power2.easeOut;
    case "in out":
      return Power2.easeInOut;
    default: {
      return null;
    }
  }
}
