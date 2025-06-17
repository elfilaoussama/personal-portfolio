import { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import EducationSection from '@/components/EducationSection';
import ContactSection from '@/components/ContactSection';
import BackToTop from '@/components/BackToTop';
import AdminDashboard from '@/components/AdminDashboard';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useToast } from '@/hooks/use-toast';
import { useReactToPrint } from 'react-to-print';

export default function Home() {
  const { data, isLoading, error } = usePortfolioData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { toast } = useToast();
  const componentRef = useRef<HTMLDivElement>(null);

  // Always define hooks first, then handle conditional rendering
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: data ? `${data.hero.name}_CV` : 'CV',
  });

  const handleDownloadCV = () => {
    handlePrint();
    toast.toast('CV download started...');
  };

  const handleGenerateCV = () => {
    handleDownloadCV();
  };

  let content: React.ReactNode = null;
  if (isLoading) {
    content = <div className="min-h-screen flex items-center justify-center">Loading portfolio...</div>;
  } else if (error) {
    content = <div className="min-h-screen flex items-center justify-center text-red-600">Error loading portfolio data: {error}</div>;
  } else if (!data) {
    content = <div className="min-h-screen flex items-center justify-center text-red-600">No portfolio data found.</div>;
  } else {
    const CVTemplate = () => (
      <div className="bg-white p-8 max-w-4xl mx-auto text-sm leading-relaxed">
        {/* ...CV content... */}
      </div>
    );
    content = (
      <div className="min-h-screen bg-slate-50">
        <Navigation
          portfolioName={data.hero.name}
          onDownloadCV={handleDownloadCV}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <main>
          <HeroSection data={data.hero} />
          <AboutSection about={data.about} contact={data.contact} />
          <SkillsSection data={data.skills} />
          <ExperienceSection data={data.experience} />
          <ProjectsSection data={data.projects} />
          <EducationSection data={data.education} />
          <ContactSection contact={data.contact} />
        </main>
        <BackToTop />
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          data={data}
          onUpdateData={() => {}}
          onGenerateCV={handleGenerateCV}
        />
        {/* Hidden CV Template for printing */}
        <div className="hidden">
          <div ref={componentRef}>
            <CVTemplate />
          </div>
        </div>
      </div>
    );
  }

  return content;
}
