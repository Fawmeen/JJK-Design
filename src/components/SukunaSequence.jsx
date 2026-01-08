'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import MangaPromo from './MangaPromo';
import CharacterDisplay from './CharacterDisplay';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 191;
const IMAGES_BASE_PATH = '/assets/sukuna/';

export default function SukunaSequence({ preloadedImages }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const scrollDriverRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const imagesRef = useRef([]);

    // 1. Preload Images
    useEffect(() => {
        if (preloadedImages && preloadedImages.length > 0) {
            imagesRef.current = preloadedImages;
            setIsLoading(false);
            return;
        }

        let loadedCount = 0;
        const imgArray = [];

        const preloadImages = async () => {
            const promises = [];

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const promise = new Promise((resolve) => {
                    const img = new Image();
                    const formattedIndex = i.toString().padStart(4, '0');
                    img.src = `${IMAGES_BASE_PATH}${formattedIndex}.jpg`;

                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(img);
                    };
                    img.onerror = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(null);
                    };
                    imgArray[i - 1] = img;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            imagesRef.current = imgArray.filter(Boolean);

            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        preloadImages();
    }, [preloadedImages]);

    // 2. Animation Logic
    useEffect(() => {
        if (isLoading) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });
        const images = imagesRef.current;

        // Base resolution
        canvas.width = 1920;
        canvas.height = 1080;

        const resizeCanvas = () => {
            const scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
            canvas.style.width = (1920 * scale) + "px";
            canvas.style.height = (1080 * scale) + "px";
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const anime = { frame: 0 };
        const render = () => {
            const index = Math.round(anime.frame);
            const img = images[index];
            if (img) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };

        render();

        const ctx = gsap.context(() => {
            const triggerEl = scrollDriverRef.current;
            const scrollerEl = containerRef.current?.closest('.main-content-wrapper');

            if (!triggerEl || !scrollerEl) return;

            // Reveal Navbar immediately
            gsap.to(".main-nav", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: triggerEl,
                    scroller: scrollerEl,
                    start: "top+=100 center", // Trigger slightly after start
                    toggleActions: "play none none reverse"
                }
            });

            // Text Entry
            gsap.fromTo("h1",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", delay: 0.5 }
            );

            // Main Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerEl,
                    scroller: scrollerEl,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                    markers: false
                }
            });

            // MASK OPENING: Reveal Sukuna
            tl.fromTo(".sukuna-viewport",
                { clipPath: "circle(0% at 50% 50%)" },
                { clipPath: "circle(150% at 50% 50%)", duration: 1, ease: "power2.inOut" }
            );

            // Scrub Frames
            tl.to(anime, {
                frame: images.length - 1,
                snap: "frame",
                ease: "none",
                onUpdate: () => render(),
                duration: 9 // Reduced slightly to account for mask time logic if needed, but in timeline duration is relative proportions
            }, "<"); // Play concurrently with mask open (start at 0)

            // MASK TRANSITION
            // As we scroll to the end, clip the canvas to reveal Characters
            tl.to(".sukuna-viewport", {
                clipPath: "inset(0 0 100% 0)",
                ease: "power2.inOut",
                duration: 2
            }, ">-2");

            // Section 2 Text
            // gsap.from(".sukuna-section-2-text", {
            //     x: 100,
            //     opacity: 0,
            //     scrollTrigger: {
            //         trigger: ".sukuna-section-2",
            //         scroller: scrollerEl,
            //         start: "top center",
            //         end: "bottom center",
            //         scrub: 1
            //     }
            // });

            // Section 3 Text

        }, containerRef);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            ctx.revert();
        };
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black text-[#ff0000] flex justify-center items-center z-[50] font-[Oswald] text-2xl">
                SUMMONING SUKUNA... {loadProgress}%
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Permanent+Marker&family=Roboto:wght@300;500&display=swap');
                `}</style>
            </div>
        );
    }

    return (
        <>
            {/* Navbar (Fixed) - Wrapped div for GSAP targeting */}
            <div className="main-nav fixed top-0 left-0 w-full z-[100] opacity-0 translate-y-[-100px] pointer-events-none">
                <div className="pointer-events-auto w-full">
                    <Navbar />
                </div>
            </div>

            <div ref={containerRef} className="relative w-full bg-black">
                <style jsx>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;800&family=Oswald:wght@500;700&display=swap');
                    .sukuna-text { font-family: 'Inter', sans-serif; }
                    .sukuna-title {
                        font-family: 'Oswald', sans-serif;
                        font-size: clamp(6rem, 15vw, 12rem);
                        font-weight: 700;
                        color: white;
                        line-height: 0.9;
                    }
                `}</style>

                {/* 500vh Scroll Sequence */}
                <div className="relative w-full h-[500vh]">
                    {/* Sticky Viewport */}
                    <div className="sukuna-viewport sticky top-0 w-full h-screen overflow-hidden">
                        {/* Canvas Buffer */}
                        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block" />

                        {/* Overlay */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />


                    </div>

                    {/* Scroll Driver Content */}
                    <div ref={scrollDriverRef} className="sukuna-content-scroll absolute top-0 left-0 w-full h-full z-10">
                        {/* Section 1 */}
                        <section className="h-screen flex flex-col justify-center items-center text-center p-8">
                            <h1 className="sukuna-title">RYOMEN<br /><span className="text-[#ff0000] text-stroke-0" style={{ WebkitTextStroke: 0 }}>SUKUNA</span></h1>
                            <p className="font-[Oswald] text-2xl tracking-[0.2rem] uppercase max-w-[600px] text-white mt-8">
                                King of Curses
                            </p>
                        </section>

                        {/* Spacer for timing */}
                        <div className="h-[100vh]"></div>

                        {/* Section 2 */}
                        {/* <section className="sukuna-section-2 h-screen flex flex-col justify-end items-center text-center p-8 pb-[20vh]">
                            <div className="sukuna-section-2-text">
                                <h2 className="font-[Oswald] text-[5rem] text-white drop-shadow-[2px_2px_0_#ff0000]">
                                    ABSOLUTE POWER
                                </h2>
                                <p className="bg-red-900/40 p-4 font-[Oswald] text-xl uppercase tracking-widest text-[#f0f0f0] border border-red-600">
                                    "Know your place, fool."
                                </p>
                            </div>
                        </section> */}

                        {/* Section 3 */}

                    </div>
                </div>

                {/* Next Section: Character Display */}
                <CharacterDisplay />
                <MangaPromo />
                <Footer />
            </div>
        </>
    );
}
