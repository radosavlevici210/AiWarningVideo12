import { Button } from "@/components/ui/button";
import { AlertTriangle, GraduationCap, HelpCircle } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="gradient-hero py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Don't Get <span className="text-primary-custom">Slicked</span> by AI Scams
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn to identify and protect yourself from AI-powered deception. From deepfakes to voice cloning, 
            understand the risks and stay safe in the age of artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollToSection("learn")}
              className="bg-primary-custom text-white px-8 py-3 hover:bg-blue-700 transition-colors"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button 
              onClick={() => scrollToSection("quiz")}
              className="bg-secondary-custom text-white px-8 py-3 hover:bg-orange-600 transition-colors"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Take Detection Quiz
            </Button>
          </div>
        </div>
        
        {/* Alert Banner */}
        <div className="mt-12 bg-warning-custom bg-opacity-10 border border-orange-400 rounded-lg p-4 max-w-4xl mx-auto">
          <div className="flex items-start">
            <AlertTriangle className="text-warning-custom text-xl mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Scams Are Rising</h3>
              <p className="text-gray-700 text-sm">
                Recent reports show a 300% increase in AI-powered scams. Stay informed and protect yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
