import { CylinderGeometry, Group, Mesh, MeshStandardMaterial } from "three";

export function createLeg(length: number): Group {
  const leg = new Group();
  const shaftLength = length - 40;

  const legMaterial = new MeshStandardMaterial({ color: 0x000000 });
  const verticalRotation = Math.PI / 2;

  const foot = new Mesh(new CylinderGeometry(25, 25, 15, 32), legMaterial);
  foot.name = "leg_foot";
  foot.rotateX(verticalRotation);
  foot.position.z = 7.5;

  const shaft = new Mesh(
    new CylinderGeometry(15, 15, shaftLength, 32),
    legMaterial,
  );
  shaft.name = "leg_shaft";
  shaft.rotateX(verticalRotation);
  shaft.position.z = 15 + shaftLength / 2;

  const top = new Mesh(new CylinderGeometry(25, 25, 25, 32), legMaterial);
  top.name = "leg_top";
  top.rotateX(verticalRotation);
  top.position.z = 15 + shaftLength + 12.5;

  leg.add(foot, shaft, top);
  return leg;
}
