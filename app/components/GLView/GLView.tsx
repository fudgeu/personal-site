"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css'
import initShaderProgram from '@/app/util/webgl/Shaders';
import drawScene from '@/app/util/webgl/DrawScene';
import { WorldObject, addWorldObject, clearWorldObjects, getWorldObjects } from '@/app/util/webgl/World';
import { Object3D, createObject } from '@/app/util/webgl/Object3D';
import { mat4 } from 'gl-matrix';
import { MeshWithBuffers, OBJ } from 'webgl-obj-loader';

export type GLViewProps = {
	scrollPosition: number
}

type Models = {
	[key: string]: MeshWithBuffers
}

type ModelResult = {
	model: MeshWithBuffers,
	id: string
}

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
}

let deltaTime = 0
let then = 0

export default function GLView({ scrollPosition }: GLViewProps) {
		
	const [windowDimensions, setWindowDimensions] = useState({width: 0, height: 0});
	const [lastScrollPos, setLastScrollPos] = useState(0)

  const ref = useRef<HTMLCanvasElement>(null)
	const animationRequestRef = useRef<number>()

	// Render WebGL
	const render = useCallback((time: number, gl: WebGLRenderingContext, programInfo: ProgramInfo) => {
		time *= 0.001
		deltaTime = time - then
		then = time
    drawScene(gl, programInfo)
		animationRequestRef.current = requestAnimationFrame((newTime) => render(newTime, gl, programInfo))
	}, [])

	// Init WebGL
	const loadModel = useCallback(async (gl: WebGLRenderingContext, id: string, location: string): Promise<ModelResult> => {
		const response = await fetch(location)
		if (!response.ok) throw new Error(`HTTP Error ${response.status}`)

		const rawObj = await response.text()
		const rawModel = new OBJ.Mesh(rawObj)
		const model = OBJ.initMeshBuffers(gl, rawModel)

		return { model, id };
	}, [])

  const loadShader = useCallback(async (gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): Promise<ProgramInfo> => {
    const [vertexResponse, fragmentResponse] = await Promise.all([
      fetch(vertexSrc),
      fetch(fragmentSrc)
    ])

    if (!vertexResponse.ok) throw new Error(`Vertex Shader HTTP Error: ${vertexResponse.status}`)
    if (!fragmentResponse.ok) throw new Error(`Fragment Shader HTTP Error: ${fragmentResponse.status}`)

    const [vertexText, fragmentText] = await Promise.all([
      vertexResponse.text(),
      fragmentResponse.text()
    ])

    const shaderProgram = initShaderProgram(gl, vertexText, fragmentText) // create shader program from source

    if (shaderProgram == null) {
      throw new Error("Shader program compilation failed")
    }

    // grab shader attribute and uniform locations
    return {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
				vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal")
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        worldMatrix: gl.getUniformLocation(shaderProgram, "uWorldMatrix"),
        normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      }
    }
  }, [])

	const loadWorld = useCallback((gl: WebGLRenderingContext, models: Models) => {
		clearWorldObjects()

		const cube = models["cube"]
		const sphere = models["sphere"]
		const torus = models["torus"]
		const iso = models["iso"]

		const cube1: Object3D = createObject(cube)
    mat4.rotate(cube1.localPosition, cube1.localPosition, Math.PI/2, [1, 1, 0])
		mat4.scale(cube1.localPosition, cube1.localPosition, [0.75, 0.75, 0.75])
    const cube1Pos = mat4.create()
		mat4.translate(cube1Pos, cube1Pos, [-1.5, -0.5, -10])

		const cube2: Object3D = createObject(sphere)
    mat4.rotate(cube2.localPosition, cube2.localPosition, Math.PI/2, [0, 1, 1])
		mat4.scale(cube2.localPosition, cube2.localPosition, [0.75, 0.75, 0.75])
    const cube2Pos = mat4.create()
		mat4.translate(cube2Pos, cube2Pos, [1, -0.5, -6])

		const cube3: Object3D = createObject(iso)
    mat4.rotate(cube3.localPosition, cube3.localPosition, Math.PI/2, [1, 1, 1])
		mat4.scale(cube3.localPosition, cube3.localPosition, [0.5, 0.5, 0.5])
    const cube3Pos = mat4.create()
		mat4.translate(cube3Pos, cube3Pos, [0, 0.5, -8])

    const cube4: Object3D = createObject(torus)
    mat4.rotate(cube4.localPosition, cube4.localPosition, Math.PI/2, [1, 1, 1])
		mat4.scale(cube4.localPosition, cube4.localPosition, [0.5, 0.5, 0.5])
    const cube4Pos = mat4.create()
		mat4.translate(cube4Pos, cube4Pos, [1, -5, -8])

    const cube5: Object3D = createObject(sphere)
    mat4.rotate(cube5.localPosition, cube5.localPosition, Math.PI/2, [1, 1, 0])
    const cube5Pos = mat4.create()
		mat4.translate(cube5Pos, cube5Pos, [-1, -8, -15])

		addWorldObject(cube1, cube1Pos)
		addWorldObject(cube2, cube2Pos)
		addWorldObject(cube3, cube3Pos)
		addWorldObject(cube4, cube4Pos)
		addWorldObject(cube5, cube5Pos)
	}, [])

	// begin init
  useEffect(() => {
    // load gl
    const gl = ref.current?.getContext("webgl")
    if (gl == null) return
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // load models, then world
		Promise.all([
			loadModel(gl, 'sphere', './sphere.obj'),
			loadModel(gl, 'torus', './torus.obj'),
			loadModel(gl, 'cube', './cube.obj'),
			loadModel(gl, 'iso', './iso.obj')
		])
			.then(models => {
				// register each loaded model
		    const loadedModels: Models = {}
				models.forEach((model: ModelResult) => {
					console.log(model.id)
					loadedModels[model.id] = model.model
				})
				loadWorld(gl, loadedModels)
			})
			.catch(err => {
				console.error(`Failed to load 3D models: ${err}`)
			})

    // load shader, then begin render
    loadShader(gl, './vertex.glsl', './fragment.glsl')
      .then(programInfo => {
        animationRequestRef.current = requestAnimationFrame((time) => render(time, gl, programInfo))
      })
      .catch(err => {
        console.error(`Failed to initialize WebGL - shader init failed: ${err}`)
        return;
      })

		return () => {
			if (animationRequestRef.current == null) return
			cancelAnimationFrame(animationRequestRef.current)
		}
  }, [loadShader, loadModel, loadWorld, render])

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