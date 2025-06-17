import { Card, CardContent } from '@/components/ui/card';
import { PortfolioData } from '@/types/portfolio';
import { Calendar } from 'lucide-react';

interface EducationSectionProps {
  data: PortfolioData['education'];
}

export default function EducationSection({ data }: EducationSectionProps) {
  return (
    <section id="education" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Education</h2>
          
          <div className="space-y-6">
            {data.items.map((edu) => (
              <Card key={edu.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{edu.degree}</h3>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-lg text-primary">{edu.school}</p>
                      <div className="text-slate-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {edu.duration}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-slate-600 mt-1">{edu.description}</p>
                    )}
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