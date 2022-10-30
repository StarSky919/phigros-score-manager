import { noop, Time, isNullish, sleep, createElement } from './utils.js';

const { body } = document;
export class Dialog {
  _background = createElement('div');
  _dialog = createElement('div');
  _title = createElement('div');
  _content = createElement('div');
  _buttons = createElement('div');

  constructor({ bgclick = true } = {}) {
    this._background.classList.add('dialog_background', 'hidden');
    this._background.addEventListener('click', () => bgclick ? this.close() : noop);
    this._dialog.classList.add('dialog');
    this._title.classList.add('dialog_title');
    this._title.innerText = '提示';
    this._dialog.appendChild(this._title);
    this._content.classList.add('dialog_content');
    this._dialog.appendChild(this._content);
    this._buttons.classList.add('dialog_buttons');
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
      const message = createElement('p');
      message.innerText = content;
      this._content.appendChild(message);
    }
    return this;
  }

  button(text, func = () => {}) {
    const button = createElement('span');
    button.innerText = text;
    button.classList.add('button');
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

  static show(content, title = '提示') {
    return new Dialog().title(title).content(content).button('确定', close => close()).show();
  }
}
