import { mat4 } from "gl-matrix"
import { BufferContainer } from "./Buffers"

export type Object3D = {
	buffers: BufferContainer,
	position: mat4
}

export function createObject(buffers: BufferContainer): Object3D {
	return {
		buffers,
		position: mat4.create()
	}
}