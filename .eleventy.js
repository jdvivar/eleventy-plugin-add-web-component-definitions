const AddWebComponentDefinitions = require( "./add-web-component-definitions" );

module.exports = {
  configFunction: function (eleventyConfig) {
    eleventyConfig.addTransform('add-web-component-definitions', AddWebComponentDefinitions);
  }
}