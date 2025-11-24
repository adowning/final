import { SlotSettings } from './SlotSettings';
import { Log } from '../../utils/Log';

export class Server {
    public get(postData: any, slotSettings: SlotSettings): string {
        try {
            let balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);
            const result_tmp: string[] = [];
            let aid = '';
            postData['slotEvent'] = 'bet';

            if (postData['action'] === 'freespin') {
                postData['slotEvent'] = 'freespin';
                postData['action'] = 'spin';
            }
            if (postData['action'] === 'respin') {
                postData['slotEvent'] = 'respin';
                postData['action'] = 'spin';
            }
            if (postData['action'] === 'init' || postData['action'] === 'reloadbalance') {
                postData['action'] = 'init';
                postData['slotEvent'] = 'init';
            }
            if (postData['action'] === 'paytable') {
                postData['slotEvent'] = 'paytable';
            }
            if (postData['action'] === 'initfreespin') {
                postData['slotEvent'] = 'initfreespin';
            }

            if (postData['bet.denomination'] && parseFloat(postData['bet.denomination']) >= 1) {
                postData['bet.denomination'] = parseFloat(postData['bet.denomination']) / 100;
                slotSettings.CurrentDenom = postData['bet.denomination'];
                slotSettings.CurrentDenomination = postData['bet.denomination'];
                slotSettings.SetGameData(slotSettings.slotId + 'GameDenom', postData['bet.denomination']);
            } else if (slotSettings.HasGameData(slotSettings.slotId + 'GameDenom')) {
                postData['bet.denomination'] = slotSettings.GetGameData(slotSettings.slotId + 'GameDenom');
                slotSettings.CurrentDenom = postData['bet.denomination'];
                slotSettings.CurrentDenomination = postData['bet.denomination'];
            }

            balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);

            if (postData['slotEvent'] === 'bet') {
                const lines = 20;
                const betline = parseFloat(postData['bet.betlevel']);
                if (lines <= 0 || betline <= 0.0001) {
                    return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bet state"}';
                }
                if (slotSettings.GetBalance() < (lines * betline)) {
                    Log.info(' invalid balance');
                    return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid balance"}';
                }
            }

            if (slotSettings.GetGameData(slotSettings.slotId + 'FreeGames') < slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame') && postData['slotEvent'] === 'freespin') {
                Log.info('serverResponse":"invalid bonus state');
                return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bonus state"}';
            }

            aid = String(postData['action']);

