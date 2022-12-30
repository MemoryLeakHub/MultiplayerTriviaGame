import { useState } from "react";
import GameUIQuestionNumberPlayer from "./GameUIQuestionNumberPlayer"
function GameUIQuestion({state, curPlayer, onAnswer}) {
  // {
  //   text:"How much is 2*2",
  //   answers: [],
  //   type: 0,
  //   correctAnswer: 4,
  //   botRange: [0,10]
  // }

  const player = state.playerIdToPlayerState[curPlayer.id]
  const [answer, setAnswer] = useState("");
  const onAnswerClick = () => {
    // only if we have not answered already
    if (player.answer === null) {
      onAnswer(answer)
    }
  }

  return (
    <div className="flex m-auto w-[1200px] h-[720px] absolute top-0">
        <div className="w-[700px] h-[420px] backdrop-blur-xl bg-white/30 relative rounded-lg m-auto">
            <div
              className={` transition-all duration-1000 ease-in-out ${
                state.gamePhase === "ShowEmptyTileBattleAnswers" ? "opacity-100" : "opacity-0"
                }`}
              >
                {(state.gamePhase === "ShowEmptyTileBattleAnswers") ? <div className="m-auto w-[280px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div>
                        <h3 className="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-900 p-6 text-center">Correct Answer {state.question.correctAnswer}</h3>
                        </div>
                      <GameUIQuestionNumberPlayer player={state.playerIdToPlayerState[state.answerPlacements[0]]} place={1} />
                      <GameUIQuestionNumberPlayer player={state.playerIdToPlayerState[state.answerPlacements[1]]} place={2} />
                      <GameUIQuestionNumberPlayer player={state.playerIdToPlayerState[state.answerPlacements[2]]} place={3} />
                  </div> : ""
                }
            </div>
            <div
              className={`transition-all duration-1000 ease-in-out ${
                state.gamePhase === "EmptyTileBattle" ? "opacity-100" : "opacity-0"
                }`}
              >
              <div className="w-[700px] h-[280px]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >
              <h3 className="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-900 p-6 text-center">{state.question.text}</h3>
              <div className="m-auto w-[300px]">
                <label className="relative block w-[220px] inline-block pr-2">
                  <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" 
                  placeholder="Enter Number..." 
                  type="text" 
                  name="answer"
                  onChange={(e) => {
                    setAnswer(e.target.value)
                  }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}/>
                </label>
                <button onClick={()=> {onAnswerClick()}} className="rounded-full text-white w-[80px] pt-2 pb-2 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ...">
                  Submit
                </button>
              </div>
              </div>
              </div>
        </div>
    </div>
  );
}
export default GameUIQuestion;
