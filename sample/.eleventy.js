const AddWebComponentDefinitions = require("../")

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(
    AddWebComponentDefinitions,
    { path: tag => `/my-components/${tag}.js`,
      verbose: true
    }
  );
};