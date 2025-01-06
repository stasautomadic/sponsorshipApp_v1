"use client"

import React, { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import type { Sponsor, SponsorshipOffering, SponsorshipBooking } from '@/types/sponsorship'

// Add the schedule data type
interface GameSchedule {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  venue: string
}

interface SponsorshipContextType {
  sponsors: Sponsor[]
  offerings: SponsorshipOffering[]
  bookings: SponsorshipBooking[]
  categories: string[]
  gameSchedule: GameSchedule[]
  isLoading: boolean
  addSponsor: (sponsor: Sponsor) => void
  editSponsor: (sponsor: Sponsor) => void
  deleteSponsor: (sponsorId: string) => void
  addOffering: (offering: SponsorshipOffering) => void
  editOffering: (offering: SponsorshipOffering) => void
  deleteOffering: (offeringId: string) => void
  addBooking: (booking: SponsorshipBooking) => void
  editBooking: (booking: SponsorshipBooking) => void
  deleteBooking: (bookingId: string) => void
  addCategory: (category: string) => void
  updateCategory: (oldCategory: string, newCategory: string) => void
  deleteCategory: (category: string) => void
  addGame: (game: GameSchedule) => void
}

const INITIAL_SCHEDULE: GameSchedule[] = [
  {
    id: '1',
    date: '2025-01-12',
    league: 'Nationalliga A',
    homeTeam: 'BSV Bern',
    awayTeam: 'Pfadi Winterthur',
    venue: 'Mobiliar Arena'
  },
  {
    id: '2',
    date: '2025-01-19',
    league: 'Nationalliga A',
    homeTeam: 'HSC Suhr Aarau',
    awayTeam: 'BSV Bern',
    venue: 'Schachenhalle'
  },
  {
    id: '3',
    date: '2025-01-26',
    league: 'Swiss Cup',
    homeTeam: 'BSV Bern',
    awayTeam: 'RTV 1879 Basel',
    venue: 'Mobiliar Arena'
  },
  {
    id: '4',
    date: '2025-02-02',
    league: 'European League',
    homeTeam: 'BSV Bern',
    awayTeam: 'Füchse Berlin',
    venue: 'Mobiliar Arena'
  },
  {
    id: '5',
    date: '2025-02-09',
    league: 'Nationalliga A',
    homeTeam: 'Kadetten Schaffhausen',
    awayTeam: 'BSV Bern',
    venue: 'BBC Arena'
  },
  {
    id: '6',
    date: '2025-02-16',
    league: 'Nationalliga A',
    homeTeam: 'BSV Bern',
    awayTeam: 'HC Kriens-Luzern',
    venue: 'Mobiliar Arena'
  },
  {
    id: '7',
    date: '2025-02-23',
    league: 'European League',
    homeTeam: 'Sporting CP',
    awayTeam: 'BSV Bern',
    venue: 'Pavilhão João Rocha'
  }
]

const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: uuidv4(),
    name: "HRS",
    industry: "Construction",
    category: "Gold",
    accountManager: "Robert Huber",
    logo: '/placeholder.svg',
    contact: {
      name: "Robert Huber",
      role: "Head of Sales",
      email: "r.huber@hrs.ch"
    },
    address: {
      street: "Walchestrasse",
      number: "15",
      zip: "8006",
      city: "Zürich",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Walchestrasse",
      number: "15",
      zip: "8006",
      city: "Zürich",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Mobiliar",
    industry: "Insurance",
    category: "Gold",
    accountManager: "Markus Hofstetter",
    logo: '/placeholder.svg',
    contact: {
      name: "Markus Hofstetter",
      role: "Head of Sponsoring",
      email: "markus.hofstetter@mobiliar.ch"
    },
    address: {
      street: "Bundesgasse",
      number: "35",
      zip: "3001",
      city: "Bern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Bundesgasse",
      number: "35",
      zip: "3001",
      city: "Bern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Bystronic",
    industry: "Manufacturing",
    category: "Silver",
    accountManager: "Stefanie Meier",
    logo: '/placeholder.svg',
    contact: {
      name: "Stefanie Meier",
      role: "Marketing Manager",
      email: "stefanie.meier@bystronic.com"
    },
    address: {
      street: "Industriestrasse",
      number: "21",
      zip: "3362",
      city: "Niederönz",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Industriestrasse",
      number: "21",
      zip: "3362",
      city: "Niederönz",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Zaugg",
    industry: "Construction",
    category: "Silver",
    accountManager: "Thomas Zaugg",
    logo: '/placeholder.svg',
    contact: {
      name: "Thomas Zaugg",
      role: "CEO",
      email: "thomas.zaugg@zaugg-ag.ch"
    },
    address: {
      street: "Holzmattstrasse",
      number: "3",
      zip: "3436",
      city: "Zollbrück",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Holzmattstrasse",
      number: "3",
      zip: "3436",
      city: "Zollbrück",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Valiant",
    industry: "Banking",
    category: "Gold",
    accountManager: "Sarah Müller",
    logo: '/placeholder.svg',
    contact: {
      name: "Sarah Müller",
      role: "Sponsoring Manager",
      email: "sarah.mueller@valiant.ch"
    },
    address: {
      street: "Bundesplatz",
      number: "4",
      zip: "3001",
      city: "Bern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Bundesplatz",
      number: "4",
      zip: "3001",
      city: "Bern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Spörri Optik",
    industry: "Retail",
    category: "Bronze",
    accountManager: "Lisa Spörri",
    logo: '/placeholder.svg',
    contact: {
      name: "Lisa Spörri",
      role: "Owner",
      email: "lisa.spoerri@spoerri-optik.ch"
    },
    address: {
      street: "Marktgasse",
      number: "17",
      zip: "3011",
      city: "Bern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Marktgasse",
      number: "17",
      zip: "3011",
      city: "Bern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Migros",
    industry: "Retail",
    category: "Gold",
    accountManager: "Peter Zürcher",
    logo: '/placeholder.svg',
    contact: {
      name: "Peter Zürcher",
      role: "Head of Partnerships",
      email: "peter.zuercher@migros.ch"
    },
    address: {
      street: "Limmatstrasse",
      number: "152",
      zip: "8005",
      city: "Zürich",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Limmatstrasse",
      number: "152",
      zip: "8005",
      city: "Zürich",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swisscom",
    industry: "Telecommunications",
    category: "Gold",
    accountManager: "Anna Schmid",
    logo: '/placeholder.svg',
    contact: {
      name: "Anna Schmid",
      role: "Sponsoring Director",
      email: "anna.schmid@swisscom.com"
    },
    address: {
      street: "Alte Tiefenaustrasse",
      number: "6",
      zip: "3050",
      city: "Bern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Alte Tiefenaustrasse",
      number: "6",
      zip: "3050",
      city: "Bern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Emmi",
    industry: "Food & Beverage",
    category: "Silver",
    accountManager: "Michael Weber",
    logo: '/placeholder.svg',
    contact: {
      name: "Michael Weber",
      role: "Marketing Director",
      email: "michael.weber@emmi.com"
    },
    address: {
      street: "Landenbergstrasse",
      number: "1",
      zip: "6002",
      city: "Luzern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Landenbergstrasse",
      number: "1",
      zip: "6002",
      city: "Luzern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Rivella",
    industry: "Food & Beverage",
    category: "Silver",
    accountManager: "Sandra Keller",
    logo: '/placeholder.svg',
    contact: {
      name: "Sandra Keller",
      role: "Sponsoring Manager",
      email: "sandra.keller@rivella.ch"
    },
    address: {
      street: "Neue Industriestrasse",
      number: "10",
      zip: "4852",
      city: "Rothrist",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Neue Industriestrasse",
      number: "10",
      zip: "4852",
      city: "Rothrist",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Precision Tools",
    industry: "Manufacturing",
    category: "Silver",
    accountManager: "Lukas Brunner",
    logo: '/placeholder.svg',
    contact: {
      name: "Lukas Brunner",
      role: "Sales Director",
      email: "l.brunner@swisstools.ch"
    },
    address: {
      street: "Werkstrasse",
      number: "8",
      zip: "8400",
      city: "Winterthur",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Werkstrasse",
      number: "8",
      zip: "8400",
      city: "Winterthur",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Alpine Adventures",
    industry: "Tourism",
    category: "Bronze",
    accountManager: "Emma Roth",
    logo: '/placeholder.svg',
    contact: {
      name: "Emma Roth",
      role: "Marketing Coordinator",
      email: "emma.roth@alpineadventures.ch"
    },
    address: {
      street: "Bergweg",
      number: "15",
      zip: "3800",
      city: "Interlaken",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Bergweg",
      number: "15",
      zip: "3800",
      city: "Interlaken",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "SwissTech Innovations",
    industry: "Technology",
    category: "Gold",
    accountManager: "Daniel Meier",
    logo: '/placeholder.svg',
    contact: {
      name: "Daniel Meier",
      role: "Head of Partnerships",
      email: "d.meier@swisstech.ch"
    },
    address: {
      street: "Innovationsplatz",
      number: "1",
      zip: "8005",
      city: "Zürich",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Innovationsplatz",
      number: "1",
      zip: "8005",
      city: "Zürich",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Helvetia Timepieces",
    industry: "Luxury Goods",
    category: "Gold",
    accountManager: "Sophie Dubois",
    logo: '/placeholder.svg',
    contact: {
      name: "Sophie Dubois",
      role: "Brand Manager",
      email: "s.dubois@helvetiatimepieces.ch"
    },
    address: {
      street: "Uhrenstrasse",
      number: "22",
      zip: "2502",
      city: "Biel/Bienne",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Uhrenstrasse",
      number: "22",
      zip: "2502",
      city: "Biel/Bienne",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "EcoAlps Energy",
    industry: "Renewable Energy",
    category: "Silver",
    accountManager: "Marco Rossi",
    logo: '/placeholder.svg',
    contact: {
      name: "Marco Rossi",
      role: "Business Development Manager",
      email: "m.rossi@ecoalps.ch"
    },
    address: {
      street: "Solarweg",
      number: "5",
      zip: "6460",
      city: "Altdorf",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Solarweg",
      number: "5",
      zip: "6460",
      city: "Altdorf",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Medtech Solutions",
    industry: "Healthcare",
    category: "Gold",
    accountManager: "Laura Schneider",
    logo: '/placeholder.svg',
    contact: {
      name: "Laura Schneider",
      role: "Head of Sales",
      email: "l.schneider@swissmedtech.ch"
    },
    address: {
      street: "Gesundheitsstrasse",
      number: "10",
      zip: "4056",
      city: "Basel",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Gesundheitsstrasse",
      number: "10",
      zip: "4056",
      city: "Basel",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Alpenblick Hotels",
    industry: "Hospitality",
    category: "Silver",
    accountManager: "Thomas Egger",
    logo: '/placeholder.svg',
    contact: {
      name: "Thomas Egger",
      role: "Marketing Director",
      email: "t.egger@alpenblickhotels.ch"
    },
    address: {
      street: "Panoramaweg",
      number: "3",
      zip: "3920",
      city: "Zermatt",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Panoramaweg",
      number: "3",
      zip: "3920",
      city: "Zermatt",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "SwissFin Solutions",
    industry: "Financial Services",
    category: "Gold",
    accountManager: "Andrea Berger",
    logo: '/placeholder.svg',
    contact: {
      name: "Andrea Berger",
      role: "Client Relations Manager",
      email: "a.berger@swissfin.ch"
    },
    address: {
      street: "Bankstrasse",
      number: "18",
      zip: "8001",
      city: "Zürich",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Bankstrasse",
      number: "18",
      zip: "8001",
      city: "Zürich",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Precision Pharma",
    industry: "Pharmaceuticals",
    category: "Gold",
    accountManager: "Markus Wenger",
    logo: '/placeholder.svg',
    contact: {
      name: "Markus Wenger",
      role: "Head of Corporate Partnerships",
      email: "m.wenger@precisionpharma.ch"
    },
    address: {
      street: "Forschungsplatz",
      number: "7",
      zip: "4057",
      city: "Basel",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Forschungsplatz",
      number: "7",
      zip: "4057",
      city: "Basel",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Eco Packaging",
    industry: "Packaging",
    category: "Bronze",
    accountManager: "Nina Sutter",
    logo: '/placeholder.svg',
    contact: {
      name: "Nina Sutter",
      role: "Sustainability Manager",
      email: "n.sutter@swissecopack.ch"
    },
    address: {
      street: "Recyclingweg",
      number: "12",
      zip: "5000",
      city: "Aarau",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Recyclingweg",
      number: "12",
      zip: "5000",
      city: "Aarau",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "AlpineWear",
    industry: "Sportswear",
    category: "Silver",
    accountManager: "Stefan Keller",
    logo: '/placeholder.svg',
    contact: {
      name: "Stefan Keller",
      role: "Sports Marketing Manager",
      email: "s.keller@alpinewear.ch"
    },
    address: {
      street: "Sportweg",
      number: "9",
      zip: "7260",
      city: "Davos",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Sportweg",
      number: "9",
      zip: "7260",
      city: "Davos",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Data Secure",
    industry: "Cybersecurity",
    category: "Gold",
    accountManager: "Lena Zimmermann",
    logo: '/placeholder.svg',
    contact: {
      name: "Lena Zimmermann",
      role: "Partnership Director",
      email: "l.zimmermann@swissdatasecure.ch"
    },
    address: {
      street: "Sicherheitsstrasse",
      number: "20",
      zip: "3014",
      city: "Bern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Sicherheitsstrasse",
      number: "20",
      zip: "3014",
      city: "Bern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Helvetic Airways",
    industry: "Aviation",
    category: "Gold",
    accountManager: "Philippe Müller",
    logo: '/placeholder.svg',
    contact: {
      name: "Philippe Müller",
      role: "Head of Sponsorships",
      email: "p.mueller@helveticairways.ch"
    },
    address: {
      street: "Flughafenstrasse",
      number: "100",
      zip: "8302",
      city: "Kloten",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Flughafenstrasse",
      number: "100",
      zip: "8302",
      city: "Kloten",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Gourmet Foods",
    industry: "Food Production",
    category: "Silver",
    accountManager: "Claudia Brunner",
    logo: '/placeholder.svg',
    contact: {
      name: "Claudia Brunner",
      role: "Marketing Specialist",
      email: "c.brunner@swissgourmet.ch"
    },
    address: {
      street: "Feinschmeckerweg",
      number: "5",
      zip: "6300",
      city: "Zug",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Feinschmeckerweg",
      number: "5",
      zip: "6300",
      city: "Zug",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "EcoMobility Solutions",
    industry: "Transportation",
    category: "Bronze",
    accountManager: "David Gerber",
    logo: '/placeholder.svg',
    contact: {
      name: "David Gerber",
      role: "Business Development Manager",
      email: "d.gerber@ecomobility.ch"
    },
    address: {
      street: "Mobilitätsplatz",
      number: "3",
      zip: "8400",
      city: "Winterthur",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Mobilitätsplatz",
      number: "3",
      zip: "8400",
      city: "Winterthur",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Precision Optics",
    industry: "Optics",
    category: "Silver",
    accountManager: "Sarah Wyss",
    logo: '/placeholder.svg',
    contact: {
      name: "Sarah Wyss",
      role: "Sales Manager",
      email: "s.wyss@swissoptics.ch"
    },
    address: {
      street: "Optikstrasse",
      number: "11",
      zip: "9000",
      city: "St. Gallen",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Optikstrasse",
      number: "11",
      zip: "9000",
      city: "St. Gallen",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "AlpineBot Robotics",
    industry: "Robotics",
    category: "Gold",
    accountManager: "Michael Steiner",
    logo: '/placeholder.svg',
    contact: {
      name: "Michael Steiner",
      role: "Chief Partnership Officer",
      email: "m.steiner@alpinebot.ch"
    },
    address: {
      street: "Robotikweg",
      number: "7",
      zip: "8952",
      city: "Schlieren",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Robotikweg",
      number: "7",
      zip: "8952",
      city: "Schlieren",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Green Construction",
    industry: "Construction",
    category: "Bronze",
    accountManager: "Martina Bianchi",
    logo: '/placeholder.svg',
    contact: {
      name: "Martina Bianchi",
      role: "Sustainability Coordinator",
      email: "m.bianchi@swissgreen.ch"
    },
    address: {
      street: "Ökoweg",
      number: "14",
      zip: "6003",
      city: "Luzern",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Ökoweg",
      number: "14",
      zip: "6003",
      city: "Luzern",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Swiss Crypto Solutions",
    industry: "Fintech",
    category: "Silver",
    accountManager: "Adrian Keller",
    logo: '/placeholder.svg',
    contact: {
      name: "Adrian Keller",
      role: "Partnerships Lead",
      email: "a.keller@swisscrypto.ch"
    },
    address: {
      street: "Blockchainstrasse",
      number: "42",
      zip: "6300",
      city: "Zug",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Blockchainstrasse",
      number: "42",
      zip: "6300",
      city: "Zug",
      country: "Switzerland"
    }
  },
  {
    id: uuidv4(),
    name: "Helvetic Hydro Systems",
    industry: "Water Management",
    category: "Bronze",
    accountManager: "Lukas Tanner",
    logo: '/placeholder.svg',
    contact: {
      name: "Lukas Tanner",
      role: "Regional Sales Manager",
      email: "l.tanner@helvetichydro.ch"
    },
    address: {
      street: "Wasserweg",
      number: "8",
      zip: "8200",
      city: "Schaffhausen",
      country: "Switzerland"
    },
    billingAddress: {
      street: "Wasserweg",
      number: "8",
      zip: "8200",
      city: "Schaffhausen",
      country: "Switzerland"
    }
  }
]

const INITIAL_OFFERINGS: SponsorshipOffering[] = [
  {
    id: "1",
    name: "LED Perimeter Advertising",
    description: "Dynamic digital advertising on LED perimeter boards around the playing field. High visibility during all home games and events.",
    type: "digital",
    category: "Match Day",
    variants: [
      {
        id: "1a",
        name: "Premium Package",
        description: "10 minutes total display time per game, prime visibility during key game moments",
        isAvailable: true
      },
      {
        id: "1b",
        name: "Standard Package",
        description: "5 minutes total display time per game",
        isAvailable: true
      }
    ],
    totalQuantity: 2
  },
  {
    id: "2",
    name: "Jersey Sponsorship",
    description: "Premium placement of your brand on official team jerseys. Includes both home and away kits with maximum visibility during games and media coverage.",
    type: "physical",
    category: "Premium",
    variants: [
      {
        id: "2a",
        name: "Front Center",
        description: "Primary position on jersey front - maximum brand visibility",
        isAvailable: true
      },
      {
        id: "2b",
        name: "Sleeve Position",
        description: "Logo placement on both sleeves",
        isAvailable: true
      },
      {
        id: "2c",
        name: "Back Position",
        description: "Logo placement below player number",
        isAvailable: true
      }
    ],
    totalQuantity: 3
  },
  {
    id: "3",
    name: "VIP Match Day Experience",
    description: "Exclusive VIP hospitality package including premium seating, catering, and networking opportunities with players and officials.",
    type: "event",
    category: "Hospitality",
    variants: [
      {
        id: "3a",
        name: "Season Package",
        description: "VIP access for all home games with dedicated suite",
        isAvailable: true
      },
      {
        id: "3b",
        name: "Single Match Package",
        description: "VIP experience for individual matches",
        isAvailable: true
      }
    ],
    totalQuantity: 2
  }
]

const SponsorshipContext = createContext<SponsorshipContextType | undefined>(undefined)

export function SponsorshipProvider({ children }: { children: React.ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS)
  const [offerings, setOfferings] = useState<SponsorshipOffering[]>(INITIAL_OFFERINGS)
  const [bookings, setBookings] = useState<SponsorshipBooking[]>([])
  const [categories, setCategories] = useState<string[]>(['Gold', 'Silver', 'Bronze'])
  const [gameSchedule, setGameSchedule] = useState<GameSchedule[]>(INITIAL_SCHEDULE)
  const [isLoading, setIsLoading] = useState(false)

  const addSponsor = (sponsor: Sponsor) => {
    setSponsors(prev => [...prev, { ...sponsor, id: sponsor.id || uuidv4() }])
    toast.success('Sponsor added successfully')
  }

  const editSponsor = (sponsor: Sponsor) => {
    setSponsors(prev => prev.map(s => s.id === sponsor.id ? sponsor : s))
    toast.success('Sponsor updated successfully')
  }

  const deleteSponsor = (sponsorId: string) => {
    setSponsors(prev => prev.filter(s => s.id !== sponsorId))
    toast.success('Sponsor deleted successfully')
  }

  const addOffering = (offering: SponsorshipOffering) => {
    setOfferings(prev => [...prev, { ...offering, id: uuidv4() }])
    toast.success('Offering added successfully')
  }

  const editOffering = (offering: SponsorshipOffering) => {
    setOfferings(prev => prev.map(o => o.id === offering.id ? offering : o))
    toast.success('Offering updated successfully')
  }

  const deleteOffering = (offeringId: string) => {
    setOfferings(prev => prev.filter(o => o.id !== offeringId))
    toast.success('Offering deleted successfully')
  }

  const addBooking = (booking: SponsorshipBooking) => {
    setBookings(prev => [...prev, { ...booking, id: uuidv4() }])
    toast.success('Booking added successfully')
  }

  const editBooking = (booking: SponsorshipBooking) => {
    setBookings(prev => prev.map(b => b.id === booking.id ? booking : b))
    toast.success('Booking updated successfully')
  }

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId))
    toast.success('Booking deleted successfully')
  }

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category])
  }

  const updateCategory = (oldCategory: string, newCategory: string) => {
    setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c))
    setSponsors(prev => prev.map(sponsor => 
      sponsor.category === oldCategory 
        ? { ...sponsor, category: newCategory }
        : sponsor
    ))
  }

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category))
  }

  const addGame = (game: GameSchedule) => {
    setGameSchedule(prev => [...prev, { ...game, id: uuidv4() }])
    toast.success('Game added successfully')
  }

  const value = {
    sponsors,
    offerings,
    bookings,
    categories,
    gameSchedule,
    isLoading,
    addSponsor,
    editSponsor,
    deleteSponsor,
    addOffering,
    editOffering,
    deleteOffering,
    addBooking,
    editBooking,
    deleteBooking,
    addCategory,
    updateCategory,
    deleteCategory,
    addGame
  }

  return (
    <SponsorshipContext.Provider value={value}>
      {children}
    </SponsorshipContext.Provider>
  )
}

export function useSponsorship() {
  const context = useContext(SponsorshipContext)
  if (context === undefined) {
    throw new Error('useSponsorship must be used within a SponsorshipProvider')
  }
  return context
}

