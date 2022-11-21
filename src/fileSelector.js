import { $ } from './utils.js';

const select = $('select');

export function selectFile(callback) {
  select.onchange = function(event) {
    callback(event.target.files[0]);
  }
  select.click();
}
