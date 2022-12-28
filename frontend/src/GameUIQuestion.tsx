
function GameUIQuestion() {

  return (
    <div className="flex m-auto w-[1200px] h-[720px] absolute top-0">
        <div className="w-[700px] h-[420px] backdrop-blur-xl bg-white/30 relative rounded-lg m-auto">
          <div className="m-auto w-[300px]">
            <label className="relative block w-[220px] inline-block pr-2">
              <input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Number..." type="text" name="search" onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}/>
            </label>
            <button className="rounded-full text-white w-[80px] pt-2 pb-2 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ...">
              Submit
            </button>
          </div>
        </div>
    </div>
  );
}
export default GameUIQuestion;
