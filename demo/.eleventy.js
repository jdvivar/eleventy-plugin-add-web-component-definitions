const AddWebComponentDefinitions = require('../')

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(
    AddWebComponentDefinitions,
    { 
      path: tag => `/my-components/${tag}.js`,
      verbose: true
    }
  );

  eleventyConfig.addPassthroughCopy('demo/my-components');

  return {
    dir: {
      input: "demo",
      output: "demo/_site"
    }
  };
};
