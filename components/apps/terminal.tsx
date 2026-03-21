// Simulated bash terminal. Supports: cd, ls, pwd, echo, clear, exit, mkdir,
// sudo (easter egg), and app-open commands (code, firefox, ytmusic, etc.).
// Uses jQuery to manipulate the DOM directly for the cursor blink effect
// and to sync the hidden <input> text to the visible <span>.
import React, { Component } from 'react'
import $ from 'jquery';
import ReactGA from 'react-ga4';

interface Props {
    addFolder?: (name: string) => void;
    openApp?: (id: string) => void;
}

interface State {
    terminal: React.ReactNode[];
}

export class Terminal extends Component<Props, State> {
    cursor: ReturnType<typeof setInterval> | number | string;
    terminal_rows: number;
    current_directory: string;
    curr_dir_name: string;
    prev_commands: string[];
    commands_index: number;
    child_directories: Record<string, string[]>;

    constructor(props: Props) {
        super(props);
        this.cursor = "";
        this.terminal_rows = 1;
        this.current_directory = "~";
        this.curr_dir_name = "root";
        this.prev_commands = [];
        this.commands_index = -1;
        this.child_directories = {
            root: ["projects", "skills", "languages", "interests", "personal-documents"],
            skills: ["JavaScript", "TypeScript", "Python", "Java", "Node.js", "React", "Next.js", "Tailwind-CSS", "Bootstrap", "MySQL", "PostgreSQL", "MongoDB", "Git", "VS-Code", "Linux"],
            projects: ["portfolio", "ArenaOps", "aromamor-candles", "HTML-Resume", "Candle-Website", "Pokemon-Finder", "Vigil-HTML-Sample", "DOM-Manipulation", "Pizza-Form"],
            interests: ["Web-Development", "Cybersecurity", "Cloud-Infrastructure", "Backend-Systems"],
            languages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
        };
        this.state = {
            terminal: [],
        }
    }

    componentDidMount() {
        this.reStartTerminal();
    }

    componentDidUpdate() {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
        this.startCursor(this.terminal_rows - 2);
    }

    componentWillUnmount() {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
    }

    reStartTerminal = (): void => {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
        $('#terminal-body').empty();
        this.appendTerminalRow();
    }

    appendTerminalRow = (): void => {
        let terminal = this.state.terminal;
        terminal.push(this.terminalRow(this.terminal_rows));
        this.setState({ terminal });
        this.terminal_rows += 2;
    }

    terminalRow = (id: number): React.ReactNode => {
        return (
            <React.Fragment key={id}>
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">thang@Desktop</div>
                        <div className="text-white mx-px font-medium">:</div>
                        <div className=" text-ubt-blue">{this.current_directory}</div>
                        <div className="text-white mx-px font-medium mr-1">$</div>
                    </div>
                    <div id="cmd" onClick={this.focusCursor} className=" bg-transperent relative flex-1 overflow-hidden">
                        <span id={`show-${id}`} className=" float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
                        <div id={`cursor-${id}`} className=" float-left mt-1 w-1.5 h-3.5 bg-white"></div>
                        <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className=" absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
                    </div>
                </div>
                <div id={`row-result-${id}`} className={"my-2 font-normal"}></div>
            </React.Fragment>
        );

    }

    focusCursor = (e: React.MouseEvent): void => {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
        this.startCursor($(e.target).data("row-id"));
    }

    unFocusCursor = (e: React.FocusEvent): void => {
        this.stopCursor($(e.target).data("row-id"));
    }

    startCursor = (id: number): void => {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
        $(`input#terminal-input-${id}`).trigger("focus");
        // On input change, set current text in span
        $(`input#terminal-input-${id}`).on("input", function () {
            $(`#cmd span#show-${id}`).text($(this).val() as string);
        });
        this.cursor = window.setInterval(function () {
            if ($(`#cursor-${id}`).css('visibility') === 'visible') {
                $(`#cursor-${id}`).css({ visibility: 'hidden' });
            } else {
                $(`#cursor-${id}`).css({ visibility: 'visible' });
            }
        }, 500);
    }

    stopCursor = (id: number): void => {
        clearInterval(this.cursor as ReturnType<typeof setInterval>);
        $(`#cursor-${id}`).css({ visibility: 'visible' });
    }

    removeCursor = (id: number): void => {
        this.stopCursor(id);
        $(`#cursor-${id}`).css({ display: 'none' });
    }

    clearInput = (id: number): void => {
        $(`input#terminal-input-${id}`).trigger("blur");
    }

    checkKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            let terminal_row_id = $(e.target).data("row-id");
            let command = ($(`input#terminal-input-${terminal_row_id}`).val() as string).trim();
            if (command.length !== 0) {
                this.removeCursor(terminal_row_id);
                this.handleCommands(command, terminal_row_id);
            }
            else return;
            // push to history
            this.prev_commands.push(command);
            this.commands_index = this.prev_commands.length - 1;

