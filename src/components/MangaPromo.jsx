'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MangaPromo() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".manga-content",
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        // Reusing existing Sukuna asset or a placeholder color for the manga banner background
        <section ref={sectionRef} className="w-full h-[60vh] bg-neutral-900 relative overflow-hidden flex items-center justify-center border-t border-b border-gray-800 z-20">
            <div className="absolute inset-0 bg-[url('https://shorturl.at/t3W7A')] bg-cover bg-center opacity-30 mix-blend-screen grayscale"></div>
            {/* Using a generic pattern or dark noise if image fails */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>

            <div className="manga-content relative z-10 text-center bg-black/50 backdrop-blur-sm border border-white/20 p-6 md:p-12">
                <h2 className="font-[Bangers] text-4xl md:text-6xl text-white mb-4 tracking-wide text-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    READ THE MANGA
                </h2>
                <p className="font-[Oswald] text-xl text-gray-300 mb-8 max-w-lg mx-auto">
                    Witness the Culling Game arc in its original glory.
                    Chapter 236 awaits.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="bg-white text-black font-['Oswald'] text-xl py-3 px-8 font-bold hover:bg-transparent hover:text-white hover:border hover:border-white border border-transparent transition-all duration-300">
                        START READING
                    </button>
                    <button className="border border-white text-white font-['Oswald'] text-xl py-3 px-8 font-bold hover:bg-white hover:text-black transition-all duration-300">
                        LATEST CHAPTER
                    </button>
                </div>
            </div>
        </section>
    );
}
