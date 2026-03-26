import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, GitBranch, Workflow, Server, Globe, Users } from "lucide-react";

const WorkflowDiagram = () => {
  const steps = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description: "HTML, CSS, JavaScript",
      color: "bg-blue-600",
      details: "Build user interface with React, style with Tailwind CSS"
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Backend Development",
      description: "Node.js, Python, PHP",
      color: "bg-green-600",
      details: "Create APIs with FastAPI, manage database with MongoDB"
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Local Git Repository",
      description: "Version Control",
      color: "bg-orange-600",
      details: "Track changes, commit code, manage branches locally"
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Push to GitHub",
      description: "Remote Repository",
      color: "bg-purple-600",
      details: "Push code to GitHub, collaborate with team"
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "CI/CD Pipeline",
      description: "GitHub Actions",
      color: "bg-yellow-600",
      details: "Automated testing, linting, building on every push"
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Deployment",
      description: "Hosting & DNS",
      color: "bg-red-600",
      details: "Deploy to cloud hosting, configure domain and DNS"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Access",
      description: "Web Browser",
      color: "bg-indigo-600",
      details: "Users access your app via web browser"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" data-testid="workflow-diagram">
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl text-green-400 mb-2">
            🚀 Development Workflow
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            From Code to Production: Complete Development Pipeline
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4 md:space-y-6">
        {steps.map((step, index) => (
          <div key={index} data-testid={`workflow-step-${index}`}>
            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4">
                    <Badge className={`${step.color} text-white text-xl md:text-2xl px-4 py-2`}>
                      {index + 1}
                    </Badge>
                    <div className={`${step.color} text-white p-3 rounded-lg`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-green-400 font-medium mb-2">
                      {step.description}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {step.details}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className="w-8 h-8 text-green-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="bg-gray-800 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="text-2xl text-green-400">Alternative Deployment: FTP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">FTP Deployment:</strong> For traditional hosting, you can deploy using FTP:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Build your project: <code className="bg-gray-900 px-2 py-1 rounded">npm run build</code></li>
              <li>Connect to your hosting via FTP client (FileZilla, Cyberduck)</li>
              <li>Upload build files to public_html or www directory</li>
              <li>Configure database connection on hosting</li>
              <li>Set up domain DNS to point to hosting server</li>
            </ol>
            <p className="text-sm text-gray-400 mt-4">
              💡 Modern approach uses CI/CD with GitHub Actions for automated deployment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDiagram;
