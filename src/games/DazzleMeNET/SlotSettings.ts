import { BaseSlotSettings } from '../base/BaseSlotSettings';
import { IGameSettings } from '../base/types';

export class SlotSettings extends BaseSlotSettings {
    public slotFastStop: number = 1;

    constructor(settings: IGameSettings) {
        super(settings);

        // Paytable initialization
        this.Paytable = []; // Clear default
        this.Paytable['SYM_0'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_1'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_2'] = [0, 0, 0, 0, 0, 0];
        this.Paytable['SYM_3'] = [0, 0, 1, 12, 30, 200];
        this.Paytable['SYM_4'] = [0, 0, 1, 8, 15, 100];
        this.Paytable['SYM_5'] = [0, 0, 0, 4, 8, 30];
        this.Paytable['SYM_6'] = [0, 0, 0, 4, 8, 30];
        this.Paytable['SYM_7'] = [0, 0, 0, 3, 5, 20];
        this.Paytable['SYM_8'] = [0, 0, 0, 3, 5, 20];

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

        // Reels provided by user
        this.reelStrip1 = ['8','8','8','6','6','6','3','3','8','8','8','5','5','7','7','7','8','8','8','0','4','4','5','5','8','8','8','6','6','6','5','5','5','7','7','7','8','8','8','5','5','3','3','4','4','8','8','8','7','7','7','6','6','8','8','8','7','7','7','5','5','8','8','8','6','6','6','7','7','7','8','8','8','5','5','4','4','8','8','8','6','6','6','7','7','7','8','8','8','6','6','6','5','5','5','4','4','6','6','3','3','3','5','5','5','6','6','6','7','7','7','0','4','4','4','6','6','3','3','8','8','8','6','6','5','5','7','7','7','4','4','8','8','8','7','7','7','5','5','5','8','8','8','6','6','4','4','4','7','7','7','8','8','8','5','5','5','7','7','7','4','4','6','6','6','7','7','7','4','4','6','6','6','5','5','3','3','3','8','8','8','6','6','6','5','5','8','8','8','4','4','5','5','5','8','8','8','6','6','5','5','8','8','8','7','7','7','6','6','6','8','8','8','4','4','6','6','3','3','8','8','8','6','6','6'];
        this.reelStrip2 = ['8','8','8','5','5','5','3','3','3','6','6','6','5','5','5','8','8','8','4','4','6','6','7','7','7','4','4','3','3','5','5','5','6','6','6','8','8','8','5','5','3','3','4','4','4','8','8','8','7','7','7','3','3','6','6','6','7','7','7','5','5','5','4','4','4','7','7','7','6','6','6','3','3','8','8','8','5','5','5','6','6','6','7','7','7','5','5','8','8','8','6','6','6','7','7','7','0','8','8','8','7','7','7','5','5','6','6','6','8','8','8','0','7','7','7','5','5','5','3','3','6','6','5','5','7','7','7','3','3','5','5','5','7','7','7','8','8','8','6','6','6','5','5','4','4','6','6','5','5','5','7','7','7','4','4','5','5','8','8','8','7','7','7','3','3','4','4','4','7','7','7','6','6','6','4','4','7','7','7','3','3','3','5','5','6','6','7','7','7','5','5','5','6','6','6','7','7','7','3','3','5','5','5','4','4','7','7','7','5','5','8','8','8','6','6','6','7','7','7','3','3','8','8','8','7','7','7','5','5','8','8','8','7','7','7','3','3','5','5','8','8','8','7','7','7','5','5','8','8','8','7','7','7','5','5'];
        this.reelStrip3 = ['6','6','6','6','0','5','5','5','5','8','8','8','7','7','7','7','8','8','8','3','3','3','7','7','7','7','0','6','6','6','5','5','5','3','3','3','3','5','5','5','0','7','7','7','7','6','6','6','8','8','8','8','7','7','7','3','3','3','3','6','6','6','6','7','7','7','7','6','6','6','3','3','3','8','8','8','8','7','7','7','7','0','8','8','8','8','5','5','5','6','6','6','6','7','7','7','5','5','5','4','4','4','8','8','8','7','7','7','7','6','6','6','6','4','4','4','8','8','8','8','5','5','5','0','4','4','4','4','6','6','6','6','8','8','8','7','7','7','7','8','8','8','8','7','7','7','7','3','3','3','3','5','5','5','5','8','8','8','7','7','7','7','8','8','8','8','0','5','5','5','6','6','6','6','8','8','8','8','4','4','4','4','0','8','8','8','8','0','4','4','4','4','8','8','8'];
        this.reelStrip4 = ['5','5','5','5','4','4','4','8','8','8','5','5','5','3','3','3','3','5','5','5','7','7','7','7','8','8','8','8','0','5','5','5','5','0','7','7','7','7','8','8','8','4','4','4','7','7','7','7','4','4','4','4','7','7','7','7','6','6','6','6','8','8','8','4','4','4','4','6','6','6','7','7','7','7','5','5','5','8','8','8','8','7','7','7','7','5','5','5','8','8','8','0','7','7','7','7','6','6','6','6','5','5','5','5','7','7','7','7','5','5','5','5','7','7','7','8','8','8','8','4','4','4','4','6','6','6','6','3','3','3','3','5','5','5','5','6','6','6','6','7','7','7','8','8','8','8','6','6','6','3','3','3','8','8','8','8','7','7','7','7','4','4','4','6','6','6','6','8','8','8','8','5','5','5','6','6','6','6','7','7','7','5','5','5','5','8','8','8','8','0','7','7','7','4','4','4','4','0','7','7','7','7','0','8','8','8','7','7','7','7','8','8','8','8','7','7','7'];
        this.reelStrip5 = ['3','3','3','3','3','7','7','7','7','7','6','6','6','6','6','0','8','8','8','8','8','7','7','7','7','7','4','4','4','4','4','5','5','5','5','5','7','7','7','7','7','0','6','6','6','6','6','8','8','8','8','8','7','7','7','7','7','0','8','8','8','8','8','6','6','6','6','6','5','5','5','5','5','8','8','8','8','8','4','4','4','4','4','8','8','8','8','8','7','7','7','7','7','8','8','8','8','8','4','4','4','4','4','3','3','3','3','3','0','5','5','5','5','5','0','6','6','6','6','6','3','3','3','3','3','7','7','7','7','7','8','8','8','8','8','5','5','5','5','5','4','4','4','4','4','7','7','7','7','7','8','8','8','8','8','0','5','5','5','5','5','4','4','4','4','4','6','6','6','6','6','5','5','5','5','5','3','3','3','3','3','6','6','6','6','6','3','3','3','3','3','8','8','8','8','8','5','5','5','5','5','7','7','7','7','7','3','3','3','3','3','0','7','7','7','7','7','8','8','8','8','8','6','6','6','6','6','4','4','4','4','4','6','6','6','6','6','7','7','7','7','7','8','8','8','8','8','4','4','4','4','4','6','6','6','6','6','7','7','7','7','7','8','8','8','8','8','0','7','7','7','7','7','8','8','8','8','8','7','7','7','7','7','8','8','8','8','8','6','6','6','6','6','7','7','7','7','7','5','5','5','5','5','7','7','7','7','7','8','8','8','8','8','5','5','5','5','5'];
        this.reelStrip6 = [];

        // Initialize bonus reels (same as base reels if not specified, or empty if DazzleMe doesn't swap reels like this)
        // DazzleMe likely swaps reels for freespin, but the user only provided one set of reels.
        // Assuming base reels are used or specific logic in Server.php handles it (e.g. overlay wilds).
        // For now, populating bonus with same as base to be safe/consistent with base structure.
        this.reelStripBonus1 = [...this.reelStrip1];
        this.reelStripBonus2 = [...this.reelStrip2];
        this.reelStripBonus3 = [...this.reelStrip3];
        this.reelStripBonus4 = [...this.reelStrip4];
        this.reelStripBonus5 = [...this.reelStrip5];
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
            return Math.floor(Math.random() * (rp.length - 4)) + 2;
        }
        return rpResult[0];
    }

    public GetReelStrips(winType: string, slotEvent: string): Record<string, any> {
        // Handle freespin reel swap if needed (using simplified logic based on provided data)
        if (slotEvent === 'freespin') {
             const bonusReels = [
                this.reelStripBonus1, this.reelStripBonus2, this.reelStripBonus3,
                this.reelStripBonus4, this.reelStripBonus5, this.reelStripBonus6
            ];
            
            const targetReels = [
                'reelStrip1', 'reelStrip2', 'reelStrip3', 'reelStrip4', 'reelStrip5', 'reelStrip6'
            ];
            
            targetReels.forEach((key, index) => {
                if (bonusReels[index] && bonusReels[index]!.length > 0) {
                    (this as any)[key] = [...bonusReels[index]!];
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
            
            reel['reel' + index] = [];
            
            // Reel 1, 2: 3 rows
            if (index === 1 || index === 2) {
                reel['reel' + index][0] = key[(value - 1 + cnt) % cnt];
                reel['reel' + index][1] = key[value % cnt];
                reel['reel' + index][2] = key[(value + 1) % cnt];
                reel['reel' + index][3] = '';
                reel['reel' + index][4] = '';
                reel['reel' + index][5] = '';
            }
            // Reel 3, 4: 4 rows
            if (index === 3 || index === 4) {
                reel['reel' + index][0] = key[(value - 1 + cnt) % cnt];
                reel['reel' + index][1] = key[value % cnt];
                reel['reel' + index][2] = key[(value + 1) % cnt];
                reel['reel' + index][3] = key[(value + 2) % cnt];
                reel['reel' + index][4] = '';
                reel['reel' + index][5] = '';
            }
            // Reel 5: 5 rows
            if (index === 5) {
                reel['reel' + index][0] = key[(value - 1 + cnt) % cnt];
                reel['reel' + index][1] = key[value % cnt];
                reel['reel' + index][2] = key[(value + 1) % cnt];
                reel['reel' + index][3] = key[(value + 2) % cnt];
                reel['reel' + index][4] = key[(value + 3) % cnt];
                reel['reel' + index][5] = '';
            }
            
            reel['rp'].push(value);
        });

        return reel;
    }
}
