import { LitElement, html } from '../../../deps/lit/lit-core.min.js';

import getSheet from '../../shared/sheet.js';
import '../da-editor/da-editor.js';
import '../da-preview/da-preview.js';
import '../da-versions/da-versions.js';

const sheet = await getSheet('/blocks/edit/da-content/da-content.css');

export default class DaContent extends LitElement {
  static properties = { details: { attribute: false } };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  showPreview(e) {
    this.classList.add('show-preview');
    e.target.parentElement.classList.add('show-preview');
    this.shadowRoot.querySelector('da-preview').classList.add('show-preview');
  }

  showVersions(e) {
    this.classList.add('show-versions');
    e.target.parentElement.classList.add('show-versions');
    this.shadowRoot.querySelector('da-versions').classList.add('show-versions');
  }

  render() {
    return html`
      <div class="editor-wrapper">
        <da-editor path="${this.details.sourceUrl}"></da-editor>
        <div class="da-preview-menubar">
          <span class="da-preview-menuitem show-preview" @click=${this.showPreview}></span>
          <span class="da-versions-menuitem show-versions" @click=${this.showVersions}></span>
        </div>
      </div>
      <da-preview path=${this.details.previewUrl}></da-preview>
      <da-versions path=${this.details.previewUrl}></da-versions>
    `;
  }
}

customElements.define('da-content', DaContent);
