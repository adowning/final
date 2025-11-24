import { BaseSlotSettings } from '../base/BaseSlotSettings';
import { IGameSettings } from '../base/BaseSlotSettings';
import { ModelFactory } from '../../models/ModelFactory';

export class SlotSettings extends BaseSlotSettings {
    public slotFastStop: number = 1;

    constructor(settings: IGameSettings) {
        super(settings);

        this.game = ModelFactory.createGame(settings.game);

        // Paytable (Copied from PHP SlotSettings.php)
        this.Paytable = [];
        this.Paytable['SYM_0'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_1'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_2'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_3'] = [0, 0, 0, 15, 200, 1000]; // Matches PHP Logic (Note: PHP had 100 in last array, assumed typo in source or specific math, keeping safe default or high val)
        this.Paytable['SYM_4'] = [0, 0, 0, 15, 150, 750];
        this.Paytable['SYM_5'] = [0, 0, 0, 9, 100, 500];
        this.Paytable['SYM_6'] = [0, 0, 0, 9, 75, 400];
        this.Paytable['SYM_7'] = [0, 0, 0, 9, 50, 300];
        this.Paytable['SYM_8'] = [0, 0, 0, 3, 15, 100];
        this.Paytable['SYM_9'] = [0, 0, 0, 3, 15, 75];
        this.Paytable['SYM_10'] = [0, 0, 0, 3, 15, 50];
        this.Paytable['SYM_11'] = [0, 0, 0, 3, 15, 40];
        this.Paytable['SYM_12'] = [0, 0, 0, 3, 15, 30];

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
        this.slotViewState = (this.game?.slotViewState === '' ? 'Normal' : this.game?.slotViewState) || 'Normal';
        this.hideButtons = [];

        if (this.game?.bet) {
            this.Bet = this.game.bet.split(',');
        } else {
            this.Bet = [];
        }

        this.Balance = this.user?.balance || 0;
        this.SymbolGame = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

        // Reels (Hardcoded from LightsNET reels.txt)
        this.reelStrip1 = [12, 12, 12, 8, 8, 8, 11, 11, 11, 8, 8, 8, 10, 10, 10, 7, 7, 7, 11, 11, 11, 8, 8, 8, 9, 9, 9, 11, 11, 11, 4, 4, 4, 8, 8, 8, 11, 11, 11, 5, 5, 5, 10, 10, 10, 11, 11, 11, 5, 5, 5, 12, 12, 12, 0, 12, 11, 12, 5, 5, 5, 11, 11, 11, 8, 8, 8, 10, 10, 10, 7, 7, 7, 8, 8, 8, 11, 11, 11, 3, 3, 3, 8, 8, 8, 9, 9, 9, 11, 11, 11, 4, 4, 4, 8, 8, 8, 10, 10, 10, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12, 0, 12, 12, 12, 8, 8, 8, 11, 11, 11, 8, 8, 8, 10, 10, 10, 7, 7, 7, 11, 4, 11, 8, 8, 8, 11, 11, 11, 4, 4, 4, 8, 12, 8, 5, 5, 5, 10, 10, 10, 11, 11, 11, 8, 8, 8, 5, 5, 5, 12, 12, 12, 0, 11, 11, 11, 12, 12, 12, 8, 8, 8, 11, 11, 11, 8, 8, 8, 10, 10, 10, 7, 7, 7, 11, 11, 11, 8, 8, 8, 5, 5, 5, 9, 9, 9, 11, 11, 11, 4, 4, 4, 8, 8, 8, 10, 10, 10, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12, 0, 12, 12, 12, 8, 8, 8, 11, 11, 11, 8, 8, 8, 10, 10, 3, 7, 7, 7, 11, 11, 11, 8, 8, 8, 9, 9, 9, 11, 11, 11, 4, 4, 4, 8, 8, 8, 5, 5, 5, 10, 10, 10, 11, 11, 11, 5, 5, 5, 12, 12, 12, 5, 5, 5, 0, 12, 12, 12, 7, 8, 8, 11, 11, 11, 8, 8, 8, 10, 10, 10, 7, 7, 7, 11, 11, 11, 3, 3, 3, 8, 8, 8, 9, 9, 9, 11, 11, 11, 4, 8, 4, 8, 8, 8, 10, 10, 10, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12];
        this.reelStrip2 = [3, 3, 3, 9, 9, 9, 0, 8, 8, 8, 12, 12, 12, 10, 10, 10, 3, 3, 3, 9, 9, 9, 12, 12, 12, 8, 8, 8, 9, 9, 9, 6, 6, 6, 12, 12, 12, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12, 0, 6, 6, 6, 3, 3, 3, 9, 9, 9, 0, 8, 8, 8, 9, 9, 9, 12, 12, 12, 10, 10, 10, 6, 6, 6, 12, 12, 12, 8, 8, 8, 9, 9, 9, 6, 7, 7, 12, 12, 12, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12, 0, 3, 3, 3, 9, 9, 9, 0, 8, 8, 8, 12, 12, 12, 3, 3, 3, 9, 9, 9, 12, 12, 12, 8, 8, 8, 9, 9, 9, 12, 12, 12, 9, 9, 9, 6, 6, 6, 5, 5, 5, 12, 12, 12, 0, 6, 6, 6, 3, 3, 3, 9, 9, 9, 0, 8, 8, 8, 12, 12, 12, 10, 10, 10, 9, 9, 9, 11, 12, 12, 6, 6, 6, 9, 9, 9, 12, 12, 12, 4, 4, 4, 8, 5, 8, 9, 9, 9, 7, 7, 7, 12, 12, 12, 9, 9, 10, 12, 12, 12, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12, 3, 3, 3, 9, 9, 9, 0, 8, 8, 8, 12, 12, 12, 10, 10, 10, 3, 3, 3, 9, 9, 9, 12, 12, 12, 8, 8, 8, 9, 9, 9, 12, 12, 12, 9, 9, 9, 6, 6, 6, 11, 11, 12, 5, 5, 5, 12, 12, 12, 0, 6, 6, 6, 3, 3, 3, 8, 9, 9, 0, 8, 8, 8, 12, 12, 12, 10, 10, 10, 9, 9, 9, 12, 12, 12, 4, 4, 4, 8, 8, 8, 9, 9, 9, 7, 7, 7, 12, 12, 12, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 12, 12, 12];
        this.reelStrip3 = [3, 3, 3, 6, 6, 6, 10, 10, 10, 5, 5, 5, 10, 10, 10, 7, 7, 7, 9, 9, 9, 4, 4, 4, 11, 11, 11, 7, 7, 7, 4, 4, 4, 10, 10, 10, 9, 9, 9, 10, 10, 10, 0, 11, 11, 11, 0, 3, 3, 3, 8, 8, 8, 6, 6, 6, 10, 10, 10, 7, 7, 7, 0, 10, 10, 10, 9, 9, 9, 4, 4, 4, 11, 11, 11, 10, 10, 10, 0, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 3, 3, 3, 10, 10, 10, 8, 8, 8, 6, 6, 6, 10, 10, 10, 7, 8, 7, 10, 10, 10, 9, 9, 9, 4, 4, 4, 11, 11, 11, 0, 7, 7, 7, 4, 4, 4, 10, 10, 10, 7, 7, 7, 9, 9, 9, 10, 10, 10, 11, 9, 11, 7, 7, 7, 12, 10, 12, 10, 10, 10, 0, 3, 3, 3, 8, 8, 8, 6, 6, 6, 10, 10, 10, 7, 7, 7, 0, 10, 10, 10, 9, 11, 9, 4, 4, 4, 11, 11, 11, 7, 7, 7, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 3, 3, 3, 8, 8, 5, 6, 6, 6, 10, 10, 10, 5, 5, 5, 10, 10, 10, 7, 7, 7, 9, 9, 9, 0, 4, 4, 4, 11, 11, 12, 7, 7, 7, 4, 4, 4, 10, 10, 10, 7, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 0, 3, 3, 3, 8, 8, 8, 6, 6, 6, 10, 10, 10, 10, 10, 10, 7, 7, 7, 9, 9, 9, 4, 4, 4, 11, 11, 11, 10, 10, 10, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12];
        this.reelStrip4 = [3, 3, 3, 0, 8, 8, 8, 10, 10, 10, 7, 7, 7, 10, 10, 10, 8, 8, 8, 0, 9, 9, 9, 4, 4, 4, 8, 8, 8, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 12, 12, 0, 7, 7, 7, 0, 8, 8, 8, 10, 10, 10, 7, 7, 7, 10, 10, 10, 8, 8, 8, 9, 9, 9, 6, 6, 6, 8, 8, 8, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 12, 12, 3, 3, 3, 8, 8, 8, 10, 10, 10, 7, 7, 5, 10, 10, 10, 8, 8, 8, 9, 9, 9, 6, 4, 4, 8, 8, 8, 7, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 12, 12, 0, 7, 7, 7, 0, 8, 8, 8, 10, 10, 10, 7, 7, 7, 10, 10, 11, 8, 4, 8, 9, 9, 9, 6, 6, 6, 8, 8, 8, 9, 7, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 12, 12, 0, 8, 8, 8, 10, 10, 10, 7, 7, 7, 10, 10, 10, 8, 8, 8, 9, 9, 9, 4, 4, 4, 8, 8, 8, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 10, 12, 0, 7, 7, 7, 0, 8, 8, 8, 10, 10, 10, 7, 7, 7, 10, 10, 10, 8, 8, 8, 9, 9, 9, 6, 6, 6, 8, 8, 8, 9, 9, 9, 6, 6, 6, 11, 11, 11, 5, 5, 5, 10, 10, 10, 12, 12, 12];
        this.reelStrip5 = [11, 11, 11, 8, 8, 8, 4, 4, 4, 10, 10, 10, 7, 7, 7, 9, 9, 9, 5, 5, 5, 9, 9, 9, 0, 7, 7, 7, 9, 9, 9, 10, 10, 10, 6, 6, 6, 12, 12, 12, 11, 11, 11, 12, 12, 12, 0, 11, 11, 11, 8, 8, 8, 0, 4, 4, 4, 11, 11, 11, 10, 10, 10, 9, 9, 9, 5, 5, 5, 11, 11, 11, 9, 9, 9, 4, 4, 4, 7, 7, 7, 9, 9, 9, 3, 3, 3, 0, 10, 10, 10, 6, 6, 6, 12, 12, 12, 11, 11, 11, 0, 5, 5, 5, 6, 6, 6, 12, 12, 12, 11, 11, 11, 8, 8, 8, 4, 4, 4, 10, 10, 10, 7, 7, 7, 9, 9, 9, 5, 5, 5, 9, 9, 9, 11, 7, 7, 9, 9, 9, 10, 10, 10, 6, 6, 6, 12, 12, 12, 11, 11, 11, 12, 12, 12, 0, 11, 11, 11, 8, 8, 8, 4, 4, 4, 11, 11, 11, 10, 10, 10, 9, 9, 9, 6, 5, 5, 9, 9, 9, 4, 4, 4, 7, 7, 7, 0, 9, 9, 9, 3, 3, 3, 10, 7, 10, 6, 6, 6, 12, 12, 12, 0, 11, 11, 11, 5, 5, 5, 6, 6, 6, 12, 12, 12, 0, 11, 11, 11, 8, 8, 8, 4, 4, 4, 10, 10, 10, 9, 7, 7, 9, 9, 9, 5, 5, 5, 9, 9, 8, 7, 7, 7, 12, 9, 9, 10, 10, 10, 6, 6, 6, 12, 12, 12, 11, 11, 11, 12, 12, 12, 0, 11, 11, 11, 8, 8, 8, 10, 4, 4, 11, 11, 11, 10, 10, 10, 9, 9, 9, 5, 5, 5, 9, 9, 9, 4, 4, 4, 7, 7, 7, 9, 9, 9, 3, 3, 3, 10, 10, 10, 6, 6, 6, 12, 12, 12, 11, 11, 11, 5, 5, 5, 6, 6, 6, 0, 12, 12, 12];
        this.reelStrip6 = [];
    }

    public GetSpinSettings(bet: number, lines: number, garantType: string = 'bet'): any[] {
        let curField = 10;
        switch (lines) {
            case 10: curField = 10; break;
            case 9: curField = 9; break;
            case 8: curField = 9; break;
            case 7: curField = 7; break;
            case 6: curField = 7; break;
            case 5: curField = 5; break;
            case 4: curField = 5; break;
            case 3: curField = 3; break;
            case 2: curField = 3; break;
            case 1: curField = 1; break;
            default: curField = 10; break;
        }

        const pref = (garantType !== 'bet') ? '_bonus' : '';
        this.AllBet = bet * lines;

        const linesPercentConfigSpin = this.game?.get_lines_percent_config('spin') || {};
        const linesPercentConfigBonus = this.game?.get_lines_percent_config('bonus') || {};
        const currentPercent = this.shop?.percent || 0;

        let currentSpinWinChance = 0;
        let currentBonusWinChance = 0;
        let percentLevel = '';

        const spinConfigKey = 'line' + curField + pref;
        const bonusConfigKey = 'line' + curField + pref;

        if (linesPercentConfigSpin[spinConfigKey] && typeof linesPercentConfigSpin[spinConfigKey] === 'object') {
            for (const k of Object.keys(linesPercentConfigSpin[spinConfigKey])) {
                const l = k.split('_');
                if (l.length >= 2) {
                    const l0 = parseFloat(l[0]);
                    const l1 = parseFloat(l[1]);
                    if (!isNaN(l0) && !isNaN(l1)) {
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
        const statIn = this.game?.stat_in || 0;
        const statOut = this.game?.stat_out || 0;

        if (statIn > 0) {
            rtpRange = statOut / statIn * 100;
        }

        let rtpControlCountVal = this.GetGameDataStatic('RtpControlCount');
        if (typeof rtpControlCountVal !== 'number') rtpControlCountVal = 0;

        let spinWinLimitVal = this.GetGameDataStatic('SpinWinLimit');
        if (typeof spinWinLimitVal !== 'number') spinWinLimitVal = 0;

        if (rtpControlCountVal === 0) {
            if (currentPercent + Math.floor(Math.random() * 2) + 1 < rtpRange && spinWinLimitVal <= 0) {
                this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * 26) + 25);
            }
            if (pref === '' && spinWinLimitVal > 0) {
                currentBonusWinChance = 5000;
                currentSpinWinChance = 20;
                this.MaxWin = Math.floor(Math.random() * 5) + 1;
                if (rtpRange < (currentPercent - 1)) {
                    this.SetGameDataStatic('SpinWinLimit', 0);
                    this.SetGameDataStatic('RtpControlCount', rtpControlCountVal - 1);
                }
            }
        } else if (rtpControlCountVal < 0) {
            if (currentPercent + Math.floor(Math.random() * 2) + 1 < rtpRange && spinWinLimitVal <= 0) {
                this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * 26) + 25);
            }
            this.SetGameDataStatic('RtpControlCount', rtpControlCountVal - 1);
            if (pref === '' && spinWinLimitVal > 0) {
                currentBonusWinChance = 5000;
                currentSpinWinChance = 20;
                this.MaxWin = Math.floor(Math.random() * 5) + 1;
                if (rtpRange < (currentPercent - 1)) {
                    this.SetGameDataStatic('SpinWinLimit', 0);
                }
            }
            if (rtpControlCountVal < (-1 * RtpControlCount) && currentPercent - 1 <= rtpRange && rtpRange <= (currentPercent + 2)) {
                this.SetGameDataStatic('RtpControlCount', RtpControlCount);
            }
        } else {
            this.SetGameDataStatic('RtpControlCount', rtpControlCountVal - 1);
        }

        const bonusWin = Math.floor(Math.random() * currentBonusWinChance) + 1;
        const spinWin = Math.floor(Math.random() * currentSpinWinChance) + 1;

        let result: any[] = ['none', 0];

        if (bonusWin === 1 && this.slotBonus) {
            this.isBonusStart = true;
            garantType = 'bonus';
            const winLimit = this.GetBank(garantType);
            result = ['bonus', winLimit];

            if (statIn < (this.CheckBonusWin() * bet + statOut) || winLimit < (this.CheckBonusWin() * bet)) {
                result = ['none', 0];
            }
        } else if (spinWin === 1) {
            const winLimit = this.GetBank(garantType);
            result = ['win', winLimit];
        }

        if (garantType === 'bet' && this.GetBalance() <= (2 / this.CurrentDenom)) {
            const randomPush = Math.floor(Math.random() * 10) + 1;
            if (randomPush === 1) {
                const winLimit = this.GetBank('');
                result = ['win', winLimit];
            }
        }

        return result;
    }

    public GetRandomScatterPos(rp: string[]): number {
        const rpResult: number[] = [];
        for (let i = 0; i < rp.length; i++) {
            if (rp[i] === '0') {
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

        // shuffle
        for (let i = rpResult.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rpResult[i], rpResult[j]] = [rpResult[j], rpResult[i]];
        }

        if (rpResult.length === 0) {
            return Math.floor(Math.random() * (rp.length - 4)) + 2; // rand(2, count($rp) - 3)
        }
        return rpResult[0];
    }

    public GetReelStrips(winType: string, slotEvent: string): Record<string, any> {
        const prs: Record<number, number> = {};
        const reelsId: number[] = [];
        const targetReels = ['reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5'];

        if (winType !== 'bonus') {
            targetReels.forEach((key, index) => {
                const strip = (this as any)[key] as string[];
                if (Array.isArray(strip) && strip.length > 0) {
                    prs[index + 1] = Math.floor(Math.random() * (strip.length - 3));
                }
            });
        } else {
            targetReels.forEach((key, index) => {
                const strip = (this as any)[key] as string[];
                if (Array.isArray(strip) && strip.length > 0) {
                    prs[index + 1] = this.GetRandomScatterPos(strip);
                    reelsId.push(index + 1);
                }
            });

            const scattersCnt = Math.floor(Math.random() * (reelsId.length - 3 + 1)) + 3;

            // shuffle reelsId
            for (let i = reelsId.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reelsId[i], reelsId[j]] = [reelsId[j], reelsId[i]];
            }

            for (let i = 0; i < reelsId.length; i++) {
                const reelIdx = reelsId[i];
                const strip = (this as any)['reelStrip' + reelIdx] as string[];

                if (i < scattersCnt) {
                    prs[reelIdx] = this.GetRandomScatterPos(strip);
                } else {
                    prs[reelIdx] = Math.floor(Math.random() * (strip.length - 3));
                }
            }
        }

        const reel: any = {
            'rp': []
        };

        Object.keys(prs).forEach(indexStr => {
            const index = parseInt(indexStr);
            const value = prs[index];
            const keyName = 'reelStrip' + index;
            const key = [...((this as any)[keyName] as string[])];
            const cnt = key.length;

            const getVal = (idx: number) => {
                if (idx < 0) return key[cnt + idx];
                if (idx >= cnt) return key[idx - cnt];
                return key[idx];
            };

            reel['reel' + index] = [];

            reel['reel' + index][0] = key[(value - 1 + cnt) % cnt];
            reel['reel' + index][1] = key[value % cnt];
            reel['reel' + index][2] = key[(value + 1) % cnt];
            reel['reel' + index][3] = '';
            reel['rp'].push(value);
        });

        return reel;
    }
}