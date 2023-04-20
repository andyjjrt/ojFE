import KatexAutoRender from "katex/dist/contrib/auto-render";

const vKatex = {
  updated(el: HTMLElement) {
    KatexAutoRender(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
    });
  },
};

export default vKatex;
