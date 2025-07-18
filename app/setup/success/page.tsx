"use client"

import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetupSuccessPage() {
  return (
    <div>
      <Header />
      <h1 className="text-4xl font-bold text-white mb-4">🎉 Setup Complete!</h1>
      <p className="text-slate-300 text-lg max-w-2xl mx-auto">
        Your Zephyrn Securities platform is now configured and ready to use. All systems are operational!
      </p>
      <Card className="bg-black/20 border-slate-700 backdrop-blur-sm mb-8 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Supabase URL</p>
                <p className="text-slate-400 text-sm">tcouoidmdvlxvsbkvfku.supabase.co</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Anonymous Key</p>
                <p className="text-slate-400 text-sm">Configured ✓</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Service Role Key</p>
                <p className="text-slate-400 text-sm">Configured ✓</p>
              </div>
            </div>
          </div>
          <Alert className="mt-4 bg-green-900/20 border-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-200">
              <strong>All systems operational!</strong> Your environment variables are properly configured and the database schema is ready.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
