import autoprefixer from "autoprefixer";
import sortMediaQueries from "postcss-sort-media-queries";

export default {
  plugins: [
    autoprefixer(),
    sortMediaQueries({
      sort: "desktop-first",
    }),
  ],
};
