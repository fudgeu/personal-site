import { mat4 } from "gl-matrix"
import { BufferContainer } from "./Buffers"

export type Object3D = {
	buffers: BufferContainer,
	localPosition: mat4
}

export function createObject(buffers: BufferContainer): Object3D {
	return {
		buffers,
		localPosition: mat4.create()
	}
}