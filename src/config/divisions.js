export const DIVISIONS = [
  {
    id: 'plomberie',
    name: 'Plomberie Michaël Lacoste',
    nameFr: 'Plomberie Michaël Lacoste',
    shortName: 'Plomberie',
    color: '#2B5A8E',
    icon: 'Wrench',
    license: 'CMMTQ',
    licenseNumber: 'M123456',
    contact: {
      name: 'Michael Lacoste',
      phone: '514-XXX-XXXX',
      email: 'michael@plomberiemichaellacoste.com',
    },
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'J4', 'J3'],
    active: true,
  },
  {
    id: 'construction',
    name: 'GAB Lafrance Construction',
    nameFr: 'GAB Lafrance Construction',
    shortName: 'Construction',
    color: '#1C3D5A',
    icon: 'HardHat',
    license: 'RBQ',
    licenseNumber: '5726-2941-01',
    contact: {
      name: 'Gabriel Lafrance',
      phone: '514-XXX-XXXX',
      email: 'gabriel@gablafrance.com',
    },
    serviceArea: ['H1', 'H2', 'H3', 'H4', 'J4', 'J3'],
    active: true,
  },
  {
    id: 'toitures',
    name: 'Les Toitures Jonathan Isabel',
    nameFr: 'Les Toitures Jonathan Isabel',
    shortName: 'Toitures',
    color: '#8B4513',
    icon: 'Home',
    license: 'RBQ - Cat 7',
    licenseNumber: '5726-XXXX-01',
    contact: {
      name: 'Jonathan Isabel',
      phone: '450-XXX-XXXX',
      email: 'jonathan@toituresisabel.com',
    },
    serviceArea: ['J4', 'J3', 'H1', 'H2'],
    active: true,
  },
  {
    id: 'isolation',
    name: 'Isolation Mike Turmel',
    nameFr: 'Isolation Mike Turmel',
    shortName: 'Isolation',
    color: '#FF8C00',
    icon: 'Wind',
    license: 'RBQ - Cat 7',
    licenseNumber: '5726-YYYY-01',
    contact: {
      name: 'Mike Turmel',
      phone: '450-XXX-XXXX',
      email: 'mike@isolationturmel.com',
    },
    serviceArea: ['H1', 'H2', 'H3', 'J4'],
    active: true,
  },
  {
    id: 'conteneurs',
    name: 'Conteneurs Mira',
    nameFr: 'Conteneurs Mira',
    shortName: 'Conteneurs',
    color: '#4A7C59',
    icon: 'Container',
    license: 'Transport',
    licenseNumber: 'TQ-XXXX',
    contact: {
      name: 'Équipe Mira',
      phone: '514-XXX-XXXX',
      email: 'info@conteneursmira.com',
    },
    serviceArea: ['All Montreal'],
    active: true,
  },
  {
    id: 'gutters',
    name: 'Gouttières et Revêtements Alex Roussin',
    nameFr: 'Gouttières et Revêtements Alex Roussin',
    shortName: 'Gouttières',
    color: '#708090',
    icon: 'Droplet',
    license: 'RBQ - Cat 7',
    licenseNumber: '5726-ZZZZ-01',
    contact: {
      name: 'Alex Roussin',
      phone: '450-XXX-XXXX',
      email: 'alex@gouttieresroussin.com',
    },
    serviceArea: ['J4', 'J3', 'H1'],
    active: true,
  },
  {
    id: 'decks',
    name: 'Patio Terrasse Francis Girard',
    nameFr: 'Patio Terrasse Francis Girard',
    shortName: 'Patio/Terrasse',
    color: '#8B7355',
    icon: 'Table',
    license: 'RBQ - Cat 6',
    licenseNumber: '5726-AAAA-01',
    contact: {
      name: 'Francis Girard',
      phone: '450-XXX-XXXX',
      email: 'francis@patiogirard.com',
    },
    serviceArea: ['J4', 'J3', 'H2'],
    active: true,
  },
  {
    id: 'real-estate',
    name: 'Maison Cash',
    nameFr: 'Maison Cash',
    shortName: 'Immobilier',
    color: '#DAA520',
    icon: 'Building',
    license: 'Courtier',
    licenseNumber: 'OACIQ-XXXX',
    contact: {
      name: 'Équipe Maison Cash',
      phone: '514-XXX-XXXX',
      email: 'info@maisoncash.com',
    },
    serviceArea: ['All Quebec'],
    active: true,
  },
]

export const getDivisionById = (id) => {
  return DIVISIONS.find((div) => div.id === id)
}

export const getDivisionColor = (id) => {
  return getDivisionById(id)?.color || '#000000'
}

export const getDivisionName = (id) => {
  return getDivisionById(id)?.name || 'Unknown'
}
