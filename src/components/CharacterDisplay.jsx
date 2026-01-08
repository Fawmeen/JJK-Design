'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { characters } from '../data/characters'; /* you might need to fix alias or path */

export default function CharacterDisplay() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Entry Animation: Stagger tiles
        const tiles = gsap.utils.toArray('.char-tile');

        gsap.fromTo(tiles,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    scroller: ".main-content-wrapper", // Must match parent scroller if used there
                    start: "top 80%"
                }
            }
        );
    }, []);

    return (
        <section ref={containerRef} id="characters" className="w-full min-h-screen bg-[#0a0a0a] p-12 flex flex-col justify-center items-center relative z-20">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Oswald:wght@400;700&display=swap');
                
                .char-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    grid-template-rows: repeat(2, 400px);
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1600px;
                }

                .char-tile {
                    position: relative;
                    overflow: hidden;
                    border-radius: 4px;
                    transition: transform 0.4s ease;
                    cursor: pointer;
                    background: #111;
                }

                .char-tile:hover {
                    transform: scale(1.02);
                    z-index: 10;
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                }

                /* Bento Grid Layout logic - GTA Style Layout */
                .tile-1 { grid-column: span 4; grid-row: span 2; } /* Large Left */
                .tile-2 { grid-column: span 4; grid-row: span 1; }
                .tile-3 { grid-column: span 4; grid-row: span 1; }
                .tile-4 { grid-column: span 8; grid-row: span 1; } /* Wide Bottom */

                .char-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 2rem;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
                .char-tile:hover .char-overlay {
                    opacity: 1;
                    background: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2));
                }

                .char-name {
                    font-family: 'Bangers', cursive;
                    font-size: 3rem;
                    color: white;
                    line-height: 1;
                    transform: translateY(10px);
                    transition: transform 0.3s;
                }
                .char-tile:hover .char-name {
                    transform: translateY(0);
                    color: var(--char-color);
                }

                .char-ability {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.2rem;
                    color: #aaa;
                    margin-top: 0.5rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s 0.1s;
                }
                .char-tile:hover .char-ability {
                    opacity: 1;
                    transform: translateY(0);
                }

                .grid-title {
                    font-family: 'Bangers';
                    font-size: 8rem;
                    color: white;
                    margin-bottom: 2rem;
                    text-align: center;
                    text-transform: uppercase;
                    background: linear-gradient(45deg, #ff0000, #ff0080);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <h2 className="grid-title">Character Select</h2>

            <div className="char-grid">
                {characters.slice(0, 4).map((char, index) => {
                    // Assign classes based on index for layout
                    const tileClass = `tile-${index + 1}`;

                    return (
                        <div
                            key={char.id}
                            className={`char-tile ${tileClass}`}
                            style={{ '--char-color': char.color }}
                        >
                            {/* Placeholder Image or Color BG for now */}
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                                style={{
                                    backgroundImage: `url(${char.image})`,
                                    backgroundColor: '#333' // Fallback
                                }}
                            />

                            <div className="char-overlay">
                                <h3 className="char-name">{char.name}</h3>
                                <p className="char-ability">// {char.ability}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sukuna Special Tile (Full Width Optional or Separator) */}
            <div className="w-full max-w-[1600px] mt-8 bg-gradient-to-r from-red-900 to-black p-8 rounded border border-red-600 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-[url('/assets/sukuna/0191.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-60 transition-opacity duration-500 mix-blend-overlay"></div>
                <div className="relative z-10 flex justify-between items-center px-8">
                    <div>
                        <h3 className="font-['Bangers'] text-6xl text-white group-hover:text-red-500 transition-colors">RYOMEN SUKUNA</h3>
                        <p className="font-['Oswald'] text-2xl text-gray-300">THE KING OF CURSES</p>
                    </div>
                    <button className="bg-white text-black font-bold py-3 px-8 font-mono hover:bg-red-600 hover:text-white transition-colors">
                        VIEW PROFILE
                    </button>
                </div>
            </div>

        </section>
    );
}
