import { noop, Time, isNullish, sleep, createElement } from './utils.js';

const { body } = document;
export class Dialog {
  _container = createElement({
    tagName: 'div',
    classList: ['dialog_container', 'hidden']
  });
  _background = createElement({
    tagName: 'div',
    classList: ['dialog_background']
  });
  _dialog = createElement({
    tagName: 'div',
    classList: ['dialog']
  });
  _title = createElement({
    tagName: 'div',
    classList: ['dialog_title'],
    text: '提示'
  });
  _content = createElement({
    tagName: 'div',
    classList: ['dialog_content']
  });
  _buttons = createElement({
    tagName: 'div',
    classList: ['dialog_buttons']
  });

  constructor({ cancellable = true } = {}) {
    this._background.addEventListener('click', () => cancellable ? this.close() : noop);
    this._dialog.appendChild(this._title);
    this._dialog.appendChild(this._content);
    this._dialog.appendChild(this._buttons);
    this._container.appendChild(this._background);
    this._container.appendChild(this._dialog);
  }

  title(title) {
    this._title.innerText = title;
    return this;
  }

  content(content, html = false) {
    if (typeof content === 'string') {
      if (html) this._content.innerHTML = content;
      else this._content.appendChild(createElement({
        tagName: 'p',
        text: content
      }));
    } else {
      this._content.appendChild(content);
    }
    return this;
  }

  button(text, func = noop) {
    const close = () => this.close();
    const button = createElement({
      tagName: 'span',
      classList: ['button'],
      text
    });
    button.addEventListener('click', async event => await func.call(this, close) !== false && close());
    this._buttons.appendChild(button);
    return this;
  }

  show() {
    body.appendChild(this._container);
    sleep(0.1 * Time.second).then(() => {
      this._container.classList.remove('hidden');
    });
    return this;
  }

  close() {
    this._container.classList.add('hidden');
    sleep(0.3 * Time.second).then(() => {
      body.removeChild(this._container);
    });
  }

  static show(content, title = '提示', options) {
    return new Dialog(options).title(title).content(content).button('确定').show();
  }
}