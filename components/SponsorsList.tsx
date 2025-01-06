// If you encounter TypeScript errors, run:
// npm install uuid
// npm install --save-dev @types/uuid

"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, ExternalLink, Tags, ArrowUpDown, Import } from 'lucide-react'
import { useSponsorship } from '@/contexts/SponsorshipContext'
import { AddSponsorDialog } from './AddSponsorDialog'
import { CategoriesDialog } from './CategoriesDialog'
import { toast } from '@/components/ui/use-toast'
import type { Sponsor } from '@/types/sponsor'
import { EditSponsorDialog } from './EditSponsorDialog'
import { v4 as uuidv4 } from 'uuid';
import { SponsorDetail } from './sponsor/SponsorDetail';


export function SponsorsList() {
  const { 
    sponsors, 
    isLoading, 
    addSponsor,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteSponsor,
    editSponsor,
    categories 
  } = useSponsorship()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddSponsorDialogOpen, setIsAddSponsorDialogOpen] = useState(false)
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      })
      return
    }

    try {
      const text = await file.text()
      const rows = text.split('\n')
      const headers = rows[0].split(',').map(header => header.trim())

      // Validate required columns
      const requiredColumns = ['name', 'industry', 'category', 'accountManager']
      const missingColumns = requiredColumns.filter(col => !headers.includes(col))

      if (missingColumns.length > 0) {
        toast({
          title: "Invalid CSV format",
          description: `Missing required columns: ${missingColumns.join(', ')}`,
          variant: "destructive"
        })
        return
      }

      // Process data rows
      const sponsors = rows.slice(1)
        .filter(row => row.trim()) // Skip empty rows
        .map(row => {
          const values = row.split(',').map(value => value.trim())
          const sponsor: Partial<Sponsor> = {}
          
          headers.forEach((header, index) => {
            if (values[index]) {
              sponsor[header as keyof Sponsor] = values[index]
            }
          })

          return {
            id: uuidv4(),
            name: sponsor.name || '',
            industry: sponsor.industry || '',
            category: sponsor.category || 'Uncategorized',
            accountManager: sponsor.accountManager || '',
            logo: '/placeholder.svg',
            contact: {
              name: '',
              role: '',
              email: ''
            }
          } as Sponsor
        })

      // Add sponsors
      sponsors.forEach(sponsor => {
        addSponsor(sponsor)
      })

      toast({
        title: "Import successful",
        description: `Imported ${sponsors.length} sponsors`,
      })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing the CSV file",
        variant: "destructive"
      })
    }
  }

  const filteredSponsors = sponsors.filter(sponsor =>
    (sponsor.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (sponsor.industry?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (sponsor.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (sponsorId: string) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await deleteSponsor(sponsorId)
        toast.success('Sponsor deleted successfully')
      } catch (error) {
        toast.error('Failed to delete sponsor')
      }
    }
  }

  if (isLoading) {
    return <div>Loading sponsors...</div>
  }

  if (selectedSponsor) {
    return (
      <SponsorDetail 
        sponsor={selectedSponsor}
        onBack={() => setSelectedSponsor(null)}
      />
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sponsors</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-600"
          >
            <Import className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsCategoriesDialogOpen(true)}
            className="text-gray-600"
          >
            <Tags className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button 
            onClick={() => setIsAddSponsorDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Sponsor
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Search sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 max-w-md"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
              >
                <span>Sponsor</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
              >
                <span>Industry</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
              >
                <span>Category</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
              >
                <span>Account Manager</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sponsor.logo || '/placeholder.svg'} alt={sponsor.name || 'Sponsor'} />
                    <AvatarFallback>{(sponsor.name ?? 'S')[0]}</AvatarFallback>
                  </Avatar>
                  <span>{sponsor.name}</span>
                </div>
              </TableCell>
              <TableCell>{sponsor.industry}</TableCell>
              <TableCell>{sponsor.category}</TableCell>
              <TableCell>{sponsor.accountManager}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSponsor(sponsor)}
                  className="h-8 w-8"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingSponsor(sponsor)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(sponsor.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddSponsorDialog 
        isOpen={isAddSponsorDialogOpen}
        onClose={() => setIsAddSponsorDialogOpen(false)}
        onAddSponsor={addSponsor}
        categories={categories}
      />

      <CategoriesDialog
        isOpen={isCategoriesDialogOpen}
        onClose={() => setIsCategoriesDialogOpen(false)}
        categories={categories}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />

      <EditSponsorDialog
        isOpen={!!editingSponsor}
        onClose={() => setEditingSponsor(null)}
        onEditSponsor={editSponsor}
        onAddCategory={addCategory}
        sponsor={editingSponsor}
        categories={categories}
      />
    </div>
  )
}

