const { sep } = require("path");
console.log(process.cwd());
module.exports = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  testEnvironment: "node",
  testRegex: [
    // "/src/core_test/.*\\.(test|spec)?\\.(ts|tsx)$",
    // "/src/core_test/.*\\.(test|spec)?\\.(js|jsx)$",
    "/src/app/modules/.*\\.(test|spec)?\\.(js|jsx)$",
    "/src/app/modules/.*\\.(test|spec)?\\.(ts|tsx)$",
  ],
  moduleFileExtensions: ["ts", "js"],
  setupFiles: [
    process.cwd() + sep + "src\\core\\Initialisation\\test_intialize.ts",
  ],
};
