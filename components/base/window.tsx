// Window — a draggable, resizable application window.
// Handles: drag-to-move, edge/corner resize, minimize/maximize/close animations,
// sidebar overlap detection, and rendering the correct app screen inside.
// Special cases: Settings and Trash get their own component instead of screen(),
// and Firefox/YTMusic show an OfflineScreen when wifi is off.
import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Settings from '../apps/settings';
import { Trash } from '../apps/trash';
import ReactGA from 'react-ga4';
import { displayTerminal } from '../apps/terminal';
import RaccoonGame from '../apps/racoon_game';

interface WindowProps {
    id: string;
    title: string;
    screen: () => React.ReactNode;
    addFolder?: ((name: string) => void) | null;
    closed: (id: string) => void;
    openApp: (id: string) => void;
    focus: (id: string) => void;
    isFocused: boolean;
    hideSideBar: (id: string | null, hide: boolean) => void;
    hasMinimised: (id: string) => void;
    minimized: boolean;
    changeBackgroundImage: (name: string) => void;
    bg_image_name: string;
    changeTrashIcon: (empty: boolean) => void;
    trash_empty: boolean;
    wifi: boolean;
}

interface WindowState {
    cursorType: string;
    width: number;
    height: number;
    closed: boolean;
    maximized: boolean;
    parentSize: { height: number; width: number };
}

export class Window extends Component<WindowProps, WindowState> {
    id: string | null;
    startX: number;
    startY: number;

    constructor(props: WindowProps) {
        super(props);
        this.id = null;
        this.startX = 60;
        this.startY = 10;
        this.state = {
            cursorType: "cursor-default",
            width: 60,
            height: 85,
            closed: false,
            maximized: false,
            parentSize: {
                height: 100,
                width: 100
            }
        }
    }

