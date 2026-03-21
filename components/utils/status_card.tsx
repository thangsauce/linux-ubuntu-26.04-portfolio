// Status card panel — the dropdown that appears when you click the system tray.
// Contains: battery level, volume/brightness sliders, and toggle tiles
// (Wi-Fi, Bluetooth, Power Mode, Night Light, Dark Style, DND, Airplane Mode).
// Night Light applies a CSS filter to #monitor-screen; Dark Style toggles a body class.
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { WifiIcon } from './status';
import { showNotification } from './notification';

interface SliderProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    name?: string;
}

class Slider extends Component<SliderProps> {
    render() {
        const pct = this.props.value;
        const trackStyle = {
            backgroundImage: `linear-gradient(to right, #E95420 0%, #E95420 ${pct}%, rgba(175,175,175,0.3) ${pct}%, rgba(175,175,175,0.3) 100%)`,
        };
        return (
            <input
                type="range"
                onChange={this.props.onChange}
                className={this.props.className}
                style={trackStyle}
                name={this.props.name}
                min="0"
                max="100"
                value={this.props.value}
                step="1"
            />
        );
    }
}

interface StatusCardProps {
    visible: boolean;
    toggleVisible: () => void;
    shutDown: () => void;
    lockScreen: () => void;
    wifi?: boolean;
    wifiSignal?: number;
    onWifiChange?: (val: boolean) => void;
    onMuteChange?: (val: boolean) => void;
}

interface StatusCardState {
    sound_level: number;
    brightness_level: number;
    wifi: boolean;
    bluetooth: boolean;
    powerMode: boolean;
    nightLight: boolean;
    darkStyle: boolean;
    doNotDisturb: boolean;
    airplaneMode: boolean;
    battery_level: number | null;
    battery_charging: boolean;
    battery_supported: boolean; // false on Safari/Firefox where Battery API is unavailable
}

export class StatusCard extends Component<StatusCardProps, StatusCardState> {
    battery: any;
    batteryUpdate: (() => void) | null = null; // saved ref so removeEventListener can match it on unmount
    batteryPollInterval: ReturnType<typeof setInterval> | null = null; // fallback poll when events unsupported

    constructor(props: StatusCardProps) {
        super(props);
        this.state = {
            sound_level: 75,
            brightness_level: 100,
            wifi: true,
            bluetooth: false,
            powerMode: true,
            nightLight: false,
            darkStyle: true,
            doNotDisturb: false,
            airplaneMode: false,
            battery_level: null,
            battery_charging: false,
            battery_supported: true,
        };
    }

    handleClickOutside = () => {
        this.props.toggleVisible();
    };

    componentDidMount() {
        const savedSound = localStorage.getItem('sound-level') || 75;
        this.setState({
            sound_level: Number(savedSound),
            brightness_level: Number(localStorage.getItem('brightness-level') || 100)
        }, () => {
            this.applyScreenFilter(this.state.brightness_level, this.state.nightLight);
            document.querySelectorAll('audio, video').forEach((el) => {
                (el as HTMLMediaElement).volume = Number(savedSound) / 100;
            });
        });

        if ((navigator as any).getBattery) {
            (navigator as any).getBattery().then((battery: any) => {
                if (!battery) {
                    this.setState({ battery_supported: false });
                    return;
                }
                this.battery = battery;
                this.batteryUpdate = () => {
                    // level can be undefined in partial implementations — skip the update if so
                    if (battery.level == null) return;
                    this.setState({
                        battery_level: Math.round(battery.level * 100),
                        battery_charging: battery.charging ?? false,
                    });
                };
                this.batteryUpdate(); // read initial state immediately
                if (typeof battery.addEventListener === 'function') {
                    // modern browsers — get live updates via events
                    battery.addEventListener('levelchange', this.batteryUpdate);
                    battery.addEventListener('chargingchange', this.batteryUpdate);
                } else {
                    // fallback: poll every 30s for browsers with partial Battery API support
                    this.batteryPollInterval = setInterval(this.batteryUpdate, 30_000);
                }
            }).catch(() => {
                // Battery API exists but threw (e.g. permission denied)
                this.setState({ battery_supported: false });
            });
        } else {
            // Safari and other browsers that don't implement the Battery API at all
            this.setState({ battery_supported: false });
        }
    }

    componentWillUnmount() {
        if (this.batteryPollInterval) clearInterval(this.batteryPollInterval);
        if (this.battery && this.batteryUpdate && typeof this.battery.removeEventListener === 'function') {
            this.battery.removeEventListener('levelchange', this.batteryUpdate);
            this.battery.removeEventListener('chargingchange', this.batteryUpdate);
        }
    }

    handleBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ brightness_level: Number(e.target.value) });
        localStorage.setItem('brightness-level', e.target.value);
        this.applyScreenFilter(Number(e.target.value), this.state.nightLight);
    };

    handleSound = (e: React.ChangeEvent<HTMLInputElement>) => {
        const level = e.target.value;
        this.setState({ sound_level: Number(level) });
        localStorage.setItem('sound-level', level);
        document.querySelectorAll('audio, video').forEach((el) => {
            (el as HTMLMediaElement).volume = Number(level) / 100;
        });
        if (this.props.onMuteChange) {
            this.props.onMuteChange(parseInt(level) <= 0);
        }
    };

    toggle = (key: keyof StatusCardState) => {
        this.setState(prev => {
            const newVal = !prev[key];
            const updates: Partial<StatusCardState> = { [key]: newVal };

            if (key === 'nightLight') {
                this.applyScreenFilter(this.state.brightness_level, newVal as boolean);
            }
            if (key === 'darkStyle') {
                document.body.classList.toggle('light-style', !(newVal as boolean));
            }
            if (key === 'wifi' && this.props.onWifiChange) {
                this.props.onWifiChange(newVal as boolean);
                showNotification(
                    newVal ? 'Wi-Fi Connected' : 'Wi-Fi Disconnected',
                    newVal ? 'Network connection established.' : 'You are now offline.'
                );
            }
            if (key === 'airplaneMode') {
                updates.bluetooth = false;
                if (newVal) {
                    updates.wifi = false;
                    if (this.props.onWifiChange) this.props.onWifiChange(false);
                    showNotification('Airplane Mode On', 'Wi-Fi and Bluetooth disabled.');
                } else {
                    updates.wifi = true;
                    if (this.props.onWifiChange) this.props.onWifiChange(true);
                    showNotification('Airplane Mode Off', 'Network connections restored.');
                }
            }

            return updates as Pick<StatusCardState, keyof StatusCardState>;
        });
    };

    applyScreenFilter = (brightness: number, nightLight: boolean) => {
        const screen = document.getElementById('monitor-screen');
        if (!screen) return;
        const b = `brightness(${3 / 400 * brightness + 0.25})`;
        const warm = nightLight ? ' sepia(0.4) saturate(1.3) hue-rotate(-10deg)' : '';
        screen.style.filter = b + warm;
    };

    render() {
        const wifi = this.props.wifi !== undefined ? this.props.wifi : this.state.wifi;
        const { bluetooth, powerMode, nightLight, darkStyle, doNotDisturb, airplaneMode } = this.state;

        const activeTile = "bg-ub-orange text-white cursor-pointer rounded-xl px-3 py-2.5 flex items-center gap-2.5 select-none h-14";
        const inactiveTile = "bg-white bg-opacity-10 text-gray-300 cursor-pointer rounded-xl px-3 py-2.5 flex items-center gap-2.5 hover:bg-opacity-20 select-none h-14";
        const arrowRight = (
            <svg viewBox="0 0 24 24" className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
        );

        return (
            <div
                className={
                    'absolute bg-ub-cool-grey rounded-2xl py-3 top-9 right-2 shadow-lg border-black border border-opacity-20 status-card w-72 md:w-96' +
                    (this.props.visible ? ' visible animateShow' : ' invisible')
                }
            >
                <div className="absolute w-0 h-0 -top-1 right-6 top-arrow-up" />

                {/* Top bar: battery + action buttons */}
                <div className="px-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-gray-300">
                        {this.state.battery_supported ? (
                            /* Battery API available (Chrome/Edge/Windows) — show live level */
                            <>
                                <div className="relative" style={{width:'14px', height:'18px'}}>
                                    {/* Vertical battery icon */}
                                    <svg viewBox="0 0 12 22" width="14" height="18" fill="none">
                                        <rect x="4" y="0" width="4" height="2" rx="1" fill="currentColor" opacity="0.6" />
                                        <rect x="0.75" y="2.75" width="10.5" height="18.5" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                                        <rect
                                            x="2.5"
                                            y={2.5 + 15 * (1 - (this.state.battery_level || 0) / 100)}
                                            width="7"
                                            height={15 * ((this.state.battery_level || 0) / 100)}
                                            rx="1"
                                            fill={this.state.battery_charging ? '#4ade80' : 'currentColor'}
                                            opacity="0.9"
                                        />
                                    </svg>
                                    {/* Charging bolt on the left side of battery */}
                                    {this.state.battery_charging && (
                                        <svg viewBox="0 0 24 24" className="absolute text-white" style={{width:'10px', height:'10px', top:'4px', left:'-3px'}} fill="currentColor">
                                            <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C13.96 17.17 12 21 11 21z" />
                                        </svg>
                                    )}
                                </div>
                                <span>{this.state.battery_level !== null ? `${this.state.battery_level}%` : '—'}</span>
                            </>
                        ) : (
                            /* Battery API unavailable (Safari, Firefox) — show plug icon */
                            <>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" opacity="0.7">
                                    <path d="M16 7V4h-2v3H10V4H8v3H5v2h1v7a2 2 0 0 0 2 2h2v2h4v-2h2a2 2 0 0 0 2-2V9h1V7h-3zm-1 9H9V9h6v7z" />
                                </svg>
                                <span className="opacity-60">AC</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button id="open-settings" onClick={this.props.toggleVisible} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-10 cursor-pointer outline-none">
                            <img width="16px" height="16px" src="./themes/Yaru/status/emblem-system-symbolic.svg" alt="settings" />
                        </button>
                        <button onClick={this.props.lockScreen} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-10 cursor-pointer outline-none">
                            <img width="16px" height="16px" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="lock" />
                        </button>
                        <button onClick={this.props.shutDown} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-10 cursor-pointer outline-none">
                            <img width="16px" height="16px" src="./themes/Yaru/status/system-shutdown-symbolic.svg" alt="power" />
                        </button>
                    </div>
                </div>

                {/* Volume slider */}
                <div className="px-4 py-1 flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                        {this.state.sound_level <= 0 ? (
                            /* Muted — faded speaker with top-right to bottom-left slash */
                            <>
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" opacity="0.3" />
                                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </>
                        ) : this.state.sound_level < 40 ? (
                            /* Low volume */
                            <>
                                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                            </>
                        ) : this.state.sound_level < 70 ? (
                            /* Medium volume */
                            <>
                                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" opacity="0.4"/>
                            </>
                        ) : (
                            /* High volume */
                            <>
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                            </>
                        )}
                    </svg>
                    <Slider onChange={this.handleSound} className="ubuntu-slider flex-1" value={this.state.sound_level} name="headphone_range" />
                </div>

                {/* Brightness slider */}
                <div className="px-4 py-1 pb-3 flex items-center gap-3">
                    <img width="16px" height="16px" src="./themes/Yaru/status/display-brightness-symbolic.svg" alt="brightness" className="flex-shrink-0" />
                    <Slider onChange={this.handleBrightness} className="ubuntu-slider flex-1" value={this.state.brightness_level} name="brightness_range" />
                </div>

                {/* Tile grid */}
                <div className="px-3 grid grid-cols-2 gap-2">

                    {/* Wi-Fi */}
                    <div onClick={() => this.toggle('wifi')} className={wifi ? activeTile : inactiveTile}>
                        <WifiIcon on={wifi} signal={this.props.wifiSignal || 3} className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Wi-Fi</div>
                            {wifi && <div className="text-xs opacity-70 truncate leading-tight">OnlyLANS</div>}
                        </div>
                        {arrowRight}
                    </div>

                    {/* Bluetooth */}
                    <div onClick={() => this.toggle('bluetooth')} className={bluetooth ? activeTile : inactiveTile}>
                        <img width="16px" height="16px" src="./themes/Yaru/status/bluetooth-symbolic.svg" alt="bluetooth" className={`flex-shrink-0 ${bluetooth ? "" : "opacity-50"}`} />
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Bluetooth</div>
                        </div>
                        {arrowRight}
                    </div>

                    {/* Power Mode */}
                    <div onClick={() => this.toggle('powerMode')} className={powerMode ? activeTile : inactiveTile}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {/* speedometer arc */}
                            <path d="M5.5 17.5A8 8 0 1 1 18.5 17.5" />
                            {/* tick marks */}
                            <line x1="12" y1="4" x2="12" y2="6" />
                            <line x1="6.5" y1="6.5" x2="7.9" y2="7.9" />
                            <line x1="4" y1="12" x2="6" y2="12" />
                            <line x1="17.5" y1="6.5" x2="16.1" y2="7.9" />
                            <line x1="20" y1="12" x2="18" y2="12" />
                            {/* needle — center when balanced, far right when performance */}
                            <line x1="12" y1="14" x2={powerMode ? "17" : "12"} y2={powerMode ? "17" : "7"} strokeWidth="2" />
                            {/* center dot */}
                            <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
                        </svg>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight truncate">Power Mode</div>
                            <div className="text-xs opacity-70 leading-tight truncate">{powerMode ? "Performance" : "Balanced"}</div>
                        </div>

                        {arrowRight}
                    </div>

                    {/* Night Light */}
                    <div onClick={() => this.toggle('nightLight')} className={nightLight ? activeTile : inactiveTile}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                            <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z" />
                        </svg>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Night Light</div>
                        </div>
                    </div>

                    {/* Dark Style */}
                    <div onClick={() => this.toggle('darkStyle')} className={darkStyle ? activeTile : inactiveTile}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z" />
                        </svg>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Dark Style</div>
                        </div>
                    </div>

                    {/* Do Not Disturb */}
                    <div onClick={() => this.toggle('doNotDisturb')} className={doNotDisturb ? activeTile : inactiveTile}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                            {doNotDisturb && <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                                fill={doNotDisturb ? "none" : "currentColor"}
                                stroke="currentColor"
                                strokeWidth={doNotDisturb ? "1.5" : "0"}
                            />
                        </svg>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Do Not Disturb</div>
                        </div>
                    </div>

                    {/* Airplane Mode */}
                    <div onClick={() => this.toggle('airplaneMode')} className={airplaneMode ? activeTile : inactiveTile}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" style={{ transform: 'rotate(45deg)' }}>
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-xs font-semibold leading-tight">Airplane Mode</div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default onClickOutside(StatusCard);
