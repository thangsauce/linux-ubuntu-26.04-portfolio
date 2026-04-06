import { displayYoutubeMusic } from "./components/apps/youtube";
import displayVsCode from "./components/apps/vscode";
import { displayTerminal } from "./components/apps/terminal";
import { displaySettings } from "./components/apps/settings";
import { displayFirefox } from "./components/apps/firefox";
import { displayTrash } from "./components/apps/trash";
import { displayAboutThang } from "./components/apps/thang";
import { displayTerminalCalc } from "./components/apps/calc";
import { displayContact } from "./components/apps/contact";
import { ReactNode } from "react";

export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  desktop_icon?: string;
  disabled: boolean;
  favourite: boolean;
  desktop_shortcut: boolean;
  isExternalApp?: boolean;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  screen: (...args: any[]) => ReactNode;
}

const apps: AppConfig[] = [
  {
    id: "firefox",
    title: "Firefox",
    icon: "./themes/Yaru/apps/firefox.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: true,
    screen: displayFirefox,
  },
  {
    id: "calc",
    title: "Calc",
    icon: "./themes/Yaru/apps/calc.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: displayTerminalCalc,
  },
  {
    id: "about-thang",
    title: "About Thang",
    icon: "./themes/Yaru/system/folder-thang.svg",
    desktop_icon: "./themes/Yaru/system/user-home.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: true,
    screen: displayAboutThang,
  },
  {
    id: "vscode",
    title: "Visual Studio Code",
    icon: "./themes/Yaru/apps/vscode.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: displayVsCode,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "./themes/Yaru/apps/bash.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: displayTerminal,
  },
  {
    id: "ytmusic",
    title: "YouTube Music",
    icon: "./themes/Yaru/apps/ytmusic.png",
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: displayYoutubeMusic,
  },
  {
    id: "settings",
    title: "Settings",
    icon: "./themes/Yaru/apps/gnome-control-center.svg",
    disabled: false,
    favourite: true,
    desktop_shortcut: false,
    screen: displaySettings,
  },
  {
    id: "trash",
    title: "Trash",
    icon: "./themes/Yaru/system/user-trash-full.png",
    disabled: false,
    favourite: false,
    desktop_shortcut: true,
    screen: displayTrash,
  },
  {
    id: "github",
    title: "GitHub",
    icon: "./themes/Yaru/apps/github.png",
    disabled: false,
    favourite: false,
    desktop_shortcut: true,
    isExternalApp: true,
    url: "https://github.com/thangsauce",
    screen: () => null,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    icon: "./themes/Yaru/apps/linkedin.png",
    disabled: false,
    favourite: false,
    desktop_shortcut: true,
    isExternalApp: true,
    url: "https://www.linkedin.com/in/thangle",
    screen: () => null,
  },
  {
    id: "contact",
    title: "Contact Me",
    icon: "./themes/Yaru/apps/gedit.png",
    disabled: false,
    favourite: false,
    desktop_shortcut: true,
    screen: displayContact,
  },
];

export default apps;
