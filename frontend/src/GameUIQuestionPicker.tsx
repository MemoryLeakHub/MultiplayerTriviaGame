import { useEffect, useState } from "react";
import {TileType} from "./BoardTile"

function GameUIQuestionPicker({state, curPlayer, onAnswer}) {
   // {
  //   text:"What color is the sky",
  //   answers: ["Blue","Red","Green","Yellow"],
  //   type: 1,
  //   correctAnswer: 0,
  //   botRange: [],
  // }

  const player = state.playerIdToPlayerState[curPlayer.id]
  const [answer, setAnswer] = useState({answerIndex: -1, isSelected: 0});
 
  const [attacker, setAttacker] = useState(null)
  const [defender, setDefender] = useState(null)
  const onAnswerClick = (index) => {
    // only if we have not answered already
    if (player.answer === null) {
      if (answer.isSelected === 2) {
        return;
      }

      if (answer.answerIndex === index && answer.isSelected === 1) {
        setAnswer({
          answerIndex: index,
          isSelected: 2
        })
        onAnswer(answer.answerIndex)
      } else {
        setAnswer({
          answerIndex: index,
          isSelected: 1
        })
      }
    }
  }

  useEffect(() => {
    const attackerId = getCurrentPlayerIdFromAttackOrder(state)
    const defenderId = state.tileAttackDefender
    const attacker = state.playerIdToPlayerState[attackerId]
    const defender = state.playerIdToPlayerState[defenderId]

    setAttacker(attacker)
    setDefender(defender)
  }, [state]);

  function getCurrentPlayerIdFromAttackOrder(state) { 
    let playerIdFromAttackerOrder = ""
    Object.entries(state.playerIdToPlayerState).map(([playerId, player]: any) => { 
      if (player.type === state.tileAttackOrder[state.tileAttackRound]) {
        playerIdFromAttackerOrder =  playerId
      }
    })
  
    return playerIdFromAttackerOrder
  }
  return (
    <div className="flex m-auto w-[1200px] h-[720px] absolute top-0">
        <div className="w-[700px] h-[420px] backdrop-blur-xl bg-white/30 relative rounded-lg m-auto">
            <div>
              <div className="w-[700px] h-[280px]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >
                {(attacker !== null && defender !== null) ? 
                <h3 className="font-medium leading-tight text-2xl mt-0 mb-2 text-orange-700 text-center">{attacker.username} attacks {defender.username}</h3> : 
                ""
                }
              <h3 className="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-900 p-6 text-center">{state.question.text}</h3>
              <div className="m-auto w-[600px] grid grid-cols-2 gap-2">
                  {state.question.answers.map((value, index) => {
                    let answerStyle = " rounded-full h-[60px] text-white w-full pt-2 pb-2 focus:outline-none focus:ring focus:ring-violet-300 bg-violet-500 "
                    
                    if (state.gamePhase !== "ShowAnswersPickTileToAttackBattle") {
                      if (answer.answerIndex !== -1) {
                          if (answer.answerIndex === index ) {
                            if (answer.isSelected === 1) {
                                answerStyle += " border-4  border border-yellow-500 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 "
                            } else {
                              answerStyle += "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 "
                            }
                          } else {
                            answerStyle += " bg-violet-500 hover:bg-violet-600 active:bg-violet-700 "
                          }
                      } else {
                        answerStyle += " bg-violet-500 hover:bg-violet-600 active:bg-violet-700 "
                      }
                    } else {
                     if (attacker !== null && defender !== null) { 
                        if (index === state.question.correctAnswer) {
                          answerStyle += " bg-violet-500 hover:bg-violet-600 active:bg-violet-700 border-4  border border-yellow-500 "
                        }

                        let attackerColorGradient = " from-blue-900 "
                        let attackerColor = " bg-blue-900 "
                        if (attacker.type === TileType.PLAYER_GREEN) {
                          attackerColorGradient = " from-emerald-700 "
                          attackerColor = " bg-emerald-700 "
                        } else if (attacker.type === TileType.PLAYER_RED) {
                          attackerColorGradient = "from-red-400 "
                          attackerColor = " bg-red-400 "
                        }

                        let defenderColorGradient = " to-blue-900 "
                        let defenderColor = " bg-blue-900 "
                        if (defender.type === TileType.PLAYER_GREEN) {
                          defenderColorGradient = " to-emerald-700 "
                          defenderColor = " bg-emerald-700 "
                        } else if (defender.type === TileType.PLAYER_RED) {
                          defenderColorGradient = " to-red-400 "
                          defenderColor = " bg-red-400 "
                        }

                        console.log("attacker.answer: " + attacker.answer)
                        console.log("defender.answer: " + defender.answer)
                        console.log("index: " + index)
                        if (attacker.answer !== null && attacker.answer === defender.answer && attacker.answer === index) {
                          answerStyle += " bg-gradient-to-r " + attackerColorGradient + " " + defenderColorGradient
                        } else if (attacker.answer !== null && attacker.answer === index) {
                          answerStyle += attackerColor
                        } else if (defender.answer !== null && defender.answer === index) {
                          answerStyle += defenderColor
                        }
                     }
                    }
                    return (
                      <button onClick={()=> {onAnswerClick(index)}} className={answerStyle}>
                      {value}
                      </button>
                    )
                  })}
              </div>
              </div>
              </div>
        </div>
    </div>
  );
}
export default GameUIQuestionPicker;
