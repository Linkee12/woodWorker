import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "WoodWorker" }];
}

export default function Home() {
  const navigate = useNavigate();
  const categories = [
    {
      id: 1,
      name: "Kitchen",
      img: "kitchen.png",
    },
  ];

  return (
    <main className="flex min-h-dvh flex-col bg-[#f5f4ef] p-3 text-[#303a32] sm:p-5">
      <header className="mb-4 flex items-center justify-between gap-4 px-1">
        <div>
          <p className="text-lg font-semibold tracking-[0.2em] text-mainText">
            WOODWORKER
          </p>
        </div>
        <span className="rounded-full border border-[#d4dfd0] bg-[#e8eee3] px-3 py-1.5 text-xs font-medium text-[#52684f]">
          Categories
        </span>
      </header>

      <section
        aria-label="Categories"
        className="flex flex-1 flex-col items-center rounded-2xl border border-[#d9dfd4] bg-[#e9ede7] p-5 shadow-sm"
      >
        <h1 className="text-4xl font-bold text-[#303a32]">WoodWorker</h1>

        <div className="mt-10 rounded-2xl border border-[#e1e3da] bg-[#fcfcf8] p-5 shadow-sm">
          <div className="flex flex-wrap gap-4">
            {categories.map((item) => (
              <div
                key={item.id}
                className="flex w-60 cursor-pointer flex-col items-center rounded-xl bg-[#728071] p-3 duration-300 ease-color hover:bg-[#889081]"
                onClick={() => {
                  const url = item?.name ? `/edit/${item.name}` : "/edit";
                  navigate(url);
                }}
              >
                <img src={"/" + item.img} className="rounded-lg" />
                <h2 className="mt-2 text-amber-50">
                  <b>Create new kitchen</b>
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
