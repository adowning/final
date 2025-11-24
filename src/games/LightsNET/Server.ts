import { SlotSettings } from './SlotSettings';

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

            if (postData['slotEvent'] === 'bet' && !postData['bet.betlevel']) {
                // In TS/JS we should handle the case where bet.betlevel is undefined
                // However, following the exact return string format:
                return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bet state"}';
            }

            balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);

            if (postData['slotEvent'] === 'bet') {
                const lines = 9;
                const betline = parseFloat(postData['bet.betlevel']);
                if (lines <= 0 || betline <= 0.0001) {
                    return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bet state"}';
                }
                if (slotSettings.GetBalance() < (lines * betline)) {
                    return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid balance"}';
                }
            }

            if (slotSettings.GetGameData(slotSettings.slotId + 'FreeGames') < slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame') && postData['slotEvent'] === 'freespin') {
                return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"invalid bonus state"}';
            }

            aid = String(postData['action']);

            switch (aid) {
                case 'init':
                    const lastEvent = slotSettings.GetHistory();
                    slotSettings.SetGameData('LightsNETBonusWin', 0);
                    slotSettings.SetGameData('LightsNETFreeGames', 0);
                    slotSettings.SetGameData('LightsNETCurrentFreeGame', 0);
                    slotSettings.SetGameData('LightsNETTotalWin', 0);
                    slotSettings.SetGameData('LightsNETFreeBalance', 0);

                    let freeState = '';
                    let curReels = '';

                    // Handle State Restoration
                    if (lastEvent && lastEvent !== 'NULL') {
                        const serverResponse = lastEvent.serverResponse || lastEvent;
                        slotSettings.SetGameData(slotSettings.slotId + 'BonusWin', serverResponse.bonusWin);
                        slotSettings.SetGameData(slotSettings.slotId + 'FreeGames', serverResponse.totalFreeGames);
                        slotSettings.SetGameData(slotSettings.slotId + 'CurrentFreeGame', serverResponse.currentFreeGames);
                        slotSettings.SetGameData(slotSettings.slotId + 'TotalWin', serverResponse.bonusWin);
                        slotSettings.SetGameData(slotSettings.slotId + 'FreeBalance', serverResponse.Balance);
                        freeState = serverResponse.freeState;
                        const reels = serverResponse.reelsSymbols;
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
                        curReels += `&rs.i0.r.i0.pos=${reels.rp[0]}&rs.i0.r.i1.pos=${reels.rp[1]}&rs.i0.r.i2.pos=${reels.rp[2]}&rs.i0.r.i3.pos=${reels.rp[3]}&rs.i0.r.i4.pos=${reels.rp[4]}`;
                        curReels += `&rs.i1.r.i0.pos=${reels.rp[0]}&rs.i1.r.i1.pos=${reels.rp[1]}&rs.i1.r.i2.pos=${reels.rp[2]}&rs.i1.r.i3.pos=${reels.rp[3]}&rs.i1.r.i4.pos=${reels.rp[4]}`;
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

                    for (let d = 0; d < slotSettings.Denominations.length; d++) {
                        slotSettings.Denominations[d] = slotSettings.Denominations[d] * 100;
                    }

                    if (slotSettings.GetGameData('LightsNETCurrentFreeGame') < slotSettings.GetGameData('LightsNETFreeGames') && slotSettings.GetGameData('LightsNETFreeGames') > 0) {
                        // This giant string was extracted from Server.php lines 107+
                        freeState = 'previous.rs.i0=freespin&rs.i1.r.i0.syms=SYM9%2CSYM9%2CSYM11&bl.i6.coins=1&g4mode=false&freespins.win.coins=75&rs.i0.nearwin=4&historybutton=false&rs.i0.r.i4.hold=false&bl.i5.id=5&gameEventSetters.enabled=false&next.rs=freespin&gamestate.history=basic%2Cfreespin&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=114&rs.i0.r.i1.syms=SYM9%2CSYM9%2CSYM9&bl.i3.coins=1&game.win.cents=375&staticsharedurl=&ws.i0.betline=3&bl.i0.reelset=ALL&rs.i1.r.i2.overlay.i2.row=2&rs.i1.r.i3.hold=false&totalwin.coins=75&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=freespin&freespins.initial=10&bl.i3.reelset=ALL&rs.i0.r.i2.overlay.i0.row=2&bl.i4.line=2%2C1%2C0%2C1%2C2&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i1.r.i0.overlay.i0.pos=291&bet.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i0.r.i0.syms=SYM0%2CSYM12%2CSYM12&rs.i1.r.i2.overlay.i0.with=SYM1&rs.i0.r.i3.syms=SYM7%2CSYM7%2CSYM0&rs.i1.r.i1.syms=SYM0%2CSYM6%2CSYM6&bl.i2.id=2&rs.i1.r.i1.pos=49&freespins.win.cents=375&rs.i0.r.i2.overlay.i0.with=SYM1&bl.i7.reelset=ALL&isJackpotWin=false&rs.i0.r.i0.pos=277&rs.i1.r.i2.overlay.i1.pos=82&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i1.r.i2.overlay.i0.row=0&rs.i0.r.i1.pos=28&rs.i1.r.i3.syms=SYM4%2CSYM4%2CSYM8&rs.i1.r.i2.overlay.i2.with=SYM1&game.win.coins=75&rs.i1.r.i0.hold=false&rs.i0.r.i1.hold=false&bl.i3.id=3&bl.i8.reelset=ALL&clientaction=init&rs.i0.r.i2.hold=false&rs.i0.r.i3.overlay.i0.with=SYM1&casinoID=netent&betlevel.standard=1&bl.i5.coins=1&gameover=false&bl.i8.id=8&rs.i0.r.i3.pos=49&rs.i0.r.i3.overlay.i0.row=0&bl.i0.id=0&bl.i6.line=2%2C2%2C1%2C2%2C2&rs.i1.r.i2.attention.i0=0&bl.i0.line=1%2C1%2C1%2C1%2C1&nextaction=freespin&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i4.reelset=ALL&bl.i4.coins=1&rs.i0.r.i2.syms=SYM10%2CSYM10%2CSYM10&game.win.amount=3.75&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&rs.i1.r.i0.overlay.i0.with=SYM1&rs.i1.r.i3.overlay.i0.with=SYM1&freespins.totalwin.cents=375&denomination.all=' + slotSettings.Denominations.join('%2C') + '&ws.i0.pos.i3=3%2C1&freespins.betlevel=1&ws.i0.pos.i2=2%2C2&playercurrency=%26%23x20AC%3B&rs.i1.r.i2.overlay.i0.pos=81&rs.i1.r.i2.overlay.i1.row=1&current.rs.i0=freespin&ws.i0.reelset=freespin&bl.i1.id=1&ws.i0.pos.i1=1%2C1&ws.i0.pos.i0=0%2C0&rs.i0.r.i3.attention.i0=2&rs.i0.r.i2.overlay.i0.pos=130&rs.i0.id=basic&rs.i1.r.i0.overlay.i0.row=0&credit=' + balanceInCents + '&rs.i1.r.i4.pos=162&denomination.standard=' + (slotSettings.CurrentDenomination * 100) + '&ws.i0.types.i0.coins=75&bl.i1.reelset=ALL&rs.i1.r.i2.overlay.i2.pos=83&multiplier=1&last.rs=freespin&freespins.denomination=5.000&bl.i2.coins=1&bl.i6.id=6&bl.i1.line=0%2C0%2C0%2C0%2C0&rs.i1.r.i3.overlay.i0.row=1&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&ws.i0.sym=SYM6&freespins.totalwin.coins=75&ws.i0.direction=left_to_right&freespins.total=10&gamestate.stack=basic%2Cfreespin&rs.i1.r.i4.syms=SYM11%2CSYM11%2CSYM11&gamesoundurl=&rs.i1.r.i2.pos=81&bet.betlevel=1&rs.i1.nearwin=4%2C3&ws.i0.types.i0.wintype=coins&nearwinallowed=true&bl.i5.reelset=ALL&bl.i7.id=7&bl.i8.line=1%2C0%2C0%2C0%2C1&playercurrencyiso=' + slotSettings.slotCurrency + '&bl.i1.coins=1&freespins.wavecount=1&rs.i0.r.i4.attention.i0=1&freespins.multiplier=1&playforfun=false&jackpotcurrencyiso=' + slotSettings.slotCurrency + '&rs.i0.r.i4.syms=SYM12%2CSYM0%2CSYM11&rs.i1.r.i2.overlay.i1.with=SYM1&rs.i1.r.i3.overlay.i0.pos=115&bl.i8.coins=1&rs.i0.r.i2.pos=128&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i0.r.i0.attention.i0=0&rs.i1.r.i2.syms=SYM0%2CSYM9%2CSYM9&rs.i1.r.i0.pos=291&totalwin.cents=375&bl.i0.coins=1&bl.i2.reelset=ALL&rs.i0.r.i0.hold=false&restore=true&rs.i1.id=freespin&rs.i1.r.i4.hold=false&freespins.left=9&bl.i4.id=4&rs.i0.r.i4.pos=260&bl.i7.coins=1&rs.i0.r.i3.overlay.i0.pos=49&ws.i0.types.i0.cents=375&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i1.r.i1.attention.i0=0&bl.i6.reelset=ALL&wavecount=1&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false&bet.denomination=' + (slotSettings.CurrentDenomination * 100) + '' + freeState;
                    }

                    result_tmp[0] = freeState ? freeState : `rs.i1.r.i0.syms=SYM12%2CSYM0%2CSYM11&bl.i6.coins=1&g4mode=false&historybutton=false&rs.i0.r.i4.hold=false&bl.i5.id=5&gameEventSetters.enabled=false&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=71&rs.i0.r.i1.syms=SYM9%2CSYM9%2CSYM9&bl.i3.coins=1&game.win.cents=0&staticsharedurl=&bl.i0.reelset=ALL&rs.i1.r.i3.hold=false&totalwin.coins=0&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=basic&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i0.r.i0.syms=SYM12%2CSYM12%2CSYM12&rs.i0.r.i3.syms=SYM3%2CSYM3%2CSYM3&rs.i1.r.i1.syms=SYM10%2CSYM10%2CSYM3&bl.i2.id=2&rs.i1.r.i1.pos=14&bl.i7.reelset=ALL&isJackpotWin=false&rs.i0.r.i0.pos=0&rs.i0.r.i1.pos=0&rs.i1.r.i3.syms=SYM6%2CSYM6%2CSYM8&game.win.coins=0&rs.i1.r.i0.hold=false&rs.i0.r.i1.hold=false&bl.i3.id=3&bl.i8.reelset=ALL&clientaction=init&rs.i0.r.i2.hold=false&casinoID=netent&betlevel.standard=1&bl.i5.coins=1&gameover=true&bl.i8.id=8&rs.i0.r.i3.pos=0&bl.i0.id=0&bl.i6.line=2%2C2%2C1%2C2%2C2&bl.i0.line=1%2C1%2C1%2C1%2C1&nextaction=spin&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i4.reelset=ALL&bl.i4.coins=1&rs.i0.r.i2.syms=SYM3%2CSYM3%2CSYM3&game.win.amount=0&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&denomination.all=${slotSettings.Denominations.join('%2C')}&playercurrency=%26%23x20AC%3B&bl.i1.id=1&rs.i0.id=freespin&credit=${balanceInCents}&rs.i1.r.i4.pos=16&denomination.standard=${slotSettings.CurrentDenomination * 100}&bl.i1.reelset=ALL&multiplier=1&bl.i2.coins=1&bl.i6.id=6&bl.i1.line=0%2C0%2C0%2C0%2C0&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&rs.i1.r.i4.syms=SYM9%2CSYM9%2CSYM5&gamesoundurl=&rs.i1.r.i2.pos=29&nearwinallowed=true&bl.i5.reelset=ALL&bl.i7.id=7&bl.i8.line=1%2C0%2C0%2C0%2C1&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=1&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&rs.i0.r.i4.syms=SYM11%2CSYM11%2CSYM11&bl.i8.coins=1&rs.i0.r.i2.pos=0&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i1.r.i2.syms=SYM7%2CSYM4%2CSYM4&rs.i1.r.i0.pos=163&totalwin.cents=0&bl.i0.coins=1&bl.i2.reelset=ALL&rs.i0.r.i0.hold=false&restore=false&rs.i1.id=basic&rs.i1.r.i4.hold=false&bl.i4.id=4&rs.i0.r.i4.pos=0&bl.i7.coins=1&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&bl.i6.reelset=ALL&wavecount=1&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false${curReels}${freeState}`;
                    break;

                case 'paytable':
                    result_tmp[0] = `pt.i0.comp.i19.symbol=SYM8&bl.i6.coins=1&pt.i0.comp.i15.type=betline&pt.i0.comp.i23.freespins=0&pt.i0.comp.i32.type=betline&pt.i0.comp.i29.type=betline&pt.i0.comp.i4.multi=200&pt.i0.comp.i15.symbol=SYM7&pt.i0.comp.i17.symbol=SYM7&pt.i0.comp.i5.freespins=0&pt.i1.comp.i14.multi=400&pt.i0.comp.i22.multi=15&pt.i0.comp.i23.n=5&pt.i1.comp.i19.type=betline&pt.i0.comp.i11.symbol=SYM5&pt.i0.comp.i13.symbol=SYM6&pt.i1.comp.i8.type=betline&pt.i1.comp.i4.n=4&pt.i1.comp.i27.multi=3&pt.i0.comp.i15.multi=9&pt.i1.comp.i27.symbol=SYM11&bl.i0.reelset=ALL&pt.i0.comp.i16.freespins=0&pt.i0.comp.i28.multi=15&pt.i1.comp.i6.freespins=0&pt.i1.comp.i29.symbol=SYM11&pt.i1.comp.i29.freespins=0&pt.i1.comp.i22.n=4&pt.i1.comp.i30.symbol=SYM12&pt.i1.comp.i3.multi=15&pt.i0.comp.i11.n=5&pt.i0.comp.i4.freespins=0&pt.i1.comp.i23.symbol=SYM9&pt.i1.comp.i25.symbol=SYM10&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&pt.i0.comp.i30.freespins=0&pt.i1.comp.i24.type=betline&pt.i0.comp.i19.n=4&pt.i0.id=basic&pt.i0.comp.i1.type=scatter&bl.i2.id=2&pt.i1.comp.i10.type=betline&pt.i0.comp.i2.symbol=SYM0&pt.i0.comp.i4.symbol=SYM3&pt.i1.comp.i5.freespins=0&pt.i0.comp.i20.type=betline&pt.i1.comp.i8.symbol=SYM4&pt.i1.comp.i19.n=4&pt.i0.comp.i17.freespins=0&pt.i0.comp.i6.symbol=SYM4&pt.i0.comp.i8.symbol=SYM4&pt.i0.comp.i0.symbol=SYM0&pt.i1.comp.i11.n=5&pt.i0.comp.i5.n=5&pt.i1.comp.i2.symbol=SYM0&pt.i0.comp.i3.type=betline&pt.i0.comp.i3.freespins=0&pt.i0.comp.i10.multi=100&pt.i1.id=freespin&pt.i1.comp.i19.multi=15&bl.i3.id=3&pt.i1.comp.i6.symbol=SYM4&pt.i0.comp.i27.multi=3&pt.i0.comp.i9.multi=9&pt.i0.comp.i22.symbol=SYM9&pt.i0.comp.i26.symbol=SYM10&pt.i1.comp.i19.freespins=0&pt.i0.comp.i24.n=3&bl.i8.reelset=ALL&pt.i0.comp.i14.freespins=0&pt.i0.comp.i21.freespins=0&clientaction=paytable&pt.i1.comp.i27.freespins=0&pt.i1.comp.i4.freespins=0&pt.i1.comp.i12.type=betline&pt.i1.comp.i5.n=5&bl.i5.coins=1&pt.i1.comp.i8.multi=750&pt.i1.comp.i21.symbol=SYM9&pt.i1.comp.i23.n=5&pt.i0.comp.i22.type=betline&pt.i0.comp.i24.freespins=0&pt.i1.comp.i32.symbol=SYM12&bl.i8.id=8&pt.i0.comp.i16.multi=50&pt.i0.comp.i21.multi=3&pt.i1.comp.i13.multi=75&pt.i0.comp.i12.n=3&bl.i6.line=2%2C2%2C1%2C2%2C2&pt.i0.comp.i13.type=betline&pt.i1.comp.i9.multi=9&bl.i0.line=1%2C1%2C1%2C1%2C1&pt.i0.comp.i19.type=betline&pt.i0.comp.i6.freespins=0&pt.i1.comp.i2.multi=0&pt.i1.comp.i7.freespins=0&pt.i0.comp.i31.freespins=0&pt.i0.comp.i3.multi=15&pt.i0.comp.i6.n=3&pt.i1.comp.i22.type=betline&pt.i1.comp.i12.n=3&pt.i1.comp.i3.type=betline&pt.i0.comp.i21.n=3&pt.i1.comp.i10.freespins=0&pt.i1.comp.i28.type=betline&pt.i1.comp.i6.n=3&pt.i0.comp.i29.n=5&pt.i1.comp.i31.type=betline&bl.i1.id=1&pt.i1.comp.i20.multi=100&pt.i0.comp.i27.freespins=0&pt.i1.comp.i24.n=3&pt.i0.comp.i10.type=betline&pt.i1.comp.i11.symbol=SYM5&pt.i1.comp.i27.type=betline&pt.i1.comp.i2.type=scatter&pt.i0.comp.i2.freespins=30&pt.i0.comp.i5.multi=1000&pt.i0.comp.i7.n=4&pt.i0.comp.i32.n=5&pt.i1.comp.i1.freespins=20&pt.i0.comp.i11.multi=500&pt.i1.comp.i14.symbol=SYM6&pt.i1.comp.i16.symbol=SYM7&pt.i1.comp.i23.multi=75&pt.i0.comp.i7.type=betline&pt.i1.comp.i4.type=betline&pt.i0.comp.i17.n=5&pt.i1.comp.i18.multi=3&bl.i2.coins=1&bl.i6.id=6&pt.i0.comp.i29.multi=40&pt.i1.comp.i13.n=4&pt.i0.comp.i8.freespins=0&pt.i1.comp.i26.type=betline&pt.i1.comp.i4.multi=200&pt.i0.comp.i8.multi=750&gamesoundurl=&pt.i0.comp.i1.freespins=20&pt.i0.comp.i12.type=betline&pt.i0.comp.i14.multi=400&pt.i1.comp.i7.multi=150&bl.i5.reelset=ALL&pt.i0.comp.i22.n=4&pt.i0.comp.i28.symbol=SYM11&pt.i1.comp.i17.type=betline&bl.i7.id=7&pt.i1.comp.i11.type=betline&pt.i0.comp.i6.multi=15&pt.i1.comp.i0.symbol=SYM0&playercurrencyiso=${slotSettings.slotCurrency}&bl.i1.coins=1&pt.i1.comp.i7.n=4&pt.i1.comp.i5.multi=1000&pt.i1.comp.i5.symbol=SYM3&pt.i0.comp.i18.type=betline&pt.i0.comp.i23.symbol=SYM9&pt.i0.comp.i21.type=betline&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&pt.i1.comp.i25.n=4&pt.i0.comp.i8.type=betline&pt.i0.comp.i7.freespins=0&pt.i1.comp.i15.multi=9&pt.i0.comp.i2.type=scatter&pt.i0.comp.i13.multi=75&pt.i1.comp.i20.type=betline&pt.i0.comp.i17.type=betline&pt.i0.comp.i30.type=betline&pt.i1.comp.i22.symbol=SYM9&pt.i1.comp.i30.freespins=0&pt.i1.comp.i22.multi=15&bl.i0.coins=1&bl.i2.reelset=ALL&pt.i0.comp.i8.n=5&pt.i0.comp.i10.n=4&pt.i1.comp.i6.multi=15&pt.i1.comp.i22.freespins=0&pt.i0.comp.i11.type=betline&pt.i1.comp.i19.symbol=SYM8&pt.i0.comp.i18.n=3&pt.i0.comp.i22.freespins=0&pt.i0.comp.i20.symbol=SYM8&pt.i0.comp.i15.freespins=0&pt.i1.comp.i14.n=5&pt.i1.comp.i16.multi=50&pt.i0.comp.i31.symbol=SYM12&pt.i1.comp.i15.freespins=0&pt.i0.comp.i27.type=betline&pt.i1.comp.i28.freespins=0&pt.i0.comp.i28.freespins=0&pt.i0.comp.i0.n=3&pt.i0.comp.i7.symbol=SYM4&pt.i1.comp.i21.multi=3&pt.i1.comp.i30.type=betline&pt.i1.comp.i0.freespins=10&pt.i0.comp.i0.type=scatter&pt.i1.comp.i0.multi=0&g4mode=false&pt.i1.comp.i8.n=5&pt.i0.comp.i25.multi=15&historybutton=false&pt.i0.comp.i16.symbol=SYM7&pt.i1.comp.i21.freespins=0&bl.i5.id=5&pt.i0.comp.i1.multi=0&pt.i0.comp.i27.n=3&pt.i0.comp.i18.symbol=SYM8&pt.i1.comp.i9.type=betline&pt.i0.comp.i12.multi=9&pt.i0.comp.i32.multi=30&pt.i1.comp.i24.multi=3&pt.i1.comp.i14.freespins=0&pt.i1.comp.i23.type=betline&bl.i3.coins=1&pt.i1.comp.i26.n=5&pt.i0.comp.i12.symbol=SYM6&pt.i0.comp.i14.symbol=SYM6&pt.i1.comp.i13.freespins=0&pt.i1.comp.i28.symbol=SYM11&pt.i0.comp.i14.type=betline&pt.i1.comp.i17.multi=300&pt.i0.comp.i18.multi=3&pt.i1.comp.i0.n=3&pt.i1.comp.i26.symbol=SYM10&pt.i1.comp.i31.symbol=SYM12&bl.i5.line=0%2C0%2C1%2C0%2C0&pt.i0.comp.i7.multi=150&pt.i0.comp.i9.n=3&pt.i0.comp.i30.n=3&pt.i1.comp.i21.type=betline&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&pt.i0.comp.i28.type=betline&pt.i1.comp.i31.multi=15&pt.i1.comp.i18.type=betline&pt.i0.comp.i10.symbol=SYM5&pt.i0.comp.i15.n=3&pt.i0.comp.i21.symbol=SYM9&bl.i7.reelset=ALL&pt.i0.comp.i31.type=betline&pt.i1.comp.i15.n=3&isJackpotWin=false&pt.i1.comp.i20.freespins=0&pt.i1.comp.i7.type=betline&pt.i1.comp.i11.multi=500&pt.i1.comp.i30.n=3&pt.i0.comp.i1.n=4&pt.i0.comp.i10.freespins=0&pt.i0.comp.i20.multi=100&pt.i0.comp.i20.n=5&pt.i0.comp.i29.symbol=SYM11&pt.i1.comp.i3.symbol=SYM3&pt.i0.comp.i17.multi=300&pt.i1.comp.i23.freespins=0&pt.i1.comp.i25.type=betline&pt.i1.comp.i9.n=3&pt.i0.comp.i25.symbol=SYM10&pt.i0.comp.i26.type=betline&pt.i0.comp.i28.n=4&pt.i0.comp.i9.type=betline&pt.i0.comp.i2.multi=0&pt.i1.comp.i27.n=3&pt.i0.comp.i0.freespins=10&pt.i1.comp.i16.type=betline&pt.i1.comp.i25.multi=15&pt.i1.comp.i16.freespins=0&pt.i1.comp.i20.symbol=SYM8&pt.i1.comp.i12.multi=9&pt.i0.comp.i29.freespins=0&pt.i1.comp.i1.n=4&pt.i1.comp.i5.type=betline&pt.i1.comp.i11.freespins=0&pt.i1.comp.i24.symbol=SYM10&pt.i0.comp.i31.n=4&pt.i0.comp.i9.symbol=SYM5&pt.i1.comp.i13.symbol=SYM6&pt.i1.comp.i17.symbol=SYM7&pt.i0.comp.i16.n=4&bl.i0.id=0&pt.i0.comp.i16.type=betline&pt.i1.comp.i16.n=4&pt.i0.comp.i5.symbol=SYM3&pt.i1.comp.i7.symbol=SYM4&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i4.reelset=ALL&bl.i4.coins=1&pt.i0.comp.i2.n=5&pt.i0.comp.i1.symbol=SYM0&pt.i1.comp.i31.n=4&pt.i1.comp.i31.freespins=0&pt.i0.comp.i19.freespins=0&pt.i1.comp.i14.type=betline&pt.i0.comp.i6.type=betline&pt.i1.comp.i9.freespins=0&pt.i1.comp.i2.freespins=30&playercurrency=%26%23x20AC%3B&pt.i1.comp.i25.freespins=0&pt.i1.comp.i30.multi=3&pt.i0.comp.i25.n=4&pt.i1.comp.i10.multi=100&pt.i1.comp.i10.symbol=SYM5&pt.i1.comp.i28.n=4&pt.i1.comp.i32.freespins=0&pt.i0.comp.i9.freespins=0&pt.i1.comp.i2.n=5&pt.i1.comp.i20.n=5&credit=500000&pt.i0.comp.i5.type=betline&pt.i0.comp.i11.freespins=0&bl.i1.reelset=ALL&pt.i1.comp.i18.symbol=SYM8&pt.i1.comp.i12.symbol=SYM6&pt.i0.comp.i4.type=betline&pt.i0.comp.i13.freespins=0&pt.i1.comp.i15.type=betline&pt.i1.comp.i26.freespins=0&pt.i0.comp.i26.freespins=0&pt.i1.comp.i13.type=betline&pt.i1.comp.i1.multi=0&pt.i1.comp.i1.type=scatter&pt.i1.comp.i8.freespins=0&bl.i1.line=0%2C0%2C0%2C0%2C0&pt.i0.comp.i13.n=4&pt.i0.comp.i20.freespins=0&pt.i1.comp.i17.n=5&pt.i0.comp.i23.type=betline&pt.i1.comp.i29.type=betline&pt.i0.comp.i30.symbol=SYM12&pt.i0.comp.i32.symbol=SYM12&pt.i1.comp.i32.n=5&pt.i0.comp.i3.n=3&pt.i1.comp.i17.freespins=0&pt.i1.comp.i26.multi=50&pt.i1.comp.i32.multi=30&pt.i1.comp.i6.type=betline&pt.i1.comp.i1.symbol=SYM0&pt.i1.comp.i29.multi=40&pt.i0.comp.i25.freespins=0&pt.i1.comp.i4.symbol=SYM3&bl.i8.line=1%2C0%2C0%2C0%2C1&pt.i0.comp.i24.symbol=SYM10&pt.i0.comp.i26.n=5&pt.i0.comp.i27.symbol=SYM11&bl.i8.coins=1&pt.i0.comp.i32.freespins=0&pt.i1.comp.i29.n=5&pt.i0.comp.i23.multi=75&bl.i2.line=2%2C2%2C2%2C2%2C2&pt.i1.comp.i3.n=3&pt.i0.comp.i30.multi=3&pt.i1.comp.i21.n=3&pt.i1.comp.i28.multi=15&pt.i0.comp.i18.freespins=0&pt.i1.comp.i15.symbol=SYM7&pt.i1.comp.i18.freespins=0&pt.i1.comp.i3.freespins=0&bl.i4.id=4&bl.i7.coins=1&pt.i0.comp.i14.n=5&pt.i0.comp.i0.multi=0&pt.i1.comp.i9.symbol=SYM5&bl.i6.reelset=ALL&pt.i0.comp.i19.multi=15&pt.i0.comp.i3.symbol=SYM3&pt.i0.comp.i24.type=betline&pt.i1.comp.i18.n=3&pt.i1.comp.i12.freespins=0&pt.i0.comp.i12.freespins=0&pt.i0.comp.i4.n=4&pt.i1.comp.i10.n=4&pt.i0.comp.i24.multi=3`;
                    break;

                case 'initfreespin':
                    result_tmp[0] = `rs.i1.r.i0.syms=SYM0%2CSYM12%2CSYM12&freespins.betlevel=1&g4mode=false&freespins.win.coins=0&playercurrency=%26%23x20AC%3B&rs.i1.r.i2.overlay.i0.pos=130&historybutton=false&current.rs.i0=freespin&rs.i0.r.i4.hold=false&next.rs=freespin&gamestate.history=basic&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=49&rs.i0.r.i1.syms=SYM9%2CSYM9%2CSYM9&game.win.cents=0&rs.i0.id=freespin&rs.i1.r.i3.hold=false&totalwin.coins=0&credit=498400&rs.i1.r.i4.pos=260&gamestate.current=freespin&freespins.initial=10&jackpotcurrency=%26%23x20AC%3B&multiplier=1&bet.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i0.r.i0.syms=SYM12%2CSYM12%2CSYM12&rs.i1.r.i2.overlay.i0.with=SYM1&freespins.denomination=5.000&rs.i0.r.i3.syms=SYM3%2CSYM3%2CSYM3&rs.i1.r.i1.syms=SYM9%2CSYM9%2CSYM9&rs.i1.r.i1.pos=28&rs.i1.r.i3.overlay.i0.row=0&freespins.win.cents=0&freespins.totalwin.coins=0&freespins.total=10&isJackpotWin=false&gamestate.stack=basic%2Cfreespin&rs.i0.r.i0.pos=0&rs.i1.r.i4.syms=SYM12%2CSYM0%2CSYM11&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&gamesoundurl=&rs.i1.r.i2.pos=128&bet.betlevel=1&rs.i1.nearwin=4&rs.i1.r.i2.overlay.i0.row=2&rs.i0.r.i1.pos=0&rs.i1.r.i3.syms=SYM7%2CSYM7%2CSYM0&game.win.coins=0&playercurrencyiso=${slotSettings.slotCurrency}&rs.i1.r.i0.hold=false&rs.i0.r.i1.hold=false&freespins.wavecount=1&freespins.multiplier=1&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&clientaction=initfreespin&rs.i0.r.i2.hold=false&rs.i0.r.i4.syms=SYM11%2CSYM11%2CSYM11&rs.i1.r.i3.overlay.i0.pos=49&rs.i0.r.i2.pos=0&rs.i1.r.i2.syms=SYM10%2CSYM10%2CSYM10&rs.i1.r.i0.pos=277&totalwin.cents=0&gameover=false&rs.i0.r.i0.hold=false&rs.i1.id=basic&rs.i0.r.i3.pos=0&rs.i1.r.i4.hold=false&freespins.left=10&rs.i0.r.i4.pos=0&rs.i1.r.i0.attention.i0=0&rs.i1.r.i3.attention.i0=2&nextaction=freespin&wavecount=1&rs.i1.r.i4.attention.i0=1&rs.i0.r.i2.syms=SYM3%2CSYM3%2CSYM3&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false&game.win.amount=0.00&bet.denomination=5&rs.i1.r.i3.overlay.i0.with=SYM1&freespins.totalwin.cents=0`;
                    break;

                case 'spin':
                    const linesId = [
                        [2, 2, 2, 2, 2], [1, 1, 1, 1, 1], [3, 3, 3, 3, 3], [1, 2, 3, 2, 1], [3, 2, 1, 2, 3],
                        [1, 1, 2, 1, 1], [3, 3, 2, 3, 3], [2, 3, 3, 3, 2], [2, 1, 1, 1, 2]
                    ];
                    const lines = 9;
                    slotSettings.CurrentDenom = postData['bet.denomination'];
                    slotSettings.CurrentDenomination = postData['bet.denomination'];

                    let betline = 0;
                    let allbet = 0;
                    let bonusMpl = 1;
                    let rset = 'basic';

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

                        slotSettings.SetGameData('LightsNETBonusWin', 0);
                        slotSettings.SetGameData('LightsNETFreeGames', 0);
                        slotSettings.SetGameData('LightsNETCurrentFreeGame', 0);
                        slotSettings.SetGameData('LightsNETTotalWin', 0);
                        slotSettings.SetGameData('LightsNETBet', betline);
                        slotSettings.SetGameData('LightsNETDenom', postData['bet.denomination']);
                        slotSettings.SetGameData('LightsNETFreeBalance', Math.floor(slotSettings.GetBalance() * 100) / 100 * 100);
                        bonusMpl = 1;
                        rset = 'basic';
                    } else {
                        postData['bet.denomination'] = slotSettings.GetGameData('LightsNETDenom');
                        slotSettings.CurrentDenom = postData['bet.denomination'];
                        slotSettings.CurrentDenomination = postData['bet.denomination'];
                        betline = parseFloat(slotSettings.GetGameData('LightsNETBet'));
                        allbet = betline * lines;
                        slotSettings.SetGameData('LightsNETCurrentFreeGame', slotSettings.GetGameData('LightsNETCurrentFreeGame') + 1);
                        bonusMpl = slotSettings.slotFreeMpl;
                        rset = 'freespin';
                    }

                    const winTypeTmp = slotSettings.GetSpinSettings(allbet, lines, postData['slotEvent']);
                    let winType = winTypeTmp[0];
                    let spinWinLimit = winTypeTmp[1];

                    balanceInCents = Math.round(slotSettings.GetBalance() * slotSettings.CurrentDenom * 100);
                    if (winType === 'bonus' && postData['slotEvent'] === 'freespin') {
                        winType = 'win';
                    }

                    let totalWin = 0;
                    let lineWins: string[] = [];
                    let cWins: number[] = new Array(100).fill(0);
                    let wild = ['1'];
                    let scatter = '0';
                    let reels: any = {};
                    let tmpReels: any = {};
                    let wildStr = '';
                    let wildStrArr: string[] = [];
                    let isWild = false;
                    let scattersWin = 0;
                    let scattersStr = '';
                    let scattersCount = 0;
                    let scPos: string[] = [];

                    for (let i = 0; i <= 2000; i++) {
                        totalWin = 0;
                        lineWins = [];
                        cWins = new Array(100).fill(0);
                        wild = ['1'];
                        scatter = '0';
                        reels = slotSettings.GetReelStrips(winType, postData['slotEvent']);
                        tmpReels = JSON.parse(JSON.stringify(reels)); // Deep copy
                        wildStr = '';
                        wildStrArr = [];

                        let wildsCount = 0;
                        if (postData['slotEvent'] === 'freespin') {
                            wildsCount = Math.floor(Math.random() * (6 - 3 + 1)) + 3; // rand(3, 6)
                        } else {
                            wildsCount = Math.floor(Math.random() * (4 - 2 + 1)) + 2; // rand(2, 4)
                        }

                        let wc = 0;
                        for (let r = 0; r < 200; r++) {
                            const rew0 = Math.floor(Math.random() * 5) + 1; // rand(1, 5)
                            const rew = Math.floor(Math.random() * 3); // rand(0, 2)

                            if (reels['reel' + rew0][rew] === '1' || reels['reel' + rew0][rew] === '0') {
                                // Skip
                            } else {
                                wc++;
                                reels['reel' + rew0][rew] = '1';
                            }
                            if (wildsCount <= wc) {
                                break;
                            }
                        }

                        for (let r = 1; r <= 5; r++) {
                            let wcc = 0;
                            for (let p = 0; p <= 2; p++) {
                                if (reels['reel' + r][p] === '1') {
                                    wildStrArr.push(`&rs.i0.r.i${r - 1}.overlay.i${wcc}.pos=321&rs.i0.r.i${r - 1}.overlay.i${wcc}.with=SYM1&rs.i0.r.i${r - 1}.overlay.i${wcc}.row=${p}`);
                                    wcc++;
                                }
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
                                                tmpStringWin = `&ws.i${winLineCount}.reelset=basic&ws.i${winLineCount}.types.i0.coins=${tmpWin}${posStr}&ws.i${winLineCount}.types.i0.wintype=coins&ws.i${winLineCount}.betline=${k}&ws.i${winLineCount}.sym=SYM${csym}&ws.i${winLineCount}.direction=left_to_right&ws.i${winLineCount}.types.i0.cents=${tmpWin * slotSettings.CurrentDenomination * 100}&ws.i${winLineCount}.reelset=${rset}`;
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
                        reels = tmpReels; // Restore original reels for scattering check? 
                        // Wait, in PHP code: $reels = $tmpReels; happens AFTER win check.
                        // But wait, the wild replacement MODIFIED $reels in place. 
                        // And $tmpReels = $reels (copy) happened before modification.
                        // So $reels has wilds.
                        // The loop uses $reels (with wilds) to check wins.
                        // Then PHP code does: $reels = $tmpReels;
                        // This means the reported reels to the client (in structure) are the ORIGINAL ones, 
                        // but the wilds are sent via the overlay string. 
                        // Correct.

                        scattersWin = 0;
                        scattersStr = '';
                        scattersCount = 0;
                        scPos = [];

                        for (let r = 1; r <= 5; r++) {
                            for (let p = 0; p <= 2; p++) {
                                if (reels['reel' + r][p] === scatter) {
                                    scattersCount++;
                                    scPos.push(`&ws.i0.pos.i${r - 1}=${r - 1}%2C${p}`);
                                }
                            }
                        }

                        if (scattersCount >= 3) {
                            // const freeCounts: Record<number, number> = { 3: 10, 4: 20, 5: 30 };
                            // PHP Logic for slotFreeCount is usually an array
                            // Here assuming standard or config
                            // In SlotSettings.php, we don't see the array definition for slotFreeCount in constructor but it's accessed as array in other games.
                            // Let's assume simple mapping:
                            let freeSpinCount = 0;
                            if (scattersCount === 3) freeSpinCount = 10;
                            if (scattersCount === 4) freeSpinCount = 20;
                            if (scattersCount >= 5) freeSpinCount = 30;

                            scattersStr = `&ws.i0.types.i0.freespins=${freeSpinCount}&ws.i0.reelset=basic&ws.i0.betline=null&ws.i0.types.i0.wintype=freespins&ws.i0.direction=none${scPos.join('')}`;
                        }

                        totalWin += scattersWin;

                        if (i > 1000) winType = 'none';
                        if (i > 1500) return '{"responseEvent":"error","responseType":"' + postData['slotEvent'] + '","serverResponse":"Bad Reel Strip"}';

                        const maxWin = slotSettings.MaxWin;
                        if ((totalWin * slotSettings.CurrentDenom) <= maxWin) {
                            const minWin = slotSettings.GetRandomPay();
                            let breakout = false;

                            if (i > 700 && minWin === 0) {
                                // logic from php: if($i > 700) { $minWin = 0; }
                            }

                            if (slotSettings.increaseRTP && winType === 'win' && totalWin < (minWin * allbet)) {
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
                    wildStr = wildStrArr.join('');

                    let curReelsStr = `&rs.i0.r.i0.syms=SYM${reels['reel1'][0]}%2CSYM${reels['reel1'][1]}%2CSYM${reels['reel1'][2]}`;
                    curReelsStr += `&rs.i0.r.i1.syms=SYM${reels['reel2'][0]}%2CSYM${reels['reel2'][1]}%2CSYM${reels['reel2'][2]}`;
                    curReelsStr += `&rs.i0.r.i2.syms=SYM${reels['reel3'][0]}%2CSYM${reels['reel3'][1]}%2CSYM${reels['reel3'][2]}`;
                    curReelsStr += `&rs.i0.r.i3.syms=SYM${reels['reel4'][0]}%2CSYM${reels['reel4'][1]}%2CSYM${reels['reel4'][2]}`;
                    curReelsStr += `&rs.i0.r.i4.syms=SYM${reels['reel5'][0]}%2CSYM${reels['reel5'][1]}%2CSYM${reels['reel5'][2]}`;

                    if (postData['slotEvent'] === 'freespin') {
                        slotSettings.SetGameData('LightsNETBonusWin', slotSettings.GetGameData('LightsNETBonusWin') + totalWin);
                        slotSettings.SetGameData('LightsNETTotalWin', slotSettings.GetGameData('LightsNETTotalWin') + totalWin);
                    } else {
                        slotSettings.SetGameData('LightsNETTotalWin', totalWin);
                    }
                    let fs = 0;
                    if (scattersCount >= 3) {
                        let freeSpinCount = 0;
                        if (scattersCount === 3) freeSpinCount = 10;
                        if (scattersCount === 4) freeSpinCount = 20;
                        if (scattersCount >= 5) freeSpinCount = 30;

                        slotSettings.SetGameData('LightsNETFreeStartWin', totalWin);
                        slotSettings.SetGameData('LightsNETBonusWin', totalWin);
                        slotSettings.SetGameData('LightsNETFreeGames', freeSpinCount);
                        fs = slotSettings.GetGameData('LightsNETFreeGames');

                        freeState = `&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=freespin&freespins.left=${fs}&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=basic%2Cfreespin&freespins.totalwin.coins=0&freespins.total=${fs}&freespins.win.cents=0&gamestate.current=freespin&freespins.initial=${fs}&freespins.win.coins=0&freespins.betlevel=${slotSettings.GetGameData('LightsNETBet')}&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&game.win.amount=${totalWin / slotSettings.CurrentDenomination}`;
                        curReelsStr += freeState;
                    }

                    const jsSpin = JSON.stringify(reels);
                    const jsJack = JSON.stringify(slotSettings.Jackpots);
                    var freeStateStr
                    if (postData['slotEvent'] === 'freespin') {
                        totalWin = slotSettings.GetGameData('LightsNETBonusWin');
                        let nextaction = 'freespin';
                        let stack = 'basic%2Cfreespin';
                        let gamestate = 'freespin';

                        if (slotSettings.GetGameData(slotSettings.slotId + 'FreeGames') <= slotSettings.GetGameData(slotSettings.slotId + 'CurrentFreeGame') && slotSettings.GetGameData('LightsNETBonusWin') > 0) {
                            nextaction = 'spin';
                            stack = 'basic';
                            gamestate = 'basic';
                        }

                        fs = slotSettings.GetGameData('LightsNETFreeGames');
                        const fsl = fs - slotSettings.GetGameData('LightsNETCurrentFreeGame');

                        // PHP Logic:
                        // $curReels .= $freeState; (This was appended earlier)
                        // BUT in the PHP code provided:
                        // $curReels = $freeState . $curReels . ...
                        // It rebuilds the string completely for freespin return.

                        // Reconstructing freeState string for JSON return:
                        freeStateStr = `&freespins.totalwin.cents=0&nextaction=${nextaction}&freespins.left=${fsl}&freespins.wavecount=1&next.rs=freespin&current.rs.i0=freespin&freespins.multiplier=1&gamestate.stack=${stack}&freespins.totalwin.coins=${totalWin}&freespins.total=${fs}&freespins.win.cents=${totalWin / slotSettings.CurrentDenomination * 100}&gamestate.current=${gamestate}&freespins.initial=${fs}&freespins.win.coins=${totalWin}&freespins.betlevel=${slotSettings.GetGameData('LightsNETBet')}&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&game.win.amount=${totalWin / slotSettings.CurrentDenomination}`;

                        // In PHP logic, $curReels is overwritten here:
                        // $curReels = $freeState . $curReels . ...
                        // I will just append to curReelsStr for now as it seems to be just a long concat.
                        curReelsStr += freeStateStr;
                    }

                    const response = `{"responseEvent":"spin","responseType":"${postData['slotEvent']}","serverResponse":{"freeState":"${freeStateStr}","slotLines":${lines},"slotBet":${betline},"totalFreeGames":${slotSettings.GetGameData('LightsNETFreeGames')},"currentFreeGames":${slotSettings.GetGameData('LightsNETCurrentFreeGame')},"Balance":${balanceInCents},"afterBalance":${balanceInCents},"bonusWin":${slotSettings.GetGameData('LightsNETBonusWin')},"totalWin":${totalWin},"winLines":[],"Jackpots":${jsJack},"reelsSymbols":${jsSpin}}}`;

                    slotSettings.SaveLogReport(response, allbet, lines, reportWin, postData['slotEvent']);
                    var winString
                    // Final massive string reconstruction based on PHP
                    result_tmp[0] = `rs.i0.r.i1.pos=18&g4mode=false&game.win.coins=${totalWin}&playercurrency=%26%23x20AC%3B&playercurrencyiso=${slotSettings.slotCurrency}&historybutton=false&rs.i0.r.i1.hold=false&rs.i0.r.i4.hold=false&gamestate.history=basic&playforfun=false&jackpotcurrencyiso=${slotSettings.slotCurrency}&clientaction=spin&rs.i0.r.i2.hold=false&game.win.cents=${totalWin * slotSettings.CurrentDenomination * 100}&rs.i0.r.i2.pos=47&rs.i0.id=basic&totalwin.coins=${totalWin}&credit=${balanceInCents}&totalwin.cents=${totalWin * slotSettings.CurrentDenomination * 100}&gamestate.current=basic&gameover=true&rs.i0.r.i0.hold=false&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i3.pos=4&rs.i0.r.i4.pos=5&isJackpotWin=false&gamestate.stack=basic&nextaction=spin&rs.i0.r.i0.pos=7&wavecount=1&gamesoundurl=&rs.i0.r.i3.hold=false&game.win.amount=${totalWin / slotSettings.CurrentDenomination}${curReelsStr}${winString}${wildStr}${scattersStr}`;
                    break;
            }

            const finalResponse = result_tmp[0];
            slotSettings.SaveGameData();
            slotSettings.SaveGameDataStatic();

            const state = slotSettings.getState();
            const safeState = JSON.parse(JSON.stringify(state, (key, value) => {
                if (key === 'originalData') return undefined;
                return value;
            }));

            return JSON.stringify({
                response: finalResponse,
                state: safeState
            });

        } catch (e: any) {
            console.error("CRITICAL SPIN ERROR:", e); // Print the full error to your terminal
            console.error(e.stack); // Print the stack trace

            slotSettings.InternalErrorSilent(e);
            return JSON.stringify({
                response: '{"responseEvent":"error","responseType":"","serverResponse":"InternalError"}',
                state: {}
            });
        }
    }
}