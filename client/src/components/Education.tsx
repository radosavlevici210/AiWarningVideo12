import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Mic, MessageSquare, Check } from "lucide-react";
import type { EducationalContent } from "@shared/schema";

const iconMap = {
  "fas fa-robot": Bot,
  "fas fa-microphone": Mic,
  "fas fa-comment-dots": MessageSquare,
};

export default function Education() {
  const { data: content, isLoading } = useQuery<EducationalContent[]>({
    queryKey: ["/api/educational-content"],
  });

  if (isLoading) {
    return (
      <section id="learn" className="py-20 bg-surface-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="learn" className="py-20 bg-surface-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Understanding AI Threats</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Knowledge is your best defense. Learn about different types of AI-powered scams and how to spot them.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content?.map((module) => {
            const IconComponent = iconMap[module.iconClass as keyof typeof iconMap] || Bot;
            const bgColor = module.category === "deepfake" ? "bg-blue-100" : 
                           module.category === "voice-clone" ? "bg-orange-100" : "bg-purple-100";
            const iconColor = module.category === "deepfake" ? "text-blue-600" : 
                             module.category === "voice-clone" ? "text-orange-600" : "text-purple-600";
            
            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`${iconColor} text-2xl`} />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {module.description}
                  </CardDescription>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    {(module.keyPoints as string[]).map((point, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="text-success-custom text-sm mr-2 mt-1 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-primary-custom text-white hover:bg-blue-700 transition-colors">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
