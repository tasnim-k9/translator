import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "./auth-modal";
import { Languages, User, LogOut, Menu, X } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Languages className="text-white text-xl" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Textify</h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <button className={`font-medium transition-colors ${
                  location === "/" 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                }`}>
                  Translator
                </button>
              </Link>
              <Link href="/about">
                <button className={`font-medium transition-colors ${
                  location === "/about" 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                }`}>
                  About
                </button>
              </Link>
              {isAuthenticated && (
                <Link href="/history">
                  <button className={`font-medium transition-colors ${
                    location === "/history" 
                      ? "text-primary" 
                      : "text-gray-700 hover:text-primary"
                  }`}>
                    History
                  </button>
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="text-primary text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:flex bg-primary text-white hover:bg-primary/90"
                >
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link href="/">
                <button 
                  className="block w-full text-left text-gray-700 hover:text-primary font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Translator
                </button>
              </Link>
              <Link href="/about">
                <button 
                  className="block w-full text-left text-gray-700 hover:text-primary font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </button>
              </Link>
              {isAuthenticated && (
                <Link href="/history">
                  <button 
                    className="block w-full text-left text-gray-700 hover:text-primary font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    History
                  </button>
                </Link>
              )}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 p-0"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
