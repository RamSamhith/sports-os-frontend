import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'colors.dart';
import 'theme.dart';
import 'auth_provider.dart';

class CoachDashboardScreen extends ConsumerStatefulWidget {
  const CoachDashboardScreen({super.key});

  @override
  ConsumerState<CoachDashboardScreen> createState() => _CoachDashboardScreenState();
}

class _CoachDashboardScreenState extends ConsumerState<CoachDashboardScreen> {
  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final authState = ref.watch(authStateProvider);
    final user = authState.value;

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.agBackground,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Immersive Header & Floating Stats
            Stack(
              clipBehavior: Clip.none,
              children: [
                // Background Gradient
                Container(
                  height: 300,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: isDark 
                        ? const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [Color(0xFF0A192F), Color(0xFF020C1B)],
                          ) 
                        : AppColors.lightGradient,
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(40),
                      bottomRight: Radius.circular(40),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isDark ? Colors.black.withValues(alpha: 0.5) : AppColors.agShadow,
                        blurRadius: 24,
                        offset: const Offset(0, 12),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    bottom: false,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              IconButton(
                                onPressed: () {},
                                icon: Icon(
                                  Icons.notifications_outlined,
                                  color: isDark ? Colors.white : AppColors.agTextNeutral,
                                ),
                                style: IconButton.styleFrom(
                                  backgroundColor: isDark ? Colors.white.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.05),
                                ),
                              ),
                              IconButton(
                                onPressed: () {
                                  ref.read(authStateProvider.notifier).signOut();
                                  context.go('/welcome');
                                },
                                icon: const Icon(Icons.logout, color: Colors.redAccent),
                                style: IconButton.styleFrom(
                                  backgroundColor: isDark ? Colors.white.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.05),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              Hero(
                                tag: 'coach_avatar',
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isDark ? AppColors.amber : AppColors.agPrimary,
                                      width: 3,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: (isDark ? AppColors.amber : AppColors.agPrimary).withValues(alpha: 0.3),
                                        blurRadius: 12,
                                        spreadRadius: 2,
                                      )
                                    ],
                                  ),
                                  child: CircleAvatar(
                                    radius: 38,
                                    backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                                    backgroundImage: user?.photoURL != null ? NetworkImage(user!.photoURL!) : null,
                                    child: user?.photoURL == null
                                        ? Text(
                                            user?.displayName?.substring(0, 1).toUpperCase() ?? 'C',
                                            style: TextStyle(
                                              color: isDark ? Colors.white : AppColors.agPrimary,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 28,
                                            ),
                                          )
                                        : null,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      user?.displayName ?? 'Coach Profile',
                                      style: TextStyle(
                                        color: isDark ? Colors.white : AppColors.agTextNeutral,
                                        fontSize: 26,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -0.5,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),
                                    // Specific Sports Tag
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: isDark ? AppColors.amber.withValues(alpha: 0.15) : AppColors.agPrimary.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(
                                          color: isDark ? AppColors.amber.withValues(alpha: 0.3) : AppColors.agPrimary.withValues(alpha: 0.3),
                                        ),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.sports_tennis_rounded,
                                            size: 14,
                                            color: isDark ? AppColors.amber : AppColors.agPrimary,
                                          ),
                                          const SizedBox(width: 6),
                                          Text(
                                            'Professional Tennis Coach',
                                            style: TextStyle(
                                              color: isDark ? AppColors.amber : AppColors.agPrimary,
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                
                // Floating Enquiries Card
                Positioned(
                  bottom: -45,
                  left: 24,
                  right: 24,
                  child: _buildEnquiriesCard(isDark).animate().fade(delay: 200.ms).slideY(begin: 0.3, duration: 500.ms, curve: Curves.easeOutBack),
                ),
              ],
            ),
            
            const SizedBox(height: 70), // Spacing for floating card
            
            // Coach Achievements Section
            Padding(
              padding: const EdgeInsets.only(left: 24.0),
              child: _buildSectionHeader('Coach Achievements', isDark).animate().fade(delay: 300.ms),
            ),
            const SizedBox(height: 16),
            _buildAchievementsList(isDark).animate().fade(delay: 400.ms).slideX(begin: 0.1),
            
            const SizedBox(height: 32),
            
