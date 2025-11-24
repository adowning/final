import BaseSlotSettings, { IGameSettings } from '../base/BaseSlotSettings';
import ModelFactory from '../../models/ModelFactory';

class SlotSettings extends BaseSlotSettings {
    public slotFastStop: number = 1;
    public scaleMode: number = 0;
    public numFloat: number = 0;
    public slotBonusType: number = 1;
    public slotScatterType: number = 0;
    public splitScreen: boolean = false;
    public slotBonus: boolean = false;
    public slotGamble: boolean = true;
    public slotExitUrl: string = '/';
    public slotWildMpl: number = 1;
    public GambleType: number = 1;
    public slotFreeCount: number = 1;
    public slotFreeMpl: number = 1;
    public slotViewState: string = 'Normal';
    public hideButtons: any[] = [];
    public isBonusStart: boolean = false;

    // Placeholder for missing reels
    public reelStrip1: number[] = [1, 2, 3];
    public reelStrip2: number[] = [1, 2, 3];
    public reelStrip3: number[] = [1, 2, 3];
    public reelStrip4: number[] = [1, 2, 3];
    public reelStrip5: number[] = [1, 2, 3];
    public reelStrip6: number[] = [1, 2, 3];
    
    public reelStripBonus1: number[] = [];
    public reelStripBonus2: number[] = [];
    public reelStripBonus3: number[] = [];
    public reelStripBonus4: number[] = [];
    public reelStripBonus5: number[] = [];
    public reelStripBonus6: number[] = [];

    constructor(settings: IGameSettings) {
        super(settings);
        this.game = ModelFactory.createGame(settings.game);

        // Paytable initialization
        this.Paytable['SYM_1'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_2'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_3'] = [0, 0, 5, 25, 300, 2000];
        this.Paytable['SYM_4'] = [0, 0, 0, 25, 150, 1000];
        this.Paytable['SYM_5'] = [0, 0, 0, 20, 125, 750];
        this.Paytable['SYM_6'] = [0, 0, 0, 20, 100, 500];
        this.Paytable['SYM_7'] = [0, 0, 0, 15, 75, 200];
        this.Paytable['SYM_8'] = [0, 0, 0, 15, 50, 150];
        this.Paytable['SYM_9'] = [0, 0, 0, 10, 25, 100];
        this.Paytable['SYM_10'] = [0, 0, 0, 5, 20, 75];
        this.Paytable['SYM_11'] = [0, 0, 0, 5, 15, 60];
        this.Paytable['SYM_12'] = [0, 0, 0, 5, 10, 50];

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
    }

