"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, User, Phone, Mail, Crown, Zap, Building, CheckCircle, AlertCircle, Save } from "lucide-react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"

const COUNTRY_CODES = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+246", country: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+262", country: "Réunion", flag: "🇷🇪" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+590", country: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+590", country: "Saint Martin", flag: "🇲🇫" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+590", country: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+590", country: "Saint Martin", flag: "🇲🇫" },
  { code: "+1", country: "Anguilla", flag: "🇦🇮" },
  { code: "+1", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+1", country: "Bahamas", flag: "🇧🇸" },
  { code: "+1", country: "Barbados", flag: "🇧🇧" },
  { code: "+1", country: "Bermuda", flag: "🇧🇲" },
  { code: "+1", country: "British Virgin Islands", flag: "🇻🇬" },
  { code: "+1", country: "Cayman Islands", flag: "🇰🇾" },
  { code: "+1", country: "Dominica", flag: "🇩🇲" },
  { code: "+1", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+1", country: "Grenada", flag: "🇬🇩" },
  { code: "+1", country: "Jamaica", flag: "🇯🇲" },
  { code: "+1", country: "Montserrat", flag: "🇲🇸" },
  { code: "+1", country: "Puerto Rico", flag: "🇵🇷" },
  { code: "+1", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+1", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+1", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+1", country: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "+1", country: "US Virgin Islands", flag: "🇻🇮" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
]

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [userPlan, setUserPlan] = useState("free")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Load user profile data
      setUsername(user.displayName || user.email?.split("@")[0] || "")
      setMobileNumber(user.phoneNumber || "")
      setUserPlan(user.plan || "free")
    }
  }, [user])

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "free":
      case "starter":
        return <Shield className="w-5 h-5" />
      case "standard":
      case "professional":
        return <Zap className="w-5 h-5" />
      case "enterprise":
        return <Crown className="w-5 h-5" />
      case "global":
        return <Building className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "free":
      case "starter":
        return "Starter"
      case "standard":
      case "professional":
        return "Professional"
      case "enterprise":
        return "Enterprise"
      case "global":
        return "Global"
      default:
        return "Starter"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
      case "starter":
        return "bg-white/10 text-white"
      case "standard":
      case "professional":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "enterprise":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "global":
        return "bg-gold-500/20 text-gold-400 border-gold-500/30"
      default:
        return "bg-white/10 text-white"
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Update user profile
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          mobileNumber: countryCode + mobileNumber,
          plan: userPlan,
        }),
      })

      if (response.ok) {
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-light text-white mb-2">User Profile</h1>
            <p className="text-white/60">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="elevated-card outline-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-white/5 border-white/10 text-white/60"
                    />
                    <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="text-white">Mobile Number (Optional)</Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                          {COUNTRY_CODES.map((country) => (
                            <SelectItem
                              key={`${country.code}-${country.country}`}
                              value={country.code}
                              className="text-white hover:bg-white/10"
                            >
                              {country.flag} {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="mobile"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number"
                        className="flex-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-300">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="button-primary w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Account Status */}
            <div className="space-y-6">
              <Card className="elevated-card outline-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Plan</span>
                    <Badge className={getPlanColor(userPlan)}>
                      {getPlanIcon(userPlan)}
                      <span className="ml-1">{getPlanName(userPlan)}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Member Since</span>
                    <span className="text-white text-sm">
                      {user.metadata?.creationTime ? 
                        new Date(user.metadata.creationTime).toLocaleDateString() : 
                        "Recently"
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevated-card outline-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/60" />
                    <span className="text-white text-sm">{user.email}</span>
                  </div>
                  
                  {mobileNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-white/60" />
                      <span className="text-white text-sm">{countryCode} {mobileNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
