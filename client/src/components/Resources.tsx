import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Users, Calendar, MapPin } from "lucide-react";

export default function Resources() {
  const resourceCategories = [
    {
      title: "Protection Guide",
      description: "Essential steps to protect yourself from AI scams and fraudulent activities.",
      icon: Shield,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Detection Tools",
      description: "Online tools and software to help identify AI-generated content.",
      icon: Eye,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Community Support",
      description: "Connect with others, share experiences, and get help from the community.",
      icon: Users,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const caseStudies = [
    {
      title: "The Voice Clone Romance Scam",
      description: "How scammers used voice cloning technology to impersonate a woman's boyfriend and request emergency money transfers.",
      date: "March 2024",
      location: "California, USA",
      borderColor: "border-orange-400",
    },
    {
      title: "Deepfake CEO Fraud",
      description: "A company lost $243,000 after employees were deceived by a deepfake video call from their 'CEO' requesting urgent fund transfers.",
      date: "February 2024",
      location: "London, UK",
      borderColor: "border-red-400",
    },
  ];

  return (
    <section id="resources" className="py-20 bg-background-light-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Safety Resources</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides, tips, and tools to help you stay protected from AI-powered scams.
          </p>
        </div>
        
        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {resourceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`${category.iconColor} text-xl`} />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4">
                    {category.description}
                  </CardDescription>
                  <Button className="w-full bg-primary-custom text-white text-sm hover:bg-blue-700 transition-colors">
                    {category.title === "Protection Guide" ? "View Guide" : 
                     category.title === "Detection Tools" ? "View Tools" : "Join Community"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Case Studies */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Real-World Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {caseStudies.map((study, index) => (
                <div key={index} className={`border-l-4 ${study.borderColor} pl-4`}>
                  <h4 className="font-semibold text-gray-900 mb-2">{study.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {study.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{study.date}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{study.location}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button className="bg-primary-custom text-white hover:bg-blue-700 transition-colors">
                View All Case Studies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
