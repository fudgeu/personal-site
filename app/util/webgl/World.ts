import { mat4 } from 'gl-matrix';
import { Object3D } from './Object3D';

export type WorldObject = {
  object: Object3D,
  worldPosition: mat4
};

let objects: WorldObject[] = [];

export function addWorldObjectAtOrigin(object: Object3D) {
  objects.push({
    object,
    worldPosition: mat4.create(),
  });
}

export function addWorldObject(object: Object3D, worldPosition: mat4) {
  objects.push({
    object,
    worldPosition,
  });
}

export function getWorldObjects(): WorldObject[] {
  return objects;
}

export function clearWorldObjects() {
  objects = [];
}
