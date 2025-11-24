<?php

namespace Games\CreatureFromTheBlackLagoonNET;

function getSpinResponse($postData, $slotSettings, $freeState, $lines, $betline, $balanceInCents, $totalWin, $jsJack, $jsSpin) {
    return '{"responseEvent":"spin","responseType":"' . $postData['slotEvent'] . '","serverResponse":{"FreeLevel":' . $slotSettings->GetGameData('CreatureFromTheBlackLagoonNETFreeLevel') . ',"MonsterHealth":' . $slotSettings->GetGameData('CreatureFromTheBlackLagoonNETMonsterHealth') . ',"freeState":"' . str_replace('"', '\\"', $freeState) . '","slotLines":' . $lines . ',"slotBet":' . $betline . ',"totalFreeGames":' . $slotSettings->GetGameData('CreatureFromTheBlackLagoonNETFreeGames') . ',"currentFreeGames":' . $slotSettings->GetGameData('CreatureFromTheBlackLagoonNETCurrentFreeGame') . ',"Balance":' . $balanceInCents . ',"afterBalance":' . $balanceInCents . ',"bonusWin":' . $slotSettings->GetGameData('CreatureFromTheBlackLagoonNETBonusWin') . ',"totalWin":' . $totalWin . ',"winLines":[],"Jackpots":' . $jsJack . ',"reelsSymbols":' . $jsSpin . '}}';
}
