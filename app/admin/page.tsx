import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddTestUserButton from "@/components/admin/add-test-user-button"
import Header from "@/components/header"
import { Shield, Users, Settings, Activity, Database, Lock } from "lucide-react"

export default async function AdminPage() {
  const adminStats = [
    { label: "Total Users", value: "1,247", icon: Users, color: "text-blue-400" },
    { label: "Active Sessions", value: "89", icon: Activity, color: "text-green-400" },
    { label: "Encrypted Files", value: "5,432", icon: Lock, color: "text-purple-400" },
    { label: "System Health", value: "99.9%", icon: Database, color: "text-emerald-400" },
  ]

  const quickActions = [
    {
      title: "User Management",
      description: "Create and manage test users for the application",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      component: <AddTestUserButton />,
    },
    {
      title: "System Settings",
      description: "Configure application settings and security parameters",
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      component: (
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300">System settings panel</p>
          <p className="text-slate-400 text-sm">Coming soon...</p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl mr-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-300 text-lg">Manage users, settings, and system configuration</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-900/30 text-amber-300 border-amber-700">
            🔐 Administrative Access
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-black/20 border-slate-700 backdrop-blur-sm hover:bg-black/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-slate-800/50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {quickActions.map((action, index) => (
            <Card key={action.title} className="bg-black/20 border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-slate-300 mt-1">{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">{action.component}</CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-400" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <div className="space-y-3">
              <p>
                <strong className="text-red-300">Important:</strong> This admin panel is for demonstration purposes
                only.
              </p>
              <div className="bg-black/30 p-4 rounded-lg border border-red-800/30">
                <h4 className="font-semibold text-white mb-2">In a production environment:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Implement proper authentication and authorization</li>
                  <li>Use secure environment variables for sensitive keys</li>
                  <li>Add rate limiting and audit logging</li>
                  <li>Restrict admin access to authorized personnel only</li>
                  <li>Use HTTPS and secure session management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
