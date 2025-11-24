<?php

namespace Games\WingsOfRichesNET;

function getSpinResponse($postData, $slotSettings, $freeState, $lines, $betline, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"Mpl":' . $slotSettings->GetGameData($slotSettings->slotId . 'Mpl') . ',"freeState":"' . $freeState . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData($slotSettings->slotId . 'BonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
