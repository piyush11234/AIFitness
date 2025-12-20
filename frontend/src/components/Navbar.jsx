import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, BarChart3, LogOut, User, Menu, X, Sparkles, Home, Flame, Brain, Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import logo from '../assets/fitnessLogo.jpg'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      dispatch(logout());
      localStorage.removeItem("accessToken");
      navigate("/");
      toast.success(res.data.message);
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Logout failed");
      dispatch(logout());
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  };

  return (
    <nav className="p-4 border-b border-gray-800 bg-black/90 text-gray-200 backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="AI Fitness" className="h-12 w-12 rounded-full border-2 border-green-500/30 group-hover:border-green-500 transition-all" />
          <div>
            <h1 className="font-bold text-4xl bg-linear-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
              FitFusion
            </h1>
            <p className="text-md text-gray-400">Train Smarter</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center font-medium">
          {[
            { to: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
            { to: "/exercises", icon: <Flame className="h-4 w-4" />, label: "Exercises" },
            { to: "/plans", icon: <Brain className="h-4 w-4" />, label: "AI Coach" },
            { to: "/yoga", icon: <Activity className="h-4 w-4" />, label: "Yoga" },
            { to: "/meditation", icon: <Heart className="h-4 w-4" />, label: "Meditation" },
            { to: "/progress", icon: <BarChart3 className="h-4 w-4" />, label: "Progress" },
          ].map((item) => (
            <li key={item.to}>
              <Link 
                to={item.to} 
                className="hover:text-green-400 text-md flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-green-500/30 hover:border-green-500 transition-all">
                  <AvatarImage src={user.profilePic || "https://github.com/shadcn.png"} />
                  <AvatarFallback className="bg-linear-to-br from-green-600 to-emerald-500">AI</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white mt-2 shadow-xl">
                <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                  <Link to="/dashboard" className="flex items-center w-full">
                    <User className="mr-3 h-4 w-4 text-green-400" /> 
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 text-white hover:text-white focus:bg-gray-800">
                  <Activity className="mr-3 h-4 w-4 text-green-400" /> 
                  Workouts
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={logoutHandler}
                  className="cursor-pointer hover:bg-red-900/30 focus:bg-red-900/30 text-red-400 hover:text-red-300"
                >
                  <LogOut className="mr-3 h-4 w-4" /> 
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg shadow-green-900/30">
                Get Started
              </Button>
            </Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-7 w-7 text-green-400" />
          ) : (
            <Menu className="h-7 w-7 text-green-400" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-2xl p-4 space-y-2">
          {[
            { to: "/", icon: <Home className="h-5 w-5" />, label: "Home" },
            { to: "/exercises", icon: <Flame className="h-5 w-5" />, label: "Exercises" },
            { to: "/plans", icon: <Brain className="h-5 w-5" />, label: "AI Coach" },
            { to: "/yoga", icon: <Activity className="h-5 w-5" />, label: "Yoga" },
            { to: "/meditation", icon: <Heart className="h-5 w-5" />, label: "Meditation" },
            { to: "/progress", icon: <BarChart3 className="h-5 w-5" />, label: "Progress" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-green-400">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          <div className="border-t border-gray-800 pt-3 mt-3">
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-green-400" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logoutHandler();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;