import type { Competition } from '@/types/domain/competition';

/**
 * Curated list of well-known Indian and international competitions,
 * mapped to the sport slug. Used to surface "Pathway" and "Competitions"
 * sections on each sport page.
 *
 * The content is concise on purpose — every competition answers
 * five questions in 1–2 short lines: what, level, organiser,
 * why it matters, how it helps progression.
 */
export const competitions: Competition[] = [
  // ---------------- CRICKET ----------------
  {
    id: 'cricket_ranji_trophy',
    sportSlug: 'cricket',
    name: 'Ranji Trophy',
    level: 'state',
    organiser: 'Board of Control for Cricket in India (BCCI)',
    whatIs:
      'India’s premier first-class domestic cricket championship, contested by state and unit teams.',
    whyImportant:
      'The primary pathway for selection to the India national team and the Indian Premier League.',
    progression:
      'Strong Ranji performances lead to India A call-ups and eventual national selection.',
  },
  {
    id: 'cricket_vijay_hazare',
    sportSlug: 'cricket',
    name: 'Vijay Hazare Trophy',
    level: 'state',
    organiser: 'BCCI',
    whatIs: 'India’s premier List A (one-day) domestic cricket tournament.',
    whyImportant:
      'The key one-day selection tournament feeding into India A and IPL auctions.',
    progression:
      'Standout Vijay Hazare performers are scouted for India A ODI squads and the IPL.',
  },
  {
    id: 'cricket_syed_mushtaq_ali',
    sportSlug: 'cricket',
    name: 'Syed Mushtaq Ali Trophy',
    level: 'state',
    organiser: 'BCCI',
    whatIs: 'India’s premier domestic T20 cricket competition.',
    whyImportant:
      'Primary short-form selection tournament; strong performances draw IPL contracts.',
    progression:
      'Top performers are bought in the IPL auction and selected for India T20I squads.',
  },
  {
    id: 'cricket_irani_cup',
    sportSlug: 'cricket',
    name: 'Irani Cup',
    level: 'national',
    organiser: 'BCCI',
    whatIs:
      'Annual first-class match between the Ranji Trophy champion and the Rest of India.',
    whyImportant:
      'A traditional proving ground for India-eligible players ahead of national selection.',
    progression:
      'Irani Cup performance is a near-direct reference for national team selection panels.',
  },
  {
    id: 'cricket_duleep_trophy',
    sportSlug: 'cricket',
    name: 'Duleep Trophy',
    level: 'national',
    organiser: 'BCCI',
    whatIs: 'Inter-zonal first-class competition between India’s five cricketing zones.',
    whyImportant:
      'A key India A trial tournament; selectors use it to track red-ball form.',
    progression: 'Strong Duleep Trophy runs lead to India A and senior Test call-ups.',
  },
  {
    id: 'cricket_ipl',
    sportSlug: 'cricket',
    name: 'Indian Premier League',
    level: 'international',
    organiser: 'BCCI',
    whatIs: 'The world’s most-attended T20 franchise league.',
    whyImportant:
      'The single biggest performance platform for Indian and overseas players.',
    progression:
      'IPL performance often translates to national selection and overseas T20 contracts.',
  },
  {
    id: 'cricket_khelo_india',
    sportSlug: 'cricket',
    name: 'Khelo India',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports, Government of India',
    whatIs:
      'Multi-sport national event with a cricket component for Under-17 and Under-21.',
    whyImportant:
      'Flagship grassroots-to-elite pathway, with annual sports scholarships on offer.',
    progression:
      'Medal winners receive annual training grants and are tracked by national federations.',
  },

  // ---------------- FOOTBALL ----------------
  {
    id: 'football_santosh_trophy',
    sportSlug: 'football',
    name: 'Santosh Trophy',
    level: 'national',
    organiser: 'All India Football Federation (AIFF)',
    whatIs: 'India’s premier inter-state football championship.',
    whyImportant:
      'The traditional pathway for Indian players into the national team.',
    progression:
      'Strong Santosh Trophy runs lead to I-League and ISL contracts.',
  },
  {
    id: 'football_isl',
    sportSlug: 'football',
    name: 'Indian Super League',
    level: 'national',
    organiser: 'AIFF / Football Sports Development Limited',
    whatIs: 'India’s top-flight professional football league.',
    whyImportant: 'The most visible performance platform for Indian players.',
    progression: 'ISL performance is the main route to the senior national team.',
  },
  {
    id: 'football_ileague',
    sportSlug: 'football',
    name: 'I-League',
    level: 'national',
    organiser: 'AIFF',
    whatIs: 'India’s second-tier professional football league.',
    whyImportant:
      'Developmental league for clubs and players building toward ISL-level football.',
    progression:
      'I-League standout performers are scouted for ISL and national-team camps.',
  },
  {
    id: 'football_durand_cup',
    sportSlug: 'football',
    name: 'Durand Cup',
    level: 'national',
    organiser: 'Durand Football Tournament Society',
    whatIs:
      'One of the oldest football tournaments in the world, contested by clubs and ISL teams.',
    whyImportant: 'Strong competitive platform, especially early in the Indian season.',
    progression:
      'Standout performers are scouted by ISL and I-League clubs for the season ahead.',
  },
  {
    id: 'football_afc_cup',
    sportSlug: 'football',
    name: 'AFC Cup',
    level: 'international',
    organiser: 'Asian Football Confederation',
    whatIs: 'Asia’s second-tier club competition.',
    whyImportant:
      'Pathway for clubs to gain continental experience and players to test themselves abroad.',
    progression: 'Top performers are scouted for AFC Champions League and national squads.',
  },
  {
    id: 'football_khelo_india',
    sportSlug: 'football',
    name: 'Khelo India',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports',
    whatIs: 'National grassroots multi-sport event including football.',
    whyImportant: 'Flagship annual platform for Under-17 and Under-21 footballers.',
    progression:
      'Medal winners receive annual training grants and AIFF talent-tracking.',
  },

  // ---------------- BADMINTON ----------------
  {
    id: 'badminton_senior_nationals',
    sportSlug: 'badminton',
    name: 'Senior National Badminton Championship',
    level: 'national',
    organiser: 'Badminton Association of India (BAI)',
    whatIs: 'India’s premier domestic badminton championship.',
    whyImportant:
      'The main domestic competition feeding India’s international badminton pipeline.',
    progression: 'Top performers are selected for the India national team.',
  },
  {
    id: 'badminton_india_open',
    sportSlug: 'badminton',
    name: 'India Open (BWF)',
    level: 'international',
    organiser: 'BWF / BAI',
    whatIs: 'BWF World Tour Super 750 event held in New Delhi.',
    whyImportant: 'A top-tier BWF event on home soil.',
    progression:
      'Strong India Open results translate into BWF World Tour ranking and Olympic qualification.',
  },
  {
    id: 'badminton_thomas_uber',
    sportSlug: 'badminton',
    name: 'Thomas & Uber Cup',
    level: 'international',
    organiser: 'Badminton World Federation',
    whatIs: 'Premier international team championships for men and women.',
    whyImportant: 'Flagship team event, hosted every two years.',
    progression:
      'Selection for Thomas / Uber Cup squads reflects senior national-team status.',
  },
  {
    id: 'badminton_yonex_open',
    sportSlug: 'badminton',
    name: 'Yonex-Sunrise India Open',
    level: 'international',
    organiser: 'BWF / BAI',
    whatIs: 'Annual BWF World Tour event in India.',
    whyImportant: 'A reliable BWF ranking event for Indian players.',
    progression: 'Top results push BWF World Tour ranking and Olympic qualification.',
  },
  {
    id: 'badminton_khelo_india',
    sportSlug: 'badminton',
    name: 'Khelo India (Badminton)',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports',
    whatIs: 'National grassroots multi-sport event including badminton.',
    whyImportant: 'Flagship annual platform for Under-17 and Under-21 shuttlers.',
    progression: 'Medal winners receive annual training grants and BAI talent-tracking.',
  },

  // ---------------- TENNIS ----------------
  {
    id: 'tennis_aita_nationals',
    sportSlug: 'tennis',
    name: 'AITA National Championship',
    level: 'national',
    organiser: 'All India Tennis Association (AITA)',
    whatIs: 'India’s premier domestic tennis championship.',
    whyImportant: 'The main domestic event for ITF junior and senior players.',
    progression: 'Top performers are selected for India’s Davis Cup / Fed Cup squads.',
  },
  {
    id: 'tennis_itf_juniors',
    sportSlug: 'tennis',
    name: 'ITF World Tennis Tour Juniors',
    level: 'international',
    organiser: 'International Tennis Federation (ITF)',
    whatIs: 'Global junior tour with Grade A, 1, 2, 3, 4, and 5 events.',
    whyImportant:
      'Junior ITF points are the primary entry path to the professional tour.',
    progression: 'Strong junior results feed the ITF Pro transition and Grand Slam qualifiers.',
  },
  {
    id: 'tennis_davis_cup',
    sportSlug: 'tennis',
    name: 'Davis Cup',
    level: 'international',
    organiser: 'ITF',
    whatIs: 'World’s largest annual international team competition in sport.',
    whyImportant:
      'Flagship team event; selection reflects senior national-team status.',
    progression: 'Davis Cup performance is a key marker of senior international pedigree.',
  },

  // ---------------- SWIMMING ----------------
  {
    id: 'swimming_senior_nationals',
    sportSlug: 'swimming',
    name: 'Senior National Aquatic Championship',
    level: 'national',
    organiser: 'Swimming Federation of India',
    whatIs: 'India’s premier domestic swimming competition.',
    whyImportant: 'The main domestic selection event for the India team.',
    progression:
      'Top performers are selected for international meets and Olympic qualification attempts.',
  },
  {
    id: 'swimming_khelo_india',
    sportSlug: 'swimming',
    name: 'Khelo India (Aquatics)',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports',
    whatIs: 'National grassroots multi-sport event including swimming.',
    whyImportant: 'Flagship annual platform for Under-17 and Under-21 swimmers.',
    progression: 'Medal winners receive annual training grants and federation tracking.',
  },
  {
    id: 'swimming_world_aquatics',
    sportSlug: 'swimming',
    name: 'World Aquatics Championships',
    level: 'international',
    organiser: 'World Aquatics (FINA)',
    whatIs: 'Biennial global swimming championships.',
    whyImportant: 'The highest level of international competition outside the Olympics.',
    progression:
      'Strong World Aquatics results lead to Olympic qualification and global ranking.',
  },

  // ---------------- ATHLETICS ----------------
  {
    id: 'athletics_federation_cup',
    sportSlug: 'athletics',
    name: 'Federation Cup',
    level: 'national',
    organiser: 'Athletics Federation of India (AFI)',
    whatIs: 'India’s premier domestic athletics meet.',
    whyImportant: 'Top domestic event for senior athletes.',
    progression: 'Selection for Asian and World Championships follows from here.',
  },
  {
    id: 'athletics_national_interstate',
    sportSlug: 'athletics',
    name: 'National Inter-State Senior Athletics',
    level: 'national',
    organiser: 'AFI',
    whatIs: 'Annual inter-state senior athletics championship.',
    whyImportant: 'Top domestic athletics event with national selection implications.',
    progression: 'Winners are picked for India’s international meets.',
  },
  {
    id: 'athletics_khelo_india',
    sportSlug: 'athletics',
    name: 'Khelo India (Athletics)',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports',
    whatIs: 'National grassroots multi-sport event including athletics.',
    whyImportant: 'Flagship annual platform for Under-17 and Under-21 athletes.',
    progression: 'Medal winners receive annual training grants and AFI tracking.',
  },
  {
    id: 'athletics_diamond_league',
    sportSlug: 'athletics',
    name: 'Diamond League',
    level: 'international',
    organiser: 'World Athletics',
    whatIs: 'Annual series of elite one-day track and field meetings.',
    whyImportant: 'Highest-level annual circuit for senior athletes.',
    progression:
      'Diamond League performance is a direct path to Olympic qualification.',
  },

  // ---------------- HOCKEY ----------------
  {
    id: 'hockey_hockey_india_league',
    sportSlug: 'hockey',
    name: 'Hockey India League',
    level: 'national',
    organiser: 'Hockey India',
    whatIs: 'India’s premier franchise field-hockey competition.',
    whyImportant: 'Top domestic platform for senior and emerging players.',
    progression: 'HIL performance is a key route to the senior India team.',
  },
  {
    id: 'hockey_senior_nationals',
    sportSlug: 'hockey',
    name: 'Senior National Hockey Championship',
    level: 'national',
    organiser: 'Hockey India',
    whatIs: 'India’s premier inter-state hockey championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong Senior Nationals runs feed the national camp and HIL.',
  },
  {
    id: 'hockey_fih_pro_league',
    sportSlug: 'hockey',
    name: 'FIH Hockey Pro League',
    level: 'international',
    organiser: 'International Hockey Federation',
    whatIs: 'Annual home-and-away league involving top national teams.',
    whyImportant: 'Flagship annual international event.',
    progression: 'Selection for the Pro League reflects senior international status.',
  },
  {
    id: 'hockey_khelo_india',
    sportSlug: 'hockey',
    name: 'Khelo India (Hockey)',
    level: 'national',
    organiser: 'Ministry of Youth Affairs & Sports',
    whatIs: 'National grassroots multi-sport event including hockey.',
    whyImportant: 'Flagship annual platform for Under-17 and Under-21 players.',
    progression: 'Medal winners receive annual training grants.',
  },

  // ---------------- CHESS ----------------
  {
    id: 'chess_national_championship',
    sportSlug: 'chess',
    name: 'Indian National Chess Championship',
    level: 'national',
    organiser: 'All India Chess Federation (AICF)',
    whatIs: 'India’s premier domestic chess championship.',
    whyImportant: 'Top domestic selection event for the India team.',
    progression: 'Strong National Championship runs lead to international selection.',
  },
  {
    id: 'chess_fide_grand_prix',
    sportSlug: 'chess',
    name: 'FIDE Grand Prix',
    level: 'international',
    organiser: 'FIDE',
    whatIs: 'A series of elite chess tournaments feeding the World Championship cycle.',
    whyImportant: 'Top-level international event for elite grandmasters.',
    progression: 'Grand Prix performance is a path to the Candidates and World Championship.',
  },
  {
    id: 'chess_chess_olympiad',
    sportSlug: 'chess',
    name: 'Chess Olympiad',
    level: 'international',
    organiser: 'FIDE',
    whatIs: 'Biennial international team chess competition.',
    whyImportant: 'Flagship international team event for national federations.',
    progression: 'Olympiad selection is a marker of elite national-team status.',
  },

  // ---------------- WRESTLING ----------------
  {
    id: 'wrestling_senior_nationals',
    sportSlug: 'wrestling',
    name: 'Senior National Wrestling Championship',
    level: 'national',
    organiser: 'Wrestling Federation of India (WFI)',
    whatIs: 'India’s premier domestic wrestling championship.',
    whyImportant: 'Top selection event for the India camp.',
    progression:
      'Winners are picked for Asian and World Championships and Olympic qualification.',
  },
  {
    id: 'wrestling_asian_championships',
    sportSlug: 'wrestling',
    name: 'Asian Wrestling Championships',
    level: 'international',
    organiser: 'United World Wrestling',
    whatIs: 'Annual Asian championship.',
    whyImportant: 'Top continental competition for senior wrestlers.',
    progression: 'Asian medals are a key step to World and Olympic selection.',
  },

  // ---------------- BOXING ----------------
  {
    id: 'boxing_senior_nationals',
    sportSlug: 'boxing',
    name: 'Senior National Boxing Championship',
    level: 'national',
    organiser: 'Boxing Federation of India (BFI)',
    whatIs: 'India’s premier domestic amateur boxing championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong National Championship runs feed the World Boxing Championships.',
  },
  {
    id: 'boxing_india_open',
    sportSlug: 'boxing',
    name: 'India Open International Boxing',
    level: 'international',
    organiser: 'BFI / IBA',
    whatIs: 'International boxing tournament held in India.',
    whyImportant: 'Top-tier competition on home soil.',
    progression: 'India Open results feed World Boxing Championships and Olympic selection.',
  },

  // ---------------- TABLE TENNIS ----------------
  {
    id: 'tt_senior_nationals',
    sportSlug: 'table-tennis',
    name: 'Senior National Table Tennis Championship',
    level: 'national',
    organiser: 'Table Tennis Federation of India (TTFI)',
    whatIs: 'India’s premier domestic table tennis championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong Senior Nationals runs lead to WTT events and Olympic qualification.',
  },
  {
    id: 'tt_utt',
    sportSlug: 'table-tennis',
    name: 'Ultimate Table Tennis (UTT)',
    level: 'national',
    organiser: 'TTFI',
    whatIs: 'India’s premier franchise table tennis league.',
    whyImportant: 'Top professional league in India.',
    progression: 'UTT performance is a path to WTT events and national selection.',
  },
  {
    id: 'tt_wtt',
    sportSlug: 'table-tennis',
    name: 'WTT Series',
    level: 'international',
    organiser: 'World Table Tennis',
    whatIs: 'Annual global circuit of professional table tennis events.',
    whyImportant: 'Top international circuit for senior players.',
    progression: 'WTT performance is a path to World Championships and Olympic qualification.',
  },

  // ---------------- KABADDI ----------------
  {
    id: 'kabaddi_senior_nationals',
    sportSlug: 'kabaddi',
    name: 'Senior National Kabaddi Championship',
    level: 'national',
    organiser: 'Amateur Kabaddi Federation of India',
    whatIs: 'India’s premier domestic kabaddi championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong Senior Nationals runs lead to Pro Kabaddi League selection.',
  },
  {
    id: 'kabaddi_pro_kabaddi',
    sportSlug: 'kabaddi',
    name: 'Pro Kabaddi League',
    level: 'national',
    organiser: 'Mashel Sports / AKFI',
    whatIs: 'India’s premier professional kabaddi league.',
    whyImportant: 'The highest-profile kabaddi platform in India.',
    progression: 'Pro Kabaddi performance is the main route to the India kabaddi team.',
  },

  // ---------------- ARCHERY ----------------
  {
    id: 'archery_senior_nationals',
    sportSlug: 'archery',
    name: 'Senior National Archery Championship',
    level: 'national',
    organiser: 'Archery Association of India (AAI)',
    whatIs: 'India’s premier domestic archery championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong National Championship runs lead to World Cups and Olympic selection.',
  },
  {
    id: 'archery_world_archery',
    sportSlug: 'archery',
    name: 'World Archery Championships',
    level: 'international',
    organiser: 'World Archery Federation',
    whatIs: 'Biennial world archery championship.',
    whyImportant: 'Top international competition for senior archers.',
    progression: 'World Championship medals are a path to Olympic qualification.',
  },

  // ---------------- SHOOTING ----------------
  {
    id: 'shooting_senior_nationals',
    sportSlug: 'shooting',
    name: 'National Shooting Championship',
    level: 'national',
    organiser: 'National Rifle Association of India (NRAI)',
    whatIs: 'India’s premier domestic shooting championship.',
    whyImportant: 'Top domestic selection event for the India team.',
    progression: 'Winners are selected for ISSF World Cups and Olympic qualification events.',
  },
  {
    id: 'shooting_issf_world_cup',
    sportSlug: 'shooting',
    name: 'ISSF World Cup',
    level: 'international',
    organiser: 'International Shooting Sport Federation',
    whatIs: 'Annual global circuit of ISSF World Cup events.',
    whyImportant: 'Top international circuit for senior shooters.',
    progression: 'World Cup medals are a path to Olympic quota places.',
  },

  // ---------------- SKATING ----------------
  {
    id: 'skating_rsfi_nationals',
    sportSlug: 'skating',
    name: 'RSFI National Championship',
    level: 'national',
    organiser: 'Roller Skating Federation of India',
    whatIs: 'India’s premier domestic skating championship.',
    whyImportant: 'Top domestic selection event for the India team.',
    progression: 'Strong National Championship runs lead to World Skate Games selection.',
  },
  {
    id: 'skating_world_skate_games',
    sportSlug: 'skating',
    name: 'World Skate Games',
    level: 'international',
    organiser: 'World Skate',
    whatIs: 'Multi-discipline world championship for skating.',
    whyImportant: 'Top international competition for senior skaters.',
    progression: 'World Skate Games performance is a path to Asian Championship selection.',
  },

  // ---------------- KARATE ----------------
  {
    id: 'karate_senior_nationals',
    sportSlug: 'karate',
    name: 'Senior National Karate Championship',
    level: 'national',
    organiser: 'Karate Association of India',
    whatIs: 'India’s premier domestic karate championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong National Championship runs lead to Asian and World Karate Championships.',
  },
  {
    id: 'karate_world_karate',
    sportSlug: 'karate',
    name: 'World Karate Championship',
    level: 'international',
    organiser: 'World Karate Federation',
    whatIs: 'Biennial world karate championship.',
    whyImportant: 'Top international competition for senior karatekas.',
    progression: 'World medals are a path to Asian Games and Olympic selection.',
  },

  // ---------------- JUDO ----------------
  {
    id: 'judo_senior_nationals',
    sportSlug: 'judo',
    name: 'Senior National Judo Championship',
    level: 'national',
    organiser: 'Judo Federation of India (JFI)',
    whatIs: 'India’s premier domestic judo championship.',
    whyImportant: 'Top domestic selection event for the India camp.',
    progression: 'Strong National Championship runs lead to Asian and World Judo Championships.',
  },
];

export const competitionsBySport = (slug: string) =>
  competitions.filter((c) => c.sportSlug === slug);
