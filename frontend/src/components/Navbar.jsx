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
import {
  Dumbbell,
  Activity,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Info,
  Sparkles,
  Home,
} from "lucide-react";

import axios from "axios";
import { toast } from "sonner";
import logo from '../assets/fitnessLogo.jpg'
import { useDispatch, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { logout } from "@/redux/authSlice";
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth)
  // const accessToken = localStorage.getItem("accessToken");
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
    <nav className="p-4 border-b border-gray-700 bg-black/95 text-gray-200 backdrop-blur-md sticky top-0 z-1000 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* <Dumbbell className="h-6 w-6 text-green-700" /> */}
          <img src={logo} alt="AI Fitness" className="h-8 w-8 text-green-700 rounded-full" />
          <h1 className="font-bold text-xl">
            <span className="text-green-600">Fit</span>Mind AI
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center font-semibold text-lg">
          <li>
            <Link to="/" className="hover:text-green-600 flex items-center gap-1">
              <Home className="h-4 w-4" />Home
            </Link>
          </li>
          <li>
            <Link to="/train" className="hover:text-green-600 flex items-center gap-1">
              <Activity className="h-4 w-4" /> Train
            </Link>
          </li>
          <li>
            <Link to="/plans" className="hover:text-green-600 flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> AI Coach
            </Link>
          </li>
          <li>
            <Link to="/progress" className="hover:text-green-600 flex items-center gap-1">
              <BarChart3 className="h-4 w-4" /> Progress
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-green-600 flex items-center gap-1">
              <Info className="h-4 w-4" /> About
            </Link>
          </li>

          {user ? (
            <DropdownMenu className='z-1000 bg-black/90 text-white'>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.profilePic || "https://github.com/shadcn.png"} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-black/90 text-white mt-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard">
                  <div className="flex ">
                    <User className="mr-2 h-4 w-4 " /> Profile
                  </div>
                    
                  </Link>

                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="mr-2 h-4 w-4 " /> Workouts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut className="mr-2 h-4 w-4 " /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Login
              </Button>
            </Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg  hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-100" />
          ) : (
            <Menu className="h-6 w-6 text-gray-100" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-black/80 text-white rounded-lg shadow-lg p-4">
          <Link to="/train" className="block hover:text-green-600">
            Train
          </Link>
          <Link to="/plans" className="block hover:text-green-600">
            AI Coach
          </Link>
          <Link to="/progress" className="block hover:text-green-600">
            Progress
          </Link>
          <Link to="/about" className="block hover:text-green-600">
            About
          </Link>
          {user ? (
            <>
              <div className="border-t pt-4 z-1000">
                <p className="text-gray-100 font-medium mb-2">My Account</p>
                <button className="flex items-center gap-2 w-full text-left hover:text-green-600">
                  <User className="h-4 w-4" /> Profile
                </button>
                <button className="flex items-center gap-2 w-full text-left hover:text-green-600">
                  <Activity className="h-4 w-4" /> Workouts
                </button>
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 w-full text-left hover:text-red-600 mt-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
