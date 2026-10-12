"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionTier } from "@/components/motion/useMotionTier";
import { cn } from "@/lib/utils";

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;
varying vec2 vUv;
uniform float uTime;

void main() {
  float wave = sin((vUv.x + uTime * 0.08) * 12.0) * 0.04;
  vec3 color = vec3(0.81, 0.64 + wave, 0.48);
  gl_FragColor = vec4(color, 0.45);
}
`;

export function HoverDistortion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const tier = useMotionTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (tier !== "full" || !isVisible || !canvasRef.current) return;

    let animationFrame = 0;
    let disposed = false;

    async function mount() {
      const { Mesh, Program, Renderer, Triangle } = await import("ogl");
      if (disposed || !canvasRef.current || !containerRef.current) return;

      const renderer = new Renderer({
        alpha: true,
        canvas: canvasRef.current,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      const gl = renderer.gl;
      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        fragment,
        vertex,
        uniforms: {
          uTime: { value: 0 },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        renderer.setSize(rect?.width ?? 1, rect?.height ?? 1);
      };
      const render = (time: number) => {
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
        animationFrame = requestAnimationFrame(render);
      };

      resize();
      window.addEventListener("resize", resize);
      animationFrame = requestAnimationFrame(render);

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrame);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let cleanup: void | (() => void);
    void mount().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      disposed = true;
      cleanup?.();
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, tier]);

  return (
    <div className={cn("relative overflow-hidden rounded-card", className)} ref={containerRef}>
      {tier === "full" && isVisible ? (
        <canvas
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          ref={canvasRef}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
