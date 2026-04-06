// "About Thang" app — personal portfolio content rendered inside a window.
// Sections: About, Education, Certifications, Skills, Projects, Resume.
// Active section is persisted to localStorage so it reopens where you left off.
import React, { Component, useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

interface AboutThangState {
    screen: React.ReactNode;
    active_screen: string;
    navbar: boolean;
}

export class AboutThang extends Component<Record<string, never>, AboutThangState> {
    screens: Record<string, React.ReactNode>;

    constructor(props: Record<string, never>) {
        super(props);
        this.screens = {};
        this.state = {
            screen: null,
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "certifications": <Certifications />,
            "skills": <Skills />,
            "projects": <Projects />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen) as HTMLElement);
    }

    changeScreen = (e: HTMLElement | React.FocusEvent<HTMLDivElement>): void => {
        const screen = (e as HTMLElement).id || ((e as React.FocusEvent<HTMLDivElement>).target as HTMLElement).id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "Custom Title" });


        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = (): void => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = (): React.ReactNode => {
        return (
            <>
                <div id="about" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="about thang" src="./themes/Yaru/status/about.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
                </div>
                <div id="education" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "education" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="thang's education" src="./themes/Yaru/status/education.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
                </div>
                <div id="certifications" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "certifications" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="certifications" src="./themes/Yaru/status/certifications.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Certifications</span>
                </div>
                <div id="skills" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "skills" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="thang's skills" src="./themes/Yaru/status/skills.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Skills</span>
                </div>
                <div id="projects" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "projects" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="thang's projects" src="./themes/Yaru/status/projects.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
                </div>
                <div id="resume" tabIndex={0} onFocus={this.changeScreen} className={(this.state.active_screen === "resume" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="thang's resume" src="./themes/Yaru/status/download.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex items-center gap-2 absolute z-30 bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 rounded-md px-2.5 py-1.5 top-2 left-2 cursor-default border border-white border-opacity-10">
                    <div className="flex flex-col gap-0.5 justify-center">
                        <div className="w-3.5 border-t border-white"></div>
                        <div className="w-3.5 border-t border-white"></div>
                        <div className="w-3.5 border-t border-white"></div>
                    </div>
                    <span className="text-xs text-gray-300 whitespace-nowrap">More Details</span>
                    <div className={(this.state.navbar ? " block animateShow z-30 " : " hidden ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-full md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen pt-12 md:pt-0">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutThang;

export const displayAboutThang = () => {
    return <AboutThang />;
}


const WHOAMI_LINES = [
    { delay: 0,    jsx: <div className="text-green-400">thang@resolute-raccoon:~$ whoami</div> },
    { delay: 600,  jsx: <div className="mt-2"><span className="text-yellow-400">name</span><span className="text-gray-500">:</span> <span className="text-white">Thang Le</span></div> },
    { delay: 850,  jsx: <div><span className="text-yellow-400">located_in</span><span className="text-gray-500">:</span> <span className="text-white">Orlando, FL</span></div> },
    { delay: 1050, jsx: <div><span className="text-yellow-400">current_status</span><span className="text-gray-500">:</span> <span className="text-white">IT Student @ UCF</span></div> },
    { delay: 1250, jsx: <div className="mt-2"><span className="text-yellow-400">areas_of_expertise</span><span className="text-gray-500">:</span></div> },
    { delay: 1400, jsx: <div className="ml-4 text-gray-300">- 🌐 Web Development</div> },
    { delay: 1550, jsx: <div className="ml-4 text-gray-300">- 🔐 Cybersecurity</div> },
    { delay: 1700, jsx: <div className="ml-4 text-gray-300">- ☁️ Cloud Infrastructure</div> },
    { delay: 1850, jsx: <div className="ml-4 text-gray-300">- ⚙️ Backend Systems</div> },
    { delay: 2050, jsx: <div className="mt-2"><span className="text-yellow-400">currently_building</span><span className="text-gray-500">:</span></div> },
    { delay: 2200, jsx: <div className="ml-4 text-gray-300">- Full-Stack Web Applications</div> },
    { delay: 2350, jsx: <div className="ml-4 text-gray-300">- Portfolio Projects</div> },
    { delay: 2500, jsx: <div className="ml-4 text-gray-300">- IT Infrastructure Labs</div> },
    { delay: 2700, jsx: <div className="mt-2"><span className="text-yellow-400">life_philosophy</span><span className="text-gray-500">:</span> <span className="text-green-300">&quot;Wherever you go, there you are.&quot;</span></div> },
    { delay: 2950, jsx: <div className="mt-2 text-green-400">thang@resolute-raccoon:~$ <span className="animate-pulse">▋</span></div> },
];

function TypingTerminal() {
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const timers = WHOAMI_LINES.map((line, i) =>
            setTimeout(() => setVisibleCount(i + 1), line.delay)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="p-4 font-mono text-xs md:text-sm space-y-1">
            {WHOAMI_LINES.slice(0, visibleCount).map((line, i) => (
                <React.Fragment key={i}>{line.jsx}</React.Fragment>
            ))}
        </div>
    );
}

function About() {
    return (
        <div className="w-full flex flex-col items-center px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
                <div className="text-2xl md:text-3xl font-bold">Thang Le</div>
                <div className="text-green-400 font-semibold text-base md:text-lg mt-1">IT Specialist</div>
                <div className="text-gray-400 text-sm mt-1">📍 Orlando, FL</div>
                <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs md:text-sm">
                    <a href="https://thangle.me" target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-blue-300 transition">🌐 thangle.me</a>
                    <a href="https://www.linkedin.com/in/thang-le-it/" target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-blue-300 transition">💼 LinkedIn</a>
                    <a href="https://github.com/thangsauce" target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-blue-300 transition">🐙 GitHub</a>
                </div>
            </div>

            {/* Terminal whoami */}
            <div className="w-full md:w-5/6 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="ml-2 text-xs text-gray-400 font-mono">terminal</span>
                </div>
                <TypingTerminal />
            </div>

            {/* Two column cards */}
            <div className="w-full md:w-5/6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700">
                    <div className="text-base font-bold mb-3 text-white">🚀 Current Focus</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2"><span>🌐</span> Building polished full-stack web apps</li>
                        <li className="flex items-start gap-2"><span>🔐</span> Strengthening cybersecurity fundamentals</li>
                        <li className="flex items-start gap-2"><span>📂</span> Developing portfolio projects</li>
                        <li className="flex items-start gap-2"><span>☁️</span> Learning cloud &amp; backend systems</li>
                    </ul>
                </div>
                <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 border border-gray-700">
                    <div className="text-base font-bold mb-3 text-white">💡 Quick Facts</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2"><span>🎓</span> B.S. Information Technology — UCF</li>
                        <li className="flex items-start gap-2"><span>🏆</span> Hackathon builder (CampusLab SIEM)</li>
                        <li className="flex items-start gap-2"><span>🏍️</span> Motorcycle enthusiast &amp; Cinephile</li>
                        <li className="flex items-start gap-2"><span>🎮</span> Gamer &amp; Music lover</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function Education() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Education
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        University of Central Florida
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">Aug 2022 – May 2027 (Expected)</div>
                    <div className=" text-sm md:text-base">Bachelor of Science, Information Technology</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">Orlando, FL</div>
                </li>
            </ul>
        </>
    )
}

function Certifications() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Certifications
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className="w-10/12 mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className="text-lg md:text-xl text-left font-bold leading-tight">
                        CompTIA IT Fundamentals+
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">TestOut</div>
                    <div className="text-sm text-gray-300 font-bold mt-1">ID: 6-1C6-VPVCKB</div>
                </li>
            </ul>
        </>
    )
}

const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
interface SkillChipProps { label: string; bg: string; fg?: string; icon: string; imgFilter?: string; }
function SkillChip({ label, bg, fg = '#ffffff', icon, imgFilter }: SkillChipProps) {
    return (
        <span className="m-1 px-2.5 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: bg, color: fg, display: 'inline-flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
            <img src={icon} alt={label} style={{ width: '14px', height: '14px', display: 'block', flexShrink: 0, filter: imgFilter }} />
            {label}
        </span>
    );
}

function Skills() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Technical Skills
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <div className="w-full md:w-10/12 mt-6 px-2">
                <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Frontend</div>
                    <div className="flex flex-wrap">
                        <SkillChip label="JavaScript"  bg="#F7DF1E" fg="#000" icon={`${CDN}/javascript/javascript-original.svg`} />
                        <SkillChip label="TypeScript"   bg="#3178C6"            icon={`${CDN}/typescript/typescript-original.svg`} />
                        <SkillChip label="React"        bg="#20232A"            icon={`${CDN}/react/react-original.svg`} />
                        <SkillChip label="Next.js"      bg="#1a1a1a"            icon={`${CDN}/nextjs/nextjs-original.svg`} imgFilter="brightness(0) invert(1)" />
                        <SkillChip label="Tailwind CSS" bg="#0F172A"            icon={`${CDN}/tailwindcss/tailwindcss-original.svg`} />
                        <SkillChip label="Bootstrap"    bg="#563D7C"            icon={`${CDN}/bootstrap/bootstrap-original.svg`} />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Backend</div>
                    <div className="flex flex-wrap">
                        <SkillChip label="Python"  bg="#3776AB" icon={`${CDN}/python/python-original.svg`} />
                        <SkillChip label="Java"    bg="#ED8B00" icon={`${CDN}/java/java-original.svg`} />
                        <SkillChip label="Node.js" bg="#1d5c1d" icon={`${CDN}/nodejs/nodejs-original.svg`} />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Databases</div>
                    <div className="flex flex-wrap">
                        <SkillChip label="MySQL"      bg="#0d2a4a" icon={`${CDN}/mysql/mysql-original.svg`} />
                        <SkillChip label="PostgreSQL" bg="#316192" icon={`${CDN}/postgresql/postgresql-original.svg`} />
                        <SkillChip label="MongoDB"    bg="#1e5c1a" icon={`${CDN}/mongodb/mongodb-original.svg`} />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Tools & OS</div>
                    <div className="flex flex-wrap">
                        <SkillChip label="Git"     bg="#8a2208" icon={`${CDN}/git/git-original.svg`} imgFilter="brightness(0) invert(1)" />
                        <SkillChip label="VS Code" bg="#007ACC" icon={`${CDN}/vscode/vscode-original.svg`} />
                        <SkillChip label="Linux"   bg="#2a2a2a" icon={`${CDN}/linux/linux-original.svg`} />
                        <SkillChip label="Windows" bg="#0078D6" icon={`${CDN}/windows8/windows8-original.svg`} />
                        <SkillChip label="macOS"   bg="#555555" icon={`${CDN}/apple/apple-original.svg`} imgFilter="brightness(0) invert(1)" />
                    </div>
                </div>
            </div>
        </>
    )
}

interface ProjectItem {
    name: string;
    date: string;
    link: string;
    description: string[];
    domains: string[];
}

function Projects() {
    const project_list: ProjectItem[] = [
        {
            name: "portfolio",
            date: "Mar 2026",
            link: "https://github.com/thangsauce/portfolio",
            description: ["Personal portfolio website built with TypeScript."],
            domains: ["typescript"]
        },
        {
            name: "ArenaOps",
            date: "Mar 2026",
            link: "https://github.com/thangsauce/ArenaOps",
            description: ["Arena operations management application built with TypeScript."],
            domains: ["typescript"]
        },
        {
            name: "aromamor-candles",
            date: "Mar 2026",
            link: "https://github.com/thangsauce/aromamor-candles",
            description: ["E-commerce candle website built with TypeScript."],
            domains: ["typescript"]
        },
        {
            name: "HTML-Resume",
            date: "Mar 2026",
            link: "https://github.com/thangsauce/HTML-Resume",
            description: ["HTML Resume with information and experiences."],
            domains: ["html5"]
        },
        {
            name: "Candle-Website",
            date: "Feb 2026",
            link: "https://github.com/thangsauce/Candle-Website",
            description: ["A candle e-commerce website built with HTML."],
            domains: ["html5"]
        },
        {
            name: "Pokemon-Finder",
            date: "Feb 2026",
            link: "https://github.com/thangsauce/Pokemon-Finder-Asynchronous-JavaScript-and-Fetch",
            description: ["Pokemon finder app using asynchronous JavaScript and the Fetch API."],
            domains: ["javascript", "html5"]
        },
        {
            name: "Vigil-HTML-Sample",
            date: "Feb 2026",
            link: "https://github.com/thangsauce/Vigil-HTML-Sample",
            description: ["HTML sample project demonstrating web structure and layout."],
            domains: ["html5"]
        },
        {
            name: "DOM-Manipulation",
            date: "Feb 2026",
            link: "https://github.com/thangsauce/DOM-Manipulation",
            description: ["DOM manipulation exercises using vanilla JavaScript."],
            domains: ["javascript", "html5"]
        },
        {
            name: "Pizza-Form",
            date: "Jan 2026",
            link: "https://github.com/thangsauce/Pizza-Form",
            description: ["Interactive pizza order form built with HTML and CSS."],
            domains: ["html5", "css"]
        },
    ];

    const tag_colors: Record<string, string> = {
        "javascript": "yellow-300",
        "typescript": "blue-400",
        "html5": "pink-600",
        "css": "blue-300",
        "next.js": "purple-600",
        "tailwindcss": "blue-300",
        "python": "green-200",
    }

    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>

            {
                project_list.map((project, index) => {
                    const projectNameFromLink = project.link.split('/')
                    const projectName = projectNameFromLink[projectNameFromLink.length - 1]
                    return (
                        <a key={index} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2">{project.name.toLowerCase()}</div>
                                        <iframe src={`https://ghbtns.com/github-btn.html?user=thangsauce&repo=${projectName}&type=star&count=true`} frameBorder={0} scrolling="no" width="150" height="20" title={project.name.toLowerCase()+"-star"}></iframe>
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                    {
                                        (project.domains ?
                                            project.domains.map((domain, index) => {
                                                return <span key={index} className={`px-1.5 py-0.5 w-max border border-${tag_colors[domain]} text-${tag_colors[domain]} m-1 rounded-full`}>{domain}</span>
                                            })

                                            : null)
                                    }
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}

function Resume() {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex flex-wrap justify-center gap-4 py-2 bg-ub-cool-grey text-sm border-b border-gray-700">
                <a href="https://thangle.me" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">🌐 thangle.me</a>
                <span className="text-gray-500">·</span>
                <a href="https://www.linkedin.com/in/thang-le-it/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">💼 linkedin.com/in/thang-le-it</a>
                <span className="text-gray-500">·</span>
                <a href="https://github.com/thangsauce" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">🐙 github.com/thangsauce</a>
            </div>
            <iframe className="flex-1 w-full" src="./files/Thang-Le-Resume.pdf" title="Thang Le resume" frameBorder={0}></iframe>
        </div>
    )
}
