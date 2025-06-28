import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Blocks, CheckCircle, AlertTriangle, Clock, Shield, ExternalLink } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BlockchainAiIntegrity } from "@shared/schema";

export default function BlockchainIntegrity() {
  const [selectedRecord, setSelectedRecord] = useState<BlockchainAiIntegrity | null>(null);
  const { toast } = useToast();

  const { data: records, isLoading } = useQuery<BlockchainAiIntegrity[]>({
    queryKey: ["/api/blockchain-records"],
  });

  const verifyIntegrityMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/blockchain-records/${id}/verify`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain-records"] });
      toast({
        title: "Integrity verified",
        description: "Blockchain integrity verification completed successfully.",
      });
    },
  });

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "ethereum": return "bg-blue-100 text-blue-800";
      case "polygon": return "bg-purple-100 text-purple-800";
      case "avalanche": return "bg-red-100 text-red-800";
      case "bsc": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConsensusStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrityScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const formatHash = (hash: string) => {
    if (hash.length > 20) {
      return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
    }
    return hash;
  };

  const formatGasCost = (cost: number | null) => {
    if (cost === null) return "Unknown";
    return new Intl.NumberFormat().format(cost);
  };

  const handleVerifyIntegrity = (record: BlockchainAiIntegrity) => {
    verifyIntegrityMutation.mutate(record.id);
  };

  if (isLoading) {
    return (
      <section id="blockchain-integrity" className="py-20 bg-indigo-50">
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
    <section id="blockchain-integrity" className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blockchain AI Integrity</h2>
          <p className="text-xl text-gray-600">
            Immutable verification and tamper-proof tracking of AI system integrity using blockchain technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Records List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Records</h3>
            {records?.map((record) => (
              <Card 
                key={record.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRecord?.id === record.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-indigo-600">
                        <Blocks className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{record.aiSystemIdentifier}</h4>
                        <p className="text-sm text-gray-600">Block #{record.blockNumber?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getNetworkColor(record.blockchainNetwork)}>
                        {record.blockchainNetwork.toUpperCase()}
                      </Badge>
                      <Badge className={getConsensusStatusColor(record.consensusStatus)}>
                        {record.consensusStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Integrity Score</span>
                      <span className={`font-bold ${getIntegrityScoreColor(record.integrityScore)}`}>
                        {record.integrityScore}%
                      </span>
                    </div>
                    <Progress 
                      value={record.integrityScore} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="mb-3 space-y-1">
                    <p className="text-sm text-gray-700">
                      <strong>Hash:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{formatHash(record.integrityHash)}</code>
                    </p>
                    {record.gasCost && (
                      <p className="text-sm text-gray-700">
                        <strong>Gas Cost:</strong> {formatGasCost(record.gasCost)}
                      </p>
                    )}
                  </div>
                  
                  {record.manipulationAttempts && Array.isArray(record.manipulationAttempts) && record.manipulationAttempts.length > 0 && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-100 p-2 rounded mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">{record.manipulationAttempts.length} manipulation attempts</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                    {record.validatorNodes && Array.isArray(record.validatorNodes) && (
                      <span className="text-xs text-gray-600">
                        {record.validatorNodes.length} validators
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) || []}
            
            {(!records || records.length === 0) && (
              <Card className="text-center py-8">
                <CardContent>
                  <Blocks className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Blockchain Records</h3>
                  <p className="text-gray-600">No AI integrity records have been stored on the blockchain yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Record Details */}
          <div>
            {selectedRecord ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Blocks className="h-5 w-5" />
                    <span>Blockchain Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">System Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>AI System:</strong> {selectedRecord.aiSystemIdentifier}</p>
                      <p><strong>Network:</strong> {selectedRecord.blockchainNetwork}</p>
                      <p><strong>Block Number:</strong> {selectedRecord.blockNumber?.toLocaleString()}</p>
                      <p><strong>Created:</strong> {new Date(selectedRecord.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Integrity Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Integrity Score</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getIntegrityScoreColor(selectedRecord.integrityScore)}`}>
                            {selectedRecord.integrityScore}%
                          </span>
                          {selectedRecord.integrityScore >= 95 && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Consensus Status</span>
                        <Badge className={getConsensusStatusColor(selectedRecord.consensusStatus)}>
                          {selectedRecord.consensusStatus.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Progress 
                        value={selectedRecord.integrityScore} 
                        className="h-3"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cryptographic Hashes</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-700 mb-1">Current Hash</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                          {selectedRecord.integrityHash}
                        </code>
                      </div>
                      {selectedRecord.previousHash && (
                        <div>
                          <p className="text-sm text-gray-700 mb-1">Previous Hash</p>
                          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                            {selectedRecord.previousHash}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedRecord.contractAddress && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Smart Contract</h4>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-sm text-indigo-800 mb-2">Contract Address</p>
                        <code className="text-xs bg-white px-2 py-1 rounded border block break-all">
                          {selectedRecord.contractAddress}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.transactionId && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Transaction Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Transaction ID:</strong></p>
                        <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                          {selectedRecord.transactionId}
                        </code>
                        {selectedRecord.gasCost && (
                          <p><strong>Gas Cost:</strong> {formatGasCost(selectedRecord.gasCost)}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.validatorNodes && Array.isArray(selectedRecord.validatorNodes) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Validator Network</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.validatorNodes.map((node: string, index: number) => (
                          <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.manipulationAttempts && Array.isArray(selectedRecord.manipulationAttempts) && selectedRecord.manipulationAttempts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Security Events</h4>
                      <ul className="space-y-2">
                        {selectedRecord.manipulationAttempts.map((attempt: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{attempt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedRecord.smartContractEvents && Array.isArray(selectedRecord.smartContractEvents) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contract Events</h4>
                      <ul className="space-y-2">
                        {selectedRecord.smartContractEvents.map((event: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedRecord.verificationProof && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verification Proof</h4>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800 mb-2">Cryptographic proof of verification</p>
                        <code className="text-xs bg-white px-2 py-1 rounded border block break-all">
                          {selectedRecord.verificationProof}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <Button 
                      onClick={() => handleVerifyIntegrity(selectedRecord)}
                      disabled={verifyIntegrityMutation.isPending}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {verifyIntegrityMutation.isPending ? "Verifying..." : "Verify Integrity"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <Blocks className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Blockchain Record</h3>
                  <p className="text-gray-600">Click on a record from the list to view detailed blockchain analysis and verification options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}