"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import Image from "next/image"

const roles = [
  "Engineering",
  "Design",
  "Product Management",
  "Support Engineer",
  "SDR",
  "Account Executive",
  "Customer Solutions",
  "People",
  "Operations",
  "Product Marketing",
  "Growth Marketing",
  "DevRel",
]

const seniorities = ["Junior", "Intermediate", "Senior", "Staff", "Lead", "Director"]

const performances = [
  { label: "1", minValue: 0.85, maxValue: 0.94  },
  { label: "2", minValue: 0.95, maxValue: 1.04 },
  { label: "3", minValue: 1.05, maxValue: 1.1 },
]

const locations = [
  { label: "Argentina", value: "0.9" },
  { label: "Austria", value: "1" },
  { label: "Belgium", value: "1" },
  { label: "Bulgaria", value: "0.9" },
  { label: "France", value: "1" },
  { label: "Germany", value: "1" },
  { label: "Greece", value: "0.9" },
  { label: "Ireland", value: "1" },
  { label: "Italy", value: "0.9" },
  { label: "Netherlands", value: "1" },
  { label: "Poland", value: "0.9" },
  { label: "Portugal", value: "0.9" },
  { label: "Romania", value: "0.9" },
  { label: "Serbia", value: "0.9" },
  { label: "Spain", value: "0.9" },
  { label: "Sweden", value: "1" },
  { label: "Türkiye", value: "0.9" },
  { label: "Ukraine", value: "0.9" },
  { label: "UK", value: "1" },
  { label: "USA", value: "1.2" },
  { label: "USA: Tier 1 (NYC, Boston, LA, SF, Seattle, Washington)", value: "1.5" },
]

const salaries = [
  { role: "Engineering", seniority: "Junior", salary: "62250" },
  { role: "Engineering", seniority: "Intermediate", salary: "83000" },
  { role: "Engineering", seniority: "Senior", salary: "103750" },
  { role: "Engineering", seniority: "Staff", salary: "146250" },
  { role: "Engineering", seniority: "Lead", salary: "117000" },
  { role: "Design", seniority: "Junior", salary: "55080" },
  { role: "Design", seniority: "Intermediate", salary: "73440" },
  { role: "Design", seniority: "Senior", salary: "91800" },
  { role: "Design", seniority: "Staff", salary: "123333" },
  { role: "Product Management", seniority: "Junior", salary: "59250" },
  { role: "Product Management", seniority: "Intermediate", salary: "79000" },
  { role: "Product Management", seniority: "Senior", salary: "98750" },
  { role: "Product Management", seniority: "Staff", salary: "133000" },
  { role: "Support Engineer", seniority: "Junior", salary: "48750" },
  { role: "Support Engineer", seniority: "Intermediate", salary: "65000" },
  { role: "Support Engineer", seniority: "Senior", salary: "81250" },
  { role: "SDR", seniority: "Junior", salary: "36750" },
  { role: "SDR", seniority: "Intermediate", salary: "49000" },
  { role: "SDR", seniority: "Senior", salary: "61250" },
  { role: "Account Executive", seniority: "Junior", salary: "64257.66" },
  { role: "Account Executive", seniority: "Intermediate", salary: "85676.88" },
  { role: "Account Executive", seniority: "Senior", salary: "107096.10" },
  { role: "Customer Solutions", seniority: "Junior", salary: "63293" },
  { role: "Customer Solutions", seniority: "Intermediate", salary: "84391" },
  { role: "Customer Solutions", seniority: "Senior", salary: "105489" },
  { role: "Customer Solutions", seniority: "Staff", salary: "141964" },
  { role: "People", seniority: "Junior", salary: "46500" },
  { role: "People", seniority: "Intermediate", salary: "62000" },
  { role: "People", seniority: "Senior", salary: "77500" },
  { role: "People", seniority: "Director", salary: "121306" },
  { role: "Operations", seniority: "Junior", salary: "43500" },
  { role: "Operations", seniority: "Intermediate", salary: "58000" },
  { role: "Operations", seniority: "Senior", salary: "72500" },
  { role: "Operations", seniority: "Director", salary: "113000" },
  { role: "Product Marketing", seniority: "Junior", salary: "62250" },
  { role: "Product Marketing", seniority: "Intermediate", salary: "83000" },
  { role: "Product Marketing", seniority: "Senior", salary: "103750" },
  { role: "Growth Marketing", seniority: "Junior", salary: "62250" },
  { role: "Growth Marketing", seniority: "Intermediate", salary: "83000" },
  { role: "Growth Marketing", seniority: "Senior", salary: "103750" },
]

