import React, { useState } from 'react';
import $ from 'jquery';
import WALLPAPERS from '../../wallpapers.config';
import SystemMonitor from './system-monitor';

interface SettingsProps {
    changeBackgroundImage: (path: string) => void;
    currBgImgName: string;
}

type Section = 'background' | 'system-monitor';

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
    {
        id: 'background',
        label: 'Background',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-8.5-4.5l-2.5-3.01L7 15h10l-3.5-4.5z" />
            </svg>
        ),
    },
    {
        id: 'system-monitor',
        label: 'System Monitor',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                <path d="M1 9l2 2c2.88-2.88 6.79-4.08 10.54-3.62l1.88-1.88C10.59 4.27 5.55 5.8 1 9zm17.81-4.38l-1.9 1.9C18.97 7.76 20.7 9.22 22 11l2-2c-1.56-1.76-3.5-3.1-5.19-4.38zM12 4c1.13 0 2.23.13 3.29.37l2.04-2.04C15.52 1.52 13.8 1 12 1 8.52 1 5.41 2.3 3.07 4.47L5 6.4C6.83 4.89 9.3 4 12 4zm0 5c-1.93 0-3.68.79-4.95 2.05L9 13c.86-.86 2.04-1.4 3.37-1.4.75 0 1.46.19 2.08.52l1.7-1.7C15.1 9.68 13.62 9 12 9zm0 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
            </svg>
        ),
    },
];

export function Settings(props: SettingsProps): React.ReactNode {
    const [section, setSection] = useState<Section>('background');
    const wallpapers = WALLPAPERS;

    const changeBackgroundImage = (e: React.FocusEvent<HTMLDivElement>): void => {
        props.changeBackgroundImage($(e.target).data('path') as string);
    };

    return (
        <div className="w-full h-full flex bg-ub-cool-grey overflow-hidden">
            {/* Left nav */}
            <div className="w-32 flex-shrink-0 flex flex-col border-r border-black border-opacity-30 bg-ub-grey pt-2 pb-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">Settings</div>
                {NAV.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setSection(item.id)}
                        className={
                            'flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors duration-100 w-full outline-none ' +
                            (section === item.id
                                ? 'bg-ub-orange bg-opacity-90 text-white'
                                : 'text-gray-300 hover:bg-white hover:bg-opacity-5')
                        }
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto windowMainScreen">
                {section === 'background' && (
                    <div className="flex flex-col">
                        <div
                            className="md:w-2/5 w-2/3 h-32 m-auto my-4 rounded-lg overflow-hidden"
                            style={{
                                backgroundImage: `url(${wallpapers[props.currBgImgName]})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        />
                        <div className="flex flex-wrap justify-center items-center border-t border-black border-opacity-30 pt-2 px-2">
                            {Object.keys(wallpapers).map((name, index) => (
                                <div
                                    key={index}
                                    tabIndex={1}
                                    onFocus={changeBackgroundImage}
                                    data-path={name}
                                    className={
                                        (name === props.currBgImgName ? 'border-ub-orange ' : 'border-transparent ') +
                                        'md:px-20 md:py-14 md:m-3 m-2 px-10 py-8 outline-none border-4 border-opacity-90 rounded-md'
                                    }
                                    style={{
                                        backgroundImage: `url(${wallpapers[name]})`,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {section === 'system-monitor' && <SystemMonitor />}
            </div>
        </div>
    );
}

export default Settings;

export const displaySettings = (): React.ReactNode => {
    return <Settings changeBackgroundImage={() => {}} currBgImgName="wall-1" />;
};
