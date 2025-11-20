import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Leaf, ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (email || phone) {
      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email || phone}`,
      });
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      toast({
        title: "Login Successful",
        description: "Welcome to RecycleHub!",
      });
      // Store session (simplified - in production use proper auth)
      localStorage.setItem("recycleHubUser", JSON.stringify({ email, phone, loggedIn: true }));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" asChild>
          <NavLink to="/">
            <ArrowLeft className="h-5 w-5" />
          </NavLink>
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-eco flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">RecycleHub</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Login to continue your recycling journey"
              : "Join the circular economy revolution"}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-card space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full transition-all ${
                isLogin
                  ? "bg-gradient-eco text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isLogin
                  ? "bg-gradient-eco text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!isOtpSent ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="text-center text-sm text-muted-foreground">or</div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                className="w-full bg-gradient-eco"
                size="lg"
                onClick={handleSendOtp}
                disabled={!email && !phone}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-2 text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Code sent to {email || phone}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-eco"
                size="lg"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
              >
                Verify & Continue
              </Button>

              <button
                onClick={() => setIsOtpSent(false)}
                className="w-full text-center text-sm text-primary hover:underline"
              >
                Change email/phone
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
