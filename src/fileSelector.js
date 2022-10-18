import { createElement } from './utils.js';

export function selectFile(mime, callback) {
  const selectFile = createElement('input');
  selectFile.type = 'file';
  selectFile.accept = mime;
  selectFile.addEventListener('change', event => {
    const file = event.target.files[0];
    callback(file);
  });
  selectFile.click();
}
