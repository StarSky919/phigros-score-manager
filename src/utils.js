export const $ = id => document.getElementById(id);
export function noop() {}

const p0 = (num, length = 2) => num.toString().padStart(length, '0');
const millisecond = 1;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
export const Time = {
  millisecond,
  second,
  minute,
  hour,
  day,
  week,
  template(template, timestamp) {
    const time = new Date(timestamp);
    return template
      .replace('yyyy', time.getFullYear().toString())
      .replace('yy', time.getFullYear().toString().slice(2))
      .replace('MM', p0(time.getMonth() + 1))
      .replace('dd', p0(time.getDate()))
      .replace('hh', p0(time.getHours()))
      .replace('mm', p0(time.getMinutes()))
      .replace('ss', p0(time.getSeconds()))
      .replace('SSS', p0(time.getMilliseconds(), 3));
  },
  formatTimeInterval(ms) {
    const abs = Math.abs(ms);
    if (abs >= day - hour / 2) {
      return Math.round(ms / day) + 'd';
    } else if (abs >= hour - minute / 2) {
      return Math.round(ms / hour) + 'h';
    } else if (abs >= minute - second / 2) {
      return Math.round(ms / minute) + 'm';
    } else if (abs >= second) {
      return Math.round(ms / second) + 's';
    }
    return ms + 'ms';
  }
}

export function isNullish(value) {
  return value === void 0 || value === null;
}

export function random(min, max) {
  return () => Math.round(Math.random() * (max - min) + min);
}

export function rounding(num, digit = 0) {
  return (Math.round(num * (10 ** digit)) / 10 ** digit).toFixed(digit);
}

export function sleep(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

export function createElement({ tagName, id, classList, attr, style, cssText, text, html }) {
  const el = document.createElement(tagName);
  id && (el.id = id);
  classList && el.classList.add(...classList);
  attr && Object.keys(attr).forEach(name => el.setAttribute(name, attr[name]));
  style && Object.keys(style).forEach(name => el.style[name] = style[name]);
  cssText && (el.style.cssText += cssText);
  text && (el.innerText = text);
  html && (el.innerHTML = html);
  return el;
}

export function getRating(acc, difficulty) {
  if (acc < 70) return 0;
  return ((acc - 55) / 45) ** 2 * difficulty;
}

export function getAcc(rating, difficulty) {
  return (rating / difficulty) ** 0.5 * 45 + 55;
}

export function parseRecordID(id) {
  return /(.*)\.Record\.(.*)/.exec(id);
}

export function compile(node, data) {
  const pattern = /\{\{\s*(\S+)\s*\}\}/;
  if (node.nodeType === 3) {
    let result;
    while (result = pattern.exec(node.nodeValue)) {
      const key = result[1];
      const value = key.split('.').reduce((p, c) => p[c], data);
      node.nodeValue = node.nodeValue.replace(pattern, value);
    }
    return;
  }
  node.childNodes.forEach(node => compile(node, data));
}

export function createRecordBox(data) {
  const box = $('record_box').content.cloneNode(true).children[0];
  const s = data.score || 0;
  const a = data.acc;
  data.rank = s < 7e5 ? 'F' : s < 82e4 ? 'C' : s < 88e4 ? 'B' : s < 92e4 ? 'A' : s < 96e4 ? 'S' : s < 1e6 ? 'V' : 'φ';
  data.score = s.toString().padStart(6, '0');
  data.acc = `${rounding(a, 2)}%`;
  if (a < 100 && data.O && data.O <= 100) data.acc += ` (${rounding(data.O < 70 ? 70 : data.O < 100 ? data.O : phi.rating < difficulty ? 100 : data.O, 2)}%)`;
  box.querySelector('.rank').style.color = s === 1e6 ? '#F6F600' : data.c ? '#0077FF' : s >= 7e5 ? '#444444' : '#BFBFBF';
  return compile(box, data), box;
}

export function createSongInfo(data) {
  const box = $('song_info').content.cloneNode(true).children[0];
  data.bpm = data.bpm || '暂无数据';
  data.length = data.length || '暂无数据';
  const img = box.querySelector('img');
  img.src = data.img;
  img.addEventListener('click', event => createElement({ tagName: 'a', attr: { href: img.src, target: '_blank' } }).click());
  img.addEventListener('error', event => img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAABsCAYAAADJ/DYiAAAAAXNSR0IArs4c6QAAAm5JREFUeF7t07ENACAMBDHYf8lsAhITcL1Tf2Xl9syc5QgQ+BbYovm2MiTwBETjEQhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJ3ABvvSHkNEIMfAAAAAASUVORK5CYII=');
  for (const dn in data.chart) {
    const chart = $('chart_info').content.cloneNode(true);
    compile(chart, Object.assign({ dn }, data.chart[dn]));
    box.querySelector('.info').appendChild(chart);
  }
  return compile(box, data), box;
}
