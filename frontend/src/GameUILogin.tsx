import { useEffect, useState } from "react"

function GameUiLogin({preLoadProgress, showLogin}: {preLoadProgress: number, showLogin: boolean}) {

  const currentProgress = preLoadProgress
  const progressStyle = {
    width: currentProgress+"%"
  }

  return (
    <div className="w-full h-full backdrop-blur-xl bg-white/30 relative ">
      <div className="flex h-[720px]">
        <div className="m-auto">
          <img src="./assets/quiz_logo.png" className="w-[400px] h-auto" alt="..." />
          <div
            className={`transition-all  ${
                !showLogin ? "opacity-100" : "opacity-0"
              }`}
            >
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-4">
              <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={progressStyle}> {currentProgress}%</div>
            </div>
          </div>
          <div
          className={`transition-all duration-1000 ease-in-out ${
            showLogin ? "opacity-100" : "opacity-0"
            }`}
          >
          <div className="w-[290px] m-auto transition-all">
            <input className="shadow appearance-none border rounded w-[200px] h-[50px] h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
            <button type="button" className=" btn btn-hollow h-[47px] w-[80px] ml-2" > Login </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GameUiLogin;
