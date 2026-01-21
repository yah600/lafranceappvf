export const MOCK_USERS = [
  // Super Admin
  {
    id: 'user-001',
    email: 'gabriel@lafrance.com',
    password: 'admin123',
    name: 'Gabriel Lafrance',
    role: 'super-admin',
    divisions: ['plomberie', 'construction', 'toitures', 'isolation', 'conteneurs', 'gutters', 'decks', 'real-estate'],
    phone: '514-555-0001',
    avatar: null,
  },

  // Division Heads
  {
    id: 'user-002',
    email: 'michael@lafrance.com',
    password: 'plomb123',
    name: 'Michael Lacoste',
    role: 'division-head',
    division: 'plomberie',
    divisions: ['plomberie'],
    license: 'CMMTQ M123456',
    phone: '514-555-0002',
  },
  {
    id: 'user-003',
    email: 'jonathan@lafrance.com',
    password: 'toit123',
    name: 'Jonathan Isabel',
    role: 'division-head',
    division: 'toitures',
    divisions: ['toitures'],
    license: 'RBQ 5726-XXXX-01',
    phone: '450-555-0003',
  },

  // Dispatcher
  {
    id: 'user-004',
    email: 'dispatcher@lafrance.com',
    password: 'dispatch123',
    name: 'Sophie Tremblay',
    role: 'dispatcher',
    division: 'plomberie',
    divisions: ['plomberie'],
    phone: '514-555-0004',
  },

  // Technicians
  {
    id: 'tech-001',
    email: 'marc@lafrance.com',
    password: 'tech123',
    name: 'Marc Lefebvre',
    role: 'technician',
    divisions: ['plomberie'],
    licenses: {
      CMMTQ: 'M123457',
      CNESST: 'Valid',
      RQ: 'Valid',
    },
    rating: 4.8,
    completedJobs: 342,
    phone: '514-555-1001',
    status: 'available',
    acceptsUrgent: true,
    serviceRadius: 50,
  },
  {
    id: 'tech-002',
    email: 'pierre@lafrance.com',
    password: 'tech123',
    name: 'Pierre Laval',
    role: 'technician',
    divisions: ['plomberie'],
    licenses: {
      CMMTQ: 'M123458',
      CNESST: 'Valid',
      RQ: 'Valid',
    },
    rating: 4.9,
    completedJobs: 189,
    phone: '514-555-1002',
    status: 'busy',
    currentJob: 'job-003',
    acceptsUrgent: true,
    serviceRadius: 30,
  },
  {
    id: 'tech-003',
    email: 'jean@lafrance.com',
    password: 'tech123',
    name: 'Jean Dupont',
    role: 'technician',
    divisions: ['plomberie', 'construction'],
    licenses: {
      CMMTQ: 'M123459',
      RBQ: '5726-1111-01',
      CNESST: 'Valid',
      RQ: 'Valid',
    },
    rating: 4.7,
    completedJobs: 256,
    phone: '514-555-1003',
    status: 'available',
    acceptsUrgent: true,
    serviceRadius: 40,
  },

  // Client
  {
    id: 'client-001',
    email: 'jean.bertrand@example.com',
    password: 'client123',
    name: 'Jean-Paul Bertrand',
    role: 'client',
    phone: '450-555-2001',
    addresses: [
      {
        id: 'addr-001',
        type: 'primary',
        street: '45 Rue Principale',
        city: 'Brossard',
        province: 'QC',
        postalCode: 'J4X 1A1',
        coordinates: { lat: 45.4523, lng: -73.4654 },
      },
    ],
    joinedDate: '2024-03-15',
  },
  {
    id: 'client-002',
    email: 'marie.tremblay@example.com',
    password: 'client123',
    name: 'Marie Tremblay',
    role: 'client',
    phone: '514-555-2002',
    addresses: [
      {
        id: 'addr-002',
        type: 'primary',
        street: '123 Boulevard Saint-Laurent',
        city: 'Montréal',
        province: 'QC',
        postalCode: 'H2T 1R5',
        coordinates: { lat: 45.5231, lng: -73.5956 },
      },
    ],
    joinedDate: '2025-01-10',
  },
]

export const getMockUserByEmail = (email) => {
  return MOCK_USERS.find((user) => user.email === email)
}

export const getMockUserById = (id) => {
  return MOCK_USERS.find((user) => user.id === id)
}
