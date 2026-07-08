import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'compare_provider.dart';

class ComparisonScreen extends ConsumerWidget {
  const ComparisonScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final selectedIds = ref.watch(compareProvider);
    final allAcademies = ref.watch(academiesProvider).value ?? [];
    
    final selectedAcademies = allAcademies.where((a) => selectedIds.contains(a.id)).toList();

    if (selectedAcademies.isEmpty) {
      return Scaffold(
        backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back_ios_new, color: isDark ? Colors.white : Colors.black87),
            onPressed: () => context.pop(),
          ),
          title: Text('Compare', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
        ),
        body: Center(
          child: Text('No academies selected for comparison.', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54)),
        ),
      );
    }

    // Find the best academy
    Academy? bestAcademy;
    int maxRank = -1;
    for (var academy in selectedAcademies) {
      if (academy.rankingScore > maxRank) {
        maxRank = academy.rankingScore;
        bestAcademy = academy;
      }
    }

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: isDark ? Colors.white : Colors.black87),
          onPressed: () {
            ref.read(compareProvider.notifier).clearSelection();
            context.pop();
          },
        ),
        title: Text('Compare Academies', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
        actions: [
          TextButton(
            onPressed: () {
              ref.read(compareProvider.notifier).clearSelection();
              context.pop();
            },
            child: const Text('Clear', style: TextStyle(color: AppColors.green)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: selectedAcademies.map((academy) {
            final isBest = academy.id == bestAcademy?.id;
            return Container(
              width: 280,
              margin: const EdgeInsets.only(right: 16),
              decoration: BoxDecoration(
                color: isDark ? AppColors.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isBest ? AppColors.amber : (isDark ? Colors.white12 : Colors.black12),
                  width: isBest ? 2 : 1,
                ),
                boxShadow: isBest ? [
                  BoxShadow(
                    color: AppColors.amber.withValues(alpha: 0.2),
                    blurRadius: 10,
                    spreadRadius: 2,
                  )
                ] : [],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (isBest)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: const BoxDecoration(
                        color: AppColors.amber,
                        borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                      ),
                      child: const Center(
                        child: Text(
                          '★ BEST CHOICE',
                          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
                        ),
                      ),
                    ),
                  ClipRRect(
                    borderRadius: BorderRadius.vertical(top: isBest ? Radius.zero : const Radius.circular(15)),
                    child: Image.network(
                      academy.images.isNotEmpty ? academy.images.first : 'https://via.placeholder.com/400x200',
                      height: 120,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          academy.name,
                          style: TextStyle(
                            color: isDark ? Colors.white : Colors.black87,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 16),
                        _buildRow('Rating', '${academy.rating} (${academy.reviewsCount})', Icons.star, AppColors.amber, isDark),
                        _buildRow('Price', academy.price, Icons.attach_money, AppColors.green, isDark),
                        _buildRow('Distance', academy.distance, Icons.location_on, AppColors.blue, isDark),
                        _buildRow('Rank Score', '${academy.rankingScore}/100', Icons.whatshot, Colors.orange, isDark),
                        const SizedBox(height: 16),
                        _buildListSection('Facilities', academy.facilities, isDark),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, IconData icon, Color iconColor, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 12),
            ),
          ),
          Text(
            value,
            style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildListSection(String title, List<String> items, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: items.map((item) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isDark ? AppColors.inkDark : Colors.grey[100],
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                item,
                style: TextStyle(color: isDark ? Colors.white70 : Colors.black87, fontSize: 10),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