            this.clearInput(terminal_row_id);
        }
        else if (e.key === "ArrowUp") {
            let prev_command: string;

            if (this.commands_index <= -1) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index--;
        }
        else if (e.key === "ArrowDown") {
            let prev_command: string;

            if (this.commands_index >= this.prev_commands.length) return;
            if (this.commands_index <= -1) this.commands_index = 0;

            if (this.commands_index === this.prev_commands.length) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index++;
        }
    }

    childDirectories = (parent: string): string[] => {
        let files: string[] = [];
        files.push(`<div class="flex justify-start flex-wrap">`)
        this.child_directories[parent].forEach(file => {
            files.push(
                `<span class="font-bold mr-2 text-ubt-blue">'${file}'</span>`
            )
        });
        files.push(`</div>`)
        return files;
    }

    closeTerminal = (): void => {
        $("#close-terminal").trigger('click');
    }

    handleCommands = (command: string, rowId: number): void => {
        let words = command.split(' ').filter(Boolean);
        let main = words[0];
        words.shift()
        let result = "";
        let rest = words.join(" ");
        rest = rest.trim();
        switch (main) {
            case "cd":
                if (words.length === 0 || rest === "") {
                    this.current_directory = "~";
                    this.curr_dir_name = "root"
                    break;
                }
                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }

                if (rest === "personal-documents") {
                    window.open("https://vault.fbi.gov/jeffrey-epstein", "_blank");
                    result = `Opening personal-documents... 👀`;
                    break;
                }

                if (this.child_directories[this.curr_dir_name].includes(rest)) {
                    this.current_directory += "/" + rest;
                    this.curr_dir_name = rest;
                }
                else if (rest === "." || rest === ".." || rest === "../") {
                    result = "Type 'cd' to go back 😅";
                    break;
                }
                else {
                    result = `bash: cd: ${words}: No such file or directory`;
                }
                break;
            case "ls":
                let target = words[0];
                if (target === "" || target === undefined || target === null) target = this.curr_dir_name;

                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }
                if (target in this.child_directories) {
                    result = this.childDirectories(target).join("");
                }
                else if (target === "personal-documents") {
                    result = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;"><img src="./images/memes/woody.gif" alt="nope" style="max-width:200px;border-radius:8px;" /><img src="./images/memes/roll-safe.jpg" alt="roll safe" style="max-width:200px;border-radius:8px;" /></div>`;
                    break;
                }
                else {
                    result = `ls: cannot access '${words}': No such file or directory                    `;
                }
                break;
            case "mkdir":
                if (words[0] !== undefined && words[0] !== "") {
                    this.props.addFolder && this.props.addFolder(words[0]);
                    result = "";
                } else {
                    result = "mkdir: missing operand";
                }
                break;
            case "pwd":
                let str = this.current_directory;
                result = str.replace("~", "/home/thang")
                break;
            case "code":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("vscode");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands:[ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings]";
                }
                break;
            case "echo":
                result = this.xss(words.join(" ")) ?? "";
                break;
            case "ytmusic":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("ytmusic");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "firefox":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("firefox");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "trash":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("trash");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "about-thang":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("about-thang");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "terminal":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("terminal");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "settings":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp && this.props.openApp("settings");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, code, ytmusic, firefox, about-thang, trash, settings ]";
                }
                break;
            case "clear":
                this.reStartTerminal();
                return;
            case "exit":
                this.closeTerminal();
                return;
            case "sudo":

                ReactGA.event({
                    category: "Sudo Access",
                    action: "lol",
                });

                result = "<img class=' w-2/5' src='./images/memes/sudo.gif' style='border-radius:8px;' />";
                break;
            case "neofetch": {
                const asciiArt = [
                    `           .-/+oossssoo+/-.         `,
                    `        \`:+ssssssssssssssssss+\`     `,
                    `      -+ssssssssssssssssssyyssss+-   `,
                    `    .osssssssssssssssssssdMMMNysssso. `,
                    `   /ssssssssssshdmmNNmmyNMMMMhssssss/ `,
                    `  +sssssssshNMMMyhhyyyyhmNMMMNhssssss+`,
                    `  osssssssdMMMNhsssssssssshNMMMdssssss`,
                    `  osssssssdMMMNhsssssssssshNMMMdssssss`,
                    `  +sssssssshNMMMyhhyyyyhmNMMMNhssssss+`,
                    `   /ssssssssssshdmNNNNmyNMMMMhssssss/ `,
                    `    .osssssssssssssssssssdMMMNysssso. `,
                    `      -+sssssssssssssssssyyyssss+-   `,
                    `        \`:+ssssssssssssssssss+\`     `,
                    `           .-/+oossssoo+/-.         `,
                ].join('\n');
                result = `<div class="flex gap-6 my-1">` +
                    `<pre class="text-ub-orange text-xs leading-tight select-none">${asciiArt}</pre>` +
                    `<div class="text-xs leading-relaxed">` +
                    `<span class="text-ub-orange font-bold">thangle</span><span class="text-white">@</span><span class="text-ub-orange font-bold">resolute-raccoon</span>` +
                    `<div class="text-gray-500">─────────────────────────────</div>` +
                    `<div><span class="text-ubt-green font-bold">OS:      </span> Ubuntu 26.04 LTS Resolute Raccoon</div>` +
                    `<div><span class="text-ubt-green font-bold">Kernel:  </span> 6.14.0-26-generic</div>` +
                    `<div><span class="text-ubt-green font-bold">Uptime:  </span> Since you opened this tab</div>` +
                    `<div><span class="text-ubt-green font-bold">Shell:   </span> zsh 5.9</div>` +
                    `<div><span class="text-ubt-green font-bold">DE:      </span> GNOME 50</div>` +
                    `<div><span class="text-ubt-green font-bold">WM:      </span> Mutter (Resolute Raccoon)</div>` +
                    `<div><span class="text-ubt-green font-bold">CPU:     </span> Your Brain&#x2122; (overclocked)</div>` +
                    `<div><span class="text-ubt-green font-bold">Memory:  </span> ${Math.floor(Math.random() * 4000 + 6000)} MB / 16384 MB</div>` +
                    `<div><span class="text-ubt-green font-bold">Disk:    </span> 148 GB / 512 GB</div>` +
                    `<div><span class="text-ubt-green font-bold">Terminal:</span> thang-terminal 26.04</div>` +
                    `</div></div>`;
                break;
            }
            case "uname":
                result = "Linux resolute-raccoon 6.14.0-26-generic #26-Ubuntu SMP PREEMPT_DYNAMIC Fri Apr 10 14:32:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux";
                break;
            case "lsb_release":
                result = [
                    `No LSB modules are available.`,
                    `<div>Distributor ID: Ubuntu</div>`,
                    `<div>Description:    Ubuntu 26.04 LTS</div>`,
                    `<div>Release:        26.04</div>`,
                    `<div>Codename:       resolute-raccoon</div>`,
                ].join('');
                break;
            case "git":
                if (rest === "log --oneline" || rest === "log") {
                    result = [
                        `<div class="font-mono text-xs leading-relaxed">`,
                        `<div><span class="text-yellow-400">a1f3c9d</span> <span class="text-ubt-green">(HEAD -&gt; main, origin/main)</span> feat: ubuntu 26.04 resolute raccoon theme</div>`,
                        `<div><span class="text-yellow-400">b2e4d7f</span> feat: contact form with EmailJS integration</div>`,
                        `<div><span class="text-yellow-400">c3f5e8a</span> feat: gnome system monitor app</div>`,
                        `<div><span class="text-yellow-400">d4a6b9c</span> feat: gnome notification toast system</div>`,
                        `<div><span class="text-yellow-400">e5b7c0d</span> feat: neofetch and terminal commands</div>`,
                        `<div><span class="text-yellow-400">64e7d44</span> Initial commit</div>`,
                        `</div>`,
                    ].join('');
                } else {
                    result = `git: '${rest}' is not a git command. Try: git log --oneline`;
                }
                break;
            case "cat":
                if (rest === "about.txt" || rest === "~/about.txt") {
                    result = [
                        `<div class="font-mono text-xs leading-relaxed my-1">`,
                        `<div><span class="text-ubt-green font-bold">Name:      </span> Thang Le</div>`,
                        `<div><span class="text-ubt-green font-bold">Role:      </span> IT Specialist &amp; Full-Stack Developer</div>`,
                        `<div><span class="text-ubt-green font-bold">Location:  </span> Orlando, FL</div>`,
                        `<div><span class="text-ubt-green font-bold">Education: </span> UCF &mdash; B.S. Information Technology (2027)</div>`,
                        `<div><span class="text-ubt-green font-bold">Focus:     </span> Web Dev, Cybersecurity, Cloud, Backend</div>`,
                        `<div><span class="text-ubt-green font-bold">Contact:   </span> thangle.me &nbsp;|&nbsp; github.com/thangsauce</div>`,
                        `<div class="mt-1 text-gray-400 italic">"Wherever you go, there you are."</div>`,
                        `</div>`,
                    ].join('');
                } else {
                    result = `cat: ${rest}: No such file or directory`;
                }
                break;
            default:
                result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, neofetch, uname, lsb_release, git log, cat about.txt, code, ytmusic, firefox, about-thang, trash, settings ]";
        }
        const resultEl = document.getElementById(`row-result-${rowId}`);
        if (resultEl) resultEl.innerHTML = result;
        this.appendTerminalRow();
    }

    xss(str: string): string | undefined {
        if (!str) return;
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp';
                case '<':
                    return '&lt';
                case '>':
                    return '&gt';
                case '"':
                    return '&quot';
                case "'":
                    return '&#x27';
                case '/':
                    return '&#x2F';
                default:
                    return char;
            }
        }).join('');
    }

    render() {
        return (
            <div className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold" id="terminal-body">
                {
                    this.state.terminal
                }
            </div>
        )
    }
}

export default Terminal

export const displayTerminal = (addFolder: (name: string) => void, openApp: (id: string) => void) => {
    return <Terminal addFolder={addFolder} openApp={openApp} />;
}
