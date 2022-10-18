export const $ = id => document.getElementById(id);
export const $$ = query => document.querySelector(query);
export const $$$ = query => document.querySelectorAll(query);

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

export function rounding(num, digit) {
  return (Math.round(num * (10 ** digit)) / 10 ** digit).toFixed(digit);
}

export function sleep(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

export function debounce(callback, delay) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    const [that, args] = [this, arguments];
    timeout = setTimeout(function() {
      callback.apply(that, args);
      clearTimeout(timeout);
      timeout = null;
    }, delay);
  }
}

export function createElement(tag) {
  return document.createElement(tag);
}
