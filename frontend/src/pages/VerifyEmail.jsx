import React from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, ArrowRight, RefreshCw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const navigate = useNavigate()

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
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Animated Email Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8
              }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Mail className="w-12 h-12 text-white animate-bounce" />
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <CardTitle className="text-2xl font-bold text-white">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-400 text-base leading-relaxed">
                We've sent a verification link to your email address
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Please check your inbox and click the verification link to activate your FitAI account and start your fitness journey.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-gray-300 text-sm">Open your email inbox</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-gray-300 text-sm">Look for email from <strong>noreply@fitai.com</strong></span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-gray-300 text-sm">Click the verification link in the email</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={() => window.open('https://mail.google.com', '_blank')}
                className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 transform hover:scale-105"
              >
                <Mail className="w-4 h-4 mr-2" />
                Open Email App
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Login
                </Button>
              </div>
            </motion.div>
          </CardContent>

          {/* Help Section */}
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Secure verification process</span>
              </div>
              
              <div className="space-y-2 text-xs text-gray-500">
                <p>Didn't receive the email?</p>
                <div className="space-y-1">
                  <p>• Check your spam or junk folder</p>
                  <p>• Ensure you entered the correct email</p>
                  <p>• Wait a few minutes and try again</p>
                </div>
              </div>
            </div>

            {/* Support Contact */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Need help? Contact{' '}
                <a 
                  href="mailto:support@fitai.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  support@fitai.com
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
        >
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-400">
              <p className="font-medium text-gray-300 mb-1">Why verify your email?</p>
              <p>Email verification ensures the security of your account and allows us to send you important updates about your fitness journey.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail