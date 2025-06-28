import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Shield, AlertTriangle, Key, Database, ExternalLink } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ApiTheftMonitoring } from "@shared/schema";

export default function APITheftMonitoring() {
  const [selectedTheft, setSelectedTheft] = useState<ApiTheftMonitoring | null>(null);
  const { toast } = useToast();

  const { data: thefts, isLoading } = useQuery<ApiTheftMonitoring[]>({
    queryKey: ["/api/api-theft"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/api-theft/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-theft"] });
      toast({
        title: "Status updated",
        description: "API theft recovery status has been updated successfully.",
      });
    },
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "bg-red-100 text-red-800";
      case "severe": return "bg-orange-100 text-orange-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "minimal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTheftMethodIcon = (method: string) => {
    switch (method) {
      case "credential-theft": return <Key className="h-5 w-5" />;
      case "reverse-engineering": return <Database className="h-5 w-5" />;
      case "data-scraping": return <ExternalLink className="h-5 w-5" />;
      case "unauthorized-access": return <AlertTriangle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Unknown";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const handleStatusUpdate = (theft: ApiTheftMonitoring, newStatus: string) => {
    updateStatusMutation.mutate({
      id: theft.id,
      status: newStatus
    });
  };

  if (isLoading) {
    return (
      <section id="api-theft-monitoring" className="py-20 bg-red-50">
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
    <section id="api-theft-monitoring" className="py-20 bg-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">API Theft & Business Control</h2>
          <p className="text-xl text-gray-600">
            Advanced monitoring for API theft, unauthorized business AI usage, and financial impact assessment with blockchain tracing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theft List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detected API Thefts</h3>
            {thefts?.map((theft) => (
              <Card 
                key={theft.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTheft?.id === theft.id ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => setSelectedTheft(theft)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-red-600">
                        {getTheftMethodIcon(theft.theftMethod)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{theft.apiOwner}</h4>
                        <p className="text-sm text-gray-600">{theft.apiEndpoint}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getImpactColor(theft.impactAssessment)}>
                        {theft.impactAssessment.toUpperCase()}
                      </Badge>
                      {theft.financialLoss && (
                        <div className="text-xs text-red-600 font-medium">
                          {formatCurrency(theft.financialLoss)} lost
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Stolen by:</strong> {theft.stolenByEntity || 'Unknown entity'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Method:</strong> {theft.theftMethod.replace('-', ' ')}
                    </p>
                  </div>
                  
                  {theft.userDataCompromised && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-100 p-2 rounded mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">User Data Compromised</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      theft.recoveryStatus === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      theft.recoveryStatus === 'legal-action' ? 'bg-purple-100 text-purple-800' :
                      theft.recoveryStatus === 'recovered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {theft.recoveryStatus.replace('-', ' ').toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(theft.detectedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!thefts || thefts.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API Thefts Detected</h3>
                  <p className="text-gray-600">Your APIs and business systems are currently secure from known theft attempts.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Theft Details */}
          <div>
            {selectedTheft ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getTheftMethodIcon(selectedTheft.theftMethod)}
                    <span>Theft Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">API Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Owner:</strong> {selectedTheft.apiOwner}</p>
                      <p><strong>Endpoint:</strong> {selectedTheft.apiEndpoint}</p>
                      <p><strong>Theft Method:</strong> {selectedTheft.theftMethod.replace('-', ' ')}</p>
                      <p><strong>Detected:</strong> {new Date(selectedTheft.detectedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Impact Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Impact Level</span>
                        <Badge className={getImpactColor(selectedTheft.impactAssessment)}>
                          {selectedTheft.impactAssessment.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {selectedTheft.financialLoss && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Financial Loss</span>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            <span className="font-bold text-red-600">
                              {formatCurrency(selectedTheft.financialLoss)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Data</span>
                        <span className={`text-sm ${selectedTheft.userDataCompromised ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedTheft.userDataCompromised ? 'Compromised' : 'Secure'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Perpetrator Information</h4>
                    <p className="text-gray-700 bg-red-50 p-3 rounded-lg text-sm">
                      {selectedTheft.stolenByEntity || 'Unknown entity - investigation ongoing'}
                    </p>
                  </div>
                  
                  {selectedTheft.evidenceData && Array.isArray(selectedTheft.evidenceData) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Evidence Data</h4>
                      <ul className="space-y-2">
                        {selectedTheft.evidenceData.map((evidence: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedTheft.blockchainTraceId && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verification</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">Immutable evidence stored on blockchain</p>
                        <code className="text-xs bg-white px-2 py-1 rounded border block break-all">
                          {selectedTheft.blockchainTraceId}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Recovery Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        variant={selectedTheft.recoveryStatus === "investigating" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedTheft, "investigating")}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Investigating
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedTheft.recoveryStatus === "legal-action" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedTheft, "legal-action")}
                        className="bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Legal Action
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedTheft.recoveryStatus === "recovered" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedTheft, "recovered")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Recovered
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedTheft.recoveryStatus === "lost" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedTheft, "lost")}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Lost
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an API Theft</h3>
                  <p className="text-gray-600">Click on a theft case from the list to view detailed analysis and recovery options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}