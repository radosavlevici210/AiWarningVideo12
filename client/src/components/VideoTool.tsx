import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, Play, Download, Loader2, Facebook, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertVideoJob, VideoJob } from "@shared/schema";

export default function VideoTool() {
  const [script, setScript] = useState("");
  const [voiceType, setVoiceType] = useState("male");
  const [voiceSpeed, setVoiceSpeed] = useState("normal");
  const [videoFormat, setVideoFormat] = useState("1280x720");
  const [backgroundStyle, setBackgroundStyle] = useState("dark");
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const { toast } = useToast();

  const generateVideoMutation = useMutation({
    mutationFn: async (jobData: InsertVideoJob) => {
      const response = await apiRequest("POST", "/api/video/generate", jobData);
      return response.json();
    },
    onSuccess: (job: VideoJob) => {
      setCurrentJobId(job.id);
      toast({
        title: "Video generation started",
        description: "Your video is being generated. This may take a few moments.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/video", job.id] });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: currentJob, isLoading: jobLoading } = useQuery<VideoJob>({
    queryKey: ["/api/video", currentJobId],
    enabled: !!currentJobId,
    refetchInterval: (data) => {
      return data?.status === "pending" || data?.status === "processing" ? 2000 : false;
    },
  });

  const handleGenerate = () => {
    if (!script.trim()) {
      toast({
        title: "Script required",
        description: "Please enter a script for your video.",
        variant: "destructive",
      });
      return;
    }

    if (script.length > 500) {
      toast({
        title: "Script too long",
        description: "Please keep your script under 500 characters.",
        variant: "destructive",
      });
      return;
    }

    generateVideoMutation.mutate({
      script,
      voiceType,
      voiceSpeed,
      videoFormat,
      backgroundStyle,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const backgroundOptions = [
    { value: "dark", label: "Dark", gradient: "from-gray-800 to-gray-900" },
    { value: "blue", label: "Blue", gradient: "from-blue-500 to-blue-700" },
    { value: "warning", label: "Warning", gradient: "from-red-500 to-red-700" },
  ];

  return (
    <section id="video-tool" className="py-20 bg-surface-custom">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Create Awareness Videos</h2>
          <p className="text-xl text-gray-600">
            Generate educational videos to spread awareness about AI scams in your community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Creation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Video Script</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Script Input */}
              <div>
                <Label htmlFor="video-script" className="block text-sm font-medium mb-2">
                  Enter your warning message script
                </Label>
                <Textarea 
                  id="video-script"
                  rows={8}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="In a world where artificial intelligence is revolutionizing everything, some are using it to scam, deceive, and slick innocent people..."
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {script.length}/500 characters
                </p>
              </div>
              
              {/* Voice Settings */}
              <div>
                <Label className="block text-sm font-medium mb-2">Voice Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select value={voiceType} onValueChange={setVoiceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male Voice</SelectItem>
                        <SelectItem value="female">Female Voice</SelectItem>
                        <SelectItem value="neutral">Neutral Voice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={voiceSpeed} onValueChange={setVoiceSpeed}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow Speed</SelectItem>
                        <SelectItem value="normal">Normal Speed</SelectItem>
                        <SelectItem value="fast">Fast Speed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Video Settings */}
              <div>
                <Label className="block text-sm font-medium mb-2">Video Format</Label>
                <RadioGroup value={videoFormat} onValueChange={setVideoFormat}>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1280x720" id="hd" />
                      <Label htmlFor="hd">HD (1280x720)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1920x1080" id="fhd" />
                      <Label htmlFor="fhd">Full HD (1920x1080)</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Background Style */}
              <div>
                <Label className="block text-sm font-medium mb-2">Background Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {backgroundOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setBackgroundStyle(option.value)}
                      className={`p-3 border-2 rounded-md text-center transition-colors ${
                        backgroundStyle === option.value 
                          ? "border-primary-custom bg-blue-50" 
                          : "border-gray-300 hover:border-primary-custom"
                      }`}
                    >
                      <div className={`w-full h-16 bg-gradient-to-br ${option.gradient} rounded mb-2`}></div>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={generateVideoMutation.isPending}
                className="w-full bg-primary-custom text-white hover:bg-blue-700 transition-colors font-medium"
              >
                {generateVideoMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Video className="mr-2 h-4 w-4" />
                )}
                {generateVideoMutation.isPending ? "Generating..." : "Generate Video"}
              </Button>
            </CardContent>
          </Card>
          
          {/* Preview Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                {/* Video Preview Area */}
                <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center relative">
                  {jobLoading && currentJob?.status !== "completed" ? (
                    <div className="text-center text-white">
                      <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                      <p className="text-lg">
                        {currentJob?.status === "processing" ? "Generating video..." : "Processing..."}
                      </p>
                      <p className="text-sm opacity-75">This may take a few moments</p>
                    </div>
                  ) : currentJob?.status === "completed" && currentJob.videoUrl ? (
                    <div className="w-full h-full bg-gray-900 rounded-md flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mb-4 mx-auto opacity-75" />
                        <p className="text-lg">Video Ready!</p>
                        <p className="text-sm opacity-75">Click download to save your video</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg">Video preview will appear here</p>
                      <p className="text-sm opacity-75">Click generate to create your video</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Duration: {currentJob?.duration ? formatDuration(currentJob.duration) : "--:--"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Size: {currentJob?.fileSize ? formatFileSize(currentJob.fileSize) : "-- MB"}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    disabled={!currentJob || currentJob.status !== "completed"}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    className="flex-1 bg-success-custom text-white hover:bg-green-600"
                    disabled={!currentJob || currentJob.status !== "completed"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                {/* Share Options */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Share your video:</p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      disabled={!currentJob || currentJob.status !== "completed"}
                    >
                      <Facebook className="mr-1 h-3 w-3" />
                      Facebook
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-sky-500 text-white hover:bg-sky-600"
                      disabled={!currentJob || currentJob.status !== "completed"}
                    >
                      <Twitter className="mr-1 h-3 w-3" />
                      Twitter
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      disabled={!currentJob || currentJob.status !== "completed"}
                    >
                      <FaWhatsapp className="mr-1 h-3 w-3" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
