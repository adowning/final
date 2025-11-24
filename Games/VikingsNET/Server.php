<?php

namespace Games\VikingsNET {
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
                    $lines = 20;
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
                        $slotSettings->SetGameData('VikingsNETBonusWin', 0);
                        $slotSettings->SetGameData('VikingsNETFreeGames', 0);
                        $slotSettings->SetGameData('VikingsNETCurrentFreeGame', 0);
                        $slotSettings->SetGameData('VikingsNETTotalWin', 0);
                        $slotSettings->SetGameData('VikingsNETFreeBalance', 0);
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
                        if ($slotSettings->GetGameData('VikingsNETCurrentFreeGame') < $slotSettings->GetGameData('VikingsNETFreeGames') && $slotSettings->GetGameData('VikingsNETFreeGames') > 0) {
                            require_once __DIR__ . '/Helpers/init_response.php';
                        $result_tmp[] = getInitResponse($slotSettings, $balanceInCents, $freeState);
                        }
                        $result_tmp[] = 'denomination.all=' . implode('%2C', $slotSettings->Denominations) . '&rs.i1.r.i0.syms=SYM11%2CSYM6%2CSYM6&rs.i0.r.i6.pos=0&gameServerVersion=1.3.0&g4mode=false&playercurrency=%26%23x20AC%3B&historybutton=false&rs.i0.r.i4.hold=false&gameEventSetters.enabled=false&rs.i1.r.i2.hold=false&rs.i1.r.i3.pos=0&rs.i0.r.i1.syms=SYM9%2CSYM11%2CSYM8%2CSYM9%2CSYM4&rs.i0.r.i5.hold=false&game.win.cents=0&staticsharedurl=https%3A%2F%2Fstatic-shared.casinomodule.com%2Fgameclient_html%2Fdevicedetection%2Fcurrent&rs.i0.id=freespin&bl.i0.reelset=ALL&rs.i1.r.i3.hold=false&totalwin.coins=0&credit=' . $balanceInCents . '&rs.i1.r.i4.pos=0&gamestate.current=basic&denomination.standard=' . ($slotSettings->CurrentDenomination * 100) . '&rs.i0.r.i6.syms=SYM9%2CSYM9%2CSYM12%2CSYM5%2CSYM12&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i0.syms=SYM8%2CSYM11%2CSYM12%2CSYM10%2CSYM10&rs.i0.r.i3.syms=SYM9%2CSYM12%2CSYM8%2CSYM12%2CSYM9&rs.i1.r.i1.syms=SYM13%2CSYM13%2CSYM11&rs.i1.r.i1.pos=0&autoplay=10%2C25%2C50%2C75%2C100%2C250%2C500%2C750%2C1000&isJackpotWin=false&rs.i0.r.i0.pos=0&rs.i1.r.i4.syms=SYM12%2CSYM10%2CSYM4&gamesoundurl=&rs.i1.r.i2.pos=0&nearwinallowed=true&rs.i0.r.i1.pos=0&rs.i1.r.i3.syms=SYM8%2CSYM13%2CSYM10&game.win.coins=0&playercurrencyiso=' . $slotSettings->slotCurrency . '&rs.i1.r.i0.hold=false&rs.i0.r.i5.syms=SYM12%2CSYM10%2CSYM8%2CSYM11%2CSYM12&rs.i0.r.i1.hold=false&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&clientaction=init&rs.i0.r.i2.hold=false&rs.i0.r.i4.syms=SYM12%2CSYM11%2CSYM12%2CSYM12%2CSYM11&rs.i0.r.i2.pos=0&rs.i1.r.i2.syms=SYM13%2CSYM11%2CSYM9&casinoID=netent&betlevel.standard=1&rs.i1.r.i0.pos=0&totalwin.cents=0&gameover=true&bl.i0.coins=20&rs.i0.r.i0.hold=false&restore=false&rs.i1.id=basic&rs.i0.r.i6.hold=false&rs.i0.r.i3.pos=0&rs.i1.r.i4.hold=false&rs.i0.r.i4.pos=0&bl.i0.id=0&bl.standard=0&bl.i0.line=0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4%2C0%2F1%2F2%2F3%2F4&nextaction=spin&rs.i0.r.i5.pos=0&wavecount=1&rs.i0.r.i2.syms=SYM9%2CSYM9%2CSYM12%2CSYM11%2CSYM12&rs.i1.r.i1.hold=false&rs.i0.r.i3.hold=false&game.win.amount=0&betlevel.all=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10' . $curReels;
                        break;
                    case 'paytable':
                        require_once __DIR__ . '/Helpers/paytable.php';
                        $result_tmp[] = getPaytable($slotSettings);
                        break;
                    case 'spin':
                        require_once __DIR__ . '/Helpers/lines.php';
                        $linesId = getLines();
                        $lines = 20;
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
                            $slotSettings->SetGameData('VikingsNETBonusWin', 0);
                            $slotSettings->SetGameData('VikingsNETFreeGames', 0);
                            $slotSettings->SetGameData('VikingsNETCurrentFreeGame', 0);
                            $slotSettings->SetGameData('VikingsNETTotalWin', 0);
                            $slotSettings->SetGameData('VikingsNETBet', $betline);
                            $slotSettings->SetGameData('VikingsNETDenom', $postData['bet_denomination']);
                            $slotSettings->SetGameData('VikingsNETFreeBalance', sprintf('%01.2f', $slotSettings->GetBalance()) * 100);
                            $bonusMpl = 1;
                        } else {
                            $postData['bet_denomination'] = $slotSettings->GetGameData('VikingsNETDenom');
                            $slotSettings->CurrentDenom = $postData['bet_denomination'];
                            $slotSettings->CurrentDenomination = $postData['bet_denomination'];
                            $betline = $slotSettings->GetGameData('VikingsNETBet');
                            $allbet = $betline * $lines;
                            $slotSettings->SetGameData('VikingsNETCurrentFreeGame', $slotSettings->GetGameData('VikingsNETCurrentFreeGame') + 1);
                            $bonusMpl = $slotSettings->slotFreeMpl;
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
                        $mainSymAnim = '';
                        for ($i = 0; $i <= 2000; $i++) {
                            $totalWin = 0;
                            $lineWins = [];
                            require_once __DIR__ . '/Helpers/cwins.php';
                        $cWins = getCWins();
                            $wild = '1';
                            $scatter = '0';
                            $linesId0 = [];
                            if ($postData['slotEvent'] == 'freespin') {
                                $reels = $slotSettings->GetBonusReelStrips();
                            } else {
                                $reels = $slotSettings->GetReelStrips($winType, $postData['slotEvent']);
                            }
                            $reelsTmp = $reels;
                            $stackedOverlay = '';
                            $ovCnt = 0;
                            $hotspot = false;
                            $hotspotSym = -1;
                            $hotspotReel = -1;
                            $vikSym = [
                                4,
                                5,
                                6,
                                7
                            ];
                            $reelLimit = 5;
                            $rowlLimit = 3;
                            for ($r = 1; $r <= $reelLimit; $r++) {
                                foreach ($vikSym as $vs) {
                                    if ($postData['slotEvent'] == 'freespin') {
                                        if ($reels['reel' . $r][0] == $vs && $reels['reel' . $r][1] == $vs && $reels['reel' . $r][2] == $vs) {
                                            $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=2&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                            $ovCnt++;
                                        }
                                        if ($reels['reel' . $r][1] == $vs && $reels['reel' . $r][2] == $vs && $reels['reel' . $r][3] == $vs) {
                                            if ($r == 3 || $r == 4 || $r == 5) {
                                                $hotspot = true;
                                                $hotspotSym = $vs;
                                                $hotspotReel = $r;
                                            }
                                            $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=3&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                            $ovCnt++;
                                        }
                                        if ($reels['reel' . $r][2] == $vs && $reels['reel' . $r][3] == $vs && $reels['reel' . $r][4] == $vs) {
                                            $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=4&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                            $ovCnt++;
                                        }
                                        if ($reels['reel' . $r][0] == $vs && $reels['reel' . $r][1] == $vs && !in_array($reels['reel' . $r][2], $vikSym)) {
                                            $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=1&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                            $ovCnt++;
                                        }
                                        if ($reels['reel' . $r][4] == $vs && $reels['reel' . $r][3] == $vs && !in_array($reels['reel' . $r][5], $vikSym)) {
                                            $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=5&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                            $ovCnt++;
                                        }
                                    } else if ($reels['reel' . $r][0] == $vs && $reels['reel' . $r][1] == $vs && $reels['reel' . $r][2] == $vs) {
                                        $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=2&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                        $ovCnt++;
                                        if ($r == 3) {
                                            $hotspotReel = 3;
                                            $hotspot = true;
                                            $hotspotSym = $vs;
                                        }
                                    } else if ($reels['reel' . $r][0] == $vs && $reels['reel' . $r][1] == $vs) {
                                        $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=1&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                        $ovCnt++;
                                    } else if ($reels['reel' . $r][1] == $vs && $reels['reel' . $r][2] == $vs) {
                                        $stackedOverlay .= ('&stackbottom.i' . $ovCnt . '.reelindex=' . ($r - 1) . '&stackbottom.i' . $ovCnt . '.rowindex=3&stackbottom.i' . $ovCnt . '.symbol=SYM' . $vs);
                                        $ovCnt++;
                                    }
                                }
                            }
                            $featureStr = '';
                            if ($hotspot) {
                                $featureStr = '&feature.hotspot=true';
                                if ($postData['slotEvent'] == 'freespin') {
                                    $reelLimit = 7;
                                    $rowlLimit = 4;
                                } else {
                                    $reelLimit = 5;
                                    $rowlLimit = 2;
                                }
                                for ($r = 1; $r <= $reelLimit; $r++) {
                                    if ($r == $hotspotReel) {
                                    } else {
                                        $pvc = 0;
                                        for ($p = 0; $p <= $rowlLimit; $p++) {
                                            if (($reels['reel' . $r][$p] == 7 || $reels['reel' . $r][$p] == 6 || $reels['reel' . $r][$p] == 5 || $reels['reel' . $r][$p] == 4) && $hotspotSym != $reels['reel' . $r][$p]) {
                                                $reels['reel' . $r][$p] = $hotspotSym;
                                                $featureStr .= ('&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $pvc . '.row=' . $p . '&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $pvc . '.with=SYM' . $hotspotSym . '&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $pvc . '.pos=1&s=' . $reels['reel' . $r][$p] . '&hotspotSym=' . $hotspotSym);
                                                $pvc++;
                                            }
                                        }
                                    }
                                }
                            }
                            $shieldFeature = false;
                            $featureStr0 = '';
                            if (rand(1, 15) == 1) {
                            }
                            if ($hotspot) {
                                $shieldFeature = false;
                            }
                            if ($shieldFeature) {
                                $sWidth = rand(2, 4);
                                $sHeight = rand(2, 3);
                                $rSym = rand(4, 7);
                                $featureStr0 = 'rs.i0.r.i0.overlay.i0.pos=64&ws.i6.types.i0.wintype=coins&gameServerVersion=1.3.0&g4mode=false&historybutton=false&gamestate.history=basic&ws.i4.betline=0&ws.i2.types.i0.cents=12&rs.i0.r.i1.syms=SYM3%2CSYM8%2CSYM6&ws.i1.aftershieldwall=false&feature.shieldwall.rowindex=0&ws.i4.aftershieldwall=false&win.cap.reached=false&totalwin.coins=48&gamestate.current=basic&ws.i7.aftershieldwall=false&rs.i0.r.i2.overlay.i0.row=0&feature.shieldwall.reelindex=1&ws.i6.reelset=basic&stackbottom.i0.rowindex=4&rs.i0.r.i1.overlay.i0.row=0&feature.shieldwall.height=2&isJackpotWin=false&rs.i0.r.i0.pos=64&ws.i2.reelset=basic&stackbottom.i0.symbol=SYM6&rs.i0.r.i1.pos=6&ws.i4.direction=left_to_right&rs.i0.r.i1.overlay.i1.pos=7&ws.i6.types.i0.cents=12&game.win.coins=48&ws.i3.betline=0&rs.i0.r.i1.hold=false&ws.i1.reelset=basic&ws.i1.types.i0.wintype=coins&clientaction=spin&rs.i0.r.i2.hold=false&feature.shieldwall.activated=true&ws.i7.betline=0&ws.i2.betline=0&ws.i0.pos.i2=1%2C0&playercurrency=%26%23x20AC%3B&ws.i7.sym=SYM5&ws.i2.pos.i1=1%2C1&ws.i6.direction=left_to_right&current.rs.i0=basic&ws.i1.pos.i0=0%2C0&ws.i2.pos.i0=0%2C0&ws.i0.reelset=basic&ws.i1.pos.i1=1%2C0&ws.i3.pos.i1=1%2C1&ws.i5.types.i0.wintype=coins&ws.i1.pos.i2=2%2C1&ws.i4.pos.i0=0%2C1&ws.i7.types.i0.wintype=coins&ws.i5.sym=SYM5&rs.i0.r.i2.overlay.i0.pos=111&rs.i0.id=basic&feature.hotspot=false&credit=500016&ws.i0.types.i0.coins=6&stackbottom.i0.reelindex=1&multiplier=1&ws.i3.types.i0.wintype=coins&ws.i4.types.i0.cents=12&ws.i7.direction=left_to_right&ws.i2.aftershieldwall=false&ws.i0.sym=SYM5&rs.i0.r.i0.overlay.i1.pos=65&rs.i0.r.i2.overlay.i1.row=1&ws.i5.aftershieldwall=false&ws.i6.pos.i2=2%2C0&ws.i6.types.i0.coins=6&ws.i0.direction=left_to_right&ws.i6.pos.i0=1%2C1&gamestate.stack=basic&ws.i6.pos.i1=0%2C1&ws.i6.betline=0&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&ws.i0.types.i0.wintype=coins&ws.i4.reelset=basic&rs.i0.r.i0.overlay.i0.row=0&rs.i0.r.i1.overlay.i1.row=1&ws.i3.types.i0.cents=12&ws.i7.types.i0.coins=6&ws.i3.aftershieldwall=false&ws.i0.aftershieldwall=false&playercurrencyiso=' . $slotSettings->slotCurrency . '&rs.i0.r.i1.overlay.i0.pos=6&ws.i5.betline=0&feature.shieldwall.width=3&feature.shieldwall.symbol=SYM' . $rSym . '&ws.i6.aftershieldwall=false&ws.i7.types.i0.cents=12&ws.i5.direction=left_to_right&rs.i0.r.i3.hold=false';
                                for ($r = 2; $r <= 4; $r++) {
                                    $ps = 0;
                                    for ($p = 0; $p <= 1; $p++) {
                                        $reels['reel' . $r][$p] = $rSym;
                                        $featureStr0 .= ('&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $ps . '.row=' . $p . '&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $ps . '.with=SYM' . $rSym . '&rs.i0.r.i' . ($r - 1) . '.overlay.i' . $ps . '.pos=1&s=' . $reels['reel' . $r][$p] . '&hotspotSym=' . $hotspotSym);
                                        $ps++;
                                    }
                                }
                            }
                            $winLineCount = 0;
                            $tmpStringWin = '';
                            $wildsMplArr = [];
                            for ($j = 0; $j < count($slotSettings->SymbolGame); $j++) {
                                $csym = $slotSettings->SymbolGame[$j];
                                if ($csym == $scatter) {
                                } else {
                                    $waysCountArr = [
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0
                                    ];
                                    $waysCount = 1;
                                    $wayPos = [];
                                    $waysLimit = [];
                                    if ($postData['slotEvent'] == 'freespin') {
                                        $waysLimit[20] = [
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ],
                                            [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4
                                            ]
                                        ];
                                        $rwsLim = 7;
                                    } else {
                                        $waysLimit[20] = [
                                            [
                                                0,
                                                1,
                                                2
                                            ],
                                            [
                                                0,
                                                1,
                                                2
                                            ],
                                            [
                                                0,
                                                1,
                                                2
                                            ],
                                            [
                                                0,
                                                1,
                                                2
                                            ],
                                            [
                                                0,
                                                1,
                                                2
                                            ]
                                        ];
                                        $rwsLim = 5;
                                    }
                                    $symPosConvert = [
                                        0,
                                        1,
                                        2,
                                        3,
                                        4,
                                        5,
                                        6
                                    ];
                                    $wildsMpl = 0;
                                    $wscnt = 0;
                                    for ($rws = 1; $rws <= $rwsLim; $rws++) {
                                        $curWays = $waysLimit[20][$rws - 1];
                                        foreach ($curWays as $cws) {
                                            if ($reels['reel' . $rws][$cws] == $csym || $reels['reel' . $rws][$cws] == $wild) {
                                                $waysCountArr[$rws]++;
                                                $wayPos[] = '&ws.i' . $winLineCount . '.pos.i' . $wscnt . '=' . ($rws - 1) . '%2C' . $symPosConvert[$cws];
                                                $wscnt++;
                                            }
                                        }
                                        if ($hotspotSym == $csym && $hotspot) {
                                            $waysCount = $waysCountArr[$rws] * $waysCount;
                                        } else {
                                            if ($waysCountArr[$rws] <= 0) {
                                                break;
                                            }
                                            $waysCount = $waysCountArr[$rws] * $waysCount;
                                        }
                                    }
                                    if ($waysCountArr[1] > 0 && $waysCountArr[2] > 0 && $waysCountArr[3] > 0) {
                                        $cWins[$j] = $slotSettings->Paytable['SYM_' . $csym][3] * $betline * $waysCount * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($waysCountArr[1] > 0 && $waysCountArr[2] > 0 && $waysCountArr[3] > 0 && $waysCountArr[4] > 0) {
                                        $cWins[$j] = $slotSettings->Paytable['SYM_' . $csym][4] * $betline * $waysCount * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($waysCountArr[1] > 0 && $waysCountArr[2] > 0 && $waysCountArr[3] > 0 && $waysCountArr[4] > 0 && $waysCountArr[5] > 0) {
                                        $cWins[$j] = $slotSettings->Paytable['SYM_' . $csym][5] * $betline * $waysCount * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($waysCountArr[1] > 0 && $waysCountArr[2] > 0 && $waysCountArr[3] > 0 && $waysCountArr[4] > 0 && $waysCountArr[5] > 0 && $waysCountArr[6] > 0) {
                                        $cWins[$j] = $slotSettings->Paytable['SYM_' . $csym][6] * $betline * $waysCount * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($waysCountArr[1] > 0 && $waysCountArr[2] > 0 && $waysCountArr[3] > 0 && $waysCountArr[4] > 0 && $waysCountArr[5] > 0 && $waysCountArr[6] > 0 && $waysCountArr[7] > 0) {
                                        $cWins[$j] = $slotSettings->Paytable['SYM_' . $csym][7] * $betline * $waysCount * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($hotspotSym == $csym && $hotspot) {
                                        $vikScatCnt = 0;
                                        for ($viks = 0; $viks < 7; $viks++) {
                                            $vikScatCnt += $waysCountArr[$viks];
                                        }
                                        $cWins[$j] = $slotSettings->Paytable['SCATTER_PAYS'][$vikScatCnt] * $betline * $bonusMpl;
                                        $tmpStringWin = '&ws.i' . $winLineCount . '.reelset=basic&ws.i' . $winLineCount . '.types.i0.coins=' . $cWins[$j] . '&ws.i' . $winLineCount . '.types.i0.wintype=coins&ws.i' . $winLineCount . '.betline=243&ws.i' . $winLineCount . '.sym=SYM' . $csym . '&ws.i' . $winLineCount . '.direction=left_to_right&ws.i' . $winLineCount . '.types.i0.cents=' . ($cWins[$j] * $slotSettings->CurrentDenomination * 100) . '' . implode('', $wayPos);
                                    }
                                    if ($cWins[$j] > 0 && $tmpStringWin != '') {
                                        array_push($lineWins, $tmpStringWin);
                                        $totalWin += $cWins[$j];
                                        $winLineCount++;
                                    }
                                }
                            }
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
                                $scattersStr = '&ws.i0.types.i0.freespins=' . $slotSettings->slotFreeCount[$scattersCount] . '&ws.i0.reelset=basic&ws.i0.betline=null&ws.i0.types.i0.wintype=freespins&ws.i0.direction=none' . implode('', $scPos);
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
                        $reels = $reelsTmp;
                        if ($totalWin > 0) {
                            $slotSettings->SetBank((isset($postData['slotEvent']) ? $postData['slotEvent'] : ''), -1 * $totalWin);
                            $slotSettings->SetBalance($totalWin);
                        }
                        $reportWin = $totalWin;
                        if ($postData['slotEvent'] == 'freespin') {
                            $curReels = '&rs.i0.r.i0.syms=SYM' . $reels['reel1'][0] . '%2CSYM' . $reels['reel1'][1] . '%2CSYM' . $reels['reel1'][2] . '%2CSYM' . $reels['reel1'][3] . '%2CSYM' . $reels['reel1'][4] . '';
                            $curReels .= ('&rs.i0.r.i1.syms=SYM' . $reels['reel2'][0] . '%2CSYM' . $reels['reel2'][1] . '%2CSYM' . $reels['reel2'][2] . '%2CSYM' . $reels['reel2'][3] . '%2CSYM' . $reels['reel2'][4] . '');
                            $curReels .= ('&rs.i0.r.i2.syms=SYM' . $reels['reel3'][0] . '%2CSYM' . $reels['reel3'][1] . '%2CSYM' . $reels['reel3'][2] . '%2CSYM' . $reels['reel3'][3] . '%2CSYM' . $reels['reel3'][4] . '');
                            $curReels .= ('&rs.i0.r.i3.syms=SYM' . $reels['reel4'][0] . '%2CSYM' . $reels['reel4'][1] . '%2CSYM' . $reels['reel4'][2] . '%2CSYM' . $reels['reel4'][3] . '%2CSYM' . $reels['reel4'][4] . '');
                            $curReels .= ('&rs.i0.r.i4.syms=SYM' . $reels['reel5'][0] . '%2CSYM' . $reels['reel5'][1] . '%2CSYM' . $reels['reel5'][2] . '%2CSYM' . $reels['reel5'][3] . '%2CSYM' . $reels['reel5'][4] . '');
                            $curReels .= ('&rs.i0.r.i5.syms=SYM' . $reels['reel6'][0] . '%2CSYM' . $reels['reel6'][1] . '%2CSYM' . $reels['reel6'][2] . '%2CSYM' . $reels['reel6'][3] . '%2CSYM' . $reels['reel6'][4] . '');
                            $curReels .= ('&rs.i0.r.i6.syms=SYM' . $reels['reel7'][0] . '%2CSYM' . $reels['reel7'][1] . '%2CSYM' . $reels['reel7'][2] . '%2CSYM' . $reels['reel7'][3] . '%2CSYM' . $reels['reel7'][4] . '');
                        } else {
                            $curReels = '&rs.i0.r.i0.syms=SYM' . $reels['reel1'][0] . '%2CSYM' . $reels['reel1'][1] . '%2CSYM' . $reels['reel1'][2] . '';
                            $curReels .= ('&rs.i0.r.i1.syms=SYM' . $reels['reel2'][0] . '%2CSYM' . $reels['reel2'][1] . '%2CSYM' . $reels['reel2'][2] . '');
                            $curReels .= ('&rs.i0.r.i2.syms=SYM' . $reels['reel3'][0] . '%2CSYM' . $reels['reel3'][1] . '%2CSYM' . $reels['reel3'][2] . '');
                            $curReels .= ('&rs.i0.r.i3.syms=SYM' . $reels['reel4'][0] . '%2CSYM' . $reels['reel4'][1] . '%2CSYM' . $reels['reel4'][2] . '');
                            $curReels .= ('&rs.i0.r.i4.syms=SYM' . $reels['reel5'][0] . '%2CSYM' . $reels['reel5'][1] . '%2CSYM' . $reels['reel5'][2] . '');
                        }
                        if ($postData['slotEvent'] == 'freespin') {
                            $slotSettings->SetGameData('VikingsNETBonusWin', $slotSettings->GetGameData('VikingsNETBonusWin') + $totalWin);
                            $slotSettings->SetGameData('VikingsNETTotalWin', $slotSettings->GetGameData('VikingsNETTotalWin') + $totalWin);
                        } else {
                            $slotSettings->SetGameData('VikingsNETTotalWin', $totalWin);
                        }
                        $fs = 0;
                        if ($scattersCount >= 3) {
                            $slotSettings->SetGameData('VikingsNETFreeStartWin', $totalWin);
                            $slotSettings->SetGameData('VikingsNETBonusWin', $totalWin);
                            $slotSettings->SetGameData('VikingsNETFreeGames', $slotSettings->slotFreeCount[$scattersCount]);
                            $fs = $slotSettings->GetGameData('VikingsNETFreeGames');
                            $freeState = '&rs.i0.nearwin=4&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&freespins.totalwin.cents=0&nextaction=freespin&freespins.left=' . $fs . '&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=basic%2Cfreespin&freespins.totalwin.coins=' . $totalWin . '&freespins.total=' . $fs . '&freespins.win.cents=0&gamestate.current=freespin&freespins.initial=' . $fs . '&freespins.win.coins=' . $totalWin . '&freespins.betlevel=' . $slotSettings->GetGameData('VikingsNETBet') . '&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination) . '';
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
                        $slotSettings->SetGameData('VikingsNETGambleStep', 5);
                        $hist = $slotSettings->GetGameData('VikingsNETCards');
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
                            $totalWin = $slotSettings->GetGameData('VikingsNETBonusWin');
                            if ($slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') <= $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame')) {
                                $nextaction = 'spin';
                                $stack = 'basic';
                                $gamestate = 'basic';
                                $nextrs = 'basic';
                            } else {
                                $gamestate = 'freespin';
                                $nextaction = 'freespin';
                                $stack = 'basic%2Cfreespin';
                                $nextrs = 'freespin';
                            }
                            $fs = $slotSettings->GetGameData('VikingsNETFreeGames');
                            $fsl = $slotSettings->GetGameData('VikingsNETFreeGames') - $slotSettings->GetGameData('VikingsNETCurrentFreeGame');
                            $freeState = '&freespins.betlines=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19&next.rs=' . $nextrs . '&freespins.totalwin.cents=0&nextaction=' . $nextaction . '&freespins.left=' . $fsl . '&freespins.wavecount=1&freespins.multiplier=1&gamestate.stack=' . $stack . '&freespins.totalwin.coins=' . $totalWin . '&freespins.total=' . $fs . '&freespins.win.cents=' . ($totalWin / $slotSettings->CurrentDenomination * 100) . '&gamestate.current=' . $gamestate . '&freespins.initial=' . $fs . '&freespins.win.coins=' . $totalWin . '&freespins.betlevel=' . $slotSettings->GetGameData('VikingsNETBet') . '&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination) . '';
                            $curReels .= $freeState;
                        }
                        require_once __DIR__ . '/Helpers/spin_response.php';
                        $response = getSpinResponse($postData, $freeState, $lines, $betline, $slotSettings, $balanceInCents, $totalWin, $jsJack, $jsSpin);
                        $slotSettings->SaveLogReport($response, $allbet, $lines, $reportWin, $postData['slotEvent']);
                        $balanceInCents = round($slotSettings->GetBalance() * $slotSettings->CurrentDenom * 100);
                        if ($postData['slotEvent'] == 'freespin') {
                            $result_tmp[0] = 'previous.rs.i0=freespin&freespins.betlevel=1&rs.i0.r.i6.pos=104&gameServerVersion=1.3.0&g4mode=false&freespins.win.coins=0&playercurrency=%26%23x20AC%3B&historybutton=false&current.rs.i0=freespin&rs.i0.r.i4.hold=false&next.rs=freespin&gamestate.history=basic%2Cfreespin&rs.i0.r.i1.syms=SYM9%2CSYM5%2CSYM11%2CSYM12%2CSYM12&rs.i0.r.i5.hold=false&game.win.cents=0&rs.i0.id=freespin&win.cap.reached=false&totalwin.coins=0&feature.hotspot=false&credit=501268&gamestate.current=freespin&freespins.initial=7&rs.i0.r.i6.syms=SYM11%2CSYM9%2CSYM12%2CSYM6%2CSYM12&jackpotcurrency=%26%23x20AC%3B&multiplier=1&last.rs=freespin&freespins.denomination=2.000&rs.i0.r.i0.syms=SYM6%2CSYM10%2CSYM8%2CSYM8%2CSYM10&rs.i0.r.i3.syms=SYM4%2CSYM4%2CSYM11%2CSYM10%2CSYM9&freespins.win.cents=0&freespins.totalwin.coins=0&freespins.total=7&isJackpotWin=false&gamestate.stack=basic%2Cfreespin&rs.i0.r.i0.pos=47&freespins.betlines=0&gamesoundurl=https%3A%2F%2Fstatic.casinomodule.com%2F&rs.i0.r.i1.pos=43&game.win.coins=0&playercurrencyiso=' . $slotSettings->slotCurrency . '&rs.i0.r.i5.syms=SYM9%2CSYM8%2CSYM10%2CSYM9%2CSYM12&rs.i0.r.i1.hold=false&freespins.wavecount=1&freespins.multiplier=1&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&clientaction=freespin&rs.i0.r.i2.hold=false&feature.shieldwall.activated=false&rs.i0.r.i4.syms=SYM4%2CSYM11%2CSYM10%2CSYM9%2CSYM9&rs.i0.r.i2.pos=99&totalwin.cents=0&gameover=false&rs.i0.r.i0.hold=false&rs.i0.r.i6.hold=false&rs.i0.r.i3.pos=57&freespins.left=6&rs.i0.r.i4.pos=42&nextaction=freespin&rs.i0.r.i5.pos=109&wavecount=1&rs.i0.r.i2.syms=SYM8%2CSYM12%2CSYM8%2CSYM7%2CSYM8&rs.i0.r.i3.hold=false&game.win.amount=0.00&freespins.totalwin.cents=0' . $curReels . $winString . $stackedOverlay . $featureStr;
                        } else {
                            $result_tmp[0] = $featureStr0 . 'rs.i0.r.i1.pos=18&g4mode=false&game.win.coins=' . $totalWin . '&playercurrency=%26%23x20AC%3B&playercurrencyiso=' . $slotSettings->slotCurrency . '&historybutton=false&rs.i0.r.i1.hold=false&rs.i0.r.i4.hold=false&gamestate.history=basic&playforfun=false&jackpotcurrencyiso=' . $slotSettings->slotCurrency . '&clientaction=spin&rs.i0.r.i2.hold=false&game.win.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&rs.i0.r.i2.pos=47&rs.i0.id=basic&totalwin.coins=' . $totalWin . '&credit=' . $balanceInCents . '&totalwin.cents=' . ($totalWin * $slotSettings->CurrentDenomination * 100) . '&gamestate.current=basic&gameover=true&rs.i0.r.i0.hold=false&jackpotcurrency=%26%23x20AC%3B&multiplier=1&rs.i0.r.i3.pos=4&rs.i0.r.i4.pos=5&isJackpotWin=false&gamestate.stack=basic&nextaction=spin&rs.i0.r.i0.pos=7&wavecount=1&gamesoundurl=&rs.i0.r.i3.hold=false&game.win.amount=' . ($totalWin / $slotSettings->CurrentDenomination) . '' . $curReels . $winString . $stackedOverlay . $featureStr;
                        }
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
