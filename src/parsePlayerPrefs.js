function t(t) {
  let e, n, o, r, c = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756],
    s = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344],
    l = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584],
    a = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928],
    i = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080],
    d = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312],
    f = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154],
    g = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696],
    h = [134873602, 134228224, 16789505, 604700676, 83894272, 67702788, 84148236, 331780, 67436808, 331778, 337707305, 266240, 270606632, 537264160, 268501296, 604635172, 656384, 169878272, 34079744, 136323081, 34605056, 3154952, 34603008, 288367640, 704643584, 286262792, 671221248, 303041536, 134873602, 436209664, 287318033, 537526278],
    u = atob(t),
    m = u.length,
    p = [30, -2, -2],
    x = 8 - m % 8,
    y = 0,
    A = 1342195456,
    C = 1375752960,
    I = '';
  for (u += String.fromCharCode(x).repeat(x); y < m;) {
    o = A, r = C, A = e = u.charCodeAt(y++) << 24 | u.charCodeAt(y++) << 16 | u.charCodeAt(y++) << 8 | u.charCodeAt(y++), C = n = u.charCodeAt(y++) << 24 | u.charCodeAt(y++) << 16 | u.charCodeAt(y++) << 8 | u.charCodeAt(y++), e ^= (x = 252645135 & (e >>> 4 ^ n)) << 4, e ^= (x = 65535 & (e >>> 16 ^ (n ^= x))) << 16, e ^= x = 858993459 & ((n ^= x) >>> 2 ^ e), e ^= x = 16711935 & ((n ^= x << 2) >>> 8 ^ e), e = (e ^= (x = 1431655765 & (e >>> 1 ^ (n ^= x << 8))) << 1) << 1 | e >>> 31, n = (n ^= x) << 1 | n >>> 31;
    for (let t = p[0]; t != p[1]; t += p[2]) {
      let o = n ^ h[t],
        r = (n >>> 4 | n << 28) ^ h[t + 1];
      x = e, e = n, n = x ^ (s[o >>> 24 & 63] | a[o >>> 16 & 63] | d[o >>> 8 & 63] | g[63 & o] | c[r >>> 24 & 63] | l[r >>> 16 & 63] | i[r >>> 8 & 63] | f[63 & r]);
    }
    x = e, e = n, n = (n = x) >>> 1 | n << 31, n ^= x = 1431655765 & ((e = e >>> 1 | e << 31) >>> 1 ^ n), n ^= (x = 16711935 & (n >>> 8 ^ (e ^= x << 1))) << 8, n ^= (x = 858993459 & (n >>> 2 ^ (e ^= x))) << 2, n ^= x = 65535 & ((e ^= x) >>> 16 ^ n), n ^= x = 252645135 & ((e ^= x << 16) >>> 4 ^ n), e ^= x << 4, e ^= o, n ^= r, I += String.fromCharCode(e >>> 24, e >>> 16 & 255, e >>> 8 & 255, 255 & e, n >>> 24, n >>> 16 & 255, n >>> 8 & 255, 255 & n);
  }
  return function(t) {
    let e = '';
    for (let n = 0; n < t.length; n += 2) {
      let o = t.charCodeAt(n),
        r = t.charCodeAt(n + 1);
      e += String.fromCharCode((r << 8) + o);
    }
    return e;
  }(I.slice(0, -I.charCodeAt(I.length - 1)));
}

