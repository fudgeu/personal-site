'use client';

import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import initShaderProgram, { ProgramInfo } from '@/app/util/webgl/Shaders';
import drawScene from '@/app/util/webgl/DrawScene';
import {
  WorldObject, addWorldObject, clearWorldObjects, getWorldObjects,
} from '@/app/util/webgl/World';
import { Object3D, createObject } from '@/app/util/webgl/Object3D';
import { mat4 } from 'gl-matrix';
import { MeshWithBuffers, OBJ } from 'webgl-obj-loader';
import styles from './style.module.css';

export type GLViewProps = {
  scrollPosition: number
};

type ModelResult = {
  model: MeshWithBuffers,
  id: string
};

export default function GLView({ scrollPosition }: GLViewProps) {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [lastScrollPos, setLastScrollPos] = useState(0);

  const ref = useRef<HTMLCanvasElement>(null);
  const animationRequestRef = useRef<number>();

  // Render WebGL
  const render = useCallback((time: number, gl: WebGLRenderingContext, prgmInfo: ProgramInfo) => {
    drawScene(gl, prgmInfo);
    animationRequestRef.current = requestAnimationFrame(
      (newTime) => render(newTime, gl, prgmInfo),
    );
  }, []);

  // Init WebGL
  const loadModel = useCallback(
    async (gl: WebGLRenderingContext, id: string, location: string): Promise<ModelResult> => {
      const response = await fetch(location);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const rawObj = await response.text();
      const rawModel = new OBJ.Mesh(rawObj);
      const model = OBJ.initMeshBuffers(gl, rawModel);

      return { model, id };
    },
    [],
  );

  const loadShader = useCallback(
    async (
      gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string,
    ): Promise<ProgramInfo> => {
      const [vertexResponse, fragmentResponse] = await Promise.all([
        fetch(vertexSrc),
        fetch(fragmentSrc),
      ]);

      if (!vertexResponse.ok) throw new Error(`Vertex Shader HTTP Error: ${vertexResponse.status}`);
      if (!fragmentResponse.ok) throw new Error(`Fragment Shader HTTP Error: ${fragmentResponse.status}`);

      const [vertexText, fragmentText] = await Promise.all([
        vertexResponse.text(),
        fragmentResponse.text(),
      ]);

      // create shader program from source
      const shaderProgram = initShaderProgram(gl, vertexText, fragmentText);

      if (shaderProgram == null) {
        throw new Error('Shader program compilation failed');
      }

      // grab shader attribute and uniform locations
      return {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
          worldMatrix: gl.getUniformLocation(shaderProgram, 'uWorldMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        },
      };
    },
    [],
  );

  const loadWorld = useCallback(
    (gl: WebGLRenderingContext, models: Map<string, MeshWithBuffers>) => {
      clearWorldObjects();

      const sphere = models.get('sphere');
      if (sphere === undefined) {
        console.log('Could not load world, sphere model not loaded');
        return;
      }

      const cube1: Object3D = createObject(sphere);
      mat4.rotate(cube1.localPosition, cube1.localPosition, Math.PI / 2, [1, 1, 0]);
      mat4.scale(cube1.localPosition, cube1.localPosition, [0.75, 0.75, 0.75]);
      const cube1Pos = mat4.create();
      mat4.translate(cube1Pos, cube1Pos, [-5.5, -0.5, -10]);

      const cube2: Object3D = createObject(sphere);
      mat4.rotate(cube2.localPosition, cube2.localPosition, Math.PI / 2, [0, 1, 1]);
      mat4.scale(cube2.localPosition, cube2.localPosition, [0.75, 0.75, 0.75]);
      const cube2Pos = mat4.create();
      mat4.translate(cube2Pos, cube2Pos, [-1.75, -0.5, -6]);

      const cube3: Object3D = createObject(sphere);
      mat4.rotate(cube3.localPosition, cube3.localPosition, Math.PI / 2, [1, 1, 1]);
      mat4.scale(cube3.localPosition, cube3.localPosition, [0.5, 0.5, 0.5]);
      const cube3Pos = mat4.create();
      mat4.translate(cube3Pos, cube3Pos, [-3.4, 0.5, -8]);

      // about page
      const sphere4: Object3D = createObject(sphere);
      mat4.rotate(sphere4.localPosition, sphere4.localPosition, Math.PI / 2, [1, 1, 1]);
      mat4.scale(sphere4.localPosition, sphere4.localPosition, [0.5, 0.5, 0.5]);
      const sphere4Pos = mat4.create();
      mat4.translate(sphere4Pos, sphere4Pos, [-5.5, -12, -8]);

      const sphere5: Object3D = createObject(sphere);
      mat4.rotate(sphere5.localPosition, sphere5.localPosition, Math.PI / 2, [1, 1, 1]);
      mat4.scale(sphere5.localPosition, sphere5.localPosition, [0.75, 0.75, 0.75]);
      const sphere5Pos = mat4.create();
      mat4.translate(sphere5Pos, sphere5Pos, [5.5, -6, -8]);

      addWorldObject(cube1, cube1Pos);
      addWorldObject(cube2, cube2Pos);
      addWorldObject(cube3, cube3Pos);
      addWorldObject(sphere4, sphere4Pos);
      addWorldObject(sphere5, sphere5Pos);



      // add random shapes into the background
      const modelsArray = Array.from(models.values());
      for (let i = 0; i < 5; i++) {
        const model = modelsArray[Math.floor(Math.random() * modelsArray.length)];
        const worldObj = createObject(model);
        mat4.rotate(worldObj.localPosition, worldObj.localPosition, Math.PI / 2, [1, 1, 0]);

        const scale = Math.random() * 0.5 + 0.5;
        mat4.scale(worldObj.localPosition, worldObj.localPosition, [scale, scale, scale]);

        const x = Math.random() * 20 - 10;
        const y = -Math.random() * 10 - 8;
        const z = -Math.random() * 10 - 15;

        const objPos = mat4.create();
        mat4.translate(objPos, objPos, [x, y, z]);

        //addWorldObject(worldObj, objPos);
      }
    },
    [],
  );

  // begin init
  useEffect((): () => void => {
    // load gl
    const gl = ref.current?.getContext('webgl');
    if (gl == null) return () => {};
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load models, then world
    Promise.all([
      loadModel(gl, 'sphere', './sphere.obj'),
    ])
      .then((models) => {
        // register each loaded model
        const loadedModels = new Map<string, MeshWithBuffers>();
        models.forEach((model: ModelResult) => {
          loadedModels.set(model.id, model.model);
        });
        loadWorld(gl, loadedModels);
      })
      .catch((err) => {
        console.error(`Failed to load 3D models: ${err}`);
      });

    // load shader, then begin render
    loadShader(gl, './vertex.glsl', './fragment.glsl')
      .then((programInfo) => {
        animationRequestRef.current = requestAnimationFrame(
          (time) => render(time, gl, programInfo),
        );
      })
      .catch((err) => {
        console.error(`Failed to initialize WebGL - shader init failed: ${err}`);
      });

    return () => {
      if (animationRequestRef.current == null) return;
      cancelAnimationFrame(animationRequestRef.current);
    };
  }, [loadShader, loadModel, loadWorld, render]);

  // Handle scroll
  useEffect(() => {
    const offset = scrollPosition - lastScrollPos;
    getWorldObjects().forEach(({ object, worldPosition }: WorldObject) => {
      mat4.translate(worldPosition, worldPosition, [0, 0.01 * offset, 0]);
      mat4.rotate(object.localPosition, object.localPosition, 0.0003 * offset, [1, 1, 0]);
    });
    setLastScrollPos(scrollPosition);
  }, [lastScrollPos, scrollPosition]);

  // Handle Resize
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <canvas width={windowDimensions.width} height={windowDimensions.height} ref={ref} />
    </div>
  );
}
