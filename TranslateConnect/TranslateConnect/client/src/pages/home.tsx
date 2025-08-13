import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import { Translator } from "@/components/translator";
import { 
  Languages, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Star,
  CheckCircle,
  Mic
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isAuthenticated) {
    return <Translator />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Languages className="text-white text-4xl" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Break Language
                <span className="text-primary block">Barriers Instantly</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform your communication with Textify's powerful translation platform. 
                Translate text, convert speech to text, and connect with the world in over 100 languages.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-medium shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Link href="/about">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span>100+ Languages</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Real-time Translation</span>
                </div>
                <div className="flex items-center">
                  <Mic className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Speech-to-Text</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Textify?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of translation with our advanced features designed for accuracy, speed, and convenience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get instant translations powered by advanced AI technology. 
                    No waiting, no delays - just accurate results in milliseconds.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">100+ Languages</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with billions of people worldwide. Support for major languages 
                    with automatic detection and context-aware translations.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Private</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your data is protected with enterprise-grade security. 
                    Save your translation history safely with user authentication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Speech-to-Text Highlight */}
        <div className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Mic className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Speak, We'll Translate
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Experience the magic of speech-to-text translation. Just speak naturally, 
              and watch your words transform into any language instantly.
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium"
            >
              Try Voice Translation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Translating?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Textify for their translation needs. 
              Create your free account and start translating today.
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-medium shadow-lg"
            >
              Sign Up Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required. Start translating in seconds.
            </p>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
