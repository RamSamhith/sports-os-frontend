import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

class Benefit {
  final String title;
  final String description;

  Benefit({required this.title, required this.description});
}

class Sport {
  final String id;
  final String name;
  final String heroImage;
  final String description;
  final List<Benefit> physicalBenefits;
  final List<Benefit> mentalBenefits;

  Sport({
    required this.id,
    required this.name,
    required this.heroImage,
    required this.description,
    required this.physicalBenefits,
    required this.mentalBenefits,
  });
}

final _initialSports = [

    Sport(
      id: 'cricket',
      name: 'Cricket',
      heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000',
      description: 'Cricket is a bat-and-ball game played between two teams of eleven players on a field at the centre of which is a 22-yard pitch with a wicket at each end.',
      physicalBenefits: [
        Benefit(title: 'Stamina', description: 'Improves cardiovascular health through constant running and quick sprints.'),
        Benefit(title: 'Hand-Eye Coordination', description: 'Enhances motor skills by tracking the fast-moving ball.'),
        Benefit(title: 'Agility', description: 'Develops quick reflexes required for fielding and batting.'),
      ],
      mentalBenefits: [
        Benefit(title: 'Strategic Thinking', description: 'Requires planning and tactical adjustments based on the game situation.'),
        Benefit(title: 'Teamwork', description: 'Fosters collaboration and communication with teammates.'),
        Benefit(title: 'Patience', description: 'Builds resilience and patience, especially in longer formats of the game.'),
      ],
    ),
    Sport(
      id: 'football',
      name: 'Football',
      heroImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
      description: 'Football is a family of team sports that involve, to varying degrees, kicking a ball to score a goal.',
      physicalBenefits: [
        Benefit(title: 'Cardiovascular Fitness', description: 'Running across the field improves heart health and endurance.'),
        Benefit(title: 'Muscle Strength', description: 'Builds lower body strength and core stability.'),
        Benefit(title: 'Bone Density', description: 'Weight-bearing exercises improve bone strength.'),
      ],
      mentalBenefits: [
        Benefit(title: 'Quick Decision Making', description: 'Players must analyze the field and make split-second decisions.'),
        Benefit(title: 'Discipline', description: 'Requires strict adherence to rules and regular practice schedules.'),
      ],
    ),
    Sport(
      id: 'badminton',
      name: 'Badminton',
      heroImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000',
      description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
      physicalBenefits: [
        Benefit(title: 'Flexibility', description: 'Constant stretching and reaching improves overall flexibility.'),
        Benefit(title: 'Metabolism', description: 'High-intensity rallies burn significant calories.'),
        Benefit(title: 'Reflexes', description: 'The fast pace of the shuttlecock requires lightning-fast reactions.'),
      ],
      mentalBenefits: [
        Benefit(title: 'Focus', description: 'Intense concentration is needed to track the shuttlecock.'),
        Benefit(title: 'Stress Relief', description: 'The physical exertion releases endorphins, reducing stress.'),
      ],
    ),
    Sport(
      id: 'fitness',
      name: 'Fitness',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
      description: 'Fitness training encompasses a range of physical activities focused on strength, endurance, and overall well-being.',
      physicalBenefits: [
        Benefit(title: 'Overall Strength', description: 'Lifting and resistance exercises build muscle mass.'),
        Benefit(title: 'Immunity', description: 'Regular exercise boosts the immune system.'),
      ],
      mentalBenefits: [
        Benefit(title: 'Confidence', description: 'Achieving fitness goals boosts self-esteem and body image.'),
        Benefit(title: 'Mental Clarity', description: 'Exercise increases blood flow to the brain, improving cognitive function.'),
      ],
    ),
    Sport(
      id: 'martial_arts',
      name: 'Martial Arts',
      heroImage: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000',
      description: 'Martial arts are codified systems and traditions of combat practiced for a number of reasons such as self-defense; military and law enforcement applications; competition; physical, mental, and spiritual development.',
      physicalBenefits: [
        Benefit(title: 'Flexibility & Balance', description: 'Enhances body control through dynamic stretching and postures.'),
        Benefit(title: 'Core Strength', description: 'Builds immense core power necessary for striking and grappling.'),
        Benefit(title: 'Cardiovascular Health', description: 'Intense sparring and drills significantly improve heart rate and stamina.'),
      ],
      mentalBenefits: [
        Benefit(title: 'Discipline', description: 'Instills deep respect, self-control, and adherence to tradition.'),
        Benefit(title: 'Stress Relief', description: 'Releases tension through controlled physical exertion and focus.'),
        Benefit(title: 'Self-Confidence', description: 'Empowers individuals with the knowledge and capability of self-defense.'),
      ],
    ),
];


