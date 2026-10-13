import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createLeg } from "../accessories/accessories";
export type AbsThickness = 0.4 | 1 | 2;
type Side = "+x" | "-x" | "+y" | "-y" | "+z" | "-z";
type Edges = Partial<Record<Side, AbsThickness>>;

type PanelObject = {
  name: string;
  x: number;
  y: number;
  z: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  material?: THREE.Material;
  edges?: Edges;
};
export type BottomCabinet = {
  model: THREE.Group<THREE.Object3DEventMap>;
  partList: {
    size: number[];
    material: string | undefined;
    abs: {
      thickness: number;
      length: number;
    };
  }[];
};
export type PartList = {
  size: number[];
  material: string | undefined;
  abs: {
    thickness: number;
    length: number;
  };
}[];
const pi = Math.PI;
const bodyMaterial = new THREE.MeshStandardMaterial({
  name: "korpusz",
  color: 0xd7c6aa,
  roughness: 0.82,
  metalness: 0,
  side: THREE.DoubleSide,
});
const backMaterial = new THREE.MeshStandardMaterial({
  name: "farost",
  color: 0xeee8dc,
  roughness: 0.9,
  side: THREE.DoubleSide,
});
const frontMaterial = new THREE.MeshStandardMaterial({
  name: "front",
  color: 0x803c37,
  roughness: 0.9,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5,
});
const absMaterial = new THREE.MeshStandardMaterial({
  color: 0xc8b797,
  roughness: 0.75,
});

const addEdge = (panel: THREE.Mesh, side: Side, t: AbsThickness) => {
  const {
    width: x,
    height: y,
    depth: z,
  } = (panel.geometry as THREE.BoxGeometry).parameters;

  const axis = side[1] as "x" | "y" | "z";
  const dir = side[0] === "+" ? 1 : -1;

  const size: [number, number, number] = [
    axis === "x" ? t : x,
    axis === "y" ? t : y,
    axis === "z" ? t : z,
  ];
  const offset: [number, number, number] = [
    axis === "x" ? dir * (x / 2 + t / 2) : 0,
    axis === "y" ? dir * (y / 2 + t / 2) : 0,
    axis === "z" ? dir * (z / 2 + t / 2) : 0,
  ];

  const geo = new RoundedBoxGeometry(...size, 4, Math.min(t / 2, 1));
  const strip = new THREE.Mesh(geo, panel.material);
  strip.position.set(...offset);
  strip.name = `abs_${side}_${t}`;
  panel.add(strip);
};

const addPanel = (box: THREE.Group, obj: PanelObject) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(obj.x, obj.y, obj.z),
    obj.material ?? bodyMaterial,
  );
  mesh.name = obj.name;
  mesh.position.set(...obj.position);
  mesh.rotation.set(...(obj.rotation ?? [0, 0, 0]));
  box.add(mesh);

  if (obj.edges) {
    (Object.entries(obj.edges) as [Side, AbsThickness][]).forEach(([side, t]) =>
      addEdge(mesh, side, t),
    );
  }
  return mesh;
};
const addLegs = (
  box: THREE.Group,
  width: number,
  depht: number,
  legHeight = 100,
) => {
  const inset = 50;
  const xs = [inset, width - inset];
  const ys = [inset, depht - inset];

  xs.forEach((x) =>
    ys.forEach((y) => {
      box.add(createLeg({ x, y, z: 0 }, legHeight));
    }),
  );
};

function calculatePartList(planes: PanelObject[]) {
  return planes.map((plane) => {
    return {
      size: [plane.x, plane.y, plane.z],
      material: plane.material?.name,
      abs: { thickness: 0, length: 0 },
    };
  });
}

export function createBottomCabinet(
  width: number,
  height: number,
  depht: number,
  selve = 0,
) {
  const box = new THREE.Group();
  const planes: PanelObject[] = [
    ...createBaseBottomCabinet(width, height, depht),
    {
      name: "top_rail_front",
      x: width,
      y: 100,
      z: 18,
      position: [width / 2, 50, height - 9],
      rotation: [0, 0, 0],
      edges: { "-y": 0.4, "+y": 0.4 },
      material: bodyMaterial,
    },
    {
      name: "top_rail_back",
      x: width,
      y: 100,
      z: 18,
      position: [width / 2, depht - 50, height - 9],
      rotation: [0, 0, 0],
      edges: { "-y": 0.4, "+y": 0.4 },
      material: bodyMaterial,
    },
    ...Array.from(
      { length: selve },
      (_, i): PanelObject => ({
        name: `shelf_${i + 1}`,
        x: width,
        y: depht - 10,
        z: 18,
        position: [width / 2, depht / 2 + 5, (height / (selve + 1)) * (i + 1)],
        edges: { "-y": 0.4 },
      }),
    ),

    //doors
    {
      name: "leftDoor",
      x: height - 6,
      y: (width - 9) / 2,
      z: 18,
      rotation: [pi / 2, 0, pi / 2],
      position: [(width - 3) / 4, -9, height / 2 - 3],
      material: frontMaterial,
      edges: { "-y": 2, "+y": 2, "-x": 2, "+x": 2 },
    },
    {
      name: "rightDoor",
      x: height - 6,
      y: (width - 9) / 2,
      z: 18,
      rotation: [pi / 2, 0, pi / 2],
      position: [width - (width - 3) / 4, -9, height / 2 - 3],
      material: frontMaterial,
      edges: { "-y": 2, "+y": 2, "-x": 2, "+x": 2 },
    },
  ];

  planes.forEach((plane) => addPanel(box, plane));
  addLegs(box, width, depht);
  box.translateZ(100);
  return {
    model: box,
    partList: calculatePartList(planes),
  };
}

function createBaseBottomCabinet(
  width: number,
  height: number,
  depht: number,
): PanelObject[] {
  return [
    {
      name: "side_left",
      x: height - 18,
      y: depht,
      z: 18,
      rotation: [0, pi / 2, 0],
      position: [9, depht / 2, height / 2 + 9],
      edges: { "-y": 0.4 },
      material: bodyMaterial,
    },
    {
      name: "side_right",
      x: height - 18,
      y: depht,
      z: 18,
      position: [width - 9, depht / 2, height / 2 + 9],
      rotation: [0, pi / 2, 0],
      edges: { "-y": 0.4 },
      material: bodyMaterial,
    },
    {
      name: "bottom",
      x: width,
      y: depht,
      z: 18,
      position: [width / 2, depht / 2, 9],
      rotation: [0, 0, 0],
      edges: { "-y": 0.4 },
      material: bodyMaterial,
    },
    {
      name: "back",
      x: width - 2,
      y: height - 2,
      z: 3,
      rotation: [pi / 2, 0, 0],
      position: [width / 2 + 1, depht + 1.5, height / 2 + 1],
      material: backMaterial,
    },
  ];
}
