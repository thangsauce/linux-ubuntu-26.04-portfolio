import React, { useState, useEffect, useRef } from 'react';

const PROCESSES = [
    { pid: 1,    name: 'systemd',        cpu: 0.0, mem: 8.2  },
    { pid: 892,  name: 'Xorg',           cpu: 0.3, mem: 42.1 },
    { pid: 1204, name: 'gnome-shell',    cpu: 0.8, mem: 156.4 },
    { pid: 1891, name: 'node',           cpu: 1.2, mem: 88.7 },
    { pid: 2103, name: 'next-server',    cpu: 0.4, mem: 74.3 },
    { pid: 2450, name: 'firefox',        cpu: 2.1, mem: 312.6 },
    { pid: 2891, name: 'code',           cpu: 0.6, mem: 189.2 },
    { pid: 3210, name: 'gnome-terminal', cpu: 0.1, mem: 22.8 },
    { pid: 3640, name: 'nautilus',       cpu: 0.0, mem: 34.5 },
    { pid: 4012, name: 'pulseaudio',     cpu: 0.2, mem: 18.3 },
];

const FILESYSTEMS = [
    { mount: '/',         device: '/dev/nvme0n1p2', size: '512 GB', used: '148 GB', pct: 29 },
    { mount: '/boot/efi', device: '/dev/nvme0n1p1', size: '512 MB', used: '6 MB',   pct: 1  },
    { mount: '/home',     device: '/dev/nvme0n1p3', size: '1.0 TB', used: '420 GB', pct: 41 },
];

type Tab = 'resources' | 'processes' | 'filesystems';

function useAnimatedValue(base: number, variance: number, interval: number) {
    const [value, setValue] = useState(base);
    useEffect(() => {
        const id = setInterval(() => {
            setValue(Math.min(99, Math.max(1, base + (Math.random() - 0.5) * variance)));
        }, interval);
        return () => clearInterval(id);
    }, [base, variance, interval]);
    return value;
}

function ResourceBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-400">
                <span>{label}</span>
                <span className="text-white font-medium">{value.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

function ResourcesTab() {
    const cpu1 = useAnimatedValue(18, 20, 1200);
    const cpu2 = useAnimatedValue(32, 25, 1500);
    const cpu3 = useAnimatedValue(12, 15, 900);
    const cpu4 = useAnimatedValue(44, 30, 1100);
    const ram = useAnimatedValue(61, 8, 2000);
    const swap = useAnimatedValue(4, 4, 3000);
    const netDown = useAnimatedValue(12, 18, 800);
    const netUp = useAnimatedValue(5, 10, 1000);

    return (
        <div className="p-5 flex flex-col gap-6 overflow-auto">
            <section>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">CPU History</div>
                <div className="grid grid-cols-2 gap-3">
                    <ResourceBar label="CPU Core 1" value={cpu1} color="#E95420" />
                    <ResourceBar label="CPU Core 2" value={cpu2} color="#E95420" />
                    <ResourceBar label="CPU Core 3" value={cpu3} color="#E95420" />
                    <ResourceBar label="CPU Core 4" value={cpu4} color="#E95420" />
                </div>
                <div className="mt-3 text-xs text-gray-500">
                    Total: {((cpu1 + cpu2 + cpu3 + cpu4) / 4).toFixed(1)}% avg &nbsp;·&nbsp; 12 cores &nbsp;·&nbsp; Intel Core i7-1355U
                </div>
            </section>

            <section>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">Memory & Swap</div>
                <div className="flex flex-col gap-3">
                    <ResourceBar label={`RAM  —  ${(ram / 100 * 16).toFixed(1)} GB / 16 GB`} value={ram} color="#3584e4" />
                    <ResourceBar label={`Swap  —  ${(swap / 100 * 8).toFixed(1)} GB / 8 GB`} value={swap} color="#9141ac" />
                </div>
            </section>

            <section>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">Network</div>
                <div className="flex flex-col gap-3">
                    <ResourceBar label={`Download  —  ${netDown.toFixed(1)} Mbps`} value={netDown} color="#26a269" />
                    <ResourceBar label={`Upload  —  ${netUp.toFixed(1)} Mbps`} value={netUp} color="#f6d32d" />
                </div>
            </section>
        </div>
    );
}

function ProcessesTab() {
    return (
        <div className="flex flex-col h-full overflow-auto">
            <table className="w-full text-xs">
                <thead className="sticky top-0 bg-ub-window-title">
                    <tr className="text-gray-400 uppercase tracking-wide">
                        <th className="text-left px-4 py-2 font-medium">Process Name</th>
                        <th className="text-right px-4 py-2 font-medium">PID</th>
                        <th className="text-right px-4 py-2 font-medium">CPU %</th>
                        <th className="text-right px-4 py-2 font-medium">Memory</th>
                    </tr>
                </thead>
                <tbody>
                    {PROCESSES.map((p, i) => (
                        <tr key={p.pid} className={(i % 2 === 0 ? 'bg-white bg-opacity-0' : 'bg-white bg-opacity-5') + ' hover:bg-white hover:bg-opacity-10'}>
                            <td className="px-4 py-1.5 text-ubt-grey">{p.name}</td>
                            <td className="px-4 py-1.5 text-gray-400 text-right font-mono">{p.pid}</td>
                            <td className="px-4 py-1.5 text-right" style={{ color: p.cpu > 1 ? '#E95420' : '#aaa' }}>{p.cpu.toFixed(1)}</td>
                            <td className="px-4 py-1.5 text-gray-400 text-right font-mono">{p.mem.toFixed(1)} MB</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function FileSystemsTab() {
    return (
        <div className="p-5 flex flex-col gap-4 overflow-auto">
            {FILESYSTEMS.map(fs => (
                <div key={fs.mount} className="bg-white bg-opacity-5 rounded-lg p-4">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-white font-medium">{fs.mount}</span>
                        <span className="text-xs text-gray-400 font-mono">{fs.device}</span>
                    </div>
                    <div className="w-full h-2 bg-white bg-opacity-10 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-ub-orange rounded-full"
                            style={{ width: `${fs.pct}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{fs.used} used of {fs.size}</span>
                        <span>{fs.pct}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SystemMonitor() {
    const [tab, setTab] = useState<Tab>('resources');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'resources',   label: 'Resources'    },
        { id: 'processes',   label: 'Processes'    },
        { id: 'filesystems', label: 'File Systems' },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-ub-cool-grey text-ubt-grey">
            {/* Tab bar */}
            <div className="flex border-b border-white border-opacity-5 bg-ub-window-title px-2">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={
                            'px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ' +
                            (tab === t.id
                                ? 'border-ub-orange text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-200')
                        }
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-grow overflow-auto">
                {tab === 'resources'   && <ResourcesTab />}
                {tab === 'processes'   && <ProcessesTab />}
                {tab === 'filesystems' && <FileSystemsTab />}
            </div>
        </div>
    );
}

export function displaySystemMonitor() {
    return <SystemMonitor />;
}

export default SystemMonitor;
