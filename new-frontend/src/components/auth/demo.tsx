import { useState } from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";

export default function PortfolioLayout() {
  const [theme, setTheme] = useState("blue");

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 p-6 flex flex-col justify-between">
        {/* Profile */}
        <div>
          <h1 className="text-xl font-bold">Robin Spielmann</h1>
          <p className="text-sm opacity-80">Design Engineer</p>

          {/* Sections */}
          <div className="mt-6 space-y-4">
            <Section title="What I Create" items={["Projects", "Photography"]} />
            <Section title="What I Consume" items={["Books", "Music", "Bookmarks"]} />
            <Section title="Where To Find Me" items={["Mastodon", "Github", "Readcv", "Glass"]} icons />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={() => setTheme(theme === "blue" ? "purple" : "blue")} 
            className="bg-white text-black px-3 py-1 rounded-lg"
          >
            {theme === "blue" ? "Blue" : "Purple"}
          </button>
          <span className="text-xs">© 2025</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white text-black p-10">
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold">
            Hey, I am <span className="text-blue-600">Robin</span> – a Design Engineer living in Munich...
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl">
            This personal website is my own little space...
          </p>
        </section>

        {/* Projects */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Latest Projects</h3>
            <button className="text-blue-600 flex items-center gap-1">
              All projects <FiExternalLink />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProjectCard title="Lumon" subtitle="‘Severance’ interface" year="2022" />
            <ProjectCard title="Generated" subtitle="Generative art" ongoing />
            <ProjectCard title="Notion Budget" subtitle="Budget data visualization" year="2021" />
          </div>
        </section>
      </main>
    </div>
  );
}

function Section({ title, items, icons }: { title: string; items: string[]; icons?: boolean }) {
  return (
    <div>
      <h4 className="text-xs uppercase text-white/60">{title}</h4>
      <ul className="mt-1 space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 hover:underline cursor-pointer">
            {icons && <FiGithub size={14} />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ title, subtitle, year, ongoing }: { title: string; subtitle: string; year?: string; ongoing?: boolean }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 hover:shadow-md cursor-pointer">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-semibold">{title}</h5>
        {ongoing ? (
          <span className="text-purple-600 text-xs">Ongoing</span>
        ) : (
          <span className="text-gray-500 text-xs">{year}</span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  );
}