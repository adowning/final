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

            if (postData['bet_denomination'] && parseFloat(postData['bet_denomination']) >= 1) {
                postData['bet_denomination'] = parseFloat(postData['bet_denomination']) / 100;
                slotSettings.CurrentDenom = postData['bet_denomination'];
                slotSettings.CurrentDenomination = postData['bet_denomination'];
                slotSettings.SetGameData(slotSettings.slotId + 'GameDenom', postData['bet_denomination']);
            } else if (slotSettings.HasGameData(slotSettings.slotId + 'GameDenom')) {
                postData['bet_denomination'] = slotSettings.GetGameData(slotSettings.slotId + 'GameDenom');
                slotSettings.CurrentDenom = postData['bet_denomination'];
                slotSettings.CurrentDenomination = postData['bet_denomination'];
            }

            balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);

            if (postData['slotEvent'] === 'bet') {
                const lines = 20;
                const betline = parseFloat(postData['bet_betlevel']);
                if (lines <= 0 || betline <= 0.0001) {
                    return JSON.stringify({
                        response: '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bet state"}',
                        state: slotSettings.getState()
                    });
                }
                if (slotSettings.GetBalance() < (lines * betline)) {
                    Log.info(' invalid balance');
                    return JSON.stringify({
                        response: '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid balance"}',
                        state: slotSettings.getState()
                    });
                }
            }

            if (slotSettings.GetGameData(slotSettings.slotId + 'FreeGames') < slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame') && postData['slotEvent'] === 'freespin') {
                Log.info('serverResponse":"invalid bonus state');
                return JSON.stringify({
                    response: '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bonus state"}',
                    state: slotSettings.getState()
                });
            }

            aid = String(postData['action']);

            switch (aid) {
                case 'init':
                    Log.info(`[DEBUG] Init action started for action: ${aid}`);
                    slotSettings.SetGameData('GoldenGrimoireNETBonusWin', 0);
                    slotSettings.SetGameData('GoldenGrimoireNETFreeGames', 0);
                    slotSettings.SetGameData('GoldenGrimoireNETCurrentFreeGame', 0);
                    slotSettings.SetGameData('GoldenGrimoireNETTotalWin', 0);
                    slotSettings.SetGameData('GoldenGrimoireNETFreeBalance', 0);

                    let freeState = '';
                    let curReels = '';

                    result_tmp[0] = '';

                    const randSym = () => Math.floor(Math.random() * 7) + 1;
                    const randPos = () => Math.floor(Math.random() * 10) + 1;

                    curReels = `&rs.i0.r.i0.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                    curReels += `&rs.i0.r.i1.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                    curReels += `&rs.i0.r.i2.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                    curReels += `&rs.i0.r.i3.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                    curReels += `&rs.i0.r.i4.syms=SYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}%2CSYM${randSym()}`;
                    curReels += `&rs.i0.r.i0.pos=${randPos()}&rs.i0.r.i1.pos=${randPos()}&rs.i0.r.i2.pos=${randPos()}&rs.i0.r.i3.pos=${randPos()}&rs.i0.r.i4.pos=${randPos()}`;

                    for (let d = 0; d < slotSettings.Denominations.length; d++) {
                        slotSettings.Denominations[d] = slotSettings.Denominations[d] * 100;
                    }

                    if (slotSettings.GetGameData('GoldenGrimoireNETCurrentFreeGame') < slotSettings.GetGameData('GoldenGrimoireNETFreeGames') && slotSettings.GetGameData('GoldenGrimoireNETFreeGames') > 0) {
                        freeState = `rs.i1.r.i0.syms=SYM2%2CSYM5%2CSYM5&bl.i6.coins=1&bl.i17.reelset=ALL&rs.i0.nearwin=4&bl.i15.id=15&rs.i0.r.i4.hold=false&gamestate.history=basic%2Cfreespin&rs.i1.r.i2.hold=false&game.win.cents=176&staticsharedurl=&bl.i10.line=1%2C2%2C1%2C2%2C1&bl.i0.reelset=ALL&bl.i18.coins=1&bl.i10.id=10&freespins.initial=15&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&bl.i13.coins=1&bl.i15.reelset=ALL&game.win.coins=88&bl.i14.id=14&gamestate.current=freespin&freespins.denomination=2.000&freespins.totalwin.coins=80&freespins.total=15&gamestate.stack=basic%2Cfreespin&gameServerVersion=1.0.1&g4mode=false&multiplier=1&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&denomination.all=${slotSettings.Denominations.join('%2C')}&denomination.standard=${slotSettings.CurrentDenomination * 100}&playercurrencyiso=${slotSettings.slotCurrency}&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&casinoID=netent&gamesoundurl=&historybutton=false&gameover=false&gameEventSetters.enabled=false&nearwinallowed=true&wavecount=1&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&credit=${balanceInCents}&bet.betlevel=1&bet.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&bet.denomination=${slotSettings.CurrentDenomination * 100}&nextaction=freespin&isJackpotWin=false&jackpotcurrency=%E2%82%AC&playercurrency=%E2%82%AC&totalwin.coins=0&totalwin.cents=0`;
                    }
                    
                    result_tmp[0] = freeState ? freeState : `bl.i32.reelset=ALL&rs.i1.r.i0.syms=SYM3%2CSYM3%2CSYM3%2CSYM3&bl.i6.coins=0&bl.i17.reelset=ALL&bl.i15.id=15&rs.i0.r.i4.hold=false&rs.i1.r.i2.hold=false&bl.i21.id=21&game.win.cents=0&staticsharedurl=https%3A%2F%2Fstatic-shared.casinomodule.com%2Fgameclient_html%2Fdevicedetection%2Fcurrent&bl.i23.reelset=ALL&bl.i33.coins=0&bl.i10.line=1%2C0%2C1%2C0%2C1&bl.i0.reelset=ALL&bl.i20.coins=0&bl.i18.coins=0&bl.i10.id=10&bl.i3.reelset=ALL&bl.i4.line=3%2C2%2C1%2C2%2C3&bl.i13.coins=0&bl.i26.reelset=ALL&bl.i24.line=0%2C0%2C2%2C0%2C0&bl.i27.id=27&rs.i2.r.i0.hold=false&rs.i0.r.i0.syms=SYM3%2CSYM3%2CSYM6%2CSYM6&bl.i2.id=2&rs.i1.r.i1.pos=0&bl.i38.line=3%2C0%2C0%2C0%2C3&rs.i3.r.i4.pos=0&reelsTriggeredFreeSpin=null&rs.i0.r.i0.pos=0&bl.i14.reelset=ALL&rs.i2.r.i3.pos=0&bl.i38.id=38&bl.i39.coins=0&rs.i5.r.i0.pos=0&rs.i2.r.i4.hold=false&rs.i3.r.i1.pos=0&rs.i2.id=basic2&game.win.coins=0&bl.i28.line=0%2C2%2C0%2C2%2C0&rs.i1.r.i0.hold=false&bl.i3.id=3&bl.i22.line=2%2C2%2C0%2C2%2C2&bl.i12.coins=0&bl.i8.reelset=ALL&clientaction=init&rs.i4.r.i0.hold=false&rs.i0.r.i2.hold=false&rs.i4.r.i3.syms=SYM3%2CSYM3%2CSYM3%2CSYM3&bl.i16.id=16&bl.i37.reelset=ALL&bl.i39.id=39&casinoID=netent&bl.i5.coins=0&rs.i3.r.i2.hold=false&bl.i8.id=8&rs.i5.r.i1.syms=SYM3%2CSYM3%2CSYM3%2CSYM3&rs.i0.r.i3.pos=0&bl.i33.id=33&rs.i4.r.i0.syms=SYM6%2CSYM6%2CSYM6%2CSYM6&rs.i5.r.i3.pos=0&bl.i6.line=0%2C1%2C2%2C1%2C0&bl.i22.id=22&bl.i12.line=1%2C2%2C1%2C2%2C1&bl.i0.line=1%2C1%2C1%2C1%2C1&bl.i29.reelset=ALL&bl.i34.line=2%2C1%2C1%2C1%2C2&rs.i4.r.i2.pos=0&bl.i31.line=1%2C2%2C2%2C2%2C1&rs.i0.r.i2.syms=SYM13%2CSYM13%2CSYM5%2CSYM5&bl.i34.coins=0&game.win.amount=0&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&rs.i5.r.i2.hold=false&denomination.all=1%2C2%2C5%2C10%2C20%2C50%2C100%2C200&bl.i27.coins=0&bl.i34.reelset=ALL&rs.i2.r.i0.pos=0&bl.i30.reelset=ALL&bl.i1.id=1&rs.i3.r.i2.syms=SYM3%2CSYM3%2CSYM3%2CSYM3&bl.i33.line=3%2C2%2C2%2C2%2C3&bl.i25.id=25&rs.i1.r.i4.pos=0&denomination.standard=5&rs.i3.id=mystery1&bl.i31.id=31&bl.i32.line=2%2C3%2C3%2C3%2C2&multiplier=1&bl.i14.id=14&bl.i19.line=0%2C0%2C1%2C0%2C0&bl.i12.reelset=ALL&bl.i2.coins=0&bl.i6.id=6&bl.i21.reelset=ALL&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&bl.i20.id=20&rs.i1.r.i4.syms=SYM5%2CSYM5%2CSYM5%2CSYM5&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&rs.i5.r.i2.syms=SYM6%2CSYM6%2CSYM6%2CSYM6&rs.i5.r.i3.hold=false&rs.i4.r.i2.hold=false&bl.i33.reelset=ALL&bl.i5.reelset=ALL&bl.i24.coins=0&rs.i4.r.i1.syms=SYM7%2CSYM7%2CSYM7%2CSYM7&bl.i19.coins=0&bl.i32.coins=0&bl.i7.id=7&bl.i18.reelset=ALL&rs.i2.r.i4.pos=0&rs.i3.r.i0.syms=SYM6%2CSYM6%2CSYM6%2CSYM6&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=0&bl.i32.id=32&rs.i4.r.i1.hold=false&rs.i3.r.i2.pos=0&bl.i14.line=1%2C1%2C0%2C1%2C1&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&rs.i0.r.i4.syms=SYM8%2CSYM8%2CSYM8%2CSYM8&bl.i25.coins=0&rs.i0.r.i2.pos=0&bl.i39.reelset=ALL&bl.i13.line=2%2C3%2C2%2C3%2C2&bl.i24.reelset=ALL&rs.i1.r.i0.pos=0&bl.i0.coins=20&rs.i2.r.i0.syms=SYM10%2CSYM10%2CSYM10%2CSYM10&bl.i2.reelset=ALL&bl.i31.coins=0&bl.i37.id=37&rs.i3.r.i1.syms=SYM8%2CSYM8%2CSYM8%2CSYM8&rs.i1.r.i4.hold=false&rs.i4.r.i1.pos=0&bl.i26.coins=0&rs.i4.r.i2.syms=SYM9%2CSYM9%2CSYM9%2CSYM9&bl.i27.reelset=ALL&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%2C38%2C39&bl.i29.line=1%2C3%2C1%2C3%2C1&rs.i5.r.i3.syms=SYM6%2CSYM6%2CSYM7%2CSYM7&rs.i3.r.i0.hold=false&bl.i23.line=0%2C0%2C3%2C0%2C0&bl.i26.id=26&bl.i15.reelset=ALL&rs.i0.r.i3.hold=false&rs.i5.r.i4.pos=0&rs.i4.id=basic1&rs.i2.r.i1.hold=false&gameServerVersion=1.0.1&g4mode=false&bl.i11.line=0%2C1%2C0%2C1%2C0&bl.i30.id=30&historybutton=false&bl.i25.line=1%2C1%2C3%2C1%2C1&bl.i5.id=5&gameEventSetters.enabled=false&bl.i36.reelset=ALL&rs.i1.r.i3.pos=0&rs.i0.r.i1.syms=SYM8%2CSYM8%2CSYM10%2CSYM10&bl.i3.coins=0&bl.i10.coins=0&bl.i18.id=18&rs.i2.r.i1.pos=0&rs.i4.r.i4.pos=0&bl.i30.coins=0&bl.i39.line=0%2C3%2C3%2C3%2C0&rs.i1.r.i3.hold=false&totalwin.coins=0&rs.i5.r.i4.syms=SYM6%2CSYM6%2CSYM3%2CSYM3&bl.i5.line=2%2C1%2C0%2C1%2C2&gamestate.current=basic&bl.i28.coins=0&rs.i4.r.i0.pos=0&bl.i27.line=2%2C0%2C2%2C0%2C2&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C3%2C2%2C1&bl.i35.id=35&rs.i3.r.i1.hold=false&rs.i0.r.i3.syms=SYM8%2CSYM8%2CSYM8%2CSYM8&rs.i1.r.i1.syms=SYM7%2CSYM7%2CSYM5%2CSYM5&bl.i16.coins=0&bl.i36.coins=0&bl.i9.coins=0&bl.i30.line=0%2C1%2C1%2C1%2C0&bl.i7.reelset=ALL&isJackpotWin=false&rs.i2.r.i3.hold=false&bl.i24.id=24&rs.i0.r.i1.pos=0&rs.i4.r.i4.syms=SYM3%2CSYM3%2CSYM9%2CSYM9&bl.i22.coins=0&rs.i1.r.i3.syms=SYM5%2CSYM5%2CSYM5%2CSYM5&bl.i29.coins=0&bl.i31.reelset=ALL&bl.i13.id=13&bl.i36.id=36&rs.i0.r.i1.hold=false&rs.i2.r.i1.syms=SYM8%2CSYM8%2CSYM8%2CSYM8&bl.i9.line=2%2C1%2C2%2C1%2C2&bl.i35.coins=0&betlevel.standard=1&bl.i10.reelset=ALL&gameover=true&rs.i3.r.i3.pos=0&bl.i25.reelset=ALL&rs.i5.id=freespin2&bl.i23.coins=0&bl.i11.coins=0&rs.i5.r.i1.hold=false&bl.i22.reelset=ALL&rs.i5.r.i4.hold=false&bl.i13.reelset=ALL&bl.i0.id=0&nextaction=spin&bl.i15.line=2%2C2%2C1%2C2%2C2&bl.i3.line=3%2C3%2C3%2C3%2C3&bl.i19.id=19&bl.i4.reelset=ALL&bl.i4.coins=0&bl.i37.line=0%2C3%2C0%2C3%2C0&bl.i18.line=1%2C1%2C2%2C1%2C1&bl.i9.id=9&bl.i34.id=34&bl.i17.line=2%2C2%2C3%2C2%2C2&bl.i11.id=11&bl.i37.coins=0&rs.i4.r.i3.pos=0&playercurrency=%26%23x20AC%3B&bl.i9.reelset=ALL&rs.i4.r.i4.hold=false&bl.i17.coins=0&bl.i28.id=28&rs.i5.r.i0.syms=SYM9%2CSYM9%2CSYM9%2CSYM9&bl.i19.reelset=ALL&rs.i2.r.i4.syms=SYM9%2CSYM9%2CSYM9%2CSYM9&rs.i4.r.i3.hold=false&bl.i11.reelset=ALL&bl.i16.line=3%2C3%2C2%2C3%2C3&rs.i0.id=freespin1&bl.i38.reelset=ALL&credit=${balanceInCents}&bl.i21.line=3%2C3%2C1%2C3%2C3&bl.i35.line=1%2C0%2C0%2C0%2C1&bl.i1.reelset=ALL&rs.i2.r.i2.pos=0&bl.i21.coins=0&bl.i28.reelset=ALL&rs.i5.r.i1.pos=0&bl.i1.line=2%2C2%2C2%2C2%2C2&bl.i17.id=17&rs.i2.r.i2.syms=SYM10%2CSYM10%2CSYM10%2CSYM10&rs.i1.r.i2.pos=0&bl.i16.reelset=ALL&rs.i3.r.i3.syms=SYM3%2CSYM3%2CSYM6%2CSYM6&rs.i3.r.i4.hold=false&rs.i5.r.i0.hold=false&nearwinallowed=true&bl.i8.line=3%2C2%2C3%2C2%2C3&bl.i35.reelset=ALL&rs.i3.r.i3.hold=false&bl.i8.coins=0&bl.i23.id=23&bl.i15.coins=0&bl.i36.line=3%2C0%2C3%2C0%2C3&bl.i2.line=0%2C0%2C0%2C0%2C0&rs.i1.r.i2.syms=SYM6%2CSYM6%2CSYM6%2CSYM6&totalwin.cents=0&bl.i38.coins=0&rs.i5.r.i2.pos=0&rs.i0.r.i0.hold=false&rs.i2.r.i3.syms=SYM6%2CSYM6%2CSYM10%2CSYM10&restore=false&rs.i1.id=mystery2&rs.i3.r.i4.syms=SYM10%2CSYM10%2CSYM10%2CSYM10&bl.i12.id=12&bl.i29.id=29&bl.i4.id=4&rs.i0.r.i4.pos=0&bl.i7.coins=0&bl.i6.reelset=ALL&rs.i3.r.i0.pos=0&bl.i20.line=3%2C3%2C0%2C3%2C3&rs.i2.r.i2.hold=false&bl.i20.reelset=ALL&wavecount=1&bl.i14.coins=0&rs.i1.r.i1.hold=false&bl.i26.line=3%2C1%2C3%2C1%2C3`;
                    break;

                case 'paytable':
                    Log.info(`[DEBUG] Paytable action started`);
                    result_tmp[0] = `pt.i0.comp.i19.symbol=SYM9&bl.i6.coins=1&bl.i17.reelset=ALL&pt.i0.comp.i15.type=betline&pt.i0.comp.i23.n=5&pt.i0.comp.i4.freespins=0&pt.i0.comp.i11.symbol=SYM5&pt.i0.comp.i13.symbol=SYM6&pt.i1.comp.i8.type=betline&pt.i1.comp.i4.n=4&pt.i0.comp.i15.multi=4&bl.i10.line=1%2C0%2C1%2C0%2C1&bl.i18.coins=0&pt.i1.comp.i3.multi=10&pt.i0.comp.i11.n=5&pt.i1.comp.i23.symbol=SYM9&bl.i4.line=3%2C2%2C1%2C2%2C3&bl.i13.coins=0&bl.i27.id=27&pt.i0.id=basic&pt.i0.comp.i1.type=betline&bl.i2.id=2&pt.i1.comp.i10.type=betline&pt.i0.comp.i2.symbol=SYM1&pt.i0.comp.i4.symbol=SYM3&pt.i1.comp.i5.freespins=0&pt.i1.comp.i8.symbol=SYM4&bl.i14.reelset=ALL&pt.i1.comp.i19.n=4&pt.i0.comp.i17.freespins=0&bl.i38.id=38&bl.i39.coins=0&pt.i0.comp.i8.symbol=SYM4&pt.i0.comp.i0.symbol=SYM1&pt.i0.comp.i3.freespins=0&pt.i0.comp.i10.multi=20&pt.i1.id=freespin&bl.i3.id=3&pt.i1.comp.i6.freespins=0&pt.i0.comp.i24.n=3&bl.i8.reelset=ALL&clientaction=paytable&bl.i16.id=16&bl.i39.id=39&pt.i1.comp.i5.n=5&bl.i5.coins=0&pt.i1.comp.i8.multi=75&pt.i0.comp.i22.type=betline&pt.i0.comp.i24.freespins=0&pt.i0.comp.i21.multi=3&pt.i1.comp.i13.multi=15&pt.i0.comp.i12.n=3&pt.i0.comp.i13.type=betline&bl.i0.line=1%2C1%2C1%2C1%2C1&pt.i1.comp.i7.freespins=0&bl.i34.line=2%2C1%2C1%2C1%2C2&bl.i31.line=1%2C2%2C2%2C2%2C1&pt.i0.comp.i3.multi=10&bl.i34.coins=0&pt.i1.comp.i22.type=betline&pt.i0.comp.i21.n=3&pt.i1.comp.i6.n=3&bl.i1.id=1&pt.i0.comp.i10.type=betline&pt.i1.comp.i11.symbol=SYM5&bl.i25.id=25&pt.i0.comp.i5.multi=100&pt.i1.comp.i1.freespins=0&bl.i14.id=14&pt.i1.comp.i16.symbol=SYM7&pt.i1.comp.i23.multi=15&pt.i1.comp.i4.type=betline&pt.i1.comp.i18.multi=4&bl.i2.coins=0&bl.i21.reelset=ALL&pt.i1.comp.i26.type=betline&pt.i0.comp.i8.multi=75&pt.i0.comp.i1.freespins=0&bl.i5.reelset=ALL&bl.i24.coins=0&pt.i0.comp.i22.n=4&bl.i32.coins=0&pt.i1.comp.i17.type=betline&pt.i1.comp.i0.symbol=SYM1&pt.i1.comp.i7.n=4&pt.i1.comp.i5.multi=100&bl.i14.line=1%2C1%2C0%2C1%2C1&pt.i0.comp.i21.type=betline&jackpotcurrencyiso=${slotSettings.slotCurrency}&pt.i0.comp.i8.type=betline&pt.i0.comp.i7.freespins=0&pt.i1.comp.i15.multi=4&pt.i0.comp.i13.multi=15&bl.i39.reelset=ALL&pt.i0.comp.i17.type=betline&bl.i13.line=2%2C3%2C2%2C3%2C2&pt.i1.comp.i22.symbol=SYM9&bl.i24.reelset=ALL&bl.i0.coins=20&bl.i2.reelset=ALL&pt.i0.comp.i10.n=4&pt.i1.comp.i6.multi=8&bl.i37.id=37&pt.i1.comp.i19.symbol=SYM8&pt.i0.comp.i22.freespins=0&bl.i26.coins=0&bl.i27.reelset=ALL&pt.i0.comp.i20.symbol=SYM8&bl.i29.line=1%2C3%2C1%2C3%2C1&pt.i0.comp.i15.freespins=0&bl.i23.line=0%2C0%2C3%2C0%2C0&bl.i26.id=26&pt.i0.comp.i0.n=3&pt.i1.comp.i21.multi=3&pt.i0.comp.i0.type=betline&pt.i1.comp.i0.multi=0&g4mode=false&pt.i1.comp.i8.n=5&bl.i30.id=30&pt.i0.comp.i25.multi=8&bl.i25.line=1%2C1%2C3%2C1%2C1&pt.i0.comp.i16.symbol=SYM7&pt.i1.comp.i21.freespins=0&pt.i0.comp.i1.multi=0&pt.i0.comp.i27.n=3&pt.i1.comp.i9.type=betline&pt.i1.comp.i24.multi=3&pt.i1.comp.i23.type=betline&pt.i1.comp.i26.n=5&bl.i18.id=18&pt.i1.comp.i17.multi=20&pt.i0.comp.i18.multi=4&bl.i5.line=2%2C1%2C0%2C1%2C2&bl.i28.coins=0&pt.i0.comp.i9.n=3&bl.i27.line=2%2C0%2C2%2C0%2C2&pt.i1.comp.i21.type=betline&bl.i7.line=1%2C2%2C3%2C2%2C1&pt.i1.comp.i18.type=betline&pt.i0.comp.i10.symbol=SYM5&pt.i0.comp.i15.n=3&bl.i36.coins=0&bl.i30.line=0%2C1%2C1%2C1%2C0&pt.i0.comp.i21.symbol=SYM9&bl.i7.reelset=ALL&pt.i1.comp.i15.n=3&isJackpotWin=false&pt.i1.comp.i20.freespins=0&pt.i1.comp.i7.type=betline&pt.i0.comp.i10.freespins=0&pt.i0.comp.i20.multi=20&pt.i0.comp.i17.multi=20&bl.i29.coins=0&bl.i31.reelset=ALL&pt.i1.comp.i25.type=betline&pt.i1.comp.i9.n=3&bl.i9.line=2%2C1%2C2%2C1%2C2&pt.i0.comp.i2.multi=0&pt.i0.comp.i0.freespins=0&pt.i1.comp.i25.multi=8&bl.i35.coins=0&pt.i1.comp.i16.freespins=0&pt.i1.comp.i5.type=betline&bl.i25.reelset=ALL&pt.i1.comp.i24.symbol=SYM10&pt.i1.comp.i13.symbol=SYM6&pt.i1.comp.i17.symbol=SYM7&pt.i0.comp.i16.n=4&bl.i13.reelset=ALL&bl.i0.id=0&pt.i1.comp.i16.n=4&pt.i0.comp.i5.symbol=SYM3&bl.i15.line=2%2C2%2C1%2C2%2C2&pt.i1.comp.i7.symbol=SYM4&bl.i19.id=19&bl.i37.line=0%2C3%2C0%2C3%2C0&pt.i0.comp.i1.symbol=SYM1&bl.i9.id=9&bl.i17.line=2%2C2%2C3%2C2%2C2&pt.i1.comp.i9.freespins=0&bl.i37.coins=0&playercurrency=%26%23x20AC%3B&bl.i28.id=28&bl.i19.reelset=ALL&pt.i0.comp.i25.n=4&pt.i0.comp.i9.freespins=0&bl.i38.reelset=ALL&credit=${balanceInCents}&pt.i0.comp.i5.type=betline&pt.i0.comp.i11.freespins=0&pt.i0.comp.i26.multi=15&pt.i0.comp.i25.type=betline&bl.i35.line=1%2C0%2C0%2C0%2C1&bl.i1.reelset=ALL&pt.i1.comp.i18.symbol=SYM8&pt.i1.comp.i12.symbol=SYM6&pt.i0.comp.i13.freespins=0&pt.i1.comp.i15.type=betline&pt.i0.comp.i26.freespins=0&pt.i1.comp.i13.type=betline&pt.i1.comp.i1.multi=0&pt.i1.comp.i8.freespins=0&pt.i0.comp.i13.n=4&pt.i1.comp.i17.n=5&pt.i0.comp.i23.type=betline&bl.i17.id=17&pt.i1.comp.i17.freespins=0&pt.i1.comp.i26.multi=15&pt.i1.comp.i0.type=betline&pt.i1.comp.i1.symbol=SYM1&pt.i0.comp.i25.freespins=0&pt.i0.comp.i26.n=5&pt.i0.comp.i27.symbol=SYM0&pt.i0.comp.i23.multi=15&bl.i2.line=0%2C0%2C0%2C0%2C0&bl.i38.coins=0&bl.i29.id=29&pt.i1.comp.i18.freespins=0&pt.i0.comp.i14.n=5&pt.i0.comp.i0.multi=0&bl.i6.reelset=ALL&pt.i0.comp.i19.multi=10&bl.i20.line=3%2C3%2C0%2C3%2C3&pt.i1.comp.i18.n=3&bl.i20.reelset=ALL&pt.i0.comp.i12.freespins=0&pt.i0.comp.i24.multi=3&pt.i0.comp.i19.symbol=SYM8&bl.i6.coins=0&pt.i0.comp.i15.type=betline&pt.i0.comp.i23.freespins=0&pt.i0.comp.i4.multi=30&pt.i0.comp.i15.symbol=SYM7&pt.i1.comp.i14.multi=30&pt.i0.comp.i22.multi=8&bl.i21.id=21&pt.i1.comp.i19.type=betline&pt.i0.comp.i11.symbol=SYM5&bl.i23.reelset=ALL&bl.i33.coins=0&bl.i0.reelset=ALL&bl.i20.coins=0&pt.i0.comp.i16.freespins=0&pt.i1.comp.i6.freespins=0&pt.i1.comp.i22.n=4&bl.i10.id=10&pt.i0.comp.i4.freespins=0&pt.i1.comp.i25.symbol=SYM10&bl.i3.reelset=ALL&bl.i26.reelset=ALL&bl.i24.line=0%2C0%2C2%2C0%2C0&pt.i1.comp.i24.type=betline&pt.i0.comp.i19.n=4&pt.i0.comp.i2.symbol=SYM1&pt.i0.comp.i20.type=betline&pt.i0.comp.i6.symbol=SYM4&pt.i1.comp.i11.n=5&pt.i0.comp.i5.n=5&pt.i1.comp.i2.symbol=SYM1&pt.i0.comp.i3.type=betline&pt.i1.comp.i19.multi=10&bl.i28.line=0%2C2%2C0%2C2%2C0&pt.i1.comp.i6.symbol=SYM4&pt.i0.comp.i27.multi=0&pt.i0.comp.i9.multi=5&bl.i12.coins=0&pt.i0.comp.i22.symbol=SYM9&pt.i0.comp.i26.symbol=SYM10&pt.i1.comp.i19.freespins=0&pt.i0.comp.i14.freespins=0&pt.i0.comp.i21.freespins=0&pt.i1.comp.i4.freespins=0&bl.i37.reelset=ALL&pt.i1.comp.i12.type=betline&pt.i1.comp.i21.symbol=SYM9&pt.i1.comp.i23.n=5&bl.i8.id=8&pt.i0.comp.i16.multi=10&bl.i33.id=33&bl.i6.line=0%2C1%2C2%2C1%2C0&bl.i22.id=22&bl.i12.line=1%2C2%2C1%2C2%2C1&pt.i1.comp.i9.multi=5&bl.i29.reelset=ALL&pt.i0.comp.i19.type=betline&pt.i0.comp.i6.freespins=0&pt.i1.comp.i2.multi=0&pt.i0.comp.i6.n=3&pt.i1.comp.i12.n=3&pt.i1.comp.i3.type=betline&pt.i1.comp.i10.freespins=0&bl.i27.coins=0&bl.i34.reelset=ALL&bl.i30.reelset=ALL&pt.i1.comp.i20.multi=20&pt.i0.comp.i27.freespins=8&pt.i1.comp.i24.n=3&bl.i33.line=3%2C2%2C2%2C2%2C3&pt.i1.comp.i2.type=betline&pt.i0.comp.i2.freespins=0&pt.i0.comp.i7.n=4&bl.i31.id=31&bl.i32.line=2%2C3%2C3%2C3%2C2&pt.i0.comp.i11.multi=40&pt.i1.comp.i14.symbol=SYM6&pt.i0.comp.i7.type=betline&bl.i19.line=0%2C0%2C1%2C0%2C0&bl.i12.reelset=ALL&pt.i0.comp.i17.n=5&bl.i6.id=6&pt.i1.comp.i13.n=4&pt.i0.comp.i8.freespins=0&bl.i20.id=20&pt.i1.comp.i4.multi=30&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&pt.i0.comp.i12.type=betline&pt.i0.comp.i14.multi=30&pt.i1.comp.i7.multi=25&bl.i33.reelset=ALL&bl.i19.coins=0&bl.i7.id=7&bl.i18.reelset=ALL&pt.i1.comp.i11.type=betline&pt.i0.comp.i6.multi=8&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=0&bl.i32.id=32&pt.i1.comp.i5.symbol=SYM3&pt.i0.comp.i18.type=betline&pt.i0.comp.i23.symbol=SYM9&playforfun=false&pt.i1.comp.i25.n=4&pt.i0.comp.i2.type=betline&pt.i1.comp.i20.type=betline&bl.i25.coins=0&pt.i1.comp.i22.multi=8&pt.i0.comp.i8.n=5&bl.i31.coins=0&pt.i1.comp.i22.freespins=0&pt.i0.comp.i11.type=betline&pt.i0.comp.i18.n=3&pt.i1.comp.i14.n=5&pt.i1.comp.i16.multi=10&pt.i1.comp.i15.freespins=0&pt.i0.comp.i27.type=scatter&pt.i0.comp.i7.symbol=SYM4&bl.i15.reelset=ALL&pt.i1.comp.i0.freespins=0&gameServerVersion=1.0.1&bl.i11.line=0%2C1%2C0%2C1%2C0&historybutton=false&bl.i5.id=5&pt.i0.comp.i18.symbol=SYM8&bl.i36.reelset=ALL&pt.i0.comp.i12.multi=5&pt.i1.comp.i14.freespins=0&bl.i3.coins=0&bl.i10.coins=0&pt.i0.comp.i12.symbol=SYM6&pt.i0.comp.i14.symbol=SYM6&pt.i1.comp.i13.freespins=0&pt.i0.comp.i14.type=betline&bl.i30.coins=0&bl.i39.line=0%2C3%2C3%2C3%2C0&pt.i1.comp.i0.n=3&pt.i1.comp.i26.symbol=SYM10&pt.i0.comp.i7.multi=25&jackpotcurrency=%26%23x20AC%3B&bl.i35.id=35&bl.i16.coins=0&bl.i9.coins=0&bl.i24.id=24&pt.i1.comp.i11.multi=40&pt.i0.comp.i1.n=4&bl.i22.coins=0&pt.i0.comp.i20.n=5&pt.i1.comp.i3.symbol=SYM3&pt.i1.comp.i23.freespins=0&bl.i13.id=13&bl.i36.id=36&pt.i0.comp.i25.symbol=SYM10&pt.i0.comp.i26.type=betline&pt.i0.comp.i9.type=betline&pt.i1.comp.i16.type=betline&pt.i1.comp.i20.symbol=SYM8&bl.i10.reelset=ALL&pt.i1.comp.i12.multi=5&pt.i1.comp.i1.n=4&pt.i1.comp.i11.freespins=0&pt.i0.comp.i9.symbol=SYM5&bl.i23.coins=0&bl.i11.coins=0&bl.i22.reelset=ALL&pt.i0.comp.i16.type=betline&bl.i3.line=3%2C3%2C3%2C3%2C3&bl.i4.reelset=ALL&bl.i4.coins=0&pt.i0.comp.i2.n=5&bl.i18.line=1%2C1%2C2%2C1%2C1&bl.i34.id=34&pt.i0.comp.i19.freespins=0&pt.i1.comp.i14.type=betline&bl.i11.id=11&pt.i0.comp.i6.type=betline&pt.i1.comp.i2.freespins=0&pt.i1.comp.i25.freespins=0&bl.i9.reelset=ALL&bl.i17.coins=0&pt.i1.comp.i10.multi=20&pt.i1.comp.i10.symbol=SYM5&bl.i11.reelset=ALL&bl.i16.line=3%2C3%2C2%2C3%2C3&pt.i1.comp.i2.n=5&pt.i1.comp.i20.n=5&pt.i1.comp.i24.freespins=0&bl.i21.line=3%2C3%2C1%2C3%2C3&pt.i0.comp.i4.type=betline&bl.i21.coins=0&bl.i28.reelset=ALL&pt.i1.comp.i26.freespins=0&pt.i1.comp.i1.type=betline&bl.i1.line=2%2C2%2C2%2C2%2C2&pt.i0.comp.i20.freespins=0&bl.i16.reelset=ALL&pt.i0.comp.i3.n=3&pt.i1.comp.i6.type=betline&pt.i1.comp.i4.symbol=SYM3&bl.i8.line=3%2C2%2C3%2C2%2C3&pt.i0.comp.i24.symbol=SYM10&bl.i35.reelset=ALL&bl.i8.coins=0&bl.i23.id=23&bl.i15.coins=0&bl.i36.line=3%2C0%2C3%2C0%2C3&pt.i1.comp.i3.n=3&pt.i1.comp.i21.n=3&pt.i0.comp.i18.freespins=0&bl.i12.id=12&pt.i1.comp.i15.symbol=SYM7&pt.i1.comp.i3.freespins=0&bl.i4.id=4&bl.i7.coins=0&pt.i1.comp.i9.symbol=SYM5&pt.i0.comp.i3.symbol=SYM3&pt.i0.comp.i24.type=betline&bl.i14.coins=0&pt.i1.comp.i12.freespins=0&pt.i0.comp.i4.n=4&pt.i1.comp.i10.n=4&bl.i26.line=3%2C1%2C3%2C1%2C3`;
                    Log.info(`[DEBUG] Paytable response length: ${result_tmp[0].length}, snippet: ${result_tmp[0].substring(0, 100)}`);
                    break;

                case 'spin':
                    Log.info(`[DEBUG] Spin action started for action: ${aid}, postData: ${JSON.stringify(postData)}`);
                    const linesId = [
                        [2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [1, 1, 1, 1, 1], [4, 4, 4, 4, 4], [4, 3, 2, 3, 4],
                        [3, 2, 1, 2, 3], [1, 2, 3, 2, 1], [2, 3, 4, 3, 2], [4, 3, 4, 3, 4], [3, 2, 3, 2, 3],
                        [2, 1, 2, 1, 2], [1, 2, 1, 2, 1], [2, 3, 2, 3, 2], [3, 4, 3, 4, 3], [2, 2, 1, 2, 2],
                        [3, 3, 2, 3, 3], [4, 4, 3, 4, 4], [3, 3, 4, 3, 3], [2, 2, 3, 2, 2], [1, 1, 2, 1, 1],
                        [4, 4, 1, 4, 4], [4, 4, 2, 4, 4], [3, 3, 1, 3, 3], [1, 1, 4, 1, 1], [1, 1, 3, 1, 1],
                        [2, 2, 4, 2, 2], [4, 2, 4, 2, 4], [3, 1, 3, 1, 3], [1, 3, 1, 3, 1], [2, 4, 2, 4, 2],
                        [1, 2, 2, 2, 1], [2, 3, 3, 3, 2], [3, 4, 4, 4, 3], [4, 3, 3, 3, 4], [3, 2, 2, 2, 3],
                        [2, 1, 1, 1, 2], [4, 1, 4, 1, 4], [1, 4, 1, 4, 1], [4, 1, 1, 1, 4], [1, 4, 4, 4, 1]
                    ];
                    Log.info(`[DEBUG] Setting up lines and denom`);
                    const lines = 20;
                    slotSettings.CurrentDenom = postData['bet_denomination'];
                    slotSettings.CurrentDenomination = postData['bet_denomination'];
                    Log.info(`[DEBUG] CurrentDenom set to: ${slotSettings.CurrentDenom}`);

                    let betline = 0;
                    let allbet = 0;
                    let bonusMpl = 1;
                    Log.info(`[DEBUG] Initial variables set`);

                    Log.info(`[DEBUG] Checking slotEvent: ${postData['slotEvent']}`);
                    if (postData['slotEvent'] !== 'freespin') {
                        Log.info(`[DEBUG] Not freespin, setting betline`);
                        betline = parseFloat(postData['bet_betlevel']);
                        allbet = betline * lines;
                        Log.info(`[DEBUG] betline: ${betline}, allbet: ${allbet}`);
                        slotSettings.UpdateJackpots(allbet);
                        if (!postData['slotEvent']) {
                            postData['slotEvent'] = 'bet';
                        }
                        Log.info(`[DEBUG] Setting balance - allbet: ${allbet}`);
                        slotSettings.SetBalance(-1 * allbet, postData['slotEvent']);
                        const bankSum = allbet / 100 * slotSettings.GetPercent();
                        Log.info(`[DEBUG] bankSum: ${bankSum}`);
                        slotSettings.SetBank((postData['slotEvent'] ? postData['slotEvent'] : ''), bankSum, postData['slotEvent']);
                        slotSettings.UpdateJackpots(allbet);

                        Log.info(`[DEBUG] Setting game data for regular spin`);
                        slotSettings.SetGameData('GoldenGrimoireNETBonusWin', 0);
                        slotSettings.SetGameData('GoldenGrimoireNETFreeGames', 0);
                        slotSettings.SetGameData('GoldenGrimoireNETCurrentFreeGame', 0);
                        slotSettings.SetGameData('GoldenGrimoireNETTotalWin', 0);
                        slotSettings.SetGameData('GoldenGrimoireNETBet', betline);
                        slotSettings.SetGameData('GoldenGrimoireNETDenom', postData['bet_denomination']);
                        slotSettings.SetGameData('GoldenGrimoireNETFreeBalance', Math.floor(slotSettings.GetBalance() * 100) / 100 * 100);
                        bonusMpl = 1;
                    } else {
                        Log.info(`[DEBUG] Freespin detected`);
                        postData['bet_denomination'] = slotSettings.GetGameData('GoldenGrimoireNETDenom');
                        slotSettings.CurrentDenom = postData['bet_denomination'];
                        slotSettings.CurrentDenomination = postData['bet_denomination'];
                        betline = parseFloat(slotSettings.GetGameData('GoldenGrimoireNETBet'));
                        allbet = betline * lines;
                        Log.info(`[DEBUG] Freespin betline: ${betline}, allbet: ${allbet}`);
                        slotSettings.SetGameData('GoldenGrimoireNETCurrentFreeGame', slotSettings.GetGameData('GoldenGrimoireNETCurrentFreeGame') + 1);
                        bonusMpl = slotSettings.slotFreeMpl;
                    }

                    Log.info(`[DEBUG] Calling GetSpinSettings with betline: ${betline}, lines: ${lines}, slotEvent: ${postData['slotEvent']}`);
                    const winTypeTmp = slotSettings.GetSpinSettings(betline, lines.toString(), postData['slotEvent']);
                    Log.info(`[DEBUG] GetSpinSettings returned: ${JSON.stringify(winTypeTmp)}`);
                    let winType = winTypeTmp[0];
                    let spinWinLimit = winTypeTmp[1];
                    Log.info(`[DEBUG] winType: ${winType}, spinWinLimit: ${spinWinLimit}`);

                    balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);
                    Log.info(`[DEBUG] balanceInCents: ${balanceInCents}`);
                    if (winType === 'bonus' && (postData['slotEvent'] === 'freespin')) {
                        Log.info(`[DEBUG] Changing winType from bonus to win for freespin`);
                        winType = 'win';
                    }

                    Log.info(`[DEBUG] Initializing spin variables`);
                    let totalWin = 0;
                    let reels: any = {};
                    let lineWins: string[] = [];
                    let cWins: number[] = new Array(85).fill(0);
                    let wild = ['1'];
                    let scatter = '0';
                    Log.info(`[DEBUG] Spin variables initialized`);

                    let scattersWin = 0;
                    let scattersStr = '';
                    let scattersCount = 0;
                    let scPos: string[] = [];

                    let overlaySym = '';
                    let overlayCnt = 0;

                    Log.info(`[DEBUG] Starting spin loop, max iterations: 2000`);
                    for (let i = 0; i <= 2000; i++) {
                        Log.info(`[DEBUG] Spin iteration ${i} starting`);
                        totalWin = 0;
                        lineWins = [];
                        cWins = new Array(85).fill(0);
                        wild = ['1'];
                        scatter = '0';
                        Log.info(`[DEBUG] Calling GetReelStrips with winType: ${winType}, slotEvent: ${postData['slotEvent']}`);
                        reels = slotSettings.GetReelStrips(winType, postData['slotEvent']);
                        Log.info(`[DEBUG] GetReelStrips returned reels: ${JSON.stringify(reels)}`);

                        const overlayRandomSymArr = [1, 6, 7, 8, 9, 10];
                        const overlayRandomSym = overlayRandomSymArr[Math.floor(Math.random() * overlayRandomSymArr.length)];

                        for (let r = 1; r <= 5; r++) {
                            for (let p = 0; p <= 3; p++) {
                                if (reels['reel' + r][p] === 13) {
                                    overlaySym += `&rs.i0.r.i${r - 1}.overlay.i${overlayCnt}.pos=59&rs.i0.r.i${r - 1}.overlay.i${overlayCnt}.row=${p}&rs.i0.r.i${r - 1}.overlay.i${overlayCnt}.with=SYM${overlayRandomSym}`;
                                    reels['reel' + r][p] = overlayRandomSym;
                                    if (reels['reel1'][p] === overlayRandomSym) {
                                        for (let rr = r; rr >= 1; rr--) {
                                            reels['reel' + rr][p] = overlayRandomSym;
                                        }
                                    }
                                    overlayCnt++;
                                }
                            }
                        }

                        let winLineCount = 0;
                        for (let k = 0; k < lines; k++) {
                            let tmpStringWin = '';
                            for (let j = 0; j < slotSettings.SymbolGame.length; j++) {
                                const csym = slotSettings.SymbolGame[j];
                                if (parseInt(csym) === parseInt(scatter) || !slotSettings.Paytable['SYM_' + csym]) {
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
                        scPos = [];

                        for (let r = 1; r <= 5; r++) {
                            for (let p = 0; p <= 3; p++) {
                                if (reels['reel' + r][p] === parseInt(scatter)) {
                                    scattersCount++;
                                    scPos.push(`&ws.i0.pos.i${r - 1}=${r - 1}%2C${p}`);
                                }
                            }
                        }

                        if (scattersCount >= 3) {
                            const freeCounts: Record<number, number> = { 3: 10, 4: 15, 5: 20 };
                            const count = freeCounts[scattersCount] || 10;

                            scattersStr = `&ws.i0.types.i0.freespins=${count}&ws.i0.reelset=basic&ws.i0.betline=null&ws.i0.types.i0.wintype=freespins&ws.i0.direction=none${scPos.join('')}`;
                        }

                        totalWin += scattersWin;

                        if (i > 1000) winType = 'none';
                        if (i > 1500) return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"Bad Reel Strip"}';

                        const maxWin = slotSettings.MaxWin;
                        Log.info(`[DEBUG] Checking win conditions. totalWin: ${totalWin}, maxWin: ${maxWin}, CurrentDenom: ${slotSettings.CurrentDenom}`);
                        const denomWin = totalWin * slotSettings.CurrentDenom;
                        Log.info(`[DEBUG] denomWin: ${denomWin}, maxWin: ${maxWin}, condition: ${denomWin <= maxWin}`);
                        if (denomWin <= maxWin) {
                            const minWin = slotSettings.GetRandomPay();
                            Log.info(`[DEBUG] minWin: ${minWin}, allbet: ${allbet}, minWin*allbet: ${minWin * allbet}`);

                            let breakout = false;
                            if (slotSettings.increaseRTP && winType === 'win' && totalWin < (minWin * allbet)) {
                                Log.info(`[DEBUG] RTP condition: increaseRTP=${slotSettings.increaseRTP}, winType=${winType}, totalWin=${totalWin}, minWin*allbet=${minWin * allbet}`);
                                Log.info(`[DEBUG] RTP condition not met, continuing`);
                                // continue
                            } else if (scattersCount >= 3 && winType !== 'bonus') {
                                Log.info(`[DEBUG] Scatter condition: scattersCount=${scattersCount}, winType=${winType}`);
                                Log.info(`[DEBUG] Scatter condition not met, continuing`);
                                // continue
                            } else if (totalWin <= spinWinLimit && winType === 'bonus') {
                                const cBank = slotSettings.GetBank(postData['slotEvent'] || '');
                                Log.info(`[DEBUG] Bonus win check: totalWin: ${totalWin}, spinWinLimit: ${spinWinLimit}, cBank: ${cBank}`);
                                if (cBank < spinWinLimit) {
                                    spinWinLimit = cBank;
                                    Log.info(`[DEBUG] Adjusted spinWinLimit to cBank: ${spinWinLimit}`);
                                } else {
                                    breakout = true;
                                    Log.info(`[DEBUG] Bonus condition met, breaking`);
                                }
                            } else if (totalWin > 0 && totalWin <= spinWinLimit && winType === 'win') {
                                const cBank = slotSettings.GetBank(postData['slotEvent'] || '');
                                Log.info(`[DEBUG] Regular win check: totalWin: ${totalWin}, spinWinLimit: ${spinWinLimit}, cBank: ${cBank}`);
                                if (cBank < spinWinLimit) {
                                    spinWinLimit = cBank;
                                    Log.info(`[DEBUG] Adjusted spinWinLimit to cBank: ${spinWinLimit}`);
                                } else {
                                    breakout = true;
                                    Log.info(`[DEBUG] Regular win condition met, breaking`);
                                }
                            } else if (totalWin === 0 && winType === 'none') {
                                Log.info(`[DEBUG] No win condition met, breaking`);
                                breakout = true;
                            } else {
                                Log.info(`[DEBUG] No breakout condition met, continuing loop`);
                            }

                            if (breakout) {
                                Log.info(`[DEBUG] Breaking out of spin loop`);
                                break;
                            }
                        } else {
                            Log.info(`[DEBUG] Max win exceeded, continuing loop`);
                        }
                    }

                    Log.info(`[DEBUG] Spin loop completed. totalWin: ${totalWin}`);
                    if (totalWin > 0) {
                        Log.info(`[DEBUG] Setting bank and balance for win`);
                        slotSettings.SetBank(postData['slotEvent'] || '', -1 * totalWin);
                        slotSettings.SetBalance(totalWin);
                    }
                    const reportWin = totalWin;
                    Log.info(`[DEBUG] reportWin: ${reportWin}`);

                    Log.info(`[DEBUG] Building reel strings`);
                    let curReelsStr = `&rs.i0.r.i0.syms=SYM${reels['reel1'][0]}%2CSYM${reels['reel1'][1]}%2CSYM${reels['reel1'][2]}%2CSYM${reels['reel1'][3]}`;
                    curReelsStr += `&rs.i0.r.i1.syms=SYM${reels['reel2'][0]}%2CSYM${reels['reel2'][1]}%2CSYM${reels['reel2'][2]}%2CSYM${reels['reel2'][3]}`;
                    curReelsStr += `&rs.i0.r.i2.syms=SYM${reels['reel3'][0]}%2CSYM${reels['reel3'][1]}%2CSYM${reels['reel3'][2]}%2CSYM${reels['reel3'][3]}`;
                    curReelsStr += `&rs.i0.r.i3.syms=SYM${reels['reel4'][0]}%2CSYM${reels['reel4'][1]}%2CSYM${reels['reel4'][2]}%2CSYM${reels['reel4'][3]}`;
                    curReelsStr += `&rs.i0.r.i4.syms=SYM${reels['reel5'][0]}%2CSYM${reels['reel5'][1]}%2CSYM${reels['reel5'][2]}%2CSYM${reels['reel5'][3]}`;
                    curReelsStr += `&rs.i0.r.i0.pos=24&rs.i0.r.i1.pos=24&rs.i0.r.i2.pos=24&rs.i0.r.i3.pos=24&rs.i0.r.i4.pos=24`;
                    curReelsStr += `&rs.i0.r.i0.hold=false&rs.i0.r.i1.hold=false&rs.i0.r.i2.hold=false&rs.i0.r.i3.hold=false&rs.i0.r.i4.hold=false`;
                    Log.info(`[DEBUG] curReelsStr length: ${curReelsStr.length}`);
                    
                    Log.info(`[DEBUG] Building win string`);
                    let winString = `&totalwin.coins=${totalWin}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&credit=${Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100)}`;
                    Log.info(`[DEBUG] winString: ${winString.substring(0, 100)}...`);
                    
                    if (postData['slotEvent'] === 'freespin') {
                        winString += `&freespins.left=${slotSettings.GetGameData('GoldenGrimoireNETFreeGames') - slotSettings.GetGameData('GoldenGrimoireNETCurrentFreeGame')}&freespins.total=${slotSettings.GetGameData('GoldenGrimoireNETFreeGames')}&freespins.win.cents=${totalWin * slotSettings.CurrentDenomination * 100}&freespins.win.coins=${totalWin}&freespins.betlevel=${betline}&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=${slotSettings.GetGameData('GoldenGrimoireNETFreeBalance') + totalWin * slotSettings.CurrentDenomination * 100}&freespins.totalwin.coins=${slotSettings.GetGameData('GoldenGrimoireNETFreeBalance') / 100 + totalWin}&freespins.denomination=${slotSettings.CurrentDenomination * 100}`;
                        
                        slotSettings.SetGameData('GoldenGrimoireNETFreeBalance', slotSettings.GetGameData('GoldenGrimoireNETFreeBalance') + totalWin * slotSettings.CurrentDenomination * 100);
                        
                        if (slotSettings.GetGameData('GoldenGrimoireNETFreeGames') <= slotSettings.GetGameData('GoldenGrimoireNETCurrentFreeGame')) {
                            winString += `&gameover=true&nextaction=spin`;
                        } else {
                            winString += `&gameover=false&nextaction=freespin`;
                        }
                    } else {
                        if (scattersCount >= 3) {
                            slotSettings.SetGameData('GoldenGrimoireNETFreeGames', 10);
                            slotSettings.SetGameData('GoldenGrimoireNETCurrentFreeGame', 0);
                            winString += `&freespins.win.cents=${totalWin * slotSettings.CurrentDenomination * 100}&freespins.win.coins=${totalWin}&freespins.initial=10&freespins.total=10&freespins.left=10&freespins.denomination=${slotSettings.CurrentDenomination * 100}&gamestate.stack=basic%2Cfreespin&gamestate.current=freespin&nextaction=freespin`;
                        } else {
                            winString += `&gamestate.current=basic&nextaction=spin`;
                        }
                    }

                    Log.info(`[DEBUG] Building final result_tmp[0]`);
                    result_tmp[0] = `bl.i17.reelset=ALL&bl.i15.id=15&bl.i0.reelset=ALL&bl.i0.coins=${betline * 20}&gameServerVersion=1.0.1&g4mode=false&multiplier=1&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&denomination.all=${slotSettings.Denominations.join('%2C')}&denomination.standard=${slotSettings.CurrentDenomination * 100}&playercurrencyiso=${slotSettings.slotCurrency}&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&casinoID=netent&gamesoundurl=&staticsharedurl=&historybutton=false&gameover=false&gameEventSetters.enabled=false&nearwinallowed=true&wavecount=1&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000${winString}${curReelsStr}${lineWins.join('')}${scattersStr}${overlaySym}`;
                    Log.info(`[DEBUG] result_tmp[0] length: ${result_tmp[0].length}`);
                    Log.info(`[DEBUG] Spin case completed successfully`);
                    break;

                default:
                    return JSON.stringify({
                        response: '{"responseEvent":"error","responseType":"' + aid + '","serverResponse":"Invalid action"}',
                        state: slotSettings.getState()
                    });
            }

            const finalResponse = result_tmp[0] || '';
            
            return JSON.stringify({
                response: finalResponse,
                state: slotSettings.getState()
            });

        } catch (e) {
            Log.info('Error in Server.get: ' + e);
            return JSON.stringify({
                response: '{"responseEvent":"error","responseType":"' + (postData?.slotEvent || '') + '","serverResponse":"' + e + '"}',
                state: slotSettings.getState()
            });
        }
    }
}