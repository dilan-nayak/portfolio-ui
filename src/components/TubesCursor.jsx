import { useEffect, useRef } from "react";
import "./TubesCursor.css";

const getThemePalette = () => {
  const isDark = document.documentElement.classList.contains("dark");

  if (isDark) {
    return {
      colors: ["#ffffff", "#a667f9", "#f43f5e"],
      lightColors: ["#ffffff", "#a667f9", "#f43f5e", "#fb7185"],
    };
  }

  return {
    colors: ["#0a0a0b", "#a667f9", "#f43f5e"],
    lightColors: ["#0a0a0b", "#a667f9", "#f43f5e", "#fb7185"],
  };
};

const TubesCursor = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const isMobileView =
      window.matchMedia("(max-width: 1023px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isMobileView) {
      return undefined;
    }

    let mounted = true;

    const init = async () => {
      try {
        const { default: createTubesCursor } =
          await import("threejs-components/build/cursors/tubes1.min.js");

        if (!mounted || !canvasRef.current) {
          return;
        }

        const palette = getThemePalette();

        const instance = createTubesCursor(canvasRef.current, {
          bloom: false,
          tubes: {
            count: 3,
            minRadius: 0.011,
            maxRadius: 0.0123,
            minTubularSegments: 24,
            maxTubularSegments: 72,
            lerp: 0.36,
            noise: 0.0001,
            material: {
              metalness: 0.9,
              roughness: 0.35,
            },
            colors: palette.colors,
            lights: {
              intensity: 230,
              colors: palette.lightColors,
            },
          },
          sleepRadiusX: 160,
          sleepRadiusY: 95,
          sleepTimeScale1: 0.7,
          sleepTimeScale2: 1.1,
        });

        if (instance?.three?.camera) {
          instance.three.camera.position.z = 5.3;
          instance.three.camera.fov = 52;
          instance.three.camera.updateProjectionMatrix?.();
          instance.three.resize?.();
        }

        if (instance?.three?.renderer) {
          instance.three.renderer.setClearColor(0x000000, 0);
          instance.three.renderer.setClearAlpha?.(0);
        }

        appRef.current = instance;
      } catch (error) {
        console.error("Tubes cursor init failed:", error);
      }
    };

    const applyThemePalette = () => {
      if (!appRef.current?.tubes) {
        return;
      }
      const palette = getThemePalette();
      appRef.current.tubes.setColors?.(palette.colors);
      appRef.current.tubes.setLightsColors?.(palette.lightColors);
    };

    const observer = new MutationObserver(() => {
      applyThemePalette();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    init();

    return () => {
      mounted = false;
      observer.disconnect();
      appRef.current?.dispose?.();
      appRef.current = null;
    };
  }, []);

  return (
    <div className="tubes-cursor-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="tubes-cursor-canvas" />
    </div>
  );
};

export default TubesCursor;
