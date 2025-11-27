import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw, Mail, ArrowLeft, Shield } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

const VerifyOTP = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef([])
  const { email } = useParams()
  const navigate = useNavigate()

  // Handle OTP change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow numbers
    if (value.length > 1) return
    
    setError("")
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-submit when last digit is entered
    if (value && index === 5) {
      const finalOtp = updatedOtp.join("")
      if (finalOtp.length === 6) {
        handleVerify(finalOtp)
      }
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
      if (newOtp.length === 6) {
        handleVerify(pastedData)
      }
    }
  }

  // Verify OTP
  const handleVerify = async (otpValue = otp.join("")) => {
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setIsLoading(true)
      const res = await axios.post(`http://localhost:8000/api/v1/user/auth/verify-otp/${email}`, {
        otp: otpValue,
      })
      setSuccessMessage(res.data.message)
      setIsVerified(true)
      toast.success("Email verified successfully!")

      setTimeout(() => {
        navigate(`/change-password/${email}`)
      }, 2000)
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid verification code"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setIsResending(true)
      const res = await axios.post(`http://localhost:8000/api/v1/user/auth/resend-otp/${email}`)
      toast.success("New verification code sent!")
      clearOtp()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  // Clear OTP
  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    inputRefs.current[0]?.focus()
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/forgot-password')}
          className="mb-6 text-gray-400 hover:text-black transition-colors -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forgot Password
        </Button>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Verification Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-400">
                We sent a 6-digit code to{" "}
                <span className="text-purple-400 font-semibold">{email}</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                <AlertDescription className="text-red-400 text-center">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {isVerified ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-xl">Verification Successful!</h3>
                  <p className="text-gray-400">
                    Your email has been verified successfully
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-full">
                  <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                  <span className="text-sm text-gray-300">Redirecting to password reset...</span>
                </div>
              </motion.div>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-4">
                  <Label className="text-gray-300 text-sm font-medium text-center block">
                    Enter verification code:
                  </Label>
                  
                  <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          maxLength={1}
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={digit}
                          className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          disabled={isLoading}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Paste the code or type it in. It will auto-submit when complete.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleVerify()}
                    disabled={isLoading || otp.some((digit) => digit === "")}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Verify Code</span>
                      </div>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={clearOtp}
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                      disabled={isLoading}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    
                    <Button
                      onClick={handleResendOTP}
                      variant="outline"
                      className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-white"
                      disabled={isResending || isLoading}
                    >
                      {isResending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      {isResending ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-center text-sm">
              Wrong email?{" "}
              <Link
                to="/forgot-password"
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Go back
              </Link>
            </p>
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
            <Shield className="w-4 h-4 text-purple-400" />
            <span>This verification code expires in 10 minutes for security.</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VerifyOTP