import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Code, Database, DollarSign, Eye, GitBranch, Shield, Award, AlertTriangle, Clock, FileText, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CorporateAiTheft, GithubWorkflowTheft, OfflineAiAccess, CopyrightComplaint, CopyrightReward } from "@shared/schema";

export default function CorporateAITheft() {
  const [selectedTheft, setSelectedTheft] = useState<CorporateAiTheft | null>(null);
  const [selectedGithub, setSelectedGithub] = useState<GithubWorkflowTheft | null>(null);
  const [selectedOffline, setSelectedOffline] = useState<OfflineAiAccess | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<CopyrightComplaint | null>(null);
  const [selectedReward, setSelectedReward] = useState<CopyrightReward | null>(null);
  const { toast } = useToast();

  const { data: corporateThefts, isLoading: loadingCorporate } = useQuery<CorporateAiTheft[]>({
    queryKey: ["/api/corporate-theft"],
  });

  const { data: githubThefts, isLoading: loadingGithub } = useQuery<GithubWorkflowTheft[]>({
    queryKey: ["/api/github-theft"],
  });

  const { data: offlineAccesses, isLoading: loadingOffline } = useQuery<OfflineAiAccess[]>({
    queryKey: ["/api/offline-access"],
  });

  const { data: copyrightComplaints, isLoading: loadingComplaints } = useQuery<CopyrightComplaint[]>({
    queryKey: ["/api/copyright-complaints"],
  });

  const { data: copyrightRewards, isLoading: loadingRewards } = useQuery<CopyrightReward[]>({
    queryKey: ["/api/copyright-rewards"],
  });

  const updateCorporateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/corporate-theft/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corporate-theft"] });
      toast({
        title: "Status updated",
        description: "Corporate theft case status has been updated successfully.",
      });
    },
  });

  const updateDmcaStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/github-theft/${id}/dmca`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/github-theft"] });
      toast({
        title: "DMCA status updated",
        description: "GitHub theft DMCA status has been updated successfully.",
      });
    },
  });

  const updateTrackingMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      return apiRequest("PATCH", `/api/offline-access/${id}/tracking`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offline-access"] });
      toast({
        title: "Tracking updated",
        description: "Offline AI access tracking has been updated successfully.",
      });
    },
  });

  const updateComplaintStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/copyright-complaints/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copyright-complaints"] });
      toast({
        title: "Complaint status updated",
        description: "Copyright complaint status has been updated successfully.",
      });
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/copyright-rewards/${id}/payment`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copyright-rewards"] });
      toast({
        title: "Payment status updated",
        description: "Copyright reward payment status has been updated successfully.",
      });
    },
  });

  const getTheftTypeColor = (type: string) => {
    switch (type) {
      case "data-scraping": return "bg-red-100 text-red-800";
      case "model-theft": return "bg-orange-100 text-orange-800";
      case "workflow-copying": return "bg-yellow-100 text-yellow-800";
      case "offline-access": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLegalStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "litigation": return "bg-orange-100 text-orange-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (cents: number | null) => {
    if (cents === null) return "Unknown";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  if (loadingCorporate || loadingGithub || loadingOffline || loadingComplaints || loadingRewards) {
    return (
      <section id="corporate-theft" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[700px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="corporate-theft" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Corporate AI Theft Protection</h2>
          <p className="text-xl text-gray-600">
            Comprehensive defense against corporate AI theft, GitHub workflow stealing, offline AI misuse, and copyright violations with transparent detection and reward systems.
          </p>
        </div>

        <Tabs defaultValue="corporate" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="corporate">Corporate Theft</TabsTrigger>
            <TabsTrigger value="github">GitHub Protection</TabsTrigger>
            <TabsTrigger value="offline">Offline AI Access</TabsTrigger>
            <TabsTrigger value="complaints">Copyright Complaints</TabsTrigger>
            <TabsTrigger value="rewards">Reward System</TabsTrigger>
          </TabsList>

          {/* Corporate AI Theft Tab */}
          <TabsContent value="corporate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporate AI Theft Cases</h3>
                {corporateThefts?.map((theft) => (
                  <Card 
                    key={theft.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTheft?.id === theft.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedTheft(theft)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{theft.corporationName}</h4>
                            <p className="text-sm text-gray-600">{theft.originalOwner}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getTheftTypeColor(theft.theftType)}>
                            {theft.theftType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getLegalStatusColor(theft.legalStatus || 'pending')}>
                            {(theft.legalStatus || 'pending').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Transparency Score</span>
                          <span className={`font-bold ${theft.transparencyScore > 70 ? 'text-green-600' : theft.transparencyScore > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {theft.transparencyScore}%
                          </span>
                        </div>
                        <Progress value={theft.transparencyScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Stolen Data:</strong> {theft.stolenDataType.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Violation Type:</strong> {theft.copyrightViolationType.replace('-', ' ')}
                        </p>
                        {theft.financialImpact && (
                          <p className="text-sm text-gray-700">
                            <strong>Financial Impact:</strong> {formatCurrency(theft.financialImpact)}
                          </p>
                        )}
                        {theft.parallelTheftDetected && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">Parallel theft detected</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(theft.detectedAt).toLocaleDateString()}</span>
                        </div>
                        {theft.rewardEligible && (
                          <Award className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
              
              <div>
                {selectedTheft ? (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Corporate Theft Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Case Overview</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Corporation:</strong> {selectedTheft.corporationName}</p>
                          <p><strong>Theft Type:</strong> {selectedTheft.theftType.replace('-', ' ')}</p>
                          <p><strong>Original Owner:</strong> {selectedTheft.originalOwner}</p>
                          <p><strong>Detection Method:</strong> {selectedTheft.detectionMethod}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Evidence & Impact</h4>
                        <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm text-blue-800">
                            <strong>Evidence Hash:</strong> {selectedTheft.evidenceHash}
                          </p>
                          {selectedTheft.financialImpact && (
                            <p className="text-sm text-blue-800">
                              <strong>Financial Impact:</strong> {formatCurrency(selectedTheft.financialImpact)}
                            </p>
                          )}
                          <p className="text-sm text-blue-800">
                            <strong>Transparency Score:</strong> {selectedTheft.transparencyScore}%
                          </p>
                        </div>
                      </div>
                      
                      {selectedTheft.sequentialTheftPattern && Array.isArray(selectedTheft.sequentialTheftPattern) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Sequential Theft Pattern</h4>
                          <ol className="space-y-1">
                            {selectedTheft.sequentialTheftPattern.map((step: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="flex items-center justify-center w-5 h-5 text-xs bg-red-200 text-red-700 rounded-full flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      {selectedTheft.offlineAccessMethods && Array.isArray(selectedTheft.offlineAccessMethods) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Offline Access Methods</h4>
                          <ul className="space-y-1">
                            {selectedTheft.offlineAccessMethods.map((method: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <Eye className="h-3 w-3 text-purple-500" />
                                <span className="text-sm text-gray-700">{method}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Update Legal Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateCorporateStatusMutation.mutate({ id: selectedTheft.id, status: "investigating" })}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Investigating
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateCorporateStatusMutation.mutate({ id: selectedTheft.id, status: "litigation" })}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            Litigation
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateCorporateStatusMutation.mutate({ id: selectedTheft.id, status: "resolved" })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
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
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Corporate Theft Case</h3>
                      <p className="text-gray-600">Click on a case from the list to view detailed information and management options.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* GitHub Workflow Theft Tab */}
          <TabsContent value="github" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">GitHub Workflow Protection</h3>
                {githubThefts?.map((theft) => (
                  <Card 
                    key={theft.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedGithub?.id === theft.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedGithub(theft)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <GitBranch className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{theft.originalRepository.split('/').pop()}</h4>
                            <p className="text-sm text-gray-600">by {theft.originalOwner}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getTheftTypeColor(theft.theftType)}>
                            {theft.theftType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={theft.dmcaStatus === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {theft.dmcaStatus.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Similarity Score</span>
                          <span className={`font-bold ${theft.similarityScore > 80 ? 'text-red-600' : theft.similarityScore > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {theft.similarityScore}%
                          </span>
                        </div>
                        <Progress value={theft.similarityScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Stolen From:</strong> {theft.originalRepository}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Stolen By:</strong> {theft.stolenByRepository}
                        </p>
                        {theft.corporateInvolvement && (
                          <p className="text-sm text-gray-700">
                            <strong>Corporate Involvement:</strong> {theft.corporateInvolvement}
                          </p>
                        )}
                        {theft.aiModificationDetected && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">AI modification detected</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(theft.detectedAt).toLocaleDateString()}</span>
                        </div>
                        {theft.rewardAmount && (
                          <span className="text-xs text-green-600 font-medium">
                            Reward: {formatCurrency(theft.rewardAmount)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
              
              <div>
                {selectedGithub ? (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GitBranch className="h-5 w-5" />
                        <span>GitHub Theft Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Theft Overview</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Original Repository:</strong> {selectedGithub.originalRepository}</p>
                          <p><strong>Stolen By:</strong> {selectedGithub.stolenByRepository}</p>
                          <p><strong>Theft Type:</strong> {selectedGithub.theftType.replace('-', ' ')}</p>
                          <p><strong>Similarity Score:</strong> {selectedGithub.similarityScore}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Copyright Information</h4>
                        <div className="bg-green-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm text-green-800">
                            <strong>Copyright Claim:</strong> {selectedGithub.copyrightClaim}
                          </p>
                          <p className="text-sm text-green-800">
                            <strong>Workflow Fingerprint:</strong> {selectedGithub.workflowFingerprint}
                          </p>
                          {selectedGithub.corporateInvolvement && (
                            <p className="text-sm text-green-800">
                              <strong>Corporate Involvement:</strong> {selectedGithub.corporateInvolvement}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {selectedGithub.evidenceLinks && Array.isArray(selectedGithub.evidenceLinks) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Evidence Links</h4>
                          <ul className="space-y-1">
                            {selectedGithub.evidenceLinks.map((link: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-blue-500" />
                                <span className="text-sm text-gray-700">{link}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedGithub.rewardAmount && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Reward Information</h4>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm text-yellow-800">
                                <strong>Reward Amount:</strong> {formatCurrency(selectedGithub.rewardAmount)}
                              </span>
                            </div>
                            <p className="text-sm text-yellow-800 mt-1">
                              <strong>Protection Level:</strong> {selectedGithub.protectionLevel}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Update DMCA Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateDmcaStatusMutation.mutate({ id: selectedGithub.id, status: "filed" })}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Filed
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateDmcaStatusMutation.mutate({ id: selectedGithub.id, status: "acknowledged" })}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            Acknowledged
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateDmcaStatusMutation.mutate({ id: selectedGithub.id, status: "resolved" })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
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
                      <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select GitHub Case</h3>
                      <p className="text-gray-600">Click on a case from the list to view detailed workflow theft information and DMCA management.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Offline AI Access Tab */}
          <TabsContent value="offline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Offline AI Access Monitoring</h3>
                {offlineAccesses?.map((access) => (
                  <Card 
                    key={access.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOffline?.id === access.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedOffline(access)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Database className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{access.aiModelIdentifier}</h4>
                            <p className="text-sm text-gray-600">by {access.originalModelOwner}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getTheftTypeColor(access.accessType)}>
                            {access.accessType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getRiskLevelColor(access.riskLevel)}>
                            {access.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Detected Location:</strong> {access.detectedLocation}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Access Method:</strong> {access.accessMethod}
                        </p>
                        {access.dataVolumeAccessed && (
                          <p className="text-sm text-gray-700">
                            <strong>Data Volume:</strong> {access.dataVolumeAccessed}
                          </p>
                        )}
                        {access.corporateEntity && (
                          <p className="text-sm text-gray-700">
                            <strong>Corporate Entity:</strong> {access.corporateEntity}
                          </p>
                        )}
                        {access.commercialUsage && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">Commercial usage detected</span>
                          </div>
                        )}
                        {access.encryptionBypassed && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">Encryption bypassed</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(access.detectedAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${access.trackingEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">{access.trackingEnabled ? 'Tracking ON' : 'Tracking OFF'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
              
              <div>
                {selectedOffline ? (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Offline Access Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Access Overview</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>AI Model:</strong> {selectedOffline.aiModelIdentifier}</p>
                          <p><strong>Original Owner:</strong> {selectedOffline.originalModelOwner}</p>
                          <p><strong>Access Type:</strong> {selectedOffline.accessType.replace('-', ' ')}</p>
                          <p><strong>Detected Location:</strong> {selectedOffline.detectedLocation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                        <div className={`p-3 rounded-lg ${selectedOffline.riskLevel === 'critical' ? 'bg-red-50' : selectedOffline.riskLevel === 'high' ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                          <Badge className={getRiskLevelColor(selectedOffline.riskLevel)} />
                          <p className={`text-sm mt-2 ${selectedOffline.riskLevel === 'critical' ? 'text-red-800' : selectedOffline.riskLevel === 'high' ? 'text-orange-800' : 'text-yellow-800'}`}>
                            <strong>Access Method:</strong> {selectedOffline.accessMethod}
                          </p>
                          {selectedOffline.dataVolumeAccessed && (
                            <p className={`text-sm ${selectedOffline.riskLevel === 'critical' ? 'text-red-800' : selectedOffline.riskLevel === 'high' ? 'text-orange-800' : 'text-yellow-800'}`}>
                              <strong>Data Volume:</strong> {selectedOffline.dataVolumeAccessed}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {selectedOffline.unauthorizedUsage && Array.isArray(selectedOffline.unauthorizedUsage) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Unauthorized Usage</h4>
                          <ul className="space-y-1">
                            {selectedOffline.unauthorizedUsage.map((usage: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="text-sm text-gray-700">{usage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedOffline.privacyViolations && Array.isArray(selectedOffline.privacyViolations) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Privacy Violations</h4>
                          <ul className="space-y-1">
                            {selectedOffline.privacyViolations.map((violation: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <Shield className="h-3 w-3 text-orange-500" />
                                <span className="text-sm text-gray-700">{violation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Tracking Control</h4>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateTrackingMutation.mutate({ id: selectedOffline.id, enabled: true })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Enable Tracking
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateTrackingMutation.mutate({ id: selectedOffline.id, enabled: false })}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Disable Tracking
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-64 flex items-center justify-center">
                    <CardContent className="text-center">
                      <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Offline Access Case</h3>
                      <p className="text-gray-600">Click on a case from the list to view detailed offline AI access information and tracking controls.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Copyright Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Copyright Complaints</h3>
                {copyrightComplaints?.map((complaint) => (
                  <Card 
                    key={complaint.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedComplaint?.id === complaint.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{complaint.complainantName}</h4>
                            <p className="text-sm text-gray-600">{complaint.violatingEntity}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={complaint.priorityLevel === 'urgent' ? 'bg-red-100 text-red-800' : complaint.priorityLevel === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}>
                            {complaint.priorityLevel.toUpperCase()}
                          </Badge>
                          <Badge className={complaint.complaintStatus === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {complaint.complaintStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Violation Type:</strong> {complaint.violationType.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <strong>Original Work:</strong> {complaint.originalWorkDescription}
                        </p>
                        {complaint.settlementAmount && (
                          <p className="text-sm text-gray-700">
                            <strong>Settlement:</strong> {formatCurrency(complaint.settlementAmount)}
                          </p>
                        )}
                        {complaint.dmcaNoticeIssued && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">DMCA notice issued</span>
                          </div>
                        )}
                        {complaint.legalActionTaken && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">Legal action taken</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(complaint.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
              
              <div>
                {selectedComplaint ? (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Complaint Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Complainant Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {selectedComplaint.complainantName}</p>
                          <p><strong>Email:</strong> {selectedComplaint.complainantEmail}</p>
                          <p><strong>Ownership Proof:</strong> {selectedComplaint.copyrightOwnershipProof}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Violation Details</h4>
                        <div className="bg-indigo-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm text-indigo-800">
                            <strong>Type:</strong> {selectedComplaint.violationType.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-indigo-800">
                            <strong>Violating Entity:</strong> {selectedComplaint.violatingEntity}
                          </p>
                          <p className="text-sm text-indigo-800">
                            <strong>Original Work:</strong> {selectedComplaint.originalWorkDescription}
                          </p>
                        </div>
                      </div>
                      
                      {selectedComplaint.violationEvidence && Array.isArray(selectedComplaint.violationEvidence) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Violation Evidence</h4>
                          <ul className="space-y-1">
                            {selectedComplaint.violationEvidence.map((evidence: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-blue-500" />
                                <span className="text-sm text-gray-700">{evidence}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedComplaint.requestedRemedies && Array.isArray(selectedComplaint.requestedRemedies) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Requested Remedies</h4>
                          <ul className="space-y-1">
                            {selectedComplaint.requestedRemedies.map((remedy: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <Shield className="h-3 w-3 text-green-500" />
                                <span className="text-sm text-gray-700">{remedy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedComplaint.settlementAmount && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Settlement Information</h4>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-800">
                                <strong>Settlement Amount:</strong> {formatCurrency(selectedComplaint.settlementAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateComplaintStatusMutation.mutate({ id: selectedComplaint.id, status: "reviewing" })}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Reviewing
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateComplaintStatusMutation.mutate({ id: selectedComplaint.id, status: "investigating" })}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            Investigating
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updateComplaintStatusMutation.mutate({ id: selectedComplaint.id, status: "resolved" })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
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
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Complaint</h3>
                      <p className="text-gray-600">Click on a complaint from the list to view detailed copyright violation information and status management.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Copyright Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Copyright Reward System</h3>
                {copyrightRewards?.map((reward) => (
                  <Card 
                    key={reward.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReward?.id === reward.id ? 'ring-2 ring-yellow-500' : ''
                    }`}
                    onClick={() => setSelectedReward(reward)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{reward.recipientName}</h4>
                            <p className="text-sm text-gray-600">{reward.copyrightWorkTitle}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={reward.rewardType === 'legal-victory' ? 'bg-green-100 text-green-800' : reward.rewardType === 'settlement-share' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                            {reward.rewardType.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={reward.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : reward.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                            {reward.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Reward Amount:</strong> {formatCurrency(reward.rewardAmount)}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Payment Method:</strong> {reward.paymentMethod.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <strong>Reason:</strong> {reward.rewardReason}
                        </p>
                        {reward.verificationRequired && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">Verification required</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(reward.awardedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(reward.rewardAmount)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []}
              </div>
              
              <div>
                {selectedReward ? (
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Reward Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recipient Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {selectedReward.recipientName}</p>
                          <p><strong>Email:</strong> {selectedReward.recipientEmail}</p>
                          <p><strong>Copyright Work:</strong> {selectedReward.copyrightWorkTitle}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Reward Information</h4>
                        <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
                          <p className="text-sm text-yellow-800">
                            <strong>Type:</strong> {selectedReward.rewardType.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-yellow-800">
                            <strong>Amount:</strong> {formatCurrency(selectedReward.rewardAmount)}
                          </p>
                          <p className="text-sm text-yellow-800">
                            <strong>Reason:</strong> {selectedReward.rewardReason}
                          </p>
                          {selectedReward.violationCaseId && (
                            <p className="text-sm text-yellow-800">
                              <strong>Related Case ID:</strong> {selectedReward.violationCaseId}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Payment Method:</strong> {selectedReward.paymentMethod.replace('-', ' ')}</p>
                          <p><strong>Status:</strong> {selectedReward.paymentStatus}</p>
                          {selectedReward.taxDocumentation && (
                            <p><strong>Tax Documentation:</strong> {selectedReward.taxDocumentation}</p>
                          )}
                        </div>
                      </div>
                      
                      {selectedReward.eligibilityCriteria && Array.isArray(selectedReward.eligibilityCriteria) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Eligibility Criteria</h4>
                          <ul className="space-y-1">
                            {selectedReward.eligibilityCriteria.map((criteria: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-sm text-gray-700">{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Update Payment Status</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatusMutation.mutate({ id: selectedReward.id, status: "processing" })}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Processing
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatusMutation.mutate({ id: selectedReward.id, status: "paid" })}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Paid
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => updatePaymentStatusMutation.mutate({ id: selectedReward.id, status: "failed" })}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Failed
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-64 flex items-center justify-center">
                    <CardContent className="text-center">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Reward</h3>
                      <p className="text-gray-600">Click on a reward from the list to view detailed copyright reward information and payment management.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}