import { isNullish } from './utils.js';
import { parsePlayerPrefs } from './parsePlayerPrefs.js';
import { parseAndroidBackup } from './parseAndroidBackup.js';
export { parsePlayerPrefs } from './parsePlayerPrefs.js';

export function parseFiles(file) {
  const extension = /.*\.(xml|txt|ab)$/g.exec(file.name)[1];
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', async event => {
      const { result } = event.target;
      try {
        if (extension === 'xml') {
          resolve(parsePlayerPrefs(result));
        }
        if (extension === 'ab') {
          resolve(parsePlayerPrefs(await parseAndroidBackup(new Uint8Array(result))));
        }
        if (extension === 'txt') {
          const { playerID, ChallengeModeRank, records } = JSON.parse(decodeURI(result));
          resolve({ playerID, ChallengeModeRank, ...records });
        }
        throw new Error('Unexpected file type');
      } catch (err) {
        reject(err);
      }
    });
    ['xml', 'txt'].includes(extension) ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  });
}
