import { LitElement, html } from 'https://cdn.skypack.dev/lit-element'

window.customElements.define('custom-tag', class extends LitElement {
  render () {
    return html`
      <p>This is a very simple Web Component</p>
    `
  }
})