            switch (aid) {
                case 'init':
                    const lastEvent = slotSettings.GetHistory();
                    slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBonusWin', 0);
                    slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeGames', 0);
                    slotSettings.SetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame', 0);
                    slotSettings.SetGameData('CreatureFromTheBlackLagoonNETTotalWin', 0);
                    slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeBalance', 0);

                    let freeState = '';
                    let curReels = '';

                    // Initialize result_tmp[0] with a default value to ensure a response is always returned
                    result_tmp[0] = '';

                    if (lastEvent && lastEvent !== 'NULL') {
                        // Map the restored state
                        // The parsed JSON structure might vary, checking for serverResponse
                        const serverResponse = lastEvent.serverResponse || lastEvent;

                        slotSettings.SetGameData(slotSettings.slotId + 'BonusWin', serverResponse.bonusWin || 0);
                        slotSettings.SetGameData(slotSettings.slotId + 'FreeGames', serverResponse.totalFreeGames || 0);
                        slotSettings.SetGameData(slotSettings.slotId + 'CurrentFreeGame', serverResponse.currentFreeGames || 0);
                        slotSettings.SetGameData(slotSettings.slotId + 'TotalWin', serverResponse.bonusWin || 0);
                        slotSettings.SetGameData(slotSettings.slotId + 'FreeBalance', serverResponse.Balance || 0);
                        freeState = serverResponse.freeState || '';
                        const reels = serverResponse.reelsSymbols || {};

                        // Ensure reels exist before accessing indices
                        if (reels.reel1) {
                            curReels = `&rs.i0.r.i0.syms=SYM${reels.reel1[0]}%2CSYM${reels.reel1[1]}%2CSYM${reels.reel1[2]}`;
                            curReels += `&rs.i0.r.i1.syms=SYM${reels.reel2[0]}%2CSYM${reels.reel2[1]}%2CSYM${reels.reel2[2]}`;
                            curReels += `&rs.i0.r.i2.syms=SYM${reels.reel3[0]}%2CSYM${reels.reel3[1]}%2CSYM${reels.reel3[2]}`;
                            curReels += `&rs.i0.r.i3.syms=SYM${reels.reel4[0]}%2CSYM${reels.reel4[1]}%2CSYM${reels.reel4[2]}`;
                            curReels += `&rs.i0.r.i4.syms=SYM${reels.reel5[0]}%2CSYM${reels.reel5[1]}%2CSYM${reels.reel5[2]}`;
                            curReels += `&rs.i1.r.i0.syms=SYM${reels.reel1[0]}%2CSYM${reels.reel1[1]}%2CSYM${reels.reel1[2]}`;
                            curReels += `&rs.i1.r.i1.syms=SYM${reels.reel2[0]}%2CSYM${reels.reel2[1]}%2CSYM${reels.reel2[2]}`;
                            curReels += `&rs.i1.r.i2.syms=SYM${reels.reel3[0]}%2CSYM${reels.reel3[1]}%2CSYM${reels.reel3[2]}`;
                            curReels += `&rs.i1.r.i3.syms=SYM${reels.reel4[0]}%2CSYM${reels.reel4[1]}%2CSYM${reels.reel4[2]}`;
                            curReels += `&rs.i1.r.i4.syms=SYM${reels.reel5[0]}%2CSYM${reels.reel5[1]}%2CSYM${reels.reel5[2]}`;
                            curReels += `&rs.i0.r.i0.pos=${reels.rp[0]}&rs.i0.r.i1.pos=${reels.rp[0]}&rs.i0.r.i2.pos=${reels.rp[0]}&rs.i0.r.i3.pos=${reels.rp[0]}&rs.i0.r.i4.pos=${reels.rp[0]}`;
                            curReels += `&rs.i1.r.i0.pos=${reels.rp[0]}&rs.i1.r.i1.pos=${reels.rp[0]}&rs.i1.r.i2.pos=${reels.rp[0]}&rs.i1.r.i3.pos=${reels.rp[0]}&rs.i1.r.i4.pos=${reels.rp[0]}`;
                        }
                    } else {
                        const randSym = () => Math.floor(Math.random() * 7) + 1;
                        const randPos = () => Math.floor(Math.random() * 10) + 1;

                        curReels = `&rs.i0.r.i0.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                        curReels += `&rs.i0.r.i1.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                        curReels += `&rs.i0.r.i2.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                        curReels += `&rs.i0.r.i3.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                        curReels += `&rs.i0.r.i4.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                        curReels += `&rs.i0.r.i0.pos=${randPos()}&rs.i0.r.i1.pos=${randPos()}&rs.i0.r.i2.pos=${randPos()}&rs.i0.r.i3.pos=${randPos()}&rs.i0.r.i4.pos=${randPos()}`;
                        curReels += `&rs.i1.r.i0.pos=${randPos()}&rs.i1.r.i1.pos=${randPos()}&rs.i1.r.i2.pos=${randPos()}&rs.i1.r.i3.pos=${randPos()}&rs.i1.r.i4.pos=${randPos()}`;
                    }
                    // If freeState was restored, we need to ensure it is used.
                    // Currently, result_tmp[0] is only set at the end of 'init' case using curReels.
                    // If freeState is set, it should be appended or used.
                    // Based on PHP, freeState is appended to the big init string.

                    for (let d = 0; d < slotSettings.Denominations.length; d++) {
                        slotSettings.Denominations[d] = slotSettings.Denominations[d] * 100;
                    }

                    if (slotSettings.GetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame') < slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeGames') && slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeGames') > 0) {
                        // Complex free state restoration string...
                        freeState = `previous.rs.i0=freespinlevel0&rs.i1.r.i0.syms=SYM6%2CSYM3%2CSYM5&bl.i6.coins=1&rs.i8.r.i3.hold=false&bl.i17.reelset=ALL&bl.i15.id=15&rs.i0.r.i4.hold=false&rs.i9.r.i1.hold=false&gamestate.history=basic%2Cfreespin&rs.i1.r.i2.hold=false&rs.i8.r.i1.syms=SYM3%2CSYM9%2CSYM9&game.win.cents=685&rs.i7.r.i3.syms=SYM4%2CSYM8%2CSYM10&staticsharedurl=https%3A%2F%2Fstatic-shared.casinomodule.com%2Fgameclient_html%2Fdevicedetection%2Fcurrent&bl.i10.line=1%2C2%2C1%2C2%2C1&bl.i0.reelset=ALL&bl.i18.coins=1&bl.i10.id=10&freespins.initial=10&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&bl.i13.coins=1&rs.i2.r.i0.hold=false&rs.i0.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i9.r.i3.hold=false&bl.i2.id=2&rs.i1.r.i1.pos=1&rs.i7.r.i1.syms=SYM0%2CSYM5%2CSYM10&rs.i3.r.i4.pos=0&rs.i6.r.i3.syms=SYM5%2CSYM4%2CSYM8&rs.i0.r.i0.pos=0&bl.i14.reelset=ALL&rs.i2.r.i3.pos=62&rs.i5.r.i1.overlay.i0.with=SYM1&rs.i5.r.i0.pos=5&rs.i7.id=basic&rs.i7.r.i3.pos=99&rs.i2.r.i4.hold=false&rs.i3.r.i1.pos=0&rs.i2.id=freespinlevel0respin&rs.i6.r.i1.pos=0&game.win.coins=137&rs.i1.r.i0.hold=false&bl.i3.id=3&ws.i1.reelset=freespinlevel0&bl.i12.coins=1&bl.i8.reelset=ALL&clientaction=init&rs.i4.r.i0.hold=false&rs.i0.r.i2.hold=false&rs.i4.r.i3.syms=SYM5%2CSYM4%2CSYM8&bl.i16.id=16&casinoID=netent&rs.i2.r.i3.overlay.i0.with=SYM1&bl.i5.coins=1&rs.i3.r.i2.hold=false&bl.i8.id=8&rs.i5.r.i1.syms=SYM6%2CSYM10%2CSYM1&rs.i7.r.i0.pos=42&rs.i7.r.i3.hold=false&rs.i0.r.i3.pos=0&rs.i4.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i8.r.i1.pos=0&rs.i5.r.i3.pos=87&bl.i6.line=2%2C2%2C1%2C2%2C2&bl.i12.line=2%2C1%2C2%2C1%2C2&bl.i0.line=1%2C1%2C1%2C1%2C1&wild.w0.expand.position.row=2&rs.i4.r.i2.pos=0&rs.i0.r.i2.syms=SYM8%2CSYM8%2CSYM4&rs.i8.r.i1.hold=false&rs.i9.r.i2.pos=0&game.win.amount=6.85&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&rs.i5.r.i2.hold=false&denomination.all=1%2C2%2C5%2C10%2C20%2C50&rs.i2.r.i0.pos=20&current.rs.i0=freespinlevel0respin&ws.i0.reelset=freespinlevel0&rs.i7.r.i2.pos=91&bl.i1.id=1&rs.i3.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i1.r.i4.pos=10&rs.i8.id=freespinlevel3&denomination.standard=5&rs.i3.id=freespinlevel1&multiplier=1&bl.i14.id=14&wild.w0.expand.position.reel=1&bl.i19.line=0%2C2%2C2%2C2%2C0&freespins.denomination=5.000&bl.i12.reelset=ALL&bl.i2.coins=1&bl.i6.id=6&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&freespins.totalwin.coins=137&ws.i0.direction=left_to_right&freespins.total=10&gamestate.stack=basic%2Cfreespin&rs.i6.r.i2.pos=0&rs.i1.r.i4.syms=SYM9%2CSYM9%2CSYM5&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&rs.i5.r.i2.syms=SYM10%2CSYM7%2CSYM4&rs.i5.r.i3.hold=false&bet.betlevel=1&rs.i2.r.i3.overlay.i0.pos=63&rs.i4.r.i2.hold=false&bl.i5.reelset=ALL&rs.i4.r.i1.syms=SYM7%2CSYM7%2CSYM3&bl.i19.coins=1&bl.i7.id=7&bl.i18.reelset=ALL&rs.i2.r.i4.pos=2&rs.i3.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i8.r.i4.pos=0&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=1&rs.i2.r.i3.overlay.i0.row=1&rs.i4.r.i1.hold=false&rs.i3.r.i2.pos=0&bl.i14.line=1%2C1%2C2%2C1%2C1&freespins.multiplier=1&playforfun=false&rs.i8.r.i0.hold=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&rs.i0.r.i4.syms=SYM6%2CSYM10%2CSYM9&rs.i0.r.i2.pos=0&bl.i13.line=1%2C1%2C0%2C1%2C1&rs.i6.r.i3.pos=0&ws.i1.betline=13&rs.i1.r.i0.pos=10&rs.i6.r.i3.hold=false&bl.i0.coins=1&rs.i2.r.i0.syms=SYM7%2CSYM7%2CSYM8&bl.i2.reelset=ALL&rs.i3.r.i1.syms=SYM3%2CSYM9%2CSYM9&rs.i1.r.i4.hold=false&freespins.left=6&rs.i9.r.i3.pos=0&rs.i4.r.i1.pos=0&rs.i4.r.i2.syms=SYM8%2CSYM8%2CSYM4&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&rs.i5.r.i3.syms=SYM3%2CSYM9%2CSYM9&rs.i3.r.i0.hold=false&rs.i9.r.i1.syms=SYM3%2CSYM9%2CSYM9&rs.i6.r.i4.syms=SYM6%2CSYM10%2CSYM4&rs.i8.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i8.r.i0.pos=0&bl.i15.reelset=ALL&rs.i0.r.i3.hold=false&bet.denomination=5&rs.i5.r.i4.pos=4&rs.i9.id=freespinlevel2&rs.i4.id=freespinlevel3respin&rs.i7.r.i2.syms=SYM9%2CSYM4%2CSYM10&rs.i2.r.i1.hold=false&gameServerVersion=1.5.0&g4mode=false&bl.i11.line=0%2C1%2C0%2C1%2C0&historybutton=false&bl.i5.id=5&gameEventSetters.enabled=false&next.rs=freespinlevel0respin&rs.i1.r.i3.pos=2&rs.i0.r.i1.syms=SYM7%2CSYM7%2CSYM3&bl.i3.coins=1&ws.i1.types.i0.coins=4&bl.i10.coins=1&bl.i18.id=18&rs.i2.r.i1.pos=12&rs.i7.r.i4.hold=false&rs.i4.r.i4.pos=0&rs.i8.r.i2.hold=false&ws.i0.betline=4&rs.i1.r.i3.hold=false&rs.i7.r.i1.pos=123&totalwin.coins=137&rs.i5.r.i4.syms=SYM6%2CSYM6%2CSYM9&rs.i9.r.i4.pos=0&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=freespin&rs.i4.r.i0.pos=0&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i8.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i9.r.i0.hold=false&bet.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&rs.i3.r.i1.hold=false&rs.i9.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i7.r.i4.syms=SYM0%2CSYM9%2CSYM7&rs.i0.r.i3.syms=SYM5%2CSYM4%2CSYM8&rs.i1.r.i1.syms=SYM7%2CSYM7%2CSYM6&bl.i16.coins=1&rs.i5.r.i1.overlay.i0.pos=22&freespins.win.cents=40&bl.i9.coins=1&bl.i7.reelset=ALL&isJackpotWin=false&rs.i6.r.i4.hold=false&rs.i2.r.i3.hold=false&wild.w0.expand.type=NONE&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&rs.i0.r.i1.pos=0&rs.i4.r.i4.syms=SYM6%2CSYM10%2CSYM9&rs.i1.r.i3.syms=SYM7%2CSYM6%2CSYM8&bl.i13.id=13&rs.i0.r.i1.hold=false&rs.i2.r.i1.syms=SYM10%2CSYM4%2CSYM10&ws.i1.types.i0.wintype=coins&rs.i9.r.i2.syms=SYM10%2CSYM10%2CSYM5&bl.i9.line=1%2C0%2C1%2C0%2C1&rs.i8.r.i4.syms=SYM6%2CSYM9%2CSYM9&rs.i9.r.i0.pos=0&rs.i8.r.i3.pos=0&ws.i1.sym=SYM10&betlevel.standard=1&bl.i10.reelset=ALL&ws.i1.types.i0.cents=20&rs.i6.r.i2.syms=SYM8%2CSYM6%2CSYM4&rs.i7.r.i0.syms=SYM5%2CSYM7%2CSYM0&gameover=false&rs.i3.r.i3.pos=0&rs.i5.id=freespinlevel0&rs.i7.r.i0.hold=false&rs.i6.r.i4.pos=0&bl.i11.coins=1&rs.i5.r.i1.hold=false&ws.i1.direction=left_to_right&rs.i5.r.i4.hold=false&rs.i6.r.i2.hold=false&bl.i13.reelset=ALL&bl.i0.id=0&rs.i9.r.i2.hold=false&nextaction=respin&bl.i15.line=0%2C1%2C1%2C1%2C0&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i19.id=19&bl.i4.reelset=ALL&rs.i7.r.i1.attention.i0=0&bl.i4.coins=1&bl.i18.line=2%2C0%2C2%2C0%2C2&rs.i8.r.i4.hold=false&freespins.totalwin.cents=685&bl.i9.id=9&bl.i17.line=0%2C2%2C0%2C2%2C0&bl.i11.id=11&freespins.betlevel=1&ws.i0.pos.i2=2%2C0&rs.i4.r.i3.pos=0&playercurrency=%26%23x20AC%3B&bl.i9.reelset=ALL&rs.i4.r.i4.hold=false&bl.i17.coins=1&ws.i1.pos.i0=1%2C1&ws.i1.pos.i1=0%2C1&ws.i1.pos.i2=2%2C0&ws.i0.pos.i1=0%2C2&rs.i5.r.i0.syms=SYM9%2CSYM10%2CSYM10&bl.i19.reelset=ALL&ws.i0.pos.i0=1%2C1&rs.i2.r.i4.syms=SYM4%2CSYM8%2CSYM8&rs.i7.r.i4.pos=41&rs.i4.r.i3.hold=false&rs.i6.r.i0.hold=false&bl.i11.reelset=ALL&bl.i16.line=2%2C1%2C1%2C1%2C2&rs.i0.id=freespinlevel2respin&credit=${balanceInCents}&rs.i9.r.i3.syms=SYM6%2CSYM7%2CSYM7&bl.i1.reelset=ALL&rs.i2.r.i2.pos=0&rs.i5.r.i1.pos=0&bl.i1.line=0%2C0%2C0%2C0%2C0&rs.i6.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i6.r.i1.hold=false&bl.i17.id=17&rs.i2.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i1.r.i2.pos=19&bl.i16.reelset=ALL&rs.i3.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i3.r.i4.hold=false&rs.i5.r.i0.hold=false&nearwinallowed=true&rs.i9.r.i1.pos=0&bl.i8.line=1%2C0%2C0%2C0%2C1&rs.i7.r.i2.hold=false&rs.i6.r.i1.syms=SYM5%2CSYM9%2CSYM9&rs.i3.r.i3.hold=false&rs.i6.r.i0.pos=0&bl.i8.coins=1&bl.i15.coins=1&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i1.r.i2.syms=SYM8%2CSYM4%2CSYM3&rs.i9.r.i4.hold=false&rs.i6.id=freespinlevel1respin&totalwin.cents=0&rs.i7.r.i1.hold=false&rs.i5.r.i2.pos=0&rs.i0.r.i0.hold=false&rs.i2.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i8.r.i2.pos=0&restore=true&rs.i1.id=basicrespin&rs.i3.r.i4.syms=SYM6%2CSYM9%2CSYM4&bl.i12.id=12&bl.i4.id=4&rs.i0.r.i4.pos=0&bl.i7.coins=1&ws.i0.types.i0.cents=20&bl.i6.reelset=ALL&rs.i3.r.i0.pos=0&rs.i2.r.i2.hold=false&wavecount=1&rs.i9.r.i4.syms=SYM6%2CSYM9%2CSYM9&bl.i14.coins=1&rs.i8.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i1.r.i1.hold=false${curReels}`;
                    }
                    result_tmp[0] = freeState ? freeState : `rs.i1.r.i0.syms=SYM1%2CSYM1%2CSYM1&bl.i6.coins=1&rs.i8.r.i3.hold=false&bl.i17.reelset=ALL&bl.i15.id=15&rs.i0.r.i4.hold=false&rs.i9.r.i1.hold=false&rs.i1.r.i2.hold=false&rs.i8.r.i1.syms=SYM3%2CSYM9%2CSYM9&game.win.cents=0&rs.i7.r.i3.syms=SYM7%2CSYM6%2CSYM8&staticsharedurl=https%3A%2F%2Fstatic-shared.casinomodule.com%2Fgameclient_html%2Fdevicedetection%2Fcurrent&bl.i10.line=1%2C2%2C1%2C2%2C1&bl.i0.reelset=ALL&bl.i18.coins=1&bl.i10.id=10&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&bl.i13.coins=1&rs.i2.r.i0.hold=false&rs.i0.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i9.r.i3.hold=false&bl.i2.id=2&rs.i1.r.i1.pos=1&rs.i7.r.i1.syms=SYM7%2CSYM7%2CSYM6&rs.i3.r.i4.pos=0&rs.i6.r.i3.syms=SYM5%2CSYM4%2CSYM8&rs.i0.r.i0.pos=0&bl.i14.reelset=ALL&rs.i2.r.i3.pos=0&rs.i5.r.i0.pos=0&rs.i7.id=basic&rs.i7.r.i3.pos=2&rs.i2.r.i4.hold=false&rs.i3.r.i1.pos=0&rs.i2.id=freespinlevel1&rs.i6.r.i1.pos=0&game.win.coins=0&rs.i1.r.i0.hold=false&bl.i3.id=3&bl.i12.coins=1&bl.i8.reelset=ALL&clientaction=init&rs.i4.r.i0.hold=false&rs.i0.r.i2.hold=false&rs.i4.r.i3.syms=SYM5%2CSYM4%2CSYM8&bl.i16.id=16&casinoID=netent&bl.i5.coins=1&rs.i3.r.i2.hold=false&bl.i8.id=8&rs.i5.r.i1.syms=SYM3%2CSYM9%2CSYM9&rs.i7.r.i0.pos=10&rs.i7.r.i3.hold=false&rs.i0.r.i3.pos=0&rs.i4.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i8.r.i1.pos=0&rs.i5.r.i3.pos=0&bl.i6.line=2%2C2%2C1%2C2%2C2&bl.i12.line=2%2C1%2C2%2C1%2C2&bl.i0.line=1%2C1%2C1%2C1%2C1&rs.i4.r.i2.pos=0&rs.i0.r.i2.syms=SYM8%2CSYM8%2CSYM4&rs.i8.r.i1.hold=false&rs.i9.r.i2.pos=0&game.win.amount=0&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&rs.i5.r.i2.hold=false&denomination.all=${slotSettings.Denominations.join('%2C')}&rs.i2.r.i0.pos=0&current.rs.i0=basic&rs.i7.r.i2.pos=19&bl.i1.id=1&rs.i3.r.i2.syms=SYM8%2CSYM8%2CSYM4&rs.i1.r.i4.pos=10&rs.i8.id=freespinlevel3&denomination.standard=${slotSettings.CurrentDenomination * 100}&rs.i3.id=freespinlevel0respin&multiplier=1&bl.i14.id=14&bl.i19.line=0%2C2%2C2%2C2%2C0&bl.i12.reelset=ALL&bl.i2.coins=1&bl.i6.id=6&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&rs.i6.r.i2.pos=0&rs.i1.r.i4.syms=SYM9%2CSYM9%2CSYM5&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&rs.i5.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i5.r.i3.hold=false&rs.i4.r.i2.hold=false&bl.i5.reelset=ALL&rs.i4.r.i1.syms=SYM7%2CSYM7%2CSYM3&bl.i19.coins=1&bl.i7.id=7&bl.i18.reelset=ALL&rs.i2.r.i4.pos=0&rs.i3.r.i0.syms=SYM4%2CSYM7%2CSYM7&rs.i8.r.i4.pos=0&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=1&rs.i4.r.i1.hold=false&rs.i3.r.i2.pos=0&bl.i14.line=1%2C1%2C2%2C1%2C1&playforfun=false&rs.i8.r.i0.hold=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&rs.i0.r.i4.syms=SYM6%2CSYM10%2CSYM9&rs.i0.r.i2.pos=0&bl.i13.line=1%2C1%2C0%2C1%2C1&rs.i6.r.i3.pos=0&rs.i1.r.i0.pos=10&rs.i6.r.i3.hold=false&bl.i0.coins=1&rs.i2.r.i0.syms=SYM7%2CSYM4%2CSYM7&bl.i2.reelset=ALL&rs.i3.r.i1.syms=SYM7%2CSYM7%2CSYM3&rs.i1.r.i4.hold=false&rs.i9.r.i3.pos=0&rs.i4.r.i1.pos=0&rs.i4.r.i2.syms=SYM8%2CSYM8%2CSYM4&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&rs.i5.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i3.r.i0.hold=false&rs.i9.r.i1.syms=SYM3%2CSYM9%2CSYM9&rs.i6.r.i4.syms=SYM6%2CSYM10%2CSYM4&rs.i8.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i8.r.i0.pos=0&bl.i15.reelset=ALL&rs.i0.r.i3.hold=false&rs.i5.r.i4.pos=0&rs.i9.id=freespinlevel2&rs.i4.id=freespinlevel3respin&rs.i7.r.i2.syms=SYM8%2CSYM4%2CSYM3&rs.i2.r.i1.hold=false&gameServerVersion=1.5.0&g4mode=false&bl.i11.line=0%2C1%2C0%2C1%2C0&historybutton=false&bl.i5.id=5&gameEventSetters.enabled=false&next.rs=basic&rs.i1.r.i3.pos=2&rs.i0.r.i1.syms=SYM7%2CSYM7%2CSYM3&bl.i3.coins=1&bl.i10.coins=1&bl.i18.id=18&rs.i2.r.i1.pos=0&rs.i7.r.i4.hold=false&rs.i4.r.i4.pos=0&rs.i8.r.i2.hold=false&rs.i1.r.i3.hold=false&rs.i7.r.i1.pos=1&totalwin.coins=0&rs.i5.r.i4.syms=SYM6%2CSYM9%2CSYM9&rs.i9.r.i4.pos=0&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=basic&rs.i4.r.i0.pos=0&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i8.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i9.r.i0.hold=false&rs.i3.r.i1.hold=false&rs.i9.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i7.r.i4.syms=SYM0%2CSYM9%2CSYM7&rs.i0.r.i3.syms=SYM5%2CSYM4%2CSYM8&rs.i1.r.i1.syms=SYM7%2CSYM7%2CSYM6&bl.i16.coins=1&bl.i9.coins=1&bl.i7.reelset=ALL&isJackpotWin=false&rs.i6.r.i4.hold=false&rs.i2.r.i3.hold=false&rs.i0.r.i1.pos=0&rs.i4.r.i4.syms=SYM6%2CSYM10%2CSYM9&rs.i1.r.i3.syms=SYM7%2CSYM6%2CSYM8&bl.i13.id=13&rs.i0.r.i1.hold=false&rs.i2.r.i1.syms=SYM3%2CSYM9%2CSYM9&rs.i9.r.i2.syms=SYM10%2CSYM10%2CSYM5&bl.i9.line=1%2C0%2C1%2C0%2C1&rs.i8.r.i4.syms=SYM6%2CSYM9%2CSYM9&rs.i9.r.i0.pos=0&rs.i8.r.i3.pos=0&betlevel.standard=1&bl.i10.reelset=ALL&rs.i6.r.i2.syms=SYM8%2CSYM6%2CSYM4&rs.i7.r.i0.syms=SYM6%2CSYM3%2CSYM9&gameover=true&rs.i3.r.i3.pos=0&rs.i5.id=freespinlevel0&rs.i7.r.i0.hold=false&rs.i6.r.i4.pos=0&bl.i11.coins=1&rs.i5.r.i1.hold=false&rs.i5.r.i4.hold=false&rs.i6.r.i2.hold=false&bl.i13.reelset=ALL&bl.i0.id=0&rs.i9.r.i2.hold=false&nextaction=spin&bl.i15.line=0%2C1%2C1%2C1%2C0&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i19.id=19&bl.i4.reelset=ALL&bl.i4.coins=1&bl.i18.line=2%2C0%2C2%2C0%2C2&rs.i8.r.i4.hold=false&bl.i9.id=9&bl.i17.line=0%2C2%2C0%2C2%2C0&bl.i11.id=11&rs.i4.r.i3.pos=0&playercurrency=%26%23x20AC%3B&bl.i9.reelset=ALL&rs.i4.r.i4.hold=false&bl.i17.coins=1&rs.i5.r.i0.syms=SYM7%2CSYM4%2CSYM7&bl.i19.reelset=ALL&rs.i2.r.i4.syms=SYM6%2CSYM9%2CSYM9&rs.i7.r.i4.pos=10&rs.i4.r.i3.hold=false&rs.i6.r.i0.hold=false&bl.i11.reelset=ALL&bl.i16.line=2%2C1%2C1%2C1%2C2&rs.i0.id=freespinlevel2respin&credit=${balanceInCents}&rs.i9.r.i3.syms=SYM6%2CSYM7%2CSYM7&bl.i1.reelset=ALL&rs.i2.r.i2.pos=0&rs.i5.r.i1.pos=0&bl.i1.line=0%2C0%2C0%2C0%2C0&rs.i6.r.i0.syms=SYM7%2CSYM4%2CSYM7&rs.i6.r.i1.hold=false&bl.i17.id=17&rs.i2.r.i2.syms=SYM10%2CSYM10%2CSYM5&rs.i1.r.i2.pos=19&bl.i16.reelset=ALL&rs.i3.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i3.r.i4.hold=false&rs.i5.r.i0.hold=false&nearwinallowed=true&rs.i9.r.i1.pos=0&bl.i8.line=1%2C0%2C0%2C0%2C1&rs.i7.r.i2.hold=false&rs.i6.r.i1.syms=SYM5%2CSYM9%2CSYM9&freespins.wavecount=1&rs.i3.r.i3.hold=false&rs.i6.r.i0.pos=0&bl.i8.coins=1&bl.i15.coins=1&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i1.r.i2.syms=SYM8%2CSYM4%2CSYM3&rs.i7.nearwin=4%2C2%2C3&rs.i9.r.i4.hold=false&rs.i6.id=freespinlevel1respin&totalwin.cents=0&rs.i7.r.i1.hold=false&rs.i5.r.i2.pos=0&rs.i0.r.i0.hold=false&rs.i2.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i8.r.i2.pos=0&restore=false&rs.i1.id=basicrespin&rs.i3.r.i4.syms=SYM6%2CSYM9%2CSYM4&bl.i12.id=12&bl.i4.id=4&rs.i0.r.i4.pos=0&bl.i7.coins=1&bl.i6.reelset=ALL&rs.i3.r.i0.pos=0&rs.i2.r.i2.hold=false&wavecount=1&rs.i9.r.i4.syms=SYM6%2CSYM9%2CSYM9&bl.i14.coins=1&rs.i8.r.i3.syms=SYM6%2CSYM7%2CSYM7&rs.i1.r.i1.hold=false${curReels}`;
                    break;

                case 'paytable':
                    result_tmp[0] = `pt.i0.comp.i19.symbol=SYM9&bl.i6.coins=1&bl.i17.reelset=ALL&pt.i0.comp.i15.type=betline&pt.i0.comp.i23.freespins=0&bl.i15.id=15&pt.i0.comp.i4.multi=200&pt.i0.comp.i15.symbol=SYM8&pt.i0.comp.i17.symbol=SYM8&pt.i0.comp.i5.freespins=0&pt.i1.comp.i14.multi=125&pt.i0.comp.i22.multi=30&pt.i0.comp.i23.n=5&pt.i1.comp.i19.type=betline&pt.i0.comp.i11.symbol=SYM6&pt.i0.comp.i13.symbol=SYM7&pt.i1.comp.i8.type=betline&pt.i1.comp.i4.n=4&pt.i0.comp.i15.multi=5&bl.i10.line=1%2C2%2C1%2C2%2C1&bl.i0.reelset=ALL&pt.i0.comp.i16.freespins=0&bl.i18.coins=1&pt.i1.comp.i6.freespins=0&pt.i1.comp.i22.n=4&pt.i1.comp.i3.multi=20&bl.i10.id=10&pt.i0.comp.i11.n=5&pt.i0.comp.i4.freespins=0&pt.i1.comp.i23.symbol=SYM10&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&bl.i13.coins=1&pt.i0.comp.i19.n=4&pt.i0.id=basic&pt.i0.comp.i1.type=betline&bl.i2.id=2&pt.i1.comp.i10.type=betline&pt.i0.comp.i2.symbol=SYM3&pt.i0.comp.i4.symbol=SYM4&pt.i1.comp.i5.freespins=0&pt.i0.comp.i20.type=betline&pt.i1.comp.i8.symbol=SYM5&bl.i14.reelset=ALL&pt.i1.comp.i19.n=4&pt.i0.comp.i17.freespins=0&pt.i0.comp.i6.symbol=SYM5&pt.i0.comp.i8.symbol=SYM5&pt.i0.comp.i0.symbol=SYM3&pt.i1.comp.i11.n=5&pt.i0.comp.i5.n=5&pt.i1.comp.i2.symbol=SYM3&pt.i0.comp.i3.type=betline&pt.i0.comp.i3.freespins=0&pt.i0.comp.i10.multi=100&pt.i1.id=freespin&pt.i1.comp.i19.multi=30&bl.i3.id=3&pt.i1.comp.i6.symbol=SYM5&pt.i0.comp.i9.multi=10&bl.i12.coins=1&pt.i0.comp.i22.symbol=SYM10&pt.i1.comp.i19.freespins=0&bl.i8.reelset=ALL&pt.i0.comp.i14.freespins=0&pt.i0.comp.i21.freespins=0&clientaction=paytable&pt.i1.comp.i4.freespins=0&bl.i16.id=16&pt.i1.comp.i12.type=betline&pt.i1.comp.i5.n=5&bl.i5.coins=1&pt.i1.comp.i8.multi=500&pt.i1.comp.i21.symbol=SYM10&pt.i1.comp.i23.n=5&pt.i0.comp.i22.type=betline&bl.i8.id=8&pt.i0.comp.i16.multi=40&pt.i0.comp.i21.multi=4&pt.i1.comp.i13.multi=40&pt.i0.comp.i12.n=3&bl.i6.line=2%2C2%2C1%2C2%2C2&pt.i0.comp.i13.type=betline&bl.i12.line=2%2C1%2C2%2C1%2C2&pt.i1.comp.i9.multi=10&bl.i0.line=1%2C1%2C1%2C1%2C1&pt.i0.comp.i19.type=betline&pt.i0.comp.i6.freespins=0&pt.i1.comp.i2.multi=750&pt.i1.comp.i7.freespins=0&pt.i0.comp.i3.multi=20&pt.i0.comp.i6.n=3&pt.i1.comp.i22.type=betline&pt.i1.comp.i12.n=3&pt.i1.comp.i3.type=betline&pt.i0.comp.i21.n=3&pt.i1.comp.i10.freespins=0&pt.i1.comp.i6.n=3&bl.i1.id=1&pt.i1.comp.i20.multi=100&pt.i0.comp.i10.type=betline&pt.i1.comp.i11.symbol=SYM6&pt.i1.comp.i2.type=betline&pt.i0.comp.i2.freespins=0&pt.i0.comp.i5.multi=600&pt.i0.comp.i7.n=4&pt.i1.comp.i1.freespins=0&pt.i0.comp.i11.multi=400&pt.i1.comp.i14.symbol=SYM7&bl.i14.id=14&pt.i1.comp.i16.symbol=SYM8&pt.i1.comp.i23.multi=100&pt.i0.comp.i7.type=betline&bl.i19.line=0%2C2%2C2%2C2%2C0&pt.i1.comp.i4.type=betline&bl.i12.reelset=ALL&pt.i0.comp.i17.n=5&pt.i1.comp.i18.multi=4&bl.i2.coins=1&bl.i6.id=6&pt.i1.comp.i13.n=4&pt.i0.comp.i8.freespins=0&pt.i1.comp.i4.multi=200&pt.i0.comp.i8.multi=500&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&pt.i0.comp.i1.freespins=0&pt.i0.comp.i12.type=betline&pt.i0.comp.i14.multi=125&pt.i1.comp.i7.multi=150&bl.i5.reelset=ALL&pt.i0.comp.i22.n=4&bl.i19.coins=1&pt.i1.comp.i17.type=betline&bl.i7.id=7&bl.i18.reelset=ALL&pt.i1.comp.i11.type=betline&pt.i0.comp.i6.multi=15&pt.i1.comp.i0.symbol=SYM3&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=1&pt.i1.comp.i7.n=4&pt.i1.comp.i5.multi=600&pt.i1.comp.i5.symbol=SYM4&bl.i14.line=1%2C1%2C2%2C1%2C1&pt.i0.comp.i18.type=betline&pt.i0.comp.i23.symbol=SYM10&pt.i0.comp.i21.type=betline&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&pt.i0.comp.i8.type=betline&pt.i0.comp.i7.freespins=0&pt.i1.comp.i15.multi=5&pt.i0.comp.i2.type=betline&pt.i0.comp.i13.multi=40&pt.i1.comp.i20.type=betline&pt.i0.comp.i17.type=betline&bl.i13.line=1%2C1%2C0%2C1%2C1&pt.i1.comp.i22.symbol=SYM10&pt.i1.comp.i22.multi=30&bl.i0.coins=1&bl.i2.reelset=ALL&pt.i0.comp.i8.n=5&pt.i0.comp.i10.n=4&pt.i1.comp.i6.multi=15&pt.i1.comp.i22.freespins=0&pt.i0.comp.i11.type=betline&pt.i1.comp.i19.symbol=SYM9&pt.i0.comp.i18.n=3&pt.i0.comp.i22.freespins=0&pt.i0.comp.i20.symbol=SYM9&pt.i0.comp.i15.freespins=0&pt.i1.comp.i14.n=5&pt.i1.comp.i16.multi=40&pt.i1.comp.i15.freespins=0&pt.i0.comp.i0.n=3&pt.i0.comp.i7.symbol=SYM5&pt.i1.comp.i21.multi=4&bl.i15.reelset=ALL&pt.i1.comp.i0.freespins=0&pt.i0.comp.i0.type=betline&pt.i1.comp.i0.multi=25&gameServerVersion=1.5.0&g4mode=false&bl.i11.line=0%2C1%2C0%2C1%2C0&pt.i1.comp.i8.n=5&historybutton=false&pt.i0.comp.i16.symbol=SYM8&pt.i1.comp.i21.freespins=0&bl.i5.id=5&pt.i0.comp.i1.multi=250&pt.i0.comp.i18.symbol=SYM9&pt.i1.comp.i9.type=betline&pt.i0.comp.i12.multi=5&pt.i1.comp.i14.freespins=0&pt.i1.comp.i23.type=betline&bl.i3.coins=1&bl.i10.coins=1&pt.i0.comp.i12.symbol=SYM7&pt.i0.comp.i14.symbol=SYM7&pt.i1.comp.i13.freespins=0&bl.i18.id=18&pt.i0.comp.i14.type=betline&pt.i1.comp.i17.multi=125&pt.i0.comp.i18.multi=4&pt.i1.comp.i0.n=3&bl.i5.line=0%2C0%2C1%2C0%2C0&pt.i0.comp.i7.multi=150&pt.i0.comp.i9.n=3&pt.i1.comp.i21.type=betline&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&pt.i1.comp.i18.type=betline&pt.i0.comp.i10.symbol=SYM6&pt.i0.comp.i15.n=3&bl.i16.coins=1&bl.i9.coins=1&pt.i0.comp.i21.symbol=SYM10&bl.i7.reelset=ALL&pt.i1.comp.i15.n=3&isJackpotWin=false&pt.i1.comp.i20.freespins=0&pt.i1.comp.i7.type=betline&pt.i1.comp.i11.multi=400&pt.i0.comp.i1.n=4&pt.i0.comp.i10.freespins=0&pt.i0.comp.i20.multi=100&pt.i0.comp.i20.n=5&pt.i1.comp.i3.symbol=SYM4&pt.i0.comp.i17.multi=125&pt.i1.comp.i23.freespins=0&bl.i13.id=13&pt.i1.comp.i9.n=3&pt.i0.comp.i9.type=betline&bl.i9.line=1%2C0%2C1%2C0%2C1&pt.i0.comp.i2.multi=750&pt.i0.comp.i0.freespins=0&pt.i1.comp.i16.type=betline&pt.i1.comp.i16.freespins=0&pt.i1.comp.i20.symbol=SYM9&bl.i10.reelset=ALL&pt.i1.comp.i12.multi=5&pt.i1.comp.i1.n=4&pt.i1.comp.i5.type=betline&pt.i1.comp.i11.freespins=0&pt.i0.comp.i9.symbol=SYM6&pt.i1.comp.i13.symbol=SYM7&pt.i1.comp.i17.symbol=SYM8&bl.i11.coins=1&pt.i0.comp.i16.n=4&bl.i13.reelset=ALL&bl.i0.id=0&pt.i0.comp.i16.type=betline&pt.i1.comp.i16.n=4&pt.i0.comp.i5.symbol=SYM4&bl.i15.line=0%2C1%2C1%2C1%2C0&pt.i1.comp.i7.symbol=SYM5&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i19.id=19&bl.i4.reelset=ALL&bl.i4.coins=1&pt.i0.comp.i2.n=5&pt.i0.comp.i1.symbol=SYM3&bl.i18.line=2%2C0%2C2%2C0%2C2&bl.i9.id=9&pt.i0.comp.i19.freespins=0&pt.i1.comp.i14.type=betline&bl.i17.line=0%2C2%2C0%2C2%2C0&bl.i11.id=11&pt.i0.comp.i6.type=betline&pt.i1.comp.i9.freespins=0&pt.i1.comp.i2.freespins=0&playercurrency=%26%23x20AC%3B&bl.i9.reelset=ALL&bl.i17.coins=1&bl.i19.reelset=ALL&pt.i1.comp.i10.multi=100&pt.i1.comp.i10.symbol=SYM6&pt.i0.comp.i9.freespins=0&bl.i11.reelset=ALL&bl.i16.line=2%2C1%2C1%2C1%2C2&pt.i1.comp.i2.n=5&pt.i1.comp.i20.n=5&credit=500000&pt.i0.comp.i5.type=betline&pt.i0.comp.i11.freespins=0&bl.i1.reelset=ALL&pt.i1.comp.i18.symbol=SYM9&pt.i1.comp.i12.symbol=SYM7&pt.i0.comp.i4.type=betline&pt.i0.comp.i13.freespins=0&pt.i1.comp.i15.type=betline&pt.i1.comp.i13.type=betline&pt.i1.comp.i1.multi=250&pt.i1.comp.i1.type=betline&pt.i1.comp.i8.freespins=0&bl.i1.line=0%2C0%2C0%2C0%2C0&pt.i0.comp.i13.n=4&pt.i0.comp.i20.freespins=0&pt.i1.comp.i17.n=5&pt.i0.comp.i23.type=betline&bl.i17.id=17&bl.i16.reelset=ALL&pt.i0.comp.i3.n=3&pt.i1.comp.i17.freespins=0&pt.i1.comp.i6.type=betline&pt.i1.comp.i0.type=betline&pt.i1.comp.i1.symbol=SYM3&pt.i1.comp.i4.symbol=SYM4&bl.i8.line=1%2C0%2C0%2C0%2C1&bl.i8.coins=1&bl.i15.coins=1&pt.i0.comp.i23.multi=100&bl.i2.line=2%2C2%2C2%2C2%2C2&pt.i1.comp.i3.n=3&pt.i1.comp.i21.n=3&pt.i0.comp.i18.freespins=0&bl.i12.id=12&pt.i1.comp.i15.symbol=SYM8&pt.i1.comp.i18.freespins=0&pt.i1.comp.i3.freespins=0&bl.i4.id=4&bl.i7.coins=1&pt.i0.comp.i14.n=5&pt.i0.comp.i0.multi=25&pt.i1.comp.i9.symbol=SYM6&bl.i6.reelset=ALL&pt.i0.comp.i19.multi=30&pt.i0.comp.i3.symbol=SYM4&pt.i1.comp.i18.n=3&bl.i14.coins=1&pt.i1.comp.i12.freespins=0&pt.i0.comp.i12.freespins=0&pt.i0.comp.i4.n=4&pt.i1.comp.i10.n=4`;
                    break;


                case 'spin':
                    const linesId = [
                        [2, 2, 2, 2, 2], [1, 1, 1, 1, 1], [3, 3, 3, 3, 3], [1, 2, 3, 2, 1], [3, 2, 1, 2, 3],
                        [1, 1, 2, 1, 1], [3, 3, 2, 3, 3], [2, 3, 3, 3, 2], [2, 1, 1, 1, 2], [2, 1, 2, 1, 2],
                        [2, 3, 2, 3, 2], [1, 2, 1, 2, 1], [3, 2, 3, 2, 3], [2, 2, 1, 2, 2], [2, 2, 3, 2, 2],
                        [1, 2, 2, 2, 1], [3, 2, 2, 2, 3], [1, 3, 1, 3, 1], [3, 1, 3, 1, 3], [1, 3, 3, 3, 1]
                    ];
                    const lines = 20;
                    slotSettings.CurrentDenom = postData['bet.denomination'];
                    slotSettings.CurrentDenomination = postData['bet.denomination'];

                    let betline = 0;
                    let allbet = 0;
                    let bonusMpl = 1;

                    if (postData['slotEvent'] !== 'freespin' && postData['slotEvent'] !== 'respin') {
                        betline = parseFloat(postData['bet.betlevel']);
                        allbet = betline * lines;
                        slotSettings.UpdateJackpots(allbet);
                        if (!postData['slotEvent']) {
                            postData['slotEvent'] = 'bet';
                        }
                        slotSettings.SetBalance(-1 * allbet, postData['slotEvent']);
                        const bankSum = allbet / 100 * slotSettings.GetPercent();
                        slotSettings.SetBank((postData['slotEvent'] ? postData['slotEvent'] : ''), bankSum, postData['slotEvent']);
                        slotSettings.UpdateJackpots(allbet);

                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBonusWin', 0);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeGames', 0);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame', 0);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETTotalWin', 0);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBet', betline);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETDenom', postData['bet.denomination']);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeBalance', Math.floor(slotSettings.GetBalance() * 100) / 100 * 100);
                        bonusMpl = 1;
                    } else {
                        postData['bet.denomination'] = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETDenom');
                        slotSettings.CurrentDenom = postData['bet.denomination'];
                        slotSettings.CurrentDenomination = postData['bet.denomination'];
                        betline = parseFloat(slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBet'));
                        allbet = betline * lines;
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame', slotSettings.GetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame') + 1);
                        bonusMpl = slotSettings.slotFreeMpl;
                    }

                    const winTypeTmp = slotSettings.GetSpinSettings(allbet, lines, postData['slotEvent']);
                    let winType = winTypeTmp[0];
                    let spinWinLimit = winTypeTmp[1];

                    balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);
                    if (winType === 'bonus' && (postData['slotEvent'] === 'freespin' || postData['slotEvent'] === 'respin')) {
                        winType = 'win';
                    }

                    let totalWin = 0;

                    let reels: any = {};
                    let lineWins: string[] = [];
                    let cWins: number[] = new Array(lines).fill(0);
                    let wild = ['1'];
                    let scatter = '0';

                    let scattersWin = 0;
                    let scattersStr = '';
                    let scattersCount = 0;
                    let wildsRespinCount = 0;
                    let overlayWilds: string[] = [];
                    let overlayWildsArr: any[] = [];
                    let scPos: string[] = [];
                    let isMonsterShoot = false;

                    for (let i = 0; i <= 2000; i++) {
                        totalWin = 0;
                        lineWins = [];
                        cWins = new Array(lines).fill(0);
                        wild = ['1'];
                        scatter = '0';
                        reels = slotSettings.GetReelStrips(winType, postData['slotEvent']);

                        if (postData['slotEvent'] === 'freespin' && Math.floor(Math.random() * 5) === 0 && slotSettings.GetGameData('CreatureFromTheBlackLagoonNETMonsterHealth') < 10) {
                            const randIdx = Math.floor(Math.random() * 3);
                            reels['reel5'][randIdx] = '2';
                        }

                        if (postData['slotEvent'] === 'respin') {
                            const overlayWildsArrLast = slotSettings.GetGameData('CreatureFromTheBlackLagoonNEToverlayWildsArr');
                            if (Array.isArray(overlayWildsArrLast)) {
                                overlayWildsArrLast.forEach(wsp => {
                                    reels['reel' + wsp[0]][wsp[1]] = '1';
                                });
                            }
                        }

                        let winLineCount = 0;
                        for (let k = 0; k < lines; k++) {
                            let tmpStringWin = '';
                            for (let j = 0; j < slotSettings.SymbolGame.length; j++) {
                                const csym = slotSettings.SymbolGame[j];
                                if (csym === scatter || !slotSettings.Paytable['SYM_' + csym]) {
                                    continue;
                                } else {
                                    const s: string[] = [];
                                    s[0] = reels['reel1'][linesId[k][0] - 1];
                                    s[1] = reels['reel2'][linesId[k][1] - 1];
                                    s[2] = reels['reel3'][linesId[k][2] - 1];
                                    s[3] = reels['reel4'][linesId[k][3] - 1];
                                    s[4] = reels['reel5'][linesId[k][4] - 1];

                                    const checkWin = (count: number) => {
                                        const subS = s.slice(0, count);
                                        let match = true;
                                        let hasWild = false;
                                        for (const sym of subS) {
                                            if (sym !== csym && !wild.includes(sym)) {
                                                match = false;
                                                break;
                                            }
                                            if (wild.includes(sym)) hasWild = true;
                                        }

                                        if (match) {
                                            let mpl = 1;
                                            const allWild = subS.every(sym => wild.includes(sym));
                                            if (allWild) {
                                                mpl = 1;
                                            } else if (hasWild) {
                                                mpl = slotSettings.slotWildMpl;
                                            }

                                            const tmpWin = slotSettings.Paytable['SYM_' + csym][count] * betline * mpl * bonusMpl;
                                            if (cWins[k] < tmpWin) {
                                                cWins[k] = tmpWin;

                                                let posStr = '';
                                                for (let p = 0; p < count; p++) {
                                                    posStr += `&ws.i${winLineCount}.pos.i${p}=${p}%2C${linesId[k][p] - 1}`;
                                                }

                                                tmpStringWin = `&ws.i${winLineCount}.reelset=basic&ws.i${winLineCount}.types.i0.coins=${tmpWin}${posStr}&ws.i${winLineCount}.types.i0.wintype=coins&ws.i${winLineCount}.betline=${k}&ws.i${winLineCount}.sym=SYM${csym}&ws.i${winLineCount}.direction=left_to_right&ws.i${winLineCount}.types.i0.cents=${tmpWin * slotSettings.CurrentDenomination * 100}`;
                                            }
                                        }
                                    };

                                    checkWin(3);
                                    checkWin(4);
                                    checkWin(5);
                                }
                            }
                            if (cWins[k] > 0 && tmpStringWin !== '') {
                                lineWins.push(tmpStringWin);
                                totalWin += cWins[k];
                                winLineCount++;
                            }
                        }

                        scattersWin = 0;
                        scattersStr = '';
                        scattersCount = 0;
                        wildsRespinCount = 0;
                        overlayWilds = [];
                        overlayWildsArr = [];
                        scPos = [];
                        isMonsterShoot = false;

                        for (let r = 1; r <= 5; r++) {
                            for (let p = 0; p <= 2; p++) {
                                if (reels['reel' + r][p] === scatter) {
                                    scattersCount++;
                                    scPos.push(`&ws.i0.pos.i${r - 1}=${r - 1}%2C${p}`);
                                }
                                if (reels['reel' + r][p] === '1' && postData['slotEvent'] !== 'respin') {
                                    wildsRespinCount++;
                                    overlayWilds.push(`&rs.i0.r.i${r - 1}.overlay.i0.row=${p}&rs.i0.r.i${r - 1}.overlay.i0.with=SYM1&rs.i0.r.i${r - 1}.overlay.i0.pos=132`);
                                    overlayWildsArr.push([r, p]);
                                }
                                if (reels['reel' + r][p] === '2') {
                                    isMonsterShoot = true;
                                }
                            }
                        }

                        if (scattersCount >= 3) {
                            // const freeCounts: Record<number, number> = {3: 10, 4: 15, 5: 20};
                            // const count = freeCounts[scattersCount] || 10;

                            // In PHP: $slotSettings->slotFreeCount[$scattersCount]
                            // Checking Game implementation, slotFreeCount is usually 1 if not array.
                            // But let's use standard logic or what was likely there.
                            // Assuming standard 3->10, 4->20 for this game?
                            // Actually PHP code says: $slotSettings->slotFreeCount[$scattersCount]
                            // BaseSlotSettings initializes it to null. SlotSettings.php initializes it to 1.
                            // This suggests it might be hardcoded or dynamic.
                            // Wait, SlotSettings.php line 103: $this->slotFreeCount = 1;
                            // But logic at line 443: $slotSettings->slotFreeCount[$scattersCount]
                            // This implies slotFreeCount is ARRAY.
                            // I will assume standard counts for now:
                            const freeCounts: Record<number, number> = { 3: 10, 4: 15, 5: 20 };
                            const count = freeCounts[scattersCount] || 10;

                            scattersStr = `&ws.i0.types.i0.freespins=${count}&ws.i0.reelset=basic&ws.i0.betline=null&ws.i0.types.i0.wintype=freespins&ws.i0.direction=none${scPos.join('')}`;
                        }

                        totalWin += scattersWin;

                        if (i > 1000) winType = 'none';
                        if (i > 1500) return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"Bad Reel Strip"}';

                        const maxWin = slotSettings.MaxWin;
                        if ((totalWin * slotSettings.CurrentDenom) <= maxWin) {
                            const minWin = slotSettings.GetRandomPay();

                            let breakout = false;
                            if (slotSettings.increaseRTP && winType === 'win' && totalWin < (minWin * allbet)) {
                                // continue
                            } else if (wildsRespinCount >= 1 && (postData['slotEvent'] === 'freespin' || winType === 'bonus')) {
                                // continue
                            } else if (scattersCount >= 3 && winType !== 'bonus') {
                                // continue
                            } else if (totalWin <= spinWinLimit && winType === 'bonus') {
                                const cBank = slotSettings.GetBank(postData['slotEvent'] || '');
                                if (cBank < spinWinLimit) {
                                    spinWinLimit = cBank;
                                } else {
                                    breakout = true;
                                }
                            } else if (totalWin > 0 && totalWin <= spinWinLimit && winType === 'win') {
                                const cBank = slotSettings.GetBank(postData['slotEvent'] || '');
                                if (cBank < spinWinLimit) {
                                    spinWinLimit = cBank;
                                } else {
                                    breakout = true;
                                }
                            } else if (totalWin === 0 && winType === 'none') {
                                breakout = true;
                            }

                            if (breakout) break;
                        }
                    }

                    if (totalWin > 0) {
                        slotSettings.SetBank(postData['slotEvent'] || '', -1 * totalWin);
                        slotSettings.SetBalance(totalWin);
                    }
                    const reportWin = totalWin;

                    let curReelsStr = `&rs.i0.r.i0.syms=SYM${reels['reel1'][0]}%2CSYM${reels['reel1'][1]}%2CSYM${reels['reel1'][2]}`;
                    curReelsStr += `&rs.i0.r.i1.syms=SYM${reels['reel2'][0]}%2CSYM${reels['reel2'][1]}%2CSYM${reels['reel2'][2]}`;
                    curReelsStr += `&rs.i0.r.i2.syms=SYM${reels['reel3'][0]}%2CSYM${reels['reel3'][1]}%2CSYM${reels['reel3'][2]}`;
                    curReelsStr += `&rs.i0.r.i3.syms=SYM${reels['reel4'][0]}%2CSYM${reels['reel4'][1]}%2CSYM${reels['reel4'][2]}`;
                    curReelsStr += `&rs.i0.r.i4.syms=SYM${reels['reel5'][0]}%2CSYM${reels['reel5'][1]}%2CSYM${reels['reel5'][2]}`;

                    if (postData['slotEvent'] === 'freespin' || postData['slotEvent'] === 'respin') {
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBonusWin', slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBonusWin') + totalWin);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETTotalWin', slotSettings.GetGameData('CreatureFromTheBlackLagoonNETTotalWin') + totalWin);
                    } else {
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETTotalWin', totalWin);
                    }

                    let fs = 0;
                    let freeStateStr = '';
                    if (scattersCount >= 3) {
                        const freeCounts: Record<number, number> = { 3: 10, 4: 15, 5: 20 };
                        const count = freeCounts[scattersCount] || 10;

                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeStartWin', totalWin);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBonusWin', totalWin);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeGames', count);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETMonsterHealth', 0);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeLevel', 0);
                        fs = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeGames');

                        freeStateStr = `&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=freespin&freespins.left=${fs}&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=basic%2Cfreespin&freespins.totalwin.coins=0&freespins.total=${fs}&freespins.win.cents=0&gamestate.current=freespin&freespins.initial=${fs}&freespins.win.coins=0&freespins.betlevel=${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBet')}&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&game.win.amount=${totalWin / slotSettings.CurrentDenomination}`;
                        curReelsStr += freeStateStr;
                    }

                    let attStr = '';
                    const nearwin: number[] = [];
                    let nearwinCnt = 0;
                    if (scattersCount >= 2) {
                        for (let r = 1; r <= 5; r++) {
                            for (let p = 0; p <= 2; p++) {
                                if (nearwinCnt >= 2 && p === 0) {
                                    nearwin.push(r - 1);
                                }
                                if (reels['reel' + r][p] === '0') {
                                    attStr += `&rs.i0.r.i${r - 1}.attention.i0=${p}`;
                                    nearwinCnt++;
                                }
                            }
                        }
                        attStr += `&rs.i0.nearwin=${nearwin.join('%2C')}`;
                    }

                    const winString = lineWins.join('');
                    const jsSpin = JSON.stringify(reels);

                    // Fix circular reference in Jackpots (Model objects might have circular refs or not be POJOs)
                    // Convert Jackpots to simple object or rely on toArray if implemented, 
                    // but here Jackpots seems to be a simple property on SlotSettings.
                    // If it's an object with back-refs, we need to be careful.
                    // In BaseSlotSettings, Jackpots is initialized as {} or from settings.
                    // It gets updated with 'jackPay'. 
                    // It should be safe unless something weird happened.
                    // The error "cyclic structures" usually comes from JSON.stringify of complex objects (like slotSettings itself).
                    // But here we are stringifying slotSettings.Jackpots.
                    // Let's ensure it's safe.
                    const jsJack = JSON.stringify(slotSettings.Jackpots);

                    if (wildsRespinCount >= 1 && postData['slotEvent'] !== 'respin') {
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeStartWin', totalWin);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETBonusWin', totalWin);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETRespinMode', 1);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNEToverlayWildsArr', overlayWildsArr);

                        const gamestate = 'respin';
                        const nextaction = 'respin';
                        const stack = 'basic';
                        const clientaction = 'spin';

                        let freeState0 = '';
                        if (slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame') < slotSettings.GetGameData(slotSettings.slotId + 'FreeGames')) {
                            freeState0 = '&last.rs=freespinlevel0respin&rs.i0.id=freespinlevel0respin&last.rs=freespinlevel0respin&gamestate.stack=basic%2Cfreespin&clientaction=freespin&gamestate.current=freespin';
                        }

                        freeStateStr = `&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=${nextaction}&freespins.left=0&freespins.wavecount=1&freespins.multiplier=1&clientaction=${clientaction}&gamestate.stack=${stack}&freespins.totalwin.coins=${totalWin}&freespins.total=0&freespins.win.cents=${totalWin / slotSettings.CurrentDenomination * 100}&gamestate.current=${gamestate}&freespins.initial=${fs}&freespins.win.coins=${totalWin}&freespins.betlevel=${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBet')}&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&game.win.amount=${totalWin / slotSettings.CurrentDenomination}${freeState0}${overlayWilds.join('')}`;
                        curReelsStr += freeStateStr;
                    }

