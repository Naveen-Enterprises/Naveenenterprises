"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";

interface ThemeProps {
  isDark: boolean;
}

/* ---------------------------- Typewriter Component --------------------------- */
const Typewriter = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

/* ------------------------- Particle Background ------------------------- */
const ParticlesBackground = ({ isDark }: ThemeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      interface Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
      }

      const particles: Particle[] = [];
      const particleCount = Math.floor(window.innerWidth / 10) + 50;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
        });
      }

      const animate = () => {
        if (!canvas) return;
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > width) p.speedX = -p.speedX;
          if (p.y < 0 || p.y > height) p.speedY = -p.speedY;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? "rgba(255,255,255,0.3)"
            : "rgba(0,0,0,0.3)";
          ctx.fill();
        });
        requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    [isDark]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cleanup = initParticles(canvas, ctx);
    return cleanup;
  }, [initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-50" />;
};

/* ---------------------- Animated Gradient Background --------------------- */
const AnimatedGradient = ({ isDark }: ThemeProps) => {
  const background = isDark
    ? "linear-gradient(270deg, #1e3c72, #2a5298, #4a6cf7, #2a5298)"
    : "linear-gradient(270deg, #ff9a9e, #fecfef, #f6d365, #fda085)";
  return (
    <motion.div
      className="absolute inset-0 -z-40"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{
        background,
        backgroundSize: "400% 400%",
      }}
    />
  );
};

/* ------------------------ Glowing SVG Overlays --------------------------- */
const GlowingOverlay = ({ isDark }: ThemeProps) => (
  <>
    <motion.svg
      className="absolute -z-30"
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.02"
    >
      {isDark ? (
        <>
          <motion.circle cx="400" cy="300" r="250" fill="url(#grad)" />
          <defs>
            <radialGradient id="grad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </>
      ) : (
        <>
          <motion.circle cx="400" cy="300" r="250" fill="url(#gradLight)" />
          <defs>
            <radialGradient id="gradLight" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </>
      )}
    </motion.svg>
    <motion.svg
      className="absolute inset-0 -z-20"
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      data-depth="0.01"
    >
      <defs>
        {isDark ? (
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0%" stopColor="#f0f" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#00f" stopOpacity="0" />
          </radialGradient>
        ) : (
          <radialGradient id="glowLight" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0%" stopColor="#444" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#ccc" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <circle
        cx="400"
        cy="300"
        r="300"
        fill={`url(#${isDark ? "glow" : "glowLight"})`}
      />
    </motion.svg>
  </>
);

/* ----------------------------- Floating Elements ------------------------- */
const FloatingElements = ({ isDark }: ThemeProps) => (
  <>
    <motion.div
      className={`absolute top-10 left-10 w-24 h-24 rounded-full blur-3xl opacity-40 ${
        isDark ? "bg-purple-600" : "bg-purple-300"
      }`}
      animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.03"
    />
    <motion.div
      className={`absolute bottom-10 right-10 w-32 h-32 rounded-full blur-3xl opacity-40 ${
        isDark ? "bg-pink-600" : "bg-pink-300"
      }`}
      animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.03"
    />
    <motion.div
      className={`absolute top-1/2 left-1/2 w-20 h-20 rounded-full blur-2xl opacity-50 ${
        isDark ? "bg-cyan-500" : "bg-cyan-300"
      }`}
      animate={{ x: [-30, 30, -30], y: [30, -30, 30] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.04"
    />
    <motion.div
      className={`absolute top-20 right-20 w-16 h-16 rounded-full blur-xl opacity-30 ${
        isDark ? "bg-yellow-500" : "bg-yellow-300"
      }`}
      animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.04"
    />
    <motion.div
      className={`absolute bottom-20 left-20 w-20 h-20 rounded-full blur-xl opacity-30 ${
        isDark ? "bg-green-500" : "bg-green-300"
      }`}
      animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      data-depth="0.04"
    />
  </>
);

/* ----------------------------- Mouse Dot ------------------------- */
const MouseDot = ({ isDark }: ThemeProps) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setCoords((prev) => {
        const dx = (mousePos.current.x - prev.x) * 0.2;
        const dy = (mousePos.current.y - prev.y) * 0.2;
        return { x: prev.x + dx, y: prev.y + dy };
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: "translate(-50%, -50%)",
      }}
      className="pointer-events-none fixed z-50 w-16 h-16 bg-blue-300 opacity-70 blur-2xl transition-transform duration-200 ease-out"
    />
  );
};

/* ------------------------- Branded Symbol Animation ------------------------- */
const BrandedSymbol = ({ isDark }: ThemeProps) => (
  <motion.svg
    className="absolute inset-0 -z-60 opacity-20 pointer-events-none"
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    style={{ margin: "auto", display: "block" }}
    data-depth="0.01"
  >
    <motion.path
      d="M100,10 L40,198 L190,78 H10 L160,198 Z"
      fill={isDark ? "#ffffff" : "#000000"}
    />
  </motion.svg>
);

/* ----------------------------- Main Hero Component ----------------------------- */
const Hero = () => {
  const [isDark, setIsDark] = useState(true);

  // Detect theme based on prefers-color-scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse-based parallax for elements with data-depth attribute
  useEffect(() => {
    const layers = document.querySelectorAll("[data-depth]");
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      layers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-depth") || 0.2);
        const x = (e.clientX - innerWidth / 2) * depth;
        const y = (e.clientY - innerHeight / 2) * depth;
        (layer as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const textVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const parallaxEls = document.querySelectorAll("[data-parallax]");
      parallaxEls.forEach((el) => {
        const speed = Number(el.getAttribute("data-speed") || 0.3);
        (el as HTMLElement).style.transform = `translateY(${scrollPos * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Naveen Enterprises | Future of Tech</title>
        <link rel="icon" href="/favicon-animated.svg" />
      </Head>
      <motion.section
        key="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
        className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <ParticlesBackground isDark={isDark} />
        <AnimatedGradient isDark={isDark} />
        <GlowingOverlay isDark={isDark} />
        <FloatingElements isDark={isDark} />
        <MouseDot isDark={isDark} />
        <BrandedSymbol isDark={isDark} />

        <div className="relative z-40 max-w-4xl px-6 text-center mt-24">
          {/* Wrap heading in a container with perspective */}
          <div style={{ perspective: "1000px" }}>
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className={`text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text bg-gradient-to-r drop-shadow-lg ${
                isDark
                  ? "text-white from-indigo-300 to-purple-500"
                  : "text-gray-900 from-gray-700 to-gray-400"
              }`}
            >
              Naveen Enterprises
            </motion.h1>
          </div>
          <motion.p
            className={`mt-6 leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.8 }}
          >
            <Typewriter
              text="Naveen Enterprises specializes in AI, LLMs, cybersecurity, secure web development, and global software consulting. We also engage in import and export of premium products and tech solutions worldwide."
              speed={50}
            />
          </motion.p>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block rounded-full px-10 py-4 text-base font-bold hover:brightness-110 transition transform hover:scale-105 shadow-lg shadow-blue-500/40 text-white bg-primary"
            >
              Launch with Us
            </Link>
          </div>
        </div>

        <motion.div
          data-parallax
          data-speed="0.2"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-lg tracking-wider opacity-70 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
        >
          Scroll for more...
        </motion.div>
      </motion.section>
    </>
  );
};

export default Hero;
