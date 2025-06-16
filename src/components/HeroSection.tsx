import { Button } from '@/components/ui/button';
import { PortfolioData } from '@/types/portfolio';

interface HeroSectionProps {
  data: PortfolioData['hero'];
}

export default function HeroSection({ data }: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-20 pb-16 bg-gradient-to-br from-primary/5 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            {data.profileImage && (
              <img
                src={data.profileImage}
                alt="Profile picture"
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg border-4 border-white object-cover"
              />
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up">
            {data.name}
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-slate-600 mb-6 animate-slide-up">
            {data.title}
          </h2>
          
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto animate-slide-up">
            {data.intro}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
