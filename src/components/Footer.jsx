'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white p-12 border-t border-gray-900 relative z-20">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');
                .footer-font { font-family: 'Oswald', sans-serif; }
            `}</style>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-[Oswald] font-bold text-red-600 mb-4">JUJUTSU KAISEN</h2>
                    <p className="text-gray-400 max-w-xs text-sm">
                        Experience the Culling Game. Survive the curses. Join the community of sorcerers today.
                    </p>
                </div>

                {/* Newsletter */}
                <div className="w-full md:w-auto">
                    <h3 className="footer-font text-xl mb-4 font-bold">JOIN THE CULLING GAME</h3>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="ENTER YOUR EMAIL"
                            className="bg-gray-900 border border-gray-700 p-3 text-white font-mono w-full md:w-64 focus:border-red-600 outline-none transition-colors"
                        />
                        <button className="bg-red-600 text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors font-[Oswald]">
                            SIGN UP
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
                <p>&copy; 2026 GEGE AKUTAMI/SHUEISHA, JUJUTSU KAISEN PROJECT.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-red-500 transition-colors">YOUTUBE</a>
                    <a href="#" className="hover:text-red-500 transition-colors">TWITTER</a>
                    <a href="#" className="hover:text-red-500 transition-colors">REDDIT</a>
                </div>
            </div>
        </footer>
    );
}
