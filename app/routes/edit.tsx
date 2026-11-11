import { useMemo, useState } from "react";
import * as THREE from "three";
import ThreeDView from "./3dView";
import { createBaseCabinet } from "./models/cabinets/bottomCabinets/baseCabinet";
import { CabinetForm } from "./CabinetForm";

export type CabinetSample = {
  id: string;
  name: string;
  img: string;
  create: typeof createBaseCabinet;
};

export default function Edit() {
  const [models, setModels] = useState<THREE.Object3D[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const scene = useMemo(() => new THREE.Scene(), []);
  const samples: CabinetSample[] = [
    {
      id: "bottomCabinetWithShelf",
      name: "Bottom cabinet with shelf",
      img: "bottomCabinetWithShelf.png",
      create: createBaseCabinet,
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
      </header>

      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <aside className="rounded-2xl border border-[#e1e3da] bg-[#fcfcf8] p-5 shadow-sm  md:shrink-0">
          {selectedId !== "" ? (
            <CabinetForm setModels={setModels} setSelectedId={setSelectedId} sample={samples[selectedId]}/>
          ) : (
            samples.map((sample) => (
              <div
                key={sample.id}
                className="flex flex-col items-center w-60  p-3  bg-[#728071] hover:bg-[#889081] rounded-xl duration-300 ease-color cursor-pointer"
                onClick={() => setSelectedId(sample.id)}
              >
                <img src={"/" + sample.img} className="rounded-lg"></img>
                <h2 className="text-amber-50 mt-2">
                  <b>{sample.name}</b>
                </h2>
              </div>
            ))
          )}
        </aside>

        <section
          aria-label="Modell előnézete"
          className="flex flex-1 flex-col  rounded-2xl border border-[#d9dfd4] bg-[#e9ede7] shadow-sm"
        >
          <ThreeDView scene={scene} models={models} />
        </section>
      </div>
    </main>
  );
}
