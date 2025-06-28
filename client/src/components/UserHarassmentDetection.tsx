import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserX, Heart, Scale, Shield, ExternalLink, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserHarassmentDetection } from "@shared/schema";

export default function UserHarassmentDetection() {
  const [selectedCase, setSelectedCase] = useState<UserHarassmentDetection | null>(null);
  const { toast } = useToast();

  const { data: cases, isLoading } = useQuery<UserHarassmentDetection[]>({
    queryKey: ["/api/harassment-cases"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/harassment-cases/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harassment-cases"] });
      toast({
        title: "Status updated",
        description: "Harassment case status has been updated successfully.",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHarassmentTypeIcon = (type: string) => {
    switch (type) {
      case "deepfake-harassment": return <UserX className="h-5 w-5" />;
      case "ai-impersonation": return <UserX className="h-5 w-5" />;
      case "voice-cloning": return <UserX className="h-5 w-5" />;
      case "automated-stalking": return <UserX className="h-5 w-5" />;
      default: return <UserX className="h-5 w-5" />;
    }
  };

  const getLegalStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "legal-action": return "bg-blue-100 text-blue-800";
      case "investigating": return "bg-yellow-100 text-yellow-800";
      case "reported": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = (harassmentCase: UserHarassmentDetection, newStatus: string) => {
    updateStatusMutation.mutate({
      id: harassmentCase.id,
      status: newStatus
    });
  };

  if (isLoading) {
    return (
      <section id="harassment-detection" className="py-20 bg-pink-50">
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
    <section id="harassment-detection" className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Harassment Detection</h2>
          <p className="text-xl text-gray-600">
            Comprehensive detection and response system for AI-generated harassment, stalking, and malicious impersonation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cases List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Harassment Cases</h3>
            {cases?.map((harassmentCase) => (
              <Card 
                key={harassmentCase.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCase?.id === harassmentCase.id ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => setSelectedCase(harassmentCase)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-pink-600">
                        {getHarassmentTypeIcon(harassmentCase.harassmentType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {harassmentCase.harassmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">Victim: {harassmentCase.victimIdentifier}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getSeverityColor(harassmentCase.severityLevel)}>
                        {harassmentCase.severityLevel.toUpperCase()}
                      </Badge>
                      <Badge className={getLegalStatusColor(harassmentCase.legalStatus)}>
                        {harassmentCase.legalStatus.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {harassmentCase.harassmentContent}
                  </p>
                  
                  {harassmentCase.perpetratorInfo && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Perpetrator:</strong> {harassmentCase.perpetratorInfo}
                      </p>
                    </div>
                  )}
                  
                  {harassmentCase.platformsAffected && Array.isArray(harassmentCase.platformsAffected) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {harassmentCase.platformsAffected.slice(0, 3).map((platform: string, index: number) => (
                        <span key={index} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                      {harassmentCase.platformsAffected.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{harassmentCase.platformsAffected.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(harassmentCase.detectedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs text-gray-600">
                      Source: {harassmentCase.reportingSource?.replace('-', ' ') || 'Unknown'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!cases || cases.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Cases</h3>
                  <p className="text-gray-600">No harassment cases are currently being monitored.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Case Details */}
          <div>
            {selectedCase ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getHarassmentTypeIcon(selectedCase.harassmentType)}
                    <span>Case Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Case Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {selectedCase.harassmentType.replace('-', ' ')}</p>
                      <p><strong>Victim:</strong> {selectedCase.victimIdentifier}</p>
                      <p><strong>Perpetrator:</strong> {selectedCase.perpetratorInfo || 'Unknown'}</p>
                      <p><strong>Reporting Source:</strong> {selectedCase.reportingSource?.replace('-', ' ') || 'Unknown'}</p>
                      <p><strong>Detected:</strong> {new Date(selectedCase.detectedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Severity Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Severity Level</span>
                        <Badge className={getSeverityColor(selectedCase.severityLevel)}>
                          {selectedCase.severityLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Legal Status</span>
                        <Badge className={getLegalStatusColor(selectedCase.legalStatus)}>
                          {selectedCase.legalStatus.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Harassment Content</h4>
                    <p className="text-gray-700 bg-pink-50 p-3 rounded-lg text-sm">
                      {selectedCase.harassmentContent}
                    </p>
                  </div>
                  
                  {selectedCase.psychologicalImpact && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Psychological Impact</h4>
                      <p className="text-gray-700 bg-orange-50 p-3 rounded-lg text-sm">
                        {selectedCase.psychologicalImpact}
                      </p>
                    </div>
                  )}
                  
                  {selectedCase.aiToolsUsed && Array.isArray(selectedCase.aiToolsUsed) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">AI Tools Used</h4>
                      <ul className="space-y-2">
                        {selectedCase.aiToolsUsed.map((tool: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{tool}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedCase.platformsAffected && Array.isArray(selectedCase.platformsAffected) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Affected Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.platformsAffected.map((platform: string, index: number) => (
                          <span key={index} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCase.evidenceLinks && Array.isArray(selectedCase.evidenceLinks) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Evidence Links</h4>
                      <ul className="space-y-2">
                        {selectedCase.evidenceLinks.map((link: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ExternalLink className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedCase.actionsTaken && Array.isArray(selectedCase.actionsTaken) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions Taken</h4>
                      <ul className="space-y-2">
                        {selectedCase.actionsTaken.map((action: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedCase.blockchainEvidence && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Blockchain Evidence</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">Immutable evidence stored on blockchain</p>
                        <code className="text-xs bg-white px-2 py-1 rounded border block break-all">
                          {selectedCase.blockchainEvidence}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Legal Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        variant={selectedCase.legalStatus === "reported" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedCase, "reported")}
                        className="bg-gray-600 text-white hover:bg-gray-700"
                      >
                        Reported
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedCase.legalStatus === "investigating" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedCase, "investigating")}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Investigating
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedCase.legalStatus === "legal-action" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedCase, "legal-action")}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Legal Action
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedCase.legalStatus === "resolved" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedCase, "resolved")}
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
                  <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Harassment Case</h3>
                  <p className="text-gray-600">Click on a case from the list to view detailed analysis and response options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}