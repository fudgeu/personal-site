"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css'
import initShaderProgram from '@/app/util/webgl/Shaders';
import initBuffers, { BufferContainer } from '@/app/util/webgl/Buffers';
import drawScene from '@/app/util/webgl/DrawScene';
import { WorldObject, addWorldObject, clearWorldObjects, getWorldObjects } from '@/app/util/webgl/World';
import { Object3D, createObject } from '@/app/util/webgl/Object3D';
import { mat4 } from 'gl-matrix';

export type GLViewProps = {
	scrollPosition: number
}

const vertexSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;
	attribute vec3 aVertexNormal;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uWorldMatrix;
  uniform mat4 uProjectionMatrix;
	uniform mat4 uNormalMatrix;

  varying lowp vec4 vColor;
	varying highp vec3 vNormal;
	varying highp vec3 vFragPos;

  void main(void) {
    gl_Position = uProjectionMatrix * uWorldMatrix * uModelViewMatrix * aVertexPosition;

    vColor = aVertexColor;
		vNormal = mat3(uNormalMatrix) * aVertexNormal;
		vFragPos = vec3(uModelViewMatrix * aVertexPosition);
  }
  `;

const fragmentSource = `
precision mediump float;

struct PointLight {
  vec3 position;
  vec3 ambientColor;
  vec3 diffuseColor;
  float lightConstant;
  float lightLinear;
  float lightQuadratic;
};

varying lowp vec4 vColor;
varying highp vec3 vNormal;
varying highp vec3 vFragPos;

vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragmentPos) {
  vec3 lightDirection = normalize(light.position - fragmentPos);
  float difference = max(dot(normal, lightDirection), 0.0);

  // attenuation //
  float distance = length(light.position - fragmentPos);
  float attenuation = 1.0 / (light.lightConstant + light.lightLinear * distance + light.lightQuadratic * (distance * distance));
  /////////////////

  vec3 diffuse = light.diffuseColor * difference * attenuation;
  vec3 ambient = light.ambientColor * attenuation;

  return ambient + diffuse;
}

void main(void) {
  vec3 norm = normalize(vNormal);

  PointLight purpleLight = PointLight(vec3(-5.0, -5.0, 5.0), vec3(0, 0, 0), vec3(0.59, 0, 1), 1.0, 0.3, 0.06);
  PointLight blueLight = PointLight(vec3(5.0, 5.0, 5.0), vec3(0, 0, 0), vec3(0, 0.14, 0.37), 1.0, 0.3, 0.10);

  vec3 lightCalc1 = calculatePointLight(purpleLight, norm, vFragPos);
  vec3 lightCalc2 = calculatePointLight(blueLight, norm, vFragPos);

  gl_FragColor = vec4(lightCalc1 + lightCalc2, 1.0);
}
`;

export type ProgramInfo = {
  program: WebGLProgram,
    attribLocations: {
      vertexPosition: number,
      vertexColor: number,
      vertexNormal: number,
    },
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null,
      modelViewMatrix: WebGLUniformLocation | null,
      worldMatrix: WebGLUniformLocation | null,
			normalMatrix: WebGLUniformLocation | null
    }
}

let squareRotation = 0
let deltaTime = 0
let then = 0

export default function GLView({ scrollPosition }: GLViewProps) {
		
	const [windowDimensions, setWindowDimensions] = useState({width: 0, height: 0});
	const [lastScrollPos, setLastScrollPos] = useState(0)

  const ref = useRef<HTMLCanvasElement>(null)
	const animationRequestRef = useRef<number>()

	// Render WebGL
	const render = useCallback((time: number, gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: BufferContainer) => {
		time *= 0.001
		deltaTime = time - then
		then = time
		squareRotation += deltaTime
    drawScene(gl, programInfo, buffers, squareRotation)
		animationRequestRef.current = requestAnimationFrame((newTime) => render(newTime, gl, programInfo, buffers))
	}, [])

	// Init WebGL
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
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
				vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal")
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        worldMatrix: gl.getUniformLocation(shaderProgram, "uWorldMatrix"),
        normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      },
    };

    const buffers = initBuffers(gl)

    if (buffers == null) {
      console.error("GL initialization failed, buffer object is empty")
      return
    }

		clearWorldObjects()

		const cube1: Object3D = createObject(buffers)
    mat4.rotate(cube1.localPosition, cube1.localPosition, Math.PI/2, [1, 1, 0])
		mat4.scale(cube1.localPosition, cube1.localPosition, [0.75, 0.75, 0.75])
    const cube1Pos = mat4.create()
		mat4.translate(cube1Pos, cube1Pos, [-1.5, -0.5, -10])

		const cube2: Object3D = createObject(buffers)
    mat4.rotate(cube2.localPosition, cube2.localPosition, Math.PI/2, [0, 1, 1])
		mat4.scale(cube2.localPosition, cube2.localPosition, [0.75, 0.75, 0.75])
    const cube2Pos = mat4.create()
		mat4.translate(cube2Pos, cube2Pos, [1, -0.5, -6])

		const cube3: Object3D = createObject(buffers)
    mat4.rotate(cube3.localPosition, cube3.localPosition, Math.PI/2, [1, 1, 1])
		mat4.scale(cube3.localPosition, cube3.localPosition, [0.5, 0.5, 0.5])
    const cube3Pos = mat4.create()
		mat4.translate(cube3Pos, cube3Pos, [0, 0.5, -8])

    const cube4: Object3D = createObject(buffers)
    mat4.rotate(cube4.localPosition, cube4.localPosition, Math.PI/2, [1, 1, 1])
		mat4.scale(cube4.localPosition, cube4.localPosition, [0.5, 0.5, 0.5])
    const cube4Pos = mat4.create()
		mat4.translate(cube4Pos, cube4Pos, [1, -5, -8])

    const cube5: Object3D = createObject(buffers)
    mat4.rotate(cube5.localPosition, cube5.localPosition, Math.PI/2, [1, 1, 0])
    const cube5Pos = mat4.create()
		mat4.translate(cube5Pos, cube5Pos, [-1, -8, -15])

		addWorldObject(cube1, cube1Pos)
		addWorldObject(cube2, cube2Pos)
		addWorldObject(cube3, cube3Pos)
		addWorldObject(cube4, cube4Pos)
		addWorldObject(cube5, cube5Pos)

		animationRequestRef.current = requestAnimationFrame((time) => render(time, gl, programInfo, buffers))

		return () => {
			if (animationRequestRef.current == null) return
			cancelAnimationFrame(animationRequestRef.current)
		}
  }, [render])

	// Handle scroll
	useEffect(() => {
		const offset = scrollPosition - lastScrollPos
		getWorldObjects().forEach(({ object, position }: WorldObject) => {
			mat4.translate(position, position, [0, 0.002*offset, 0])
      mat4.rotate(object.localPosition, object.localPosition, 0.0003*offset, [1, 1, 0])
		})
		setLastScrollPos(scrollPosition)
	}, [lastScrollPos, scrollPosition])

	// Handle Resize
	useEffect(() => {
    function handleResize() {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
		handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.container}>
      <canvas width={windowDimensions.width} height={windowDimensions.height} ref={ref} />
			<span className={styles.gradientOverlay} />
    </div>
  )
}