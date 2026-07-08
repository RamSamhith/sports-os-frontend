export interface SportContent {
  tagline: string;
  about: string;
  rules: string;
  individualOrTeam: 'individual' | 'team' | 'both';
  olympic: boolean;
  beginnerDifficulty: 'Easy' | 'Moderate' | 'Challenging';
  equipment: string[];
  benefits: { physical: string[]; mental: string[] };
  skills: string[];
  trainingPath: string;
  trainingFrequency: string;
  injuryRisk: 'Low' | 'Medium' | 'High';
  popularityInIndia: string;
  popularityWorldwide: string;
  careerOpportunities: string[];
  competitions: { state: string[]; national: string[]; international: string[] };
  majorTournaments: string[];
  funFacts: string[];
  faqs: { q: string; a: string }[];
  formats?: { name: string; description: string; duration?: string; teamSize?: string }[];
  keyDifferences?: string;
  teamSize: string;
  matchDuration: string;
  howToPlay: string;
  objectiveOfGame: string;
  scoringSystem: string;
  playingSurface: string;
  averageLearningTime: string;
  origin: string;
}

export const sportsContent: Record<string, SportContent> = {
  cricket: {
    tagline: "India's religion — a bat-and-ball game of strategy, skill, and passion.",
    about:
      "Cricket is the most popular sport in India, followed by billions across the subcontinent. It is played in three formats: Test, ODI, and T20, each demanding different skill sets. India's IPL is the world's richest cricket league and has redefined T20 cricket globally.",
    rules:
      "Two teams of eleven players take turns batting and bowling on an oval field with a 22-yard pitch. The batting side scores runs by hitting the ball and running between wickets, while the bowling side tries to dismiss batsmen. A match ends when all innings are completed or a target is chased.",
    individualOrTeam: "team",
    olympic: false,
    beginnerDifficulty: "Moderate",
    teamSize: "11 players per side",
    matchDuration: "T20: ~3 hours, ODI: ~8 hours, Test: Up to 5 days",
    howToPlay: "Two teams alternate between batting and bowling. Batsmen score runs by hitting the ball and running between wickets. Bowlers try to dismiss batsmen through various delivery types. Fielders assist by catching or running out batsmen.",
    objectiveOfGame: "Score more runs than the opposing team within the allotted overs or innings.",
    scoringSystem: "Runs scored by batsmen — 1 per run between wickets, 4 for boundary, 6 for over-boundary. Wickets end a batsman's innings.",
    playingSurface: "Grass or hybrid turf oval field with a 22-yard flat pitch at the center",
    averageLearningTime: "2-3 years to develop basic competence",
    origin: "England, 16th century",
    equipment: [
      "Cricket bat",
      "Leather ball",
      "Pads and gloves",
      "Helmet",
      "Stumps",
    ],
    benefits: {
      physical: [
        "Improves hand-eye coordination",
        "Builds cardiovascular endurance",
        "Enhances running speed and agility",
      ],
      mental: [
        "Develops strategic thinking under pressure",
        "Teaches teamwork and communication",
        "Builds patience and concentration over long sessions",
      ],
    },
    skills: [
      "Batting technique and shot selection",
      "Bowling variations and accuracy",
      "Fielding and catching reflexes",
      "Game awareness and tactical decision-making",
    ],
    trainingPath:
      "Start with soft-ball cricket at school or local clubs to learn basic batting, bowling, and fielding. Progress to age-group tournaments (Under-14, Under-16, Under-19) through district and state associations. Elite players enter Ranji Trophy, IPL, and eventually national selection via BCCI pathways.",
    trainingFrequency: "4-6 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Most popular sport — 1.4 billion fans",
    popularityWorldwide: "Top 3 globally, dominant in South Asia, Australia, UK",
    careerOpportunities: [
      "Professional player (domestic and international)",
      "Cricket coaching and academies",
      "Sports journalism and commentary",
      "Umpiring and match refereeing",
    ],
    competitions: {
      state: [
        "Ranji Trophy (state teams)",
        "Vijay Hazare Trophy",
        "Syed Mushtaq Ali Trophy",
      ],
      national: [
        "Duleep Trophy",
        "Irani Cup",
        "India A tours",
      ],
      international: [
        "IPL (Indian Premier League)",
        "ICC Cricket World Cup",
        "ICC T20 World Cup",
      ],
    },
    majorTournaments: [
      "ICC Cricket World Cup",
      "Indian Premier League (IPL)",
      "ICC T20 World Cup",
    ],
    funFacts: [
      "India won the Cricket World Cup in 1983 and 2011, sparking nationwide celebrations.",
      "The IPL is the most-watched cricket league with a brand value exceeding $10 billion.",
      "Sachin Tendulkar holds the record for most international runs and centuries.",
    ],
    faqs: [
      {
        q: "At what age can children start playing cricket?",
        a: "Children can begin with soft-ball cricket as early as age 5-6 at local clubs and school programs.",
      },
      {
        q: "Is cricket an Olympic sport?",
        a: "Cricket was not in the Olympics for over a century but has been included in the 2028 Los Angeles Olympics in T20 format.",
      },
      {
        q: "How do I get selected for state or national cricket teams?",
        a: "Perform consistently in district-level tournaments and age-group competitions. State associations conduct trials and selection matches for higher levels.",
      },
    ],
    keyDifferences: "Cricket combines individual skill (batting, bowling) with deep team strategy. Unlike football or basketball, it alternates between individual duels (batsman vs bowler) and coordinated team play. Three formats (Test, ODI, T20) range from 5-day endurance to 3-hour sprints.",
    formats: [
      { name: 'T20', description: 'Fast-paced 20-over format. Each team bats for 20 overs. High-intensity hitting and aggressive bowling.', duration: '~3 hours', teamSize: '11 per side' },
      { name: 'ODI', description: 'One Day International. Each team bats for 50 overs. Balance of strategy and entertainment.', duration: '~8 hours', teamSize: '11 per side' },
      { name: 'Test', description: 'The longest format played over 5 days. Two innings per team. Tests endurance, technique, and mental strength.', duration: 'Up to 5 days', teamSize: '11 per side' },
    ],
  },

  football: {
    tagline: "The beautiful game — the world's most popular team sport.",
    about:
      "Football is played in virtually every country on Earth. In India, the Indian Super League (ISL) and I-League drive the professional scene, while grassroots programs are expanding rapidly. The sport demands speed, endurance, and tactical intelligence.",
    rules:
      "Two teams of eleven players try to score by getting the ball into the opponent's goal. Only the goalkeeper may handle the ball with hands during play. The team with more goals at the end of 90 minutes wins.",
    individualOrTeam: "team",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "11 players per side",
    matchDuration: "90 minutes (two 45-minute halves)",
    howToPlay: "Players dribble, pass, and shoot a ball to score goals. Teams coordinate attacking and defensive formations. The goalkeeper is the only player allowed to use hands within the penalty area.",
    objectiveOfGame: "Score more goals than the opposing team within 90 minutes.",
    scoringSystem: "One goal per ball entering the net. Highest total wins.",
    playingSurface: "Grass or artificial turf rectangular pitch (100-110m x 64-75m)",
    averageLearningTime: "1-2 years to develop basic skills",
    origin: "England, 19th century",
    equipment: [
      "Football (size 4 or 5)",
      "Football boots (cleats)",
      "Shin guards",
      "Goalkeeper gloves (if playing GK)",
    ],
    benefits: {
      physical: [
        "Boosts cardiovascular fitness through constant running",
        "Improves lower-body strength and agility",
        "Enhances coordination and balance",
      ],
      mental: [
        "Teaches quick decision-making in fast play",
        "Builds team spirit and leadership",
        "Develops spatial awareness and tactical thinking",
      ],
    },
    skills: [
      "Dribbling and ball control",
      "Passing accuracy and vision",
      "Shooting and finishing",
      "Tackling and defensive positioning",
    ],
    trainingPath:
      "Begin with local football clubs or school teams to learn dribbling, passing, and positioning. Progress through district and state leagues, aiming for junior national competitions. Top players are scouted for ISL, I-League, or national camp selections.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Growing rapidly — ISL has boosted viewership to 200M+ annually",
    popularityWorldwide: "Most popular sport in the world with 4 billion+ fans globally",
    careerOpportunities: [
      "Professional footballer (domestic leagues and abroad)",
      "Football coaching and youth development",
      "Sports management and scouting",
      "Football journalism and analysis",
    ],
    competitions: {
      state: [
        "Santosh Trophy",
        "State Football League",
      ],
      national: [
        "I-League",
        "Durand Cup",
        "Super Cup",
      ],
      international: [
        "Indian Super League (ISL)",
        "AFC Champions League",
        "FIFA World Cup",
      ],
    },
    majorTournaments: [
      "FIFA World Cup",
      "Indian Super League (ISL)",
      "AFC Asian Cup",
    ],
    funFacts: [
      "The FIFA World Cup final is the most-watched single sporting event globally.",
      "Kolkata's Salt Lake Stadium is one of the largest football venues in India with over 85,000 capacity.",
      "India qualified for the 1950 FIFA World Cup but withdrew, reportedly due to lack of footwear.",
    ],
    faqs: [
      {
        q: "Can I start playing football as a teenager?",
        a: "Yes. Many players begin serious training between ages 10-14. School and district-level programs are open to beginners.",
      },
      {
        q: "How is football different from futsal?",
        a: "Football is played on a full-size grass or turf pitch with 11 players, while futsal is played indoors on a hard court with 5 players per side.",
      },
      {
        q: "What is the ISL?",
        a: "The Indian Super League is India's top professional football league, featuring franchise teams from across the country.",
      },
    ],
    keyDifferences: "Football is a continuous-flow team sport with constant movement and no stoppages between plays (unlike cricket or baseball). Its simplicity — just a ball and open space — makes it the most accessible team sport globally. The 90-minute non-stop format demands unique aerobic endurance.",
    formats: [
      { name: 'FIFA World Cup', description: 'The pinnacle of international football. 32 nations compete every 4 years for the most prestigious trophy in sports.', duration: 'Month-long tournament', teamSize: '11 per side' },
      { name: 'Continental Championships', description: 'AFC Asian Cup, UEFA Euro, Copa America, AFCON. Top national teams compete for continental glory.', duration: 'Month-long tournament', teamSize: '11 per side' },
      { name: 'Domestic Leagues', description: 'I-League, ISL (India), Premier League, La Liga, Serie A. League format played over a season.', duration: '90-minute matches', teamSize: '11 per side' },
      { name: 'Club Competitions', description: 'AFC Champions League, UEFA Champions League. Top club teams from different leagues compete.', duration: 'Two-legged ties', teamSize: '11 per side' },
    ],
  },

  basketball: {
    tagline: "Fast-paced, high-flying, and endlessly exciting.",
    about:
      "Basketball is a dynamic team sport played on a hard court with a hoop at each end. India's UBA and BCL leagues are growing the professional scene, and basketball is hugely popular in schools across the country. The sport combines athleticism with sharp shooting skills.",
    rules:
      "Two teams of five players each try to score by shooting the ball through the opponent's hoop. The team with the most points at the end of four quarters wins. Dribbling is required to move with the ball, and fouls result in free throws.",
    individualOrTeam: "team",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "5 players per side",
    matchDuration: "48 minutes (four 12-minute quarters)",
    howToPlay: "Two teams of five try to score by shooting a ball through the opponent's hoop. Players dribble to move and pass to teammates. Defense involves blocking shots and stealing the ball.",
    objectiveOfGame: "Score more points than the opposing team by shooting the ball through the opponent's hoop.",
    scoringSystem: "2 points per field goal, 3 points per three-pointer, 1 point per free throw",
    playingSurface: "Hardwood indoor court (28m x 15m)",
    averageLearningTime: "1-2 years to develop basic competence",
    origin: "USA, 1891",
    equipment: [
      "Basketball (size 5, 6, or 7)",
      "Basketball shoes (high-top recommended)",
      "Jersey and shorts",
    ],
    benefits: {
      physical: [
        "Improves vertical jump and explosive power",
        "Builds full-body endurance",
        "Enhances hand-eye coordination and reflexes",
      ],
      mental: [
        "Sharpens quick decision-making under pressure",
        "Teaches leadership and on-court communication",
        "Develops spatial awareness and court vision",
      ],
    },
    skills: [
      "Dribbling and ball handling",
      "Shooting form and accuracy",
      "Defensive footwork and positioning",
      "Court vision and playmaking",
    ],
    trainingPath:
      "Start at school or local clubs learning dribbling, shooting, and defensive fundamentals. Compete in district and state championships to build competitive experience. Top performers can join national camps, UBA, or Basketball India League teams.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Strong school-level presence, growing through UBA and BCL leagues",
    popularityWorldwide: "Top 3 globally, massive following in USA, China, and Europe",
    careerOpportunities: [
      "Professional basketball player",
      "Basketball coaching and personal training",
      "Sports analytics and scouting",
      "Event management for basketball tournaments",
    ],
    competitions: {
      state: [
        "State Basketball Championship",
        "Inter-school tournaments",
      ],
      national: [
        "Basketball India Senior Nationals",
        "Basketball Champions League (BCL)",
        "FIBA Asia Qualifiers (India leg)",
      ],
      international: [
        "FIBA Basketball World Cup",
        "Olympic Games",
        "FIBA Asia Cup",
      ],
    },
    majorTournaments: [
      "NBA (global premier league)",
      "FIBA Basketball World Cup",
      "Olympic Games basketball",
    ],
    funFacts: [
      "Basketball was invented in 1891 by Dr. James Naismith in Massachusetts using a peach basket.",
      "The NBA's shortest player ever was Muggsy Bogues at 5'3\", while the tallest was Gheorghe Muresan at 7'7\".",
      "India hosted the FIBA Asia Cup qualifiers and is working toward a professional national league.",
    ],
    faqs: [
      {
        q: "How tall do I need to play basketball?",
        a: "Height helps but is not required. Guard positions value speed, shooting, and ball-handling skills over height.",
      },
      {
        q: "What is the best age to start basketball?",
        a: "Children can start learning basic skills from age 6-7. Serious competitive training usually begins around age 10-12.",
      },
      {
        q: "Is basketball popular in India?",
        a: "Basketball has a strong school-level presence in India and is growing professionally through leagues like UBA and BCL.",
      },
    ],
    keyDifferences: "Basketball is a high-tempo indoor sport played on a confined court with continuous scoring, unlike football's occasional goals. The shot clock forces constant action, and the combination of height, speed, and precision shooting creates a unique athletic profile unmatched by other team sports.",
    formats: [
      { name: 'NBA', description: 'The premier professional basketball league. 30 teams, 82-game regular season plus playoffs.', duration: '48-minute games', teamSize: '5 per side' },
      { name: 'FIBA International', description: 'Olympics and FIBA World Cup. National teams compete in global tournaments.', duration: '40-minute games', teamSize: '5 per side' },
      { name: '3x3 Basketball', description: 'Half-court, fast-paced format. Olympic sport since 2020. Quick games, high intensity.', duration: '10 minutes or first to 21', teamSize: '3 per side' },
    ],
  },

  badminton: {
    tagline: "Lightning-fast racquet sport where India consistently shines on the world stage.",
    about:
      "Badminton is one of India's most successful Olympic sports, with players like PV Sindhu and Saina Nehwal winning medals at the highest level. It is a high-intensity indoor sport requiring explosive movement, precise reflexes, and tactical shot-making.",
    rules:
      "Players or pairs hit a shuttlecock over a net, aiming to land it in the opponent's court. Matches are best of three games to 21 points each. A shuttlecock must clear the net and land within the court boundaries to score.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "1 or 2 players per side",
    matchDuration: "40-60 minutes (best of 3 games to 21 points)",
    howToPlay: "Players hit a shuttlecock over a net using racquets. The shuttlecock must land within the opponent's court boundaries. Singles and doubles formats are played.",
    objectiveOfGame: "Win rallies by landing the shuttlecock in the opponent's court or forcing errors.",
    scoringSystem: "Rally scoring to 21 points per game. Best of 3 games wins the match.",
    playingSurface: "Indoor court with wooden or synthetic flooring (13.4m x 6.1m)",
    averageLearningTime: "6 months to 1 year for basic skills",
    origin: "British India, 19th century",
    equipment: [
      "Badminton racquet",
      "Shuttlecocks (feather or synthetic)",
      "Badminton shoes (non-marking sole)",
      "Grip tape",
    ],
    benefits: {
      physical: [
        "Builds explosive leg strength and agility",
        "Improves reflexes and hand-eye coordination",
        "Burns calories and improves cardiovascular health",
      ],
      mental: [
        "Develops split-second tactical decision-making",
        "Builds focus and concentration during rallies",
        "Teaches resilience and sportsmanship",
      ],
    },
    skills: [
      "Net play and shot precision",
      "Smash power and timing",
      "Footwork and court coverage",
      "Deceptive shot-making",
    ],
    trainingPath:
      "Start at a local badminton academy or school program to learn grip, footwork, and basic strokes. Progress through district and state ranking tournaments to gain competitive exposure. Top performers enter national camps and can aim for BWF World Tour and Olympic selection via BAI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "One of India's top Olympic sports — Sindhu and Nehwal are national icons",
    popularityWorldwide: "Huge in Asia (China, Indonesia, Japan), growing in Europe and Americas",
    careerOpportunities: [
      "Professional badminton player",
      "Badminton coaching and academy ownership",
      "Sports physiotherapy for racquet sports",
      "Tournament organization and management",
    ],
    competitions: {
      state: [
        "State Badminton Championships",
        "District ranking tournaments",
      ],
      national: [
        "Senior National Badminton Championship",
        "India Open",
        "Premier Badminton League (PBL)",
      ],
      international: [
        "BWF World Tour events",
        "Thomas & Uber Cup",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "BWF World Championships",
      "Olympic Games",
      "Thomas & Uber Cup",
    ],
    funFacts: [
      "The fastest recorded smash in badminton is over 493 km/h, making it the fastest racquet sport.",
      "PV Sindhu became the first Indian woman to win two individual Olympic medals (2016 silver, 2020 bronze).",
      "A shuttlecock can travel at speeds exceeding 300 km/h during professional rallies.",
    ],
    faqs: [
      {
        q: "Is badminton easy to learn?",
        a: "Basic badminton is beginner-friendly and can be learned quickly. Advanced competitive play requires dedicated training in footwork and shot technique.",
      },
      {
        q: "Can I play badminton outdoors?",
        a: "Outdoor play is possible in calm conditions, but competitive badminton is played indoors to avoid wind affecting the shuttlecock.",
      },
      {
        q: "How do I improve my smash?",
        a: "Focus on wrist strength, proper grip, body rotation, and timing drills. Regular practice with a coach helps refine technique.",
      },
    ],
    keyDifferences: "Badminton is the fastest racquet sport — shuttlecock speeds exceed 400 km/h. Unlike tennis, it uses a feathered projectile that decelerates rapidly, demanding explosive reflexes in a smaller court. The lightweight shuttlecock enables deceptive shots impossible in other racquet sports.",
    formats: [
      { name: 'Singles', description: 'One vs one. Tests individual agility, stamina, and shot precision on the full court.', duration: '40-70 minutes', teamSize: '1 per side' },
      { name: 'Doubles', description: 'Two vs two. Faster rallies, tactical formations, and net play. Requires strong communication.', duration: '40-60 minutes', teamSize: '2 per side' },
      { name: 'Mixed Doubles', description: 'One male + one female per team. Strategic pairing with complementary strengths.', duration: '40-60 minutes', teamSize: '1M + 1F per side' },
    ],
  },

  tennis: {
    tagline: "A game of power, precision, and mental endurance on the court.",
    about:
      "Tennis is a globally renowned racquet sport played in singles and doubles formats. India has a proud tennis tradition with players like Leander Paes, Mahesh Bhupathi, and Sania Mirza achieving world-number-one rankings. The sport demands athleticism, tactical thinking, and mental toughness.",
    rules:
      "Players hit a ball over a net into the opponent's court, aiming to make it unreturnable. Points progress through love, 15, 30, and 40, with games forming sets and sets forming matches. A player must win by two clear games in a set.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "1 (singles) or 2 (doubles) per side",
    matchDuration: "1-3 hours depending on format",
    howToPlay: "Players hit a ball over a net into the opponent's court using racquets. The ball must bounce once before being returned. Points progress through a unique scoring system.",
    objectiveOfGame: "Win points by hitting the ball so the opponent cannot return it within court boundaries.",
    scoringSystem: "Points: 15, 30, 40, Game. Games form sets, sets form matches. Must win by 2 clear games in a set.",
    playingSurface: "Clay, grass, hard court, or carpet (23.77m x 8.23m singles)",
    averageLearningTime: "1-2 years for intermediate play",
    origin: "England, 19th century",
    equipment: [
      "Tennis racquet",
      "Tennis balls",
      "Tennis shoes",
      "Grip and dampeners",
    ],
    benefits: {
      physical: [
        "Improves cardiovascular fitness through constant movement",
        "Builds core strength and rotational power",
        "Enhances agility, speed, and reaction time",
      ],
      mental: [
        "Develops mental resilience during long rallies and matches",
        "Teaches strategic point construction",
        "Builds discipline through rigorous training routines",
      ],
    },
    skills: [
      "Serve power and placement",
      "Forehand and backhand technique",
      "Net approach and volleying",
      "Tactical point construction",
    ],
    trainingPath:
      "Begin with coaching at a tennis club or academy to learn strokes, serve, and court movement. Compete in AITA junior ranking tournaments to build competitive experience. Advanced players progress through ITF junior circuits and can aim for ATP/WTA Tour or national team selection.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Elite following — Sania Mirza and doubles pairs made it mainstream",
    popularityWorldwide: "Top 5 globally, massive following in Europe, USA, and Australia",
    careerOpportunities: [
      "Professional tennis player",
      "Tennis coaching and academy management",
      "Sports commentary and journalism",
      "Tournament event management",
    ],
    competitions: {
      state: [
        "State Tennis Championships",
        "AITA district ranking tournaments",
      ],
      national: [
        "AITA National Championships",
        "Doubles Masters Series",
        "University tennis nationals",
      ],
      international: [
        "Grand Slam tournaments (Australian Open, French Open, Wimbledon, US Open)",
        "Davis Cup",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "Grand Slam tournaments (Australian Open, French Open, Wimbledon, US Open)",
      "Davis Cup",
      "ATP/WTA Finals",
    ],
    funFacts: [
      "Tennis originated in 19th-century England and was originally called 'lawn tennis'.",
      "Leander Paes and Mahesh Bhupathi were called the 'Indian Express' and held the world No. 1 doubles ranking.",
      "Wimbledon's Centre Court has a retractable roof that can close in under 10 minutes.",
    ],
    faqs: [
      {
        q: "What is the best age to start tennis?",
        a: "Children can start tennis from age 5-6 with modified equipment and courts. Competitive training usually begins around age 8-10.",
      },
      {
        q: "Is tennis an individual or team sport?",
        a: "Tennis can be both. Singles is individual, while doubles involves pairs. Davis Cup and team events add a team dimension.",
      },
      {
        q: "How do I get tennis ranking points in India?",
        a: "Participate in AITA-organized ranking tournaments at district, state, and national levels. Points are awarded based on tournament category and finish.",
      },
    ],
    keyDifferences: "Tennis is unique in combining explosive power with endurance across multiple surfaces (clay, grass, hard court), each demanding different playing styles. The individual nature of singles means players must be self-reliant, and Grand Slams can last 5+ hours, testing physical and mental limits unlike any other sport.",
    formats: [
      { name: 'Singles', description: 'One vs one. The purest test of individual skill, fitness, and mental toughness.', duration: '1-5 hours', teamSize: '1 per side' },
      { name: 'Doubles', description: 'Two vs two. Faster reflexes needed at the net, stronger serve-and-volley tactics.', duration: '1-3 hours', teamSize: '2 per side' },
      { name: 'Grand Slams', description: 'Australian Open, French Open, Wimbledon, US Open. The four most prestigious tournaments.', duration: 'Best of 5 sets (men), Best of 3 (women)', teamSize: '1 per side' },
    ],
  },

  "table-tennis": {
    tagline: "Lightning reflexes on a 2.74m table — the fastest racquet sport.",
    about:
      "Table tennis is a high-speed indoor sport played on a small table, demanding incredible reflexes and wrist control. India has produced Olympic medalists like Achanta Sharath Kamal and Manika Batra. The sport is accessible to all ages and is widely played in Indian clubs and schools.",
    rules:
      "Two or four players hit a lightweight ball back and forth across a net on a table. Points are scored when the opponent fails to return the ball correctly. Games are played to 11 points, and matches are best of five or seven games.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "1 or 2 players per side",
    matchDuration: "30-60 minutes (best of 5 or 7 games to 11 points)",
    howToPlay: "Players hit a lightweight ball back and forth across a net on a table using paddles. The ball must bounce once on each side. Various spin techniques are used.",
    objectiveOfGame: "Win rallies by making the ball bounce twice on the opponent's side or forcing errors.",
    scoringSystem: "Rally scoring to 11 points per game. Best of 5 or 7 games wins the match.",
    playingSurface: "Indoor table tennis table (2.74m x 1.525m)",
    averageLearningTime: "3-6 months for basic competence",
    origin: "England, 19th century",
    equipment: [
      "Table tennis racket (paddle)",
      "Table tennis balls",
      "Table tennis table",
      "Net and posts",
    ],
    benefits: {
      physical: [
        "Sharpens reflexes and reaction time",
        "Improves hand-eye coordination and wrist flexibility",
        "Enhances lower-body agility with quick footwork",
      ],
      mental: [
        "Develops rapid tactical thinking",
        "Builds concentration and focus during fast rallies",
        "Teaches composure under pressure",
      ],
    },
    skills: [
      "Spin generation and variation",
      "Fast-paced rally endurance",
      "Service tactics and third-ball attack",
      "Close-to-table reflexes",
    ],
    trainingPath:
      "Start at a local club or school with basic ball control, serve, and footwork drills. Compete in TTFI district and state ranking events to build competitive experience. Top players enter national championships and can aim for WTT events and Olympic selection.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Growing — Sharath Kamal and Manika Batra have boosted participation",
    popularityWorldwide: "Dominant in China, huge in Asia, growing in Europe and Americas",
    careerOpportunities: [
      "Professional table tennis player",
      "Table tennis coaching",
      "Sports equipment sales and sponsorship",
      "Event organizing for local and national tournaments",
    ],
    competitions: {
      state: [
        "State Table Tennis Championships",
        "TTFI district ranking tournaments",
      ],
      national: [
        "Senior National Table Tennis Championship",
        "Ultimate Table Tennis (UTT)",
        "Inter-university championships",
      ],
      international: [
        "World Table Tennis Championships",
        "WTT World Tour events",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Table Tennis Championships",
      "Olympic Games",
      "WTT Grand Smash events",
    ],
    funFacts: [
      "Table tennis became an Olympic sport in 1988 at the Seoul Games.",
      "The ball can travel at speeds exceeding 110 km/h in professional play.",
      "Manika Batra became the first Indian woman to win an Olympic medal in table tennis (2020, mixed doubles).",
    ],
    faqs: [
      {
        q: "Is table tennis good for beginners?",
        a: "Yes. Table tennis is one of the easiest sports to pick up and can be played recreationally or competitively at any age.",
      },
      {
        q: "What rubber should I use on my paddle?",
        a: "Beginners should start with smooth rubber for control. As skills develop, inverted or pimpled rubber can add spin and speed.",
      },
      {
        q: "How do I generate more spin?",
        a: "Focus on brushing the ball at an angle rather than hitting it flat. Wrist snap and a fast forearm motion create more spin.",
      },
    ],
    keyDifferences: "Table tennis has the fastest reaction times in any sport — rallies happen in under 0.5 seconds. The 2.74m table creates an intimate, high-speed duel where spin (up to 150 RPM) makes the ball behave unpredictably. It's the only sport where the projectile can curve mid-air due to spin alone.",
  },

  swimming: {
    tagline: "Master the water — full-body fitness and Olympic glory.",
    about:
      "Swimming is both a life skill and a competitive sport with four main strokes: freestyle, backstroke, breaststroke, and butterfly. India has produced Olympic-level swimmers like Virdhawal Khade and Sajan Prakash. The sport builds total-body fitness and is suitable from a very young age.",
    rules:
      "Swimmers race across a pool (25m or 50m) using one of the four Olympic strokes. Each stroke has specific rules about technique and turns. The fastest swimmer to touch the wall at the end wins.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "1-4 swimmers (relay events)",
    matchDuration: "20-90 seconds per race, depending on distance",
    howToPlay: "Swimmers race across a pool using one of four Olympic strokes: freestyle, backstroke, breaststroke, or butterfly. Each stroke has specific technique rules.",
    objectiveOfGame: "Be the first swimmer to touch the wall at the end of the race distance.",
    scoringSystem: "Timed races — fastest swimmer wins. Touchpads record times to 0.01 seconds.",
    playingSurface: "Indoor or outdoor swimming pool (25m or 50m lanes)",
    averageLearningTime: "6 months to 1 year for stroke proficiency",
    origin: "Prehistoric era, competitive form from 19th century",
    equipment: [
      "Swimsuit",
      "Goggles",
      "Swim cap",
      "Kickboard and pull buoy (training aids)",
    ],
    benefits: {
      physical: [
        "Builds full-body muscle strength and endurance",
        "Improves cardiovascular health and lung capacity",
        "Low-impact exercise, gentle on joints",
      ],
      mental: [
        "Reduces stress and anxiety through rhythmic breathing",
        "Builds discipline and goal-oriented mindset",
        "Boosts confidence through progressive skill mastery",
      ],
    },
    skills: [
      "Stroke efficiency and technique",
      "Breathing control and rhythm",
      "Start and turn speed",
      "Endurance pacing strategy",
    ],
    trainingPath:
      "Begin with water familiarization and learning basic strokes at a local pool or swim school. Progress through district and state aquatics championships to build competitive times. Elite swimmers train at national camps and can qualify for World Aquatics events and the Olympics via SWFI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Niche but growing — Sajan Prakash and Srihari Nataraj inspiring new generation",
    popularityWorldwide: "Core Olympic sport with huge followings in USA, Australia, and Europe",
    careerOpportunities: [
      "Competitive swimmer",
      "Swimming coach and instructor",
      "Lifeguard and water safety professional",
      "Sports physiotherapy for aquatic athletes",
    ],
    competitions: {
      state: [
        "State Aquatics Championships",
        "District swim meets",
      ],
      national: [
        "Senior National Aquatic Championship",
        "Khelo India swimming events",
        "Open Water Swimming Championship",
      ],
      international: [
        "World Aquatics Championships",
        "Asian Games",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Aquatics Championships",
      "Olympic Games",
      "Asian Games swimming",
    ],
    funFacts: [
      "Swimming is the only sport included in every modern Olympic Games since 1896.",
      "The butterfly stroke was only invented in the 1930s and became an Olympic event in 1956.",
      "India's Sajan Prakash became the first Indian swimmer to breach the Olympic qualification time in the 200m butterfly.",
    ],
    faqs: [
      {
        q: "At what age can children learn swimming?",
        a: "Children can start water familiarization from age 4-5. Formal stroke training typically begins around age 6-8.",
      },
      {
        q: "Which swimming stroke burns the most calories?",
        a: "Butterfly generally burns the most calories per hour due to the intense full-body effort, followed by freestyle.",
      },
      {
        q: "How do I improve my swimming speed?",
        a: "Focus on technique (streamline body position, efficient strokes), build endurance through regular training, and incorporate interval sets.",
      },
    ],
    keyDifferences: "Swimming is the only sport where athletes compete in water, making technique paramount over raw power. Four distinct strokes (freestyle, backstroke, breaststroke, butterfly) each require unique biomechanics. Water resistance means efficiency matters more than strength, creating a sport where technique can beat bigger opponents.",
    formats: [
      { name: 'Freestyle', description: 'Fastest stroke. Front crawl with alternating arm pulls and flutter kick.', duration: '50m to 1500m races', teamSize: 'Individual' },
      { name: 'Backstroke', description: 'Swum on the back. Only stroke performed face-up. Requires strong rotation.', duration: '100m to 200m races', teamSize: 'Individual' },
      { name: 'Breaststroke', description: 'Simultaneous arm and leg movements. Most technical stroke with strict rules.', duration: '100m to 200m races', teamSize: 'Individual' },
      { name: 'Butterfly', description: 'Most physically demanding. Simultaneous overhead arm recovery with dolphin kick.', duration: '100m to 200m races', teamSize: 'Individual' },
      { name: 'Medley', description: 'All four strokes in sequence: butterfly, backstroke, breaststroke, freestyle.', duration: '200m individual, 400m relay', teamSize: 'Individual or relay' },
    ],
  },

  athletics: {
    tagline: "The foundation of all sports — run, jump, throw, and break limits.",
    about:
      "Athletics (track and field) is the cornerstone of the Olympic Games, encompassing sprints, middle and long-distance running, jumps, throws, and combined events. India has a strong tradition in middle-distance running and race walking. Athletics builds the physical foundation for virtually every other sport.",
    rules:
      "Events are divided into track (running), field (jumps and throws), and combined events (decathlon/heptathlon). Each event has specific rules about technique, lanes, and measurement. In timed events, the fastest athlete wins; in field events, the longest or highest distance/height counts.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "Individual or relay teams of 4",
    matchDuration: "Seconds (sprints) to hours (marathon)",
    howToPlay: "Athletes compete in running, jumping, throwing, and walking events. Each event has specific rules about technique, lanes, and measurement.",
    objectiveOfGame: "Achieve the fastest time, longest distance, or highest jump/throw.",
    scoringSystem: "Timed events: fastest wins. Field events: longest/highest distance counts. Multi-events: point-based.",
    playingSurface: "Running track (400m oval) and field areas",
    averageLearningTime: "1-2 years for event-specific technique",
    origin: "Ancient Greece, 776 BC",
    equipment: [
      "Running shoes (event-specific spikes)",
      "Track suit and competition kit",
      "Throwing implements (discus, javelin, shot — event-specific)",
    ],
    benefits: {
      physical: [
        "Builds cardiovascular fitness and endurance",
        "Improves speed, power, and explosive strength",
        "Develops flexibility and functional movement",
      ],
      mental: [
        "Teaches goal-setting and self-discipline",
        "Builds mental toughness through personal bests",
        "Develops focus and determination",
      ],
    },
    skills: [
      "Sprint acceleration and top-end speed",
      "Endurance pacing and race strategy",
      "Technique in jumps or throws",
      "Start-block and transition mechanics",
    ],
    trainingPath:
      "Start at school or local athletics clubs to identify your event and learn proper technique. Compete in district and state meets to build race experience and qualifying marks. Elite athletes enter national camps and can aim for Federation Cup, Diamond League, and Olympic qualification via AFI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Neeraj Chopra's gold sparked a revolution — javelin and middle distance booming",
    popularityWorldwide: "Foundation of the Olympics — track and field has global prestige",
    careerOpportunities: [
      "Professional athlete (sprints, distance, jumps, throws)",
      "Athletics coaching and personal training",
      "Sports science and biomechanics",
      "Sports journalism and event management",
    ],
    competitions: {
      state: [
        "State Athletics Championships",
        "Inter-state meets",
      ],
      national: [
        "Federation Cup",
        "National Inter-State Championships",
        "Khelo India Athletics",
      ],
      international: [
        "Diamond League",
        "World Athletics Championships",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "Olympic Games",
      "World Athletics Championships",
      "Diamond League",
    ],
    funFacts: [
      "The modern Olympic motto 'Citius, Altius, Fortius' means 'Faster, Higher, Stronger'.",
      "Milkha Singh, the 'Flying Sikh', missed an Olympic bronze in the 400m by just 0.1 seconds in 1960.",
      "Neeraj Chopra won India's first-ever Olympic gold in athletics (javelin throw) at Tokyo 2020.",
    ],
    faqs: [
      {
        q: "What is the best event for a beginner?",
        a: "Start with sprints (100m, 200m) or middle-distance (400m, 800m) to build general fitness. Field events like long jump can also be beginner-friendly.",
      },
      {
        q: "Do I need special shoes for athletics?",
        a: "Yes. Running spikes are designed for specific events. Sprint spikes are stiff and lightweight, while distance spikes offer more cushioning.",
      },
      {
        q: "How do I improve my running speed?",
        a: "Incorporate interval training, strength exercises (squats, lunges), proper form drills, and adequate rest into your routine.",
      },
    ],
    keyDifferences: "Athletics is the purest test of human physical ability — speed, strength, endurance, and coordination distilled into measurable performances. Unlike team sports, it's you vs the clock or field. With 40+ Olympic events from 100m sprints to marathons, it offers more competitive variety than any other sport.",
  },

  wrestling: {
    tagline: "The oldest combat sport — strength, technique, and warrior spirit.",
    about:
      "Wrestling is one of the oldest and most prestigious combat sports, with strongholds in Haryana, Punjab, and Maharashtra. India has won multiple Olympic medals in wrestling through athletes like Sushil Kumar, Yogeshwar Dutt, and Bajrang Punia. Freestyle and Greco-Roman are the two main styles.",
    rules:
      "Two wrestlers compete on a circular mat, trying to pin the opponent's shoulders to the ground or score points through takedowns, reversals, and exposure. Each bout consists of two three-minute periods. The wrestler with more points or a pin wins.",
    individualOrTeam: "individual",
    olympic: true,
    beginnerDifficulty: "Challenging",
    teamSize: "Individual (with team scoring in dual meets)",
    matchDuration: "6 minutes (two 3-minute periods)",
    howToPlay: "Two wrestlers compete on a mat, attempting takedowns, pins, and reversals. The wrestler with more points or a pin wins.",
    objectiveOfGame: "Pin the opponent's shoulders to the mat or score more points through takedowns and reversals.",
    scoringSystem: "Takedown: 2 points, Reversal: 1 point, Near fall: 2-4 points, Pin: automatic win",
    playingSurface: "Circular wrestling mat (9m diameter)",
    averageLearningTime: "2-3 years for competitive proficiency",
    origin: "Ancient Mesopotamia, 3000 BC",
    equipment: [
      "Wrestling singlet",
      "Wrestling shoes",
      "Headgear",
      "Mouthguard",
    ],
    benefits: {
      physical: [
        "Builds full-body strength and muscle endurance",
        "Develops explosive power and grip strength",
        "Improves cardiovascular fitness through intense training",
      ],
      mental: [
        "Teaches discipline and mental toughness",
        "Builds resilience through intense physical challenges",
        "Develops tactical awareness and quick adaptation",
      ],
    },
    skills: [
      "Takedown technique and timing",
      "Defensive positioning and escapes",
      "Ground control and pinning",
      "Strength and grip dominance",
    ],
    trainingPath:
      "Begin at a local akhada (traditional wrestling gym) or sports academy to learn basics of stance, takedowns, and escapes. Compete in district and state championships to build competitive experience. Top wrestlers enter national camps and aim for Asian Games and Olympic selection via WFI.",
    trainingFrequency: "6 days/week",
    injuryRisk: "High",
    popularityInIndia: "Deep roots in Haryana and Punjab — Olympic medal tradition since 2008",
    popularityWorldwide: "Olympic staple with strong followings in Iran, Russia, USA, and Turkey",
    careerOpportunities: [
      "Professional wrestler (domestic and international)",
      "Wrestling coach and akhada instructor",
      "Sports physiotherapy for combat athletes",
      "MMA transition (mixed martial arts)",
    ],
    competitions: {
      state: [
        "State Wrestling Championships",
        "Inter-school and university wrestling",
      ],
      national: [
        "Senior National Wrestling Championship",
        "Pro Wrestling League",
        " Commonwealth Wrestling Championship (India host)",
      ],
      international: [
        "World Wrestling Championships",
        "Asian Games",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Wrestling Championships",
      "Olympic Games",
      "Asian Games",
    ],
    funFacts: [
      "Wrestling has been part of the modern Olympics since the very first Games in 1896.",
      "India's Sushil Kumar is the only Indian individual to win two Olympic medals in wrestling (2008 bronze, 2012 silver).",
      "Traditional Indian wrestling (kushti) is practiced in akhadis and involves rigorous daily routines including 5 AM training.",
    ],
    faqs: [
      {
        q: "At what age can I start wrestling?",
        a: "Children can start wrestling from age 6-8 at local akhadas or sports academies. Early training focuses on fitness and basic techniques.",
      },
      {
        q: "Is wrestling dangerous?",
        a: "Wrestling has injury risks like any contact sport, but proper coaching, protective gear, and weight-class divisions significantly reduce danger.",
      },
      {
        q: "What is the difference between freestyle and Greco-Roman?",
        a: "Freestyle allows attacks on the entire body, while Greco-Roman restricts holds to above the waist, emphasizing upper-body throws.",
      },
    ],
    keyDifferences: "Wrestling is the oldest combat sport — no striking, purely grappling. Unlike boxing or karate, victories come from pins or points, not knockouts. The weight-class system ensures fair matches, and the akhada tradition in India gives it a cultural depth no other combat sport has in the subcontinent.",
  },

  boxing: {
    tagline: "The sweet science — where speed meets power in the ring.",
    about:
      "Boxing is an Olympic combat sport with a proud Indian tradition, especially from Haryana and the North-East. India has won Olympic medals through Vijender Singh and Lovlina Borgohain. The sport demands lightning reflexes, tactical intelligence, and incredible stamina.",
    rules:
      "Two boxers fight in a ring, wearing gloves and trying to land punches on the opponent's scoring zone (front and sides of the head and torso). Bouts consist of three to twelve rounds of three minutes each. The boxer with more clean, effective punches wins by decision or knockout.",
    individualOrTeam: "individual",
    olympic: true,
    beginnerDifficulty: "Challenging",
    teamSize: "Individual",
    matchDuration: "3-12 rounds of 3 minutes each",
    howToPlay: "Two boxers throw punches at each other in a roped ring, wearing gloves. Boxers score by landing punches on the opponent's scoring zone.",
    objectiveOfGame: "Win by knockout, technical knockout, or judges' decision based on clean punches landed.",
    scoringSystem: "10-point must system: winner of round gets 10, loser gets 9 or fewer. Judges score rounds.",
    playingSurface: "Boxing ring (6.1m x 6.1m)",
    averageLearningTime: "2-3 years for competitive readiness",
    origin: "Ancient Greece, 688 BC",
    equipment: [
      "Boxing gloves",
      "Boxing shoes",
      "Headgear (amateur)",
      "Mouthguard",
      "Hand wraps",
    ],
    benefits: {
      physical: [
        "Builds upper-body and core strength",
        "Improves cardiovascular endurance and speed",
        "Enhances hand-eye coordination and reflexes",
      ],
      mental: [
        "Develops mental toughness and discipline",
        "Builds confidence and self-control",
        "Teaches strategic thinking and composure under pressure",
      ],
    },
    skills: [
      "Jab-cross combination speed",
      "Head movement and defensive slipping",
      "Footwork and ring control",
      "Punching power and accuracy",
    ],
    trainingPath:
      "Start at a local boxing gym to learn basic stance, jab, cross, and defensive moves. Compete in state and national amateur boxing championships to build ring experience. Top boxers can aim for India Open, World Championships, and Olympic selection via BFI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "High",
    popularityInIndia: "Growing — Vijender Singh and Lovlina Borgohain are Olympic icons from Haryana and Assam",
    popularityWorldwide: "Massive global following with major pro circuits in USA, UK, Japan, and Mexico",
    careerOpportunities: [
      "Professional boxer (amateur or pro)",
      "Boxing coach and trainer",
      "Sports commentary and journalism",
      "Gym ownership and fitness training",
    ],
    competitions: {
      state: [
        "State Boxing Championships",
        "District boxing meets",
      ],
      national: [
        "Senior National Boxing Championship",
        "India Open Boxing",
        "Youth National Championships",
      ],
      international: [
        "IBA World Boxing Championships",
        "Asian Games",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "IBA World Boxing Championships",
      "Olympic Games",
      "Asian Games",
    ],
    funFacts: [
      "Boxing has been an Olympic sport since 1904 (with a break in 1912).",
      "Vijender Singh became the first Indian boxer to win an Olympic medal (2008 bronze).",
      "Lovlina Borgohain won India's second Olympic boxing medal (2020 bronze) in the welterweight category.",
    ],
    faqs: [
      {
        q: "Is boxing safe for beginners?",
        a: "Yes, with proper coaching, protective gear, and controlled sparring, boxing is safe for beginners of all ages.",
      },
      {
        q: "How do I improve my punching power?",
        a: "Focus on proper technique, core strength training, shadow boxing, and heavy bag drills. Power comes from hip rotation, not just arm strength.",
      },
      {
        q: "Can boxing help with self-defense?",
        a: "Boxing builds excellent reflexes, distance awareness, and striking skills that are highly effective for self-defense.",
      },
    ],
    keyDifferences: "Boxing is 'the sweet science' — the only combat sport where punches are the sole weapon. Unlike MMA or karate, it strips fighting down to just fists, footwork, and head movement. This simplicity creates deep tactical battles where ring IQ often beats raw power, making it unique among combat sports.",
  },

  karate: {
    tagline: "A striking art of discipline, precision, and respect.",
    about:
      "Karate is a Japanese martial art emphasizing punching, kicking, and defensive blocking. It includes kata (forms) and kumite (sparring) in competition. India has produced multiple Asian-level karate medalists. The sport builds physical power and mental discipline in equal measure.",
    rules:
      "Competitors score points by landing controlled strikes (punches, kicks, knee strikes) on the opponent's body or head. Bouts last up to three minutes. WKF rules award Ippon (full point) and Waza-ari (half point) for effective, well-timed techniques.",
    individualOrTeam: "both",
    olympic: false,
    beginnerDifficulty: "Moderate",
    teamSize: "Individual or team events",
    matchDuration: "2-3 minutes per bout",
    howToPlay: "Competitors score points by landing controlled strikes (punches, kicks, knee strikes) on the opponent's body or head. Kata (forms) is a separate discipline.",
    objectiveOfGame: "Score points through effective techniques or win by ippon (full point).",
    scoringSystem: "Ippon (full point), Waza-ari (half point). Highest total or first to ippon wins.",
    playingSurface: "Dojo mat area (8m x 8m competition area)",
    averageLearningTime: "2-4 years to reach competitive level",
    origin: "Okinawa, Japan, 19th century",
    equipment: [
      "Karate gi (uniform)",
      "Karate belt (indicating rank)",
      "Hand and shin guards",
      "Mouthguard",
    ],
    benefits: {
      physical: [
        "Improves flexibility and dynamic kicking range",
        "Builds explosive power and core strength",
        "Enhances balance and coordination",
      ],
      mental: [
        "Develops discipline and respect through traditional values",
        "Builds focus and mental calmness",
        "Teaches self-control and emotional regulation",
      ],
    },
    skills: [
      "Precision striking (punches and kicks)",
      "Kata (form) execution",
      "Kumite (sparring) tactics",
      "Balance and stance stability",
    ],
    trainingPath:
      "Begin at a local karate dojo to learn basic stances, strikes, and kata. Progress through belt grades (kyu levels) and compete in district and state championships. Elite karatekas can enter national championships and represent India at Asian and World Karate Championships.",
    trainingFrequency: "3-5 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Growing through dojos in metros — strong in Maharashtra and South India",
    popularityWorldwide: "Huge global following with 100M+ practitioners worldwide, strongest in Japan and Europe",
    careerOpportunities: [
      "Professional karate competitor",
      "Karate instructor and dojo owner",
      "Self-defense trainer",
      "Martial arts choreography for films",
    ],
    competitions: {
      state: [
        "State Karate Championships",
        "District karate meets",
      ],
      national: [
        "National Karate Championship",
        "All India Karate Federation events",
      ],
      international: [
        "Asian Karate Championship",
        "World Karate Championship",
        "Asian Games",
      ],
    },
    majorTournaments: [
      "World Karate Championship",
      "Asian Karate Championship",
      "Karate Premier League",
    ],
    funFacts: [
      "Karate originated in Okinawa, Japan, and was influenced by Chinese martial arts.",
      "The word 'karate' means 'empty hand' in Japanese.",
      "Karate was included in the 2020 Tokyo Olympics as a one-time event and is not currently in the 2028 program.",
    ],
    faqs: [
      {
        q: "At what age can children start karate?",
        a: "Children as young as 4-5 can begin introductory karate classes. Formal training with kata and kumite typically starts around age 6-8.",
      },
      {
        q: "What belt color means I'm a black belt?",
        a: "A black belt represents an advanced level of skill and knowledge, typically achieved after 3-5 years of consistent training.",
      },
      {
        q: "Is karate effective for self-defense?",
        a: "Yes. Karate teaches practical striking, blocking, and awareness skills that are effective for self-defense situations.",
      },
    ],
    keyDifferences: "Karate uniquely combines striking with philosophical discipline — 'karate ni sentei nashi' (no first attack in karate). Unlike boxing or kickboxing, it includes kata (pre-arranged forms) as a competitive element, blending martial effectiveness with artistic expression. The belt ranking system provides clear progression milestones.",
  },

  judo: {
    tagline: "The gentle way — using your opponent's force against them.",
    about:
      "Judo is an Olympic martial art developed in Japan, emphasizing throws, pins, and submissions. India has produced Asian-level judo medalists, and the sport is growing through grassroots programs. Judo teaches maximum efficiency with minimum effort.",
    rules:
      "Two judokas compete on a mat, attempting to throw, pin, or submit the opponent. An immediate throw landing the opponent on their back scores ippon (full point) and wins the bout. Otherwise, scores are given for lesser throws and pins, with the highest total winning.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "Individual or team events",
    matchDuration: "4 minutes (two 2-minute periods)",
    howToPlay: "Two judokas attempt to throw, pin, or submit the opponent using grappling techniques. An ippon from a perfect throw ends the bout immediately.",
    objectiveOfGame: "Score ippon through a perfect throw, or accumulate more score through lesser techniques.",
    scoringSystem: "Ippon (instant win), Waza-ari (half point). Two waza-ari equals ippon.",
    playingSurface: "Judo tatami mat (14m x 14m competition area)",
    averageLearningTime: "2-3 years for intermediate level",
    origin: "Japan, 1882",
    equipment: [
      "Judo gi (uniform)",
      "Judo belt",
      "Mouthguard (optional)",
    ],
    benefits: {
      physical: [
        "Builds full-body functional strength",
        "Improves balance, coordination, and flexibility",
        "Develops explosive throwing power",
      ],
      mental: [
        "Teaches respect, humility, and self-discipline",
        "Builds composure and tactical awareness",
        "Develops confidence through controlled physical contact",
      ],
    },
    skills: [
      "Throw execution and timing",
      "Breakfall safety technique",
      "Groundwork and pins",
      "Balance breaking (kuzushi)",
    ],
    trainingPath:
      "Begin at a judo club or sports academy to learn breakfalls (ukemi), basic throws, and groundwork. Progress through belt grades (kyu/dan levels) and compete in district and state championships. Elite judokas can enter national camps and aim for Asian Games and Olympic selection via JFI.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Niche but growing — Asian-level medalists emerging from North-East India",
    popularityWorldwide: "Olympic staple with massive following in Japan, France, and South Korea",
    careerOpportunities: [
      "Professional judo athlete",
      "Judo coach and instructor",
      "Self-defense and security training",
      "Sports physiotherapy for grappling athletes",
    ],
    competitions: {
      state: [
        "State Judo Championships",
        "District judo meets",
      ],
      national: [
        "Senior National Judo Championship",
        "Junior National Judo Championship",
      ],
      international: [
        "World Judo Tour events",
        "Asian Judo Championship",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Judo Championships",
      "Olympic Games",
      "Asian Games judo",
    ],
    funFacts: [
      "Judo was the first Asian martial art to be included in the Olympic Games (1964 Tokyo).",
      "The highest judo rank is 10th dan (red belt), held by very few practitioners worldwide.",
      "Judo means 'the gentle way' and was founded by Jigoro Kano in 1882.",
    ],
    faqs: [
      {
        q: "Is judo suitable for children?",
        a: "Yes. Judo is one of the most popular martial arts for children, teaching discipline, respect, and physical skills from age 5-6.",
      },
      {
        q: "Do I need to be strong to do judo?",
        a: "Judo emphasizes technique over brute strength. Proper leverage and timing allow smaller judokas to throw larger opponents.",
      },
      {
        q: "What is the difference between judo and Brazilian Jiu-Jitsu?",
        a: "Judo emphasizes throws and pins, while BJJ focuses more on ground submissions. Both share common grappling roots.",
      },
    ],
    keyDifferences: "Judo's principle of 'maximum efficiency with minimum effort' (seiryoku zenyo) makes it unique — using an opponent's force against them. Unlike wrestling, judo scores ippon (instant win) from a perfect throw, creating explosive, decisive moments. The emphasis on throws over ground fighting distinguishes it from BJJ.",
  },

  kabaddi: {
    tagline: "India's indigenous contact sport — raid, tackle, and breathe.",
    about:
      "Kabaddi is an ancient Indian contact team sport that has seen a professional revival through the Pro Kabaddi League since 2014. It requires immense lung capacity, agility, and tactical awareness. India dominates international kabaddi and has won multiple World Cup titles.",
    rules:
      "Two teams of seven players take turns sending a 'raider' into the opponent's half. The raider must tag defenders and return to their half in a single breath while continuously chanting 'kabaddi.' Defenders try to tackle the raider and prevent their return.",
    individualOrTeam: "team",
    olympic: false,
    beginnerDifficulty: "Moderate",
    teamSize: "7 players per side",
    matchDuration: "40 minutes (two 20-minute halves)",
    howToPlay: "Two teams take turns sending a 'raider' into the opponent's half. The raider must tag defenders and return to their half in a single breath while chanting 'kabaddi'.",
    objectiveOfGame: "Score points by raiding (tagging defenders) and defending (tackling raiders). Highest total wins.",
    scoringSystem: "Touch point: 1 per defender tagged. Bonus point: 1 for crossing bonus line. Tackle point: 1 for stopping raider.",
    playingSurface: "Kabaddi mat or court (13m x 10m)",
    averageLearningTime: "1-2 years for competitive play",
    origin: "Ancient India",
    equipment: [
      "Kabaddi mat or court",
      "Jersey and shorts",
      "Knee and ankle supports",
    ],
    benefits: {
      physical: [
        "Builds explosive speed and agility",
        "Improves lung capacity and breath control",
        "Develops full-body strength and endurance",
      ],
      mental: [
        "Teaches quick decision-making under pressure",
        "Builds courage and tactical awareness",
        "Develops team coordination and trust",
      ],
    },
    skills: [
      "Raiding technique and touch points",
      "Dubki and escape moves",
      "Defensive chain tackle coordination",
      "Breath control and stamina",
    ],
    trainingPath:
      "Start at local kabaddi clubs or school teams to learn raiding techniques and defensive formations. Compete in district and state championships to gain match experience. Top players are scouted for Pro Kabaddi League and national team selection via AKFI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "High",
    popularityInIndia: "India's indigenous sport — PKL is the 2nd most-watched league after IPL",
    popularityWorldwide: "Primarily South Asian but growing through international tournaments and diaspora",
    careerOpportunities: [
      "Professional kabaddi player (PKL and international)",
      "Kabaddi coaching",
      "Sports commentary and analysis",
      "Sports management for kabaddi leagues",
    ],
    competitions: {
      state: [
        "State Kabaddi Championship",
        "Inter-school kabaddi tournaments",
      ],
      national: [
        "Pro Kabaddi League (PKL)",
        "Senior National Kabaddi Championship",
        "Yuva Kabaddi Series",
      ],
      international: [
        "Kabaddi World Cup",
        "Asian Games",
        "Asian Kabaddi Championship",
      ],
    },
    majorTournaments: [
      "Pro Kabaddi League (PKL)",
      "Kabaddi World Cup",
      "Asian Games kabaddi",
    ],
    funFacts: [
      "Kabaddi is believed to have originated over 4,000 years ago in ancient India.",
      "India has won every Kabaddi World Cup held so far (men's format).",
      "The Pro Kabaddi League is the second most-watched sports league in India after IPL.",
    ],
    faqs: [
      {
        q: "Is kabaddi suitable for beginners?",
        a: "Yes. Kabaddi is easy to learn at a basic level. Start with local clubs or school teams to learn the fundamentals.",
      },
      {
        q: "How important is lung capacity in kabaddi?",
        a: "Lung capacity is crucial. Raiders need to hold their breath while chanting 'kabaddi' during a raid, which can last 30-40 seconds.",
      },
      {
        q: "Can women play kabaddi?",
        a: "Absolutely. Women's kabaddi is growing rapidly, with PKL women's teams and international competitions offering equal opportunities.",
      },
    ],
    keyDifferences: "Kabaddi is uniquely Indian — the only major team sport where a single player (raider) faces the entire opposing team while holding their breath and chanting 'kabaddi'. This breath-control element exists in no other sport. It combines the physicality of wrestling with the tactical coordination of team defense.",
    formats: [
      { name: 'Standard', description: '7 players per side. Classic format with raiding and defending turns.', duration: '40 minutes (2 x 20)', teamSize: '7 per side' },
      { name: 'Pro Kabaddi League', description: 'India\'s premier kabaddi league. Fast-paced with timed raids and power-plays.', duration: '80 minutes total', teamSize: '7 per side' },
      { name: 'Circle Kabaddi', description: 'Outdoor format popular in Punjab. Played in a circle with different rules.', duration: 'Variable', teamSize: '12 per side' },
    ],
  },

  hockey: {
    tagline: "India's most decorated Olympic sport — speed, skill, and legacy.",
    about:
      "Field hockey is India's most successful Olympic sport, with eight gold medals. Strong talent bases exist in Punjab, Odisha, and Karnataka. The modern game is fast, technical, and played on artificial turf. India's resurgence in recent years includes Olympic bronze medals in 2020 and 2024.",
    rules:
      "Two teams of eleven players use curved sticks to hit a ball into the opponent's goal. Only the goalkeeper can use their body to stop the ball. A match consists of four quarters of 15 minutes each.",
    individualOrTeam: "team",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "11 players per side",
    matchDuration: "60 minutes (four 15-minute quarters)",
    howToPlay: "Two teams of eleven players use curved sticks to hit a ball into the opponent's goal. Only the goalkeeper can use their body to stop the ball.",
    objectiveOfGame: "Score more goals than the opposing team within four quarters.",
    scoringSystem: "One goal per ball entering the net. Highest total wins.",
    playingSurface: "Artificial turf field (91.4m x 55m)",
    averageLearningTime: "1-2 years for basic competence",
    origin: "England, 19th century",
    equipment: [
      "Hockey stick",
      "Hockey ball",
      "Shin guards",
      "Goalkeeper pads (if playing GK)",
      "Mouthguard",
    ],
    benefits: {
      physical: [
        "Builds cardiovascular endurance through constant running",
        "Improves agility and stick-handling coordination",
        "Develops lower-body strength and sprint speed",
      ],
      mental: [
        "Teaches teamwork and on-field communication",
        "Develops tactical awareness and game reading",
        "Builds discipline through rigorous training routines",
      ],
    },
    skills: [
      "Stick handling and dribbling",
      "Drag flick and penalty corner skills",
      "Positional play and game sense",
      "Tackling and intercepting passes",
    ],
    trainingPath:
      "Start at local hockey clubs or school programs to learn basic stick skills and game rules. Compete in district and state championships to gain competitive experience. Top players enter national camps and can aim for Hockey India League and Olympic selection via HI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "India's most decorated Olympic sport — 8 gold medals, Odisha government backing",
    popularityWorldwide: "Strong in Netherlands, Australia, Pakistan, and Germany — Olympic premier sport",
    careerOpportunities: [
      "Professional hockey player",
      "Hockey coaching and development",
      "Sports administration in hockey federations",
      "Turf management and sports facility operations",
    ],
    competitions: {
      state: [
        "State Hockey Championship",
        "Inter-school hockey tournaments",
      ],
      national: [
        "Hockey India League",
        "Senior National Hockey Championship",
        "Dhyan Chand Trophy",
      ],
      international: [
        "FIH Pro League",
        "Hockey World Cup",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "Olympic Games",
      "FIH Hockey World Cup",
      "FIH Pro League",
    ],
    funFacts: [
      "India has won 8 Olympic gold medals in hockey, more than any other country in the sport.",
      "Dhyan Chand, India's hockey legend, has his birthday (August 29) celebrated as National Sports Day.",
      "The Odisha government has been a major sponsor of Indian hockey, funding the national team's training infrastructure.",
    ],
    faqs: [
      {
        q: "Is field hockey different from ice hockey?",
        a: "Yes. Field hockey is played on turf/grass with a ball and curved stick, while ice hockey is played on ice with a puck and straight stick.",
      },
      {
        q: "At what age can children start hockey?",
        a: "Children can start with mini hockey programs from age 5-6. Competitive training usually begins around age 8-10.",
      },
      {
        q: "Why did India dominate hockey historically?",
        a: "India's dominance was built on exceptional stick skills, speed, and tactical intelligence, with legends like Dhyan Chand leading the way.",
      },
    ],
    keyDifferences: "Field hockey is the only major team sport played with an implement (stick), creating a unique skill set combining stick handling with running. Unlike football, the ball can travel at 150+ km/h off a drag flick, and 11 players per side on a turf field creates a fast-paced, continuous-flow game unlike any other.",
    formats: [
      { name: 'Field Hockey', description: 'The standard outdoor format. 11 players on water-based turf. Olympic sport.', duration: '60 minutes (4 x 15)', teamSize: '11 per side' },
      { name: 'Pro League', description: 'FIH Pro League. Top nations compete in a home-and-away league format.', duration: '60 minutes', teamSize: '11 per side' },
      { name: 'Indoor Hockey', description: '5 players per side on a smaller hard court. Faster and more technical.', duration: '4 x 10 minute quarters', teamSize: '5 per side' },
    ],
  },

  chess: {
    tagline: "The game of kings — where the mind is the ultimate weapon.",
    about:
      "Chess is a 64-square strategy board game with a thriving Indian professional scene, anchored by Viswanathan Anand. India has produced numerous grandmasters and is a global chess powerhouse. The game develops critical thinking, pattern recognition, and strategic planning.",
    rules:
      "Two players each control 16 pieces on an 8x8 board, trying to checkmate the opponent's king. Each piece type moves differently. The game can end in checkmate, stalemate, draw by repetition, or by agreement.",
    individualOrTeam: "individual",
    olympic: false,
    beginnerDifficulty: "Easy",
    teamSize: "Individual",
    matchDuration: "10 minutes to 6+ hours depending on time control",
    howToPlay: "Two players each control 16 pieces on an 8x8 board, trying to checkmate the opponent's king. Each piece type moves differently.",
    objectiveOfGame: "Checkmate the opponent's king — put it under attack with no legal escape.",
    scoringSystem: "Win: 1 point, Draw: 0.5 points, Loss: 0 points. Rating changes based on opponent strength.",
    playingSurface: "Chess board on a table (64 squares, 8x8 grid)",
    averageLearningTime: "6 months to 1 year for basic proficiency",
    origin: "India, 6th century AD",
    equipment: [
      "Chess board and pieces",
      "Chess clock",
      "Scorebook (for tournament play)",
    ],
    benefits: {
      physical: [
        "Improves concentration and stamina during long games",
        "Develops fine motor skills through piece handling",
        "Promotes healthy brain function through mental exercise",
      ],
      mental: [
        "Enhances critical thinking and problem-solving",
        "Builds pattern recognition and memory",
        "Teaches patience, planning, and decision-making",
      ],
    },
    skills: [
      "Opening theory and preparation",
      "Tactical pattern recognition",
      "Endgame technique and calculation",
      "Time management and mental stamina",
    ],
    trainingPath:
      "Learn the basic rules and pieces through local chess clubs or online platforms. Compete in district and state chess championships to gain rating points. Top players aim for FIDE titles (FM, IM, GM) and can represent India in Chess Olympiad and World Championship events via AICF.",
    trainingFrequency: "5-7 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Viswanathan Anand made India a chess powerhouse — 80+ grandmasters",
    popularityWorldwide: "Global mind sport with 600M+ players, massive online growth post-COVID",
    careerOpportunities: [
      "Professional chess player",
      "Chess coaching and academy",
      "Chess journalist and content creator",
      "Arbitration and tournament organization",
    ],
    competitions: {
      state: [
        "State Chess Championship",
        "District open tournaments",
      ],
      national: [
        "National Chess Championship",
        "AICF Rating tournaments",
        "Chess Olympiad (India team)",
      ],
      international: [
        "FIDE World Championship",
        "FIDE Grand Prix",
        "Chess Olympiad",
      ],
    },
    majorTournaments: [
      "FIDE World Chess Championship",
      "Chess Olympiad",
      "Tata Steel Chess Tournament",
    ],
    funFacts: [
      "India has over 80 grandmasters and is one of the top chess nations in the world.",
      "Viswanathan Anand was the first Asian to win the World Chess Championship (2000).",
      "The number of possible chess games exceeds the number of atoms in the observable universe.",
    ],
    faqs: [
      {
        q: "At what age should children learn chess?",
        a: "Children as young as 4-5 can learn basic chess rules. Formal training with tactics and strategy can begin from age 6-7.",
      },
      {
        q: "Is chess considered a sport?",
        a: "Yes. Chess is recognized as a sport by the International Olympic Committee (IOC) and requires intense mental and physical stamina.",
      },
      {
        q: "How do I improve my chess rating?",
        a: "Study tactics, analyze your games, play regularly in rated tournaments, and consider working with a chess coach.",
      },
    ],
    keyDifferences: "Chess is the only 'sport' played entirely in the mind — no physical movement beyond moving pieces. It's the only competitive activity where a 10-year-old can beat a 50-year-old through pure mental calculation. No other sport has a rating system (ELO) that so precisely measures skill across millions of players worldwide.",
  },

  skating: {
    tagline: "Roll with speed, grace, and adrenaline on wheels or blades.",
    about:
      "Skating encompasses inline, quad, and ice skating across speed, artistic, and roller hockey disciplines. India has a strong speed skating tradition with multiple Asian-level medalists. The sport is accessible from a young age and offers both recreational and competitive pathways.",
    rules:
      "Rules vary by discipline. In speed skating, competitors race to cover a set distance in the shortest time. Artistic skating is judged on technical skill and presentation. Roller hockey follows similar rules to field hockey but on a rink.",
    individualOrTeam: "both",
    olympic: false,
    beginnerDifficulty: "Moderate",
    teamSize: "Individual or relay teams of 4",
    matchDuration: "30 seconds to several hours depending on event",
    howToPlay: "Skaters race or perform on inline, quad, or ice skates. Speed skating races cover set distances; artistic skating is judged on technique and presentation.",
    objectiveOfGame: "Speed skating: fastest time wins. Artistic: highest score from judges based on technique and presentation.",
    scoringSystem: "Speed events: timed races, fastest wins. Artistic: judge-scored on technical merit and artistic impression.",
    playingSurface: "Skating rink or velodrome surface",
    averageLearningTime: "1-2 years for competitive skill level",
    origin: "Netherlands, 18th century",
    equipment: [
      "Inline or quad skates",
      "Helmet",
      "Knee and elbow pads",
      "Wrist guards",
    ],
    benefits: {
      physical: [
        "Builds leg strength and cardiovascular endurance",
        "Improves balance, coordination, and agility",
        "Enhances core stability and posture",
      ],
      mental: [
        "Builds confidence through progressive skill mastery",
        "Teaches perseverance and goal-setting",
        "Develops spatial awareness and focus",
      ],
    },
    skills: [
      "Balance and edge control",
      "Speed technique and aerodynamics",
      "Artistic expression and choreography",
      "Cornering and overtaking tactics",
    ],
    trainingPath:
      "Start with basic balance and skating drills at a local rink or skating club. Progress through district and state championships to gain competitive experience. Top skaters enter national championships (RSFI) and can aim for Asian Championships and World Skate Games.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Strong speed skating tradition — 100+ Asian Championship medals",
    popularityWorldwide: "Growing globally, ice skating huge in winter sports nations",
    careerOpportunities: [
      "Professional speed or artistic skater",
      "Skating coach and instructor",
      "Skate park and rink management",
      "Freestyle skating performance",
    ],
    competitions: {
      state: [
        "State Skating Championship",
        "District skating meets",
      ],
      national: [
        "RSFI National Skating Championship",
        "Khelo India skating events",
      ],
      international: [
        "World Skate Games",
        "Asian Inline Skating Championship",
        "World Speed Skating Championship",
      ],
    },
    majorTournaments: [
      "World Skate Games",
      "Asian Roller Skating Championship",
      "National Roller Skating Championship",
    ],
    funFacts: [
      "Roller skating was invented in the 18th century and was initially used as a way to 'walk on wheels'.",
      "India has won over 100 medals at Asian Roller Skating Championships.",
      "Speed skating on inline skates can reach speeds of over 50 km/h.",
    ],
    faqs: [
      {
        q: "At what age can children start skating?",
        a: "Children can start skating from age 4-5 with proper safety gear. Balance and basic movement skills develop quickly at this age.",
      },
      {
        q: "Is inline or quad skating better for beginners?",
        a: "Both are suitable for beginners. Inline skates are more commonly used for speed and outdoor skating, while quad skates are popular for artistic and recreational skating.",
      },
      {
        q: "Do I need to learn ice skating too?",
        a: "Not necessarily. Roller skating and ice skating are different disciplines. Choose the one that interests you or is more accessible in your area.",
      },
    ],
    keyDifferences: "Skating is unique in being a sport where the athlete is on wheels or blades — gliding rather than running. Speed skating combines aerodynamic tuck positions with high-speed cornering at 50+ km/h. Artistic skating blends dance with athletics, making it the only sport where performance is scored on both technical skill and artistic presentation.",
  },

  archery: {
    tagline: "Precision, focus, and stillness — hit the bullseye from any distance.",
    about:
      "Archery is a precision sport requiring focus, strength, and consistency. India has strongholds in Jharkhand, Manipur, and the North-East, and has produced Olympic medalists like Deepika Kumari. The sport demands physical steadiness and mental calmness.",
    rules:
      "Archers shoot arrows at a target from set distances (70m in Olympic recurve). Points are scored based on how close the arrow lands to the center. A match consists of sets of three arrows, with the highest total score winning.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Moderate",
    teamSize: "Individual or team events",
    matchDuration: "1-3 hours depending on format",
    howToPlay: "Archers shoot arrows at a target from set distances (70m in Olympic recurve). Points are scored based on how close the arrow lands to the center.",
    objectiveOfGame: "Score the highest total points by landing arrows closest to the bullseye.",
    scoringSystem: "10 points for innermost ring, decreasing to 1 for outermost. Highest total score wins.",
    playingSurface: "Outdoor range with flat shooting line and target butts",
    averageLearningTime: "1-2 years for consistent accuracy",
    origin: "Prehistoric era, competitive form from 14th century",
    equipment: [
      "Recurve or compound bow",
      "Arrows",
      "Arm guard and finger tab",
      "Quiver",
    ],
    benefits: {
      physical: [
        "Builds upper-body and core strength",
        "Improves posture and shoulder stability",
        "Enhances focus and fine motor control",
      ],
      mental: [
        "Develops intense concentration and mental stillness",
        "Teaches patience and consistency",
        "Builds confidence through precision improvement",
      ],
    },
    skills: [
      "Anchor point consistency",
      "Release and follow-through technique",
      "Wind reading and adjustment",
      "Mental focus and shot routine",
    ],
    trainingPath:
      "Begin at a local archery club or range to learn proper stance, draw, and release technique. Compete in district and state archery championships to build competitive experience. Elite archers can aim for national camps and Olympic selection via AAI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Strong in Jharkhand and North-East — Deepika Kumari was world No. 1",
    popularityWorldwide: "Olympic staple with growing popularity in South Korea, USA, and Europe",
    careerOpportunities: [
      "Professional archer",
      "Archery coaching and range management",
      "Sports equipment manufacturing",
      "Event management for archery tournaments",
    ],
    competitions: {
      state: [
        "State Archery Championship",
        "District archery meets",
      ],
      national: [
        "Senior National Archery Championship",
        "AAI Grand Prix events",
      ],
      international: [
        "World Archery Championships",
        "Asian Archery Championship",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Archery Championships",
      "Olympic Games",
      "Asian Games archery",
    ],
    funFacts: [
      "Archery is one of the oldest arts and was used for hunting and warfare for thousands of years.",
      "Deepika Kumari became the world No. 1 ranked archer in 2012 at age 18.",
      "Modern Olympic archery targets have a diameter of 122 cm, with the innermost 'X' ring just 6.1 cm wide.",
    ],
    faqs: [
      {
        q: "What age is best to start archery?",
        a: "Children can begin archery from age 8-10 with lightweight bows. Proper coaching ensures safe and effective skill development.",
      },
      {
        q: "Is archery physically demanding?",
        a: "Yes. Drawing a bow repeatedly requires significant upper-body and core strength, though it builds over time with training.",
      },
      {
        q: "What is the difference between recurve and compound bows?",
        a: "Recurve bows are used in Olympic competition and rely on arm strength, while compound bows use a pulley system for increased power and accuracy.",
      },
    ],
    keyDifferences: "Archery is the only sport where athletes aim at a stationary target from a fixed distance — no opponent interference. It's a duel of mental focus, not physical contact. The difference between gold and elimination can be 1mm at 70m, making it the most precision-dependent Olympic sport with no equivalent in skill demand.",
  },

  shooting: {
    tagline: "Steady hands, sharp eyes, and ice-cold nerves.",
    about:
      "Shooting sports encompass rifle, pistol, and shotgun disciplines, requiring extreme precision and composure. India has produced multiple Olympic medalists including Abhinav Bindra, Rajyavardhan Singh Rathore, and Manu Bhaker. The sport demands physical stillness and mental focus.",
    rules:
      "Shooters aim at targets from various distances using different firearms. In Olympic events, rifle and pistol shooters fire a set number of shots at stationary targets. The highest total score wins. Shotgun events involve hitting moving clay targets.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Challenging",
    teamSize: "Individual or team events",
    matchDuration: "1-3 hours depending on event",
    howToPlay: "Shooters aim at targets from various distances using different firearms. In Olympic events, rifle and pistol shooters fire a set number of shots at stationary targets.",
    objectiveOfGame: "Score the highest total points by placing shots closest to the center of the target.",
    scoringSystem: "Points scored per shot based on proximity to center (10.9 maximum in Olympic events). Highest total wins.",
    playingSurface: "Indoor or outdoor shooting range with electronic target systems",
    averageLearningTime: "2-3 years for competitive precision",
    origin: "19th century, competitive sport from 1896 Olympics",
    equipment: [
      "Air rifle or pistol",
      "Competition ammunition",
      "Shooting glasses and ear protection",
      "Shooting jacket and gloves (for rifle)",
    ],
    benefits: {
      physical: [
        "Develops exceptional hand steadiness and muscle control",
        "Improves breathing control and body stability",
        "Enhances visual focus and concentration",
      ],
      mental: [
        "Builds intense concentration and mental discipline",
        "Teaches emotional control under pressure",
        "Develops patience and precision-oriented thinking",
      ],
    },
    skills: [
      "Breath control and trigger squeeze",
      "Sight alignment and aiming stability",
      "Mental focus and shot routine",
      "Wind and environmental adjustment",
    ],
    trainingPath:
      "Begin with air rifle or air pistol at a local shooting range to learn safety, stance, and aiming. Compete in district and state shooting championships to build competitive experience. Elite shooters can aim for national championships and Olympic selection via NRAI.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Abhinav Bindra's gold sparked growth — Manu Bhaker is the new face",
    popularityWorldwide: "Olympic core sport, massive in USA, China, South Korea, and Germany",
    careerOpportunities: [
      "Professional shooter (Olympic and international)",
      "Shooting coach and range instructor",
      "Sports psychology for precision sports",
      "Armed forces and police recruitment (shooting skills valued)",
    ],
    competitions: {
      state: [
        "State Shooting Championship",
        "District shooting trials",
      ],
      national: [
        "National Shooting Championship",
        "ISSF selection trials",
        "Khelo India shooting events",
      ],
      international: [
        "ISSF World Cup",
        "World Shooting Championship",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "Olympic Games shooting",
      "ISSF World Cup",
      "World Shooting Championship",
    ],
    funFacts: [
      "Abhinav Bindra won India's first individual Olympic gold medal in shooting (2008 Beijing).",
      "Shooting requires a heart rate as low as 40-60 BPM during competition for maximum stability.",
      "The difference between first and last place in Olympic shooting can be as little as 0.1 points.",
    ],
    faqs: [
      {
        q: "At what age can children start shooting?",
        a: "Children can begin air rifle training from age 10-12. Safety and proper coaching are essential from the start.",
      },
      {
        q: "Is shooting equipment easy to get started with?",
        a: "Beginners can start with air rifle or air pistol which are widely available. Many ranges offer rental equipment so you can try before investing in your own gear.",
      },
      {
        q: "Do I need good eyesight for shooting?",
        a: "Good vision helps, but shooting glasses can correct vision issues. The skill is more about focus, stability, and technique than perfect eyesight.",
      },
    ],
    keyDifferences: "Shooting is the only Olympic sport where athletes must control their heartbeat — shooters aim with heart rates as low as 40 BPM. No other sport demands such extreme physiological stillness combined with pinpoint precision. The mental battle is internal, with no external opponent, making it unique in competitive sports.",
  },

  yoga: {
    tagline: "India's gift to the world — unite body, mind, and breath.",
    about:
      "Yoga is an ancient Indian practice that has evolved into a competitive sport with international championships. It encompasses physical postures (asanas), breathing techniques (pranayama), and meditation. India is the global epicenter of yoga, and the practice is recognized by the UN.",
    rules:
      "In competitive yoga, participants perform a series of postures judged on technique, flexibility, balance, and duration. Competitions follow specific routines and scoring criteria. Yoga also has traditional practice with no formal competition rules.",
    individualOrTeam: "both",
    olympic: false,
    beginnerDifficulty: "Easy",
    teamSize: "Individual",
    matchDuration: "15-90 minutes per session",
    howToPlay: "Practitioners perform a series of physical postures (asanas), breathing techniques (pranayama), and meditation. Competitive yoga is judged on technique, flexibility, and balance.",
    objectiveOfGame: "Achieve physical and mental balance through postures, breathing, and meditation. In competition, score highest on technique and difficulty.",
    scoringSystem: "Competitive: judged on posture accuracy, flexibility, balance, and duration. Traditional: no formal scoring.",
    playingSurface: "Yoga mat on any flat surface, indoor or outdoor",
    averageLearningTime: "3-6 months for basic postures, years for advanced practice",
    origin: "Ancient India, 3000 BC",
    equipment: [
      "Yoga mat",
      "Comfortable clothing",
      "Yoga blocks and straps (optional)",
    ],
    benefits: {
      physical: [
        "Improves flexibility and joint mobility",
        "Builds core strength and balance",
        "Enhances respiratory function through pranayama",
      ],
      mental: [
        "Reduces stress and anxiety",
        "Improves focus and mental clarity",
        "Promotes emotional balance and self-awareness",
      ],
    },
    skills: [
      "Asana alignment and precision",
      "Pranayama (breathing) technique",
      "Flexibility and balance control",
      "Meditation and mental focus",
    ],
    trainingPath:
      "Begin with basic yoga classes at a local studio or online to learn foundational postures and breathing. Progress through regular practice to intermediate and advanced asanas. Competitive yogis can participate in state and national championships and aim for Asian and World Yogasana Championships.",
    trainingFrequency: "5-7 days/week",
    injuryRisk: "Low",
    popularityInIndia: "India's gift to the world — 300M+ global practitioners, International Yoga Day",
    popularityWorldwide: "Global wellness phenomenon — most practiced mind-body practice worldwide",
    careerOpportunities: [
      "Yoga instructor and studio owner",
      "Corporate wellness trainer",
      "Yoga therapy and rehabilitation",
      "Content creation and online yoga platforms",
    ],
    competitions: {
      state: [
        "State Yogasana Championship",
        "District yoga competitions",
      ],
      national: [
        "National Yogasana Championship",
        "All India Yoga Championship",
      ],
      international: [
        "Asian Yogasana Championship",
        "World Yogasana Championship",
        "International Day of Yoga events",
      ],
    },
    majorTournaments: [
      "World Yogasana Championship",
      "Asian Yogasana Championship",
      "National Yogasana Championship",
    ],
    funFacts: [
      "The International Day of Yoga (June 21) was proposed by India and adopted by the UN in 2014.",
      "Yoga originated in India over 5,000 years ago and was originally a spiritual practice.",
      "Over 300 million people worldwide practice yoga regularly.",
    ],
    faqs: [
      {
        q: "Can anyone start yoga at any age?",
        a: "Yes. Yoga is suitable for all ages and fitness levels. Modified postures make it accessible even for those with physical limitations.",
      },
      {
        q: "Is yoga a sport?",
        a: "Traditional yoga is a practice, but competitive yogasana is recognized as a sport with formal rules, judging, and international championships.",
      },
      {
        q: "How often should I practice yoga?",
        a: "For general health benefits, 3-5 sessions per week of 30-60 minutes is recommended. Consistency is more important than intensity.",
      },
    ],
    keyDifferences: "Yoga is the only sport where the competition is against your own body's limitations — no opponent, no ball, no scoreboard in traditional practice. It uniquely integrates physical postures, breath control, and meditation into a single discipline. Unlike any other sport, it improves both athletic performance and mental well-being simultaneously.",
  },

  gymnastics: {
    tagline: "Defy gravity — flip, twist, and land with precision.",
    about:
      "Gymnastics encompasses artistic, rhythmic, and trampoline disciplines, requiring extraordinary flexibility, strength, and body awareness. India has produced continental medal winners and the sport is gaining popularity through Khelo India programs. It builds an incredible athletic foundation.",
    rules:
      "In artistic gymnastics, athletes perform routines on various apparatus (floor, vault, beam, bars for women; floor, vault, rings, pommel horse, parallel bars, high bar for men). Routines are scored on difficulty and execution. Rhythmic gymnastics involves apparatus manipulation with dance elements.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Challenging",
    teamSize: "Individual or team of 4-5",
    matchDuration: "30 seconds to 90 seconds per routine",
    howToPlay: "Athletes perform routines on various apparatus (floor, vault, beam, bars for women; floor, vault, rings, pommel horse, parallel bars, high bar for men). Routines are scored on difficulty and execution.",
    objectiveOfGame: "Execute routines with maximum difficulty and minimal errors to achieve the highest score.",
    scoringSystem: "Difficulty score (D-score) + Execution score (E-score). Highest total wins. Deductions for errors.",
    playingSurface: "Gymnastics mats and specialized apparatus on competition floor",
    averageLearningTime: "3-5 years to reach competitive level",
    origin: "Ancient Greece, modern form from 19th century",
    equipment: [
      "Gymnastics leotard",
      "Gymnastics mat",
      "Apparatus (varies by discipline)",
      "Grips and wristbands",
    ],
    benefits: {
      physical: [
        "Builds exceptional flexibility and range of motion",
        "Develops strength-to-body-weight ratio",
        "Improves spatial awareness and body control",
      ],
      mental: [
        "Builds confidence through mastering complex skills",
        "Teaches discipline and attention to detail",
        "Develops courage to attempt challenging moves",
      ],
    },
    skills: [
      "Flexibility and split technique",
      "Acrobatic tumbling and vaulting",
      "Balance beam and apparatus control",
      "Strength-to-bodyweight movements",
    ],
    trainingPath:
      "Begin at a gymnastics academy with foundational flexibility, strength, and basic skill training. Progress through age-group competitions at district and state levels. Elite gymnasts can enter national camps and aim for Asian Games and Olympic selection via GFI.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "High",
    popularityInIndia: "Dipa Karmakar inspired a generation — Khelo India boosting participation",
    popularityWorldwide: "Olympic marquee sport, massive in USA, China, Russia, and Japan",
    careerOpportunities: [
      "Professional gymnast",
      "Gymnastics coaching and academy management",
      "Choreography for rhythmic gymnastics",
      "Circus and performance arts",
    ],
    competitions: {
      state: [
        "State Gymnastics Championship",
        "District gymnastics meets",
      ],
      national: [
        "Senior National Gymnastics Championship",
        "Khelo India gymnastics events",
      ],
      international: [
        "World Gymnastics Championships",
        "Asian Games gymnastics",
        "Olympic Games",
      ],
    },
    majorTournaments: [
      "World Gymnastics Championships",
      "Olympic Games",
      "Asian Games gymnastics",
    ],
    funFacts: [
      "Gymnastics was part of the first modern Olympic Games in 1896.",
      "The Perfect 10 in gymnastics was first achieved by Nadia Comaneci at the 1976 Olympics.",
      "Dipa Karmakar became the first Indian female gymnast to qualify for an Olympic Games (2016 Rio).",
    ],
    faqs: [
      {
        q: "At what age should children start gymnastics?",
        a: "Children can start recreational gymnastics from age 4-5. Competitive training typically begins around age 6-8.",
      },
      {
        q: "Is gymnastics dangerous?",
        a: "Gymnastics carries injury risks, but proper coaching, progressive skill development, and safety equipment significantly reduce danger.",
      },
      {
        q: "Can adults start gymnastics?",
        a: "Yes, adults can start gymnastics, though learning advanced skills takes longer. Many gyms offer adult beginner classes focused on fitness and basic skills.",
      },
    ],
    keyDifferences: "Gymnastics is the only sport where athletes perform acrobatic feats — flips, twists, and somersaults — on specialized apparatus. The combination of flexibility, strength, and spatial awareness at heights creates a unique risk-reward dynamic. A perfect 10 requires flawless execution, making it the most technically demanding Olympic sport.",
  },

  volleyball: {
    tagline: "High-energy net sport — fast rallies, big spikes, and explosive teamwork.",
    about:
      "Volleyball is a team sport where two teams of six players each try to ground the ball on the opponent's side of the net. It is hugely popular in India's school and college circuits and is gaining professional traction with the Pro Volleyball League. It demands quick reflexes, vertical jumping ability, and seamless team coordination.",
    rules:
      "Each team has six players on court. Teams alternate hitting the ball over the net, with each side allowed a maximum of three touches before returning. Points are scored when the ball lands on the opponent's court or the opponent commits a fault. Sets are played to 25 points (best of 5).",
    individualOrTeam: "team",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "6 players per side",
    matchDuration: "60-90 minutes (best of 5 sets to 25 points)",
    howToPlay: "Two teams of six players each try to ground the ball on the opponent's side of the net. Each side is allowed a maximum of three touches before returning the ball.",
    objectiveOfGame: "Win rallies by grounding the ball on the opponent's court or forcing errors. Best of 5 sets wins.",
    scoringSystem: "Rally scoring to 25 points per set (win by 2). Best of 5 sets wins the match.",
    playingSurface: "Indoor court with hard surface (18m x 9m)",
    averageLearningTime: "6 months to 1 year for basic skills",
    origin: "USA, 1895",
    equipment: [
      "Volleyball",
      "Knee pads",
      "Sports shoes with good grip",
      "Jersey and shorts",
    ],
    benefits: {
      physical: [
        "Builds explosive leg power and vertical jump",
        "Improves hand-eye coordination and reflexes",
        "Enhances cardiovascular endurance through constant movement",
      ],
      mental: [
        "Develops quick decision-making under pressure",
        "Teaches trust and reliance on teammates",
        "Builds competitive resilience — momentum shifts fast",
      ],
    },
    skills: [
      "Serving (underhand, overhand, jump serve)",
      "Spiking and attacking techniques",
      "Blocking and defensive positioning",
      "Setting and playmaking coordination",
    ],
    trainingPath:
      "Start with school or college teams to learn fundamentals — serving, passing, setting, and spiking. Join local volleyball clubs for structured coaching. Compete in inter-school and district tournaments. State-level volleyball federations conduct selection trials for national championships and Pro Volleyball League.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "Medium",
    popularityInIndia: "Very popular in school and college circuits; growing professional scene",
    popularityWorldwide: "Top 5 globally, massive in Brazil, Japan, Italy, Russia",
    careerOpportunities: [
      "Professional player (domestic and international leagues)",
      "Volleyball coaching and academy training",
      "Sports management and event organisation",
      "Physical education and school coaching",
    ],
    competitions: {
      state: [
        "State Volleyball Championship",
        "Inter-University Volleyball Tournament",
      ],
      national: [
        "Senior National Volleyball Championship",
        "Pro Volleyball League",
        "Vuclip National Volleyball League",
      ],
      international: [
        "FIVB World Championship",
        "Asian Games Volleyball",
        "AVC Asian Volleyball Championship",
      ],
    },
    majorTournaments: [
      "Pro Volleyball League (India)",
      "FIVB World Championship",
      "Asian Games Volleyball",
    ],
    funFacts: [
      "Volleyball was invented in 1895 by William G. Morgan as a less intense alternative to basketball.",
      "India's Pro Volleyball League launched in 2019, featuring teams from 6 cities.",
      "The longest volleyball rally in professional history lasted 47 minutes.",
    ],
    faqs: [
      {
        q: "Is volleyball good for height growth?",
        a: "Volleyball involves jumping and stretching, which promotes healthy bone development, though genetics remain the primary factor in height.",
      },
      {
        q: "Can I play volleyball with近视 (nearsightedness)?",
        a: "Yes, contact lenses or sports glasses work well. Many competitive players wear corrective lenses during play.",
      },
      {
        q: "What position should a beginner start with?",
        a: "Outside hitter or back-row defender — these positions offer the best mix of involvement and skill development for beginners.",
      },
    ],
    keyDifferences: "Volleyball is the only major team sport where the ball never touches the ground during rallies — every point is a continuous aerial exchange. Unlike football or basketball, there is no direct physical contact between opponents, making it purely skill-based. The rotation rule ensures every player plays both offense and defense.",
  },

  cycling: {
    tagline: "Endurance sport of legs, lungs, and the open road.",
    about:
      "Cycling is both a popular recreational activity and a competitive endurance sport in India. From weekend骑行 on city roads to professional track and road racing, cycling builds exceptional cardiovascular fitness. India has a growing cycling culture with events like the Tour of Nilgiris and increasing urban cycling movements.",
    rules:
      "In road cycling, competitors race on open or closed roads over set distances. Track cycling takes place on velodromes with specific event formats (sprint, pursuit, keirin). Mountain biking involves off-road terrain. Timed events measure speed or distance; road races measure finishing position.",
    individualOrTeam: "both",
    olympic: true,
    beginnerDifficulty: "Easy",
    teamSize: "Individual or team of 4-8",
    matchDuration: "30 minutes to 5+ hours depending on event",
    howToPlay: "Competitors ride bicycles on roads, tracks, or off-road terrain. Events range from short sprints to multi-stage races covering thousands of kilometers.",
    objectiveOfGame: "Be the first to cross the finish line or complete the course in the fastest time.",
    scoringSystem: "Road: first to finish wins. Track: timed events or head-to-head sprints. Points races: accumulated lap and sprint points.",
    playingSurface: "Roads, velodromes, or off-road trails",
    averageLearningTime: "6 months to 1 year for fitness cycling, 2-3 years for competitive",
    origin: "Germany, 19th century",
    equipment: [
      "Road or mountain bicycle",
      "Helmet",
      "Cycling shorts and jersey",
      "Water bottles and repair kit",
      "Cycling shoes (optional)",
    ],
    benefits: {
      physical: [
        "Builds exceptional cardiovascular endurance",
        "Strengthens legs, core, and glutes",
        "Low-impact on joints — sustainable long-term fitness",
      ],
      mental: [
        "Reduces stress through rhythmic, meditative pedalling",
        "Builds mental toughness for long-distance rides",
        "Boosts mood through endorphin release from sustained effort",
      ],
    },
    skills: [
      "Cadence control and gear shifting",
      "Hill climbing and descent techniques",
      "Group riding and drafting strategy",
      "Bike maintenance and roadside repair",
    ],
    trainingPath:
      "Start with regular cycling for fitness and commute. Join local cycling groups for group rides and technique tips. Progress to competitive events — time trials, gran fondos, and state championships. Elite riders train for national championships and international tours under Cycling Federation of India.",
    trainingFrequency: "5-6 days/week",
    injuryRisk: "Low",
    popularityInIndia: "Growing urban fitness culture; competitive scene developing",
    popularityWorldwide: "Massive globally — Tour de France is iconic; billion+ riders worldwide",
    careerOpportunities: [
      "Professional road or track cyclist",
      "Cycling coaching and tour guiding",
      "Bicycle mechanics and shop ownership",
      "Sports physiotherapy for cyclists",
    ],
    competitions: {
      state: [
        "State Road Cycling Championship",
        "State Track Cycling Championship",
      ],
      national: [
        "National Road Cycling Championship",
        "Tour of Nilgiris",
        "National Track Cycling Championship",
      ],
      international: [
        "UCI Road World Championships",
        "Asian Cycling Championships",
        "Tour de France (invitation-based)",
      ],
    },
    majorTournaments: [
      "Tour of Nilgiris (India)",
      "UCI Road World Championships",
      "Asian Cycling Championships",
    ],
    funFacts: [
      "The Tour de France covers approximately 3,500 km over 23 days — riders burn up to 6,000 calories daily.",
      "India's Tour of Nilgiris is one of Asia's toughest multi-stage bicycle races.",
      "A professional cyclist's heart rate stays at 70-90% of maximum for hours — a level most people can only sustain for minutes.",
    ],
    faqs: [
      {
        q: "What type of bicycle should a beginner buy?",
        a: "A hybrid bicycle (₹15,000–₹30,000) is ideal for beginners — it handles both road and light trail riding comfortably.",
      },
      {
        q: "Is cycling safe on Indian roads?",
        a: "Use dedicated cycling lanes where available, wear a helmet, use lights, and ride during off-peak hours. Group rides are safer than solo riding.",
      },
      {
        q: "Can cycling help with weight loss?",
        a: "Yes, cycling burns 400-800 calories per hour depending on intensity, making it one of the most effective fat-burning exercises.",
      },
    ],
    keyDifferences: "Cycling is unique as both a daily transport mode and a competitive sport. Unlike most sports, it covers enormous distances (200-300 km/day in professional racing) over hours, testing sustained aerobic capacity. It is one of the few sports where equipment choice significantly affects performance.",
  },

  rugby: {
    tagline: "Full-contact team sport — raw power meets tactical precision.",
    about:
      "Rugby is a high-intensity, full-contact team sport that combines the physicality of American football with continuous play. While not yet mainstream in India, rugby is growing through the Rugby India federation and university circuits. The sport is known for its emphasis on sportsmanship — players shake hands regardless of outcome.",
    rules:
      "Two teams of 15 players (union) or 13 (league) compete to carry, pass, or kick the ball to score tries (touching the ball down in the opponent's in-goal area) or goals. The ball can only be passed laterally or backward. Tackles are made below the shoulders. A match consists of two 40-minute halves.",
    individualOrTeam: "team",
    olympic: true,
    beginnerDifficulty: "Challenging",
    teamSize: "15 players (union) or 13 players (league)",
    matchDuration: "80 minutes (two 40-minute halves)",
    howToPlay: "Two teams compete to carry, pass, or kick the ball to score tries by touching the ball down in the opponent's in-goal area. The ball can only be passed laterally or backward.",
    objectiveOfGame: "Score more points than the opposing team through tries, conversions, penalties, and drop goals.",
    scoringSystem: "Try: 5 points, Conversion: 2 points, Penalty kick: 3 points, Drop goal: 3 points",
    playingSurface: "Grass or turf field (100m x 70m)",
    averageLearningTime: "2-3 years for competitive proficiency",
    origin: "England, 1823",
    equipment: [
      "Rugby ball",
      "Mouthguard",
      "Rugby boots (studded)",
      "Scrum cap (optional)",
      "Padded jersey",
    ],
    benefits: {
      physical: [
        "Builds full-body strength and explosive power",
        "Develops exceptional cardiovascular endurance",
        "Improves tackling, carrying, and functional strength",
      ],
      mental: [
        "Teaches discipline and controlled aggression",
        "Develops split-second tactical decision-making",
        "Builds incredible team bonding and brotherhood",
      ],
    },
    skills: [
      "Tackling technique and ball carrying",
      "Passing accuracy under pressure",
      "Rucking and mauling at the breakdown",
      "Positional awareness and defensive structure",
    ],
    trainingPath:
      "Start with touch or tag rugby (non-contact) to learn ball handling and rules. Progress to contact rugby at school or university clubs. Join state-level rugby unions for structured coaching. Represent India through Rugby India's national team pathway.",
    trainingFrequency: "4-5 days/week",
    injuryRisk: "High",
    popularityInIndia: "Niche but growing — strong university circuit",
    popularityWorldwide: "Massive in New Zealand, Australia, UK, France, South Africa",
    careerOpportunities: [
      "Professional player (domestic and international leagues)",
      "Rugby coaching and development officer",
      "Sports strength and conditioning coaching",
      "Match officiating and refereeing",
    ],
    competitions: {
      state: [
        "State Rugby Championship",
        "University Rugby League",
      ],
      national: [
        "All India Rugby Championship",
        "Rugby India National League",
      ],
      international: [
        "Asian Rugby Championship",
        "Rugby World Cup",
        "HSBC World Rugby Sevens Series",
      ],
    },
    majorTournaments: [
      "All India Rugby Championship",
      "Asian Rugby Championship",
      "Rugby World Cup",
    ],
    funFacts: [
      "Rugby was invented in 1823 when William Webb Ellis picked up the ball and ran during a football match at Rugby School.",
      "The Rugby World Cup final is one of the most-watched sporting events globally, with over 1 billion viewers.",
      "Rugby players are known for cleaning the changing room after matches — a tradition of humility.",
    ],
    faqs: [
      {
        q: "Is rugby safe for beginners?",
        a: "Start with touch or tag rugby (non-contact) before progressing to contact. Proper coaching on tackling technique significantly reduces injury risk.",
      },
      {
        q: "How is rugby different from American football?",
        a: "Rugby has continuous play (no downs), no protective padding, and the ball is smaller and more rounded. Rugby emphasizes fitness and endurance more than explosive bursts.",
      },
      {
        q: "Can women play rugby?",
        a: "Absolutely — women's rugby is one of the fastest-growing sports globally. Touch rugby is a great entry point, and full-contact women's rugby is an Olympic sport.",
      },
    ],
    keyDifferences: "Rugby is the only major sport where the ball can be passed only backward, creating a unique flowing attack dynamic. Unlike football (soccer), it allows full-contact tackling and the ball can be carried. Unlike American football, it has continuous play without breaks, requiring extraordinary fitness. The culture of respect — players socialise together after brutal matches — sets it apart.",
  },
};
