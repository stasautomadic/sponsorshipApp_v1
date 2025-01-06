"use client"

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sponsor } from '../types/sponsorship'
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface AddSponsorDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddSponsor: (sponsor: Sponsor) => void
  categories: string[]
}

export function AddSponsorDialog({ isOpen, onClose, onAddSponsor, categories }: AddSponsorDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    accountManager: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    category: '',
    // Business Address
    street: '',
    number: '',
    zip: '',
    city: '',
    country: '',
    // Billing Address
    billingStreet: '',
    billingNumber: '',
    billingZip: '',
    billingCity: '',
    billingCountry: '',
    useSameAddress: true
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
    setLogoFile(file)

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.name.trim()) {
      toast.error("Please enter a company name")
      return
    }

    if (!formData.category) {
      toast.error("Please select a category")
      return
    }

    // Create new sponsor
    const newSponsor: Sponsor = {
      id: Date.now().toString(),
      name: formData.name,
      logo: logoPreview || '/placeholder.svg',
      industry: formData.industry,
      category: formData.category,
      accountManager: formData.accountManager,
      contact: {
        name: formData.contactName,
        role: formData.contactRole,
        email: formData.contactEmail
      },
      address: {
        street: formData.street,
        number: formData.number,
        zip: formData.zip,
        city: formData.city,
        country: formData.country
      },
      billingAddress: formData.useSameAddress
        ? {
            street: formData.street,
            number: formData.number,
            zip: formData.zip,
            city: formData.city,
            country: formData.country
          }
        : {
            street: formData.billingStreet,
            number: formData.billingNumber,
            zip: formData.billingZip,
            city: formData.billingCity,
            country: formData.billingCountry
          }
    }

    // Submit the new sponsor
    onAddSponsor(newSponsor)
    
    // Reset form and close dialog
    setFormData({
      name: '',
      industry: '',
      accountManager: '',
      contactName: '',
      contactRole: '',
      contactEmail: '',
      category: '',
      street: '',
      number: '',
      zip: '',
      city: '',
      country: '',
      billingStreet: '',
      billingNumber: '',
      billingZip: '',
      billingCity: '',
      billingCountry: '',
      useSameAddress: true
    })
    setLogoFile(null)
    setLogoPreview(null)
    setUploadProgress(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
          <DialogDescription>
            Add the details of the new sponsor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  {!logoPreview ? (
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8" />
                        <span>Click to upload logo</span>
                      </div>
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g. Retail, IT, Transport"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountManager">Account Manager</Label>
                <Input
                  id="accountManager"
                  value={formData.accountManager}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountManager: e.target.value }))}
                  placeholder="Name of account manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  placeholder="Name of contact person"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactRole">Contact Person Role</Label>
                <Input
                  id="contactRole"
                  value={formData.contactRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactRole: e.target.value }))}
                  placeholder="e.g. Marketing Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Person Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contact@example.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-4">Business Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Number</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useSameAddress"
                    checked={formData.useSameAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, useSameAddress: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="useSameAddress">
                    Billing address is the same as business address
                  </Label>
                </div>

                {!formData.useSameAddress && (
                  <div>
                    <h3 className="text-sm font-medium mb-4">Billing Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingStreet">Street</Label>
                        <Input
                          id="billingStreet"
                          value={formData.billingStreet}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingStreet: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingNumber">Number</Label>
                        <Input
                          id="billingNumber"
                          value={formData.billingNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingZip">ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={formData.billingZip}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingZip: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          value={formData.billingCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingCity: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="billingCountry">Country</Label>
                        <Input
                          id="billingCountry"
                          value={formData.billingCountry}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingCountry: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Add Sponsor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

