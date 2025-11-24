<?php

namespace Games\LightsNET {
    class Server
    {
        public function get($postData, &$slotSettings)
        {
            try {
                // Logic passed in via $postData
                // $slotSettings is injected dependency
                $balanceInCents = round($slotSettings->GetBalance() * $slotSettings->CurrentDenom * 100);
                $result_tmp = [];
                $aid = '';
                $postData['slotEvent'] = 'bet';
                if ($postData['action'] == 'freespin') {
                    $postData['slotEvent'] = 'freespin';
                    $postData['action'] = 'spin';
                }
                if ($postData['action'] == 'init' || $postData['action'] == 'reloadbalance') {
                    $postData['action'] = 'init';
                    $postData['slotEvent'] = 'init';
                }
                if ($postData['action'] == 'paytable') {
                    $postData['slotEvent'] = 'paytable';
                }
                if ($postData['action'] == 'initfreespin') {
                    $postData['slotEvent'] = 'initfreespin';
                }
                if (isset($postData['bet_denomination']) && $postData['bet_denomination'] >= 1) {
                    $postData['bet_denomination'] = $postData['bet_denomination'] / 100;
                    $slotSettings->CurrentDenom = $postData['bet_denomination'];
                    $slotSettings->CurrentDenomination = $postData['bet_denomination'];
                    $slotSettings->SetGameData($slotSettings->slotId . 'GameDenom', $postData['bet_denomination']);
                } else if ($slotSettings->HasGameData($slotSettings->slotId . 'GameDenom')) {
                    $postData['bet_denomination'] = $slotSettings->GetGameData($slotSettings->slotId . 'GameDenom');
                    $slotSettings->CurrentDenom = $postData['bet_denomination'];
                    $slotSettings->CurrentDenomination = $postData['bet_denomination'];
                }
                $balanceInCents = round($slotSettings->GetBalance() * $slotSettings->CurrentDenom * 100);
                if ($postData['slotEvent'] == 'bet') {
                    $lines = 9;
                    $betline = $postData['bet_betlevel'];
                    if ($lines <= 0 || $betline <= 0.0001) {
                        $response = '{"responseEvent":"error","responseType":"' . $postData['slotEvent'] . '","serverResponse":"invalid bet state"}';
                        return $response;
                    }
                    if ($slotSettings->GetBalance() < ($lines * $betline)) {
                        $response = '{"responseEvent":"error","responseType":"' . $postData['slotEvent'] . '","serverResponse":"invalid balance"}';
                        return $response;
                    }
                }
                if ($slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') < $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame') && $postData['slotEvent'] == 'freespin') {
                    $response = '{"responseEvent":"error","responseType":"' . $postData['slotEvent'] . '","serverResponse":"invalid bonus state"}';
                    return $response;
                }
                $aid = (string)$postData['action'];
                switch ($aid) {
                    case 'init':
                        $gameBets = $slotSettings->Bet;
                        $lastEvent = $slotSettings->GetHistory();
                        $slotSettings->SetGameData('LightsNETBonusWin', 0);
                        $slotSettings->SetGameData('LightsNETFreeGames', 0);
                        $slotSettings->SetGameData('LightsNETCurrentFreeGame', 0);
                        $slotSettings->SetGameData('LightsNETTotalWin', 0);
                        $slotSettings->SetGameData('LightsNETFreeBalance', 0);
                        require_once __DIR__ . '/Helpers/freestate.php';
                        $freeState = getFreeState($lastEvent, $slotSettings, $freeState, $reels, $curReels);
                            $curReels .= ('&rs.i0.r.i1.syms=SYM' . $reels->reel2[0] . '%2CSYM' . $reels->reel2[1] . '%2CSYM' . $reels->reel2[2] . '');
                            $curReels .= ('&rs.i0.r.i2.syms=SYM' . $reels->reel3[0] . '%2CSYM' . $reels->reel3[1] . '%2CSYM' . $reels->reel3[2] . '');
                            $curReels .= ('&rs.i0.r.i3.syms=SYM' . $reels->reel4[0] . '%2CSYM' . $reels->reel4[1] . '%2CSYM' . $reels->reel4[2] . '');
                            $curReels .= ('&rs.i0.r.i4.syms=SYM' . $reels->reel5[0] . '%2CSYM' . $reels->reel5[1] . '%2CSYM' . $reels->reel5[2] . '');
                            $curReels .= ('&rs.i1.r.i0.syms=SYM' . $reels->reel1[0] . '%2CSYM' . $reels->reel1[1] . '%2CSYM' . $reels->reel1[2] . '');
                            $curReels .= ('&rs.i1.r.i1.syms=SYM' . $reels->reel2[0] . '%2CSYM' . $reels->reel2[1] . '%2CSYM' . $reels->reel2[2] . '');
                            $curReels .= ('&rs.i1.r.i2.syms=SYM' . $reels->reel3[0] . '%2CSYM' . $reels->reel3[1] . '%2CSYM' . $reels->reel3[2] . '');
                            $curReels .= ('&rs.i1.r.i3.syms=SYM' . $reels->reel4[0] . '%2CSYM' . $reels->reel4[1] . '%2CSYM' . $reels->reel4[2] . '');
                            $curReels .= ('&rs.i1.r.i4.syms=SYM' . $reels->reel5[0] . '%2CSYM' . $reels->reel5[1] . '%2CSYM' . $reels->reel5[2] . '');
                            $curReels .= ('&rs.i0.r.i0.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i0.r.i1.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i0.r.i2.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i0.r.i3.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i0.r.i4.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i1.r.i0.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i1.r.i1.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i1.r.i2.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i1.r.i3.pos=' . $reels->rp[0]);
                            $curReels .= ('&rs.i1.r.i4.pos=' . $reels->rp[0]);
                        } else {
                            $curReels = '&rs.i0.r.i0.syms=SYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '';
                            $curReels .= ('&rs.i0.r.i1.syms=SYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '');
                            $curReels .= ('&rs.i0.r.i2.syms=SYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '');
                            $curReels .= ('&rs.i0.r.i3.syms=SYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '');
                            $curReels .= ('&rs.i0.r.i4.syms=SYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '%2CSYM' . rand(1, 7) . '');
                            $curReels .= ('&rs.i0.r.i0.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i0.r.i1.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i0.r.i2.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i0.r.i3.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i0.r.i4.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i1.r.i0.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i1.r.i1.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i1.r.i2.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i1.r.i3.pos=' . rand(1, 10));
                            $curReels .= ('&rs.i1.r.i4.pos=' . rand(1, 10));
                        }
                        for ($d = 0; $d < count($slotSettings->Denominations); $d++) {
                            $slotSettings->Denominations[$d] = $slotSettings->Denominations[$d] * 100;
                        }
                        if ($slotSettings->GetGameData('LightsNETCurrentFreeGame') < $slotSettings->GetGameData('LightsNETFreeGames') && $slotSettings->GetGameData('LightsNETFreeGames') > 0) {
                            $freeState = 'previous.rs.i0=freespin&rs.i1.r.i0.syms=SYM9%2CSYM9%2CSYM11&bl.i6.coins=1&g4mode=false&freespins.win.coins=75&rs.i0.nearwin=4&historybutton=false&rs.i0.r.i4.hold=false&bl.i5.id=5&gameEventSetters.enabled=false&next.rs=freespin&gamestate.history=basic%2Cfreespin&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=114&rs.i0.r.i1.syms=SYM9%2CSYM9%2CSYM9&bl.i3.coins=1&game.win.cents=375&staticsharedurl=&ws.i0.betline=3&bl.i0.reelset=ALL&rs.i1.r.i2.overlay.i2.row=2&rs.i1.r.i3.hold=false&totalwin.coins=75&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=freespin&freespins.initial=10&bl.i3.reelset=ALL&rs.i0.r.i2.overlay.i0.row=2&bl.i4.line=2%2C1%2C0%2C1%2C2&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i1.r.i0.overlay.i0.pos=291&bet.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i0.r.i0.syms=SYM0%2CSYM12%2CSYM12&rs.i1.r.i2.overlay.i0.with=SYM1&rs.i0.r.i3.syms=SYM7%2CSYM7%2CSYM0&rs.i1.r.i1.syms=SYM0%2CSYM6%2CSYM6&bl.i2.id=2&rs.i1.r.i1.pos=49&freespins.win.cents=375&rs.i0.r.i2.overlay.i0.with=SYM1&bl.i7.reelset=ALL&isJackpotWin=false&rs.i0.r.i0.pos=277&rs.i1.r.i2.overlay.i1.pos=82&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i1.r.i2.overlay.i0.row=0&rs.i0.r.i1.pos=28&rs.i1.r.i3.syms=SYM4%2CSYM4%2CSYM8&rs.i1.r.i2.overlay.i2.with=SYM1&game.win.coins=75&rs.i1.r.i0.hold=false&rs.i0.r.i1.hold=false&bl.i3.id=3&bl.i8.reelset=ALL&clientaction=init&rs.i0.r.i2.hold=false&rs.i0.r.i3.overlay.i0.with=SYM1&casinoID=netent&betlevel.standard=1&bl.i5.coins=1&gameover=false&bl.i8.id=8&rs.i0.r.i3.pos=49&rs.i0.r.i3.overlay.i0.row=0&bl.i0.id=0&bl.i6.line=2%2C2%2C1%2C2%2C2&rs.i1.r.i2.attention.i0=0&bl.i0.line=1%2C1%2C1%2C1%2C1&nextaction=freespin&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i4.reelset=ALL&bl.i4.coins=1&rs.i0.r.i2.syms=SYM10%2CSYM10%2CSYM10&game.win.amount=3.75&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&rs.i1.r.i0.overlay.i0.with=SYM1&rs.i1.r.i3.overlay.i0.with=SYM1&freespins.totalwin.cents=375&denomination.all=' . implode('%2C', $slotSettings->Denominations) . '&ws.i0.pos.i3=3%2C1&freespins.betlevel=1&ws.i0.pos.i2=2%2C2&playercurrency=%26%23x20AC%3B&rs.i1.r.i2.overlay.i0.pos=81&rs.i1.r.i2.overlay.i1.row=1&current.rs.i0=freespin&ws.i0.reelset=freespin&bl.i1.id=1&ws.i0.pos.i1=1%2C1&ws.i0.pos.i0=0%2C0&rs.i0.r.i3.attention.i0=2&rs.i0.r.i2.overlay.i0.pos=130&rs.i0.id=basic&rs.i1.r.i0.overlay.i0.row=0&credit=' . $balanceInCents . '&rs.i1.r.i4.pos=162&denomination.standard=' . ($slotSettings->CurrentDenomination * 100) . '&ws.i0.types.i0.coins=75&bl.i1.reelset=ALL&rs.i1.r.i2.overlay.i2.pos=83&multiplier=1&last.rs=freespin&freespins.denomination=5.000&bl.i2.coins=1&bl.i6.id=6&bl.i1.line=0%2C0%2C0%2C0%2C0&rs.i1.r.i3.overlay.i0.row=1&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&ws.i0.sym=SYM6&freespins.totalwin.coins=75&ws.i0.direction=left_to_right&freespins.total=10&gamestate.stack=basic%2Cfreespin&rs.i1.r.i4.syms=SYM11%2CSYM11%2CSYM11&gamesoundurl=&rs.i1.r.i2.pos=81&bet.betlevel=1&rs.i1.nearwin=4%2C3&ws.i0.types.i0.wintype=coins&nearwinallowed=true&bl.i5.reelset=ALL&bl.i7.id=7&bl.i8.line=1%2C0%2C0%2C0%2C1&playercurrencyiso=' . $slotSettings->slotCurrency . '&bl.i1.coins=1&freespins.wavecount=1&rs.i0.r.i4.attention.i0=1&freespins.multiplier=1&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&rs.i0.r.i4.syms=SYM12%2CSYM0%2CSYM11&rs.i1.r.i2.overlay.i1.with=SYM1&rs.i1.r.i3.overlay.i0.pos=115&bl.i8.coins=1&rs.i0.r.i2.pos=128&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i0.r.i0.attention.i0=0&rs.i1.r.i2.syms=SYM0%2CSYM9%2CSYM9&rs.i1.r.i0.pos=291&totalwin.cents=375&bl.i0.coins=1&bl.i2.reelset=ALL&rs.i0.r.i0.hold=false&restore=true&rs.i1.id=freespin&rs.i1.r.i4.hold=false&freespins.left=9&bl.i4.id=4&rs.i0.r.i4.pos=260&bl.i7.coins=1&rs.i0.r.i3.overlay.i0.pos=49&ws.i0.types.i0.cents=375&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&rs.i1.r.i1.attention.i0=0&bl.i6.reelset=ALL&wavecount=1&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false&bet.denomination=' . ($slotSettings->CurrentDenomination * 100) . '' . $freeState;
                        }
                        $result_tmp[] = 'rs.i1.r.i0.syms=SYM12%2CSYM0%2CSYM11&bl.i6.coins=1&g4mode=false&historybutton=false&rs.i0.r.i4.hold=false&bl.i5.id=5&gameEventSetters.enabled=false&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=71&rs.i0.r.i1.syms=SYM9%2CSYM9%2CSYM9&bl.i3.coins=1&game.win.cents=0&staticsharedurl=&bl.i0.reelset=ALL&rs.i1.r.i3.hold=false&totalwin.coins=0&bl.i5.line=0%2C0%2C1%2C0%2C0&gamestate.current=basic&bl.i3.reelset=ALL&bl.i4.line=2%2C1%2C0%2C1%2C2&jackpotcurrency=%26%23x20AC%3B&bl.i7.line=1%2C2%2C2%2C2%2C1&rs.i0.r.i0.syms=SYM12%2CSYM12%2CSYM12&rs.i0.r.i3.syms=SYM3%2CSYM3%2CSYM3&rs.i1.r.i1.syms=SYM10%2CSYM10%2CSYM3&bl.i2.id=2&rs.i1.r.i1.pos=14&bl.i7.reelset=ALL&isJackpotWin=false&rs.i0.r.i0.pos=0&rs.i0.r.i1.pos=0&rs.i1.r.i3.syms=SYM6%2CSYM6%2CSYM8&game.win.coins=0&rs.i1.r.i0.hold=false&rs.i0.r.i1.hold=false&bl.i3.id=3&bl.i8.reelset=ALL&clientaction=init&rs.i0.r.i2.hold=false&casinoID=netent&betlevel.standard=1&bl.i5.coins=1&gameover=true&bl.i8.id=8&rs.i0.r.i3.pos=0&bl.i0.id=0&bl.i6.line=2%2C2%2C1%2C2%2C2&bl.i0.line=1%2C1%2C1%2C1%2C1&nextaction=spin&bl.i3.line=0%2C1%2C2%2C1%2C0&bl.i4.reelset=ALL&bl.i4.coins=1&rs.i0.r.i2.syms=SYM3%2CSYM3%2CSYM3&game.win.amount=0&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10&denomination.all=' . implode('%2C', $slotSettings->Denominations) . '&playercurrency=%26%23x20AC%3B&bl.i1.id=1&rs.i0.id=freespin&credit=' . $balanceInCents . '&rs.i1.r.i4.pos=16&denomination.standard=' . ($slotSettings->CurrentDenomination * 100) . '&bl.i1.reelset=ALL&multiplier=1&bl.i2.coins=1&bl.i6.id=6&bl.i1.line=0%2C0%2C0%2C0%2C0&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&rs.i1.r.i4.syms=SYM9%2CSYM9%2CSYM5&gamesoundurl=&rs.i1.r.i2.pos=29&nearwinallowed=true&bl.i5.reelset=ALL&bl.i7.id=7&bl.i8.line=1%2C0%2C0%2C0%2C1&playercurrencyiso=' . $slotSettings->slotCurrency . '&bl.i1.coins=1&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&rs.i0.r.i4.syms=SYM11%2CSYM11%2CSYM11&bl.i8.coins=1&rs.i0.r.i2.pos=0&bl.i2.line=2%2C2%2C2%2C2%2C2&rs.i1.r.i2.syms=SYM7%2CSYM4%2CSYM4&rs.i1.r.i0.pos=163&totalwin.cents=0&bl.i0.coins=1&bl.i2.reelset=ALL&rs.i0.r.i0.hold=false&restore=false&rs.i1.id=basic&rs.i1.r.i4.hold=false&bl.i4.id=4&rs.i0.r.i4.pos=0&bl.i7.coins=1&bl.standard=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&bl.i6.reelset=ALL&wavecount=1&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false' . $curReels . $freeState;
                        break;
                    case 'paytable':
                        require_once __DIR__ . '/Helpers/paytable.php';
                        $result_tmp[] = getPaytable($slotSettings);
                    case 'initfreespin':
                        require_once __DIR__ . '/Helpers/initfreespin.php';
                        $result_tmp[] = getInitFreeSpin($slotSettings);
                        break;
                    case 'spin':
                        require_once __DIR__ . '/Helpers/lines.php';
                        $linesId = getLines();
                        $lines = 9;
                        $slotSettings->CurrentDenom = $postData['bet_denomination'];
                        $slotSettings->CurrentDenomination = $postData['bet_denomination'];
                        if ($postData['slotEvent'] != 'freespin') {
                            $betline = $postData['bet_betlevel'];
                            $allbet = $betline * $lines;
                            $slotSettings->UpdateJackpots($allbet);
                            if (!isset($postData['slotEvent'])) {
                                $postData['slotEvent'] = 'bet';
                            }
                            $slotSettings->SetBalance(-1 * $allbet, $postData['slotEvent']);
                            $bankSum = $allbet / 100 * $slotSettings->GetPercent();
                            $slotSettings->SetBank((isset($postData['slotEvent']) ? $postData['slotEvent'] : ''), $bankSum, $postData['slotEvent']);
                            $slotSettings->UpdateJackpots($allbet);
                            $slotSettings->SetGameData('LightsNETBonusWin', 0);
                            $slotSettings->SetGameData('LightsNETFreeGames', 0);
                            $slotSettings->SetGameData('LightsNETCurrentFreeGame', 0);
                            $slotSettings->SetGameData('LightsNETTotalWin', 0);
                            $slotSettings->SetGameData('LightsNETBet', $betline);
                            $slotSettings->SetGameData('LightsNETDenom', $postData['bet_denomination']);
                            $slotSettings->SetGameData('LightsNETFreeBalance', sprintf('%01.2f', $slotSettings->GetBalance()) * 100);
                            $bonusMpl = 1;
                            $rset = 'basic';
                        } else {
                            $postData['bet_denomination'] = $slotSettings->GetGameData('LightsNETDenom');
                            $slotSettings->CurrentDenom = $postData['bet_denomination'];
                            $slotSettings->CurrentDenomination = $postData['bet_denomination'];
                            $betline = $slotSettings->GetGameData('LightsNETBet');
                            $allbet = $betline * $lines;
                            $slotSettings->SetGameData('LightsNETCurrentFreeGame', $slotSettings->GetGameData('LightsNETCurrentFreeGame') + 1);
                            $bonusMpl = $slotSettings->slotFreeMpl;
                            $rset = 'freespin';
                        }
                        $winTypeTmp = $slotSettings->GetSpinSettings($postData['slotEvent'], $allbet, $lines);
                        $winType = $winTypeTmp[0];
                        $spinWinLimit = $winTypeTmp[1];
                        /*if( !$slotSettings->HasGameDataStatic($slotSettings->slotId . 'timeWinLimit') || $slotSettings->GetGameDataStatic($slotSettings->slotId . 'timeWinLimit') <= 0 ) 
                            {
                                $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWinLimitNum', rand(0, count($slotSettings->winLimitsArr) - 1));
                                $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWinLimit0', time());
                                $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWinLimit', $slotSettings->winLimitsArr[$slotSettings->GetGameDataStatic($slotSettings->slotId . 'timeWinLimitNum')][0]);
                                $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWin', 0);
                            }*/
                        $balanceInCents = round($slotSettings->GetBalance() * $slotSettings->CurrentDenom * 100);
                        if ($winType == 'bonus' && $postData['slotEvent'] == 'freespin') {
                            $winType = 'win';
                        }
                        $jackRandom = rand(1, 500);
                        $mainSymAnim = '';
                        for ($i = 0; $i <= 2000; $i++) {
                            $totalWin = 0;
                            $lineWins = [];
                            require_once __DIR__ . '/Helpers/cwins.php';
                        $cWins = getCWins();
                            $wild = ['1'];
                            $scatter = '0';
                            $reels = $slotSettings->GetReelStrips($winType, $postData['slotEvent']);
                            $tmpReels = $reels;
                            $wildStr = '';
                            $wildStrArr = [];
                            if ($postData['slotEvent'] == 'freespin') {
                                $wildsCount = rand(3, 6);
                            } else {
                                $wildsCount = rand(2, 4);
                            }
                            $wc = 0;
                            for ($r = 0; $r < 200; $r++) {
                                $rew0 = rand(1, 5);
                                $rew = rand(0, 2);
                                if ($reels['reel' . $rew0][$rew] == '1' || $reels['reel' . $rew0][$rew] == '0') {
                                } else {
                                    $wc++;
                                    $reels['reel' . $rew0][$rew] = '1';
                                }
                                if ($wildsCount <= $wc) {
                                    break;
                                }
                            }
                            for ($r = 1; $r <= 5; $r++) {
                                $wcc = 0;
                                for ($p = 0; $p <= 2; $p++) {
                                    if ($reels['reel' . $r][$p] == '1') {
                                        $wildStrArr[] = '&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $wcc . '.pos=321&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $wcc . '.with=SYM1&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $wcc . '.row=' . $p;
                                        $wcc++;
                                    }
                                }
                            }
                            $winLineCount = 0;
                            for ($k = 0; $k < $lines; $k++) {
                                $tmpStringWin = '';
                                for ($j = 0; $j < count($slotSettings->SymbolGame); $j++) {
                                    $csym = (string)$slotSettings->SymbolGame[$j];
                                    if ($csym == $scatter || !isset($slotSettings->Paytable['SYM_' . $csym])) {
                                    } else {
                                        $s = [];
                                        $s[0] = $reels['reel1'][$linesId[$k][0] - 1];
                                        $s[1] = $reels['reel2'][$linesId[$k][1] - 1];
                                        $s[2] = $reels['reel3'][$linesId[$k][2] - 1];
                                        $s[3] = $reels['reel4'][$linesId[$k][3] - 1];
                                        $s[4] = $reels['reel5'][$linesId[$k][4] - 1];
                                        if (($s[0] == $csym || in_array($s[0], $wild)) && ($s[1] == $csym || in_array($s[1], $wild)) && ($s[2] == $csym || in_array($s[2], $wild))) {
                                            $mpl = 1;
                                            if (in_array($s[0], $wild) && in_array($s[1], $wild) && in_array($s[2], $wild)) {
                                                $mpl = 1;
                                            } else if (in_array($s[0], $wild) || in_array($s[1], $wild) || in_array($s[2], $wild)) {
                                                $mpl = $slotSettings->slotWildMpl;
                                            }
                                            $tmpWin = $slotSettings->Paytable['SYM_' . $csym][3] * $betline * $mpl * $bonusMpl;
                                            if ($cWins[$k] < $tmpWin) {
                                                $cWins[$k] = $tmpWin;
                                                $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $tmpWin . '&ws.i' . $winLineCount . '.pos.i0=0%2C' . ($linesId[$k][0] - 1) . '&ws.i' . $winLineCount . '.pos.i1=1%2C' . ($linesId[$k][1] - 1) . '&ws.i' . $winLineCount . '.pos.i2=2%2C' . ($linesId[$k][2] - 1) . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=' . $k . '&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($tmpWin * $slotSettings->CurrentDenomination * 100) . '&ws.i' . $winLineCount . '.reelset=' . $rset;
                                                $mainSymAnim = $csym;
                                            }
                                        }
                                        if (($s[0] == $csym || in_array($s[0], $wild)) && ($s[1] == $csym || in_array($s[1], $wild)) && ($s[2] == $csym || in_array($s[2], $wild)) && ($s[3] == $csym || in_array($s[3], $wild))) {
                                            $mpl = 1;
                                            if (in_array($s[0], $wild) && in_array($s[1], $wild) && in_array($s[2], $wild) && in_array($s[3], $wild)) {
                                                $mpl = 1;
                                            } else if (in_array($s[0], $wild) || in_array($s[1], $wild) || in_array($s[2], $wild) || in_array($s[3], $wild)) {
                                                $mpl = $slotSettings->slotWildMpl;
                                            }
                                            $tmpWin = $slotSettings->Paytable['SYM_' . $csym][4] * $betline * $mpl * $bonusMpl;
                                            if ($cWins[$k] < $tmpWin) {
                                                $cWins[$k] = $tmpWin;
                                                $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $tmpWin . '&ws.i' . $winLineCount . '.pos.i0=0%2C' . ($linesId[$k][0] - 1) . '&ws.i' . $winLineCount . '.pos.i1=1%2C' . ($linesId[$k][1] - 1) . '&ws.i' . $winLineCount . '.pos.i2=2%2C' . ($linesId[$k][2] - 1) . '&ws.i' . $winLineCount . '.pos.i3=3%2C' . ($linesId[$k][3] - 1) . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=' . $k . '&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($tmpWin * $slotSettings->CurrentDenomination * 100) . '' . '&ws.i' . $winLineCount . '.reelset=' . $rset;
                                                $mainSymAnim = $csym;
                                            }
                                        }
                                        if (($s[0] == $csym || in_array($s[0], $wild)) && ($s[1] == $csym || in_array($s[1], $wild)) && ($s[2] == $csym || in_array($s[2], $wild)) && ($s[3] == $csym || in_array($s[3], $wild)) && ($s[4] == $csym || in_array($s[4], $wild))) {
                                            $mpl = 1;
                                            if (in_array($s[0], $wild) && in_array($s[1], $wild) && in_array($s[2], $wild) && in_array($s[3], $wild) && in_array($s[4], $wild)) {
                                                $mpl = 1;
                                            } else if (in_array($s[0], $wild) || in_array($s[1], $wild) || in_array($s[2], $wild) || in_array($s[3], $wild) || in_array($s[4], $wild)) {
                                                $mpl = $slotSettings->slotWildMpl;
                                            }
                                            $tmpWin = $slotSettings->Paytable['SYM_' . $csym][5] * $betline * $mpl * $bonusMpl;
                                            if ($cWins[$k] < $tmpWin) {
                                                $cWins[$k] = $tmpWin;
                                                $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $tmpWin . '&ws.i' . $winLineCount . '.pos.i0=0%2C' . ($linesId[$k][0] - 1) . '&ws.i' . $winLineCount . '.pos.i1=1%2C' . ($linesId[$k][1] - 1) . '&ws.i' . $winLineCount . '.pos.i2=2%2C' . ($linesId[$k][2] - 1) . '&ws.i' . $winLineCount . '.pos.i3=3%2C' . ($linesId[$k][3] - 1) . '&ws.i' . $winLineCount . '.pos.i4=4%2C' . ($linesId[$k][4] - 1) . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=' . $k . '&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($tmpWin * $slotSettings->CurrentDenomination * 100) . '' . '&ws.i' . $winLineCount . '.reelset=' . $rset;
                                                $mainSymAnim = $csym;
                                            }
                                        }
                                    }
                                }
                                if ($cWins[$k] > 0 && $tmpStringWin != '') {
                                    array_push($lineWins, $tmpStringWin);
                                    $totalWin += $cWins[$k];
                                    $winLineCount++;
                                }
                            }
                            $reels = $tmpReels;
                            $scattersWin = 0;
                            $scattersStr = '';
                            $scattersCount = 0;
                            $scPos = [];
                            for ($r = 1; $r <= 5; $r++) {
                                for ($p = 0; $p <= 2; $p++) {
                                    if ($reels['reel' . $r][$p] == $scatter) {
                                        $scattersCount++;
                                        $scPos[] = '&ws.i0.pos.i' . ($r - 1) . '=' . ($r - 1) . '%2C' . $p . '';
                                    }
                                }
                            }
                            if ($scattersCount >= 3) {
                                $scattersStr = '&ws.i0.types.i0.freespins=' . $slotSettings->slotFreeCount[$scattersCount] . '&ws.i0.reelset=basic&ws.i0.betline=null&ws.i0.types.i0.wintype=freespins&ws.i0.direction=none&' . implode('', $scPos);
                            }
                            $totalWin += $scattersWin;
                            if ($i > 1000) {
                                $winType = 'none';
                            }
                            if ($i > 1500) {
                                $response = '{"responseEvent":"error","responseType":"' . $postData['slotEvent'] . '","serverResponse":"Bad Reel Strip"}';
                                return $response;
                            }
                            if ($slotSettings->MaxWin < ($totalWin * $slotSettings->CurrentDenom)) {
                            } else {
                                $minWin = $slotSettings->GetRandomPay();
                                if ($i > 700) {
                                    $minWin = 0;
                                }
                                if ($slotSettings->increaseRTP && $winType == 'win' && $totalWin < ($minWin * $allbet)) {
                                } else if ($scattersCount >= 3 && $winType != 'bonus') {
                                } else if ($totalWin <= $spinWinLimit && $winType == 'bonus') {
                                    $cBank = $slotSettings->GetBank((isset($postData['slotEvent']) ? $postData['slotEvent'] : ''));
                                    if ($cBank < $spinWinLimit) {
                                        $spinWinLimit = $cBank;
                                    } else {
                                        break;
                                    }
                                } else if ($totalWin > 0 && $totalWin <= $spinWinLimit && $winType == 'win') {
                                    $cBank = $slotSettings->GetBank((isset($postData['slotEvent']) ? $postData['slotEvent'] : ''));
                                    if ($cBank < $spinWinLimit) {
                                        $spinWinLimit = $cBank;
                                    } else {
                                        break;
                                    }
                                } else if ($totalWin == 0 && $winType == 'none') {
                                    break;
                                }
                            }
                        }
                        $freeState = '';
                        if ($totalWin > 0) {
                            $slotSettings->SetBank((isset($postData['slotEvent']) ? $postData['slotEvent'] : ''), -1 * $totalWin);
                            $slotSettings->SetBalance($totalWin);
                        }
                        $reportWin = $totalWin;
                        $wildStr = implode('', $wildStrArr);
                        $curReels = '&rs.i0.r.i0.syms=SYM' . $reels['reel1'][0] . '%2CSYM' . $reels['reel1'][1] . '%2CSYM' . $reels['reel1'][2] . '';
                        $curReels .= ('&rs.i0.r.i1.syms=SYM' . $reels['reel2'][0] . '%2CSYM' . $reels['reel2'][1] . '%2CSYM' . $reels['reel2'][2] . '');
                        $curReels .= ('&rs.i0.r.i2.syms=SYM' . $reels['reel3'][0] . '%2CSYM' . $reels['reel3'][1] . '%2CSYM' . $reels['reel3'][2] . '');
                        $curReels .= ('&rs.i0.r.i3.syms=SYM' . $reels['reel4'][0] . '%2CSYM' . $reels['reel4'][1] . '%2CSYM' . $reels['reel4'][2] . '');
                        $curReels .= ('&rs.i0.r.i4.syms=SYM' . $reels['reel5'][0] . '%2CSYM' . $reels['reel5'][1] . '%2CSYM' . $reels['reel5'][2] . '');
                        if ($postData['slotEvent'] == 'freespin') {
                            $slotSettings->SetGameData('LightsNETBonusWin', $slotSettings->GetGameData('LightsNETBonusWin') + $totalWin);
                            $slotSettings->SetGameData('LightsNETTotalWin', $slotSettings->GetGameData('LightsNETTotalWin') + $totalWin);
                        } else {
                            $slotSettings->SetGameData('LightsNETTotalWin', $totalWin);
                        }
                        $fs = 0;
                        if ($scattersCount >= 3) {
                            $slotSettings->SetGameData('LightsNETFreeStartWin', $totalWin);
                            $slotSettings->SetGameData('LightsNETBonusWin', $totalWin);
                            $slotSettings->SetGameData('LightsNETFreeGames', $slotSettings->slotFreeCount[$scattersCount]);
                            $fs = $slotSettings->GetGameData('LightsNETFreeGames');
                            $freeState = '&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=freespin&freespins.left=' . $fs . '&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=basic%2Cfreespin&freespins.totalwin.coins=0&freespins.total=' . $fs . '&freespins.win.cents=0&gamestate.current=freespin&freespins.initial=' . $fs . '&freespins.win.coins=0&freespins.betlevel=' . $slotSettings->GetGameData('LightsNETBet') . '&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination) . '';
                            $curReels .= $freeState;
                        }
                        /*$newTime = time() - $slotSettings->GetGameDataStatic($slotSettings->slotId . 'timeWinLimit0');
                            $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWinLimit0', time());
                            $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWinLimit', $slotSettings->GetGameDataStatic($slotSettings->slotId . 'timeWinLimit') - $newTime);
                            $slotSettings->SetGameDataStatic($slotSettings->slotId . 'timeWin', $slotSettings->GetGameDataStatic($slotSettings->slotId . 'timeWin') + ($totalWin * $slotSettings->CurrentDenom));*/
                        $winString = implode('', $lineWins);
                        $jsSpin = '' . json_encode($reels) . '';
                        $jsJack = '' . json_encode($slotSettings->Jackpots) . '';
                        $winstring = '';
                        $slotSettings->SetGameData('LightsNETGambleStep', 5);
                        $hist = $slotSettings->GetGameData('LightsNETCards');
                        $isJack = 'false';
                        if ($totalWin > 0) {
                            $state = 'gamble';
                            $gameover = 'false';
                            $nextaction = 'spin';
                            $gameover = 'true';
                        } else {
                            $state = 'idle';
                            $gameover = 'true';
                            $nextaction = 'spin';
                        }
                        $gameover = 'true';
                        if ($postData['slotEvent'] == 'freespin') {
                            $totalWin = $slotSettings->GetGameData('LightsNETBonusWin');
                            if ($slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') <= $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame') && $slotSettings->GetGameData('LightsNETBonusWin') > 0) {
                                $nextaction = 'spin';
                                $stack = 'basic';
                                $gamestate = 'basic';
                            } else {
                                $gamestate = 'freespin';
                                $nextaction = 'freespin';
                                $stack = 'basic%2Cfreespin';
                            }
                            $fs = $slotSettings->GetGameData('LightsNETFreeGames');
                            $fsl = $slotSettings->GetGameData('LightsNETFreeGames') - $slotSettings->GetGameData('LightsNETCurrentFreeGame');
                            $freeState = 'previous.rs.i0=freespin&freespins.betlevel=1&g4mode=false&freespins.win.coins=0&playercurrency=%26%23x20AC%3B&historybutton=false&current.rs.i0=freespin&rs.i0.r.i4.hold=false&next.rs=freespin&gamestate.history=basic%2Cfreespin&rs.i0.r.i1.syms=SYM12%2CSYM8%2CSYM8&game.win.cents=0&rs.i0.id=freespin&totalwin.coins=0&credit=502920&gamestate.current=freespin&freespins.initial=10&jackpotcurrency=%26%23x20AC%3B&multiplier=1&last.rs=freespin&freespins.denomination=5.000&rs.i0.r.i0.syms=SYM5%2CSYM5%2CSYM10&rs.i0.r.i3.syms=SYM10%2CSYM10%2CSYM7&freespins.win.cents=0&freespins.totalwin.coins=0&freespins.total=10&isJackpotWin=false&gamestate.stack=basic%2Cfreespin&rs.i0.r.i0.pos=245&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&gamesoundurl=&rs.i0.r.i1.pos=21&game.win.coins=0&playercurrencyiso=' . $slotSettings->slotCurrency . '&rs.i0.r.i1.hold=false&freespins.wavecount=1&freespins.multiplier=1&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&clientaction=freespin&rs.i0.r.i2.hold=false&rs.i0.r.i4.syms=SYM6%2CSYM6%2CSYM6&rs.i0.r.i2.pos=75&totalwin.cents=0&gameover=false&rs.i0.r.i0.hold=false&rs.i0.r.i3.pos=146&freespins.left=9&rs.i0.r.i4.pos=245&nextaction=freespin&wavecount=1&rs.i0.r.i2.syms=SYM11%2CSYM11%2CSYM11&rs.i0.r.i3.hold=false&game.win.amount=0.00&freespins.totalwin.cents=0';
                            $curReels = $freeState . $curReels . '&freespins.totalwin.cents=0&nextaction=' . $nextaction . '&freespins.left=' . $fsl . '&freespins.wavecount=1&next.rs=freespin&current.rs.i0=freespin&freespins.multiplier=1&gamestate.stack=' . $stack . '&freespins.totalwin.coins=' . $totalWin . '&freespins.total=' . $fs . '&freespins.win.cents=' . ($totalWin / $slotSettings->CurrentDenomination * 100) . '&gamestate.current=' . $gamestate . '&freespins.initial=' . $fs . '&freespins.win.coins=' . $totalWin . '&freespins.betlevel=' . $slotSettings->GetGameData('LightsNETBet') . '&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination);
                            $freeState = '&freespins.totalwin.cents=0&nextaction=' . $nextaction . '&freespins.left=' . $fsl . '&freespins.wavecount=1&next.rs=freespin&current.rs.i0=freespin&freespins.multiplier=1&gamestate.stack=' . $stack . '&freespins.totalwin.coins=' . $totalWin . '&freespins.total=' . $fs . '&freespins.win.cents=' . ($totalWin / $slotSettings->CurrentDenomination * 100) . '&gamestate.current=' . $gamestate . '&freespins.initial=' . $fs . '&freespins.win.coins=' . $totalWin . '&freespins.betlevel=' . $slotSettings->GetGameData('LightsNETBet') . '&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination);
                        }
                        require_once __DIR__ . '/Helpers/spin_response.php';
                        $response = getSpinResponse($postData, $freeState, $lines, $betline, $slotSettings, $balanceInCents, $totalWin, $jsJack, $jsSpin);
                        $slotSettings->SaveLogReport($response, $allbet, $lines, $reportWin, $postData['slotEvent']);
                        $balanceInCents = round($slotSettings->GetBalance() * $slotSettings->CurrentDenom * 100);
                        $result_tmp[] = 'rs.i0.r.i1.pos=18&g4mode=false&game.win.coins=' . $totalWin . '&playercurrency=%26%23x20AC%3B&playercurrencyiso=' . $slotSettings->slotCurrency . '&historybutton=false&rs.i0.r.i1.hold=false&rs.i0.r.i4.hold=false&gamestate.history=basic&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&clientaction=spin&rs.i0.r.i2.hold=false&game.win.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&rs.i0.r.i2.pos=47&rs.i0.id=basic&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&gamestate.current=basic&gameover=true&rs.i0.r.i0.hold=false&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i3.pos=4&rs.i0.r.i4.pos=5&isJackpotWin=false&gamestate.stack=basic&nextaction=spin&rs.i0.r.i0.pos=7&wavecount=1&gamesoundurl=&rs.i0.r.i3.hold=false&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination) . '' . $curReels . $winString . '' . $wildStr . $scattersStr;
                        break;
                }
                $response = $result_tmp[0];
                $slotSettings->SaveGameData();
                $slotSettings->SaveGameDataStatic();
                return json_encode(['response' => $response, 'state' => $slotSettings->getState()]);
            } catch (\Exception $e) {
                // Handle internal errors gracefully
                $slotSettings->InternalErrorSilent($e);
                return json_encode(['response' => '{"responseEvent":"error","responseType":"","serverResponse":"InternalError"}', 'state' => $slotSettings->getState()]);
            }
        }
    }
}
