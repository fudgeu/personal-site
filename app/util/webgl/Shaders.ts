export type ProgramInfo = {
  program: WebGLProgram,
  attribLocations: {
    vertexPosition: number,
    vertexNormal: number,
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null,
    modelViewMatrix: WebGLUniformLocation | null,
    worldMatrix: WebGLUniformLocation | null,
    normalMatrix: WebGLUniformLocation | null
  }
};

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type); // create shader object

  if (shader == null) {
    console.error('Failed to create shader');
    return null;
  }

  gl.shaderSource(shader, source); // give source to shader object
  gl.compileShader(shader); // compile shader

  // check to see if compile failed
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader); // deletes shader if compute failed
    return null;
  }

  return shader;
}

export default function initShaderProgram(
  gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string,
): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (vertexShader == null || fragmentShader == null) {
    console.error('Shader program init failed, shader loading failed');
    return null;
  }

  // create shader program, consists of both vertex and fragment shaders
  const shaderProgram = gl.createProgram();

  if (shaderProgram == null) {
    console.error('Failed to create shader program');
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // check if linking failed
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(`Shader program linking failed: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }

  return shaderProgram;
}
