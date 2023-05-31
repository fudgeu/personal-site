import { mat4 } from "gl-matrix"
import { MeshWithBuffers } from "webgl-obj-loader"

export type Object3D = {
	buffers: MeshWithBuffers,
	localPosition: mat4
}

export function createObject(buffers: MeshWithBuffers): Object3D {
	return {
		buffers,
		localPosition: mat4.create()
	}
}