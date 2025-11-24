<?php

namespace Games\WildWaterNET;

function getFreeState($lastEvent, $slotSettings, $freeState, $reels, $curReels) {
    return '';
                        if ($lastEvent != 'NULL') {
                            $slotSettings->SetGameData($slotSettings->slotId . 'BonusWin', $lastEvent->serverResponse->bonusWin);
                            $slotSettings->SetGameData($slotSettings->slotId . 'FreeGames', $lastEvent->serverResponse->totalFreeGames);
                            $slotSettings->SetGameData($slotSettings->slotId . 'CurrentFreeGame', $lastEvent->serverResponse->currentFreeGames);
                            $slotSettings->SetGameData($slotSettings->slotId . 'TotalWin', $lastEvent->serverResponse->bonusWin);
                            $slotSettings->SetGameData($slotSettings->slotId . 'FreeBalance', $lastEvent->serverResponse->Balance);
                            $freeState = $lastEvent->serverResponse->freeState;
                            $reels = $lastEvent->serverResponse->reelsSymbols;
                            $curReels = '&rs.i0.r.i0.syms=SYM' . $reels->reel1[0] . '%2CSYM' . $reels->reel1[1] . '%2CSYM' . $reels->reel1[2] . '';
}
