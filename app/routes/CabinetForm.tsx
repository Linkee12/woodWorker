import type { Dispatch, SetStateAction } from "react";
import { createBottomCabinet } from "./models/cabinets/createBottomCabinet";
import type { PlaneMaterial } from "./models/parts/plane";
import * as THREE from "three";
import type { CabinetSample } from "./edit";

type CabinetFormProps = {
  setModels: Dispatch<SetStateAction<THREE.Object3D[]>>;
  setSelectedId: Dispatch<SetStateAction<string>>;
  sample: CabinetSample;
};

type CabinetFormModel = {
  height: string;
  width: string;
  depth: string;
  shelf: string;
};

export function CabinetForm(props: CabinetFormProps) {
  const rows = [
    { name: "height", unit: "mm" },
    { name: "width", unit: "mm" },
    { name: "depth", unit: "mm" },
    { name: "shelf", unit: "pcs" },
  ];

  const planeMaterial: PlaneMaterial = {
    bodyMaterial: new THREE.MeshStandardMaterial({
      name: "korpusz",
      color: 0xd7c6aa,
      roughness: 0.82,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    frontMaterial: new THREE.MeshStandardMaterial({
      name: "front",
      color: 0x803c37,
      roughness: 0.9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    }),
  };

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const model: CabinetFormModel = {
      height: String(formData.get("height") ?? ""),
      width: String(formData.get("width") ?? ""),
      depth: String(formData.get("depth") ?? ""),
      shelf: String(formData.get("shelf") ?? ""),
    };

    const newModel = createBottomCabinet(
      Number(model.width),
      Number(model.height),
      Number(model.depth),
      Number(model.shelf),
      planeMaterial,
    );

    props.setModels((currentModels) => [...currentModels, newModel]);
    props.setSelectedId("");
  }

  return (
    <form onSubmit={handleSubmit}>
      {rows.map((row) => (
        <div className="flex m-1 items-center">
          <label className="flex flex-1 text-mainText text-xl mr-3">
            <b>{row.name}</b>
          </label>
          <div className="flex items-center rounded-md border border-mainText focus-within:ring-2 focus-within:ring-mainText">
            <input
              className="w-full flex-1 bg-transparent px-3 py-2 outline-none"
              name={row.name}
            />
            <span className="pr-3 text-gray-500 text-sm">{row.unit}</span>
          </div>
        </div>
      ))}
      <button
        className="mt-4 w-full rounded-md bg-mainText px-4 py-2 text-base font-semibold text-white shadow-sm transition duration-100 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainText active:scale-[0.99]"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
