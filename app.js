import './lib/pako_inflate.min.js';
import { $, $$, $$$, Time, isNullish, rounding, sleep, createElement, getRating, getAcc } from './src/utils.js';
import { selectFile } from './src/fileSelector.js';
import { Datastore } from './src/datastore.js';
import { parseFiles, parsePlayerPrefs } from './src/parser.js';
import { Dialog } from './src/dialog.js';
import { generate } from './src/generator.js';

try {
  localStorage.setItem('test', true);
  localStorage.removeItem('test');
} catch (err) {
  Dialog.show('localStorage API发生错误\n如果您打开了浏览器的无痕（隐私）模式，\n请把它关闭并刷新页面','错误');
}

const VERSION = [0, 2, 1020];
$('version').innerText = `v${VERSION.join('.')}`;
const body = document.body;
const psmStorage = new Datastore('φ');
const songData = await fetch('https://website-assets.starsky919.xyz/phigros/songs.json').then(res => res.json())
  .catch(err => Dialog.show('数据加载失败，请检查网络连接', '错误'));
const CMRRank = ['--', '绿', '蓝', '橙', '金', '彩'];
const recordList = $('record_list');
const pid = $('pid');
const rks = $('rks');
const cmr = $('cmr');
const cmrRank = $('cmr_rank');
const cmrLevel = $('cmr_level');

function getData() {
  return psmStorage.get('psm_data');
}

function setData({ playerID, ChallengeModeRank, records }) {
  psmStorage.set('psm_data', { playerID, ChallengeModeRank, records });
}

function initialize() {
  setData({ playerID: 'GUEST', ChallengeModeRank: 0, records: {} });
  new Dialog({ bgclick: false }).title('欢迎使用Phigros分数管理器！')
    .content('已自动为您新建了一个空存档。\n稍后您可以导入自己的存档，\n也可以手动输入所需的数据。\n绿色背景表示该谱面推分可以增加RkS，\n红色背景则相反。\n括号里是该谱面使RkS+0.01所需的最低Acc。')
    .button('下一步', close => {
      close(), new Dialog({ bgclick: false }).title('欢迎使用Phigros分数管理器！')
        .content('点击左上角的名称和右上角的课题成绩可以手动修改，点击中间的RkS可以查看统计信息。\n点击谱面可以查看歌曲信息以及手动编辑成绩。\n在“数据管理”中可以导入、删除或备份当前数据。\n点击“生成图片”可以生成并下载Best19查分图。\n祝您使用愉快！')
        .button('开始', close => close())
        .show();
    })
    .show();
}

function sortRecords(records, padEmpty = true) {
  if (padEmpty) {
    for (const songID in songData) {
      const { chart } = songData[songID];
      for (const dn in chart) {
        const key = `${songID}.Record.${dn}`;
        if (isNullish(records[key])) records[key] = { a: 0, s: 0, c: 0 };
      }
    }
  }
  const temp = [];
  for (const key in records) {
    const [, id, dn] = /(.*)\.Record\.(.*)/.exec(key) || [, 'Introduction', 'EZ'];
    temp.push(Object.assign({ id, dn }, records[key]));
  }
  const sorted = temp
    .map(e => {
      e.rating = e.a >= 70 ? getRating(e.a, songData[e.id].chart[e.dn].difficulty) : 0;
      return e;
    })
    .sort((a, b) => b.rating - a.rating);
  sorted.forEach((e, i) => e.index = i + 1);
  return sorted;
}

