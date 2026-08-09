import { useEffect, useRef } from "react";

const BinaryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const columns: number[] = [];
    const fontSize = 14;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const colCount = Math.floor(w / fontSize);
      columns.length = 0;
      for (let i = 0; i < colCount; i++) {
        columns.push(Math.random() * h);
      }
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      ctx.fillStyle = isDark() ? "rgba(20, 20, 20, 0.08)" : "rgba(240, 240, 240, 0.08)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      ctx.fillStyle = isDark() ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

      for (let i = 0; i < columns.length; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = columns[i];
        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.98) {
          columns[i] = 0;
        }
        columns[i] += fontSize * 0.5;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    // observe dark mode changes
    const observer = new MutationObserver(() => {
      ctx.clearRect(0, 0, w, h);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ filter: "blur(2px)" }}
    />
  );
};

export default BinaryBackground;
