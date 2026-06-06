import type { Sport } from '@/types/domain/sport';

export const sports: Sport[] = [
  {
    id: 'sp_001',
    slug: 'cricket',
    name: 'Cricket',
    description:
      'A bat-and-ball sport played between two teams of eleven. The most-followed sport in India with a deep talent pathway from school cricket to IPL.',
    icon: '/icons/sports/cricket.svg',
    coverImage: '/images/sports/cricket.jpg',
    category: 'team',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'Inter-school and club cricket' },
        { key: 'state', label: 'State', description: 'Ranji Trophy, Syed Mushtaq Ali, Vijay Hazare' },
        { key: 'national', label: 'National', description: 'Irani Cup, Duleep Trophy, India A' },
        { key: 'international', label: 'International', description: 'IPL, ICC World Cup, Test cricket' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 35 },
      physicalRequirements: ['Hand-eye coordination', 'Stamina for long-format play', 'Running between wickets'],
      notes:
        'Children can start with soft-ball cricket at age 6. Hard-ball and pace bowling are typically introduced after puberty.',
    },
    status: 'published',
  },
  {
    id: 'sp_002',
    slug: 'football',
    name: 'Football',
    description:
      'The world’s most popular sport, governed by AIFF in India with a growing professional ecosystem through ISL and I-League.',
    icon: '/icons/sports/football.svg',
    coverImage: '/images/sports/football.jpg',
    category: 'team',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District Football Associations' },
        { key: 'state', label: 'State', description: 'State leagues and Santosh Trophy' },
        { key: 'national', label: 'National', description: 'I-League, Indian Super League, national team camps' },
        { key: 'international', label: 'International', description: 'AFC Cup, AFC Champions League, FIFA events' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 5, max: 40 },
      physicalRequirements: ['Cardiovascular endurance', 'Agility and balance', 'Lower-body strength'],
      notes: 'Grassroots football begins at age 5–6 with small-sided games.',
    },
    status: 'published',
  },
  {
    id: 'sp_003',
    slug: 'badminton',
    name: 'Badminton',
    description:
      'A fast indoor racquet sport. India is a global powerhouse, with consistent Olympic and World Championship medal production.',
    icon: '/icons/sports/badminton.svg',
    coverImage: '/images/sports/badminton.jpg',
    category: 'racquet',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District-level ranking tournaments' },
        { key: 'state', label: 'State', description: 'State championships and Senior Nationals qualifiers' },
        { key: 'national', label: 'National', description: 'Senior Nationals, India Open, BWF Tour' },
        { key: 'international', label: 'International', description: 'Olympic Games, BWF World Tour, Thomas & Uber Cup' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 35 },
      physicalRequirements: ['Agility', 'Vertical jump', 'Reaction time'],
      notes: 'Racket control drills can start from age 6; competitive play from 9–10.',
    },
    status: 'published',
  },
  {
    id: 'sp_004',
    slug: 'tennis',
    name: 'Tennis',
    description:
      'Individual and doubles racquet sport with a clear ITF junior-to-professional pathway. Growing rapidly in Indian cities.',
    icon: '/icons/sports/tennis.svg',
    coverImage: '/images/sports/tennis.jpg',
    category: 'racquet',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'AITA district ranking series' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'AITA National Championships, ITF juniors' },
        { key: 'international', label: 'International', description: 'Grand Slams, ATP/WTA Tour, Davis Cup' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 5, max: 40 },
      physicalRequirements: ['Coordination', 'Speed and stamina', 'Core strength'],
    },
    status: 'published',
  },
  {
    id: 'sp_005',
    slug: 'table-tennis',
    name: 'Table Tennis',
    description:
      'A high-speed indoor racquet sport. India has produced senior World Championship and Olympic medalists.',
    icon: '/icons/sports/table-tennis.svg',
    coverImage: '/images/sports/table-tennis.jpg',
    category: 'racquet',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'TTFI district ranking' },
        { key: 'state', label: 'State', description: 'State-level championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, UTT, WTT events' },
        { key: 'international', label: 'International', description: 'Olympic Games, World Championships' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 35 },
      physicalRequirements: ['Reflexes', 'Hand-eye coordination', 'Wrist flexibility'],
    },
    status: 'published',
  },
  {
    id: 'sp_006',
    slug: 'swimming',
    name: 'Swimming',
    description:
      'Competitive pool swimming with stroke specialisation (freestyle, backstroke, breaststroke, butterfly) and open-water events.',
    icon: '/icons/sports/swimming.svg',
    coverImage: '/images/sports/swimming.jpg',
    category: 'aquatic',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District aquatics meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior National Aquatic Championship, Khelo India' },
        { key: 'international', label: 'International', description: 'World Aquatics, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 4, max: 50 },
      physicalRequirements: ['Shoulder mobility', 'Breath control', 'Full-body endurance'],
      notes: 'Water familiarisation can start as early as age 4.',
    },
    status: 'published',
  },
  {
    id: 'sp_007',
    slug: 'athletics',
    name: 'Athletics',
    description:
      'Track and field events including sprints, middle distance, jumps, throws, and decathlon. India’s Neeraj Chopra has made it globally aspirational.',
    icon: '/icons/sports/athletics.svg',
    coverImage: '/images/sports/athletics.jpg',
    category: 'athletics',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District athletics meets' },
        { key: 'state', label: 'State', description: 'State Open, Inter-State Championships' },
        { key: 'national', label: 'National', description: 'Federation Cup, National Inter-State, Khelo India' },
        { key: 'international', label: 'International', description: 'World Athletics, Diamond League, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 7, max: 40 },
      physicalRequirements: ['Speed and power', 'Flexibility', 'Event-specific technique'],
    },
    status: 'published',
  },
  {
    id: 'sp_008',
    slug: 'wrestling',
    name: 'Wrestling',
    description:
      'Freestyle and Greco-Roman wrestling, with strongholds in Haryana, Punjab, and Maharashtra. India has produced Olympic medallists in the discipline.',
    icon: '/icons/sports/wrestling.svg',
    coverImage: '/images/sports/wrestling.jpg',
    category: 'combat',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District championships' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'National Championships, WFI selection trials' },
        { key: 'international', label: 'International', description: 'Asian Games, World Championships, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 8, max: 35 },
      physicalRequirements: ['Full-body strength', 'Grip strength', 'Cardiovascular endurance'],
    },
    status: 'published',
  },
  {
    id: 'sp_009',
    slug: 'boxing',
    name: 'Boxing',
    description:
      'Olympic-style amateur boxing with a strong Indian tradition, especially in the North-East and Haryana.',
    icon: '/icons/sports/boxing.svg',
    coverImage: '/images/sports/boxing.jpg',
    category: 'combat',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District boxing meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, India Open' },
        { key: 'international', label: 'International', description: 'World Boxing Championships, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 9, max: 35 },
      physicalRequirements: ['Speed', 'Power', 'Endurance and core stability'],
    },
    status: 'published',
  },
  {
    id: 'sp_010',
    slug: 'karate',
    name: 'Karate',
    description:
      'Traditional striking art with kata, kumite, and WKF-aligned competition formats. Strong base in the North-East and Kerala.',
    icon: '/icons/sports/karate.svg',
    coverImage: '/images/sports/karate.jpg',
    category: 'combat',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District championships' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'National Championships' },
        { key: 'international', label: 'International', description: 'Asian Karate Championship, World Karate Championship' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 40 },
      physicalRequirements: ['Flexibility', 'Discipline', 'Speed and power'],
    },
    status: 'published',
  },
  {
    id: 'sp_011',
    slug: 'judo',
    name: 'Judo',
    description:
      'Olympic martial art emphasising throws, pins, and submissions. India has produced multiple continental medallists.',
    icon: '/icons/sports/judo.svg',
    coverImage: '/images/sports/judo.jpg',
    category: 'combat',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District championships' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, JFI selection events' },
        { key: 'international', label: 'International', description: 'World Judo Tour, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 40 },
      physicalRequirements: ['Balance', 'Full-body coordination', 'Mental discipline'],
    },
    status: 'published',
  },
  {
    id: 'sp_012',
    slug: 'kabaddi',
    name: 'Kabaddi',
    description:
      'India’s indigenous contact team sport. The Pro Kabaddi League has driven a professional revival since 2014.',
    icon: '/icons/sports/kabaddi.svg',
    coverImage: '/images/sports/kabaddi.jpg',
    category: 'team',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District leagues' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, Pro Kabaddi League' },
        { key: 'international', label: 'International', description: 'Asian Games, Kabaddi World Cup' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 8, max: 35 },
      physicalRequirements: ['Strength', 'Lung capacity', 'Tactical awareness'],
    },
    status: 'published',
  },
  {
    id: 'sp_013',
    slug: 'hockey',
    name: 'Hockey',
    description:
      'Field hockey. India’s most decorated Olympic team sport, with a deep talent base in Punjab, Odisha, and Karnataka.',
    icon: '/icons/sports/hockey.svg',
    coverImage: '/images/sports/hockey.jpg',
    category: 'team',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District hockey meets' },
        { key: 'state', label: 'State', description: 'State championships, Hockey India League' },
        { key: 'national', label: 'National', description: 'Senior Nationals, Junior Nationals' },
        { key: 'international', label: 'International', description: 'FIH Pro League, World Cup, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 35 },
      physicalRequirements: ['Stamina', 'Agility', 'Stick-handling skills'],
    },
    status: 'published',
  },
  {
    id: 'sp_014',
    slug: 'chess',
    name: 'Chess',
    description:
      'A 64-square strategy game with a thriving Indian professional scene, anchored by Viswanathan Anand.',
    icon: '/icons/sports/chess.svg',
    coverImage: '/images/sports/chess.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District open tournaments' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'National Championship, AICF events' },
        { key: 'international', label: 'International', description: 'FIDE Grand Prix, World Championship, Olympiad' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 4, max: 80 },
      physicalRequirements: ['Focus', 'Pattern recognition', 'Memory'],
      notes: 'Many grandmasters begin formal training at age 5–7.',
    },
    status: 'published',
  },
  {
    id: 'sp_015',
    slug: 'skating',
    name: 'Skating',
    description:
      'Inline and quad skating across speed, artistic, roller hockey, and skateboarding disciplines.',
    icon: '/icons/sports/skating.svg',
    coverImage: '/images/sports/skating.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District skating meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'RSFI National Championship, Khelo India' },
        { key: 'international', label: 'International', description: 'World Skate Games, Asian Championships' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 4, max: 30 },
      physicalRequirements: ['Balance', 'Leg strength', 'Flexibility'],
    },
    status: 'published',
  },
  {
    id: 'sp_016',
    slug: 'archery',
    name: 'Archery',
    description:
      'Recurve and compound archery, with strongholds in Jharkhand, Manipur, and the North-East. India is a global medal contender.',
    icon: '/icons/sports/archery.svg',
    coverImage: '/images/sports/archery.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District archery meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, Archery Association of India selection events' },
        { key: 'international', label: 'International', description: 'World Archery Championships, Olympic Games, Asian Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 8, max: 45 },
      physicalRequirements: ['Steady hand', 'Core stability', 'Visual focus'],
    },
    status: 'published',
  },
  {
    id: 'sp_017',
    slug: 'shooting',
    name: 'Shooting',
    description:
      'Rifle, pistol, and shotgun disciplines. India has produced multiple Olympic medallists in shooting.',
    icon: '/icons/sports/shooting.svg',
    coverImage: '/images/sports/shooting.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District trials' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'National Shooting Championship, ISSF selection events' },
        { key: 'international', label: 'International', description: 'ISSF World Cup, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 10, max: 60 },
      physicalRequirements: ['Composure', 'Steady hand', 'Visual focus'],
      notes: 'Formal air-rifle training usually starts around age 10–12.',
    },
    status: 'published',
  },
  {
    id: 'sp_018',
    slug: 'yoga',
    name: 'Yoga',
    description:
      'A traditional Indian practice with modern application in flexibility, balance, breathwork, and competition yoga.',
    icon: '/icons/sports/yoga.svg',
    coverImage: '/images/sports/yoga.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District yoga meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'National Yogasana Championship' },
        { key: 'international', label: 'International', description: 'Asian Yogasana Championship, World Yogasana Championship' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 5, max: 80 },
      physicalRequirements: ['Flexibility', 'Balance', 'Breath control'],
    },
    status: 'published',
  },
  {
    id: 'sp_019',
    slug: 'gymnastics',
    name: 'Gymnastics',
    description:
      'Artistic, rhythmic, and trampoline gymnastics. India has produced continental medal winners in rhythmic and trampoline.',
    icon: '/icons/sports/gymnastics.svg',
    coverImage: '/images/sports/gymnastics.jpg',
    category: 'individual',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District gymnastics meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, Khelo India' },
        { key: 'international', label: 'International', description: 'World Championships, Asian Games, Olympic Games' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 4, max: 25 },
      physicalRequirements: ['Flexibility', 'Spatial awareness', 'Strength-to-weight ratio'],
      notes: 'Foundational gymnastics can start as early as age 4–5.',
    },
    status: 'published',
  },
  {
    id: 'sp_020',
    slug: 'basketball',
    name: 'Basketball',
    description:
      'A team sport played worldwide, with a growing Indian professional league (Basketball India League) and a strong school ecosystem.',
    icon: '/icons/sports/basketball.svg',
    coverImage: '/images/sports/basketball.jpg',
    category: 'team',
    competitionPathway: {
      levels: [
        { key: 'district', label: 'District', description: 'District basketball meets' },
        { key: 'state', label: 'State', description: 'State championships' },
        { key: 'national', label: 'National', description: 'Senior Nationals, Basketball India League' },
        { key: 'international', label: 'International', description: 'FIBA Asia Cup, Olympic Games, FIBA World Cup' },
      ],
    },
    explorationGuidance: {
      ageSuitability: { min: 6, max: 35 },
      physicalRequirements: ['Vertical jump', 'Coordination', 'Endurance'],
    },
    status: 'published',
  },
];

export const sportBySlug = (slug: string): Sport | undefined =>
  sports.find((s) => s.slug === slug);

export const sportById = (id: string): Sport | undefined =>
  sports.find((s) => s.id === id);
