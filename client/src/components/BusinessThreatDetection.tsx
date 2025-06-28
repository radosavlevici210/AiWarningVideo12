import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Shield, Building, User, Calendar, ChevronRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessThreat } from "@shared/schema";

export default function BusinessThreatDetection() {
  const [selectedThreat, setSelectedThreat] = useState<BusinessThreat | null>(null);
  const { toast } = useToast();

  const { data: threats, isLoading } = useQuery<BusinessThreat[]>({
    queryKey: ["/api/business-threats"],
  });

  const updateThreatMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<BusinessThreat> }) => {
      return apiRequest("PATCH", `/api/business-threats/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-threats"] });
      toast({
        title: "Threat updated",
        description: "Business threat status has been updated successfully.",
      });
    },
  });

  const getImpactLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case "ceo-impersonation": return <User className="h-5 w-5" />;
      case "employee-impersonation": return <User className="h-5 w-5" />;
      case "ip-theft": return <Shield className="h-5 w-5" />;
      case "data-breach": return <AlertTriangle className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const handleStatusUpdate = (threat: BusinessThreat, newStatus: string) => {
    updateThreatMutation.mutate({
      id: threat.id,
      updates: { status: newStatus }
    });
  };

  if (isLoading) {
    return (
      <section id="business-threats" className="py-20 bg-background-light-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="business-threats" className="py-20 bg-background-light-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Business Threat Detection</h2>
          <p className="text-xl text-gray-600">
            Advanced monitoring and protection against AI-powered business threats including CEO impersonation and corporate espionage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threat List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Threats</h3>
            {threats?.map((threat) => (
              <Card 
                key={threat.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedThreat?.id === threat.id ? 'ring-2 ring-primary-custom' : ''
                }`}
                onClick={() => setSelectedThreat(threat)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getThreatTypeIcon(threat.threatType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{threat.companyName}</h4>
                        <p className="text-sm text-gray-600">{threat.targetedExecutive || 'Multiple targets'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getImpactLevelColor(threat.impactLevel)}>
                        {threat.impactLevel.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(threat.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {threat.threatDescription}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {threat.detectionMethod.replace('-', ' ').toUpperCase()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!threats || threats.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Threats</h3>
                  <p className="text-gray-600">Your business is currently protected from known AI threats.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Threat Details */}
          <div>
            {selectedThreat ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getThreatTypeIcon(selectedThreat.threatType)}
                    <span>Threat Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Company Information</h4>
                    <p className="text-gray-700"><strong>Company:</strong> {selectedThreat.companyName}</p>
                    <p className="text-gray-700"><strong>Target:</strong> {selectedThreat.targetedExecutive || 'Multiple targets'}</p>
                    <p className="text-gray-700"><strong>Reported by:</strong> {selectedThreat.reportedBy || 'Anonymous'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Threat Analysis</h4>
                    <p className="text-gray-700 mb-3">{selectedThreat.threatDescription}</p>
                    <div className="flex items-center space-x-4">
                      <Badge className={getImpactLevelColor(selectedThreat.impactLevel)}>
                        {selectedThreat.impactLevel.toUpperCase()} IMPACT
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Detected via {selectedThreat.detectionMethod.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {selectedThreat.mitigationSteps && Array.isArray(selectedThreat.mitigationSteps) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mitigation Steps</h4>
                      <ul className="space-y-2">
                        {selectedThreat.mitigationSteps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary-custom rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant={selectedThreat.status === "active" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedThreat, "active")}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Active
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedThreat.status === "mitigated" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedThreat, "mitigated")}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Mitigated
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedThreat.status === "resolved" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedThreat, "resolved")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Resolved
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Threat</h3>
                  <p className="text-gray-600">Click on a threat from the list to view detailed information and mitigation options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}