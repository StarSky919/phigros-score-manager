import { noop, Time, isNullish, sleep, createElement } from './utils.js';

const { body } = document;
export class Dialog {
  _background = createElement({
    tagName: 'div',
    classList: ['dialog_background', 'hidden']
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

  constructor({ bgclick = true } = {}) {
    this._background.addEventListener('click', () => bgclick ? this.close() : noop);
    this._dialog.appendChild(this._title);
    this._dialog.appendChild(this._content);
    this._dialog.appendChild(this._buttons);
  }

  title(title) {
    this._title.innerText = title;
    return this;
  }

  content(content, html = false) {
    if (html) {
      if (typeof content === 'string') this._content.innerHTML = content;
      else this._content.appendChild(content);
    } else {
      const message = createElement({
        tagName: 'p',
        text: content
      });
      this._content.appendChild(message);
    }
    return this;
  }

  button(text, func = () => this.close()) {
    const button = createElement({
      tagName: 'span',
      classList: ['button'],
      text
    });
    button.addEventListener('click', func.bind(this, () => this.close()));
    this._buttons.appendChild(button);
    return this;
  }

  show() {
    body.appendChild(this._background);
    body.appendChild(this._dialog);
    sleep(25).then(() => {
      this._background.classList.remove('hidden');
      this._dialog.classList.add('display');
    });
    return this;
  }

  close() {
    this._background.classList.add('hidden');
    this._dialog.classList.remove('display');
    sleep(0.3 * Time.second).then(() => {
      body.removeChild(this._dialog);
      body.removeChild(this._background);
    });
  }

  static show(content, title = '提示', options) {
    return new Dialog(options).title(title).content(content).button('确定').show();
  }
}
