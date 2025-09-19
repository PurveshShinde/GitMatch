import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  const modalBgClass = isDarkMode
    ? "bg-gray-900 border-purple-500/20"
    : "bg-white border-blue-500/20";
  const titleClass = isDarkMode
    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
    : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500";
  const closeButtonClass = isDarkMode
    ? "text-gray-400 hover:text-purple-400"
    : "text-gray-600 hover:text-blue-600";

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
        isDarkMode ? "bg-black/50" : "bg-white/50"
      }`}
    >
      <div
        className={`${modalBgClass} p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-95 hover:scale-100`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${titleClass}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`transition-colors ${closeButtonClass}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

const HeaderIcon = ({ icon, text, isDarkMode }) => (
  <div className="flex flex-col items-center">
    <div className={`${isDarkMode ? "text-purple-400" : "text-blue-500"} mb-1`}>
      {icon}
    </div>
    <span
      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
    >
      {text}
    </span>
  </div>
);

const SectionIcon = ({ icon, text, isDarkMode }) => (
  <div className="flex flex-col items-center p-4">
    <div
      className={`p-4 rounded-full mb-2 border ${
        isDarkMode
          ? "bg-gray-800 border-purple-500/20"
          : "bg-blue-100 border-blue-500/20"
      }`}
    >
      <div
        className={`${isDarkMode ? "text-white" : "text-blue-800"} text-3xl`}
      >
        {icon}
      </div>
    </div>
    <span
      className={`${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      } text-sm font-medium`}
    >
      {text}
    </span>
  </div>
);

