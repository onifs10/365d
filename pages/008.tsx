import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Paper from "../components/Paper";
import {
  Clock,
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Switch } from "@blueprintjs/core";
const Page008: NextPage = () => {
  const [wireFrame, setWireframe] = useState<boolean>(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasScene, setScene] = useState<CanvasScene>();
  const handleToggleWireframe = () => {
    setWireframe((v) => !v);
  };
  useEffect(() => {
    if (canvasRef.current) {
      if (!canvasScene) {
        const canvasSceneObj = new CanvasScene(canvasRef.current);
        setScene(canvasSceneObj);
        canvasSceneObj.createMesh().start();
      }
    }
  }, [canvasRef, canvasScene]);
  useEffect(() => {
    if (canvasScene) {
      canvasScene.createMesh(wireFrame);
    }
  }, [canvasScene, wireFrame]);
  return (
    <Paper
      pageTitle={"Three"}
      pageDescription={"Using gls for shaders in three js"}
      paperTitle={"Three.js"}
      paperTip={<p>hands on three js using webgl shader </p>}
    >
      <div ref={canvasRef} />
      <div style={{ paddingTop: "1rem", color: "green" }}>
        <Switch
          checked={wireFrame}
          label="Wirefame"
          onChange={handleToggleWireframe}
        />
      </div>
      <div style={{ color: "green" }}>
        following{" "}
        <a
          href="https://tympanus.net/codrops/2020/03/17/create-a-wave-motion-effect-on-an-image-with-three-js/"
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: "bold" }}
        >
          this guide
        </a>
      </div>
    </Paper>
  );
};

export default Page008;

class CanvasScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private vertexShader: string;
  private fragmentShader: string;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private geometry: PlaneGeometry | undefined;
  private material: ShaderMaterial | undefined;
  private mesh: Mesh | undefined;
  private controls: OrbitControls;
  constructor(private box: HTMLDivElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(70, 1, 0.1, 100);
    this.camera.position.z = 1;
    this.renderer = new WebGLRenderer();
    box.appendChild(this.renderer.domElement);
    this.renderer.setSize(400, 400);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 1);
    this.clock = new Clock();
    this.vertexShader = /* glsl */ `
        precision mediump float;
        varying vec2 vUv;
        uniform float uTime;

        //
        // Description : Array and textureless GLSL 2D/3D/4D simplex
        //               noise functions.
        //      Author : Ian McEwan, Ashima Arts.
        //  Maintainer : ijm
        //     Lastmod : 20110822 (ijm)
        //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //               Distributed under the MIT License. See LICENSE file.
        //               https://github.com/ashima/webgl-noise
        //
        
        vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }
        vec4 taylorInvSqrt(vec4 r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            
            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;
            
            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
            
            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                    
            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            
            // Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                            dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
        vUv = uv;
        vec3 pos = position;
        float noiseFreq = 3.5;
        float noiseAmp = 0.15; 
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise(noisePos) * noiseAmp * sin(uTime * 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
    `;
    this.fragmentShader = /* glsl */ `
        precision mediump float;
        varying vec2 vUv;
        uniform float uTime;
        float hue2rgb(float f1, float f2, float hue) {
            if (hue < 0.0)
                hue += 1.0;
            else if (hue > 1.0)
                hue -= 1.0;
            float res;
            if ((6.0 * hue) < 1.0)
                res = f1 + (f2 - f1) * 6.0 * hue;
            else if ((2.0 * hue) < 1.0)
                res = f2;
            else if ((3.0 * hue) < 2.0)
                res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
            else
                res = f1;
            return res;
        }

        vec3 hsl2rgb(vec3 hsl) {
            vec3 rgb;
            
            if (hsl.y == 0.0) {
                rgb = vec3(hsl.z); // Luminance
            } else {
                float f2;
                
                if (hsl.z < 0.5)
                    f2 = hsl.z * (1.0 + hsl.y);
                else
                    f2 = hsl.z + hsl.y - hsl.y * hsl.z;
                    
                float f1 = 2.0 * hsl.z - f2;
                
                rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
                rgb.g = hue2rgb(f1, f2, hsl.x);
                rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
            }   
            return rgb;
        }

        vec3 hsl2rgb(float h, float s, float l) {
            return hsl2rgb(vec3(h, s, l));
        }

        void main() {
            vec3 colorNew = hsl2rgb( 0.3 + sin(uTime * vUv.x * 0.05), 0.3 + sin(uTime * 0.01),  0.8);
            gl_FragColor = vec4(vec3(colorNew),1.0);
        }
    `;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  createMesh = (wireframe: boolean = false) => {
    if (this.mesh) {
      this.mesh.geometry?.dispose();
      this.scene.remove(this.mesh);
      this.renderer.renderLists.dispose();
    }
    this.geometry = new PlaneGeometry(1.5, 1.5, 16, 16);
    this.material = new ShaderMaterial({
      fragmentShader: this.fragmentShader,
      vertexShader: this.vertexShader,
      uniforms: {
        uTime: { value: 0.0 },
      },
      wireframe,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    return this;
  };
  start = () => {
    requestAnimationFrame(this.start);
    if (this.material) {
      this.material.uniforms.uTime.value = this.clock.getElapsedTime();
    }
    this.renderer.render(this.scene, this.camera);
  };
}
