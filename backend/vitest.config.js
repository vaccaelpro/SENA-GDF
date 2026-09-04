module.exports = {
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.{js,mjs}"],
    setupFiles: ["./src/setupTests.js"],
  },
};