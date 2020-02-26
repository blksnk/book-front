import locomotiveScroll from "locomotive-scroll";

export const wHeight = () => window.innerHeight;
export const wWidth = () => window.innerWidth;
export const rem = () =>
  parseInt(
    window.getComputedStyle(document.documentElement).fontSize.split("px")[0]
  );

export const formatParagraphs = paragraph =>
  paragraph.split("\n").filter(item => item !== "");

export const replaceEmDash = string => string.split("&mdash;").join("\u2014");

export const getCurrentScrollY = el => {
  const { y, top } = el.getBoundingClientRect();
  return Math.max(y, top);
};

export const initLS = (el, listener) => {
  const ls = new locomotiveScroll({
    el,
    smooth: true,
    smoothMobile: true,
    inertia: 0.7,
    getSpeed: true
  });
  if (listener) {
    ls.on("scroll", listener);
  }
  return ls;
};
