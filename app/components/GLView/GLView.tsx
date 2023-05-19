import { useEffect, useRef } from 'react';
import styles from './style.module.css'
import initShaderProgram from '@/app/util/webgl/Shaders';
import initBuffers from '@/app/util/webgl/Buffers';
import drawScene from '@/app/util/webgl/DrawScene';

const vertexSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
  `;

const fragmentSource = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
`;

export type ProgramInfo = {
  program: WebGLProgram,
    attribLocations: {
      vertexPosition: number,
      vertexColor: number,
    },
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null,
      modelViewMatrix: WebGLUniformLocation | null,
    }
}

export default function GLView() {

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = ref.current?.getContext("webgl")
    if (gl == null) return;
    gl.clearColor(1, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const shaderProgram = initShaderProgram(gl, vertexSource, fragmentSource) // create shader program from source

    if (shaderProgram == null) {
      console.error("GL initialization failed, shader program is empty")
      return
    }

    // grab shader attribute and uniform locations
    const programInfo: ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      },
    };

    const buffers = initBuffers(gl)

    if (buffers == null) {
      console.error("GL initialization failed, buffer object is empty")
      return
    }

    drawScene(gl, programInfo, buffers)
  }, [ref])

  return (
    <div className={styles.container}>
      <canvas width="500" height="500" ref={ref}>

      </canvas>
    </div>
  )
}