    public GetSpinSettings(garantType: string = 'bet', bet: number, lines: number): any {
        let curField = 10;
        switch (lines) {
            case 10: curField = 10; break;
            case 9:
            case 8: curField = 9; break;
            case 7:
            case 6: curField = 7; break;
            case 5:
            case 4: curField = 5; break;
            case 3:
            case 2: curField = 3; break;
            case 1: curField = 1; break;
            default: curField = 10; break;
        }

        let pref = '';
        if (garantType != 'bet') {
            pref = '_bonus';
        } else {
            pref = '';
        }

        this.AllBet = bet * lines;
        // Assuming this.game has these methods or properties available from ModelFactory
        // In TS, we might need to access them differently if they are raw JSON.
        // The PHP code calls $this->game->get_lines_percent_config('spin');
        // I'll assume this.game is the raw object and these are properties or I need to mock them if they are methods.
        // BaseSlotSettings says this.game is IGameSettings['game'], which is usually an object.
        // If 'get_lines_percent_config' is a method on the PHP object, it might be a property in the JSON.
        // I will assume it's a property named `lines_percent_config_spin` etc. or similar, OR I have to implement the logic.
        // Looking at BaseSlotSettings.ts (reference), it doesn't seem to have helper methods for this.
        // I'll assume for now that I can access properties directly or use a helper if available.
        // Since I can't see the ModelFactory implementation, I'll assume the JSON structure matches.
        // BUT, the PHP code uses a method `get_lines_percent_config`. This suggests logic.
        // I will implement a basic version or try to access `lines_percent_config` property.
        
        // Use 'any' to bypass strict type checking for dynamic properties
        const gameAny = this.game as any;
        const linesPercentConfigSpin = gameAny.lines_percent_config_spin || []; 
        const linesPercentConfigBonus = gameAny.lines_percent_config_bonus || [];
        
        const currentPercent = this.shop.percent;
        let currentSpinWinChance = 0;
        let currentBonusWinChance = 0;
        let percentLevel = '';

        const spinConfigKey = 'line' + curField + pref;
        const bonusConfigKey = 'line' + curField + pref;

        if (linesPercentConfigSpin[spinConfigKey] && Array.isArray(linesPercentConfigSpin[spinConfigKey])) {
             // TS equivalent of PHP foreach loop over associative array? 
             // PHP arrays are objects in JS/TS if keys are strings.
             // If it's an array of objects, I iterate.
             // Assuming it's an object/map.
             const config = linesPercentConfigSpin[spinConfigKey];
             for (const k in config) {
                 const v = config[k];
                 const l = k.split('_');
                 if (l.length >= 2) {
                     const l0 = parseFloat(l[0]);
                     const l1 = parseFloat(l[1]);
                     if (!isNaN(l0) && !isNaN(l1) && !isNaN(currentPercent)) {
                         if (l0 <= currentPercent && currentPercent <= l1) {
                             percentLevel = k;
                             break;
                         }
                     }
                 }
             }
        }

        if (percentLevel === '') {
            if (linesPercentConfigSpin[spinConfigKey] && Object.keys(linesPercentConfigSpin[spinConfigKey]).length > 0) {
                percentLevel = Object.keys(linesPercentConfigSpin[spinConfigKey])[0];
            } else {
                percentLevel = (pref === '_bonus') ? '1_100' : '1_100';
            }
        }

        currentSpinWinChance = (linesPercentConfigSpin[spinConfigKey] && linesPercentConfigSpin[spinConfigKey][percentLevel]) 
            ? linesPercentConfigSpin[spinConfigKey][percentLevel] : 100;
        currentBonusWinChance = (linesPercentConfigBonus[bonusConfigKey] && linesPercentConfigBonus[bonusConfigKey][percentLevel])
            ? linesPercentConfigBonus[bonusConfigKey][percentLevel] : 1000;

        const RtpControlCount = 200;
        if (!this.HasGameDataStatic('SpinWinLimit')) {
            this.SetGameDataStatic('SpinWinLimit', 0);
        }
        if (!this.HasGameDataStatic('RtpControlCount')) {
            this.SetGameDataStatic('RtpControlCount', RtpControlCount);
        }

        let rtpRange = 0;
        if (this.game.stat_in > 0) {
            rtpRange = (this.game.stat_out / this.game.stat_in) * 100;
        }

        if (this.GetGameDataStatic('RtpControlCount') == 0) {
            if (currentPercent + Math.floor(Math.random() * 2) + 1 < rtpRange && this.GetGameDataStatic('SpinWinLimit') <= 0) {
                this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * (50 - 25 + 1)) + 25);
            }
            if (pref == '' && this.GetGameDataStatic('SpinWinLimit') > 0) {
                currentBonusWinChance = 5000;
                currentSpinWinChance = 20;
                this.MaxWin = Math.floor(Math.random() * 5) + 1;
                if (rtpRange < (currentPercent - 1)) {
                    this.SetGameDataStatic('SpinWinLimit', 0);
                    this.SetGameDataStatic('RtpControlCount', this.GetGameDataStatic('RtpControlCount') - 1);
                }
            }
        } else if (this.GetGameDataStatic('RtpControlCount') < 0) {
            if (currentPercent + Math.floor(Math.random() * 2) + 1 < rtpRange && this.GetGameDataStatic('SpinWinLimit') <= 0) {
                this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * (50 - 25 + 1)) + 25);
            }
            this.SetGameDataStatic('RtpControlCount', this.GetGameDataStatic('RtpControlCount') - 1);
            if (pref == '' && this.GetGameDataStatic('SpinWinLimit') > 0) {
                currentBonusWinChance = 5000;
                currentSpinWinChance = 20;
                this.MaxWin = Math.floor(Math.random() * 5) + 1;
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

        const bonusWin = Math.floor(Math.random() * currentBonusWinChance) + 1;
        const spinWin = Math.floor(Math.random() * currentSpinWinChance) + 1;

        let result: any[] = ['none', 0];

        if (bonusWin == 1 && this.slotBonus) {
            this.isBonusStart = true;
            garantType = 'bonus';
            let winLimit = this.GetBank(garantType);
            result = ['bonus', winLimit];
            if (this.game.stat_in < (this.CheckBonusWin() * bet + this.game.stat_out) || winLimit < (this.CheckBonusWin() * bet)) {
                result = ['none', 0];
            }
        } else if (spinWin == 1) {
            let winLimit = this.GetBank(garantType);
            result = ['win', winLimit];
        }

        if (garantType == 'bet' && this.GetBalance() <= (2 / this.CurrentDenom)) {
            const randomPush = Math.floor(Math.random() * 10) + 1;
            if (randomPush == 1) {
                let winLimit = this.GetBank('');
                result = ['win', winLimit];
            }
        }

        return result;
    }

    public getNewSpin(game: any, spinWin: number = 0, bonusWin: number = 0, lines: number, garantType: string = 'bet'): string {
        let curField = 10;
        switch (lines) {
            case 10: curField = 10; break;
            case 9:
            case 8: curField = 9; break;
            case 7:
            case 6: curField = 7; break;
            case 5:
            case 4: curField = 5; break;
            case 3:
            case 2: curField = 3; break;
            case 1: curField = 1; break;
            default: curField = 10; break;
        }

        let pref = '';
        if (garantType != 'bet') {
            pref = '_bonus';
        } else {
            pref = '';
        }

        let win: string[] = [];
        if (spinWin) {
            win = game.game_win['winline' + pref + curField].split(',');
        }
        if (bonusWin) {
            win = game.game_win['winbonus' + pref + curField].split(',');
        }

        if (win.length === 0) return '';

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
        
        // Shuffle equivalent
        for (let i = rpResult.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rpResult[i], rpResult[j]] = [rpResult[j], rpResult[i]];
        }

        if (rpResult[0] === undefined) {
            rpResult[0] = Math.floor(Math.random() * (rp.length - 3 - 2 + 1)) + 2;
        }
        return rpResult[0];
    }

    public GetReelStrips(winType: string, slotEvent: string): any {
        const game = this.game;
        // Logic from SlotSettings.php
        let prs: any = {};
        let reelsId: number[] = [];
        
        if (winType != 'bonus') {
            const strips = [
                this.reelStrip1,
                this.reelStrip2,
                this.reelStrip3,
                this.reelStrip4,
                this.reelStrip5,
                this.reelStrip6
            ];

            strips.forEach((reelStrip, index) => {
                 if (Array.isArray(reelStrip) && reelStrip.length > 0) {
                     prs[index + 1] = Math.floor(Math.random() * (reelStrip.length - 3));
                 }
            });
        } else {
             const strips = [
                this.reelStrip1,
                this.reelStrip2,
                this.reelStrip3,
                this.reelStrip4,
                this.reelStrip5,
                this.reelStrip6
            ];

            strips.forEach((reelStrip, index) => {
                 if (Array.isArray(reelStrip) && reelStrip.length > 0) {
                     prs[index + 1] = this.GetRandomScatterPos(reelStrip);
                     reelsId.push(index + 1);
                 }
            });

            const scattersCnt = Math.floor(Math.random() * (reelsId.length - 3 + 1)) + 3; // rand(3, count($reelsId))
            
            // Shuffle reelsId
             for (let i = reelsId.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reelsId[i], reelsId[j]] = [reelsId[j], reelsId[i]];
            }

            for (let i = 0; i < reelsId.length; i++) {
                const stripIdx = reelsId[i];
                const strip = (this as any)['reelStrip' + stripIdx];
                if (i < scattersCnt) {
                    prs[stripIdx] = this.GetRandomScatterPos(strip);
                } else {
                    prs[stripIdx] = Math.floor(Math.random() * (strip.length - 3));
                }
            }
        }

        const reel: any = {
            rp: []
        };

        for (const index in prs) {
            const value = prs[index];
            const key = [...(this as any)['reelStrip' + index]]; // Copy array
            const cnt = key.length;
            // key[-1] = key[cnt - 1] -> in JS access logic
            // key[cnt] = key[0] -> push
            
            // Construct the reel view
            // In PHP: $key[-1] = $key[$cnt - 1]; $key[$cnt] = $key[0];
            // $reel['reel' . $index][0] = $key[$value - 1];
            // $reel['reel' . $index][1] = $key[$value];
            // $reel['reel' . $index][2] = $key[$value + 1];
            
            // We need to handle indices wrapping
            const valMinus1 = (value - 1 < 0) ? key[cnt - 1] : key[value - 1];
            const val = key[value];
            const valPlus1 = (value + 1 >= cnt) ? key[0] : key[value + 1];

            reel['reel' + index] = [];
            reel['reel' + index][0] = valMinus1;
            reel['reel' + index][1] = val;
            reel['reel' + index][2] = valPlus1;
            reel['reel' + index][3] = '';
            reel.rp.push(value);
        }

        return reel;
    }
}

export default SlotSettings;
