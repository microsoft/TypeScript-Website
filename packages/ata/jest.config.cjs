module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: { module: "commonjs", isolatedModules: true },
      },
    ],
  },
}