function e(t) {
  let e = Array.from(new Array(256), ((t, e) => 128 & e ? e << 1 & 255 ^ 27 : e << 1)),
    n = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],
    o = [98, 127, 241, 148, 33, 133, 224, 17, 200, 21, 232, 30, 99, 155, 154, 0, 0, 28, 118, 107, 130, 108, 41, 189, 150, 87, 133, 137, 241, 154, 111, 214, 219, 215, 7, 53, 250, 82, 231, 36, 50, 71, 15, 58, 81, 220, 149, 58, 209, 154, 92, 235, 83, 246, 117, 86, 197, 161, 240, 223, 52, 59, 159, 9, 59, 12, 6, 45, 193, 94, 225, 9, 243, 25, 238, 51, 162, 197, 123, 9, 235, 60, 125, 234, 184, 202, 8, 188, 125, 107, 248, 99, 73, 80, 103, 106, 108, 137, 4, 22, 173, 215, 229, 31, 94, 206, 11, 44, 252, 11, 112, 37, 91, 23, 44, 213, 227, 221, 36, 105, 158, 182, 220, 10, 215, 230, 187, 96, 234, 99, 212, 24, 71, 180, 49, 7, 25, 122, 58, 43, 229, 113, 74, 14, 130, 180, 250, 126, 97, 105, 222, 23, 255, 223, 2, 29, 40, 57, 185, 125, 232, 53, 43, 44, 175, 129, 26, 43, 182, 251, 32, 0, 83, 138, 106, 14, 111, 202, 248, 213, 14, 163, 38, 194, 241, 124, 36, 223, 217, 69, 157, 162, 166, 107, 17, 25, 9, 234, 11, 50, 191, 17, 43, 50, 236, 155, 65, 60, 161, 222, 123, 62, 175, 125, 93, 252, 94, 1, 121, 35, 135, 68, 228, 129, 253, 2, 29, 14, 244, 232, 22, 60, 75, 249, 61, 14, 167, 98, 124, 50],
    r = [190, 86, 22, 127, 131, 218, 59, 239, 239, 248, 24, 97, 165, 197, 243, 205],
    c = atob(t).split('').map((t => t.charCodeAt()));
  return new TextDecoder().decode(Uint8Array.from(function(t) {
    function a(t) {
      for (let e = 0; e < 16; e++) t[e] = n[t[e]];
    }

    function i(t) {
      let e = Array.from(new Array(16), ((t, e) => 13 * e & 15)),
        n = t.slice();
      for (let o = 0; o < 16; o++) t[o] = n[e[o]];
    }

    function d(t, e) {
      for (let n = 0; n < 16; n++) t[n] ^= e[n];
    }

    function f(t) {
      for (let n = 0; n < 16; n += 4) {
        let o = t[n + 0],
          r = t[n + 1],
          c = t[n + 2],
          s = t[n + 3],
          l = o ^ r ^ c ^ s,
          a = e[l],
          i = e[e[a ^ o ^ c]] ^ l,
          d = e[e[a ^ r ^ s]] ^ l;
        t[n + 0] ^= i ^ e[o ^ r], t[n + 1] ^= d ^ e[r ^ c], t[n + 2] ^= i ^ e[c ^ s], t[n + 3] ^= d ^ e[s ^ o];
      }
    }

    let c = t.slice(),
      s = c.length,
      l = r;
    for (let t = 0; t < s; t += 16) {
      let e = c.slice(t, t + 16);
      d(e, o.slice(224, 240)), i(e), a(e);
      for (let t = 208; t >= 16; t -= 16) d(e, o.slice(t, t + 16)), f(e), i(e), a(e);
      d(e, o.slice(0, 16));
      for (let t = 0; t < 16; t++) e[t] ^= l[t];
      for (let e = 0; e < 16; e++) l[e] = c[t + e];
      for (let n = 0; n < 16; n++) c[t + n] = e[n];
    }
    return c.slice(0, -c[c.length - 1]);
  }(c)));
}

export function parsePlayerPrefs(xml) {
  const nodes = new DOMParser().parseFromString(xml, "text/xml").querySelectorAll("map>string");
  const data = {};
  const process = function(func, data) {
    const f = value => func(decodeURIComponent(value));
    for (const elm of nodes) try {
      const key = f(elm.getAttribute("name"));
      const value = f(elm.textContent);
      /.*\.Record\..*/.test(key) ? data[key] = JSON.parse(value) : ["ChallengeModeRank", "playerID"].includes(key) && (data[key] = value);
    } catch (err) {}
    return process;
  }
  process(t, data)(e, data);
  if(Object.keys(data).length === 0) throw new Error('Empty XML file');
  return data;
}
