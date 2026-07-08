import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';

class CompareScreen extends ConsumerWidget {
  final List<String> selectedAcademyNames;

  const CompareScreen({super.key, required this.selectedAcademyNames});

  // Mock data for resolving details. In a production app, pass the full
  // objects via GoRouter 'extra' or fetch them from a backend.
  static final List<Map<String, dynamic>> _allAcademies = [
    {
      'name': 'WICKET HUB',
      'sport': 'Cricket',
      'icon': '🏏',
      'accentColor': AppColors.green,
      'rating': '4.8',
      'distance': '1.2 km',
      'price': '₹1500/mo',
      'features': ['Pro Turf', 'Nets', 'Coaching'],
      'badges': ['AI Match', 'Top Rated'],
    },
    {
      'name': 'Unstoppable Sports Academy',
      'sport': 'Cricket',
      'icon': '🏏',
      'accentColor': AppColors.green,
      'rating': '4.9',
      'distance': '2.5 km',
      'price': '₹2000/mo',
      'features': ['Bowling Machine', 'Match Practice', 'Cafe'],
      'badges': ['Verified', 'Kids Friendly'],
    },
    {
      'name': 'SUV’s Sports Arena',
      'sport': 'Badminton',
      'icon': '🏸',
      'accentColor': AppColors.amber,
      'rating': '4.7',
      'distance': '3.0 km',
      'price': '₹1200/mo',
      'features': ['Wooden Floor', 'A/C', 'Pro Coaching'],
      'badges': ['Verified'],
    },
    {
      'name': 'Prime Sports Arena',
      'sport': 'Football',
      'icon': '⚽',
      'accentColor': AppColors.blue,
      'rating': '4.8',
      'distance': '4.1 km',
      'price': '₹1800/mo',
      'features': ['Night Matches', 'Turf', 'Tournaments'],
      'badges': ['AI Match', 'Verified'],
    },
    {
      'name': 'LEE MARTIAL ARTS',
      'sport': 'Martial Arts',
      'icon': '🥋',
      'accentColor': Colors.redAccent,
      'rating': '4.9',
      'distance': '1.5 km',
      'price': '₹1000/mo',
      'features': ['Self Defense', 'Yoga', 'Pro Coaches'],
      'badges': ['Top Rated'],
    },
    {
      'name': 'AGYM Fitness',
      'sport': 'Fitness',
      'icon': '💪',
      'accentColor': Colors.purpleAccent,
      'rating': '4.6',
      'distance': '0.8 km',
      'price': '₹1500/mo',
      'features': ['Cardio', 'Weights', 'Personal Trainer'],
      'badges': ['Popular'],
    },
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;

    // Get the academies matching what was passed in
    final academies = _allAcademies
        .where((a) => selectedAcademyNames.contains(a['name']))
        .toList();

    if (academies.isEmpty) {
      return Scaffold(
        backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: const BackButton(),
          title: const Text('Compare Academies'),
        ),
        body: Center(
          child: Text(
            'No academies selected.',
            style: TextStyle(
              color: isDark ? AppColors.textPrimary : Colors.black87,
            ),
          ),
        ),
      );
    }

    // Simulate AI decision logic by picking the highest-rated academy as the "Best Fit"
    academies.sort((a, b) =>
        double.parse(b['rating']).compareTo(double.parse(a['rating'])));
    final bestFit = academies.first;

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new,
            color: isDark ? AppColors.textPrimary : Colors.black87,
            size: 20,
          ),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Compare & Suggest',
          style: GoogleFonts.barlowCondensed(
            color: isDark ? AppColors.textPrimary : Colors.black87,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Highly prominent AI Suggestion Banner
            _buildAIBanner(bestFit, isDark),
            const SizedBox(height: 32),

            Text(
              'FEATURE COMPARISON',
              style: TextStyle(
                color: isDark ? AppColors.textSecondary : Colors.black54,
                fontSize: 14,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ).animate().fadeIn(delay: 200.ms),
            const SizedBox(height: 16),

            // Side-by-side Comparison List
            SizedBox(
              height: 480,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: academies.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 16.0),
                    // Pass true to highlight the AI best fit card
                    child: _buildCompareCard(
                      academies[index],
                      isDark,
                      academies[index] == bestFit,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAIBanner(Map<String, dynamic> bestFit, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.green.withValues(alpha: isDark ? 0.15 : 0.1),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: AppColors.green.withValues(alpha: 0.5),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.green.withValues(alpha: 0.15),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppColors.green,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.auto_awesome,
                    color: Colors.black87, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                'AI Top Pick For You',
                style: GoogleFonts.barlowCondensed(
                  color: AppColors.green,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          RichText(
            text: TextSpan(
              style: TextStyle(
                color: isDark ? AppColors.textPrimary : Colors.black87,
                fontSize: 16,
                height: 1.5,
              ),
              children: [
                const TextSpan(
                    text:
                        'Based on your goals and location, we highly recommend '),
                TextSpan(
                  text: '${bestFit['name']}',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, color: AppColors.green),
                ),
                TextSpan(
                  text:
                      '. It offers the best balance of price (${bestFit['price']}) and top-tier features like ${(bestFit['features'] as List).join(", ")}.',
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {}, // TODO: Implement direct booking/contacting
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.green,
                foregroundColor: Colors.black87,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Book Trial Session',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.1).shimmer(
          duration: 3.seconds,
          color: Colors.white.withValues(alpha: 0.2),
        );
  }

  Widget _buildCompareCard(
      Map<String, dynamic> academy, bool isDark, bool isBest) {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isBest
              ? AppColors.green
              : (isDark ? Colors.white12 : Colors.black12),
          width: isBest ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: (academy['accentColor'] as Color).withValues(alpha: 0.1),
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(academy['icon'], style: const TextStyle(fontSize: 32)),
                    if (isBest)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.green,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'WINNER',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  academy['name'],
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          // Details section
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatRow('Rating', '${academy['rating']} ⭐️', isDark),
                  const Divider(height: 24),
                  _buildStatRow('Distance', academy['distance'], isDark),
                  const Divider(height: 24),
                  _buildStatRow('Monthly Fee', academy['price'], isDark),
                  const Divider(height: 24),
                  Text(
                    'Key Features',
                    style: TextStyle(
                      color: isDark ? AppColors.textSecondary : Colors.black54,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...((academy['features'] as List).map(
                    (f) => Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle,
                              color: AppColors.green, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              f.toString(),
                              style: TextStyle(
                                color: isDark
                                    ? AppColors.textPrimary
                                    : Colors.black87,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )),
                ],
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.1);
  }

  Widget _buildStatRow(String label, String value, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: isDark ? AppColors.textSecondary : Colors.black54,
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: isDark ? AppColors.textPrimary : Colors.black87,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
