import { LitElement, html } from '../../../deps/lit/lit-core.min.js';
import { getNx } from '../../../scripts/utils.js';

// Styles
const { default: getStyle } = await import(`${getNx()}/utils/styles.js`);
const STYLE = await getStyle(import.meta.url);

export default class DaActionBar extends LitElement {
  static properties = {
    items: { attribute: false },
    _canPaste: { state: true },
  };

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [STYLE];
  }

  async update(props) {
    if (props.has('items')) {
      // Reset state when items go empty
      if (this.items.length === 0) {
        this._canPaste = false;
      }
    }

    super.update(props);
  }

  handleClear() {
    this._canPaste = false;
    const opts = { detail: true, bubbles: true, composed: true };
    const event = new CustomEvent('clearselection', opts);
    this.dispatchEvent(event);
  }

  handleRename() {
    const opts = { detail: true, bubbles: true, composed: true };
    const event = new CustomEvent('rename', opts);
    this.dispatchEvent(event);
  }

  handleCopy() {
    this._canPaste = true;
  }

  handlePaste() {
    const opts = { bubbles: true, composed: true };
    const event = new CustomEvent('onpaste', opts);
    this.dispatchEvent(event);
  }

  handleDelete() {
    const opts = { bubbles: true, composed: true };
    const event = new CustomEvent('ondelete', opts);
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="da-action-bar">
        <div class="da-action-bar-left-rail">
          <button
            class="close-circle"
            @click=${this.handleClear}
            aria-label="Unselect items">
            <img src="/blocks/browse/da-browse/img/CrossSize200.svg" />
          </button>
          <span>${this.items.length} selected</span>
        </div>
        <div class="da-action-bar-right-rail">
          <button
            @click=${this.handleRename}
            class="rename-button ${this.items.length === 1 ? '' : 'hide'} ${this._canPaste ? 'hide' : ''}">
            <img src="/blocks/browse/da-browse/img/Smock_TextEdit_18_N.svg" />
            <span>Rename</span>
          </button>
          <button
            @click=${this.handleCopy}
            class="copy-button ${this._canPaste ? 'hide' : ''}">
            <img src="/blocks/browse/da-browse/img/Smock_Copy_18_N.svg" />
            <span>Copy</span>
          </button>
          <button
            @click=${this.handlePaste}
            class="copy-button ${this._canPaste ? '' : 'hide'}">
            <img src="/blocks/browse/da-browse/img/Smock_Copy_18_N.svg" />
            <span>Paste</span>
          </button>
          <button
            @click=${this.handleDelete}
            class="delete-button">
            <img src="/blocks/browse/da-browse/img/Smock_Delete_18_N.svg" />
            <span>Delete</span>
          </button>
        </div>
      </div>`;
  }
}

customElements.define('da-actionbar', DaActionBar);