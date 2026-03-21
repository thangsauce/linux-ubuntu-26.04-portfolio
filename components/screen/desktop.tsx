// Desktop — manages all open windows and their state.
// Key responsibilities:
//   - Window lifecycle: open, close, minimize, focus, z-order (app_stack)
//   - Desktop app icons and context menus
//   - Sidebar visibility (hides when a window overlaps it)
//   - "All Applications" overlay (showAllApps)
// State is initialized from apps.config on mount, and persists app-open
// frequency to localStorage for the "frequent apps" feature.
import React, { Component } from 'react';
import BackgroundImage from '../utils/background-image';
import SideBar from './side_bar';
import apps from '../../apps.config';
import { AppConfig } from '../../apps.config';
import Window from '../base/window';
import UbuntuApp from '../base/ubuntu_app';
import AllApplications from '../screen/all-applications';
import DesktopMenu from '../context-menus/desktop-menu';
import DefaultMenu from '../context-menus/default';
import NotificationContainer from '../utils/notification';
import $ from 'jquery';
import ReactGA from 'react-ga4';

interface DesktopState {
    focused_windows: Record<string, boolean>;
    closed_windows: Record<string, boolean>;
    allAppsView: boolean;
    deleted_apps: string[];
    trash_empty: boolean;
    overlapped_windows: Record<string, boolean>;
    disabled_apps: Record<string, boolean>;
    favourite_apps: Record<string, boolean>;
    hideSideBar: boolean;
    minimized_windows: Record<string, boolean>;
    desktop_apps: string[];
    context_menus: { desktop: boolean; default: boolean; app: boolean };
    app_menu_pos: { x: number; y: number };
    app_menu_id: string | null;
    showNameBar: boolean;
}

interface DesktopProps {
    bg_image_name: string;
    changeBackgroundImage: (name: string) => void;
    wifi: boolean;
}

export class Desktop extends Component<DesktopProps, DesktopState> {
    app_stack: string[];
    initFavourite: Record<string, boolean>;
    allWindowClosed: boolean;

    constructor(props: DesktopProps) {
        super(props);
        this.app_stack = [];
        this.initFavourite = {};
        this.allWindowClosed = false;
        this.state = {
            focused_windows: {},
            closed_windows: {},
            allAppsView: false,
            deleted_apps: [],
            trash_empty: false,
            overlapped_windows: {},
            disabled_apps: {},
            favourite_apps: {},
            hideSideBar: false,
            minimized_windows: {},
            desktop_apps: [],
            context_menus: {
                desktop: false,
                default: false,
                app: false,
            },
            app_menu_pos: { x: 0, y: 0 },
            app_menu_id: null,
            showNameBar: false,
        }
    }

    componentDidMount() {
        // google analytics
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        this.fetchAppsData();
        this.setContextListeners();
        this.setEventListeners();
        this.checkForNewFolders();
        this.setState({ trash_empty: localStorage.getItem("trash-empty") === "true" });
    }

    componentWillUnmount() {
        this.removeContextListeners();
    }

    checkForNewFolders = () => {
        var new_folders = localStorage.getItem('new_folders');
        if (new_folders === null && new_folders !== undefined) {
            localStorage.setItem("new_folders", JSON.stringify([]));
        }
        else {
            const parsed: Array<{ id: string; name: string }> = JSON.parse(new_folders as string);
            parsed.forEach(folder => {
                apps.push({
                    id: `new-folder-${folder.id}`,
                    title: folder.name,
                    icon: './themes/Yaru/system/folder.png',
                    disabled: true,
                    favourite: false,
                    desktop_shortcut: true,
                    screen: () => null,
                } as AppConfig);
            });
            this.updateAppsData();
        }
    }

    setEventListeners = () => {
        document.getElementById("open-settings")?.addEventListener("click", () => {
            this.openApp("settings");
        });
    }

    setContextListeners = () => {
        document.addEventListener('contextmenu', this.checkContextMenu);
        // on click, anywhere, hide all menus
        document.addEventListener('click', this.hideAllContextMenu);
    }

    removeContextListeners = () => {
        document.removeEventListener("contextmenu", this.checkContextMenu);
        document.removeEventListener("click", this.hideAllContextMenu);
    }

    checkContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        this.hideAllContextMenu();
        const target = e.target as HTMLElement;
        const appEl = target.closest("[data-context='desktop-app']") as HTMLElement | null;
        const context = appEl ? "desktop-app" : (target as HTMLElement & { dataset: DOMStringMap }).dataset.context;
        switch (context) {
            case "desktop-area":
                ReactGA.event({ category: `Context Menu`, action: `Opened Desktop Context Menu` });
                this.showContextMenu(e, "desktop");
                break;
            case "desktop-app": {
                const appId = appEl?.dataset.appId;
                this.setState({ app_menu_id: appId || null });
                this.showContextMenu(e, "default");
                break;
            }
            default:
                this.setState({ app_menu_id: null });
                ReactGA.event({ category: `Context Menu`, action: `Opened Default Context Menu` });
                this.showContextMenu(e, "default");
        }
    }

    showContextMenu = (e: MouseEvent, menuName: string) => {
        let { posx, posy } = this.getMenuPosition(e);
        let contextMenu = document.getElementById(`${menuName}-menu`) as HTMLElement;

        if (posx + $(contextMenu).width()! > window.innerWidth) posx -= $(contextMenu).width()!;
        if (posy + $(contextMenu).height()! > window.innerHeight) posy -= $(contextMenu).height()!;

        const posx_str = posx.toString() + "px";
        const posy_str = posy.toString() + "px";

        contextMenu.style.left = posx_str;
        contextMenu.style.top = posy_str;

        this.setState({ context_menus: { ...this.state.context_menus, [menuName]: true } });
    }

    hideAllContextMenu = () => {
        this.setState({ context_menus: { desktop: false, default: false, app: false } });
    }

    getMenuPosition = (e: MouseEvent): { posx: number; posy: number } => {
        var posx = 0;
        var posy = 0;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        return {
            posx, posy
        }
    }

    fetchAppsData = () => {
        let focused_windows: Record<string, boolean> = {},
            closed_windows: Record<string, boolean> = {},
            disabled_apps: Record<string, boolean> = {},
            favourite_apps: Record<string, boolean> = {},
            overlapped_windows: Record<string, boolean> = {},
            minimized_windows: Record<string, boolean> = {};
        let desktop_apps: string[] = [];
        apps.forEach((app) => {
            focused_windows = {
                ...focused_windows,
                [app.id]: false,
            };
            closed_windows = {
                ...closed_windows,
                [app.id]: true,
            };
            disabled_apps = {
                ...disabled_apps,
                [app.id]: app.disabled ?? false,
            };
            favourite_apps = {
                ...favourite_apps,
                [app.id]: app.favourite ?? false,
            };
            overlapped_windows = {
                ...overlapped_windows,
                [app.id]: false,
            };
            minimized_windows = {
                ...minimized_windows,
                [app.id]: false,
            }
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        this.setState({
            focused_windows,
            closed_windows,
            disabled_apps,
            favourite_apps,
            overlapped_windows,
            minimized_windows,
            desktop_apps
        });
        this.initFavourite = { ...favourite_apps };
    }

    updateAppsData = () => {
        let focused_windows: Record<string, boolean> = {},
            closed_windows: Record<string, boolean> = {},
            favourite_apps: Record<string, boolean> = {},
            minimized_windows: Record<string, boolean> = {},
            disabled_apps: Record<string, boolean> = {};
        let desktop_apps: string[] = [];
        apps.forEach((app) => {
            focused_windows = {
                ...focused_windows,
                [app.id]: ((this.state.focused_windows[app.id] !== undefined || this.state.focused_windows[app.id] !== null) ? this.state.focused_windows[app.id] : false),
            };
            minimized_windows = {
                ...minimized_windows,
                [app.id]: ((this.state.minimized_windows[app.id] !== undefined || this.state.minimized_windows[app.id] !== null) ? this.state.minimized_windows[app.id] : false)
            };
            disabled_apps = {
                ...disabled_apps,
                [app.id]: app.disabled ?? false,
            };
            closed_windows = {
                ...closed_windows,
                [app.id]: ((this.state.closed_windows[app.id] !== undefined || this.state.closed_windows[app.id] !== null) ? this.state.closed_windows[app.id] : true)
            };
            favourite_apps = {
                ...favourite_apps,
                [app.id]: app.favourite ?? false,
            }
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        this.setState({
            focused_windows,
            closed_windows,
            disabled_apps,
            minimized_windows,
            favourite_apps,
            desktop_apps
        });
        this.initFavourite = { ...favourite_apps };
    }

    renderDesktopApps = () => {
        if (Object.keys(this.state.closed_windows).length === 0) return;
        let appsJsx: React.ReactElement[] = [];
        apps.forEach((app, index) => {
            if (this.state.desktop_apps.includes(app.id)) {

                const props = {
                    name: app.title,
                    id: app.id,
                    icon: app.desktop_icon || app.icon,
                    openApp: this.openApp,
                    isExternalApp: app.isExternalApp,
                    url: app.url,
                    wifi: this.props.wifi,
                }

                appsJsx.push(
                    <UbuntuApp key={index} {...props} />
                );
            }
        });
        return appsJsx;
    }

    renderWindows = () => {
        let windowsJsx: React.ReactElement[] = [];
        apps.forEach((app, index) => {
            if (this.state.closed_windows[app.id] === false) {

                const props = {
                    title: app.title,
                    id: app.id,
                    screen: app.screen,
                    addFolder: this.addToDesktop,
                    closed: this.closeApp,
                    openApp: this.openApp,
                    focus: this.focus,
                    isFocused: this.state.focused_windows[app.id],
                    hideSideBar: this.hideSideBar,
                    hasMinimised: this.hasMinimised,
                    minimized: this.state.minimized_windows[app.id],
                    changeBackgroundImage: this.props.changeBackgroundImage,
                    bg_image_name: this.props.bg_image_name,
                    changeTrashIcon: this.changeTrashIcon,
                    trash_empty: this.state.trash_empty,
                    wifi: this.props.wifi,
                }

                windowsJsx.push(
                    <Window key={index} {...props} />
                )
            }
        });
        return windowsJsx;
    }

    hideSideBar = (objId: string | null, hide: boolean) => {
        if (hide === this.state.hideSideBar) return;

        if (objId === null) {
            if (hide === false) {
                this.setState({ hideSideBar: false });
            }
            else {
                for (const key in this.state.overlapped_windows) {
                    if (this.state.overlapped_windows[key]) {
                        this.setState({ hideSideBar: true });
                        return;
                    }  // if any window is overlapped then hide the SideBar
                }
            }
            return;
        }

        if (hide === false) {
            for (const key in this.state.overlapped_windows) {
                if (this.state.overlapped_windows[key] && key !== objId) return; // if any window is overlapped then don't show the SideBar
            }
        }

        let overlapped_windows = this.state.overlapped_windows;
        overlapped_windows[objId] = hide;
        this.setState({ hideSideBar: hide, overlapped_windows });
    }

    hasMinimised = (objId: string) => {
        let minimized_windows = this.state.minimized_windows;
        var focused_windows = this.state.focused_windows;

        // remove focus and minimise this window
        minimized_windows[objId] = true;
        focused_windows[objId] = false;
        this.setState({ minimized_windows, focused_windows });

        this.hideSideBar(null, false);

        this.giveFocusToLastApp();
    }

    giveFocusToLastApp = () => {
        // if there is atleast one app opened, give it focus
        if (!this.checkAllMinimised()) {
            for (const index in this.app_stack) {
                if (!this.state.minimized_windows[this.app_stack[index]]) {
                    this.focus(this.app_stack[index]);
                    break;
                }
            }
        }
    }

    checkAllMinimised = (): boolean => {
        let result = true;
        for (const key in this.state.minimized_windows) {
            if (!this.state.closed_windows[key]) { // if app is opened
                result = result && this.state.minimized_windows[key];
            }
        }
        return result;
    }

    openApp = (objId: string) => {

        // google analytics
        ReactGA.event({
            category: `Open App`,
            action: `Opened ${objId} window`
        });

        // if the app is disabled
        if (this.state.disabled_apps[objId]) return;

        const wasShowingApps = this.state.allAppsView;

        if (this.state.minimized_windows[objId]) {
            // focus this app's window
            this.focus(objId);

            // set window's last position
            var r = document.querySelector("#" + objId) as HTMLElement | null;
            if (r) {
                const tx = r.style.getPropertyValue("--window-transform-x") || '0px';
                const ty = r.style.getPropertyValue("--window-transform-y") || '0px';
                r.style.transform = `translate(${tx},${ty}) scale(1)`;
            }

            let minimized_windows = this.state.minimized_windows;
            minimized_windows[objId] = false;
            this.setState({ minimized_windows, allAppsView: false });
            return;
        }

        //if app is already opened
        if (this.app_stack.includes(objId)) {
            if (wasShowingApps) {
                this.setState({ allAppsView: false });
                this.focus(objId);
            } else if (this.state.focused_windows[objId]) {
                // already focused — minimize it
                var win = document.querySelector("#" + objId) as HTMLElement | null;
                if (win) {
                    var rect = win.getBoundingClientRect();
                    win.style.setProperty('--window-transform-x', rect.x.toFixed(1) + "px");
                    win.style.setProperty('--window-transform-y', (parseFloat(rect.y.toFixed(1)) - 32) + "px");
                    var sidebarApp = document.querySelector("#sidebar-" + objId);
                    var posy = sidebarApp ? parseFloat(sidebarApp.getBoundingClientRect().y.toFixed(1)) - 240 : 0;
                    win.style.transform = `translate(-310px,${posy}px) scale(0.2)`;
                    this.hasMinimised(objId);
                }
            } else {
                this.focus(objId);
            }
            return;
        }
        else {
            let closed_windows = this.state.closed_windows;
            let favourite_apps = this.state.favourite_apps;
            var frequentApps: Array<{ id: string; frequency: number }> = localStorage.getItem('frequentApps') ? JSON.parse(localStorage.getItem('frequentApps')!) : [];
            var currentApp = frequentApps.find(app => app.id === objId);
            if (currentApp) {
                frequentApps.forEach((app) => {
                    if (app.id === currentApp!.id) {
                        app.frequency += 1; // increase the frequency if app is found
                    }
                });
            } else {
                frequentApps.push({ id: objId, frequency: 1 }); // new app opened
            }

            frequentApps.sort((a, b) => {
                if (a.frequency < b.frequency) {
                    return 1;
                }
                if (a.frequency > b.frequency) {
                    return -1;
                }
                return 0; // sort according to decreasing frequencies
            });

            localStorage.setItem("frequentApps", JSON.stringify(frequentApps));

            this.app_stack.push(objId);

            if (wasShowingApps) {
                this.setState(prevState => ({
                    allAppsView: false,
                    closed_windows: { ...prevState.closed_windows, [objId]: false },
                    favourite_apps: { ...prevState.favourite_apps, [objId]: true },
                }), () => this.focus(objId));
            } else {
                setTimeout(() => {
                    this.setState(prevState => ({
                        closed_windows: { ...prevState.closed_windows, [objId]: false },
                        favourite_apps: { ...prevState.favourite_apps, [objId]: true },
                    }), () => this.focus(objId));
                }, 200);
            }
        }
    }

    closeApp = (objId: string) => {

        // remove app from the app stack
        this.app_stack.splice(this.app_stack.indexOf(objId), 1);

        this.giveFocusToLastApp();

        this.hideSideBar(null, false);

        // close window
        let closed_windows = this.state.closed_windows;
        let favourite_apps = this.state.favourite_apps;

        if (this.initFavourite[objId] === false) favourite_apps[objId] = false; // if user default app is not favourite, remove from sidebar
        closed_windows[objId] = true; // closes the app's window

        this.setState({ closed_windows, favourite_apps });
    }

    focus = (objId: string) => {
        // removes focus from all window and
        // gives focus to window with 'id = objId'
        var focused_windows = this.state.focused_windows;
        focused_windows[objId] = true;
        for (let key in focused_windows) {
            if (focused_windows.hasOwnProperty(key)) {
                if (key !== objId) {
                    focused_windows[key] = false;
                }
            }
        }
        this.setState({ focused_windows });
    }

    addNewFolder = () => {
        this.setState({ showNameBar: true });
    }

    addToDesktop = (folder_name: string) => {
        folder_name = folder_name.trim();
        let folder_id = folder_name.replace(/\s+/g, '-').toLowerCase();
        apps.push({
            id: `new-folder-${folder_id}`,
            title: folder_name,
            icon: './themes/Yaru/system/folder.png',
            disabled: true,
            favourite: false,
            desktop_shortcut: true,
            screen: () => null,
        } as AppConfig);
        // store in local storage
        var new_folders: Array<{ id: string; name: string }> = JSON.parse(localStorage.getItem('new_folders')!);
        new_folders.push({ id: `new-folder-${folder_id}`, name: folder_name });
        localStorage.setItem("new_folders", JSON.stringify(new_folders));

        this.setState({ showNameBar: false }, this.updateAppsData);
    }

    deleteDesktopApp = (appId: string) => {
        let desktop_apps = this.state.desktop_apps.filter(id => id !== appId);
        let deleted_apps = [...this.state.deleted_apps, appId];
        this.setState({ desktop_apps, deleted_apps, context_menus: { desktop: false, default: false, app: false }, app_menu_id: null });
    }

    changeTrashIcon = (empty: boolean) => {
        this.setState({ trash_empty: empty });
    };

    showAllApps = () => {
        const opening = !this.state.allAppsView;
        if (opening) {
            // instantly minimize all open windows
            const minimized_windows = { ...this.state.minimized_windows };
            const focused_windows = { ...this.state.focused_windows };
            Object.keys(this.state.closed_windows).forEach(id => {
                if (!this.state.closed_windows[id]) {
                    minimized_windows[id] = true;
                    focused_windows[id] = false;
                }
            });
            this.setState({ allAppsView: true, minimized_windows, focused_windows, hideSideBar: false });
        } else {
            this.setState({ allAppsView: false });
        }
    }

    renderNameBar = () => {
        let addFolder = () => {
            let folder_name = (document.getElementById("folder-name-input") as HTMLInputElement).value;
            this.addToDesktop(folder_name);
        }

        let removeCard = () => {
            this.setState({ showNameBar: false });
        }

        return (
            <div className="absolute rounded-md top-1/2 left-1/2 text-center text-white font-light text-sm bg-ub-cool-grey transform -translate-y-1/2 -translate-x-1/2 sm:w-96 w-3/4 z-50">
                <div className="w-full flex flex-col justify-around items-start pl-6 pb-8 pt-6">
                    <span>New folder name</span>
                    <input className="outline-none mt-5 px-1 w-10/12  context-menu-bg border-2 border-yellow-700 rounded py-0.5" id="folder-name-input" type="text" autoComplete="off" spellCheck={false} autoFocus={true} />
                </div>
                <div className="flex">
                    <div onClick={addFolder} className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 border-r-0 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50">Create</div>
                    <div onClick={removeCard} className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50">Cancel</div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={" h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none window-parent"}>

                {/* Window Area */}
                <div className="absolute h-full w-full bg-transparent" data-context="desktop-area">
                    {this.renderWindows()}
                </div>

                {/* Background Image */}
                <BackgroundImage img={this.props.bg_image_name} />

                {/* Ubuntu Side Menu Bar */}
                <SideBar apps={apps.map(app => app.id === 'trash' ? { ...app, icon: this.state.trash_empty ? './themes/Yaru/system/user-trash.png' : './themes/Yaru/system/user-trash-full.png' } : app)}
                    hide={this.state.hideSideBar}
                    hideSideBar={this.hideSideBar}
                    favourite_apps={this.state.favourite_apps}
                    showAllApps={this.showAllApps}
                    allAppsView={this.state.allAppsView}
                    closed_windows={this.state.closed_windows}
                    focused_windows={this.state.focused_windows}
                    isMinimized={this.state.minimized_windows}
                    openAppByAppId={this.openApp} />

                {/* Desktop Apps */}
                {this.renderDesktopApps()}

                {/* Context Menus */}
                <DesktopMenu active={this.state.context_menus.desktop} openApp={this.openApp} addNewFolder={this.addNewFolder} />
                <DefaultMenu active={this.state.context_menus.default} appId={this.state.app_menu_id} deleteApp={this.deleteDesktopApp} />

                {/* Folder Input Name Bar */}
                {
                    (this.state.showNameBar
                        ? this.renderNameBar()
                        : null
                    )
                }

                { this.state.allAppsView ?
                    <AllApplications apps={apps.filter(app => !this.state.deleted_apps.includes(app.id))}
                        recentApps={this.app_stack}
                        openApp={this.openApp}
                        bg_image_name={this.props.bg_image_name} /> : null}

                {/* GNOME-style notification toasts */}
                <NotificationContainer />

            </div>
        )
    }
}

export default Desktop
