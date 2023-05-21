import { mat4 } from "gl-matrix";
import { BufferContainer } from "./Buffers";
import { ProgramInfo } from "@/app/components/GLView/GLView";

export default function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: BufferContainer, cubeRotation: number) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); // enable depth testing
  gl.depthFunc(gl.LEQUAL); // near objects obscure far objects

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // create perspective matrix
  const fov = (60 * Math.PI) / 180
  const aspectRatio = gl.canvas.width / gl.canvas.height
  const zNear = 0.1
  const zFar = 100

  const projMatrix = mat4.create()
  mat4.perspective(projMatrix, fov, aspectRatio, zNear, zFar)

  // create model view matrix
  const modelViewMatrix = mat4.create()
  mat4.translate( // translate model view matrix a bit away from center
    modelViewMatrix,
    modelViewMatrix,
    [0, 0, -6]
  )

	// rotate cube
	mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [1, 0, 0])
	mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0])
	mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1])

	// create normal matrix
	const normalMatrix = mat4.create()
	mat4.invert(normalMatrix, modelViewMatrix)
	mat4.transpose(normalMatrix, normalMatrix)

	// provide webgl with our attributes and instructions how to read the arrays
  setPositionAttribute(gl, buffers, programInfo)
  setColorAttribute(gl, buffers, programInfo)
	setNormalAttribute(gl, buffers, programInfo)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  // give shader program for drawing
  gl.useProgram(programInfo.program)

  // give webgl our uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projMatrix
  )

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.normalMatrix,
		false,
		normalMatrix
	)

  // tell gl to draw with everything we have provided
	const vertexCount = 36;
	const type = gl.UNSIGNED_SHORT
  const offset = 0
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
}

function setPositionAttribute(gl: WebGLRenderingContext, buffers: BufferContainer, programInfo: ProgramInfo) {
  const numComponents = 3 // 3 values per vertex
  const type = gl.FLOAT // the data in the buffer are 32 bit floats
  const normalize = false
  const stride = 0
  const offset = 0

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions) // give webgl our position buffer
  gl.vertexAttribPointer( //tell webgl how to read through and where to supply the positions in our shader
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

function setColorAttribute(gl: WebGLRenderingContext, buffers: BufferContainer, programInfo: ProgramInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setNormalAttribute(gl: WebGLRenderingContext, buffers: BufferContainer, programInfo: ProgramInfo) {
	const numComponents = 3
	const type = gl.FLOAT
	const normalize = false
	const stride = 0
	const offset = 0

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals)
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexNormal,
		numComponents,
		type,
		normalize,
		stride,
		offset
	)
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
}