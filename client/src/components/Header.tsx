import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "learn", label: "Learn" },
    { id: "quiz", label: "Detection Quiz" },
    { id: "video-tool", label: "Video Tool" },
    { id: "business-threats", label: "Business Protection" },
    { id: "ip-protection", label: "IP Security" },
    { id: "ai-monitoring", label: "AI Monitoring" },
    { id: "truth-verification", label: "Truth Verification" },
    { id: "api-theft-monitoring", label: "API Theft" },
    { id: "console-control", label: "Console Control" },
    { id: "harassment-detection", label: "Harassment Detection" },
    { id: "blockchain-integrity", label: "Blockchain Integrity" },
    { id: "threat-analysis", label: "Threat Analysis" },
    { id: "resources", label: "Resources" },
  ];

  return (
    <header className="bg-surface-custom shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Shield className="text-primary-custom text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-900">AI Safety Shield</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    item.id === "home" 
                      ? "text-primary-custom font-medium" 
                      : "text-gray-700 hover:text-primary-custom"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("report")}
                className="bg-error-custom text-white hover:bg-red-700"
              >
                Report
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left px-3 py-2 rounded-md transition-colors ${
                        item.id === "home" 
                          ? "text-primary-custom font-medium" 
                          : "text-gray-700 hover:text-primary-custom"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button
                    onClick={() => scrollToSection("report")}
                    className="bg-error-custom text-white hover:bg-red-700 mt-4"
                  >
                    Report
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
