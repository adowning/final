
import { BaseSlotSettings } from '../base/BaseSlotSettings';

export class SlotSettings extends BaseSlotSettings {
  constructor(settings: any) {
    super(settings);

    // Paytable initialization from original file
    this.Paytable['SYM_0'] = [0, 0, 0, 0, 0, 0];
    this.Paytable['SYM_1'] = [0, 0, 0, 0, 0, 0];
    this.Paytable['SYM_2'] = [0, 0, 0, 0, 0, 0];
    this.Paytable['SYM_3'] = [0, 0, 0, 20, 0, 0];
    this.Paytable['SYM_4'] = [0, 0, 0, 10, 0, 0];
    this.Paytable['SYM_5'] = [0, 0, 0, 5, 0, 0];
    this.Paytable['SYM_6'] = [0, 0, 0, 3, 0, 0];
    this.Paytable['SYM_7'] = [0, 0, 0, 2, 0, 0];
    this.Paytable['SYM_8'] = [0, 0, 0, 1, 0, 0];
    this.Paytable['SYM_100'] = [0, 0, 0, 40, 0, 0];
    this.Paytable['SYM_101'] = [0, 0, 0, 200, 0, 0];
    this.Paytable['SYM_102'] = [0, 0, 0, 0, 0, 0];
    this.Paytable['SYM_50'] = [0, 0, 0, 0, 0, 0];
    this.Paytable['SYM_99'] = [0, 0, 0, 0, 0, 0];

    // Game-specific initialization
    this.scaleMode = 0;
    this.numFloat = 0;

    this.slotBonusType = 1;
    this.slotScatterType = 0;
    this.splitScreen = false;
    this.slotBonus = false;
    this.slotGamble = true;
    this.slotFastStop = 1;
    this.slotExitUrl = '/';
    this.slotWildMpl = 1;
    this.GambleType = 1;

    this.slotFreeCount = 1;
    this.slotFreeMpl = 1;
    this.slotViewState = (this.game.slotViewState == '' ? 'Normal' : this.game.slotViewState);
    this.hideButtons = [];

    this.Bet = this.game.bet.split(',');
    this.Balance = this.user.balance;
    this.SymbolGame = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Reel strips from AGENTS.md
    this.reelStrip1 = [3, 3, 3, 50, 5, 5, 5, 99, 3, 3, 3, 50, 4, 4, 4, 100, 5, 5, 5, 101, 6, 6, 6, 50, 7, 7, 7, 102, 8, 8, 8, 50];
    this.reelStrip2 = [3, 3, 3, 50, 5, 5, 5, 99, 3, 3, 3, 50, 4, 4, 4, 100, 5, 5, 5, 101, 6, 6, 6, 50, 7, 7, 7, 102, 8, 8, 8, 50];
    this.reelStrip3 = [3, 3, 3, 50, 5, 5, 5, 99, 3, 3, 3, 50, 4, 4, 4, 100, 5, 5, 5, 101, 6, 6, 6, 50, 7, 7, 7, 102, 8, 8, 8, 50];
    this.reelStrip4 = [3, 3, 3, 50, 5, 5, 5, 99, 3, 3, 3, 50, 4, 4, 4, 100, 5, 5, 5, 101, 6, 6, 6, 50, 7, 7, 7, 102, 8, 8, 8, 50];
    this.reelStrip5 = [3, 3, 3, 50, 5, 5, 5, 99, 3, 3, 3, 50, 4, 4, 4, 100, 5, 5, 5, 101, 6, 6, 6, 50, 7, 7, 7, 102, 8, 8, 8, 50];
    this.reelStrip6 = [];
  }

  // Game-specific methods

  public FormatResponse(data: any): string {
    let str = new URLSearchParams(data).toString();
    str = str.replace(/%5D%5B/g, '.');
    str = str.replace(/%5B/g, '.');
    str = str.replace(/%5D/g, '');
    str = str.replace(/%252/g, '%2');
    return str;
  }

