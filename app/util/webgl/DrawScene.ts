import { mat4 } from 'gl-matrix';
import { MeshWithBuffers } from 'webgl-obj-loader';
import { WorldObject, getWorldObjects } from './World';
import { ProgramInfo } from './Shaders';

function setPositionAttribute(
  gl: WebGLRenderingContext, mesh: MeshWithBuffers, programInfo: ProgramInfo,
) {
  const numComponents = mesh.vertexBuffer.itemSize; // 3 values per vertex
  const type = gl.FLOAT; // the data in the buffer are 32 bit floats
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer); // give webgl our position buffer
  // tell webgl how to read through and where to supply the positions in our shader
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setNormalAttribute(
  gl: WebGLRenderingContext, mesh: MeshWithBuffers, programInfo: ProgramInfo,
) {
  const numComponents = mesh.normalBuffer.itemSize;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

export default function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); // enable depth testing
  gl.depthFunc(gl.LEQUAL); // near objects obscure far objects

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // create perspective matrix
  const fov = (60 * Math.PI) / 180;
  const aspectRatio = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100;

  const projMatrix = mat4.create();
  mat4.perspective(projMatrix, fov, aspectRatio, zNear, zFar);

  getWorldObjects().forEach((worldObject: WorldObject) => {
    const buffers = worldObject.object.buffers as MeshWithBuffers;
    const { localPosition } = worldObject.object;
    const { worldPosition } = worldObject;

    // create normal matrix
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, localPosition);
    mat4.transpose(normalMatrix, normalMatrix);

    // provide webgl with our attributes and instructions how to read the arrays
    setPositionAttribute(gl, buffers, programInfo);
    setNormalAttribute(gl, buffers, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);

    // give shader program for drawing
    gl.useProgram(programInfo.program);

    // give webgl our uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projMatrix,
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      localPosition,
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.worldMatrix,
      false,
      worldPosition,
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix,
    );

    // tell gl to draw with everything we have provided
    const vertexCount = buffers.indexBuffer.numItems;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  });
}
