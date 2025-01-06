import { AppLayout } from '@/components/AppLayout'
import { SponsorshipProvider } from '@/contexts/SponsorshipContext'

export default function SponsoringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout onAddOffer={() => {}}>
      <SponsorshipProvider>
        {children}
      </SponsorshipProvider>
    </AppLayout>
  )
}

