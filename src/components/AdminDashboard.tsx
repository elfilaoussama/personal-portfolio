import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Lock, Download, Upload, FileText, Key, Save, Eye } from 'lucide-react';
import { PortfolioData, SkillCategory, Experience, Project, Education } from '@/types/portfolio';
import { useToast } from '@/hooks/use-toast';
import { hashCode, verifyCode } from '@/utils/hash';
import { storage } from '@/utils/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onUpdateData: (data: PortfolioData) => void;
  onGenerateCV: () => void;
}

export default function AdminDashboard({ 
  isOpen, 
  onClose, 
  data, 
  onUpdateData,
  onGenerateCV 
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [editData, setEditData] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setEditData(data);
    setHasUnsavedChanges(false);
  }, [data]);

  useEffect(() => {
    const hasChanges = JSON.stringify(editData) !== JSON.stringify(data);
    setHasUnsavedChanges(hasChanges);
  }, [editData, data]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const timeoutId = setTimeout(async () => {
        try {
          await onUpdateData(editData);
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [editData, autoSave, hasUnsavedChanges, onUpdateData]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
      const storedHash = data.adminHash;
    
    if (!storedHash) {
      // First time setup
      const hash = await hashCode(adminCode);
      await onUpdateData({ ...data, adminHash: hash });
      setIsAuthenticated(true);
      toast('Admin code set successfully!');
    } else {
      // Verify existing code
          const isValid = await verifyCode(adminCode, storedHash);
      if (isValid) {
        setIsAuthenticated(true);
        toast('Access granted!');
      } else {
        toast('Invalid admin code!', { variant: 'destructive' });
      }
    }
    
    setAdminCode('');
  };

  const handleSave = async () => {
    try {
      await onUpdateData(editData);
      toast('Changes saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast('Failed to save changes', { variant: 'destructive' });
    }
  };

  const handlePreview = () => {
    if (hasUnsavedChanges) {
      onUpdateData(editData);
    }
    setIsAuthenticated(false);
    onClose();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(editData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast('Data exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        setEditData(importedData);
        toast('Data imported successfully!');
      } catch (error) {
        toast('Invalid JSON file', { variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof PortfolioData],
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (section: string, index: number, field: string, value: any) => {
    setEditData(prev => {
      const sectionData = prev[section as keyof PortfolioData] as any;
      const items = [...sectionData.items];
      items[index] = { ...items[index], [field]: value };
      return {
        ...prev,
        [section]: { ...sectionData, items }
      };
    });
  };

  const addItem = (section: string, newItem: any) => {
    setEditData(prev => {
      if (section === 'skills') {
        return {
          ...prev,
          skills: {
            categories: [...prev.skills.categories, { ...newItem, id: Date.now().toString() }]
          }
        };
      }
      
      const sectionData = prev[section as keyof PortfolioData] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          items: [...sectionData.items, { ...newItem, id: Date.now().toString() }]
        }
      };
    });
  };

  const removeItem = (section: string, id: string) => {
    setEditData(prev => {
      if (section === 'skills') {
        return {
          ...prev,
          skills: {
            categories: prev.skills.categories.filter(cat => cat.id !== id)
          }
        };
      }
      
      const sectionData = prev[section as keyof PortfolioData] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          items: sectionData.items.filter((item: any) => item.id !== id)
        }
      };
    });
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setAdminCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-slate-900 text-white p-6 -m-6 mb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Portfolio Admin Dashboard</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <Lock className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Admin Access Required</h3>
              <p className="text-slate-600 mb-6">
                {data.adminHash ? 'Enter your admin code to access the dashboard' : 'Set your admin code to secure the dashboard'}
              </p>
              <form onSubmit={handleAuth} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Admin Code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  {data.adminHash ? 'Access Dashboard' : 'Set Admin Code'}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
                <TabsContent value="hero" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editData.hero.name}
                          onChange={(e) => handleFieldChange('hero', 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={editData.hero.title}
                          onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="intro">Introduction</Label>
                        <Textarea
                          id="intro"
                          value={editData.hero.intro}
                          onChange={(e) => handleFieldChange('hero', 'intro', e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profileImage">Profile Image URL</Label>
                        <Input
                          id="profileImage"
                          value={editData.hero.profileImage || ''}
                          onChange={(e) => handleFieldChange('hero', 'profileImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-slate-500 mt-1">Use a direct image URL (jpg, png, webp)</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea
                          id="bio"
                          value={editData.about.bio}
                          onChange={(e) => handleFieldChange('about', 'bio', e.target.value)}
                          rows={6}
                        />
                      </div>
                      <div>
                        <Label htmlFor="interests">Interests (comma-separated)</Label>
                        <Input
                          id="interests"
                          value={editData.about.interests.join(', ')}
                          onChange={(e) => handleFieldChange('about', 'interests', e.target.value.split(', ').filter(Boolean))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editData.contact.email}
                          onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editData.contact.phone}
                          onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editData.contact.location}
                          onChange={(e) => handleFieldChange('contact', 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={editData.contact.linkedin}
                          onChange={(e) => handleFieldChange('contact', 'linkedin', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {editData.skills.categories.map((category, index) => (
                        <Card key={category.id}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Category {index + 1}</h4>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeItem('skills', category.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div>
                                <Label>Category Name</Label>
                                <Input
                                  value={category.name}
                                  onChange={(e) => {
                                    const updatedCategories = [...editData.skills.categories];
                                    updatedCategories[index] = { ...category, name: e.target.value };
                                    setEditData(prev => ({
                                      ...prev,
                                      skills: { categories: updatedCategories }
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Icon Class</Label>
                                <Input
                                  value={category.icon}
                                  onChange={(e) => {
                                    const updatedCategories = [...editData.skills.categories];
                                    updatedCategories[index] = { ...category, icon: e.target.value };
                                    setEditData(prev => ({
                                      ...prev,
                                      skills: { categories: updatedCategories }
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Skills (comma-separated)</Label>
                                <Input
                                  value={category.skills.join(', ')}
                                  onChange={(e) => {
                                    const updatedCategories = [...editData.skills.categories];
                                    updatedCategories[index] = { ...category, skills: e.target.value.split(', ').filter(Boolean) };
                                    setEditData(prev => ({
                                      ...prev,
                                      skills: { categories: updatedCategories }
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button 
                        onClick={() => addItem('skills', {
                          name: 'New Category',
                          icon: 'fas fa-code',
                          skills: []
                        })}
                        variant="outline"
                        className="w-full"
                      >
                        Add Skill Category
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Experience Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {editData.experience.items.map((job, index) => (
                        <Card key={job.id}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Experience {index + 1}</h4>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeItem('experience', job.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div>
                                <Label>Job Title</Label>
                                <Input
                                  value={job.title}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Company</Label>
                                <Input
                                  value={job.company}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <Input
                                  value={job.duration}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'duration', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={job.description}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label>Technologies (comma-separated)</Label>
                                <Input
                                  value={job.technologies.join(', ')}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'technologies', e.target.value.split(', ').filter(Boolean))}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button 
                        onClick={() => addItem('experience', {
                          title: 'Job Title',
                          company: 'Company Name',
                          duration: '2023 - Present',
                          description: 'Job description...',
                          technologies: []
                        })}
                        variant="outline"
                        className="w-full"
                      >
                        Add Experience
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projects Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {editData.projects.items.map((project, index) => (
                        <Card key={project.id}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Project {index + 1}</h4>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeItem('projects', project.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div>
                                <Label>Project Title</Label>
                                <Input
                                  value={project.title}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={project.description}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label>Technologies (comma-separated)</Label>
                                <Input
                                  value={project.technologies.join(', ')}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value.split(', ').filter(Boolean))}
                                />
                              </div>
                              <div>
                                <Label>Live URL</Label>
                                <Input
                                  value={project.liveUrl || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'liveUrl', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>GitHub URL</Label>
                                <Input
                                  value={project.githubUrl || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'githubUrl', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Image URL</Label>
                                <Input
                                  value={project.imageUrl || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'imageUrl', e.target.value)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button 
                        onClick={() => addItem('projects', {
                          title: 'Project Title',
                          description: 'Project description...',
                          technologies: [],
                          liveUrl: '',
                          githubUrl: '',
                          imageUrl: ''
                        })}
                        variant="outline"
                        className="w-full"
                      >
                        Add Project
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {editData.education.items.map((edu, index) => (
                        <Card key={edu.id}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Education {index + 1}</h4>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeItem('education', edu.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div>
                                <Label>Degree</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>School</Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'school', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <Input
                                  value={edu.duration}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'duration', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Input
                                  value={edu.description || ''}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button 
                        onClick={() => addItem('education', {
                          degree: 'Degree Name',
                          school: 'School Name',
                          duration: '2019 - 2023',
                          description: ''
                        })}
                        variant="outline"
                        className="w-full"
                      >
                        Add Education
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 max-h-96 overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-save">Auto-save changes</Label>
                          <p className="text-sm text-slate-600">Automatically save changes after 2 seconds of inactivity</p>
                        </div>
                        <Button
                          variant={autoSave ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAutoSave(!autoSave)}
                        >
                          {autoSave ? "ON" : "OFF"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button onClick={handleExport} variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <label>
                            <Upload className="w-4 h-4 mr-2" />
                            Import Data
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImport}
                              className="hidden"
                            />
                          </label>
                        </Button>
                        <Button onClick={onGenerateCV} variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate CV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Change Admin Code</Label>
                          <p className="text-sm text-slate-600 mb-2">Update your admin access code</p>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              const newCode = prompt('Enter new admin code:');
                              if (newCode) {
                                hashCode(newCode).then(async hash => {
                                  await onUpdateData({ ...data, adminHash: hash });
                                  toast('Admin code updated successfully!');
                                });
                              }
                            }}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Change Code
                          </Button>
                        </div>
                        <div>
                          <Button 
                            variant="destructive" 
                            onClick={() => {
                              if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                                storage.clearData();
                                toast('All data cleared successfully!');
                                setIsAuthenticated(false);
                                onClose();
                              }
                            }}
                          >
                            Clear All Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>

            <div className="border-t bg-slate-50 p-4 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {autoSave ? (
                  hasUnsavedChanges ? (
                    <span className="text-[#0f162b] font-medium">🔄 Auto-saving...</span>
                  ) : (
                    <span className="text-green-600">✓ Auto-saved</span>
                  )
                ) : hasUnsavedChanges ? (
                  <span className="text-orange-600 font-medium">● Unsaved changes</span>
                ) : (
                  <span className="text-green-600">✓ All changes saved</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Apply & Preview
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || autoSave}
                  className={hasUnsavedChanges && !autoSave ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {autoSave ? 'Auto-Save ON' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
