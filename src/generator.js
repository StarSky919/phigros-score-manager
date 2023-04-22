import { $, Time, isNullish, sleep, rounding, getRating, createElement } from './utils.js';
import { Dialog } from './dialog.js';

function loadImage(img, url) {
  return new Promise((resolve, reject) => {
    img.crossOrigin = '*';
    img.addEventListener('load', event => resolve());
    img.addEventListener('error', event => img.src = 'https://website-assets.starsky919.xyz/phigros/images/null.png');
    img.src = url;
  });
}

const cav = createElement({
  tagName: 'canvas',
  style: {
    width: '100%',
    height: 'auto'
  }
});
const ctx = cav.getContext('2d');

export async function generate(version, songData, { playerID, ChallengeModeRank, rankingScore, records }) {
  const CMRRank = ['--', 'Green', 'Blue', 'Orange', 'Gold', 'Rainbow'];
  const realHeight = cav.height = 3200;
  const realWidth = cav.width = cav.height / 16 * 9;
  const padding = realHeight / 40;
  const row = 13;
  const column = 2;
  const loading = new Dialog({ cancellable: false })
    .title('正在生成图片，请稍等……')
    .content(cav)
    .show();

  try {
    const bg = new Image();
    await loadImage(bg, 'https://website-assets.starsky919.xyz/phigros/images/background.png');
    ctx.drawImage(bg, 1024, 0, 607.5, 1080, 0, 0, realWidth, realHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(padding, padding, realWidth - padding * 2, realHeight - padding * 2);

    ctx.fillStyle = '#F9F9F9';
    ctx.textBaseline = 'top';

    ctx.font = `${realHeight / 48}px Saira, HYWenHei`;
    ctx.textAlign = 'left';
    ctx.fillText(`${playerID} (${rounding(rankingScore, 2)})`, padding * 2, padding * 2, realWidth / 2 - padding * 2);
    ctx.textAlign = 'right';
    ctx.fillText(`Phigros Player Info`, realWidth - padding * 2, padding * 2);
    ctx.font = `${realHeight / 80}px Saira, HYWenHei`;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillText(`Real Ranking Score: ${rounding(rankingScore, 5)}`, padding * 2, padding * 3.4);
    ctx.fillText(`Challenge Mode Rank: ${CMRRank[Math.floor(ChallengeModeRank / 100)]} ${ChallengeModeRank === 0 ? '' : ChallengeModeRank % 100}`, padding * 2, padding * 4);
    ctx.textAlign = 'right';
    ctx.fillText(`Generated by Phigros Score Manager`, realWidth - padding * 2, padding * 3.4);
    ctx.fillText(new Date().toLocaleString(), realWidth - padding * 2, padding * 4);

    ctx.textBaseline = 'top';
    ctx.lineWidth = realHeight / 1000;
    ctx.strokeStyle = '#F9F9F9';

    const line1Y = padding * 4.5;
    ctx.beginPath();
    ctx.moveTo(padding * 2, line1Y);
    ctx.lineTo(realWidth - padding * 2, line1Y);
    ctx.closePath();
    ctx.stroke();

    const bw = (realWidth - padding * 4) / column;
    const bh = (realHeight - padding * 8) / row;
    const bp = padding / 5;

    const line2Y = padding * 5.5 + bh * 10;
    ctx.beginPath();
    ctx.moveTo(padding * 2, line2Y);
    ctx.lineTo(realWidth - padding * 2, line2Y);
    ctx.closePath();
    ctx.stroke();

    for (const { index, id, dn, a, s, c } of records) {
      const song = songData[id] || { song: 'No Data', chart: {} };
      const cr = Math.floor(index / 2);
      const cc = index % 2;
      if (cr + 1 > row) break;
      let x = padding * 2 + cc * bw + bp;
      let y = padding * (cr > 9 ? 6 : 5) + cr * bh + bp;
      const ih = bh - bp * 2;
      const iw = ih / 1080 * 2048;
      const img = new Image();
      await loadImage(img, `https://website-assets.starsky919.xyz/phigros/images/${id}.png`);
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, iw, ih);
      x += iw + bp;
      const mw = bw - iw - bp * 3;

      ctx.textAlign = 'left';
      ctx.font = `${realHeight / 96}px Saira, HYWenHei`;
      const title = song.name;
      ctx.fillText(title, x, y += bp / 2, mw);
      y += bp * 1.875;

      ctx.font = `${realHeight / 64}px Saira, HYWenHei`;
      const score = (s || 0).toString().padStart(6, '0');
      const { actualBoundingBoxDescent: scoreABBD } = ctx.measureText(score);
      ctx.fillText(score, x, y += bp / 2.25, mw);
      ctx.textAlign = 'right';
      const rank = s < 7e5 ? 'F' : s < 82e4 ? 'C' : s < 88e4 ? 'B' : s < 92e4 ? 'A' : s < 96e4 ? 'S' : s < 1e6 ? 'V' : 'φ';
      ctx.fillStyle = '#BFBFBF';
      if (s >= 7e5) ctx.fillStyle = '#F9F9F9';
      if (c) ctx.fillStyle = '#0077FF';
      if (s === 1e6) ctx.fillStyle = '#F6F600';
      ctx.fillText(rank, x + bw - iw - bp * 3, y);
      y += bp * 2.75;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#F9F9F9';
      ctx.font = `${realHeight / 96}px Saira, HYWenHei`;
      const acc = `Acc: ${rounding(a, 2)}%`;
      ctx.fillText(acc, x, y += bp / 6, mw);
      y += bp * 2.25;

      const difficulty = song.charts[dn] ? song.charts[dn].difficulty : 0;
      const rating = `${dn} Lv.${difficulty} > ${rounding(getRating(a, difficulty), 2)}`;
      ctx.fillText(rating, x, y += bp / 6, mw);
      ctx.textAlign = 'right';
      const ranking = `#${index}`;
      ctx.fillText(ranking, x + bw - iw - bp * 3, y);
    }

    ctx.font = `${realHeight / 80}px Saira, HYWenHei`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(`Phigros Score Manager v${version.join('.')}    https://psm.starsky919.xyz/`, realWidth / 2, realHeight - padding / 2);
  } catch (err) {
    loading.close();
    Dialog.show(`发生了错误：\n${err}`, '错误');
    return;
  }

  loading.close(), await sleep(0);
  return cav.toDataURL();
}
