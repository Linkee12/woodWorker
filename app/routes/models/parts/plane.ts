import * as THREE from "three";
import { Group } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Abs = [number, number, number, number];

export type PanelObject = {
  name: string;
  x: number;
  y: number;
  z: number;
  material: THREE.Material;
  abs: Abs;
};
export type PlaneMaterial = {
  bodyMaterial: THREE.Material;
  frontMaterial: THREE.Material;
};

export function createNewPlane(obj: PanelObject): Group {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(obj.x, obj.y, obj.z),
    obj.material,
  );
  mesh.name = obj.name;
  const group = new Group();
  group.add(mesh);
  addAbs(obj, mesh);

  return group;
}

function addAbs(obj: PanelObject, mesh: THREE.Mesh) {
  const absMaterial = obj.material.clone();

  if ("color" in absMaterial && absMaterial.color instanceof THREE.Color) {
    absMaterial.color.multiplyScalar(0.85);
  }
  let abs;

  obj.abs.forEach((thickness, idx) => {
    if (thickness === 0) return;
    switch (idx) {
      case 0:
        abs = new RoundedBoxGeometry(obj.x, 18, thickness * 2, 5, thickness);
        abs.rotateX(Math.PI / 2);
        abs.translate(0, obj.y / 2, 0);
        mesh.add(new THREE.Mesh(abs, absMaterial));
        break;
      case 1:
        abs = new RoundedBoxGeometry(obj.x, 18, thickness * 2, 5, thickness);
        abs.rotateX(Math.PI / 2);
        abs.translate(0, obj.y / -2, 0);
        mesh.add(new THREE.Mesh(abs, absMaterial));
        break;
      case 2:
        abs = new RoundedBoxGeometry(obj.y, 18, thickness * 2, 5, thickness);
        abs.rotateX(Math.PI / 2);
        abs.rotateZ(Math.PI / 2);
        abs.translate(obj.x / 2, 0, 0);
        mesh.add(new THREE.Mesh(abs, absMaterial));
        break;
      case 3:
        abs = new RoundedBoxGeometry(obj.y, 18, thickness * 2, 5, thickness);
        abs.rotateX(Math.PI / 2);
        abs.rotateZ(Math.PI / 2);
        abs.translate(obj.x / -2, 0, 0);
        mesh.add(new THREE.Mesh(abs, absMaterial));
        break;
    }
  });
}
