export type BufferContainer = {
  positions: WebGLBuffer,
  colors: WebGLBuffer
}

export default function initBuffers(gl: WebGLRenderingContext): BufferContainer | null {
  // create a buffer containing the positions of vertices to render
  const positionBuffer = initPositionBuffer(gl)

  if (positionBuffer == null) {
    console.error("Failed to initialize buffers, position buffer is empty")
    return null
  }

  const colorBuffer = initColorBuffers(gl)

  if (colorBuffer == null) {
    console.error("Failed to initialize buffers, color buffer is empty")
    return null
  }

  return {
    positions: positionBuffer,
    colors: colorBuffer
  }
}

function initPositionBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
  const positionBuffer = gl.createBuffer()

  // set the position buffer as the buffer to gl to perform operations on
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [1, 1, -1, 1, 1, -1, -1, -1]

  // supply position buffer with positions
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // return gl buffer with positions supplied
  return positionBuffer
}

function initColorBuffers(gl: WebGLRenderingContext): WebGLBuffer | null {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return colorBuffer
}