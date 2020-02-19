export const wHeight = () => window.innerHeight;
export const wWidth = () => window.innerWidth;
export const rem = () =>
  window.getComputedStyle(document.documentElement).fontSize.split("px")[0];

export const formatParagraphs = paragraph =>
  paragraph.split("\n").filter(item => item !== "");

export const getCurrentScrollY = el => {
  const { y, top } = el.getBoundingClientRect();
  return Math.max(y, top);
};
