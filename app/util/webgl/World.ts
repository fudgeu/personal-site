import { Object3D } from "./Object3D";

let objects: Object3D[] = []

export function addWorldObject(object: Object3D) {
	objects.push(object)
}

export function getWorldObjects() {
	return objects
}

export function clearWorldObjects() {
	objects = []
}