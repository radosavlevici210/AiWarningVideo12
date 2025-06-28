import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, Upload, Send, Info } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertReport } from "@shared/schema";

export default function ReportingSystem() {
  const [contentType, setContentType] = useState("");
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const { toast } = useToast();

  const submitReportMutation = useMutation({
    mutationFn: async (reportData: InsertReport) => {
      const response = await apiRequest("POST", "/api/reports", reportData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We will review it and take appropriate action.",
      });
      // Reset form
      setContentType("");
      setDescription("");
      setReporterEmail("");
      setIncidentDate("");
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentType || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the content type and description fields.",
        variant: "destructive",
      });
      return;
    }

    submitReportMutation.mutate({
      contentType,
      description,
      reporterEmail: reporterEmail.trim() || undefined,
      incidentDate: incidentDate || undefined,
      evidence: null, // File upload not implemented in this version
    });
  };

  const contentTypeOptions = [
    {
      value: "deepfake",
      title: "Deepfake Video/Image",
      description: "Artificially generated faces or videos",
    },
    {
      value: "voice-clone",
      title: "Voice Clone",
      description: "Cloned or synthetic voice audio",
    },
    {
      value: "generated-text",
      title: "AI-Generated Text",
      description: "Suspicious messages or emails",
    },
    {
      value: "other",
      title: "Other AI Scam",
      description: "Other suspicious AI content",
    },
  ];

  return (
    <section id="report" className="py-20 bg-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-error-custom text-3xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Report Suspicious Content</h2>
          <p className="text-xl text-gray-600">
            Help protect others by reporting AI-generated scams and suspicious content you encounter.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Type */}
              <div>
                <Label className="block text-sm font-medium mb-3">
                  What type of suspicious content are you reporting?
                </Label>
                <RadioGroup value={contentType} onValueChange={setContentType}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contentTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-gray-900">{option.title}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              {/* Description */}
              <div>
                <Label htmlFor="report-description" className="block text-sm font-medium mb-2">
                  Describe the suspicious content and context
                </Label>
                <Textarea 
                  id="report-description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about where you encountered this content, what made it suspicious, and any other relevant information..."
                  className="resize-none"
                />
              </div>
              
              {/* Evidence Upload Placeholder */}
              <div>
                <Label className="block text-sm font-medium mb-2">Upload Evidence (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-custom transition-colors">
                  <Upload className="text-gray-400 text-3xl mb-2 mx-auto" />
                  <p className="text-gray-600">Drag and drop files here, or click to select</p>
                  <p className="text-sm text-gray-500 mt-1">Screenshots, URLs, audio files, or other evidence</p>
                  <p className="text-xs text-gray-400 mt-2">File upload feature coming soon</p>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reporter-email" className="block text-sm font-medium mb-2">
                    Your Email (Optional)
                  </Label>
                  <Input 
                    type="email" 
                    id="reporter-email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">For follow-up questions only</p>
                </div>
                <div>
                  <Label htmlFor="incident-date" className="block text-sm font-medium mb-2">
                    When did you encounter this?
                  </Label>
                  <Input 
                    type="date" 
                    id="incident-date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-1">Privacy Notice</h4>
                    <p className="text-blue-800">
                      Your report will be reviewed by our team and may be shared with relevant authorities. 
                      Personal information will be kept confidential and only used for investigation purposes.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={submitReportMutation.isPending}
                  className="bg-error-custom text-white px-8 py-3 hover:bg-red-700 transition-colors font-medium"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitReportMutation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
