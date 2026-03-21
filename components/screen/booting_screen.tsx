import React from 'react'

interface BootingScreenProps {
    visible: boolean;
    isShutDown: boolean;
    turnOn: () => void;
}

function BootingScreen(props: BootingScreenProps) {
    return (
        <div
            style={(props.visible || props.isShutDown ? { zIndex: "100" } : { zIndex: "-20" })}
            className={(props.visible || props.isShutDown ? " visible opacity-100" : " invisible opacity-0 ") + " absolute duration-500 select-none top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black"}
        >
            {props.isShutDown ? (
                /* Shutdown: power button centered */
                <div className="w-full h-full flex items-center justify-center">
                    <div
                        className="w-10 h-10 flex justify-center items-center rounded-full outline-none cursor-pointer"
                        onClick={props.turnOn}
                    >
                        <div className="bg-white rounded-full flex justify-center items-center w-10 h-10 hover:bg-gray-300">
                            <img width="32px" height="32px" className="w-8" src="./themes/Yaru/status/power-button.svg" alt="Power Button" />
                        </div>
                    </div>
                </div>
            ) : (
                /* Boot: COF + spinner + Ubuntu brand */
                <div className="w-full h-full flex flex-col items-center">
                    {/* COF logo + spinner — pushed slightly above center */}
                    <div className="flex-1 flex flex-col items-center justify-center" style={{ paddingBottom: '80px' }}>
                        <img
                            src="./themes/Yaru/status/ubuntu-logo.svg"
                            alt="Ubuntu"
                            style={{ width: '130px', height: '130px' }}
                        />
                        {/* 3-segment ring spinner — extra gap below logo */}
                        <svg className="animate-spin" style={{ width: '24px', height: '24px', marginTop: '120px' }} viewBox="0 0 24 24">
                            <circle
                                cx="12" cy="12" r="10"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2.2"
                                strokeDasharray="15.71 5.24"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Ubuntu combination mark at bottom */}
                    <div className="flex items-end gap-2 pb-12">
                        <div style={{ backgroundColor: '#E95420', padding: '16px 7px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <img
                                src="./themes/Yaru/status/ubuntu-logo.svg"
                                alt=""
                                style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                            />
                        </div>
                        <span style={{ color: 'white', fontSize: '1.6rem', fontWeight: '300', letterSpacing: '0.02em' }}>Ubuntu</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BootingScreen
