// "About Thang" app — personal portfolio content rendered inside a window.
// Sections: About, Education, Certifications, Skills, Projects, Resume.
// Active section is persisted to localStorage so it reopens where you left off.
import React, { Component } from 'react';
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
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
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
                <div className="p-4 font-mono text-xs md:text-sm space-y-1">
                    <div className="text-green-400">thang@Desktop:~$</div>
                    <div className="mt-2"><span className="text-yellow-400">name</span><span className="text-gray-500">:</span> <span className="text-white">Thang Le</span></div>
                    <div><span className="text-yellow-400">located_in</span><span className="text-gray-500">:</span> <span className="text-white">Orlando, FL</span></div>
                    <div><span className="text-yellow-400">current_status</span><span className="text-gray-500">:</span> <span className="text-white">IT Student @ UCF</span></div>
                    <div className="mt-2"><span className="text-yellow-400">areas_of_expertise</span><span className="text-gray-500">:</span></div>
                    <div className="ml-4 text-gray-300">- 🌐 Web Development</div>
                    <div className="ml-4 text-gray-300">- 🔐 Cybersecurity</div>
                    <div className="ml-4 text-gray-300">- ☁️ Cloud Infrastructure</div>
                    <div className="ml-4 text-gray-300">- ⚙️ Backend Systems</div>
                    <div className="mt-2"><span className="text-yellow-400">currently_building</span><span className="text-gray-500">:</span></div>
                    <div className="ml-4 text-gray-300">- Full-Stack Web Applications</div>
                    <div className="ml-4 text-gray-300">- Portfolio Projects</div>
                    <div className="ml-4 text-gray-300">- IT Infrastructure Labs</div>
                    <div className="mt-2"><span className="text-yellow-400">life_philosophy</span><span className="text-gray-500">:</span> <span className="text-green-300">"Wherever you go, there you are."</span></div>
                    <div className="mt-2 text-green-400">thang@Desktop:~$ <span className="animate-pulse">▋</span></div>
                </div>
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
                <div className="mb-4">
                    <div className="text-sm md:text-base font-bold mb-2">Frontend</div>
                    <div className="flex flex-wrap">
                        <img className="m-1" src="https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A" alt="javascript" />
                        <img className="m-1" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="typescript" />
                        <img className="m-1" src="https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=ffffff" alt="react" />
                        <img className="m-1" src="https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=ffffff" alt="next.js" />
                        <img className="m-1" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="tailwind css" />
                        <img className="m-1" src="https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white" alt="bootstrap" />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="text-sm md:text-base font-bold mb-2">Backend</div>
                    <div className="flex flex-wrap">
                        <img className="m-1" src="http://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=ffffff" alt="python" />
                        <img className="m-1" src="https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white" alt="java" />
                        <img className="m-1" src="https://img.shields.io/badge/-Nodejs-339933?style=flat&logo=Node.js&logoColor=ffffff" alt="node.js" />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="text-sm md:text-base font-bold mb-2">Databases</div>
                    <div className="flex flex-wrap">
                        <img className="m-1" src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" alt="mysql" />
                        <img className="m-1" src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white" alt="postgresql" />
                        <img className="m-1" src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white" alt="mongodb" />
                    </div>
                </div>
                <div className="mb-4">
                    <div className="text-sm md:text-base font-bold mb-2">Tools & OS</div>
                    <div className="flex flex-wrap">
                        <img className="m-1" src="https://img.shields.io/badge/-Git-%23F05032?style=flat&logo=git&logoColor=%23ffffff" alt="git" />
                        <img className="m-1" src="https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=vscodium&logoColor=white" alt="vs code" />
                        <img className="m-1" src="https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black" alt="linux" />
                        <span className="m-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white" style={{backgroundColor:"#0078D6"}}>
                            <svg className="mr-1" width="12" height="12" viewBox="0 0 23 23" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h11v11H0zm12 0h11v11H12zM0 12h11v11H0zm12 0h11v11H12z"/>
                            </svg>
                            Windows
                        </span>
                        <img className="m-1" src="https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white" alt="macos" />
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
