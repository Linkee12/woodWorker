import * as THREE from "three";
import { createBaseCabinet } from "./bottomCabinets/baseCabinet";
import { createNewPlane, type PlaneMaterial } from "../parts/plane";
import type { Group } from "three/examples/jsm/libs/tween.module.js";

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

const pi = Math.PI;

export function createBottomCabinet(
  width: number,
  height: number,
  depth: number,
  selve = 0,
  material: PlaneMaterial,
) {
  const group = new THREE.Group();
  group.add(createBaseCabinet(width, height, depth, material));
  //doors
  group.add(
    createNewPlane({
      name: "leftDoor",
      x: height - 6,
      y: (width - 9) / 2,
      z: 18,
      abs: [2, 2, 2, 2],
      material: material.frontMaterial,
    })
      .rotateX(pi / 2)
      .rotateZ(pi / 2)
      .translateY(-3 + -(width - 9) / 4)
      .translateZ(9)
      .translateX(height / 2),
  );
  group.add(
    createNewPlane({
      name: "rightDoor",
      x: height - 6,
      y: (width - 9) / 2,
      z: 18,
      abs: [2, 2, 2, 2],
      material: material.frontMaterial,
    })
      .rotateX(pi / 2)
      .rotateZ(pi / 2)
      .translateY(-width + 3 + (width - 9) / 4)
      .translateZ(9)
      .translateX(height / 2),
  );
  group.add(
    createNewPlane({
      name: "top_rail_back",
      x: width - 36,
      y: 100,
      z: 18,
      abs: [0.4, 0.4, 0, 0],
      material: material.bodyMaterial,
    })
      .translateX(width / 2)
      .translateY(depth - 50)
      .translateZ(height - 9),
  );
  group.add(
    createNewPlane({
      name: "top_rail_front",
      x: width - 36,
      y: 100,
      z: 18,
      abs: [0.4, 0.4, 0, 0],
      material: material.bodyMaterial,
    })
      .translateX(width / 2)
      .translateY(50)
      .translateZ(height - 9),
  );

  for (let index = 0; index < selve; index++) {
    console.log(selve + 1);
    group.add(
      createNewPlane({
        name: "shelf",
        x: width - 36,
        y: depth - 10,
        z: 18,
        abs: [0.4, 0, 0, 0],
        material: material.bodyMaterial,
      })
        .translateX(width / 2)
        .translateY(depth / 2)
        .translateZ((height / (selve + 1)) * (index + 1)),
    );
  }
  return group;
}
