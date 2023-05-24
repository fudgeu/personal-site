"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css'
import initShaderProgram from '@/app/util/webgl/Shaders';
import initBuffers, { BufferContainer } from '@/app/util/webgl/Buffers';
import drawScene from '@/app/util/webgl/DrawScene';
import { addWorldObject, clearWorldObjects, getWorldObjects } from '@/app/util/webgl/World';
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
  uniform mat4 uProjectionMatrix;
	uniform mat4 uNormalMatrix;

  varying lowp vec4 vColor;
	varying highp vec3 vNormal;
	varying highp vec3 vFragPos;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

    vColor = aVertexColor;
		vNormal = mat3(uNormalMatrix) * aVertexNormal;
		vFragPos = vec3(uModelViewMatrix * aVertexPosition);
  }
  `;

const fragmentSource = `
	precision mediump float;

  varying lowp vec4 vColor;
	varying highp vec3 vNormal;
	varying highp vec3 vFragPos;

  void main(void) {

		vec3 lightPos = vec3(-5.0, -5.0, 5.0);
		vec3 lightAmbient = vec3(0, 0, 0);
		vec3 lightDiffuse = vec3(151.0/255.0, 0, 1);
		float lightConstant = 1.0;
		float lightLinear = 0.14;
		float lightQuadratic = 0.07; 

		vec3 ambient = lightAmbient * vColor.rgb;

		vec3 norm = normalize(vNormal);
		vec3 lightDir = normalize(lightPos - vFragPos);
		float diff = max(dot(norm, lightDir), 0.0);
		vec3 diffuse = lightDiffuse * diff * vColor.rgb;

		// attenutation
		float distance = length(lightPos - vFragPos);
		float attenuation = 1.0 / (lightConstant + lightLinear * distance + lightQuadratic * (distance * distance));

		ambient *= attenuation;
		diffuse *= attenuation;

    gl_FragColor = vec4(ambient + diffuse, 1.0);
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
		mat4.translate(cube1.position, cube1.position, [-1.5, -0.5, -10])
		mat4.rotate(cube1.position, cube1.position, Math.PI/2, [1, 1, 0])
		mat4.scale(cube1.position, cube1.position, [0.75, 0.75, 0.75])

		const cube2: Object3D = createObject(buffers)
		mat4.translate(cube2.position, cube2.position, [1, -0.5, -6])
		mat4.rotate(cube2.position, cube2.position, Math.PI/2, [0, 1, 1])
		mat4.scale(cube2.position, cube2.position, [0.75, 0.75, 0.75])

		const cube3: Object3D = createObject(buffers)
		mat4.translate(cube3.position, cube3.position, [0, 0.5, -8])
		mat4.rotate(cube3.position, cube3.position, Math.PI/2, [1, 1, 1])
		mat4.scale(cube3.position, cube3.position, [0.5, 0.5, 0.5])

		addWorldObject(cube1)
		addWorldObject(cube2)
		addWorldObject(cube3)

		animationRequestRef.current = requestAnimationFrame((time) => render(time, gl, programInfo, buffers))

		return () => {
			if (animationRequestRef.current == null) return
			cancelAnimationFrame(animationRequestRef.current)
		}
  }, [render])

	// Handle scroll
	useEffect(() => {
		const offset = scrollPosition - lastScrollPos
		getWorldObjects().forEach((object: Object3D) => {
			mat4.translate(object.position, object.position, [0, 0.002*offset, 0])
		})
		setLastScrollPos(scrollPosition)
		console.log('runnning')
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