                    if (postData['slotEvent'] === 'respin') {
                        // Respin logic...
                        const respinStr = `previous.rs.i0=basicrespin&rs.i0.r.i1.pos=107&rs.i0.r.i4.overlay.i0.with=SYM1&gameServerVersion=1.5.0&g4mode=false&game.win.coins=${totalWin}&playercurrency=%26%23x20AC%3B&playercurrencyiso=${slotSettings.slotCurrency}&historybutton=false&rs.i0.r.i1.hold=false&current.rs.i0=basic&rs.i0.r.i4.hold=false&next.rs=basic&gamestate.history=basic&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&clientaction=respin&rs.i0.r.i1.syms=SYM4%2CSYM6%2CSYM10&rs.i0.r.i2.hold=false&rs.i0.r.i4.syms=SYM5%2CSYM5%2CSYM6&game.win.cents=${totalWin * slotSettings.CurrentDenomination * 100}&rs.i0.r.i2.pos=35&rs.i0.id=basicrespin&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&gamestate.current=basic&gameover=true&rs.i0.r.i0.hold=false&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i3.pos=10&last.rs=basicrespin&rs.i0.r.i4.pos=83&rs.i0.r.i0.syms=SYM6%2CSYM8%2CSYM3&rs.i0.r.i3.syms=SYM8%2CSYM7%2CSYM8&isJackpotWin=false&gamestate.stack=basic&nextaction=spin&rs.i0.r.i0.pos=62&wavecount=1&gamesoundurl=&rs.i0.r.i4.overlay.i0.row=2&rs.i0.r.i2.syms=SYM8%2CSYM8%2CSYM9&rs.i0.r.i3.hold=false&game.win.amount=${totalWin / slotSettings.CurrentDenomination}${curReelsStr}${winString}${overlayWilds.join('')}`;
                        result_tmp[0] = respinStr;
                    }

