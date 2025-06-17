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
  const { data, updateData } = usePortfolioData();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { toast } = useToast();

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.hero.name}_CV`,
  });

  const handleDownloadCV = () => {
    handlePrint();
    toast('CV download started...');
  };

  const handleGenerateCV = () => {
    handleDownloadCV();
  };

  const CVTemplate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto text-sm leading-relaxed">
      <header className="text-center mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.hero.name}</h1>
        <h2 className="text-xl text-gray-600 mb-4">{data.hero.title}</h2>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <span>{data.contact.email}</span>
          <span>{data.contact.phone}</span>
          <span>{data.contact.location}</span>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          Professional Summary
        </h3>
        <p className="text-gray-700">{data.about.bio}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          Professional Experience
        </h3>
        {data.experience.items.map((job) => (
          <div key={job.id} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold text-gray-900">{job.title}</h4>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <span className="text-gray-600 text-sm">{job.duration}</span>
            </div>
            <p className="text-gray-700 mb-2">{job.description}</p>
            <p className="text-gray-600 text-sm">
              <strong>Technologies:</strong> {job.technologies.join(', ')}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          Education
        </h3>
        {data.education.items.map((edu) => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.school}</p>
                {edu.description && <p className="text-gray-600 text-sm">{edu.description}</p>}
              </div>
              <span className="text-gray-600 text-sm">{edu.duration}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          Technical Skills
        </h3>
        {data.skills.categories.map((category) => (
          <div key={category.id} className="mb-2">
            <span className="font-semibold text-gray-900">{category.name}:</span>
            <span className="text-gray-700 ml-2">{category.skills.join(', ')}</span>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
          Notable Projects
        </h3>
        {data.projects.items.slice(0, 3).map((project) => (
          <div key={project.id} className="mb-3">
            <h4 className="font-semibold text-gray-900">{project.title}</h4>
            <p className="text-gray-700 text-sm mb-1">{project.description}</p>
            <p className="text-gray-600 text-sm">
              <strong>Technologies:</strong> {project.technologies.join(', ')}
            </p>
          </div>
        ))}
      </section>
    </div>
  );

  return (
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
        onUpdateData={updateData}
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
