import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PortfolioData } from '@/types/portfolio';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

interface ContactSectionProps {
  contact: PortfolioData['contact'];
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Get In Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let's Work Together</h3>
              <p className="text-slate-700 mb-8 leading-relaxed">
                I'm always interested in hearing about new opportunities and exciting projects. 
                Whether you're a company looking to hire, or you're a fellow developer wanting to collaborate, 
                I'd love to hear from you.
              </p>
              
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
                  <Linkedin className="text-primary w-5 h-5 mr-3" />
                  <a href={`https://${contact.linkedin}`} className="text-[#2094F3] hover:underline">
                    {contact.linkedin}
                  </a>
                </div>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form 
  name="contact"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  className="space-y-6"
>
  {/* Netlify form-name hidden input */}
  <input type="hidden" name="form-name" value="contact" />
  {/* Honeypot field for bots */}
  <div style={{ display: 'none' }}>
    <label>
      Don’t fill this out if you’re human: <input name="bot-field" />
    </label>
  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
