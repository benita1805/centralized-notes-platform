import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-magentaGlow text-cyanGlow font-sans text-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p>© {new Date().getFullYear()} NotesHub. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-magentaGlow transition"
          >
            <Github size={18} />
          </a>
          <a
            href="mailto:you@example.com"
            className="hover:text-magentaGlow transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
