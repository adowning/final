import { BaseSlotSettings } from '../base/BaseSlotSettings';
import { IGameSettings } from '../base/types';
import { GameReel } from '../../utils/reel/GameReel';
import { ModelFactory } from '../../models/ModelFactory';

export class SlotSettings extends BaseSlotSettings {
    constructor(settings: IGameSettings) {
        super(settings);

        this.game = ModelFactory.createGame(settings.game);

        // Paytable initialization
        (this.Paytable as any) = {}; // Clear default and use as object
        (this.Paytable as any)['SYM_3'] = [0, 0, 0, 10, 30, 100];
        (this.Paytable as any)['SYM_4'] = [0, 0, 0, 8, 25, 75];
        (this.Paytable as any)['SYM_5'] = [0, 0, 0, 5, 20, 40];
        (this.Paytable as any)['SYM_6'] = [0, 0, 0, 5, 15, 30];
        (this.Paytable as any)['SYM_7'] = [0, 0, 0, 4, 10, 20];
        (this.Paytable as any)['SYM_8'] = [0, 0, 0, 4, 10, 20];
        (this.Paytable as any)['SYM_9'] = [0, 0, 0, 3, 8, 15];
        (this.Paytable as any)['SYM_10'] = [0, 0, 0, 3, 8, 15];

        // Game-specific initialization
        (this as any).scaleMode = '0';
        (this as any).numFloat = 0;

        (this as any).slotBonusType = '1';
        (this as any).slotScatterType = '0';
        this.splitScreen = false;
        this.slotBonus = false;
        this.slotGamble = true;
        (this as any).slotFastStop = true;
        (this as any).slotExitUrl = '/';
        (this as any).slotWildMpl = 1;
        (this as any).GambleType = '1';

        (this as any).slotFreeCount = [1];
        (this as any).slotFreeMpl = 1;
        this.slotViewState = (this.game?.slotViewState === '' ? 'Normal' : this.game?.slotViewState) || 'Normal';
        this.hideButtons = [];

        if (this.game?.bet) {
            this.Bet = (this.game.bet as string).split(',').map(Number);
        } else {
            this.Bet = [];
        }

        this.Balance = this.user?.balance || 0;
        this.SymbolGame = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

        // Set reel strips after super() call
        this.reelStrip1 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 9, 8, 10, 9, 6, 0, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 9, 10, 9, 6, 5, 4, 8, 7, 6, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 5, 4, 3, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStrip2 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 3, 4, 3, 10, 9, 8, 7, 13, 13, 13, 13, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 9, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStrip3 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 10, 9, 8, 7, 6, 5, 4, 9, 8, 10, 9, 3, 6, 5, 4, 10, 9, 7, 4, 9, 8, 10, 8, 13, 13, 13, 13, 0, 7, 6, 4, 8, 7, 6, 5, 4, 10, 9, 8, 13, 7, 6, 5, 4, 9, 10, 9, 6, 5, 4, 3, 8, 7, 6, 5, 4, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStrip4 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 13, 4, 3, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 13, 13, 13, 7, 6, 5, 4, 3, 9, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStrip5 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 0, 10, 9, 8, 7, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 13, 10, 9, 8, 7, 6, 5, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 4, 3, 9, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStrip6 = [];

        this.reelStripBonus1 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 9, 8, 10, 9, 6, 0, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 9, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStripBonus2 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 4, 3, 10, 9, 8, 7, 13, 13, 13, 13, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 7, 6, 5, 4, 3, 9, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStripBonus3 = [10, 9, 6, 5, 3, 4, 8, 7, 6, 5, 4, 10, 9, 8, 7, 6, 5, 4, 9, 3, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 9, 8, 10, 8, 13, 13, 13, 13, 0, 7, 6, 4, 8, 7, 6, 5, 4, 10, 9, 8, 13, 7, 6, 5, 4, 9, 10, 9, 6, 5, 4, 8, 7, 6, 3, 5, 4, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 3, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStripBonus4 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 13, 4, 3, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 3, 10, 9, 8, 7, 6, 5, 4, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 13, 13, 13, 7, 6, 5, 4, 3, 9, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStripBonus5 = [10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 0, 10, 9, 8, 7, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 13, 10, 9, 8, 7, 6, 5, 10, 9, 6, 5, 4, 8, 7, 6, 5, 4, 3, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 4, 3, 9, 6, 5, 4, 3, 9, 8, 10, 9, 6, 5, 4, 10, 9, 7, 4, 3, 9, 8, 10, 8, 7, 6, 4, 8, 7, 6, 5, 4, 3, 10, 9, 8].map(String);
        this.reelStripBonus6 = [];
    }

    public GetSpinSettings(bet: number, lines: number, garantType: string = 'bet'): any[] {
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
                this.SetGameDataStatic('SpinWinLimit', Math.floor(Math.random() * 26) + 25); // 25-50
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
        if (slotEvent === 'freespin') {
            // Logic to swap reels for freespin
            const bonusReels = [
                this.reelStripBonus1, this.reelStripBonus2, this.reelStripBonus3,
                this.reelStripBonus4, this.reelStripBonus5, this.reelStripBonus6
            ];
                
            const targetReels = [
                'reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'
            ];
                
            targetReels.forEach((key, index) => {
                if (bonusReels[index] && bonusReels[index].length > 0) {
                    (this as any)[key] = [...bonusReels[index]];
                }
            });
        }

        const prs: Record<number, number> = {};
        const reelsId: number[] = [];
        const targetReels = [
            'reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'
        ];

        if (winType !== 'bonus') {
            targetReels.forEach((key, index) => {
                const strip = (this as any)[key] as number[];
                if (Array.isArray(strip) && strip.length > 0) {
                    prs[index + 1] = Math.floor(Math.random() * (strip.length - 3)); // 0 to count-3
                }
            });
        } else {
            targetReels.forEach((key, index) => {
                const strip = (this as any)[key] as number[];
                if (Array.isArray(strip) && strip.length > 0) {
                    prs[index + 1] = this.GetRandomScatterPos(strip.map(String));
                    reelsId.push(index + 1);
                }
            });

            const scattersCnt = Math.floor(Math.random() * (reelsId.length - 3 + 1)) + 3; // rand(3, count)
                
            // shuffle reelsId
            for (let i = reelsId.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reelsId[i], reelsId[j]] = [reelsId[j], reelsId[i]];
            }

            for (let i = 0; i < reelsId.length; i++) {
                const reelIdx = reelsId[i];
                const strip = (this as any)['reelStrip' + reelIdx] as number[];
                    
                if (i < scattersCnt) {
                    prs[reelIdx] = this.GetRandomScatterPos(strip.map(String));
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
            const key = [...((this as any)[keyName] as number[])]; // Copy array
            const cnt = key.length;
                
            const getVal = (idx: number) => {
                if (idx < 0) return key[cnt + idx];
                if (idx >= cnt) return key[idx - cnt];
                return key[idx];
            };

            reel['reel' + index] = [];
                
            // PHP array access emulation: $key[$value - 1]
            reel['reel' + index][0] = key[(value - 1 + cnt) % cnt];
            reel['reel' + index][1] = key[value % cnt];
            reel['reel' + index][2] = key[(value + 1) % cnt];
            reel['reel' + index][3] = '';
            reel['rp'].push(value);
        });

        return reel;
    }

    protected abstractSpin(): any {
        // Not implemented in PHP version provided
        return {};
    }

    protected abstractGetSymbolsOnReels(): any {
        return {};
    }
}