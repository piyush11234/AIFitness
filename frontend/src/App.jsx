import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import OnboardingWizard from './components/OnboardingWizard'
import VerifyEmail from './pages/VerifyEmail'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/user/Profile'
import PersonalizedDashboard from './pages/user/PersonalizedDashboard'


const router=createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/> <Home/></>
  },
  {
    path:'/signup',
    element:<Register/>
  },
  {
    path:'/verify',
    element:<VerifyEmail/>
  },
  {
    path:'/onboarding',
    element:<OnboardingWizard/>
  },
  {
    path:'/verify/:token',
    element:<Verify/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/forgot-password',
    element:<ForgotPassword/>
  },
  {
    path:'/verify-otp/:email',
    element:<VerifyOTP/>
  },
  {
    path:'/change-password/:email',
    element:<ChangePassword/>
  },

  {
    path:'/dashboard',
    element:<><Navbar/><PersonalizedDashboard/></>
  },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App