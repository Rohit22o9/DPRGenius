import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Phone, MapPin, Award, Users, Target, Lightbulb } from 'lucide-react';

const teamMembers = [
  {
    name: "Dr. Priya Sharma",
    role: "Lead AI Architect",
    experience: "15+ years",
    education: "PhD Computer Science, IIT Delhi",
    specialization: "Quantum Computing & ML",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
    achievements: ["Published 40+ papers on AI", "Former Microsoft Research", "TEDx Speaker"]
  },
  {
    name: "Rajesh Kumar",
    role: "Senior Infrastructure Specialist",
    experience: "20+ years",
    education: "M.Tech Civil Engineering, IIT Bombay",
    specialization: "Large-scale Infrastructure Projects",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    achievements: ["Led 200+ Cr projects", "ASCE Fellow", "Government Advisor"]
  },
  {
    name: "Anita Patel",
    role: "Compliance & Risk Director",
    experience: "18+ years",
    education: "MBA Finance, XLRI + B.Tech",
    specialization: "Regulatory Compliance & Risk Management",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    achievements: ["Ex-SEBI Official", "Risk Management Expert", "Policy Consultant"]
  },
  {
    name: "Dr. Suresh Menon",
    role: "Environmental Impact Advisor",
    experience: "22+ years",
    education: "PhD Environmental Science, JNU",
    specialization: "Environmental Compliance & Sustainability",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    achievements: ["UN Environment Consultant", "Green Building Expert", "Author of 5 books"]
  }
];

const stats = [
  { label: "DPRs Analyzed", value: "5,000+", icon: Target },
  { label: "Success Rate", value: "98.5%", icon: Award },
  { label: "Time Saved", value: "75%", icon: Lightbulb },
  { label: "Government Bodies", value: "50+", icon: Users }
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen main-background">
      <div className="min-h-screen background-overlay py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation activeTab="about" onTabChange={() => {}} />

          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About MDoNER DPR Assessment System
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Revolutionizing infrastructure project evaluation with cutting-edge AI, quantum-inspired
                optimization, and multi-agent intelligence systems.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Target className="mr-3 text-primary" size={28} />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To transform how the Ministry of Development of North Eastern Region evaluates
                  Detailed Project Reports by leveraging advanced artificial intelligence, quantum-inspired
                  optimization algorithms, and comprehensive risk assessment frameworks to ensure optimal
                  resource allocation and project success.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Lightbulb className="mr-3 text-secondary" size={28} />
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the gold standard for AI-powered infrastructure project assessment, enabling
                  faster, more accurate, and more transparent decision-making processes that drive
                  sustainable development across Northeast India and serve as a model for emerging economies worldwide.
                </p>
              </Card>
            </div>

            {/* Key Statistics */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">Impact & Performance</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <stat.icon className="text-primary" size={28} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Technology Stack */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Advanced Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">AI & Machine Learning</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">Multi-Agent AI Systems</Badge>
                    <Badge variant="outline">Natural Language Processing</Badge>
                    <Badge variant="outline">Predictive Risk Modeling</Badge>
                    <Badge variant="outline">Computer Vision OCR</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary">Quantum Computing</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">Quantum-Inspired Optimization</Badge>
                    <Badge variant="outline">Superposition Risk Modeling</Badge>
                    <Badge variant="outline">Quantum Budget Allocation</Badge>
                    <Badge variant="outline">Interference Pattern Analysis</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-success">Infrastructure</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">Cloud-Native Architecture</Badge>
                    <Badge variant="outline">Real-time Processing</Badge>
                    <Badge variant="outline">Advanced Security</Badge>
                    <Badge variant="outline">Scalable Microservices</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Section */}
            <div>
              <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Expert Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.education}</p>
                    <Badge variant="secondary" className="mb-3">{member.experience}</Badge>
                    <div className="space-y-1">
                      {member.achievements.map((achievement, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {achievement}</p>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">support@mdoner-dpr.gov.in</p>
                    <p className="text-muted-foreground">admin@mdoner-dpr.gov.in</p>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+91-11-2301-5555</p>
                    <p className="text-muted-foreground">Toll Free: 1800-11-3030</p>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="text-success" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">Vigyan Bhawan Annexe</p>
                    <p className="text-muted-foreground">New Delhi - 110001</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button className="bg-primary hover:bg-primary/90">
                  <Mail className="mr-2" size={16} />
                  Contact Our Team
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}