function renderScores() {
  const { playerID, ChallengeModeRank, records = {} } = getData();
  const sorted = sortRecords(records);
  const phi = sorted.find(e => e.a === 100) || { a: 0, s: 0, c: 0, rating: 0 };
  const phi1b19 = [phi, ...sorted.slice(0, 19)];
  const rankingScore = phi1b19.reduce((previous, current) => previous + current.rating, 0) / 20;
  const final = [phi, ...sorted.sort((a, b) => {
    const ad = songData[a.id].chart[a.dn].difficulty;
    const bd = songData[b.id].chart[b.dn].difficulty;
    const c1 = a.rating === b.rating ? bd - ad : b.rating - a.rating;
    const c2 = ad === bd ? b.rating - a.rating : bd - ad;
    const c = [c1, c2, a.a === b.a ? c1 : b.a - a.a];
    return c[psmStorage.get('sort_order') || 0];
  })];
  recordList.classList.remove('empty');
  pid.innerText = playerID;
  rks.innerText = rounding(rankingScore, 2);
  cmrRank.innerText = CMRRank[Math.floor(ChallengeModeRank / 100)];
  cmrLevel.innerText = ChallengeModeRank === 0 ? '' : ChallengeModeRank % 100;
  recordList.innerHTML = '';
  for (let i = 0; i < final.length; i++) {
    const record = final[i];
    if (i === 0 && record.a === 0) {
      const recordBox = createElement('div');
      recordBox.classList.add('record_box');
      recordBox.innerHTML = '<div class="title">无数据</div><div class="row"><span class="score">000000</span><span class="rank">F</span></div><div class="acc">Acc: 00.00%</div><div class="row"><span class="rating">EZ Lv.0.0 &gt; 00.00</span><span class="ranking">#0</span></div>';
      recordBox.addEventListener('click', event => Dialog.show('您还没有AP任何一首歌\n收歌可以大幅提升RkS哦！'));
      recordList.appendChild(recordBox);
      continue;
    }
    const song = songData[record.id];
    const recordBox = createElement('div');
    recordBox.classList.add('record_box');
    const title = createElement('div');
    title.classList.add('title');
    title.innerText = song.song;
    recordBox.appendChild(title);
    const row1 = createElement('div');
    row1.classList.add('row');
    const score = createElement('span');
    score.classList.add('score');
    score.innerText = (record.s || 0).toString().padStart(6, '0');
    row1.appendChild(score);
    const rank = createElement('span');
    rank.classList.add('rank');
    rank.innerText = record.s < 7e5 ? 'F' : record.s < 82e4 ? 'C' : record.s < 88e4 ? 'B' : record.s < 92e4 ? 'A' : record.s < 96e4 ? 'S' : record.s < 1e6 ? 'V' : 'φ';
    if (record.s >= 7e5) rank.style.color = '#444444';
    if (record.c) rank.style.color = '#0077FF';
    if (record.s === 1e6) rank.style.color = '#F6F600';
    row1.appendChild(rank);
    recordBox.appendChild(row1);
    const acc = createElement('div');
    acc.classList.add('acc');
    acc.innerText = `Acc: ${rounding(record.a, 2)}%`;
    if (record.a < 100) {
      const difficulty = song.chart[record.dn].difficulty;
      const phi = getRating(100, difficulty);
      const A = phi1b19.reduce((previous, current) => previous + current.rating * 5, 0);
      const S = ((A + 0.5 | 0) - A + 0.5) / 5;
      const O = getAcc(record.index < 19 ? record.rating + S : phi1b19[19].rating + S, difficulty);
      if (O <= 100) acc.innerText += ` (${rounding(O < 70 ? 70 : O < 100 ? O : phi.rating < difficulty ? 100 : O, 2)}%)`;
      if (phi > phi1b19[19].rating) recordBox.style.background = '#EEFFEE';
      else recordBox.style.background = '#FFEEEE';
    } else recordBox.style.background = '#FFFFEE';
    recordBox.appendChild(acc);
    const row2 = createElement('div');
    row2.classList.add('row');
    const rating = createElement('span');
    rating.classList.add('rating');
    rating.innerText = `${record.dn} Lv.${song.chart[record.dn].difficulty} > ${rounding(record.rating, 2)}`;
    row2.appendChild(rating);
    const ranking = createElement('span');
    ranking.classList.add('ranking');
    ranking.innerText = `${i === 0 ? '#0' : `#${record.a === 0 ? '--' : record.index}`}`;
    row2.appendChild(ranking);
    recordBox.appendChild(row2);
    recordBox.addEventListener('click', event => {
      const container = createElement('div');
      const img = createElement('img');
      img.style.cssText += 'width: 87.5%; height: auto; vertical-align: middle;';
      img.src = `https://website-assets.starsky919.xyz/phigros/images/${record.id}.png`;
      img.addEventListener('click', event => {
        const link = createElement('a');
        link.href = img.src;
        link.target = '_blank';
        link.click();
      });
      img.addEventListener('error', event => img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAABsCAYAAADJ/DYiAAAAAXNSR0IArs4c6QAAAm5JREFUeF7t07ENACAMBDHYf8lsAhITcL1Tf2Xl9syc5QgQ+BbYovm2MiTwBETjEQhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJyAaP0AgCogmgpkTEI0fIBAFRBPBzAmIxg8QiAKiiWDmBETjBwhEAdFEMHMCovEDBKKAaCKYOQHR+AECUUA0EcycgGj8AIEoIJoIZk5ANH6AQBQQTQQzJ3ABvvSHkNEIMfAAAAAASUVORK5CYII=');
      container.appendChild(img);
      const info = createElement('div');
      info.style.cssText += 'display: flex; flex-direction: column; margin: 0 auto; margin-top: 0.5rem; width: 87.5%';
      const rowCSS = 'display: flex; justify-content: space-between; font-size: 95%;'
      const title = createElement('div');
      title.innerText = song.song;
      info.appendChild(title);
      const composer = createElement('div');
      composer.innerText = song.composer;
      composer.style.fontSize = '90%';
      info.appendChild(composer);
      const illustrator = createElement('div');
      illustrator.style.marginTop = '0.5rem';
      illustrator.style.cssText += rowCSS;
      illustrator.innerHTML = `<span>画师：</span><span>${song.illustrator}</span>`;
      info.appendChild(illustrator);
      const chapter = createElement('div');
      chapter.style.cssText += rowCSS;
      chapter.innerHTML = `<span style='white-space: nowrap;'>章节：</span><span>${song.chapter.replace('Chapter EX-', '')}</span>`;
      info.appendChild(chapter);
      const others = createElement('div');
      others.style.cssText += rowCSS;
      others.innerHTML = `<span>BPM：${song.bpm || '暂无数据'}</span><span>时长：${song.length || '暂无数据'}</span>`;
      info.appendChild(others);
      for (const dn in song.chart) {
        const chart = createElement('div');
        chart.style.marginTop = '0.5rem';
        chart.style.cssText += rowCSS;
        chart.innerHTML = `<span style='flex: 33.33%; text-align: left;'>${dn} Lv.${song.chart[dn].level}</span><span style='flex: 33.33%;'>定数：${song.chart[dn].difficulty}</span><span style='flex: 33.33%; text-align: right;'>物量：${song.chart[dn].combo}</span>`;
        info.appendChild(chart);
        const charter = createElement('div');
        charter.style.cssText += rowCSS + 'overflow:hidden;';
        charter.innerHTML = `<span style='flex: 20%; white-space: nowrap; text-align: left;'>谱师：</span><span style='white-space: nowrap; overflow: scroll;'>${song.chart[dn].charter}</span>`;
        info.appendChild(charter);
      }
      container.appendChild(info);
      new Dialog().title('歌曲信息')
        .content(container, true)
        .button('编辑记录', close => {
          const container = createElement('div');
          const acc = createElement('input');
          acc.classList.add('input');
          acc.type = 'number';
          acc.placeholder = 'Acc';
          acc.value = record.a || '';
          container.appendChild(acc);
          const score = createElement('input');
          score.classList.add('input');
          score.type = 'number';
          score.placeholder = '分数';
          score.value = record.s || '';
          container.appendChild(score);
          const fcc = createElement('div');
          fcc.style.margin = '0.55rem auto';
          fcc.classList.add('checkbox');
          const fc = createElement('input');
          fc.type = 'checkbox';
          fc.checked = !!record.c;
          fcc.appendChild(fc);
          const label = createElement('label');
          fc.id = label.htmlFor = 'full_combo';
          label.innerHTML = '<span>Full Combo</span><span class="pattern"></span>';
          fcc.appendChild(label);
          container.appendChild(fcc);
          const hint = createElement('div');
          hint.style.padding = '0.55rem 0';
          hint.innerText = '因Phigros四舍五入的机制，\n结算显示的Acc与实际Acc不完全相同，\n可能会导致RkS出现微小误差';
          container.appendChild(hint);
          new Dialog().title('编辑记录')
            .content(container, true)
            .button('取消', close => close())
            .button('确定', close_2 => {
              function error(str = '成绩') {
                Dialog.show('请输入正确的' + str, '错误');
              }
              const data = getData();
              const key = `${record.id}.Record.${record.dn}`;
              const a = parseFloat(acc.value) || 0;
              const s = parseInt(score.value) || 0;
              const c = fc.checked ? 1 : 0;
              if (a < 0 || a > 100) return error('Acc');
              if (s < 0 || s > 1e6) return error('分数');
              if ((a === 0 && s !== 0) || (a !== 0 && s === 0)) return error();
              if ((a === 100 && s !== 1e6) || (a !== 100 && s === 1e6)) return error();
              if (a === 100 && !c) return error();
              if (a === 0 && s === 0) Reflect.deleteProperty(data.records, key);
              else data.records[key] = { a, s, c };
              close_2(), close(), setData(data);
              sleep(0).then(() => renderScores());
            }).show();
        })
        .button('确定', close => close()).show();
    });
    recordList.appendChild(recordBox);
  }
}

function importData(data) {
  const { playerID = 'GUEST', ChallengeModeRank = 0, ...records } = data;

  function process(merge) {
    if (!merge) setData({ playerID, ChallengeModeRank, records: {} });
    const { playerID: pID, ChallengeModeRank: CMR, records: rcd } = getData();
    for (const songID in songData) {
      const { chart } = songData[songID];
      for (const dn in chart) {
        const key = `${songID}.Record.${dn}`;
        const s1 = rcd[key];
        const s2 = records[key];
        if (isNullish(s2)) continue;
        if (s2.a === 0 && s2.s === 0 && s2.c === 0) {
          Reflect.deleteProperty(records, key);
          continue;
        }
        if (isNullish(s1)) rcd[key] = s2;
        else rcd[key] = s2.a > s1.a ? s2 : s1;
      }
    }
    setData({
      playerID: merge ? pID : playerID,
      ChallengeModeRank: merge ? ChallengeModeRank > CMR ? ChallengeModeRank : CMR : ChallengeModeRank,
      records: rcd
    });
    Dialog.show('数据导入完成！');
    sleep(0).then(() => renderScores());
  }

  new Dialog().title('请选择导入方式')
    .content('覆盖：新存档完全替换旧存档（不保留原数据）' +
      '\n\n合并：合并新旧存档的最高成绩（以Acc为准）')
    .button('取消', close => close())
    .button('覆盖', close => (close(), process(false)))
    .button('合并', close => (close(), process(true)))
    .show();
}

$('manage').addEventListener('click', event => {
  new Dialog().title('数据管理')
    .content('目前已支持导入的文件类型：' +
      '\nPhigros本体的存档文件' +
      '\n(com.PigeonGames.Phigros.v2.playerprefs.xml)' +
      '\n未加密的Android备份文件 (.ab后缀)' +
      '\n由本站导出的备份文件 (psm_backup.txt)')
    .button('取消', close => close())
    .button('删除', close => {
      new Dialog().title('删除数据')
        .content('所有已导入数据都将被删除\n确定要继续吗？')
        .button('取消', close => close())
        .button('确定', close_2 => (initialize(), close_2(), close(), sleep(0).then(() => renderScores())))
        .show();
    })
    .button('备份', close => {
      const { playerID, ChallengeModeRank, records } = getData() || {};
      if (Object.keys(records || {}).length === 0) return Dialog.show('没有可以生成的数据，\n请先导入一个存档或手动添加记录');
      new Dialog().title('备份数据')
        .content('点击“下载”来下载备份文件\n如果您正在使用Via浏览器且文件名是乱码，请手动修改为您可以记住的名字\n如果无法下载，请尝试在浏览器设置中更换下载器')
        .button('取消', close => close())
        .button('下载', close_2 => {
          const link = createElement('a');
          link.download = 'psm_backup.txt';
          link.href = `data:text/plain;base64,${btoa(encodeURI(JSON.stringify(getData())))}`;
          link.click();
          close_2(), close();
        }).show();
    })
    .button('导入', close => {
      selectFile(async file => {
        close();
        const loading = new Dialog({ bgclick: false }).title('提示').content('正在加载数据，请稍等……').show();
        if (window.Worker) {
          const worker = new Worker('./src/parserWorker.js');
          worker.postMessage(file);
          worker.addEventListener('message', event => {
            loading.close();
            const { type, result } = event.data;
            importData(type ? parsePlayerPrefs(result) : result);
            worker.terminate();
          });
          worker.addEventListener('error', event => {
            loading.close();
            Dialog.show(`请选择正确的文件！\n\n错误信息：\n${event.message}`, '错误');
            worker.terminate();
          });
          return;
        }
        try {
          const data = await parseFiles(file);
          loading.close(), importData(data);
        } catch (err) {
          Dialog.show(`请选择正确的文件！\n\n错误信息：\n${err}`, '错误');
        }
      });
    }).show();
});

$('sort_order').addEventListener('click', event => {
  function setOrder(order) {
    psmStorage.set('sort_order', order);
    sleep(0).then(() => renderScores());
  };
  new Dialog().title('选择排序方式')
    .content('排序优先级：单曲RkS > 定数 > Acc')
    .button('Acc', close => (close(), setOrder(2)))
    .button('定数', close => (close(), setOrder(1)))
    .button('单曲RkS', close => (close(), setOrder(0)))
    .show();
});

$('generate').addEventListener('click', async event => {
  const { playerID, ChallengeModeRank, records } = getData();
  if (Object.keys(records || {}).length === 0) return Dialog.show('没有可以生成的数据，\n请先导入一个存档或手动添加记录');
  const sorted = sortRecords(records, false);
  const phi = Object.assign({ id: '', dn: 'EZ' }, sorted.find(e => e.a === 100) || { a: 0, s: 0, c: 0, rating: 0 });
  phi.index = 0;
  const final = [phi, ...sorted];
  const rankingScore = final.slice(0, 20).reduce((previous, current) => previous + current.rating, 0) / 20;
  const dataURL = await generate(songData, {
    playerID,
    ChallengeModeRank,
    rankingScore,
    records: final
  });
  if (isNullish(dataURL)) return;
  const link = createElement('a');
  link.download = 'image.png';
  link.href = dataURL;
  new Dialog()
    .content('查分图已生成完毕，点击“下载”按钮即可保存')
    .button('取消', close => close())
    .button('下载', close => (close(), link.click())).show();
});

$('about').addEventListener('click', event => {
  new Dialog().title('关于本站')
    .content(`Phigros分数管理器 v${VERSION.join('.')}\nhttps://psm.starsky919.xyz/` +
      '\n开发者：StarSky919')
    .button('确定', close => close()).show();
});

pid.addEventListener('click', event => {
  const data = getData();
  if (isNullish(data)) return;
  const container = createElement('div');
  const p = createElement('p');
  p.innerText = '请输入您的新名称：';
  container.appendChild(p);
  const input = createElement('input');
  input.classList.add('input');
  input.type = 'text';
  container.appendChild(input);
  input.value = data.playerID;
  new Dialog().title('修改名称')
    .content(container, true)
    .button('取消', close => close())
    .button('确定', close => {
      data.playerID = input.value ? input.value.trim().slice(0, 16) : 'GUEST';
      close(), setData(data), sleep(0).then(() => renderScores());
    }).show();
});

rks.addEventListener('click', event => {
  const { records } = getData();
  const songKeys = Object.keys(songData),
    recordKeys = Object.keys(records);
  const songTotal = songKeys.length;
  const chartTotal = Object.values(songData).reduce((previous, current) => previous + Object.keys(current.chart).length, 0);
  const songPlayedTotal = Object.keys(recordKeys.reduce((previous, current) => {
    const [, id] = /(.*)\.Record\..*/.exec(current) || [, 'Introduction'];
    previous[id] = true;
    return previous;
  }, {})).length;
  const chartPlayedTotal = recordKeys.length;
  const chartFCedTotal = recordKeys.filter(key => records[key].c);
  const chartAPedTotal = recordKeys.filter(key => records[key].a === 100);
  const chartAPed = {
    AT: chartAPedTotal.filter(key => key.endsWith('AT')),
    IN: chartAPedTotal.filter(key => key.endsWith('IN')),
    Lv16: chartAPedTotal.filter(key => {
      const [, id, dn] = /(.*)\.Record\.(.*)/.exec(key);
      return songData[id].chart[dn].level === 16;
    }),
    Lv15: chartAPedTotal.filter(key => {
      const [, id, dn] = /(.*)\.Record\.(.*)/.exec(key);
      return songData[id].chart[dn].level === 15;
    })
  }
  const b19 = sortRecords(records).slice(0, 19);
  const averageDifficulty = rounding(b19.reduce((previous, { id, dn }) => previous + songData[id].chart[dn].difficulty, 0) / 19, 2);
  const lv16 = b19.filter(({ id, dn }) => songData[id].chart[dn].level === 16);
  const lv15 = b19.filter(({ id, dn }) => songData[id].chart[dn].level === 15);
  const result = [];
  while (true) {
    result.push(`截至Phigros 2.4.2版本，\n共有${songTotal}首歌曲，${chartTotal}张谱面。`);
    if (songPlayedTotal === 0 && chartPlayedTotal === 0) {
      result.push('您尚未游玩过任何歌曲与谱面！');
      break;
    }
    result.push(`您已游玩过其中的${songPlayedTotal}首歌曲，${chartPlayedTotal}张谱面。`);
    result.push(`\n所有游玩过的谱面中，\nFull Combo的数量为${chartFCedTotal.length}，All Perfect的数量为${chartAPedTotal.length}。`);
    result.push(`所有All Perfect的成绩中，\nIN难度的数量为${chartAPed.IN.length}，AT难度的数量为${chartAPed.AT.length}，\nLv.15的数量为${chartAPed.Lv15.length}，Lv.16的数量为${chartAPed.Lv16.length}。`);
    result.push(`\n在您的Best19中，谱面平均定数约为${averageDifficulty}，\nLv.15的数量为${lv15.length}，Lv.16的数量为${lv16.length}。`);
    result.push('再接再厉！');
    break;
  }
  new Dialog().title('统计信息')
    .content(result.join('\n'))
    .button('确定', close => close()).show();
});

cmr.addEventListener('click', event => {
  const data = getData();
  if (isNullish(data)) return;
  const container = createElement('div');
  const p = createElement('p');
  p.innerText = '请输入新的课题成绩：';
  container.appendChild(p);
  const input = createElement('input');
  input.classList.add('input');
  input.type = 'number';
  container.appendChild(input);
  input.value = data.ChallengeModeRank;
  const hint = createElement('p');
  hint.innerText = '数值为三位数，\n百位代表颜色（1是绿，2是蓝，以此类推），\n十位和个位为等级\n例：彩3→503、金48→448';
  container.appendChild(hint);
  new Dialog().title('修改课题成绩')
    .content(container, true)
    .button('取消', close => close())
    .button('确定', close => {
      const value = parseInt(input.value);
      if (value && (value > 548 || value < 100 || value % 100 > 48 || value % 100 < 3)) return Dialog.show('请输入正确的课题成绩', '错误');
      data.ChallengeModeRank = value ? value : 0;
      close(), setData(data), sleep(0).then(() => renderScores());
    }).show();
});

if (isNullish(getData())) initialize();
renderScores();
