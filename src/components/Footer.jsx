import { FaGithub, FaLinkedin, FaEgg } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[var(--background)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} React Jobs. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-4">
            <a 
              href="https://github.com/yum3lo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--red)] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/maria-cucoș/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--red)] transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="https://i.pinimg.com/originals/69/47/1d/69471dcdc07a6db2498c77d34921dfad.gif" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--red)] transition-colors"
              aria-label="LinkedIn"
            >
              <FaEgg size={20} />
            </a>
          </div>
        </div>
        <div className="text-xs text-center mt-4 mb-0 opacity-75">
          <p>Made with ❤️ for job seekers and employers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;