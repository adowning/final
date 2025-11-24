import { BaseSlotSettings } from '../base/BaseSlotSettings';
import { IGameSettings } from '../base/types';
import { GameReel } from '../../utils/reel/GameReel';

export class SlotSettings extends BaseSlotSettings {
    public slotFastStop: number = 1;

    constructor(settings: IGameSettings) {
        super(settings);

        // Paytable initialization
        this.Paytable = []; // Clear default
        this.Paytable['SYM_0'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_1'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_2'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_3'] = [0, 0, 0, 25, 250, 750];
        this.Paytable['SYM_4'] = [0, 0, 0, 20, 200, 600];
        this.Paytable['SYM_5'] = [0, 0, 0, 15, 150, 500];
        this.Paytable['SYM_6'] = [0, 0, 0, 10, 100, 400];
        this.Paytable['SYM_7'] = [0, 0, 0, 5, 40, 125];
        this.Paytable['SYM_8'] = [0, 0, 0, 5, 40, 125];
        this.Paytable['SYM_9'] = [0, 0, 0, 4, 30, 100];
        this.Paytable['SYM_10'] = [0, 0, 0, 4, 30, 100];

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
        this.slotViewState = (this.game?.slotViewState === '' ? 'Normal' : this.game?.slotViewState) || 'Normal';
        this.hideButtons = [];

        if (this.game?.bet) {
            this.Bet = this.game.bet.split(',');
        } else {
            this.Bet = [];
        }
        
        this.Balance = this.user?.balance || 0;
        this.SymbolGame = [
            '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
        ];

        this.reelStrip1 = ['3','8','3','6','7','4','6','3','5','9','8','5','8','9','8','7','4','3','7','3','5','6','0','4','7','4','9','8','7','8','7','5','9','8','6','9','8','0','5','8','10','4','7','10','4','6','10','6','8','6','7','6','3','7','5','9','6','3','10','9','10','9','8','5','8','0','3','7','4','6','5','6','8','5','9','5','10','4','10','4','9','8','10','8','9','6','9','5','4','7','10','7','4','7','10','5','0','3','7','7','3','10','5','9','4','6','10','6','3','5','8','5','10','9','10','9','7','8','10','8','5','6','10','4','8','8','10','1'];
        this.reelStrip2 = ['3','8','6','3','6','7','4','6','3','5','0','5','8','9','8','9','8','7','5','7','4','3','7','3','5','6','5','4','7','4','9','8','7','5','9','8','8','6','5','8','10','7','4','7','10','4','6','10','6','8','6','7','9','3','5','7','5','9','10','6','10','3','9','10','9','5','8','5','9','8','3','7','4','6','5','8','5','9','5','10','4','5','4','10','9','8','10','8','9','10','6','5','7','4','7','4','7','10','3','10','7','6','10','3','9','10','4','6','10','3','8','5','10','6','0','9','10','7','8','10','8','5','6','5','10','4','8','10','1'];
        this.reelStrip3 = ['3','8','6','7','6','7','4','6','8','3','5','9','5','8','9','8','7','4','3','7','5','3','5','6','3','0','4','7','9','8','4','7','8','7','5','9','5','9','5','8','6','0','5','8','10','5','4','7','10','4','10','6','8','6','9','6','0','3','7','6','5','9','6','3','10','9','10','5','9','8','5','8','7','0','3','7','8','6','4','5','6','5','8','9','10','5','4','10','5','4','10','9','8','9','10','9','6','7','5','4','7','6','4','7','10','0','3','6','7','3','10','9','6','4','6','10','3','8','0','7','9','10','7','10','8','5','6','5','10','8','4','8','10','1'];
        this.reelStrip4 = ['3','8','6','7','6','7','6','3','0','5','8','9','8','9','8','7','4','3','7','5','3','5','6','5','4','8','7','8','7','5','9','6','5','8','10','4','7','4','6','8','6','9','3','7','5','9','6','10','3','5','9','5','8','10','8','3','7','4','6','10','6','8','5','9','5','10','4','4','10','9','0','8','9','10','9','6','5','4','7','7','4','7','10','0','3','7','3','7','10','4','6','3','5','10','9','7','8','10','8','5','6','5','10','4','10','8','10','1'];
        this.reelStrip5 = ['3','8','3','6','7','4','3','0','5','8','9','8','7','8','7','4','3','7','3','5','6','4','0','7','4','9','7','8','7','3','5','9','8','0','5','8','4','7','4','6','7','5','9','0','3','7','5','9','3','6','10','3','9','10','9','5','8','0','3','7','4','10','6','8','5','9','5','10','4','10','9','10','0','8','10','9','6','4','7','4','3','7','3','10','9','4','6','3','8','5','10','0','9','7','8','5','6','10','4','8','10','1'];
        this.reelStrip6 = [];

        this.reelStripBonus1 = ['3','8','3','6','7','4','6','3','5','9','8','5','8','9','8','7','4','3','7','3','5','6','0','4','7','4','9','8','7','8','7','5','9','8','6','9','8','0','5','8','10','4','7','10','4','6','10','6','8','6','7','6','3','7','5','9','6','3','10','9','10','9','8','5','8','0','3','7','4','6','5','6','8','5','9','5','10','4','10','4','9','8','10','8','9','6','9','5','4','7','10','7','4','7','10','5','0','3','7','7','3','10','5','9','4','6','10','6','3','5','8','5','10','9','10','9','7','8','10','8','5','6','10','4','8','8','10','1'];
        this.reelStripBonus2 = ['3','8','6','3','6','7','4','6','3','5','0','5','8','9','8','9','8','7','5','7','4','3','7','3','5','6','5','4','7','4','9','8','7','5','9','8','8','6','5','8','10','7','4','7','10','4','6','10','6','8','6','7','9','3','5','7','5','9','10','6','10','3','9','10','9','5','8','5','9','8','3','7','4','6','5','8','5','9','5','10','4','5','4','10','9','8','10','8','9','10','6','5','7','4','7','4','7','10','3','10','7','6','10','3','9','10','4','6','10','3','8','5','10','6','0','9','10','7','8','10','8','5','6','5','10','4','8','10','1'];
        this.reelStripBonus3 = ['3','8','6','7','6','7','4','6','8','3','5','9','5','8','9','8','7','4','3','7','5','3','5','6','3','0','4','7','9','8','4','7','8','7','5','9','5','9','5','8','6','0','5','8','10','5','4','7','10','4','10','6','8','6','9','6','0','3','7','6','5','9','6','3','10','9','10','5','9','8','5','8','7','0','3','7','8','6','4','5','6','5','8','9','10','5','4','10','5','4','10','9','8','9','10','9','6','7','5','4','7','6','4','7','10','0','3','6','7','3','10','9','6','4','6','10','3','8','0','7','9','10','7','10','8','5','6','5','10','8','4','8','10','1'];
        this.reelStripBonus4 = ['3','8','6','7','6','7','6','3','0','5','8','9','8','9','8','7','4','3','7','5','3','5','6','5','4','8','7','8','7','5','9','6','5','8','10','4','7','4','6','8','6','9','3','7','5','9','6','10','3','5','9','5','8','10','8','3','7','4','6','10','6','8','5','9','5','10','4','4','10','9','0','8','9','10','9','6','5','4','7','7','4','7','10','0','3','7','3','7','10','4','6','3','5','10','9','7','8','10','8','5','6','5','10','4','10','8','10','1'];
        this.reelStripBonus5 = ['3','8','3','6','7','4','3','0','5','8','9','8','7','8','7','4','3','7','3','5','6','4','0','7','4','9','7','8','7','3','5','9','8','0','5','8','4','7','4','6','7','5','9','0','3','7','5','9','3','6','10','3','9','10','9','5','8','0','3','7','4','10','6','8','5','9','5','10','4','10','9','10','0','8','10','9','6','4','7','4','3','7','3','10','9','4','6','3','8','5','10','0','9','7','8','5','6','10','4','8','10','1'];
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
                const strip = (this as any)[key] as string[];
                if (Array.isArray(strip) && strip.length > 0) {
                    prs[index + 1] = Math.floor(Math.random() * (strip.length - 3)); // 0 to count-3
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

            const scattersCnt = Math.floor(Math.random() * (reelsId.length - 3 + 1)) + 3; // rand(3, count)
            
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
            const key = [...((this as any)[keyName] as string[])]; // Copy array
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
