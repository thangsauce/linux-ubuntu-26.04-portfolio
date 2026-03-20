import React, { Component } from 'react';

interface UbuntuAppProps {
    id: string;
    name: string;
    icon: string;
    openApp: (id: string) => void;
    isExternalApp?: boolean;
    url?: string;
    wifi?: boolean;
}

interface UbuntuAppState {
    shaking: boolean;
}

// Global toast — one instance shared across all app icons
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function showNoWifiToast(): void {
    const toast = document.getElementById('no-wifi-toast');
    if (!toast) return;
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 2000);
}

export class UbuntuApp extends Component<UbuntuAppProps, UbuntuAppState> {
    constructor(props: UbuntuAppProps) {
        super(props);
        this.state = { shaking: false };
    }

    openApp = (): void => {
        if (this.props.isExternalApp && this.props.url) {
            if (this.props.wifi === false) {
                this.setState({ shaking: true });
                showNoWifiToast();
                setTimeout(() => this.setState({ shaking: false }), 500);
                return;
            }
            window.open(this.props.url, '_blank');
        } else {
            this.props.openApp(this.props.id);
        }
    };

    render(): React.ReactNode {
        return (
            <div
                className={
                    'p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white relative' +
                    (this.state.shaking ? ' animate-shake' : '')
                }
                id={'app-' + this.props.id}
                onDoubleClick={this.openApp}
                onTouchEnd={(e) => { e.preventDefault(); this.openApp(); }}
                data-context="desktop-app"
                data-app-id={this.props.id}
                tabIndex={0}
            >
                <div className="relative">
                    <img width="40px" height="40px" className="mb-1 w-10" src={this.props.icon} alt={'Ubuntu ' + this.props.name} />
                    {this.props.isExternalApp && (
                        <img
                            src="./themes/Yaru/status/arrow-up-right.svg"
                            alt="External Link"
                            className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5"
                        />
                    )}
                </div>
                {this.props.name}
            </div>
        );
    }
}

export default UbuntuApp;
