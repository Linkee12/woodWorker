import { useLocation } from "react-router";
import { useMemo, useState } from "react";
import * as THREE from "three";
import ThreeDView from "./ThreeDView";
import { CabinetForm } from "./CabinetForm";
import { createBottomCabinet } from "./models/cabinets/createBottomCabinet";
import type { KitchenFormValues } from "./CreateKitchenForm";

export type CabinetSample = {
  name: string;
  img: string;
  create: typeof createBottomCabinet;
};

export default function Edit() {
  const location = useLocation();
  const kitchen = location.state as KitchenFormValues | null;
  const [models, setModels] = useState<THREE.Object3D[]>([]);
  const [selectedId, setSelectedIdx] = useState<number | null>(null);
  const scene = useMemo(() => new THREE.Scene(), []);
  const samples: CabinetSample[] = [
    {
      name: "Bottom cabinet with shelf",
      img: "bottomCabinetWithShelf.png",
      create: createBottomCabinet,
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
        {kitchen && (
          <p className="text-right text-sm text-[#52684f]">
            Kitchen: {kitchen.width} x {kitchen.length} x {kitchen.height} mm
            <span className="ml-2">[{kitchen.type}]</span>
          </p>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <aside className="w-full rounded-2xl border border-[#e1e3da] bg-[#fcfcf8] p-5 shadow-sm md:w-70 md:min-w-0 md:shrink-0">
          {selectedId !== null ? (
            <CabinetForm
              setModels={setModels}
              setSelectedIdx={setSelectedIdx}
              sample={samples[selectedId]}
              kitchen={kitchen}
            />
          ) : (
            samples.map((sample, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-60  p-3  bg-[#728071] hover:bg-[#889081] rounded-xl duration-300 ease-color cursor-pointer"
                onClick={() => setSelectedIdx(index)}
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
          <ThreeDView
            scene={scene}
            models={models}
            kitchen={[
              kitchen?.width ?? 0,
              kitchen?.length ?? 0,
              kitchen?.height ?? 0,
            ]}
          />
        </section>
      </div>
    </main>
  );
}
