import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useApiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { SpeechToText } from "./speech-to-text";
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Volume2, 
  Mic, 
  X, 
  Loader2,
  Globe,
  Brain,
  History,
  Bookmark
} from "lucide-react";

const languages = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
];

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const apiRequest = useApiRequest();

  const translateMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams({
        text: inputText,
        source: sourceLanguage,
        target: targetLanguage,
      });
      
      const response = await fetch(`/api/translate?${params}`);
      if (!response.ok) {
        throw new Error("Translation failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setTranslatedText(data.translatedText);
      if (data.source !== sourceLanguage) {
        setDetectedLanguage(data.source);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Translation Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveTranslationMutation = useMutation({
    mutationFn: async () => {
      if (!translatedText) return;
      
      const response = await apiRequest("POST", "/api/translations", {
        text: inputText,
        translatedText,
        source: detectedLanguage || sourceLanguage,
        target: targetLanguage,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Translation saved to history!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    translateMutation.mutate();
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === "auto") return;
    
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handleClearInput = () => {
    setInputText("");
    setTranslatedText("");
    setDetectedLanguage("");
  };

  const handleSaveTranslation = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save translations",
        variant: "destructive",
      });
      return;
    }
    saveTranslationMutation.mutate();
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Translation Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Translate text between over 100 languages with advanced language detection and translation history.
          </p>
        </div>

        {/* Translation Interface */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Language Selection Bar */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              
              {/* Source Language */}
              <div className="flex-1">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-full bg-transparent border-none shadow-none focus:ring-0 text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <Button
                variant="outline"
                size="sm"
                className="mx-4 p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
                onClick={handleSwapLanguages}
                disabled={sourceLanguage === "auto"}
              >
                <ArrowRightLeft className="h-4 w-4 text-gray-600" />
              </Button>

              {/* Target Language */}
              <div className="flex-1">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-full bg-transparent border-none shadow-none focus:ring-0 text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(lang => lang.code !== "auto").map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Translation Areas */}
          <div className="grid md:grid-cols-2 divide-x divide-gray-200">
            
            {/* Input Area */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Text to translate</label>
                <span className="text-xs text-gray-500">{inputText.length}/5000</span>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter text to translate..."
                maxLength={5000}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  {detectedLanguage && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Detected: {languages.find(l => l.code === detectedLanguage)?.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearInput}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Clear text"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <SpeechToText
                    onTranscript={(text) => {
                      setInputText(prev => prev ? `${prev} ${text}` : text);
                    }}
                    language={sourceLanguage === "auto" ? "en-US" : `${sourceLanguage}-US`}
                  />
                </div>
              </div>
            </div>

            {/* Output Area */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Translation</label>
                <div className="flex items-center space-x-2">
                  {translateMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              </div>
              
              <div className="w-full h-40 p-3 bg-white border border-gray-300 rounded-lg font-mono">
                {translatedText ? (
                  <div className="h-full overflow-auto text-gray-900">
                    {translatedText}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <span>Translation will appear here...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  {/* Future: cached indicator */}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyTranslation}
                    disabled={!translatedText}
                    className="text-sm text-gray-600 hover:text-primary"
                    title="Copy translation"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-sm text-gray-600"
                    title="Listen to pronunciation (coming soon)"
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                  {isAuthenticated && translatedText && (
                    <Button
                      size="sm"
                      onClick={handleSaveTranslation}
                      disabled={saveTranslationMutation.isPending}
                      className="text-sm bg-accent text-white hover:bg-accent/90"
                    >
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Translate Button */}
          <div className="p-6 border-t border-gray-200 text-center">
            <Button
              onClick={handleTranslate}
              disabled={!inputText.trim() || translateMutation.isPending}
              className="bg-primary text-white px-8 py-3 hover:bg-primary/90 font-medium"
              size="lg"
            >
              <Languages className="mr-2 h-5 w-5" />
              {translateMutation.isPending ? "Translating..." : "Translate"}
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <Globe className="text-primary text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">100+ Languages</h3>
              <p className="text-sm text-gray-600">Translate between over 100 languages worldwide</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <Brain className="text-primary text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Auto-Detection</h3>
              <p className="text-sm text-gray-600">Automatically detect the source language</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="pt-4">
              <History className="text-primary text-2xl mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Save History</h3>
              <p className="text-sm text-gray-600">Keep track of your translation history</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
