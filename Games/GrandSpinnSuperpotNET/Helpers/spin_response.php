<?php

namespace Games\GrandSpinnSuperpotNET;

function getSpinResponse($postData, $freeState, $lines, $betline, $slotSettings, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"freeState":"' . $freeState . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData('GrandSpinnSuperpotNETFreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData('GrandSpinnSuperpotNETCurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData('GrandSpinnSuperpotNETBonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