            // Academy Reviews Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildSectionHeader('Academy Reviews', isDark),
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: Colors.amber, size: 20),
                          const SizedBox(width: 4),
                          Text(
                            '4.9',
                            style: TextStyle(
                              color: isDark ? Colors.white : AppColors.agTextNeutral,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      )
                    ],
                  ).animate().fade(delay: 500.ms),
                  const SizedBox(height: 16),
                  _buildReviewsSummaryBox(context, isDark).animate().fade(delay: 600.ms).slideY(begin: 0.2),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Text(
      title,
      style: TextStyle(
        color: isDark ? Colors.white : AppColors.agTextNeutral,
        fontSize: 20,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.5,
      ),
    );
  }

  Widget _buildEnquiriesCard(bool isDark) {
    return Container(
      decoration: AntiGravityStyle.floatingCard(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: 24,
      ),
      padding: const EdgeInsets.all(24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Student Enquiries',
                style: TextStyle(
                  color: isDark ? Colors.white70 : AppColors.agTextMuted,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '128',
                    style: TextStyle(
                      color: isDark ? Colors.white : AppColors.agTextNeutral,
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      height: 1.0,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    margin: const EdgeInsets.only(bottom: 4),
                    decoration: BoxDecoration(
                      color: AppColors.green.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.trending_up_rounded, color: AppColors.green, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          '12% this week',
                          style: TextStyle(
                            color: AppColors.green,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            height: 60,
            width: 60,
            decoration: BoxDecoration(
              color: isDark ? AppColors.blue.withValues(alpha: 0.1) : AppColors.agPrimary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.mail_rounded,
              color: isDark ? AppColors.blue : AppColors.agPrimary,
              size: 28,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAchievementsList(bool isDark) {
    final achievements = [
      {'icon': Icons.workspace_premium_rounded, 'title': 'Certified Pro', 'subtitle': 'USPTA Elite Professional'},
      {'icon': Icons.emoji_events_rounded, 'title': 'State Champion', 'subtitle': '2019 National Division'},
      {'icon': Icons.history_edu_rounded, 'title': '10+ Years Exp', 'subtitle': 'Coaching since 2012'},
    ];

    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        itemCount: achievements.length,
        itemBuilder: (context, index) {
          final achievement = achievements[index];
          return Container(
            width: 160,
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(16),
            decoration: AntiGravityStyle.floatingCard(
              color: isDark ? AppColors.card2Dark : Colors.white,
              borderRadius: 20,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  achievement['icon'] as IconData,
                  color: isDark ? AppColors.amber : AppColors.agPrimary,
                  size: 28,
                ),
                const SizedBox(height: 12),
                Text(
                  achievement['title'] as String,
                  style: TextStyle(
                    color: isDark ? Colors.white : AppColors.agTextNeutral,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  achievement['subtitle'] as String,
                  style: TextStyle(
                    color: isDark ? Colors.white60 : AppColors.agTextMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildReviewsSummaryBox(BuildContext context, bool isDark) {
    return Container(
      decoration: AntiGravityStyle.floatingCard(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: 24,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(24),
        child: InkWell(
          onTap: () {
            _showAllReviewsBottomSheet(context, isDark);
          },
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.amber.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.star_rounded, color: Colors.amber, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '4.9 Overall Rating',
                        style: TextStyle(
                          color: isDark ? Colors.white : AppColors.agTextNeutral,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Based on 128 student reviews',
                        style: TextStyle(
                          color: isDark ? Colors.white70 : AppColors.agTextMuted,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: isDark ? Colors.white54 : AppColors.agTextMuted,
                  size: 16,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showAllReviewsBottomSheet(BuildContext context, bool isDark) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        final List<Map<String, dynamic>> reviews = [
          {
            'name': 'Michael T.',
            'rating': 5,
            'date': '2 days ago',
            'text': "The best tennis academy in the city! The coaches are incredibly attentive and my son's backhand has improved dramatically in just a month.",
          },
          {
            'name': 'Sarah L.',
            'rating': 5,
            'date': '1 week ago',
            'text': 'Professional environment, great courts, and the feedback provided after sessions is always spot on. Highly recommended.',
          },
          {
            'name': 'David W.',
            'rating': 4,
            'date': '3 weeks ago',
            'text': 'Very structured training programs. The facilities are top-notch.',
          },
          {
            'name': 'Emma R.',
            'rating': 5,
            'date': '1 month ago',
            'text': 'Great coaching staff! They really care about the kids.',
          },
        ];

        return Container(
          height: MediaQuery.of(context).size.height * 0.7,
          decoration: BoxDecoration(
            color: isDark ? AppColors.inkDark : AppColors.agBackground,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : Colors.black12,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'All Reviews',
                style: TextStyle(
                  color: isDark ? Colors.white : AppColors.agTextNeutral,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  itemCount: reviews.length,
                  itemBuilder: (context, index) {
                    final review = reviews[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Container(
                        decoration: AntiGravityStyle.floatingCard(
                          color: isDark ? AppColors.cardDark : Colors.white,
                          borderRadius: 20,
                        ),
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  review['name'] as String,
                                  style: TextStyle(
                                    color: isDark ? Colors.white : AppColors.agTextNeutral,
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  review['date'] as String,
                                  style: TextStyle(
                                    color: isDark ? Colors.white54 : AppColors.agTextMuted,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: List.generate(5, (starIndex) {
                                return Icon(
                                  starIndex < (review['rating'] as int) ? Icons.star_rounded : Icons.star_border_rounded,
                                  color: Colors.amber,
                                  size: 16,
                                );
                              }),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              review['text'] as String,
                              style: TextStyle(
                                color: isDark ? Colors.white70 : AppColors.agTextMuted,
                                fontSize: 13,
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
