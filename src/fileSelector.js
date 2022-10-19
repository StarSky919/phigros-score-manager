import { $, createElement } from './utils.js';

const select = $('select');

export function selectFile(callback) {
  function cb(event) {
    const file = event.target.files[0];
    callback(file);
    select.removeEventListener('change', cb);
  }
  select.addEventListener('change', cb);
  select.click();
}
