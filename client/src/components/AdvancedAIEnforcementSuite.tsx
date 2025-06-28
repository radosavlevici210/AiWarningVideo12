import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Brain, Eye, Zap, AlertTriangle, Lock, Gavel, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedAIEnforcementSuite() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all advanced enforcement data
  const { data: aiFingerprints = [], isLoading: loadingFingerprints } = useQuery({
    queryKey: ['/api/ai-fingerprint-detection'],
  });

  const { data: abuseLog = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['/api/zero-knowledge-abuse-logs'],
  });

  const { data: investorMetrics = [], isLoading: loadingMetrics } = useQuery({
    queryKey: ['/api/investor-dashboard-metrics'],
  });

  const { data: watchdogReports = [], isLoading: loadingWatchdog } = useQuery({
    queryKey: ['/api/community-watchdog'],
  });

  const { data: consoleDetections = [], isLoading: loadingConsole } = useQuery({
    queryKey: ['/api/parallel-console-detection'],
  });

  const { data: realityMonitors = [], isLoading: loadingReality } = useQuery({
    queryKey: ['/api/reality-exploitation-monitor'],
  });

  const { data: tamperWatches = [], isLoading: loadingTamper } = useQuery({
    queryKey: ['/api/blockchain-tamper-watch'],
  });

  const { data: selfDestructs = [], isLoading: loadingDestruct } = useQuery({
    queryKey: ['/api/fork-clone-self-destruct'],
  });

  const { data: governmentRecords = [], isLoading: loadingGov } = useQuery({
    queryKey: ['/api/government-inaction-database'],
  });

  const triggerSelfDestruct = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/fork-clone-self-destruct/${id}/trigger`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to trigger self-destruct');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fork-clone-self-destruct'] });
      toast({
        title: "Self-Destruct Triggered",
        description: "Unauthorized fork has been neutralized and evidence collected",
      });
    },
  });

  const exportEvidence = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/zero-knowledge-abuse-logs/${id}/export`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to export evidence');
      return response.text();
    },
    onSuccess: (exportId) => {
      toast({
        title: "Evidence Exported",
        description: `Encrypted evidence package: ${exportId}`,
      });
    },
  });

  const getStatusBadge = (status: string, type: 'success' | 'warning' | 'destructive' = 'success') => (
    <Badge variant={status === 'active' || status === 'detected' ? 'destructive' : 
                   status === 'pending' || status === 'monitoring' ? 'default' : 'secondary'}>
      {status}
    </Badge>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  if (loadingFingerprints || loadingLogs || loadingMetrics) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-blue-600 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              Loading Advanced AI Enforcement Suite...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Shield className="h-16 w-16 mx-auto text-blue-600 mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced AI Theft Detection & Anti-Stalking Enforcement Suite
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Enterprise-grade protection against AI theft, blockchain abuse, console surveillance, and reality exploitation
          </p>
        </div>

        <Tabs defaultValue="fingerprint" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="fingerprint">AI Detection</TabsTrigger>
            <TabsTrigger value="abuse-logs">Abuse Logs</TabsTrigger>
            <TabsTrigger value="investor">Investor</TabsTrigger>
            <TabsTrigger value="watchdog">Watchdog</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="reality">Reality</TabsTrigger>
            <TabsTrigger value="tamper">Tamper</TabsTrigger>
            <TabsTrigger value="destruct">Self-Destruct</TabsTrigger>
            <TabsTrigger value="government">Gov Inaction</TabsTrigger>
          </TabsList>

          <TabsContent value="fingerprint" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Fingerprint Detection
                </CardTitle>
                <CardDescription>
                  Real-time detection of AI-generated requests and suspicious patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {aiFingerprints.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No AI fingerprint detections recorded. System is actively monitoring.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    aiFingerprints.map((detection: any) => (
                      <Card key={detection.id} className="border-l-4 border-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Detection #{detection.id}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Model: {detection.aiModelDetected || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={detection.blockedRequest ? 'destructive' : 'default'}>
                                {detection.blockedRequest ? 'Blocked' : 'Monitored'}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Confidence Score:</span>
                              <span className="text-sm font-medium">{detection.confidenceScore}%</span>
                            </div>
                            <Progress value={detection.confidenceScore} className="h-2" />
                            <div className="text-xs text-gray-500">
                              Method: {detection.detectionMethod} | 
                              IP: {detection.ipAddress || 'N/A'} |
                              Device: {detection.deviceId || 'N/A'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abuse-logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Zero-Knowledge Abuse Logging
                </CardTitle>
                <CardDescription>
                  Privacy-preserving abuse tracking with encrypted evidence export
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {abuseLog.map((log: any) => (
                    <Card key={log.id} className="border-l-4 border-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">Abuse Log #{log.id}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Type: {log.abuseType} | Privacy: {log.privacyLevel}
                            </p>
                            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                              Hash: {log.encryptedEventHash}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {log.legalExportReady && (
                              <Button
                                size="sm"
                                onClick={() => exportEvidence.mutate(log.id)}
                                disabled={exportEvidence.isPending}
                              >
                                Export Evidence
                              </Button>
                            )}
                            {getStatusBadge(log.legalExportReady ? 'ready' : 'processing')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Investor Dashboard Metrics
                </CardTitle>
                <CardDescription>
                  Real-time metrics for investors and stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {investorMetrics.map((metric: any) => (
                    <Card key={metric.id} className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {metric.metricValue.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {metric.metricType}
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                          Timeframe: {metric.timeframe}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium">Abuse Cases</div>
                            <div className="text-red-600">{metric.abuseStatsCount || 0}</div>
                          </div>
                          <div>
                            <div className="font-medium">License Strikes</div>
                            <div className="text-orange-600">{metric.licenseStrikesIssued || 0}</div>
                          </div>
                        </div>
                        {metric.protectionEffectiveness && (
                          <div className="mt-4">
                            <div className="text-xs mb-1">Protection Effectiveness</div>
                            <Progress value={metric.protectionEffectiveness} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchdog" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Community Watchdog Mode
                </CardTitle>
                <CardDescription>
                  Verified community members flagging suspicious behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {watchdogReports.map((report: any) => (
                    <Card key={report.id} className="border-l-4 border-green-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">Report #{report.id}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Watchdog: {report.watchdogUserId} ({report.verificationLevel})
                            </p>
                            <p className="text-sm mt-2">
                              <strong>Behavior:</strong> {report.flaggedBehavior}
                            </p>
                            <p className="text-sm">
                              <strong>Activity:</strong> {report.suspiciousActivity}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(report.moderationStatus)}
                            <div className="text-sm mt-2">
                              Votes: {report.communityVotes || 0}
                            </div>
                            {report.rewardEligible && (
                              <Badge variant="outline" className="mt-1">Reward Eligible</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destruct" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Fork Clone Self-Destruct System
                </CardTitle>
                <CardDescription>
                  Automated protection against unauthorized forks and clones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {selfDestructs.map((destruct: any) => (
                    <Card key={destruct.id} className="border-l-4 border-red-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">Project #{destruct.id}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Original: {destruct.originalProjectId}
                            </p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${destruct.forkDetected ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                <span className="text-sm">Fork Detection</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${destruct.cloneDetected ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                <span className="text-sm">Clone Detection</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${destruct.unauthorizedDeployment ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                <span className="text-sm">Unauthorized Deployment</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {destruct.destructSequenceTriggered ? (
                              <Badge variant="destructive">NEUTRALIZED</Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => triggerSelfDestruct.mutate(destruct.id)}
                                disabled={triggerSelfDestruct.isPending}
                              >
                                Trigger Destruct
                              </Button>
                            )}
                            <div className="text-xs mt-2">
                              {destruct.violatorIpAddress && (
                                <div>IP: {destruct.violatorIpAddress}</div>
                              )}
                              {destruct.legalNoticeIssued && (
                                <Badge variant="outline" className="mt-1">Legal Notice Issued</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="government" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Government Inaction Database
                </CardTitle>
                <CardDescription>
                  Tracking governmental responses to AI abuse reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {governmentRecords.map((record: any) => (
                    <Card key={record.id} className="border-l-4 border-yellow-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{record.governmentAgency}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Reporter: {record.reportingEntity}
                            </p>
                            <p className="text-sm mt-2">
                              <strong>Abuse Reported:</strong> {record.abuseReported}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reported: {new Date(record.reportDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(record.responseReceived ? 'responded' : 'no-response')}
                            {record.responseDate && (
                              <div className="text-xs mt-1">
                                Response: {new Date(record.responseDate).toLocaleDateString()}
                              </div>
                            )}
                            {record.actionTaken && (
                              <div className="text-xs mt-1 max-w-32">
                                Action: {record.actionTaken}
                              </div>
                            )}
                            {record.followUpRequired && (
                              <Badge variant="outline" className="mt-1">Follow-up Required</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}