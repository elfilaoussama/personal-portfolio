import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  portfolioName: string;
  onDownloadCV: () => void;
  onOpenAdmin: () => void;
}

export default function Navigation({
  portfolioName,
  onDownloadCV,
  onOpenAdmin,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showAdminButton, setShowAdminButton] = useState(false);

  const targetSequence = ["q", "q", "q"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl key is pressed
      if (
        event.ctrlKey &&
        event.key.toLowerCase() >= "a" &&
        event.key.toLowerCase() <= "z"
      ) {
        const key = event.key.toLowerCase();

        setKeySequence((prev) => {
          const newSequence = [...prev, key];

          // Keep only the last 5 keys to match our target sequence length
          if (newSequence.length > targetSequence.length) {
            newSequence.shift();
          }

          // Check if the sequence matches our target
          if (newSequence.length === targetSequence.length) {
            const matches = newSequence.every(
              (k, index) => k === targetSequence[index],
            );
            if (matches) {
              // Trigger admin dashboard and hide the button
              onOpenAdmin();
              setShowAdminButton(false);
              // Reset sequence
              return [];
            }
          }

          return newSequence;
        });
      } else if (!event.ctrlKey) {
        // Reset sequence if Ctrl is not pressed
        setKeySequence([]);
      }
    };

    // Reset sequence after timeout (optional - prevents accidental triggers)
    const resetTimeout = setTimeout(() => {
      setKeySequence([]);
    }, 3000);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(resetTimeout);
    };
  }, [onOpenAdmin, targetSequence]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-white/10 backdrop-blur-md"
      } border-b border-white/20`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-slate-900">
            {portfolioName}
          </div>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="hover:text-primary transition-colors"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="hover:text-primary transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="hover:text-primary transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="hover:text-primary transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={onDownloadCV}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
            {showAdminButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenAdmin}
                className="text-slate-600 hover:text-primary"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
