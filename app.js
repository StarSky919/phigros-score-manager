import { $, Time, isNullish, rounding, sleep, createElement, getRating, getAcc, parseRecordID, createRecordBox, createSongInfo } from './src/utils.js';
import { Datastore } from './src/datastore.js';
import { Dialog } from './src/dialog.js';
import { selectFile } from './src/fileSelector.js';
import { parseFiles, parsePlayerPrefs } from './src/parser.js';
import { generate } from './src/generator.js';

try {
  localStorage.setItem('test', true);
  localStorage.removeItem('test');
} catch (err) {
  Dialog.show('localStorage API发生错误\n如果您打开了浏览器的无痕（隐私）模式，\n请将它关闭并刷新页面', '错误');
}

const VERSION = [0, 3, 1121];
$('version').innerText = `v${VERSION.join('.')}`;
$('version').addEventListener('click', event => {
  new Dialog().title('当前版本更新日志')
    .content('1.优化了网页的性能，减少了代码量；\n2.提高了网站对更多设备的兼容性。').button('确定').show();
});

const body = document.body;
const psmStorage = new Datastore('φ');
const CMRRank = ['--', '绿', '蓝', '橙', '金', '彩'];
const recordList = $('record_list');
const pid = $('pid');
const rks = $('rks');
const cmr = $('cmr');
const cmrRank = $('cmr_rank');
const cmrLevel = $('cmr_level');

function error(str = '成绩') {
  Dialog.show('请输入正确的' + str, '错误');
}

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
    .button('下一步', close => (close(), new Dialog({ bgclick: false }).title('欢迎使用Phigros分数管理器！')
      .content('点击左上角的名称和右上角的课题成绩可以手动修改，点击中间的RkS可以查看统计信息。\n点击谱面可以查看歌曲信息以及手动编辑成绩。\n在“数据管理”中可以导入、删除或备份当前数据。\n点击“生成图片”可以生成并下载Best19查分图。\n祝您使用愉快！')
      .button('开始').show())).show();
}

