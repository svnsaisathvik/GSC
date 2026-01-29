import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Gradient with decorative elements */}
      <div className="hidden lg:flex lg:w-1/2 auth-gradient relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 floating-circle" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-white/5 floating-circle-delayed" />
        <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-white/10 floating-circle" />
        <div className="absolute bottom-20 left-1/3 w-16 h-16 rounded-full bg-white/15 floating-circle-delayed" />
        
        {/* Center illustration area */}
        <div className="relative z-10 text-center">
          <div className="w-64 h-64 mx-auto mb-8 relative">
            {/* Abstract shapes representing a person/illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center auth-glow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-white/80" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Small decorative elements */}
            <div className="absolute top-4 right-8 w-4 h-4 rounded-full bg-yellow-300/60" />
            <div className="absolute bottom-8 left-4 w-3 h-3 rounded-full bg-pink-300/60" />
            <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-blue-300/60" />
          </div>
          <h2 className="text-2xl font-semibold text-white/90 mb-2">
            Secure Authentication
          </h2>
          <p className="text-white/60 max-w-xs mx-auto">
            Your data is protected with industry-standard encryption
          </p>
        </div>

        {/* Bottom decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