export default function PayCalculator() {
  const [role, setRole] = useState("Engineering")
  const [seniorityIndex, setSeniorityIndex] = useState(2) // Senior
  const [performanceIndex, setPerformanceIndex] = useState(1) // Comfortable
  const [location, setLocation] = useState("Germany")
  const [salaryEURMin, setSalaryEURMin] = useState("0")
  const [salaryEURMax, setSalaryEURMax] = useState("0")
  const [salaryUSDMin, setSalaryUSDMin] = useState("0")
  const [salaryUSDMax, setSalaryUSDMax] = useState("0")
  
  // Get available seniorities for the selected role
  const availableSeniorities = useMemo(() => {
    return seniorities.map((seniority, index) => {
      const exists = salaries.some((s) => s.role === role && s.seniority === seniority)
      return { seniority, index, available: exists }
    })
  }, [role])

  // Update seniority index when role changes to ensure it's valid
  useEffect(() => {
    const currentSeniority = seniorities[seniorityIndex]
    const isSeniorityAvailable = salaries.some((s) => s.role === role && s.seniority === currentSeniority)

    if (!isSeniorityAvailable) {
      // Find the first available seniority for this role
      const firstAvailable = availableSeniorities.find((s) => s.available)
      if (firstAvailable) {
        setSeniorityIndex(firstAvailable.index)
      }
    }
  }, [role, availableSeniorities])

  useEffect(() => {
    calculate()
  }, [role, seniorityIndex, performanceIndex, location])

  const calculate = () => {
    const seniority = seniorities[seniorityIndex]
    const performance = performances[performanceIndex]
    const salaryEntry = salaries.find((s) => s.role === role && s.seniority === seniority)

    if (salaryEntry) {
      const locationEntry = locations.find((l) => l.label === location)
      let locationFactor = locationEntry ? Number.parseFloat(locationEntry.value) : 1
      if (role === "Account Executive") {
        locationFactor = Math.min(1.2, locationFactor)
      }

      const baseSalary = Number.parseFloat(salaryEntry.salary)

      // Calculate min and max salaries in EUR
      const salaryInEURMin = baseSalary * performance.minValue * locationFactor
      const salaryInEURMax = baseSalary * performance.maxValue * locationFactor

      setSalaryEURMin(Math.trunc(salaryInEURMin).toLocaleString())
      setSalaryEURMax(Math.trunc(salaryInEURMax).toLocaleString())
      setSalaryUSDMin(Math.trunc(salaryInEURMin * 1.167176).toLocaleString())
      setSalaryUSDMax(Math.trunc(salaryInEURMax * 1.167176).toLocaleString())
    }
  }

  // Handle seniority change with validation
  const handleSeniorityChange = (value: number[]) => {
    const newIndex = value[0]
    const seniority = seniorities[newIndex]
    const isAvailable = salaries.some((s) => s.role === role && s.seniority === seniority)

    if (isAvailable) {
      setSeniorityIndex(newIndex)
    }
  }
  
  return (
    <div className="min-h-screen bg-[rgb(4,23,52)] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl bg-white shadow-xl">
        <CardHeader className="p-6 text-center pb-6 border-b">
          <div className="mb-4 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/checkly_racoon_logo_horizontal-EWdS2HRlUyrdoVKtX819BAT68cEmbm.svg"
              alt="Checkly Logo"
              width={170}
              height={44}
              priority
            />
            <CardTitle className="ml-2 text-3xl font-bold text-gray-800">Pay Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div 
            className="grid gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-gray-700">
                Role
              </Label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger
                  id="role"
                  className="bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-[rgb(4,23,52)]"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800 border-gray-300">
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="focus:bg-gray-100">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seniority" className="text-gray-700">
                Seniority: {seniorities[seniorityIndex]}
              </Label>
              <div className="pt-6 px-2">
                <Slider
                  id="seniority"
                  min={0}
                  max={seniorities.length - 1}
                  step={1}
                  value={[seniorityIndex]}
                  onValueChange={handleSeniorityChange}
                  className="[&_[role=slider]]:bg-[rgb(4,23,52)] [&::-webkit-slider-thumb]:bg-[rgb(4,23,52)] [&::-moz-range-thumb]:bg-[rgb(4,23,52)]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  {seniorities.map((s, index) => {
                    const isAvailable = availableSeniorities.find((as) => as.index === index)?.available
                    return (
                      <span
                        key={s}
                        className={`
                          ${index === seniorityIndex ? "text-[rgb(4,23,52)] font-bold" : ""}
                          ${!isAvailable ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        onClick={() => isAvailable && setSeniorityIndex(index)}
                      >
                      {s}
                    </span>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="performance" className="text-gray-700">
                Performance: {performances[performanceIndex].label}
              </Label>
              <div className="pt-6 px-2">
                <Slider
                  id="performance"
                  min={0}
                  max={performances.length - 1}
                  step={1}
                  value={[performanceIndex]}
                  onValueChange={(value) => setPerformanceIndex(value[0])}
                  className="[&_[role=slider]]:bg-[rgb(4,23,52)] [&::-webkit-slider-thumb]:bg-[rgb(4,23,52)] [&::-moz-range-thumb]:bg-[rgb(4,23,52)]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  {performances.map((p, index) => (
                    <span
                      key={p.label}
                      className={`${index === performanceIndex ? "text-[rgb(4,23,52)] font-bold" : ""}`}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-gray-700">
                Location
              </Label>
              <Select onValueChange={setLocation} value={location}>
                <SelectTrigger
                  id="location"
                  className="bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-[rgb(4,23,52)]"
                >
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800 border-gray-300 max-h-[200px] overflow-y-auto">
                  {locations.map((l) => (
                    <SelectItem key={l.label} value={l.label} className="focus:bg-gray-100">
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <motion.div 
              className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold mb-2 text-gray-700">Annual base salary:</p>
              <p className="text-3xl font-bold text-[rgb(4,23,52)]">
                USD {salaryUSDMin} - {salaryUSDMax}
              </p>
              <p className="text-3xl font-bold text-[rgb(4,23,52)] mt-2">
                EUR {salaryEURMin} - {salaryEURMax}
              </p>
            </motion.div>
          </motion.div>
          <div className="mt-8 text-sm text-gray-600">
            <p>
              Check out our{" "}
              <a
                href="https://www.notion.so/checkly/Our-Pay-Calculator-How-we-pay-our-team-f3c42feab82b444a9cbf8fed545cb727"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0075FF] hover:underline"
              >
                Pay Calculator documentation
              </a>
              .
            </p>
            <p className="mt-2">
              If you have questions about our Pay Calculator, please reach out to{" "}
              <a
                href="https://www.linkedin.com/in/kaylie-boogaerts-72167040/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0075FF] hover:underline"
              >
                Kaylie Boogaerts on LinkedIn
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
