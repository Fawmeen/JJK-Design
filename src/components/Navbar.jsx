'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
    const navRef = useRef(null);

    useEffect(() => {
        // Simple entry animation (slide down)
        // This can be triggered by a parent or just auto-animate if mounted later
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
        );
    }, []);

    const links = ["HOME", "ABOUT", "CHARACTERS", "MANGA"];

    return (
        <nav ref={navRef} className="fixed top-0 left-0 w-full z-[100] px-12 py-6 flex justify-between items-center bg-transparent backdrop-blur-sm pointer-events-auto mix-blend-difference">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap');
                .nav-link {
                    font-family: 'Oswald', sans-serif;
                    position: relative;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0%;
                    height: 2px;
                    background: white;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
            `}</style>

            <div className="text-white font-[Oswald] text-2xl font-bold tracking-widest cursor-pointer hover:text-red-500 transition-colors">
                JK // OFFICIAL
            </div>

            <ul className="flex space-x-12">
                {links.map((link) => (
                    <li key={link}>
                        <a href={`#${link.toLowerCase()}`} className="nav-link text-white text-lg tracking-wider cursor-pointer">
                            {link}
                        </a>
                    </li>
                ))}
            </ul>

            <button className="border border-white text-white px-6 py-2 font-[Oswald] tracking-widest hover:bg-white hover:text-black transition-colors">
                JOIN CULLING GAME
            </button>
        </nav>
    );
}
