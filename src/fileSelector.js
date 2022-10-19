import { $, createElement } from './utils.js';

const select = $('select');

export function selectFile(mime, callback) {
  /*const selectFile = createElement('input');
  selectFile.type = 'file';
  selectFile.accept = mime;*/
  function cb(event) {
    const file = event.target.files[0];
    callback(file);
    select.removeEventListener('change', cb);
  }
  select.addEventListener('change', cb);
  select.click();
}