  public GetSpinSettings(bet: any, lines: any, garantType: string = 'bet'): any[] {
    let curField = 10;
    switch (lines) {
      case 10:
        curField = 10;
        break;
      case 9:
      case 8:
        curField = 9;
        break;
      case 7:
      case 6:
        curField = 7;
        break;
      case 5:
      case 4:
        curField = 5;
        break;
      case 3:
      case 2:
        curField = 3;
        break;
      case 1:
        curField = 1;
        break;
      default:
        curField = 10;
        break;
    }
    if (garantType != 'bet') {
      var pref = '_bonus';
    } else {
      var pref = '';
    }
    this.AllBet = parseInt(bet) * parseInt(lines);
    const linesPercentConfigSpin = this.game.get_lines_percent_config('spin');
    const linesPercentConfigBonus = this.game.get_lines_percent_config('bonus');
    const currentPercent = this.shop.percent;
    let currentSpinWinChance = 0;
    let currentBonusWinChance = 0;
    let percentLevel = '';

    // Validate that the configuration array exists and has data
    const spinConfigKey = 'line' + curField + pref;
    const bonusConfigKey = 'line' + curField + pref;

    if (linesPercentConfigSpin[spinConfigKey] && Array.isArray(linesPercentConfigSpin[spinConfigKey])) {
      for (const k in linesPercentConfigSpin[spinConfigKey]) {
        const l = k.split('_');
        if (l.length >= 2) {
          const l0 = parseInt(l[0]);
          const l1 = parseInt(l[1]);
          if (!isNaN(l0) && !isNaN(l1) && !isNaN(currentPercent)) {
            if (l0 <= currentPercent && currentPercent <= l1) {
              percentLevel = k;
              break;
            }
          }
        }
      }
    }

    // If no matching percent level found, use the first available key or fallback to default
    if (percentLevel === '') {
      if (linesPercentConfigSpin[spinConfigKey] && Object.keys(linesPercentConfigSpin[spinConfigKey]).length > 0) {
        // Use the first available configuration key
        percentLevel = Object.keys(linesPercentConfigSpin[spinConfigKey])[0];
      } else {
        // Fallback to safe defaults based on game type
        percentLevel = (pref === '_bonus') ? '1_100' : '1_100';
      }
    }

    // Safe array access with validation
    currentSpinWinChance = linesPercentConfigSpin[spinConfigKey]?.[percentLevel] ?? 100;
    currentBonusWinChance = linesPercentConfigBonus[bonusConfigKey]?.[percentLevel] ?? 1000;
    const RtpControlCount = 200;
    if (!this.HasGameDataStatic('SpinWinLimit')) {
      this.SetGameDataStatic('SpinWinLimit', 0);
    }
    if (!this.HasGameDataStatic('RtpControlCount')) {
      this.SetGameDataStatic('RtpControlCount', RtpControlCount);
    }
    let rtpRange = 0;
    if (this.game.stat_in > 0) {
      rtpRange = this.game.stat_out / this.game.stat_in * 100;
    }
    if (this.GetGameDataStatic('RtpControlCount') == 0) {
      if (currentPercent + Math.floor(Math.random() * 2 + 1) < rtpRange && this.GetGameDataStatic('SpinWinLimit') <= 0) {
        this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * 26 + 25));
      }
      if (pref == '' && this.GetGameDataStatic('SpinWinLimit') > 0) {
        currentBonusWinChance = 5000;
        currentSpinWinChance = 20;
        this.MaxWin = Math.floor(Math.random() * 5 + 1);
        if (rtpRange < (currentPercent - 1)) {
          this.SetGameDataStatic('SpinWinLimit', 0);
          this.SetGameDataStatic('RtpControlCount', this.GetGameDataStatic('RtpControlCount') - 1);
        }
      }
    } else if (this.GetGameDataStatic('RtpControlCount') < 0) {
      if (currentPercent + Math.floor(Math.random() * 2 + 1) < rtpRange && this.GetGameDataStatic('SpinWinLimit') <= 0) {
        this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * 26 + 25));
      }
      this.SetGameDataStatic('RtpControlCount', this.GetGameDataStatic('RtpControlCount') - 1);
      if (pref == '' && this.GetGameDataStatic('SpinWinLimit') > 0) {
        currentBonusWinChance = 5000;
        currentSpinWinChance = 20;
        this.MaxWin = Math.floor(Math.random() * 5 + 1);
        if (rtpRange < (currentPercent - 1)) {
          this.SetGameDataStatic('SpinWinLimit', 0);
        }
      }
      if (this.GetGameDataStatic('RtpControlCount') < (-1 * RtpControlCount) && currentPercent - 1 <= rtpRange && rtpRange <= (currentPercent + 2)) {
        this.SetGameDataStatic('RtpControlCount', RtpControlCount);
      }
    } else {
      this.SetGameDataStatic('RtpControlCount', this.GetGameDataStatic('RtpControlCount') - 1);
    }
    const bonusWin = Math.floor(Math.random() * currentBonusWinChance + 1);
    const spinWin = Math.floor(Math.random() * currentSpinWinChance + 1);
    const returnVal: any[] = ['none', 0];
    if (bonusWin == 1 && this.slotBonus) {
      this.isBonusStart = true;
      garantType = 'bonus';
      const winLimit = this.GetBank(garantType);
      returnVal[0] = 'bonus';
      returnVal[1] = winLimit;
      if (this.game.stat_in < (this.CheckBonusWin() * bet + this.game.stat_out) || winLimit < (this.CheckBonusWin() * bet)) {
        returnVal[0] = 'none';
        returnVal[1] = 0;
      }
    } else if (spinWin == 1) {
      const winLimit = this.GetBank(garantType);
      returnVal[0] = 'win';
      returnVal[1] = winLimit;
    }
    if (garantType == 'bet' && this.GetBalance() <= (2 / this.CurrentDenom)) {
      const randomPush = Math.floor(Math.random() * 10 + 1);
      if (randomPush == 1) {
        const winLimit = this.GetBank('');
        returnVal[0] = 'win';
        returnVal[1] = winLimit;
      }
    }
    return returnVal;
  }

  public getNewSpin(game: any, spinWin: number = 0, bonusWin: number = 0, lines: any, garantType: string = 'bet'): any {
    let curField = 10;
    switch (lines) {
      case 10:
        curField = 10;
        break;
      case 9:
      case 8:
        curField = 9;
        break;
      case 7:
      case 6:
        curField = 7;
        break;
      case 5:
      case 4:
        curField = 5;
        break;
      case 3:
      case 2:
        curField = 3;
        break;
      case 1:
        curField = 1;
        break;
      default:
        curField = 10;
        break;
    }
    if (garantType != 'bet') {
      var pref = '_bonus';
    } else {
      var pref = '';
    }
    let win: any[] = [];
    if (spinWin) {
      win = game.game_win['winline' + pref + curField].split(',');
    }
    if (bonusWin) {
      win = game.game_win['winbonus' + pref + curField].split(',');
    }
    const number = Math.floor(Math.random() * win.length);
    return win[number];
  }

  public GetRandomScatterPos(rp: any[]): number {
    const rpResult: number[] = [];
    for (let i = 0; i < rp.length; i++) {
      if (rp[i] == '0') {
        if (rp[i + 1] !== undefined && rp[i - 1] !== undefined) {
          rpResult.push(i);
        }
        if (rp[i - 1] !== undefined && rp[i - 2] !== undefined) {
          rpResult.push(i - 1);
        }
        if (rp[i + 1] !== undefined && rp[i + 2] !== undefined) {
          rpResult.push(i + 1);
        }
      }
    }
    // Shuffle array
    for (let i = rpResult.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rpResult[i], rpResult[j]] = [rpResult[j], rpResult[i]];
    }
    if (rpResult[0] === undefined) {
      rpResult[0] = Math.floor(Math.random() * (rp.length - 5) + 2);
    }
    return rpResult[0];
  }

  public GetReelStrips(winType: string, slotEvent: string): any {
    const game = this.game;
    let prs: any = {};
    if (winType != 'bonus') {
      ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'].forEach((reelStrip, index) => {
        if (Array.isArray(this[reelStrip]) && this[reelStrip].length > 0) {
          prs[index + 1] = Math.floor(Math.random() * (this[reelStrip].length - 6) + 3);
        }
      });
    } else {
      const reelsId: number[] = [];
      ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'].forEach((reelStrip, index) => {
        if (Array.isArray(this[reelStrip]) && this[reelStrip].length > 0) {
          prs[index + 1] = this.GetRandomScatterPos(this[reelStrip]);
          reelsId.push(index + 1);
        }
      });
      const scattersCnt = Math.floor(Math.random() * (reelsId.length - 2) + 3);
      // Shuffle array
      for (let i = reelsId.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reelsId[i], reelsId[j]] = [reelsId[j], reelsId[i]];
      }
      for (let i = 0; i < reelsId.length; i++) {
        if (i < scattersCnt) {
          prs[reelsId[i]] = this.GetRandomScatterPos(this['reelStrip' + reelsId[i]]);
        } else {
          prs[reelsId[i]] = Math.floor(Math.random() * (this['reelStrip' + reelsId[i]].length - 3));
        }
      }
    }
    const reel: any = {
      'rp': [],
      'rps': [[], [], []]
    };
    for (const index in prs) {
      const key = this['reelStrip' + index];
      const cnt = key.length;
      const value = prs[index];
      reel['reel' + index] = [];
      reel['reel' + index][0] = key[value];
      reel['reel' + index][1] = key[value + 1];
      reel['reel' + index][2] = key[value + 2];
      reel['reel' + index][3] = '';
      reel['rp'].push(value);
      reel['rps'][parseInt(index) - 1] = [value, value + 1, value + 2];
    }
    return reel;
  }

  // Game-specific methods restored from backup
  public DecodeData(astr: string): any {
    const aJson: any = {};
    const ajT0 = astr.split('&');
    for (const rootNode of ajT0) {
      const nodes = rootNode.split('=');
      const nodes0 = nodes[0].split('.');
      let laJson = aJson;
      for (let i = 0; i < nodes0.length; i++) {
        if (laJson[nodes0[i]] === undefined) {
          laJson[nodes0[i]] = {};
        }
        if (nodes0.length - 1 == i) {
          laJson[nodes0[i]] = nodes[1];
        }
        laJson = laJson[nodes0[i]];
      }
    }
    return aJson;
  }
}
