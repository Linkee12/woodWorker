import { Group, Material } from "three";
import { createNewPlane, type PlaneMaterial } from "../../parts/plane";
import { createLeg } from "../../parts/cabinetLeg";
import * as THREE from "three";

export function createBaseCabinet(
  width: number,
  height: number,
  depth: number,
  material: PlaneMaterial,
  legLength = 100,
): Group {
  const group = new Group();
  const pi = Math.PI;
  const backMaterial = new THREE.MeshStandardMaterial({
    name: "korpusz",
    color: 0xffffff,
    roughness: 0.82,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  group.add(
    createNewPlane({
      name: "side_left",
      x: height - 18,
      y: depth,
      z: 18,
      abs: [0, 0, 0.4, 0],
      material: material.bodyMaterial,
    })
      .rotateY(-pi / 2)
      .translateZ(-9)
      .translateY(depth / 2)
      .translateX(height / 2 + 9),
  );
  group.add(
    createNewPlane({
      name: "side_right",
      x: height - 18,
      y: depth,
      z: 18,
      abs: [0, 0, 0.4, 0],
      material: material.bodyMaterial,
    })
      .rotateY(-pi / 2)
      .translateZ(-width + 9)
      .translateY(depth / 2)
      .translateX(height / 2 + 9),
  );
  group.add(
    createNewPlane({
      name: "bottom",
      x: width,
      y: depth,
      z: 18,
      abs: [0, 0, 0.4, 0],
      material: material.bodyMaterial,
    })
      .translateX(width / 2)
      .translateY(depth / 2)
      .translateZ(9),
  );
  group.add(
    createNewPlane({
      name: "back",
      x: width - 2,
      y: height - 2,
      z: 3,
      abs: [0, 0, 0, 0],
      material: backMaterial,
    })
      .rotateX(pi / 2)
      .translateX(width / 2)
      .translateY(height / 2)
      .translateZ(-depth - 1.5),
  );

  group.add(addLegs(width, depth, legLength));

  return group;
}

function addLegs(width: number, depth: number, length: number): Group {
  const legs = new Group();
  const positions = [
    [50, 50],
    [width - 50, 50],
    [50, depth - 50],
    [width - 50, depth - 50],
  ];

  positions.forEach(([x, y], index) => {
    const leg = createLeg(length);
    leg.name = `leg_${index + 1}`;
    leg.position.set(x, y, -length);
    legs.add(leg);
  });

  return legs;
}
