import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sponsor } from '@/types/sponsorship'
import { Upload, FileText, Download } from 'lucide-react'

interface SponsorDocumentsProps {
  sponsor: Sponsor
}

export function SponsorDocuments({ sponsor }: SponsorDocumentsProps) {
  // This is a placeholder implementation. You might want to replace this with actual document management logic.
  const documents = [
    { id: '1', name: 'Contract.pdf', type: 'PDF' },
    { id: '2', name: 'Invoice_2023.xlsx', type: 'Excel' },
    { id: '3', name: 'Sponsorship_Agreement.docx', type: 'Word' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>{doc.name}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

