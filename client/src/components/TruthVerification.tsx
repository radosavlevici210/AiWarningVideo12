import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Hash, Shield, AlertTriangle, Copy, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TruthVerification } from "@shared/schema";

export default function TruthVerification() {
  const [selectedVerification, setSelectedVerification] = useState<TruthVerification | null>(null);
  const [verificationHash, setVerificationHash] = useState("");
  const { toast } = useToast();

  const { data: verifications, isLoading } = useQuery<TruthVerification[]>({
    queryKey: ["/api/truth-verification"],
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, currentHash }: { id: number; currentHash: string }) => {
      const response = await apiRequest("POST", `/api/truth-verification/${id}/verify`, { currentHash });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/truth-verification"] });
      toast({
        title: data.isIntact ? "Content verified" : "Content modified",
        description: data.message,
        variant: data.isIntact ? "default" : "destructive",
      });
    },
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "text": return "📝";
      case "image": return "🖼️";
      case "video": return "🎥";
      case "audio": return "🎵";
      case "code": return "💻";
      default: return "📄";
    }
  };

  const getIntegrityStatusColor = (status: string) => {
    switch (status) {
      case "intact": return "bg-green-100 text-green-800";
      case "modified": return "bg-red-100 text-red-800";
      case "corrupted": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTruthScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getVerificationMethodIcon = (method: string) => {
    switch (method) {
      case "blockchain": return <Shield className="h-4 w-4" />;
      case "digital-signature": return <CheckCircle className="h-4 w-4" />;
      case "hash-verification": return <Hash className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const handleVerify = (verification: TruthVerification) => {
    if (!verificationHash.trim()) {
      toast({
        title: "Hash required",
        description: "Please enter a hash to verify content integrity.",
        variant: "destructive",
      });
      return;
    }

    verifyMutation.mutate({
      id: verification.id,
      currentHash: verificationHash.trim()
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Hash has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <section id="truth-verification" className="py-20 bg-surface-custom">
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
    <section id="truth-verification" className="py-20 bg-surface-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Truth & Content Verification</h2>
          <p className="text-xl text-gray-600">
            Cryptographic verification system to ensure content authenticity and detect AI manipulation attempts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Verifications</h3>
            {verifications?.map((verification) => (
              <Card 
                key={verification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVerification?.id === verification.id ? 'ring-2 ring-primary-custom' : ''
                }`}
                onClick={() => setSelectedVerification(verification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getContentTypeIcon(verification.contentType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                          {verification.originalContent.substring(0, 50)}...
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">{verification.contentType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getIntegrityStatusColor(verification.integrityStatus)}>
                        {verification.integrityStatus.toUpperCase()}
                      </Badge>
                      <div className={`text-xs font-medium ${getTruthScoreColor(verification.truthScore)}`}>
                        {verification.truthScore}% Truth
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getVerificationMethodIcon(verification.verificationMethod)}
                      <span className="text-sm text-gray-600 capitalize">
                        {verification.verificationMethod.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(verification.verificationTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {verification.manipulationDetected && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Manipulation Detected</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Verified by: {verification.verifiedBy || 'System'}
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!verifications || verifications.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Verifications</h3>
                  <p className="text-gray-600">No content has been submitted for truth verification yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Verification Details */}
          <div>
            {selectedVerification ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="text-2xl">
                      {getContentTypeIcon(selectedVerification.contentType)}
                    </div>
                    <span>Content Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Content Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {selectedVerification.contentType}</p>
                      <p><strong>Verified by:</strong> {selectedVerification.verifiedBy || 'System'}</p>
                      <p><strong>Method:</strong> {selectedVerification.verificationMethod.replace('-', ' ')}</p>
                      <p><strong>Timestamp:</strong> {new Date(selectedVerification.verificationTimestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Truth Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Truth Score</span>
                        <span className={`font-bold text-lg ${getTruthScoreColor(selectedVerification.truthScore)}`}>
                          {selectedVerification.truthScore}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Integrity Status</span>
                        <Badge className={getIntegrityStatusColor(selectedVerification.integrityStatus)}>
                          {selectedVerification.integrityStatus.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manipulation</span>
                        <div className="flex items-center space-x-1">
                          {selectedVerification.manipulationDetected ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span className={`text-sm ${selectedVerification.manipulationDetected ? 'text-red-600' : 'text-green-600'}`}>
                            {selectedVerification.manipulationDetected ? 'Detected' : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Original Content</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 break-words">
                        {selectedVerification.originalContent}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cryptographic Hashes</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Original Hash</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="flex-1 text-xs bg-white p-2 rounded border font-mono break-all">
                            {selectedVerification.originalHash}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(selectedVerification.originalHash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Current Hash</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className={`flex-1 text-xs p-2 rounded border font-mono break-all ${
                            selectedVerification.originalHash === selectedVerification.currentHash 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-red-50 text-red-800'
                          }`}>
                            {selectedVerification.currentHash}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(selectedVerification.currentHash)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Verify Current Content</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="verification-hash" className="text-sm font-medium">
                          Enter current content hash
                        </Label>
                        <Input
                          id="verification-hash"
                          placeholder="sha256:..."
                          value={verificationHash}
                          onChange={(e) => setVerificationHash(e.target.value)}
                          className="font-mono text-xs mt-1"
                        />
                      </div>
                      <Button 
                        onClick={() => handleVerify(selectedVerification)}
                        disabled={verifyMutation.isPending || !verificationHash.trim()}
                        className="w-full bg-primary-custom text-white hover:bg-blue-700"
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        {verifyMutation.isPending ? "Verifying..." : "Verify Integrity"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Content</h3>
                  <p className="text-gray-600">Click on content from the list to view verification details and perform integrity checks.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}