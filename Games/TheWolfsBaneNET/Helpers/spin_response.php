<?php

namespace Games\TheWolfsBaneNET;

function getSpinResponse($postData, $slotSettings, $freeState, $lines, $betline, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"GameDenom":' . $slotSettings->GetGameData($slotSettings->slotId . 'GameDenom') . ',"ReelsType":"' . $slotSettings->GetGameData($slotSettings->slotId . 'ReelsType') . '","freeState":"' . str_replace('"', '\\"', $freeState) . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'FreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData($slotSettings->slotId . 'CurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData($slotSettings->slotId . 'BonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
