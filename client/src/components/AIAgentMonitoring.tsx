import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, AlertTriangle, Shield, Eye, Activity, Zap } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AiAgentMonitoring } from "@shared/schema";

export default function AIAgentMonitoring() {
  const [selectedAgent, setSelectedAgent] = useState<AiAgentMonitoring | null>(null);
  const { toast } = useToast();

  const { data: agents, isLoading } = useQuery<AiAgentMonitoring[]>({
    queryKey: ["/api/ai-agents"],
  });

  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<AiAgentMonitoring> }) => {
      return apiRequest("PATCH", `/api/ai-agents/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-agents"] });
      toast({
        title: "Agent status updated",
        description: "AI agent monitoring status has been updated successfully.",
      });
    },
  });

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case "assistant": return <Bot className="h-5 w-5" />;
      case "chatbot": return <Bot className="h-5 w-5" />;
      case "api": return <Zap className="h-5 w-5" />;
      case "model": return <Activity className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const getImpactLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      case "none": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTruthScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const handleStatusUpdate = (agent: AiAgentMonitoring, newStatus: string) => {
    updateAgentMutation.mutate({
      id: agent.id,
      updates: { monitoringStatus: newStatus }
    });
  };

  if (isLoading) {
    return (
      <section id="ai-monitoring" className="py-20 bg-background-light-custom">
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
    <section id="ai-monitoring" className="py-20 bg-background-light-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Agent Monitoring</h2>
          <p className="text-xl text-gray-600">
            Real-time monitoring of AI agents to detect suspicious behavior, data manipulation, and truth degradation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monitored Agents</h3>
            {agents?.map((agent) => (
              <Card 
                key={agent.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAgent?.id === agent.id ? 'ring-2 ring-primary-custom' : ''
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">
                        {getAgentTypeIcon(agent.agentType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{agent.agentIdentifier}</h4>
                        <p className="text-sm text-gray-600 capitalize">{agent.agentType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getImpactLevelColor(agent.userImpactLevel)}>
                        {agent.userImpactLevel.toUpperCase()}
                      </Badge>
                      <div className={`text-xs font-medium ${getTruthScoreColor(agent.truthScore)}`}>
                        Truth: {agent.truthScore || 'N/A'}%
                      </div>
                    </div>
                  </div>
                  
                  {agent.truthScore !== null && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Truth Reliability</span>
                        <span className={getTruthScoreColor(agent.truthScore)}>
                          {agent.truthScore}%
                        </span>
                      </div>
                      <Progress 
                        value={agent.truthScore} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {agent.suspiciousActivity}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      agent.monitoringStatus === 'active' ? 'bg-red-100 text-red-800' :
                      agent.monitoringStatus === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {agent.monitoringStatus.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(agent.detectedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!agents || agents.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Under Monitoring</h3>
                  <p className="text-gray-600">All AI agents are operating normally with no suspicious activity detected.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Agent Details */}
          <div>
            {selectedAgent ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getAgentTypeIcon(selectedAgent.agentType)}
                    <span>Agent Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Agent Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Identifier:</strong> {selectedAgent.agentIdentifier}</p>
                      <p><strong>Type:</strong> {selectedAgent.agentType}</p>
                      <p><strong>First Detected:</strong> {new Date(selectedAgent.detectedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Threat Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Impact Level</span>
                        <Badge className={getImpactLevelColor(selectedAgent.userImpactLevel)}>
                          {selectedAgent.userImpactLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {selectedAgent.truthScore !== null && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Truth Reliability Score</span>
                            <span className={`font-medium ${getTruthScoreColor(selectedAgent.truthScore)}`}>
                              {selectedAgent.truthScore}%
                            </span>
                          </div>
                          <Progress value={selectedAgent.truthScore} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">
                            {selectedAgent.truthScore >= 80 ? "High reliability" :
                             selectedAgent.truthScore >= 60 ? "Moderate reliability" :
                             selectedAgent.truthScore >= 40 ? "Low reliability" : "Very low reliability"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Suspicious Activity</h4>
                    <p className="text-gray-700 bg-red-50 p-3 rounded-lg text-sm">
                      {selectedAgent.suspiciousActivity}
                    </p>
                  </div>
                  
                  {selectedAgent.dataAccessPatterns && Array.isArray(selectedAgent.dataAccessPatterns) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Access Patterns</h4>
                      <ul className="space-y-1">
                        {selectedAgent.dataAccessPatterns.map((pattern: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedAgent.manipulationIndicators && Array.isArray(selectedAgent.manipulationIndicators) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Manipulation Indicators</h4>
                      <ul className="space-y-1">
                        {selectedAgent.manipulationIndicators.map((indicator: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedAgent.preventionMeasures && Array.isArray(selectedAgent.preventionMeasures) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Applied Countermeasures</h4>
                      <ul className="space-y-1">
                        {selectedAgent.preventionMeasures.map((measure: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{measure}</span>
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
                        variant={selectedAgent.monitoringStatus === "active" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedAgent, "active")}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Active
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedAgent.monitoringStatus === "investigating" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedAgent, "investigating")}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Investigating
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedAgent.monitoringStatus === "resolved" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedAgent, "resolved")}
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
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Agent</h3>
                  <p className="text-gray-600">Click on an agent from the list to view detailed monitoring information and threat analysis.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}