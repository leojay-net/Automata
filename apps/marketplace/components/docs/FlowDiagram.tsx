'use client';

import { motion } from 'framer-motion';

const Node = ({ x, y, label, icon, delay }: { x: number; y: number; label: string; icon: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        className="absolute w-32 h-32 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl z-20"
        style={{ left: x, top: y }}
    >
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm font-bold text-center text-white">{label}</div>
    </motion.div>
);

const Connection = ({ start, end, label, delay }: { start: { x: number; y: number }; end: { x: number; y: number }; label: string; delay: number }) => {
    // Calculate center points of 32x32 (128px) nodes
    const startX = start.x + 64;
    const startY = start.y + 64;
    const endX = end.x + 64;
    const endY = end.y + 64;

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#60A5FA" />
                </marker>
            </defs>
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay, duration: 1, ease: "easeInOut" }}
                d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
            <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.5 }}
                x={(startX + endX) / 2}
                y={(startY + endY) / 2 - 10}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="12"
                className="font-mono bg-black"
            >
                {label}
            </motion.text>
        </svg>
    );
};

export default function FlowDiagram() {
    const nodes = [
        { id: 'user', label: 'User / Wallet', icon: '👤', x: 50, y: 150 },
        { id: 'frontend', label: 'Marketplace UI', icon: '🖥️', x: 300, y: 150 },
        { id: 'sdk', label: 'automata SDK', icon: '📦', x: 300, y: 350 },
        { id: 'contract', label: 'Aptos Contracts', icon: '⛓️', x: 600, y: 150 },
        { id: 'provider', label: 'AI Provider', icon: '🤖', x: 850, y: 150 },
    ];

    return (
        <div className="relative w-full h-[500px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden my-8">
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <Node {...nodes[0]} delay={0.2} />
            <Node {...nodes[1]} delay={0.4} />
            <Node {...nodes[2]} delay={0.6} />
            <Node {...nodes[3]} delay={0.8} />
            <Node {...nodes[4]} delay={1.0} />

            <Connection start={nodes[0]} end={nodes[1]} label="Browse / Connect" delay={1.2} />
            <Connection start={nodes[1]} end={nodes[3]} label="Sign Transaction" delay={1.5} />
            <Connection start={nodes[1]} end={nodes[2]} label="Function Calls" delay={1.8} />
            <Connection start={nodes[3]} end={nodes[4]} label="Event Emission" delay={2.1} />
            <Connection start={nodes[4]} end={nodes[3]} label="Verify / Result" delay={2.4} />
        </div>
    );
}
