<?php

namespace Games\TurnYourFortuneNET;

function getSpinResponse($postData, $freeState, $lines, $betline, $slotSettings, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"freeState":"' . $freeState . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData($slotSettings->slotId . 'BonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
