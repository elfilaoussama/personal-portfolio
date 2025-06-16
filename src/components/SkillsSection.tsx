import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PortfolioData } from '@/types/portfolio';

interface SkillsSectionProps {
  data: PortfolioData['skills'];
}

export default function SkillsSection({ data }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {data.categories.map((category) => (
              <Card key={category.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <i className={`${category.icon} text-4xl text-primary mb-4`}></i>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-100">
                        {skill}
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