fetch('https://website-assets.starsky919.xyz/phigros/songs.json').then(res => res.json()).then(async songData => {
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
      const [, id, dn] = parseRecordID(key) || [, 'Introduction', 'EZ'];
      temp.push(Object.assign({ id, dn, key }, records[key]));
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
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < final.length; i++) {
      const record = final[i];
      if (i === 0 && record.a === 0) {
        const recordBox = createRecordBox({ song: '无数据', score: 0, acc: 0, dn: 'EZ', difficulty: 0, rating: 0, ranking: 0 });
        recordBox.addEventListener('click', event => Dialog.show('您还没有AP任何一首歌\n收歌可以大幅提升RkS哦！'));
        fragment.appendChild(recordBox);
        continue;
      }
      const song = songData[record.id];
      const difficulty = song.chart[record.dn].difficulty;
      const phi = getRating(100, difficulty);
      const A = phi1b19.reduce((previous, current) => previous + current.rating * 5, 0);
      const S = ((A + 0.5 | 0) - A + 0.5) / 5;
      const O = getAcc(record.index < 19 ? record.rating + S : phi1b19[19].rating + S, difficulty);
      const recordBox = createRecordBox({
        song: song.song,
        score: record.s,
        acc: record.a,
        dn: record.dn,
        difficulty: song.chart[record.dn].difficulty,
        rating: rounding(record.rating, 2),
        ranking: `${i === 0 ? '0' : `${record.a === 0 ? '--' : record.index}`}`,
        c: record.c,
        O
      });
      recordBox.dataset.songID = record.id;
      recordBox.dataset.recordID = record.key;
      if (record.a < 100)
        if (phi > phi1b19[19].rating) recordBox.style.background = '#EEFFEE';
        else recordBox.style.background = '#FFEEEE';
      else recordBox.style.background = '#FFFFEE';
      fragment.appendChild(recordBox);
    }
    recordList.appendChild(fragment);
  }

  function refreshScores() {
    sleep(0).then(() => renderScores());
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
      Dialog.show('数据导入完成！'), refreshScores();
    }

    new Dialog().title('请选择导入方式')
      .content('覆盖：新存档完全替换旧存档（不保留原数据）' +
        '\n\n合并：合并新旧存档的最高成绩（以Acc为准）')
      .button('取消').button('覆盖', close => { close(), process(false); })
      .button('合并', close => { close(), process(true); }).show();
  }

  $('manage').addEventListener('click', event => {
    new Dialog().title('数据管理')
      .content('目前已支持导入的文件类型：' +
        '\nPhigros本体的存档文件' +
        '\n(com.PigeonGames.Phigros.v2.playerprefs.xml)' +
        '\n未加密的Android备份文件 (.ab后缀)' +
        '\n由本站导出的备份文件 (psm_backup.txt)')
      .button('取消').button('删除', close => new Dialog().title('删除数据')
        .content('所有已导入数据都将被删除\n确定要继续吗？')
        .button('取消').button('确定', close_2 => { initialize(), close_2(), close(), refreshScores(); }).show())
      .button('备份', close => Object.keys(getData().records || {}).length === 0 ?
        Dialog.show('没有可以生成的数据，\n请先导入一个存档或手动添加记录') :
        new Dialog().title('备份数据')
        .content('点击“下载”来下载备份文件\n如果您正在使用Via浏览器且文件名是乱码，请手动修改为您可以记住的名字\n如果无法下载，请尝试在浏览器设置中更换下载器')
        .button('取消').button('下载', close_2 => { createElement({ tagName: 'a', attr: { download: 'psm_backup.txt', href: `data:text/plain;base64,${btoa(encodeURI(JSON.stringify(getData())))}` } }).click(), close_2(), close(); }).show())
      .button('导入', close => selectFile(async file => {
        close();
        const loading = new Dialog({ bgclick: false }).title('提示').content('正在加载数据，请稍等……').show();
        if (!window.Worker) try {
          const data = await parseFiles(file);
          return loading.close(), importData(data);
        } catch (err) {
          return loading.close(), Dialog.show(`请选择正确的文件！\n\n错误信息：\n${err}`, '错误');
        }
        const worker = new Worker('./src/parserWorker.js');
        worker.postMessage(file);
        worker.addEventListener('message', ({ data: { type, result } }) => { loading.close(), importData(type ? parsePlayerPrefs(result) : result), worker.terminate(); });
        worker.addEventListener('error', event => { loading.close(), Dialog.show(`请选择正确的文件！\n\n错误信息：\n${event.message.replace('Uncaught ', '')}`, '错误'), worker.terminate(); });
        return;
      })).show();
  });

  $('sort_order').addEventListener('click', event => {
    const setOrder = order => { psmStorage.set('sort_order', order), refreshScores(); };
    new Dialog().title('选择排序方式')
      .content('排序优先级：单曲RkS > 定数 > Acc')
      .button('Acc', close => { close(), setOrder(2); })
      .button('定数', close => { close(), setOrder(1); })
      .button('单曲RkS', close => { close(), setOrder(0); })
      .show();
  });

  $('generate').addEventListener('click', event => {
    const { playerID, ChallengeModeRank, records } = getData();
    if (Object.keys(records || {}).length === 0) return Dialog.show('没有可以生成的数据，\n请先导入一个存档或手动添加记录');
    new Dialog()
      .content('生成图片会消耗至多100MB的网络流量，\n如果您正在使用移动数据，请谨慎继续。\n（查分图分辨率为1800×3200）')
      .button('取消').button('确定', async close => {
        close();
        const sorted = sortRecords(records, false);
        const phi = Object.assign({ id: '', dn: 'EZ' }, sorted.find(e => e.a === 100) || { a: 0, s: 0, c: 0, rating: 0 });
        phi.index = 0;
        const final = [phi, ...sorted];
        const rankingScore = final.slice(0, 20).reduce((previous, current) => previous + current.rating, 0) / 20;
        const dataURL = await generate(VERSION, songData, {
          playerID,
          ChallengeModeRank,
          rankingScore,
          records: final
        });
        if (!isNullish(dataURL)) new Dialog({ bgclick: false })
          .content('查分图已生成完毕，点击“下载”按钮即可保存')
          .button('取消').button('下载', close => { close(), createElement({ tagName: 'a', attr: { download: 'image.png', href: dataURL } }).click(); }).show();
      }).show();
  });

  $('about').addEventListener('click', event => {
    new Dialog().title('关于本站')
      .content(`Phigros分数管理器 v${VERSION.join('.')}\nhttps://psm.starsky919.xyz/` +
        '\n开发者：StarSky919' +
        '\nQQ：2197972830，Q群：486908465' +
        '\n点击右上角版本号可查看当前版本更新日志')
      .button('确定').show();
  });

  pid.addEventListener('click', event => {
    const data = getData();
    if (isNullish(data)) return;
    const container = createElement({ tagName: 'div' });
    container.appendChild(createElement({ tagName: 'p', text: '请输入您的新名称：' }));
    const input = createElement({
      tagName: 'input',
      classList: ['input'],
      attr: {
        type: 'text',
        value: data.playerID
      }
    });
    container.appendChild(input);
    new Dialog().title('修改名称').content(container, true)
      .button('取消').button('确定', close => {
        data.playerID = input.value ? input.value.trim().slice(0, 16) : 'GUEST';
        close(), setData(data), refreshScores();
      }).show();
  });

  rks.addEventListener('click', event => {
    const { records } = getData();
    const songKeys = Object.keys(songData),
      recordKeys = Object.keys(records);
    const songTotal = songKeys.length;
    const chartTotal = Object.values(songData).reduce((previous, current) => previous + Object.keys(current.chart).length, 0);
    const songPlayedTotal = Object.keys(recordKeys.reduce((previous, current) => {
      const [, id] = parseRecordID(current) || [, 'Introduction'];
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
        const [, id, dn] = parseRecordID(key);
        return songData[id].chart[dn].level === 16;
      }),
      Lv15: chartAPedTotal.filter(key => {
        const [, id, dn] = parseRecordID(key);
        return songData[id].chart[dn].level === 15;
      })
    }
    const b19 = sortRecords(records).slice(0, 19);
    const b19average = rounding(b19.reduce((previous, { rating }) => previous += rating, 0) / 19, 2);
    const averageDifficulty = rounding(b19.reduce((previous, { id, dn }) => previous + songData[id].chart[dn].difficulty, 0) / 19, 2);
    const lv16 = b19.filter(({ id, dn }) => songData[id].chart[dn].level === 16);
    const lv15 = b19.filter(({ id, dn }) => songData[id].chart[dn].level === 15);
    const result = [];
    result.push(`截至Phigros 2.4.2版本，\n共有${songTotal}首歌曲，${chartTotal}张谱面。`);
    if (songPlayedTotal === 0 && chartPlayedTotal === 0) result.push('您尚未游玩过任何歌曲与谱面！');
    else {
      result.push(`您已游玩过其中的${songPlayedTotal}首歌曲，${chartPlayedTotal}张谱面。`);
      result.push(`\n所有游玩过的谱面中，\nFull Combo的数量为${chartFCedTotal.length}，All Perfect的数量为${chartAPedTotal.length}。`);
      result.push(`所有All Perfect的成绩中，\nIN难度的数量为${chartAPed.IN.length}，AT难度的数量为${chartAPed.AT.length}，\nLv.15的数量为${chartAPed.Lv15.length}，Lv.16的数量为${chartAPed.Lv16.length}。`);
      result.push(`\n在您的Best19中，\n谱面平均定数约为${averageDifficulty}，平均Rating约为${b19average}，\nLv.15的数量为${lv15.length}，Lv.16的数量为${lv16.length}。`);
      result.push('再接再厉！');
    }
    Dialog.show(result.join('\n'), '统计信息');
  });

  cmr.addEventListener('click', event => {
    const data = getData();
    if (isNullish(data)) return;
    const container = createElement({ tagName: 'div' });
    container.appendChild(createElement({ tagName: 'p', text: '请输入新的课题成绩：' }));
    const input = createElement({
      tagName: 'input',
      classList: ['input'],
      attr: {
        type: 'number',
        value: data.ChallengeModeRank
      }
    });
    container.appendChild(input);
    container.appendChild(createElement({ tagName: 'p', text: '数值为三位数，\n百位代表颜色（1是绿，2是蓝，以此类推），\n十位和个位为等级\n例：彩3→503、金48→448' }));
    new Dialog().title('修改课题成绩').content(container, true)
      .button('取消').button('确定', close => {
        const value = parseInt(input.value);
        if (value && (value > 548 || value < 100 || value % 100 > 48 || value % 100 < 3)) return Dialog.show('请输入正确的课题成绩', '错误');
        data.ChallengeModeRank = value ? value : 0;
        close(), setData(data), refreshScores();
      }).show();
  });

  recordList.addEventListener('click', event => {
    const recordBox = event.target;
    if (!recordBox.classList.contains('record_box')) return;
    const { songID, recordID } = recordBox.dataset;
    if (isNullish(songID) || isNullish(recordID)) return;
    const song = songData[songID];
    const record = getData().records[recordID] || { a: 0, s: 0, c: 0 };
    const [, , dn] = parseRecordID(recordID);
    const editRecord = new Dialog().title(`编辑记录`);
    const container = createElement({ tagName: 'div' });
    container.appendChild(createElement({
      tagName: 'div',
      style: { padding: '0.55rem 0' },
      text: `${song.song} (${dn} Lv.${song.chart[dn].difficulty})`
    }));
    const acc = createElement({
      tagName: 'input',
      classList: ['input'],
      attr: {
        type: 'number',
        placeholder: 'Acc',
        value: record.a || ''
      }
    });
    container.appendChild(acc);
    const score = createElement({
      tagName: 'input',
      classList: ['input'],
      attr: {
        type: 'number',
        placeholder: '分数',
        value: record.s || ''
      }
    });
    container.appendChild(score);
    const fcc = createElement({
      tagName: 'div',
      classList: ['checkbox'],
      style: { margin: '0.55rem auto' }
    });
    const fc = createElement({ tagName: 'input', attr: { type: 'checkbox' } });
    fc.checked = !!record.c;
    fcc.appendChild(fc);
    const label = createElement({
      tagName: 'label',
      html: '<span>Full Combo</span><span class="pattern"></span>'
    });
    fc.id = label.htmlFor = 'full_combo';
    fcc.appendChild(label);
    container.appendChild(fcc);
    const exact = createElement({
      tagName: 'div',
      classList: ['button'],
      text: '输入精确数据'
    });
    exact.addEventListener('click', event => {
      const container = createElement({ tagName: 'div' });
      container.appendChild(createElement({
        tagName: 'div',
        style: { padding: '0.55rem 0' },
        text: `${song.song} (${dn} Lv.${song.chart[dn].difficulty})`
      }));
      const input = createElement({
        tagName: 'input',
        classList: ['input'],
        attr: { type: 'text', placeholder: '输入' }
      });
      container.appendChild(input);
      const fcc = createElement({
        tagName: 'div',
        classList: ['checkbox'],
        style: { margin: '0.55rem auto' }
      });
      const fc = createElement({ tagName: 'input', attr: { type: 'checkbox' } });
      fcc.appendChild(fc);
      const label = createElement({
        tagName: 'label',
        html: '<span>Full Combo</span><span class="pattern"></span>'
      });
      fc.id = label.htmlFor = 'full_combo2';
      fcc.appendChild(label);
      container.appendChild(fcc);
      container.appendChild(createElement({
        tagName: 'div',
        style: { padding: '0.55rem 0' },
        text: '依次输入\n最大连击、Perfect、Good、Bad、Miss的数量\n以空格分割，数据将自动计算\n例：1415 1692 6 1 1、1266 1443 0 0 1'
      }));
      new Dialog().title('输入精确数据').content(container, true).button('取消').button('确定', close => {
        const data = getData();
        const [maxCombo, p, g = 0, b = 0, m = 0] = input.value.split(' ').map(item => Number(item));
        if (isNullish(maxCombo) || isNullish(p)) Reflect.deleteProperty(data.records, recordID);
        else {
          const combo = p + g + b + m;
          const base = 900000 / combo;
          const baseScore = base * p + base * 0.65 * g;
          const a = 100 - 35 / combo * g - 100 / combo * (b + m);
          const s = rounding(maxCombo / combo * 100000 + baseScore);
          const c = fc.checked ? 1 : 0;
          if (combo !== song.chart[dn].combo) return error();
          if (((a === 100 || (b + m === 0)) && !c) || ((a === 0 || (b + m !== 0)) && c)) return error();
          if (rounding(a / 100 * 900000) !== rounding(baseScore)) return error();
          data.records[recordID] = { a, s, c };
        }
        editRecord.close(), close(), setData(data), refreshScores();
      }).show();
    });
    container.appendChild(exact);
    editRecord.content(container, true)
      .button('歌曲信息', close => new Dialog().title('歌曲信息')
        .content(createSongInfo({ ...song, img: `https://website-assets.starsky919.xyz/phigros/images/${songID}.png` }), true)
        .button('确定').show())
      .button('取消').button('确定', close_2 => {
        const data = getData();
        const a = parseFloat(acc.value) || 0;
        const s = parseInt(score.value) || 0;
        const c = fc.checked ? 1 : 0;
        if (a < 0 || a > 100) return error('Acc');
        if (s < 0 || s > 1e6) return error('分数');
        if ((a === 0 && s !== 0) || (a !== 0 && s === 0)) return error();
        if ((a === 100 && s !== 1e6) || (a !== 100 && s === 1e6)) return error();
        if ((a === 100 && !c) || ((a === 0 || s === 0) && c)) return error();
        if (a === 0 && s === 0) Reflect.deleteProperty(data.records, recordID);
        else data.records[recordID] = { a, s, c };
        close_2(), close(), setData(data), refreshScores();
      }).show();
  });

  if (isNullish(getData())) initialize();
  renderScores();
}).catch(err => Dialog.show('数据加载失败，请检查网络连接', '错误'));
