function bytesToString(byteArray) {
  if (!byteArray.forEach) {
    return String.fromCharCode(byteArray);
  }
  const str = [];
  byteArray.forEach(byte => {
    str.push(String.fromCharCode(byte));
  });
  return str.join('');
}

function hexToBytes(hex) {
  const arr = [];
  for (let i = 0, len = hex.length / 2; i < len; i++) {
    const subStr = hex.substr(0, 2);
    arr.push(parseInt(subStr, 16));
    hex = hex.replace(subStr, "");
  }
  return arr;
}

function getLength(arr, offset) {
  let length = 0;
  while (true) {
    if (arr[offset + length] === 0x0A) {
      return length;
    }
    length++;
  }
}

export async function parseAndroidBackup(ta) {
  let offset = 0;

  if (bytesToString(ta.subarray(offset, offset + 14)) != 'ANDROID BACKUP') {
    throw new Error('Invalid Android backup file');
  }
  offset += 15;
  if (ta[offset] !== 0x35) {
    throw new Error('Unsupported Android backup version');
  }
  offset += 2;
  const isCompressed = !!parseInt(bytesToString(ta[offset]));
  offset += 2;

  const eLength = getLength(ta, offset);
  const encrypted = bytesToString(ta.subarray(offset, offset + eLength));
  offset += eLength + 1;
  if (encrypted === 'AES-256') {
    throw new Error('Unsupported encrypted file');
  }
  if (encrypted !== 'none') {
    throw new Error('Invalid Android backup file');
  }

  const tarData = isCompressed ? pako.inflate(ta.slice(offset)) : ta.slice(offset);
  offset = 0;
  while (offset < tarData.length) {
    if (/.*v2\.playerprefs\.xml.*/g.test(bytesToString(tarData.subarray(offset, offset + 100)))) {
      offset += 124;
      const size = bytesToString(tarData.subarray(offset, offset + 11));
      offset += 388;
      return bytesToString(tarData.subarray(offset, offset + size));
    }
    offset += 512;
  }
}
