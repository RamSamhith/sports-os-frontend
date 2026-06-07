import type { Coach } from '@/types/domain/coach';

export const coaches: Coach[] = [
  {
    id: 'co_001',
    slug: 'rahul-dravid-cricket-bengaluru',
    name: 'Rahul Dravid',
    avatar: '/images/coaches/rahul-dravid-cricket-bengaluru.svg',
    certifications: [
      { name: 'BCCI Level 3 Coach', issuer: 'BCCI', year: 2014 },
      { name: 'ICC Level 2 Coach', issuer: 'International Cricket Council', year: 2017 },
    ],
    experienceYears: 18,
    sportsCoached: ['cricket'],
    specialization: ['batting', 'red-ball technique', 'youth development'],
    academyId: 'ac_001',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'IN',
      lat: 12.9789,
      lng: 77.5996,
    },
    contact: {
      phone: '+91 98 6012 9001',
      email: 'coach.dravid@nationalcricketacademy.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.9, count: 184 },
    status: 'published',
    lastUpdatedAt: '2026-05-01T09:30:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'co_002',
    slug: 'anil-kumble-spin-bengaluru',
    name: 'Anil Kumble',
    avatar: '/images/coaches/anil-kumble-spin-bengaluru.svg',
    certifications: [
      { name: 'BCCI Level 2 Coach', issuer: 'BCCI', year: 2013 },
    ],
    experienceYears: 22,
    sportsCoached: ['cricket'],
    specialization: ['spin bowling', 'match strategy', 'mentorship'],
    academyId: 'ac_001',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'IN',
      lat: 12.9789,
      lng: 77.5996,
    },
    contact: {
      email: 'coach.kumble@nationalcricketacademy.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.9, count: 142 },
    status: 'published',
    lastUpdatedAt: '2026-04-20T11:10:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'co_003',
    slug: 'saina-nehwal-badminton-hyderabad',
    name: 'Saina Nehwal',
    avatar: '/images/coaches/saina-nehwal-badminton-hyderabad.svg',
    certifications: [
      { name: 'BWF Coach Education Level 2', issuer: 'Badminton World Federation', year: 2018 },
    ],
    experienceYears: 9,
    sportsCoached: ['badminton'],
    specialization: ['singles', 'footwork', 'rally endurance'],
    academyId: 'ac_003',
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'IN',
      lat: 17.4399,
      lng: 78.3569,
    },
    contact: {
      phone: '+91 99 4900 1850',
      email: 'saina@pgbadminton.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.8, count: 211 },
    status: 'published',
    lastUpdatedAt: '2026-04-29T14:25:00.000Z',
    createdAt: '2023-09-10T00:00:00.000Z',
  },
  {
    id: 'co_004',
    slug: 'pankaj-advani-billiards-bengaluru',
    name: 'Pankaj Advani',
    avatar: '/images/coaches/pankaj-advani-billiards-bengaluru.svg',
    certifications: [
      { name: 'World Billiards Cert. Coach', issuer: 'World Billiards & Snooker Federation', year: 2019 },
    ],
    experienceYears: 14,
    sportsCoached: ['chess'],
    specialization: ['cue sports', 'mental focus', 'long-format endurance'],
    academyId: 'ac_008',
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'IN',
      lat: 12.9789,
      lng: 77.5996,
    },
    contact: {
      email: 'pankaj@chessgurukul.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.7, count: 78 },
    status: 'published',
    lastUpdatedAt: '2026-03-12T10:00:00.000Z',
    createdAt: '2024-07-18T00:00:00.000Z',
  },
  {
    id: 'co_005',
    slug: 'viren-raquib-athletics-bengaluru',
    name: 'Viren Raquib',
    avatar: '/images/coaches/viren-raquib-athletics-bengaluru.svg',
    certifications: [
      { name: 'IAAF Level 2 Sprints Coach', issuer: 'World Athletics', year: 2017 },
      { name: 'NSNIS Diploma in Sports Coaching', issuer: 'NSNIS Patiala', year: 2015 },
    ],
    experienceYears: 12,
    sportsCoached: ['athletics'],
    specialization: ['sprints', 'relay handoffs', 'speed endurance'],
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'IN',
      lat: 12.9789,
      lng: 77.5996,
    },
    contact: {
      phone: '+91 99 1650 2200',
      email: 'viren.athletics@gmail.com',
    },
    verificationStatus: 'verified',
    rating: { average: 4.6, count: 64 },
    status: 'published',
    lastUpdatedAt: '2026-04-11T08:45:00.000Z',
    createdAt: '2024-08-01T00:00:00.000Z',
  },
  {
    id: 'co_006',
    slug: 'sushil-kumar-wrestling-delhi',
    name: 'Sushil Kumar',
    avatar: '/images/coaches/sushil-kumar-wrestling-delhi.svg',
    certifications: [
      { name: 'WFI National Coaching Cert.', issuer: 'Wrestling Federation of India', year: 2014 },
    ],
    experienceYears: 16,
    sportsCoached: ['wrestling'],
    specialization: ['freestyle wrestling', 'olympic lifting fundamentals', 'competition prep'],
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      country: 'IN',
      lat: 28.6139,
      lng: 77.209,
    },
    contact: {
      phone: '+91 98 1810 4500',
      email: 'coach.sushil@delhiwrestling.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.7, count: 92 },
    status: 'published',
    lastUpdatedAt: '2026-05-05T16:20:00.000Z',
    createdAt: '2024-03-22T00:00:00.000Z',
  },
  {
    id: 'co_007',
    slug: 'mary-komar-boxing-rohtak',
    name: 'Mary Kom',
    avatar: '/images/coaches/mary-komar-boxing-rohtak.svg',
    certifications: [
      { name: 'AIBA 3-Star Coach', issuer: 'International Boxing Association', year: 2016 },
    ],
    experienceYears: 13,
    sportsCoached: ['boxing'],
    specialization: ['flyweight', 'footwork', 'mental conditioning'],
    location: {
      city: 'Rohtak',
      state: 'Haryana',
      country: 'IN',
      lat: 28.8955,
      lng: 76.6066,
    },
    contact: {
      email: 'coach.marykom@rohtakboxing.in',
    },
    verificationStatus: 'verified',
    rating: { average: 4.8, count: 109 },
    status: 'published',
    lastUpdatedAt: '2026-04-26T12:00:00.000Z',
    createdAt: '2024-04-30T00:00:00.000Z',
  },
  {
    id: 'co_008',
    slug: 'arjun-jadhav-table-tennis-pune',
    name: 'Arjun Jadhav',
    avatar: '/images/coaches/arjun-jadhav-table-tennis-pune.svg',
    certifications: [
      { name: 'ITTF Level 1 Coach', issuer: 'International Table Tennis Federation', year: 2019 },
    ],
    experienceYears: 8,
    sportsCoached: ['table-tennis'],
    specialization: ['defensive play', 'serve variation', 'junior development'],
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'IN',
      lat: 18.5204,
      lng: 73.8567,
    },
    contact: {
      phone: '+91 98 6011 0099',
      email: 'arjun.tt@puneacademy.in',
    },
    verificationStatus: 'pending',
    rating: { average: 4.4, count: 38 },
    status: 'published',
    lastUpdatedAt: '2026-03-04T09:00:00.000Z',
    createdAt: '2025-01-20T00:00:00.000Z',
  },
];

export const coachBySlug = (slug: string): Coach | undefined =>
  coaches.find((c) => c.slug === slug);

export const coachesById = (id: string): Coach | undefined =>
  coaches.find((c) => c.id === id);

export const coachesBySlug = (slug: string): Coach | undefined =>
  coaches.find((c) => c.slug === slug);

export const coachById = (id: string): Coach | undefined =>
  coaches.find((c) => c.id === id);
