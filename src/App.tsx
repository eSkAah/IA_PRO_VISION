import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import { useCallback, useState } from "react";

type Inputs = {
  prompt: string;
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [answers, setAnswers] = useState<string[]>([]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    try {
      const res = await fetch(`http://localhost:3001/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      console.log("Res front", res);
      if (res.message) {
        setAnswers((prev) => [...prev, res.answer]);
      }
    } catch (error) {
      console.log("Error front", error);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl  font-bold underline">Hello Poker Pro !</h1>

      {answers.length > 0 && (
        <div>
          {answers.map((answer, index) => (
            <div key={index} className="border border-black rounded p-4 m-2">
              {answer}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-11">
            <textarea
              className="border border-black rounded p-1 w-full "
              {...register("prompt", { required: true })}
            />
          </div>

          <div className="col-span-1">
            <button
              type="submit"
              className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
            >
              <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              ASK
            </button>
          </div>
        </div>

        {errors.prompt && (
          <span className="col-span-1 text-red-700 border border-red-700 bg-red-200 p-4 rounded">
            Ask me something !
          </span>
        )}
      </form>
    </>
  );
}

export default App;
