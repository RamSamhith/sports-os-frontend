import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'academy_card.dart';
import 'academy_skeleton_loader.dart';

class AcademiesSearchScreen extends ConsumerStatefulWidget {
  const AcademiesSearchScreen({super.key});

  @override
  ConsumerState<AcademiesSearchScreen> createState() => _AcademiesSearchScreenState();
}

class _AcademiesSearchScreenState extends ConsumerState<AcademiesSearchScreen> {
  final ScrollController _scrollController = ScrollController();
  final Set<String> _selectedSports = {'All'};
  final List<String> _sports = ['All', 'Cricket', 'Football', 'Badminton', 'Fitness'];
  
  bool _isLoadingMore = false;
  int _displayCount = 2; // Initially show 2 to trigger scroll easily

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoadingMore) {
        _loadMore();
      }
    }
  }

  Future<void> _loadMore() async {
    setState(() {
      _isLoadingMore = true;
    });

    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _displayCount += 2; // Load 2 more academies
        _isLoadingMore = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final allAcademies = ref.watch(academiesProvider).value ?? [];

    // Filter logic
    final filteredAcademies = allAcademies.where((academy) {
      if (_selectedSports.contains('All')) return true;
      return _selectedSports.contains(academy.sport);
    }).toList();

    // Enforce display count
    final academiesToShow = filteredAcademies.take(_displayCount).toList();

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: isDark ? Colors.white : Colors.black),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Find Academies',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.map, color: AppColors.green),
            onPressed: () {
              // Toggle map view (future feature)
            },
          )
        ],
      ),
      body: Column(
        children: [
          // Filters
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _sports.length,
              itemBuilder: (context, index) {
                final sport = _sports[index];
                final isSelected = _selectedSports.contains(sport);
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    selected: isSelected,
                    label: Text(sport),
                    onSelected: (selected) {
                      setState(() {
                        if (sport == 'All') {
                          _selectedSports.clear();
                          _selectedSports.add('All');
                        } else {
                          _selectedSports.remove('All');
                          if (selected) {
                            _selectedSports.add(sport);
                          } else {
                            _selectedSports.remove(sport);
                            if (_selectedSports.isEmpty) {
                              _selectedSports.add('All');
                            }
                          }
                        }
                        _displayCount = 2; // Reset on filter change
                      });
                    },
                    backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                    selectedColor: AppColors.green.withValues(alpha: 0.2),
                    checkmarkColor: AppColors.green,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.green : (isDark ? Colors.white70 : Colors.black87),
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? AppColors.green : (isDark ? Colors.white12 : Colors.black12),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Results Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Row(
              children: [
                Text(
                  '${filteredAcademies.length} Academies Found',
                  style: TextStyle(
                    color: isDark ? Colors.white54 : Colors.black54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          // List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(24),
              itemCount: academiesToShow.length + (_isLoadingMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == academiesToShow.length) {
                  return const AcademySkeletonLoader();
                }

                final academy = academiesToShow[index];
                return AcademyCard(
                  academy: academy,
                  isSelected: false,
                  delayMs: index * 100,
                  onSelect: () {
                    context.push('/academy_details/${academy.id}');
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
