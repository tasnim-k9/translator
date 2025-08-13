import { Card, CardContent } from "@/components/ui/card";
import { Languages, Shield, Clock, Globe, Zap, Users } from "lucide-react";

export default function About() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Languages className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Textify
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Textify is a professional translation platform that breaks down language barriers 
            with advanced translation technology, speech-to-text capabilities, and seamless user experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Globe className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100+ Languages</h3>
              <p className="text-gray-600 text-sm">
                Translate between over 100 languages with high accuracy and context awareness.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Zap className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Speech-to-Text</h3>
              <p className="text-gray-600 text-sm">
                Convert spoken words into text and translate them instantly using voice recognition.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Clock className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Translation</h3>
              <p className="text-gray-600 text-sm">
                Get instant translations with automatic language detection and smart suggestions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Shield className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                Your translations are processed securely with user authentication and data protection.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Users className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Translation History</h3>
              <p className="text-gray-600 text-sm">
                Save and manage your translation history with user accounts for easy access.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Languages className="text-primary text-3xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Detection</h3>
              <p className="text-gray-600 text-sm">
                Smart language detection automatically identifies the source language for you.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Textify leverages cutting-edge translation APIs and modern web technologies 
              to deliver fast, accurate, and reliable translation services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">AI</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">
                Advanced machine learning algorithms for accurate translations
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">API</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">External APIs</h4>
              <p className="text-sm text-gray-600">
                Integration with professional translation services
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">UI</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Modern Interface</h4>
              <p className="text-sm text-gray-600">
                Clean, responsive design built with React and TypeScript
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Textify, we believe communication should have no boundaries. Our mission is to make 
            high-quality translation accessible to everyone, whether you're a student learning a new language, 
            a business expanding globally, or simply trying to connect with people from different cultures.
          </p>
        </div>
      </div>
    </div>
  );
}