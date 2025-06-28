import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Copyright, Undo2, Shield, Hash, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { IntellectualPropertyTheft } from "@shared/schema";

export default function IPTheftProtection() {
  const [selectedTheft, setSelectedTheft] = useState<IntellectualPropertyTheft | null>(null);
  const [verificationHash, setVerificationHash] = useState("");
  const { toast } = useToast();

  const { data: thefts, isLoading } = useQuery<IntellectualPropertyTheft[]>({
    queryKey: ["/api/ip-theft"],
  });

  const rollbackMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/ip-theft/${id}/rollback`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ip-theft"] });
      toast({
        title: "Rollback successful",
        description: "The intellectual property has been successfully rolled back to its original state.",
      });
    },
    onError: () => {
      toast({
        title: "Rollback failed",
        description: "Unable to rollback this intellectual property. It may not support rollback functionality.",
        variant: "destructive",
      });
    },
  });

  const getTheftTypeColor = (type: string) => {
    switch (type) {
      case "code-theft": return "bg-red-100 text-red-800";
      case "design-theft": return "bg-orange-100 text-orange-800";
      case "data-theft": return "bg-purple-100 text-purple-800";
      case "model-theft": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCopyrightStatusIcon = (status: string) => {
    switch (status) {
      case "registered": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "unregistered": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleRollback = (theft: IntellectualPropertyTheft) => {
    if (theft.rollbackCapability) {
      rollbackMutation.mutate(theft.id);
    } else {
      toast({
        title: "Rollback not available",
        description: "This intellectual property does not support rollback functionality.",
        variant: "destructive",
      });
    }
  };

  const getDetectionScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-800";
    if (score >= 90) return "bg-red-100 text-red-800";
    if (score >= 70) return "bg-orange-100 text-orange-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <section id="ip-protection" className="py-20 bg-surface-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ip-protection" className="py-20 bg-surface-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">IP Theft Protection & Rollback</h2>
          <p className="text-xl text-gray-600">
            Advanced detection and rollback capabilities for intellectual property theft using AI analysis and cryptographic verification.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {thefts?.map((theft) => (
            <Card 
              key={theft.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTheft(theft)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Copyright className="h-5 w-5" />
                    <span>{theft.originalOwner}</span>
                  </CardTitle>
                  <Badge className={getTheftTypeColor(theft.theftType)}>
                    {theft.theftType.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Stolen Content</h4>
                  <p className="text-sm text-gray-700 line-clamp-2">{theft.stolenContent}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCopyrightStatusIcon(theft.copyrightStatus)}
                    <span className="text-sm capitalize">{theft.copyrightStatus}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(theft.detectedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {theft.aiDetectionScore !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">AI Detection Score</span>
                      <Badge className={getDetectionScoreColor(theft.aiDetectionScore)}>
                        {theft.aiDetectionScore}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${theft.aiDetectionScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRollback(theft);
                    }}
                    disabled={!theft.rollbackCapability || rollbackMutation.isPending}
                    className="flex-1 bg-primary-custom text-white hover:bg-blue-700"
                  >
                    <Undo2 className="h-3 w-3 mr-1" />
                    {theft.rollbackCapability ? "Rollback" : "No Rollback"}
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTheft(theft);
                    }}
                    className="flex-1"
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) || []}
          
          {(!thefts || thefts.length === 0) && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No IP Theft Detected</h3>
                  <p className="text-gray-600">Your intellectual property is currently secure from known theft attempts.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Selected Theft Details Modal-like Section */}
        {selectedTheft && (
          <div className="mt-12">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Copyright className="h-6 w-6" />
                    <span>IP Theft Analysis: {selectedTheft.originalOwner}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTheft(null)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Theft Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {selectedTheft.theftType.replace('-', ' ')}</p>
                      <p><strong>Original Owner:</strong> {selectedTheft.originalOwner}</p>
                      <p><strong>Suspected Thief:</strong> {selectedTheft.suspectedThief || 'Unknown'}</p>
                      <p><strong>Copyright Status:</strong> 
                        <span className="ml-2 inline-flex items-center space-x-1">
                          {getCopyrightStatusIcon(selectedTheft.copyrightStatus)}
                          <span className="capitalize">{selectedTheft.copyrightStatus}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Detection Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>AI Detection Score:</strong> {selectedTheft.aiDetectionScore || 'N/A'}%</p>
                      <p><strong>Rollback Available:</strong> {selectedTheft.rollbackCapability ? 'Yes' : 'No'}</p>
                      <p><strong>Original Date:</strong> {new Date(selectedTheft.originalTimestamp).toLocaleDateString()}</p>
                      <p><strong>Detected:</strong> {new Date(selectedTheft.detectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Stolen Content Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTheft.stolenContent}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cryptographic Verification</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Evidence Hash</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <code className="text-xs bg-white px-2 py-1 rounded border">
                          {selectedTheft.evidenceHash || 'No hash available'}
                        </code>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="verification-hash" className="text-sm font-medium">
                        Verify Current Hash
                      </Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id="verification-hash"
                          placeholder="Enter current content hash for verification"
                          value={verificationHash}
                          onChange={(e) => setVerificationHash(e.target.value)}
                          className="font-mono text-xs"
                        />
                        <Button size="sm" variant="outline">
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4 border-t">
                  <Button 
                    onClick={() => handleRollback(selectedTheft)}
                    disabled={!selectedTheft.rollbackCapability || rollbackMutation.isPending}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Undo2 className="h-4 w-4 mr-2" />
                    {rollbackMutation.isPending ? "Rolling back..." : "Execute Rollback"}
                  </Button>
                  <Button variant="outline">
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    Legal Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}