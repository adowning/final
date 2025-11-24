<?php

namespace Games\LightsNET;

function getSpinResponse($postData, $freeState, $lines, $betline, $slotSettings, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"freeState":"' . $freeState . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData('LightsNETFreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData('LightsNETCurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData('LightsNETBonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