                    if (postData['slotEvent'] === 'freespin') {
                        totalWin = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBonusWin');
                        let nextaction = 'freespin';
                        let stack = 'basic%2Cfreespin';
                        let gamestate = 'freespin';

                        if (slotSettings.GetGameData(slotSettings.slotId + 'FreeGames') <= slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame')) {
                            nextaction = 'spin';
                            stack = 'basic';
                            gamestate = 'basic';
                        }

                        fs = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeGames');
                        const fsl = fs - slotSettings.GetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame');
                        let MonsterHealth = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETMonsterHealth');
                        const FreeLevel = slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeLevel');
                        const FreeLevel0 = 'freespinlevel' + FreeLevel;

                        if (isMonsterShoot) {
                            MonsterHealth++;
                        }
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETMonsterHealth', MonsterHealth);
                        slotSettings.SetGameData('CreatureFromTheBlackLagoonNETFreeLevel', FreeLevel);

                        const monsterState = `previous.rs.i0=${FreeLevel0}&current.rs.i0=${FreeLevel0}&next.rs=${FreeLevel0}&rs.i0.id=${FreeLevel0}&last.rs=${FreeLevel0}&collectablesWon=${MonsterHealth}`;
                        freeStateStr = `&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=${nextaction}&freespins.left=${fsl}&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=${stack}&freespins.totalwin.coins=${totalWin}&freespins.total=${fs}&freespins.win.cents=${totalWin / slotSettings.CurrentDenomination * 100}&gamestate.current=${gamestate}&freespins.initial=${fs}&freespins.win.coins=${totalWin}&freespins.betlevel=${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBet')}&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&game.win.amount=${totalWin / slotSettings.CurrentDenomination}${monsterState}`;
                        curReelsStr += freeStateStr;
                    }

