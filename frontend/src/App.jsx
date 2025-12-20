import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import Recommendations from './features/Recommendations'

import AiWorkoutPlan from './pages/ai/AiWorkoutPlan'
import { store } from './redux/store'
import PlansPage from './pages/ai/PlansPage'
import DietWizard from './components/DietWizard'
import DietPlanPage from './pages/ai/DietPlanPage'
import About from './pages/About'
import Progress from './pages/user/Progress'

import MeditationPage from './pages/user/MeditationPage'
import ExercisesPage from './pages/user/ExercisesPage'
import YogaPage from './pages/user/YogaPage'
import YogaPlanPage from './pages/ai/YogaPlanPage'
import YogaWizard from './components/YogaWizard'
import MeditationPlanPage from './pages/ai/MeditationPlansPage'
import MeditationWizard from './components/MeditationWizard'
import Footer from './components/Footer'


const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /> <Home /><Footer/></>
  },
  {
    path: '/about',
    element: <><Navbar /><About/><Footer/></>
  },
  {
    path: '/signup',
    element: <Register />
  },
  {
    path: '/verify',
    element: <VerifyEmail />
  },
  {
    path: '/onboarding',
    element: <OnboardingWizard />
  },
  {
    path: '/verify/:token',
    element: <Verify />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify-otp/:email',
    element: <VerifyOTP />
  },
  {
    path: '/change-password/:email',
    element: <ChangePassword />
  },

  {
    path: '/dashboard',
    element: <><Navbar /><PersonalizedDashboard /><Footer/></>
  },
  {
    path: '/recommendations',
    element: <><Navbar /><Recommendations /><Footer/></>
  },
  {
    path: '/exercises',
    element: <><Navbar /><ExercisesPage /><Footer/></>
  },
  {
    path: '/plans',
    element: <><Navbar /><PlansPage userId /><Footer/></>
  },

  {
    path: '/plans/workout',
    element: <><Navbar /><AiWorkoutPlan userId /><Footer/></>
  },

  {
    path: '/plans/diet',
    element: <><Navbar /><DietWizard userId /><Footer/></>
  },

  {
    path: '/plans/diet-plan',
    element: <><Navbar /><DietPlanPage userId /><Footer/></>
  },

  {
    path: '/progress',
    element: <><Navbar /><Progress/><Footer/></>
  },

  {
    path: '/yoga',
    element: <><Navbar /><YogaPage userId/><Footer/></>
  },
  {
    path: '/meditation',
    element: <><Navbar /><MeditationPage userId/><Footer/></>
  },

  {
    path: '/plans/yoga-plan',
    element: <><Navbar /><YogaPlanPage  /><Footer/></>
  },

  {
    path: '/plans/yoga-wizard',
    element: <><Navbar /><YogaWizard /><Footer/></>
  },

  {
    path: '/plans/meditation-plan',
    element: <><Navbar /><MeditationPlanPage /><Footer/></>
  },

  {
    path: '/plans/meditation-wizard',
    element: <><Navbar /><MeditationWizard/><Footer/></>
  },



])

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App