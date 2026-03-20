import React, { Component } from 'react';

interface SideBarAppProps {
    id: string;
    title: string;
    icon: string;
    isClose: Record<string, boolean>;
    isFocus: Record<string, boolean>;
    openApp: (id: string) => void;
    isMinimized: Record<string, boolean>;
    openFromMinimised?: (id: string) => void;
}

interface SideBarAppState {
    showTitle: boolean;
    scaleImage: boolean;
}

export class SideBarApp extends Component<SideBarAppProps, SideBarAppState> {
    private id: string | null;

    constructor(props: SideBarAppProps) {
        super(props);
        this.id = null;
        this.state = {
            showTitle: false,
            scaleImage: false,
        };
    }

    componentDidMount(): void {
        this.id = this.props.id;
    }

    scaleImage = (): void => {
        setTimeout(() => {
            this.setState({ scaleImage: false });
        }, 1000);
        this.setState({ scaleImage: true });
    };

    openApp = (): void => {
        if (this.id && !this.props.isMinimized[this.id] && this.props.isClose[this.id]) {
            this.scaleImage();
        }
        if (this.id) this.props.openApp(this.id);
        this.setState({ showTitle: false });
    };

    render(): React.ReactNode {
        return (
            <div
                tabIndex={0}
                onClick={this.openApp}
                onTouchEnd={(e) => { e.preventDefault(); this.openApp(); }}
                onMouseEnter={() => {
                    this.setState({ showTitle: true });
                }}
                onMouseLeave={() => {
                    this.setState({ showTitle: false });
                }}
                className={(this.id && this.props.isClose[this.id] === false && this.props.isFocus[this.id] ? 'bg-white bg-opacity-10 ' : '') + ' w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1'}
                id={'sidebar-' + this.props.id}
            >
                <img width="28px" height="28px" className={this.id === 'terminal' ? 'w-10' : 'w-8'} src={this.props.icon} alt="Ubuntu App Icon" />
                <img
                    className={
                        (this.state.scaleImage ? ' scale ' : '') +
                        (this.id === 'terminal' ? ' scalable-app-icon w-10 ' : ' scalable-app-icon w-7 ') +
                        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    }
                    src={this.props.icon}
                    alt=""
                />
                {
                    this.id && this.props.isClose[this.id] === false
                        ? <div className=" w-1 h-1 absolute left-0 top-1/2 bg-ub-orange rounded-sm"></div>
                        : null
                }
                <div
                    className={
                        (this.state.showTitle ? ' visible ' : ' invisible ') +
                        ' w-max py-0.5 px-1.5 absolute top-1.5 left-full ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md'
                    }
                >
                    {this.props.title}
                </div>
            </div>
        );
    }
}

export default SideBarApp;
