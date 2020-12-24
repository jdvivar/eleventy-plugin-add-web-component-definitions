const AddWebComponentDefinitions = require( "./add-web-component-definitions" );

module.exports = {
  configFunction: function (eleventyConfig, options = {}) {
    eleventyConfig.addTransform(
      'add-web-component-definitions',
      AddWebComponentDefinitions.bind(null, options)
    );
  }
}