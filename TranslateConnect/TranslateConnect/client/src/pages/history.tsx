import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useApiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Copy, Trash2, RotateCcw, History as HistoryIcon } from "lucide-react";
import { useLocation } from "wouter";

interface Translation {
  id: string;
  text: string;
  translatedText: string;
  source: string;
  target: string;
  timestamp: number;
}

export default function History() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const apiRequest = useApiRequest();
  const [, setLocation] = useLocation();

  const { data: translations, isLoading } = useQuery<Translation[]>({
    queryKey: ["/api/translations"],
    enabled: isAuthenticated,
  });

  const deleteTranslationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/translations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Translation deleted successfully",
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

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/translations");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "All translations cleared",
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

  const handleCopyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      es: "Spanish", 
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
    };
    return languages[code] || code.toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <HistoryIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Sign in to view your translation history</p>
            <Button onClick={() => setLocation("/")} className="bg-primary text-white hover:bg-primary/90">
              Go to Translator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading translations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Translation History</h2>
            <p className="text-gray-600">View and manage your saved translations</p>
          </div>
          {translations && translations.length > 0 && (
            <Button
              variant="outline"
              onClick={() => clearAllMutation.mutate()}
              disabled={clearAllMutation.isPending}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {!translations || translations.length === 0 ? (
          <div className="text-center py-12">
            <HistoryIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No translations yet</h3>
            <p className="text-gray-600 mb-6">Start translating to build your history</p>
            <Button onClick={() => setLocation("/")} className="bg-primary text-white hover:bg-primary/90">
              Start Translating
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {translations.map((translation) => (
              <Card key={translation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                          {getLanguageName(translation.source)}
                        </span>
                        <span className="mx-2">→</span>
                        <span className="bg-gray-100 px-2 py-1 rounded ml-2">
                          {getLanguageName(translation.target)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {formatDate(translation.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTranslationMutation.mutate(translation.id)}
                        disabled={deleteTranslationMutation.isPending}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 block">
                        Original
                      </label>
                      <p className="text-gray-900 font-mono text-sm">{translation.text}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 block">
                        Translation
                      </label>
                      <p className="text-gray-900 font-mono text-sm">{translation.translatedText}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(translation.text, "Original text")}
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Original
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(translation.translatedText, "Translation")}
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Translation
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation("/")}
                      className="text-sm text-accent hover:text-accent/90"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Re-translate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
