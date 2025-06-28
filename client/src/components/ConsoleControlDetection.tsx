import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Terminal, Clock, Users, Shield, AlertTriangle, Lock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AiConsoleControl } from "@shared/schema";

export default function ConsoleControlDetection() {
  const [selectedControl, setSelectedControl] = useState<AiConsoleControl | null>(null);
  const { toast } = useToast();

  const { data: controls, isLoading } = useQuery<AiConsoleControl[]>({
    queryKey: ["/api/console-controls"],
  });

  const updateControlMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<AiConsoleControl> }) => {
      return apiRequest("PATCH", `/api/console-controls/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/console-controls"] });
      toast({
        title: "Control status updated",
        description: "Console control threat status has been updated successfully.",
      });
    },
  });

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConsoleTypeIcon = (type: string) => {
    switch (type) {
      case "admin": return <Shield className="h-5 w-5" />;
      case "developer": return <Terminal className="h-5 w-5" />;
      case "monitoring": return <AlertTriangle className="h-5 w-5" />;
      case "user": return <Users className="h-5 w-5" />;
      default: return <Lock className="h-5 w-5" />;
    }
  };

  const getPrivilegeLevelColor = (level: string) => {
    switch (level) {
      case "system": return "text-red-600";
      case "root": return "text-red-500";
      case "admin": return "text-orange-600";
      case "user": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return "Unknown";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleStatusUpdate = (control: AiConsoleControl, updates: Partial<AiConsoleControl>) => {
    updateControlMutation.mutate({
      id: control.id,
      updates
    });
  };

  if (isLoading) {
    return (
      <section id="console-control" className="py-20 bg-purple-50">
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
    <section id="console-control" className="py-20 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Console Control Detection</h2>
          <p className="text-xl text-gray-600">
            Monitoring unauthorized access and control of AI management consoles, admin panels, and development environments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detected Console Compromises</h3>
            {controls?.map((control) => (
              <Card 
                key={control.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedControl?.id === control.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedControl(control)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-600">
                        {getConsoleTypeIcon(control.consoleType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{control.controlledEntity}</h4>
                        <p className="text-sm text-gray-600 capitalize">{control.consoleType} console</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getThreatLevelColor(control.threatLevel)}>
                        {control.threatLevel.toUpperCase()}
                      </Badge>
                      <div className={`text-xs font-medium ${getPrivilegeLevelColor(control.privilegeLevel)}`}>
                        {control.privilegeLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Method:</strong> {control.controlMethod.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Duration:</strong> {formatDuration(control.controlDuration)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Data Access:</strong> {control.dataAccessLevel}
                    </p>
                  </div>
                  
                  {control.victimUsers && Array.isArray(control.victimUsers) && control.victimUsers.length > 0 && (
                    <div className="flex items-center space-x-2 text-orange-600 bg-orange-100 p-2 rounded mb-3">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{control.victimUsers.length} users affected</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(control.detectedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!controls || controls.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Console Compromises</h3>
                  <p className="text-gray-600">All AI management consoles are secure from unauthorized access.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Control Details */}
          <div>
            {selectedControl ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getConsoleTypeIcon(selectedControl.consoleType)}
                    <span>Console Compromise Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">System Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Console Type:</strong> {selectedControl.consoleType}</p>
                      <p><strong>Controlled Entity:</strong> {selectedControl.controlledEntity}</p>
                      <p><strong>Control Method:</strong> {selectedControl.controlMethod.replace('-', ' ')}</p>
                      <p><strong>Detected:</strong> {new Date(selectedControl.detectedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Access Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Threat Level</span>
                        <Badge className={getThreatLevelColor(selectedControl.threatLevel)}>
                          {selectedControl.threatLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Privilege Level</span>
                        <span className={`font-medium ${getPrivilegeLevelColor(selectedControl.privilegeLevel)}`}>
                          {selectedControl.privilegeLevel.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Access</span>
                        <span className="text-sm font-medium">{selectedControl.dataAccessLevel}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Control Duration</span>
                        <span className="text-sm font-medium">{formatDuration(selectedControl.controlDuration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedControl.unauthorizedActions && Array.isArray(selectedControl.unauthorizedActions) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Unauthorized Actions</h4>
                      <ul className="space-y-2">
                        {selectedControl.unauthorizedActions.map((action: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedControl.manipulationTechniques && Array.isArray(selectedControl.manipulationTechniques) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Attack Techniques</h4>
                      <ul className="space-y-2">
                        {selectedControl.manipulationTechniques.map((technique: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedControl.victimUsers && Array.isArray(selectedControl.victimUsers) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Affected Users</h4>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">
                            {selectedControl.victimUsers.length} users compromised
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {selectedControl.victimUsers.map((user: string, index: number) => (
                            <li key={index} className="text-sm text-orange-700">• {user}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {selectedControl.preventionMeasures && Array.isArray(selectedControl.preventionMeasures) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Applied Countermeasures</h4>
                      <ul className="space-y-2">
                        {selectedControl.preventionMeasures.map((measure: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Shield className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Threat Level</h4>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant={selectedControl.threatLevel === "low" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedControl, { threatLevel: "low" })}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Low
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedControl.threatLevel === "medium" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedControl, { threatLevel: "medium" })}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Medium
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedControl.threatLevel === "high" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedControl, { threatLevel: "high" })}
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        High
                      </Button>
                      <Button 
                        size="sm"
                        variant={selectedControl.threatLevel === "critical" ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedControl, { threatLevel: "critical" })}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Critical
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <Terminal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Console Compromise</h3>
                  <p className="text-gray-600">Click on a compromise case from the list to view detailed analysis and countermeasures.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}