    componentDidMount() {
        this.id = this.props.id;
        this.setDefaultWindowDimenstion();

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${this.id}`, title: "Custom Title" });

        // on window resize, resize boundary
        window.addEventListener('resize', this.resizeBoundries);
    }

    componentWillUnmount() {
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        window.removeEventListener('resize', this.resizeBoundries);
    }

    setDefaultWindowDimenstion = () => {
        if (window.innerWidth < 640) {
            this.setState({ height: 60, width: 85 }, this.resizeBoundries);
        }
        else {
            this.setState({ height: 85, width: 60 }, this.resizeBoundries);
        }
    }

    resizeBoundries = () => {
        this.setState({
            parentSize: {
                height: window.innerHeight //parent height
                    - (window.innerHeight * (this.state.height / 100.0))  // this window's height
                    - 28 // some padding
                ,
                width: window.innerWidth // parent width
                    - (window.innerWidth * (this.state.width / 100.0)) //this window's width
            }
        });
    }

    changeCursorToMove = () => {
        this.focusWindow();
        if (this.state.maximized) {
            this.restoreWindow();
        }
        this.setState({ cursorType: "cursor-move" })
    }

    changeCursorToDefault = () => {
        this.setState({ cursorType: "cursor-default" })
    }

    handleVerticleResize = () => {
        this.setState({ height: this.state.height + 0.1 }, this.resizeBoundries);
    }

    handleHorizontalResize = () => {
        this.setState({ width: this.state.width + 0.1 }, this.resizeBoundries);
    }

    startResize = (e: React.MouseEvent, direction: string) => {
        if (this.state.maximized) return;
        e.preventDefault();
        e.stopPropagation();
        const startMouseX = e.clientX;
        const startMouseY = e.clientY;
        const startWidth = this.state.width;
        const startHeight = this.state.height;

        const el = document.querySelector('#' + this.id) as HTMLElement | null;
        let startTranslateX = this.startX, startTranslateY = this.startY;
        if (el && (direction.includes('w') || direction.includes('n'))) {
            const m = (el.style.transform || '').match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
            if (m) { startTranslateX = parseFloat(m[1]); startTranslateY = parseFloat(m[2]); }
        }

        const onMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startMouseX;
            const dy = e.clientY - startMouseY;
            const dxPct = dx / window.innerWidth * 100;
            const dyPct = dy / window.innerHeight * 100;
            let newState: Partial<WindowState> = {};
            let newTx = startTranslateX;
            let newTy = startTranslateY;

            if (direction.includes('e')) {
                newState.width = Math.max(20, Math.min(100, startWidth + dxPct));
            }
            if (direction.includes('w')) {
                const newWidth = Math.max(20, Math.min(100, startWidth - dxPct));
                newState.width = newWidth;
                newTx = startTranslateX + (startWidth - newWidth) / 100 * window.innerWidth;
            }
            if (direction.includes('s')) {
                newState.height = Math.max(20, Math.min(96.3, startHeight + dyPct));
            }
            if (direction.includes('n')) {
                const newHeight = Math.max(20, Math.min(96.3, startHeight - dyPct));
                newState.height = newHeight;
                newTy = startTranslateY + (startHeight - newHeight) / 100 * window.innerHeight;
            }

            if (el && (direction.includes('w') || direction.includes('n'))) {
                el.style.transform = `translate(${newTx}px, ${newTy}px)`;
            }

            this.setState(newState as WindowState, this.resizeBoundries);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    setWinowsPosition = () => {
        var r = document.querySelector("#" + this.id) as HTMLElement;
        var rect = r.getBoundingClientRect();
        r.style.setProperty('--window-transform-x', rect.x.toFixed(1).toString() + "px");
        r.style.setProperty('--window-transform-y', (parseFloat(rect.y.toFixed(1)) - 32).toString() + "px");
    }

    checkOverlap = () => {
        var r = document.querySelector("#" + this.id) as HTMLElement;
        var rect = r.getBoundingClientRect();
        if (parseFloat(rect.x.toFixed(1)) < 50) { // if this window overlapps with SideBar
            this.props.hideSideBar(this.id, true);
        }
        else {
            this.props.hideSideBar(this.id, false);
        }
    }

    focusWindow = () => {
        this.props.focus(this.id!);
    }

    minimizeWindow = () => {
        let posx = -310;
        if (this.state.maximized) {
            posx = -510;
        }
        this.setWinowsPosition();
        // get corrosponding sidebar app's position
        var r = document.querySelector("#sidebar-" + this.id) as HTMLElement;
        var sidebBarApp = r.getBoundingClientRect();

        r = document.querySelector("#" + this.id) as HTMLElement;
        // translate window to that position
        r.style.transform = `translate(${posx}px,${parseFloat(sidebBarApp.y.toFixed(1)) - 240}px) scale(0.2)`;
        this.props.hasMinimised(this.id!);
    }

    restoreWindow = () => {
        var r = document.querySelector("#" + this.id) as HTMLElement;
        this.setDefaultWindowDimenstion();
        let posx = r.style.getPropertyValue("--window-transform-x");
        let posy = r.style.getPropertyValue("--window-transform-y");
        r.style.transform = `translate(${posx},${posy})`;
        setTimeout(() => {
            this.setState({ maximized: false });
            this.checkOverlap();
        }, 300);
    }

    maximizeWindow = () => {
        if (this.state.maximized) {
            this.restoreWindow();
        }
        else {
            this.focusWindow();
            var r = document.querySelector("#" + this.id) as HTMLElement;
            this.setWinowsPosition();
            r.style.transform = `translate(-1pt,-2pt)`;
            this.setState({ maximized: true, height: 96.3, width: 100.2 });
            this.props.hideSideBar(this.id, true);
        }
    }

    closeWindow = () => {
        this.setWinowsPosition();
        this.setState({ closed: true }, () => {
            this.props.hideSideBar(this.id, false);
            setTimeout(() => {
                this.props.closed(this.id!)
            }, 300) // after 300ms this window will be unmounted from parent (Desktop)
        });
    }

    render() {
        return (
            <Draggable
                axis="both"
                handle=".bg-ub-window-title"
                grid={[1, 1]}
                scale={1}
                onStart={this.changeCursorToMove}
                onStop={this.changeCursorToDefault}
                onDrag={this.checkOverlap}
                allowAnyClick={false}
                defaultPosition={{ x: this.startX, y: this.startY }}
                bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
            >
                <div style={{ width: `${this.state.width}%`, height: `${this.state.height}%` }}
                    className={this.state.cursorType + " " + (this.state.closed ? " closed-window " : "") + (this.state.maximized ? " duration-300 rounded-none" : " rounded-lg rounded-b-none") + (this.props.minimized ? " opacity-0 invisible duration-200 " : "") + (this.props.isFocused ? " z-30 " : " z-20 notFocused") + " opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col"}
                    id={this.id!}
                >
                    <WindowYBorder resize={this.handleHorizontalResize} />
                    <WindowXBorder resize={this.handleVerticleResize} />
                    {/* Resize handles */}
                    {!this.state.maximized && (
                        <>
                            <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize z-50" onMouseDown={(e) => this.startResize(e, 'e')} />
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize z-50" onMouseDown={(e) => this.startResize(e, 's')} />
                            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => this.startResize(e, 'se')} />
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize z-50" onMouseDown={(e) => this.startResize(e, 'w')} />
                            <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => this.startResize(e, 'nw')} />
                            <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => this.startResize(e, 'sw')} />
                        </>
                    )}
                    <WindowTopBar title={this.props.title} />
                    <WindowEditButtons minimize={this.minimizeWindow} maximize={this.maximizeWindow} isMaximised={this.state.maximized} close={this.closeWindow} id={this.id!} />
                    {this.id === "settings"
                        ? <Settings changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.bg_image_name} />
                        : this.id === "trash"
                        ? <Trash changeTrashIcon={this.props.changeTrashIcon} trash_empty={this.props.trash_empty} />
                        : (this.id === "firefox" || this.id === "ytmusic") && this.props.wifi === false
                        ? <OfflineScreen />
                        : <WindowMainScreen screen={this.props.screen} title={this.props.title}
                            addFolder={this.props.id === "terminal" ? this.props.addFolder ?? null : null}
                            openApp={this.props.openApp} />}
                </div>
            </Draggable>
        )
    }
}

export default Window

// Window's title bar
interface WindowTopBarProps {
    title: string;
}

export function WindowTopBar(props: WindowTopBarProps) {
    return (
        <div className={" relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none"}>
            <div className="flex justify-center text-sm font-bold">{props.title}</div>
        </div>
    )
}

// Window's Borders
interface WindowBorderProps {
    resize: (e: React.DragEvent) => void;
}

export class WindowYBorder extends Component<WindowBorderProps> {
    trpImg!: HTMLImageElement;

    componentDidMount() {
        this.trpImg = new Image(0, 0);
        this.trpImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        this.trpImg.style.opacity = '0';
    }
    render() {
        return (
            <div className=" window-y-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onDragStart={(e) => { e.dataTransfer.setDragImage(this.trpImg, 0, 0) }} onDrag={this.props.resize}>
            </div>
        )
    }
}

export class WindowXBorder extends Component<WindowBorderProps> {
    trpImg!: HTMLImageElement;

    componentDidMount() {
        this.trpImg = new Image(0, 0);
        this.trpImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        this.trpImg.style.opacity = '0';
    }
    render() {
        return (
            <div className=" window-x-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onDragStart={(e) => { e.dataTransfer.setDragImage(this.trpImg, 0, 0) }} onDrag={this.props.resize}>
            </div>
        )
    }
}

// Window's Edit Buttons
interface WindowEditButtonsProps {
    minimize: () => void;
    maximize: () => void;
    isMaximised: boolean;
    close: () => void;
    id: string;
}

export function WindowEditButtons(props: WindowEditButtonsProps) {
    return (
        <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
            <span className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.minimize}>
                <img
                    src="./themes/Yaru/window/window-minimize-symbolic.svg"
                    alt="ubuntu window minimize"
                    className="h-5 w-5 inline"
                />
            </span>
            {
                (props.isMaximised
                    ?
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/Yaru/window/window-restore-symbolic.svg"
                            alt="ubuntu window restore"
                            className="h-5 w-5 inline"
                        />
                    </span>
                    :
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/Yaru/window/window-maximize-symbolic.svg"
                            alt="ubuntu window maximize"
                            className="h-5 w-5 inline"
                        />
                    </span>
                )
            }
            <button tabIndex={-1} id={`close-${props.id}`} className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.close}>
                <img
                    src="./themes/Yaru/window/window-close-symbolic.svg"
                    alt="ubuntu window close"
                    className="h-5 w-5 inline"
                />
            </button>
        </div>
    )
}

// Window's Main Screen
interface WindowMainScreenProps {
    screen: () => React.ReactNode;
    title: string;
    addFolder: ((name: string) => void) | null;
    openApp: (id: string) => void;
}

interface WindowMainScreenState {
    setDarkBg: boolean;
}

export class WindowMainScreen extends Component<WindowMainScreenProps, WindowMainScreenState> {
    constructor(props: WindowMainScreenProps) {
        super(props);
        this.state = {
            setDarkBg: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ setDarkBg: true });
        }, 3000);
    }
    render() {
        return (
            <div className={"relative w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" + (this.state.setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey")}>
                {this.props.addFolder ? displayTerminal(this.props.addFolder, this.props.openApp) : (this.props.screen() || null)}
            </div>
        )
    }
}

function OfflineScreen() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-ub-cool-grey text-white select-none overflow-auto">
            <div className="flex flex-col w-full px-2">
                <RaccoonGame />
                <div className="mt-4 px-3 sm:px-1">
                    <div className="flex items-center gap-2 text-white text-lg sm:text-2xl font-bold">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" fill="currentColor">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" opacity="0.3" />
                            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Unable to connect
                    </div>
                    <p className="mt-2 sm:mt-3 text-gray-400 text-sm sm:text-base pl-7 sm:pl-10">Firefox can't establish a connection to the server.</p>
                    <ul className="mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm list-disc list-inside pl-7 sm:pl-10">
                        <li>Please try turning the Wi-Fi back on again.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
