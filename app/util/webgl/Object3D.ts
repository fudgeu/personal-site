import { mat4 } from "gl-matrix"
import { BufferContainer } from "./Buffers"
import { Mesh } from "webgl-obj-loader"

export type Object3D = {
	buffers: Mesh,
	localPosition: mat4
}

export function createObject(buffers: Mesh): Object3D {
	return {
		buffers,
		localPosition: mat4.create()
	}
}