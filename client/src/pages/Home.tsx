import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import Quiz from "@/components/Quiz";
import VideoTool from "@/components/VideoTool";
import BusinessThreatDetection from "@/components/BusinessThreatDetection";
import IPTheftProtection from "@/components/IPTheftProtection";
import AIAgentMonitoring from "@/components/AIAgentMonitoring";
import TruthVerification from "@/components/TruthVerification";
import Resources from "@/components/Resources";
import ReportingSystem from "@/components/ReportingSystem";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Education />
      <Quiz />
      <VideoTool />
      <BusinessThreatDetection />
      <IPTheftProtection />
      <AIAgentMonitoring />
      <TruthVerification />
      <Resources />
      <ReportingSystem />
      <Footer />
    </div>
  );
}
