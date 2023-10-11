const webpack = require("webpack");

module.exports = {
  devServer: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    },
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve("buffer"),
          https: require.resolve("https-browserify"),
          http: require.resolve("stream-http"),
          url: require.resolve("url")
        },
      },
    },
  },
};