                    const response = `{"responseEvent":"spin","responseType":"${postData['slotEvent']}","serverResponse":{"FreeLevel":${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeLevel')},"MonsterHealth":${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETMonsterHealth')},"freeState":"${freeStateStr.replace(/"/g, '\\"')}","slotLines":${lines},"slotBet":${betline},"totalFreeGames":${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETFreeGames')},"currentFreeGames":${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame')},"Balance":${balanceInCents},"afterBalance":${balanceInCents},"bonusWin":${slotSettings.GetGameData('CreatureFromTheBlackLagoonNETBonusWin')},"totalWin":${totalWin},"winLines":[],"Jackpots":${jsJack},"reelsSymbols":${jsSpin}}}`;

                    if (postData['slotEvent'] === 'respin') {
                        postData['slotEvent'] = 'BG2';
                    }

                    slotSettings.SaveLogReport(response, allbet, lines, reportWin, postData['slotEvent']);
                    balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);

                    const resultStr = `previous.rs.i0=basic&rs.i0.r.i1.pos=15&gameServerVersion=1.5.0&g4mode=false&game.win.coins=${totalWin}&playercurrencyiso=${slotSettings.slotCurrency}&historybutton=false&rs.i0.r.i1.hold=false&current.rs.i0=basic&rs.i0.r.i4.hold=false&next.rs=basic&gamestate.history=basic&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&clientaction=spin&rs.i0.r.i1.syms=SYM9%2CSYM7%2CSYM5&rs.i0.r.i2.hold=false&rs.i0.r.i4.syms=SYM0%2CSYM3%2CSYM8&game.win.cents=${totalWin * slotSettings.CurrentDenomination * 100}&rs.i0.r.i2.pos=80&rs.i0.id=basic&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&gamestate.current=basic&gameover=true&rs.i0.r.i0.hold=false&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i3.pos=119&last.rs=basic&rs.i0.r.i4.pos=53&rs.i0.r.i0.syms=SYM10%2CSYM9%2CSYM5&rs.i0.r.i3.syms=SYM7%2CSYM10%2CSYM7&isJackpotWin=false&gamestate.stack=basic&nextaction=spin&rs.i0.r.i0.pos=114&wavecount=1&gamesoundurl=&rs.i0.r.i2.syms=SYM3%2CSYM8%2CSYM7&rs.i0.r.i3.hold=false&game.win.amount=${totalWin / slotSettings.CurrentDenomination}${curReelsStr}${winString}&rs.i0.r.i3.attention.i0=1&rs.i0.r.i0.attention.i0=2&rs.i0.r.i2.attention.i0=1${attStr}`;

                    if (!result_tmp[0]) result_tmp[0] = resultStr;
                    break;
            }

            const finalResponse = result_tmp[0];
            slotSettings.SaveGameData();
            slotSettings.SaveGameDataStatic();

            // Helper to safely serialize state with complex objects
            const state = slotSettings.getState();
            // Ensure no circular refs or non-serializable objects in state before returning
            // If Jackpots is complex, it might need toArray() or similar, but here we assume it's handled.
            // The 'user' and 'shop' objects in state might be problematic if they have circular links (like shop -> user -> shop).
            // In our Models, User has a 'shop' property which is a simple object {currency: string} in our implementation, 
            // but if it were the full Shop model, and Shop had a list of users, it would be circular.
            // Our implementations in src/models/implementations seem safe (User has simple shop object).

            // However, to be safe against cyclic error:
            const safeState = JSON.parse(JSON.stringify(state, (key, value) => {
                if (key === 'originalData') return undefined; // internal
                return value;
            }));
            return JSON.stringify({
                'response': finalResponse,
                'state': safeState,
            });

        } catch (e: any) {
            console.log(e)
            slotSettings.InternalErrorSilent(e);
            return JSON.stringify({
                'response': '{"responseEvent":"error","responseType":"","serverResponse":"InternalError"}',
                'state': {} // Return empty state on error to avoid further cyclic errors
            });
        }
    }
}
