import { mat4 } from "gl-matrix";
import { BufferContainer } from "./Buffers";
import { ProgramInfo } from "@/app/components/GLView/GLView";

export default function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: BufferContainer) {
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); // enable depth testing
  gl.depthFunc(gl.LEQUAL); // near objects obscure far objects

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // create perspective matrix
  const fov = (45 * Math.PI) / 180
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

  // give webgl our position attributes + tell it how to read them
  setPositionAttribute(gl, buffers, programInfo)

  // give webgl our color attributes
  setColorAttribute(gl, buffers, programInfo)
  
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

  // tell gl to draw with everything we have provided
  const offset = 0
  const vertexCount = 4
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
}

function setPositionAttribute(gl: WebGLRenderingContext, buffers: BufferContainer, programInfo: ProgramInfo) {
  const numComponents = 2 // 2 values per vertex
  const type = gl.FLOAT // the data in the buffer are 32 bit floats
  const normalize = false
  const stride = 0
  const offset = 0

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions)
  gl.vertexAttribPointer(
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