import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/send-feedback`, formData);
      
      setSubmitted(true);
      toast({
        title: "Feedback Sent! 🎉",
        description: response.data.email_sent 
          ? "Your feedback has been sent to hari.darshini.612@gmail.com"
          : "Your feedback has been saved successfully!",
      });
      
      // Reset form
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gray-800 border-gray-700" data-testid="feedback-success">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-400 mb-4">Thank You!</h2>
            <p className="text-gray-300 text-lg">
              Your feedback has been sent successfully.
            </p>
            <p className="text-gray-400 mt-2">
              We appreciate your input! 🙏
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-gray-800 border-gray-700" data-testid="feedback-form">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl text-green-400 mb-2 flex items-center justify-center gap-2">
            <Mail className="w-8 h-8" />
            Send Feedback
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            We'd love to hear your thoughts about the cricket game!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">
                Your Name
              </Label>
              <Input
                data-testid="feedback-name-input"
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Your Email
              </Label>
              <Input
                data-testid="feedback-email-input"
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300 font-medium">
                Your Feedback
              </Label>
              <Textarea
                data-testid="feedback-message-input"
                id="message"
                name="message"
                placeholder="Tell us what you think about the cricket game..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="bg-gray-700 border-gray-600 text-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              data-testid="submit-feedback-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>

            <p className="text-center text-gray-400 text-sm">
              Your feedback will be sent to: <strong className="text-green-400">hari.darshini.612@gmail.com</strong>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
