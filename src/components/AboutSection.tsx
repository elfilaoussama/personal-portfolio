import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface AboutSectionProps {
  about: PortfolioData['about'];
  contact: PortfolioData['contact'];
}

export default function AboutSection({ about, contact }: AboutSectionProps) {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">My Story</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {about.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {about.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-primary w-5 h-5 mr-3" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-primary w-5 h-5 mr-3" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-primary w-5 h-5 mr-3" />
                    <span>{contact.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="text-primary w-5 h-5 mr-3" />
                    <a href={`https://${contact.linkedin}`} className="text-primary hover:underline">
                      {contact.linkedin}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
