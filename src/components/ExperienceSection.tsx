import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface ExperienceSectionProps {
  data: PortfolioData['experience'];
}

export default function ExperienceSection({ data }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>
          
          <div className="space-y-8">
            {data.items.map((job) => (
              <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-lg text-primary">{job.company}</p>
                    </div>
                    <div className="text-slate-600 flex items-center mt-2 md:mt-0">
                      <Calendar className="w-4 h-4 mr-2" />
                      {job.duration}
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, index) => (
                      <Badge key={index} className="bg-primary/10 text-primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