const FeatureCard = ({ icon, title, description, isDarkMode }) => {
  const bgClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const titleClass = isDarkMode ? "text-white" : "text-gray-900";
  const descClass = isDarkMode ? "text-gray-400" : "text-gray-600";

  let gradientClass;
  if (isDarkMode) {
    if (title === "GitHub Issue Matching")
      gradientClass =
        "border-l-[6px] border-l-purple-500/80 border-r-4 border-r-pink-500/80";
    if (title === "AI Smart Predictions")
      gradientClass =
        "border-l-[6px] border-l-lime-500/80 border-r-4 border-r-teal-500/80";
    if (title === "Analytics with Google Sheets")
      gradientClass =
        "border-l-[6px] border-l-blue-500/80 border-r-4 border-r-cyan-500/80";
  } else {
    if (title === "GitHub Issue Matching")
      gradientClass =
        "border-l-[6px] border-l-purple-500 border-r-4 border-r-pink-500";
    if (title === "AI Smart Predictions")
      gradientClass =
        "border-l-[6px] border-l-lime-500 border-r-4 border-r-teal-500";
    if (title === "Analytics with Google Sheets")
      gradientClass =
        "border-l-[6px] border-l-blue-500 border-r-4 border-r-cyan-500";
  }

  return (
    <div
      className={`p-6 rounded-2xl ${bgClass} border-2 ${gradientClass} shadow-lg transition-transform transform hover:scale-105`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div
          className={`p-3 rounded-full ${
            isDarkMode
              ? gradientClass.replace("from-", "bg-").replace("to-", "bg-")
              : "bg-blue-200"
          }`}
        >
          <div
            className={`${
              isDarkMode ? "text-white" : "text-blue-800"
            } text-2xl`}
          >
            {icon}
          </div>
        </div>
        <h3 className={`text-xl font-bold ${titleClass}`}>{title}</h3>
      </div>
      <p className={descClass}>{description}</p>
    </div>
  );
};

const StatCard = ({ number, text, isDarkMode }) => {
  const bgClass = isDarkMode
    ? "bg-gray-800 border-purple-500/20"
    : "bg-white border-blue-500/20";
  const numberClass = isDarkMode
    ? "from-purple-400 to-pink-500"
    : "from-blue-600 to-cyan-500";
  const textClass = isDarkMode ? "text-gray-400" : "text-gray-600";
  return (
    <div
      className={`p-6 rounded-2xl ${bgClass} shadow-lg text-center transition-transform transform hover:scale-105`}
    >
      <div
        className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${numberClass} mb-2`}
      >
        {number}
      </div>
      <p className={`${textClass} text-lg`}>{text}</p>
    </div>
  );
};

const TestimonialCard = ({ stars, quote, author, role, isDarkMode }) => {
  const bgClass = isDarkMode
    ? "bg-gray-800 border-purple-500/20"
    : "bg-white border-blue-500/20";
  const quoteClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const authorClass = isDarkMode ? "text-white" : "text-gray-900";
  const roleClass = isDarkMode ? "text-gray-400" : "text-gray-600";
  return (
    <div
      className={`p-6 rounded-2xl ${bgClass} shadow-lg transition-transform transform hover:scale-105`}
    >
      <div className="text-yellow-400 text-lg mb-2">{stars}</div>
      <p className={`${quoteClass} italic mb-4`}>"{quote}"</p>
      <div className="text-sm">
        <p className={`font-semibold ${authorClass}`}>{author}</p>
        <p className={roleClass}>{role}</p>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const mainBg = isDarkMode
    ? "bg-gray-950 text-white"
    : "bg-slate-100 text-gray-900";
  const headingBg = isDarkMode
    ? "from-purple-400 to-pink-500"
    : "from-blue-600 to-cyan-500";
  const textClass = isDarkMode ? "text-gray-400" : "text-gray-600";

  const buttonClass = isDarkMode
    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white";

  const secondaryButtonClass = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "bg-white hover:bg-gray-200 text-gray-800";

  return (
    <div
      className={`min-h-screen font-sans relative overflow-hidden transition-colors duration-500 ${mainBg}`}
    >
      {/* Background gradients and blobs */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 ${
          isDarkMode ? "bg-purple-500/20" : "bg-blue-500/20"
        } rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob`}
      ></div>
      <div
        className={`absolute top-1/2 right-0 w-80 h-80 ${
          isDarkMode ? "bg-pink-500/20" : "bg-cyan-500/20"
        } rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000`}
      ></div>
      <div
        className={`absolute bottom-0 left-1/3 w-72 h-72 ${
          isDarkMode ? "bg-blue-500/20" : "bg-purple-500/20"
        } rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000`}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
              } shadow-lg`}
            ></div>
            <span
              className={`font-extrabold text-xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              GitHub Collab
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-600 hover:text-blue-500"
                } transition-colors relative group`}
              >
                Find a Project
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${
                    isDarkMode ? "bg-purple-400" : "bg-blue-500"
                  } scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></span>
              </a>
              <a
                href="#"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-600 hover:text-blue-500"
                } transition-colors relative group`}
              >
                About Us
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${
                    isDarkMode ? "bg-purple-400" : "bg-blue-500"
                  } scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></span>
              </a>
              <a
                href="#"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-600 hover:text-blue-500"
                } transition-colors relative group`}
              >
                Contact
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${
                    isDarkMode ? "bg-purple-400" : "bg-blue-500"
                  } scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></span>
              </a>
            </nav>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-800"
              } transition-colors text-sm font-semibold`}
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={`px-6 py-2 transition-colors rounded-full text-sm font-semibold shadow-lg ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="text-center py-24 px-4">
          <div
            className={`text-sm mb-2 font-mono tracking-widest uppercase ${
              isDarkMode ? "text-purple-400" : "text-blue-600"
            }`}
          >
            GitHub Collab
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${headingBg}`}
            >
              Open Source
            </span>
            <br className="sm:hidden" /> Contribution Matchmaker
          </h1>
          <p
            className={`${textClass} max-w-4xl mx-auto mb-12 text-lg md:text-xl`}
          >
            A free and open platform for developers to find exciting new open
            source projects to contribute to.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className={`w-full sm:w-auto px-10 py-4 transition-all text-white font-bold rounded-full shadow-lg transform hover:scale-105 ${buttonClass}`}
            >
              Sign Up
            </button>
            <button
              className={`w-full sm:w-auto px-10 py-4 transition-all font-bold rounded-full shadow-lg transform hover:scale-105 ${secondaryButtonClass}`}
            >
              Sign In
            </button>
          </div>

          <button
            className={`px-8 py-4 border rounded-full transition-all font-semibold ${
              isDarkMode
                ? "border-purple-500/50 text-purple-300 hover:bg-purple-900/20"
                : "border-blue-500/50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Find My Match
          </button>
        </main>

        {/* Features Section */}
        <section className="py-20">
          <div className="flex justify-around flex-wrap space-y-8 sm:space-y-0">
            <SectionIcon
              icon="&#128105;"
              text="Developers"
              isDarkMode={isDarkMode}
            />
            <SectionIcon
              icon="&#128187;"
              text="Repositories"
              isDarkMode={isDarkMode}
            />
            <SectionIcon
              icon="&#128218;"
              text="Mentors"
              isDarkMode={isDarkMode}
            />
            <SectionIcon icon="&#128214;" text="Orgs" isDarkMode={isDarkMode} />
            <SectionIcon
              icon="&#128295;"
              text="Projects"
              isDarkMode={isDarkMode}
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 text-center">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            How It Works
          </h2>
          <p className={`${textClass} max-w-xl mx-auto mb-12`}>
            Our AI-powered platform connects developers with open source
            projects that match their skills and interests.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="&lt;&gt;"
              title="GitHub Issue Matching"
              description="Our algorithms scan thousands of open GitHub issues to find the perfect match for your skills and experience level."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="&#129504;"
              title="AI Smart Predictions"
              description="AI analyzes your GitHub profile and contribution history to understand your unique developer profile."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="&#128200;"
              title="Analytics with Google Sheets"
              description="Track your contributions and progress over time with detailed analytics powered by Google Sheets integration."
              isDarkMode={isDarkMode}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              number="10K+"
              text="Open Issues"
              isDarkMode={isDarkMode}
            />
            <StatCard number="5K+" text="Developers" isDarkMode={isDarkMode} />
            <StatCard number="1K+" text="Projects" isDarkMode={isDarkMode} />
            <StatCard
              number="24/7"
              text="Active Matching"
              isDarkMode={isDarkMode}
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 text-center">
          <h2
            className={`text-4xl font-bold mb-12 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            What Developers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <TestimonialCard
              stars="★★★★★"
              quote="Found my first open source contribution through IssueAlliance. The perfect match system really works!"
              author="Shivam Dombe"
              role="MERN Stack Developer"
              isDarkMode={isDarkMode}
            />
            <TestimonialCard
              stars="★★★★★"
              quote="As a maintainer, I've found quality contributors through this platform. It's a game changer."
              author="Mayur Dongare"
              role="Web Developer"
              isDarkMode={isDarkMode}
            />
            <TestimonialCard
              stars="★★★★★"
              quote="The AI recommendations helped me level up my skills by finding just-right challenges."
              author="Bhakti Mudgal"
              role="Full Stack Developer"
              isDarkMode={isDarkMode}
            />
            <TestimonialCard
              stars="★★★★★"
              quote="The leaderboard is a great way to see how I'm doing compared to others."
              author="Mayur Hiware"
              role="Web Developer"
              isDarkMode={isDarkMode}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          className={`py-24 text-center rounded-3xl backdrop-blur-sm ${
            isDarkMode ? "bg-blue-900/50" : "bg-blue-100/50"
          }`}
        >
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Ready to find your perfect open source match?
          </h2>
          <p className={`${textClass} max-w-2xl mx-auto mb-8 text-lg`}>
            Join thousands of developers who are contributing to meaningful
            projects that match their skills.
          </p>
          <button
            className={`px-10 py-4 transition-all text-white font-bold rounded-full shadow-lg transform hover:scale-105 ${buttonClass}`}
          >
            Get Started Today
          </button>
        </section>

        {/* Footer */}
        <footer
          className={`text-center text-sm py-12 space-y-6 ${
            isDarkMode ? "text-gray-600" : "text-gray-500"
          }`}
        >
          <div className="flex justify-center space-x-8">
            <a href="#" className="hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.305 3.493.998.108-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.8.576 4.765-1.589 8.196-6.086 8.196-11.385 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.568 0-6.471 2.903-6.471 6.472 0 .506.056 1 .163 1.479-5.383-.271-10.165-2.846-13.364-6.756-.554.956-.874 2.071-.874 3.265 0 2.251 1.144 4.248 2.887 5.422-1.065-.034-2.064-.328-2.932-.809v.079c0 3.159 2.24 5.795 5.216 6.393-.544.149-1.118.22-1.706.22-.418 0-.825-.04-1.222-.116.829 2.583 3.235 4.472 6.093 4.529-2.106 1.649-4.761 2.63-7.662 2.63-.497 0-.986-.03-.1.172.964-.094 1.956-.145 2.967-.145 3.568 0 6.471-2.903 6.471-6.471 0-.101-.008-.201-.02-.301.695-.499 1.299-1.096 1.782-1.774-.757.336-1.57.56-2.427.669.878-.528 1.547-1.365 1.861-2.372-.818.487-1.727.842-2.697 1.037.766-2.581-2.05-5.368-4.636-5.368-3.729 0-6.76 3.031-6.76 6.76 0 .425.043.837.126 1.238-5.626-.282-10.603-2.984-13.931-7.051-.577.994-.908 2.152-.908 3.42 0 4.673 2.564 8.784 6.132 11.168-.58.156-1.196.236-1.821.236-.452 0-.895-.037-1.325-.108 1.948 6.494 6.945 11.258 12.822 12.446-4.505 3.535-10.151 5.673-16.326 5.673-1.055 0-2.09-.06-3.111-.184 6.479 2.062 14.167 3.324 21.905 3.324 26.267 0 40.643-21.843 40.643-40.598 0-.624-.016-1.246-.045-1.864 2.784-1.996 5.197-4.593 7.151-7.519z" />
              </svg>
            </a>
          </div>
          <p>&copy; 2025 GitHub Collab. All rights reserved.</p>
        </footer>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In"
        isDarkMode={isDarkMode}
      >
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 mt-1 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 mt-1 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 mt-6 transition-all rounded-full font-bold shadow-lg ${buttonClass}`}
          >
            Sign In
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        title="Sign Up"
        isDarkMode={isDarkMode}
      >
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-4 py-3 mt-1 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 mt-1 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 mt-1 rounded-xl transition-colors focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-purple-500"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 mt-6 transition-all rounded-full font-bold shadow-lg ${buttonClass}`}
          >
            Sign Up
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default App;
