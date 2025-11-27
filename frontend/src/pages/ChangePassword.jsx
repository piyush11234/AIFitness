import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { Loader2, Lock, Eye, EyeOff, CheckCircle, Shield, ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const ChangePassword = () => {
  const { email } = useParams()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", met: false },
    { id: 2, text: "Contains uppercase letter", met: false },
    { id: 3, text: "Contains lowercase letter", met: false },
    { id: 4, text: "Contains number or symbol", met: false }
  ]

  const checkPasswordRequirements = (password) => {
    return [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ]
  }

  const handlePasswordChange = (password) => {
    setNewPassword(password)
  }

  const handleChangePassword = async () => {
    setError("")
    setSuccess("")

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const requirements = checkPasswordRequirements(newPassword)
    if (!requirements.every(req => req)) {
      setError("Please meet all password requirements")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/api/v1/user/auth/change-password/${email}`, {
        newPassword,
        confirmPassword
      })

      setSuccess(res.data.message)
      toast.success("Password changed successfully!")
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const requirementsMet = checkPasswordRequirements(newPassword)

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-black transition-colors -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Security Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">
                Create New Password
              </CardTitle>
              <CardDescription className="text-gray-400">
                Set a secure password for <span className="text-cyan-400 font-semibold">{email}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg"
              >
                <p className="text-green-400 text-sm text-center">{success}</p>
              </motion.div>
            )}

            <div className="space-y-5">
              {/* New Password */}
              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-gray-300 text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-12 pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-700/50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-12 pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <Label className="text-gray-300 text-sm font-medium">
                    Password Requirements:
                  </Label>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={req.id} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          requirementsMet[index] 
                            ? 'bg-green-500' 
                            : 'bg-gray-700'
                        }`}>
                          {requirementsMet[index] && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`text-xs ${
                          requirementsMet[index] 
                            ? 'text-green-400' 
                            : 'text-gray-400'
                        }`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleChangePassword}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Update Password</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Your new password will be securely encrypted and stored.</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ChangePassword