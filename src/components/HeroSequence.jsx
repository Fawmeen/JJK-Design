'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SukunaSequence from './SukunaSequence';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 191; // 0 to 191
const IMAGES_BASE_PATH = '/assets/sequence/frame_';

export default function HeroSequence() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const imagesRef = useRef([]);
    const [sukunaImages, setSukunaImages] = useState(null);

    // 1. Preload Images (Unified Loader)
    useEffect(() => {
        let loadedCount = 0;
        const heroPromises = [];
        const sukunaPromises = [];

        const SUKUNA_COUNT = 191;
        const TOTAL_ASSETS = (FRAME_COUNT + 1) + SUKUNA_COUNT;

        const preloadImages = async () => {
            // Load Hero (0-191)
            for (let i = 0; i <= FRAME_COUNT; i++) {
                heroPromises.push(new Promise((resolve) => {
                    const img = new Image();
                    img.src = `${IMAGES_BASE_PATH}${i.toString().padStart(3, '0')}.jpg`;
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / TOTAL_ASSETS) * 100));
                        resolve(img);
                    };
                }));
            }

            // Load Sukuna (1-191)
            for (let i = 1; i <= SUKUNA_COUNT; i++) {
                sukunaPromises.push(new Promise((resolve) => {
                    const img = new Image();
                    img.src = `/assets/sukuna/${i.toString().padStart(4, '0')}.jpg`;
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / TOTAL_ASSETS) * 100));
                        resolve(img);
                    };
                }));
            }

            const [heroImgs, sukunaImgs] = await Promise.all([
                Promise.all(heroPromises),
                Promise.all(sukunaPromises)
            ]);

            imagesRef.current = heroImgs;
            setSukunaImages(sukunaImgs);

            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        preloadImages();
    }, []);

    // 2. Animation Logic (Runs once loading is done)
    useEffect(() => {
        if (isLoading) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const images = imagesRef.current;

        // Initial Canvas Size
        canvas.width = 1920;
        canvas.height = 1080;

        // Resize Logic for "cover" effect
        const resizeCanvas = () => {
            const scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
            canvas.style.width = (1920 * scale) + "px";
            canvas.style.height = (1080 * scale) + "px";
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Render Function
        const anime = { frame: 0 };
        const render = () => {
            // Math.round is crucial for integer frame index
            const index = Math.round(anime.frame);
            if (images[index]) {
                const img = images[index];
                context.clearRect(0, 0, canvas.width, canvas.height);

                // Crop logic (removing bottom 150px)
                const cropBottom = 150;
                const sWidth = img.width;
                const sHeight = img.height - cropBottom;

                context.drawImage(img, 0, 0, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            }
        };

        // Initial Render
        render();

        // --- GSAP ANIMATIONS ---
        const ctx = gsap.context(() => {
            // 0. Auto-Open Mask (Entry)
            gsap.fromTo("#canvas-container",
                { clipPath: "circle(0% at 50% 50%)" },
                { clipPath: "circle(150% at 50% 50%)", duration: 2.5, ease: "power4.inOut" }
            );

            // 1. Reveal Title
            gsap.to("h1", { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 1.5 }); // Delayed to match mask
            gsap.to(".subtitle", { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 1.8 });

            // 2. Main Timeline: Frame Scrub + Zoom Effect
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".content-scroll",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5
                }
            });

            // A) Scrub frames from 0 to 191
            tl.to(anime, {
                frame: FRAME_COUNT,
                snap: "frame",
                ease: "none",
                onUpdate: render,
                duration: 10 // Relative duration within timeline
            });

            // B) Zoom In Effect at the end (Overlap with last part of scrubbing)
            tl.to(canvasRef.current, {
                scale: 5,
                opacity: 0,
                ease: "power2.inOut",
                duration: 2
            }, ">-1.5");

            // Fade out overlay sections so they don't abstract MainContent
            tl.to(".content-scroll", {
                opacity: 0,
                duration: 1
            }, "<");

            // Reveal Main Content "in place"
            tl.to(".main-content-wrapper", {
                opacity: 1,
                pointerEvents: "all",
                duration: 1,
                ease: "power2.inOut"
            }, "<+=0.5");

            // 3. Text Animations on Scroll (Keep existing)
            // Section 2 Text
            gsap.from(".section-2-text", {
                x: -100,
                opacity: 0,
                scrollTrigger: {
                    trigger: ".section-2",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            });

            // Section 3 Text
            // gsap.from(".section-3-text", {
            //     scale: 0.5,
            //     opacity: 0,
            //     scrollTrigger: {
            //         trigger: ".section-3",
            //         start: "top 80%",
            //         end: "center center",
            //         scrub: 1
            //     }
            // });
        }, containerRef);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            ctx.revert();
        };
    }, [isLoading]);

    if (isLoading) {
        return (
            <div id="loader" className="fixed top-0 left-0 w-full h-full bg-black text-[#bb0a0a] flex justify-center items-center z-[9999] font-[Oswald] text-2xl">
                LOADING DOMAIN EXPANSION... {loadProgress}%
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Permanent+Marker&family=Roboto:wght@300;500&display=swap');
                `}</style>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative bg-black">
            {/* Global Styles for this component */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Permanent+Marker&family=Roboto:wght@300;500&display=swap');

                :root {
                    --c-black: #050505;
                    --c-red: #bb0a0a;
                    --c-white: #f0f0f0;
                    --c-blue: #0b1e3b;
                }

                body {
                    background-color: var(--c-black);
                    color: var(--c-white);
                    font-family: 'Roboto', sans-serif;
                    overflow-x: hidden;
                    margin: 0;
                    padding: 0;
                }
                
                /* Ensure MainContent scrollbar looks good */
                .main-content-wrapper::-webkit-scrollbar {
                    width: 8px;
                }
                .main-content-wrapper::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                .main-content-wrapper::-webkit-scrollbar-thumb {
                    background: #bb0a0a;
                    border-radius: 4px;
                }

                @import url('https://fonts.googleapis.com/css2?family=Zen+Tokyo+Zoo&display=swap');

                .hero-title {
                    font-family: 'Permanent Marker', cursive;
                    font-size: clamp(3.5rem, 18vw, 15rem);
                    color: #000000; 
                    -webkit-text-stroke: 0;
                    line-height: 0.85;
                    text-shadow: none;
                    margin-bottom: 1rem;
                    opacity: 0;
                    transform: translateY(50px);
                }

                h1 {
                    font-family: 'Zen Tokyo Zoo', cursive;
                    font-size: clamp(3.5rem, 15vw, 12rem);
                    color: transparent;
                    -webkit-text-stroke: 2px var(--c-white); /* Outline style */
                    margin-bottom: 1rem;
                    line-height: 0.9;
                    text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                    opacity: 0; 
                    transform: translateY(50px);
                    letter-spacing: 0.1em;
                }

                h1 span {
                    display: block;
                    color: var(--c-red);
                    -webkit-text-stroke: 0;
                }

                /* Glitch Effect */
                .glitch {
                    position: relative;
                }
                .glitch::before, .glitch::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .glitch::before {
                    left: 2px;
                    text-shadow: -1px 0 red;
                    background: var(--c-black); 
                    clip: rect(24px, 550px, 90px, 0);
                    animation: glitch-anim 3s infinite linear alternate-reverse;
                }
                .glitch::after {
                    left: -2px;
                    text-shadow: -1px 0 blue;
                    background: var(--c-black);
                    clip: rect(85px, 550px, 140px, 0);
                    animation: glitch-anim 2.5s infinite linear alternate-reverse;
                }

                @keyframes glitch-anim {
                    0% { clip: rect(13px, 9999px, 81px, 0); }
                    20% { clip: rect(78px, 9999px, 13px, 0); }
                    40% { clip: rect(25px, 9999px, 95px, 0); }
                    60% { clip: rect(6px, 9999px, 66px, 0); }
                    80% { clip: rect(88px, 9999px, 16px, 0); }
                    100% { clip: rect(2px, 9999px, 91px, 0); }
                }

                .cta-btn {
                    margin-top: 3rem;
                    padding: 1.5rem 4rem;
                    background: var(--c-red);
                    color: #fff;
                    border: none;
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%);
                    transition: all 0.3s ease;
                }
                .cta-btn:hover {
                    background: #fff;
                    color: var(--c-red);
                    transform: scale(1.05);
                }
            `}</style>

            {/* Canvas Wrapper - Fixed background */}
            <div id="canvas-container" className="fixed top-0 left-0 w-full h-[100vh] z-0 flex justify-center items-center bg-black">
                <canvas ref={canvasRef} className="block max-w-full max-h-full"></canvas>
            </div>

            {/* Scrollable Content for Animation Driver */}
            <div className="content-scroll relative z-10">
                {/* Spacer to allow scroll (500vh total height) */}
                <div style={{ height: '500vh' }}>

                    {/* Section 1: Intro */}

                    {/* Section 2: Character */}
                    <section className="h-screen flex flex-col justify-center items-center text-center p-8">
                        <h1 className="hero-title text-[#fffff]">GOJO<br /><span className="text-[#ff0000] text-stroke-0" style={{ WebkitTextStroke: 0 }}>SATORU</span></h1>
                        <p className="font-[Oswald] text-2xl tracking-[0.2rem] uppercase max-w-[600px] text-white mt-8">
                            The Honored One
                        </p>
                    </section>

                    {/* Section 3: Domain Expansion */}
                    <section className="section-3 h-screen flex flex-col justify-center items-center text-center p-8">
                        <h2
                            className="section-3-text glitch font-['Permanent_Marker'] text-[clamp(2.5rem,10vw,5rem)] text-[#bb0a0a] mb-8"
                            data-text="DOMAIN EXPANSION"
                        >
                            DOMAIN EXPANSION
                        </h2>
                        <button className="cta-btn section-3-text">
                            ENTER THE CULLING GAME
                        </button>
                    </section>
                </div>
            </div>

            {/* Main Content Overlay - Fixed on top, initially hidden */}
            <div className="main-content-wrapper fixed top-0 left-0 w-full h-full z-50 opacity-0 pointer-events-none overflow-y-auto bg-black">
                <SukunaSequence preloadedImages={sukunaImages} />
            </div>
        </div>
    );
}
