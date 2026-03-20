// Top navbar — shows the Ubuntu logo, clock, and system status bar.
// Clicking the status area opens the StatusCard panel (wifi, sound, brightness,
// lock/shutdown buttons). Also reads real connection speed via navigator.connection.
import React, { Component } from 'react';
import Clock from '../utils/clock';
import Status from '../utils/status';
import StatusCard from '../utils/status_card';

interface NavbarProps {
    wifi: boolean;
    shutDown: () => void;
    lockScreen: () => void;
    onWifiChange: (val: boolean) => void;
}

interface NavbarState {
    status_card: boolean;
    muted: boolean;
    wifiSignal: number;
}

export default class Navbar extends Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = {
            status_card: false,
            muted: false,
            wifiSignal: 3,
        };
    }

    componentDidMount() {
        const updateSignal = () => {
            const conn: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            if (!conn) return;
            const type: string = conn.effectiveType;
            const signal = type === '4g' ? 3 : type === '3g' ? 2 : type === '2g' ? 1 : 1;
            this.setState({ wifiSignal: signal });
        };
        updateSignal();
        const conn: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (conn) conn.addEventListener('change', updateSignal);
    }

    render() {
        return (
            <div className="main-navbar-vp absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
                <div
                    tabIndex={0}
                    className={
                        'pl-4 pr-3 outline-none py-1 '
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="4" viewBox="0 0 34 4" fill="currentColor">
                        <rect x="0" y="0" width="26" height="4" rx="2"/>
                        <circle cx="32" cy="2" r="2" fill="#888"/>
                    </svg>
                </div>
                <div
                    tabIndex={0}
                    className={
                        'pl-2 pr-2 text-xs md:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1'
                    }
                >
                    <Clock />
                </div>
                <div
                    id="status-bar"
                    tabIndex={0}
                    onFocus={() => {
                        this.setState({ status_card: true });
                    }}
                    // removed onBlur from here
                    className={
                        'relative pr-3 pl-3 outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1 '
                    }
                >
                    <Status wifi={this.props.wifi} muted={this.state.muted} wifiSignal={this.state.wifiSignal} />
                    <StatusCard
                        shutDown={this.props.shutDown}
                        lockScreen={this.props.lockScreen}
                        visible={this.state.status_card}
                        toggleVisible={() => {
                            this.setState({ status_card: false });
                        }}
                        wifi={this.props.wifi}
                        wifiSignal={this.state.wifiSignal}
                        onWifiChange={this.props.onWifiChange}
                        onMuteChange={(val: boolean) => this.setState({ muted: val })}
                    />
                </div>
            </div>
        );
    }
}
