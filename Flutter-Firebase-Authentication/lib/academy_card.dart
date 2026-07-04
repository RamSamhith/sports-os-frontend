import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'compare_provider.dart';
import 'shortlist_provider.dart';

class AcademyCard extends ConsumerWidget {
  final Academy academy;
  final bool isSelected;
  final VoidCallback onSelect;
  final int delayMs;
  final String? calculatedDistance;

  const AcademyCard({
    super.key,
    required this.academy,
    required this.isSelected,
    required this.onSelect,
    this.delayMs = 0,
    this.calculatedDistance,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final selectedAcademies = ref.watch(compareProvider);
    final isCompared = selectedAcademies.contains(academy.id);
    final shortlistState = ref.watch(shortlistProvider);
    final isShortlisted = shortlistState.academyIds.contains(academy.id);
    
    // Determine the accent color based on sport
    Color getAccentColor() {
      switch (academy.sport) {
        case 'Cricket': return AppColors.green;
        case 'Football': return AppColors.blue;
        case 'Badminton': return AppColors.amber;
        case 'Fitness': return Colors.purpleAccent;
        default: return AppColors.agPrimary;
      }
    }
    
    final accentColor = getAccentColor();

    return GestureDetector(
      onTap: onSelect,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        decoration: isDark
            ? BoxDecoration(
                color: AppColors.cardDark.withValues(
                  alpha: isSelected ? 0.9 : 0.7,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isSelected ? AppColors.green : Colors.white12,
                  width: isSelected ? 2 : 1,
                ),
              )
            : AntiGravityStyle.floatingCard(
                borderRadius: 24.0,
                color: AppColors.agSurface.withValues(
                  alpha: isSelected ? 0.95 : 0.85,
                ),
              ).copyWith(
                border: Border.all(
                  color: isSelected
                      ? AppColors.agPrimary
                      : AppColors.agTextNeutral.withValues(alpha: 0.05),
                  width: isSelected ? 2 : 1,
                ),
              ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Header
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  child: Image.network(
                    academy.images.isNotEmpty ? academy.images.first : 'https://via.placeholder.com/400x200',
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 180,
                      color: isDark ? Colors.black26 : Colors.grey[200],
                      child: const Center(child: Icon(Icons.image_not_supported, size: 40, color: Colors.grey)),
                    ),
                  ),
                ),
                // Ranking Badge
                Positioned(
                  top: 16,
                  left: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white24),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.whatshot, color: Colors.orange, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          'Rank ${academy.rankingScore}',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
                // Compare and Save/Favorite Buttons
                Positioned(
                  top: 16,
                  right: 16,
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          ref.read(compareProvider.notifier).toggleSelection(academy.id);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: isCompared ? AppColors.green : Colors.black.withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isCompared ? AppColors.green : Colors.white24,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isCompared ? Icons.check : Icons.compare_arrows,
                                color: Colors.white,
                                size: 16,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                isCompared ? 'Added' : 'Compare',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          ref.read(shortlistProvider.notifier).toggleAcademy(academy.id);
                        },
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isShortlisted ? AppColors.agPrimary : Colors.black.withValues(alpha: 0.5),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isShortlisted ? Icons.bookmark : Icons.bookmark_border, 
                            color: Colors.white, 
                            size: 20
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Content Area
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title Row
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          academy.name,
                          style: TextStyle(
                            color: isDark ? AppColors.textPrimary : Colors.black87,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      if (academy.isVerified)
                        const Icon(Icons.verified, color: AppColors.green, size: 20),
                    ],
                  ),
                  const SizedBox(height: 6),
                  
                  // Location & Sport
                  Row(
                    children: [
                      Icon(Icons.location_on, size: 14, color: accentColor),
                      const SizedBox(width: 4),
                      Text(
                        '${academy.city} • ${calculatedDistance ?? academy.distance}',
                        style: TextStyle(
                          color: isDark ? AppColors.textSecondary : Colors.black54,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: accentColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          academy.sport,
                          style: TextStyle(color: accentColor, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),

                  // Metrics Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildMetric(Icons.star, AppColors.amber, '${academy.rating}', '${academy.reviewsCount} Reviews', isDark),
                      _buildMetric(Icons.bookmark, AppColors.agPrimary, '${academy.saveCount}', 'Saves', isDark),
                      Text(
                        academy.price,
                        style: TextStyle(
                          color: isDark ? AppColors.textPrimary : Colors.black87,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: delayMs.ms).slideY(begin: 0.1);
  }

  Widget _buildMetric(IconData icon, Color iconColor, String value, String label, bool isDark) {
    return Row(
      children: [
        Icon(icon, color: iconColor, size: 16),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: TextStyle(
                color: isDark ? Colors.white : Colors.black87,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: isDark ? Colors.white54 : Colors.black54,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
