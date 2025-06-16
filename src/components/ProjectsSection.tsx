import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface ProjectsSectionProps {
  data: PortfolioData['projects'];
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((project) => (
              <Card key={project.id} className="shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  
                  <p className="text-slate-700 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 p-0"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <Button
                        variant="link"
                        className="text-slate-600 hover:text-slate-800 p-0"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
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
