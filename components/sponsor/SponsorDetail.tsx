"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sponsor } from '@/types/sponsorship'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SponsorGeneralInfo } from './SponsorGeneralInfo'
import { SponsorDocuments } from './SponsorDocuments'
import { SponsorCommunication } from './SponsorCommunication'
import { SponsorPlacements } from './SponsorPlacements'

interface SponsorDetailProps {
  sponsor: Sponsor
  onBack: () => void
}

export function SponsorDetail({ sponsor, onBack }: SponsorDetailProps) {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Sponsor Details</h1>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={sponsor.logo} alt={sponsor.name} />
              <AvatarFallback>{sponsor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{sponsor.name}</h2>
              <p className="text-sm text-muted-foreground">{sponsor.category} Sponsor</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b h-12">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
              <TabsTrigger value="communication" className="flex-1">Communication</TabsTrigger>
              <TabsTrigger value="placements" className="flex-1">Placements</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="general">
                <SponsorGeneralInfo sponsor={sponsor} />
              </TabsContent>
              <TabsContent value="documents">
                <SponsorDocuments sponsor={sponsor} />
              </TabsContent>
              <TabsContent value="communication">
                <SponsorCommunication sponsor={sponsor} />
              </TabsContent>
              <TabsContent value="placements">
                <SponsorPlacements sponsor={sponsor} />
              </TabsContent>
            </div>
          </TabsList>
        </CardContent>
      </Card>
    </div>
  )
}