final Map<String, String> _sportFallbackImages = {
  'archery': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
  'athletics': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000',
  'basketball': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1000',
  'chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000',
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000',
  'cycling': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000',
  'football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
  'gymnastics': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/ESTADOS_UNIDOS_LEVAM_OURO_NA_GIN%C3%81STICA_FEMININA_POR_EQUIPES_DOS_JOGOS_OL%C3%8DMPICOS_RIO_2016_%2828849586476%29.jpg/1280px-ESTADOS_UNIDOS_LEVAM_OURO_NA_GIN%C3%81STICA_FEMININA_POR_EQUIPES_DOS_JOGOS_OL%C3%8DMPICOS_RIO_2016_%2828849586476%29.jpg',
  'hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=1000',
  'kabaddi': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Iran_men%27s_national_kabaddi_team_13970602000432636707284535394012_98208.jpg',
  'rugby': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2014_Women%27s_Six_Nations_Championship_-_France_Italy_%2851%29.jpg/1280px-2014_Women%27s_Six_Nations_Championship_-_France_Italy_%2851%29.jpg',
  'shooting': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Skeet_masculin_aux_Jeux_olympiques_de_2024_-_%C3%89ric_Delaunay_%282%29.jpg/1280px-Skeet_masculin_aux_Jeux_olympiques_de_2024_-_%C3%89ric_Delaunay_%282%29.jpg',
  'skating': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Skating%2C_man%2C_woman%2C_ice-skating_rink%2C_winter%2C_smile%2C_free_time_Fortepan_14348.jpg/1280px-Skating%2C_man%2C_woman%2C_ice-skating_rink%2C_winter%2C_smile%2C_free_time_Fortepan_14348.jpg',
  'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000',
  'table tennis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mondial_Ping_-_Men%27s_Singles_-_Round_4_-_Kenta_Matsudaira-Vladimir_Samsonov_-_57.jpg/1280px-Mondial_Ping_-_Men%27s_Singles_-_Round_4_-_Kenta_Matsudaira-Vladimir_Samsonov_-_57.jpg',
  'tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000',
  'volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000',
  'wrestling': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Wrestling_at_the_2016_Summer_Olympics%2C_Gazyumov_vs_Andriitsev_6.jpg/1280px-Wrestling_at_the_2016_Summer_Olympics%2C_Gazyumov_vs_Andriitsev_6.jpg',
  'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
  'martial arts': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1000',
  'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000',
};

String getFallbackImage(String name) {
  final key = name.toLowerCase().trim();
  return _sportFallbackImages[key] ?? 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000';
}

class SportsNotifier extends StateNotifier<List<Sport>> {

  final ApiService _api = ApiService();

  SportsNotifier() : super(_initialSports) {
    _fetchSports();
  }



  List<Benefit> _parseBenefits(dynamic jsonList, String sportName, bool isPhysical) {
    Sport? fallbackSport;
    try {
      fallbackSport = _initialSports.firstWhere(
        (s) => s.name.toLowerCase() == sportName.toLowerCase(),
      );
    } catch (e) {
      fallbackSport = null;
    }

    final fallbackBenefits = fallbackSport != null 
        ? (isPhysical ? fallbackSport.physicalBenefits : fallbackSport.mentalBenefits)
        : <Benefit>[];

    // If we have rich fallback benefits for this sport (like Cricket), use them directly 
    // so we maintain the detailed title + description UI as requested by the user.
    if (fallbackBenefits.isNotEmpty) {
      return fallbackBenefits;
    }

    // Otherwise, parse from the API (for new sports)
    if (jsonList is List && jsonList.isNotEmpty) {
      return jsonList.map<Benefit>((item) {
        return Benefit(title: item.toString(), description: '');
      }).toList();
    }

    return <Benefit>[];
  }

  Future<void> _fetchSports() async {
    try {
      final res = await _api.getSports();
      if (res['success'] && res['data'] != null && res['data']['items'] != null) {
        final List items = res['data']['items'];
        if (items.isNotEmpty) {
          final List<Sport> fetchedSports = items.map<Sport>((json) {
              final sportName = json['name'] ?? '';
              return Sport(
                id: json['id']?.toString() ?? json['_id']?.toString() ?? json['sportId']?.toString() ?? '',
                name: sportName,
                heroImage: json['imageUrl'] ?? getFallbackImage(sportName),
                description: json['description'] ?? (
                  _initialSports.firstWhere(
                    (s) => s.name.toLowerCase() == (json['name'] ?? '').toLowerCase(),
                    orElse: () => Sport(id: '', name: '', heroImage: '', description: '', physicalBenefits: [], mentalBenefits: []),
                  ).description
                ),
                physicalBenefits: _parseBenefits(json['physicalBenefits'], sportName, true),
                mentalBenefits: _parseBenefits(json['mentalBenefits'], sportName, false),
              );
            }).toList();

            for (var initial in _initialSports) {
              if (!fetchedSports.any((s) => s.name.toLowerCase() == initial.name.toLowerCase())) {
                fetchedSports.add(initial);
              }
            }

            // Sort sports by popularity, then alphabetically
            final priority = [
              'cricket',
              'football',
              'badminton',
              'tennis',
              'basketball',
              'volleyball',
              'swimming',
              'martial arts',
            ];
            
            fetchedSports.sort((a, b) {
              final aName = a.name.toLowerCase();
              final bName = b.name.toLowerCase();
              final aIndex = priority.indexOf(aName);
              final bIndex = priority.indexOf(bName);
              
              if (aIndex != -1 && bIndex != -1) {
                return aIndex.compareTo(bIndex);
              } else if (aIndex != -1) {
                return -1;
              } else if (bIndex != -1) {
                return 1;
              } else {
                return aName.compareTo(bName);
              }
            });

            state = fetchedSports;
        }
      }
    } catch (e) {
      print('Error fetching sports: $e');
      // Keep initial sports on error
    }
  }
}

final sportsProvider = StateNotifierProvider<SportsNotifier, List<Sport>>((ref) {
  return SportsNotifier();
});
