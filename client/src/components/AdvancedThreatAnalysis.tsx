import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Globe, TrendingUp, Shield, AlertTriangle, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AdvancedThreatAnalysis } from "@shared/schema";

export default function AdvancedThreatAnalysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AdvancedThreatAnalysis | null>(null);
  const { toast } = useToast();

  const { data: analyses, isLoading } = useQuery<AdvancedThreatAnalysis[]>({
    queryKey: ["/api/threat-analyses"],
  });

  const updateConfidenceMutation = useMutation({
    mutationFn: async ({ id, confidence }: { id: number; confidence: number }) => {
      return apiRequest("PATCH", `/api/threat-analyses/${id}/confidence`, { confidence });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/threat-analyses"] });
      toast({
        title: "Confidence updated",
        description: "Threat analysis confidence level has been updated successfully.",
      });
    },
  });

  const getSophisticationColor = (level: string) => {
    switch (level) {
      case "basic": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBusinessImpactColor = (impact: string) => {
    switch (impact) {
      case "minimal": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "major": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getThreatCategoryIcon = (category: string) => {
    switch (category) {
      case "api-theft": return <Target className="h-5 w-5" />;
      case "user-harassment": return <AlertTriangle className="h-5 w-5" />;
      case "business-threats": return <TrendingUp className="h-5 w-5" />;
      case "ip-theft": return <Shield className="h-5 w-5" />;
      case "ai-manipulation": return <Brain className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    if (confidence >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const formatRecoveryTime = (hours: number | null) => {
    if (hours === null) return "Unknown";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const handleConfidenceUpdate = (analysis: AdvancedThreatAnalysis, newConfidence: number) => {
    updateConfidenceMutation.mutate({
      id: analysis.id,
      confidence: newConfidence
    });
  };

  if (isLoading) {
    return (
      <section id="threat-analysis" className="py-20 bg-gray-50">
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
    <section id="threat-analysis" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced Threat Analysis</h2>
          <p className="text-xl text-gray-600">
            AI-powered analysis of sophisticated threats with predictive modeling and strategic mitigation recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Threat Analyses</h3>
            {analyses?.map((analysis) => (
              <Card 
                key={analysis.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAnalysis?.id === analysis.id ? 'ring-2 ring-gray-500' : ''
                }`}
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getThreatCategoryIcon(analysis.threatCategory)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {analysis.threatCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">{analysis.analysisMethod}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getSophisticationColor(analysis.sophisticationLevel)}>
                        {analysis.sophisticationLevel.toUpperCase()}
                      </Badge>
                      <Badge className={getBusinessImpactColor(analysis.businessImpact)}>
                        {analysis.businessImpact.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Analysis Confidence</span>
                      <span className={`font-bold ${getConfidenceColor(analysis.analysisConfidence)}`}>
                        {analysis.analysisConfidence}%
                      </span>
                    </div>
                    <Progress 
                      value={analysis.analysisConfidence} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <strong>Vector:</strong> {analysis.threatVector}
                    </p>
                    {analysis.geolocation && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Globe className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{analysis.geolocation}</span>
                      </div>
                    )}
                  </div>
                  
                  {analysis.attributionConfidence !== null && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Attribution</span>
                        <span className="text-sm font-medium">{analysis.attributionConfidence}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(analysis.analyzedAt).toLocaleDateString()}</span>
                    </div>
                    {analysis.recoveryTimeEstimate && (
                      <span className="text-xs text-gray-600">
                        Recovery: {formatRecoveryTime(analysis.recoveryTimeEstimate)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!analyses || analyses.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Threat Analyses</h3>
                  <p className="text-gray-600">No advanced threat analyses have been conducted yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Analysis Details */}
          <div>
            {selectedAnalysis ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getThreatCategoryIcon(selectedAnalysis.threatCategory)}
                    <span>Threat Intelligence Report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Threat Overview</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Category:</strong> {selectedAnalysis.threatCategory.replace('-', ' ')}</p>
                      <p><strong>Vector:</strong> {selectedAnalysis.threatVector}</p>
                      <p><strong>Analysis Method:</strong> {selectedAnalysis.analysisMethod}</p>
                      <p><strong>Analyzed:</strong> {new Date(selectedAnalysis.analyzedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sophistication Level</span>
                        <Badge className={getSophisticationColor(selectedAnalysis.sophisticationLevel)}>
                          {selectedAnalysis.sophisticationLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Impact</span>
                        <Badge className={getBusinessImpactColor(selectedAnalysis.businessImpact)}>
                          {selectedAnalysis.businessImpact.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Analysis Confidence</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getConfidenceColor(selectedAnalysis.analysisConfidence)}`}>
                            {selectedAnalysis.analysisConfidence}%
                          </span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={selectedAnalysis.analysisConfidence} 
                        className="h-3"
                      />
                    </div>
                  </div>
                  
                  {selectedAnalysis.geolocation && selectedAnalysis.attributionConfidence !== null && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Attribution Analysis</h4>
                      <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800">
                            <strong>Location:</strong> {selectedAnalysis.geolocation}
                          </span>
                        </div>
                        <div className="text-sm text-blue-800">
                          <strong>Attribution Confidence:</strong> {selectedAnalysis.attributionConfidence}%
                        </div>
                        <Progress 
                          value={selectedAnalysis.attributionConfidence} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedAnalysis.attackPattern && Array.isArray(selectedAnalysis.attackPattern) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Attack Pattern</h4>
                      <ol className="space-y-2">
                        {selectedAnalysis.attackPattern.map((step: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="flex items-center justify-center w-5 h-5 text-xs bg-gray-200 text-gray-700 rounded-full flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  {selectedAnalysis.targetedAssets && Array.isArray(selectedAnalysis.targetedAssets) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Targeted Assets</h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.targetedAssets.map((asset: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Target className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{asset}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedAnalysis.predictiveIndicators && Array.isArray(selectedAnalysis.predictiveIndicators) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Predictive Indicators</h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.predictiveIndicators.map((indicator: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <TrendingUp className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedAnalysis.mitigationStrategies && Array.isArray(selectedAnalysis.mitigationStrategies) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mitigation Strategies</h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.mitigationStrategies.map((strategy: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedAnalysis.recoveryTimeEstimate && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recovery Estimation</h4>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-yellow-800">
                            <strong>Estimated Recovery Time:</strong> {formatRecoveryTime(selectedAnalysis.recoveryTimeEstimate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedAnalysis.threatIntelligence && Array.isArray(selectedAnalysis.threatIntelligence) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Threat Intelligence</h4>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {selectedAnalysis.threatIntelligence.map((intel: string, index: number) => (
                            <li key={index} className="text-sm text-purple-800">• {intel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Confidence Level</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfidenceUpdate(selectedAnalysis, 50)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Low (50%)
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfidenceUpdate(selectedAnalysis, 70)}
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                      >
                        Medium (70%)
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfidenceUpdate(selectedAnalysis, 85)}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        High (85%)
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfidenceUpdate(selectedAnalysis, 95)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Very High (95%)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Threat Analysis</h3>
                  <p className="text-gray-600">Click on an analysis from the list to view detailed threat intelligence and recommendations.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}