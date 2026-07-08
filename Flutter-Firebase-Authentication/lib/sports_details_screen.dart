import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'theme.dart';
import 'colors.dart';
import 'sports_provider.dart';
import 'academy_provider.dart';
import 'academy_card.dart';
import 'compare_provider.dart';

class SportsDetailsScreen extends ConsumerWidget {
  final String sportId;

  const SportsDetailsScreen({super.key, required this.sportId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    
    // Find the sport by ID
    final sport = ref.watch(sportsProvider).firstWhere(
          (s) => s.id == sportId,
          orElse: () => throw Exception('Sport not found'),
        );
        
    // Filter academies by this sport
    final relatedAcademies = (ref.watch(academiesProvider).value ?? []).where((a) => a.sport.toLowerCase() == sport.name.toLowerCase()).toList();
    
    final selectedAcademies = ref.watch(compareProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      floatingActionButton: selectedAcademies.length >= 2
          ? FloatingActionButton.extended(
              onPressed: () {
                context.push('/compare');
              },
              backgroundColor: AppColors.green,
              icon: const Icon(Icons.compare_arrows, color: Colors.white),
              label: Text('Compare (${selectedAcademies.length})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ).animate().scale(delay: 100.ms, duration: 300.ms)
          : null,
      body: CustomScrollView(
        slivers: [
          // 1. Hero Header
          SliverAppBar(
            expandedHeight: 350.0,
            pinned: true,
            stretch: true,
            backgroundColor: Colors.transparent,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
              ),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [StretchMode.zoomBackground],
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    sport.heroImage,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          isDark ? AppColors.inkDark : AppColors.inkLight,
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 24,
                    left: 24,
                    right: 24,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.green.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.green.withValues(alpha: 0.5)),
                          ),
                          child: const Text(
                            'SPORT GUIDE',
                            style: TextStyle(
                              color: AppColors.green,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.5),
                        const SizedBox(height: 8),
                        Text(
                          sport.name.toUpperCase(),
                          style: GoogleFonts.barlowCondensed(
                            color: isDark ? Colors.white : Colors.black87,
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            height: 1.0,
                          ),
                        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.5),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 5. Related Academies
          if (relatedAcademies.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 40, 24, 16),
                child: Text(
                  'Top ${sport.name} Academies',
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ).animate().fadeIn(delay: 700.ms),
              ),
            ),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 400, // Increased to 400 to fix bottom overflow for wrapping text like "Martial Arts"
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: relatedAcademies.length,
                  itemBuilder: (context, index) {
                    final academy = relatedAcademies[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 16.0),
                      child: SizedBox(
                        width: 280,
                        child: AcademyCard(
                          academy: academy,
                          isSelected: false,
                          delayMs: 700 + (index * 100),
                          onSelect: () => context.push('/academy_details/${academy.id}'),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 16)),
          ],

          // 2. Overview
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Overview',
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    sport.description,
                    style: TextStyle(
                      color: isDark ? AppColors.textSecondary : Colors.black54,
                      fontSize: 16,
                      height: 1.6,
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 400.ms),
            ),
          ),

          // 3. Physical Benefits
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.fitness_center, color: AppColors.green),
                      const SizedBox(width: 8),
                      Text(
                        'Physical Benefits',
                        style: TextStyle(
                          color: isDark ? AppColors.textPrimary : Colors.black87,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...sport.physicalBenefits.map((benefit) => _buildBenefitRow(benefit, isDark)).toList(),
                ],
              ).animate().fadeIn(delay: 500.ms),
            ),
          ),

          // 4. Mental Benefits
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      const Icon(Icons.psychology, color: AppColors.blue),
                      const SizedBox(width: 8),
                      Text(
                        'Mental Benefits',
                        style: TextStyle(
                          color: isDark ? AppColors.textPrimary : Colors.black87,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...sport.mentalBenefits.map((benefit) => _buildBenefitRow(benefit, isDark)).toList(),
                ],
              ).animate().fadeIn(delay: 600.ms),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),


        ],
      ),
    );
  }

  Widget _buildBenefitRow(Benefit benefit, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 4),
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: AppColors.green,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  benefit.title,
                  style: TextStyle(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  benefit.description,
                  style: TextStyle(
                    color: isDark ? AppColors.textSecondary : Colors.black54,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
