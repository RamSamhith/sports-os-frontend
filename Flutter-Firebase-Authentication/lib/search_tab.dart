import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'academy_card.dart';
import 'recent_searches_provider.dart';

class SearchTab extends ConsumerStatefulWidget {
  final bool isDark;

  const SearchTab({super.key, required this.isDark});

  @override
  ConsumerState<SearchTab> createState() => _SearchTabState();
}

class _SearchTabState extends ConsumerState<SearchTab> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedFilter = 'All';
  bool _isLoading = false;

  final List<String> _filters = ['All', 'Academies', 'Sports', 'Cities'];

  final List<String> _trendingSearches = [
    'Cricket Academies',
    'Yoga Classes',
    'Martial Arts',
    'Football in Bangalore',
    'Swimming for Kids',
  ];

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    final query = _searchController.text;
    if (query != _searchQuery) {
      setState(() {
        _searchQuery = query;
        _isLoading = true;
      });
      
      // Simulate network request/processing delay for dynamic feel
      Future.delayed(const Duration(milliseconds: 300), () {
        if (mounted && _searchController.text == query) {
          setState(() {
            _isLoading = false;
          });
        }
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _performSearch(String query) {
    if (query.trim().isEmpty) return;
    _searchController.text = query;
    _searchController.selection = TextSelection.fromPosition(TextPosition(offset: query.length));
    ref.read(recentSearchesProvider.notifier).addSearch(query);
  }

  List<Academy> _getFilteredResults(List<Academy> allAcademies) {
    if (_searchQuery.trim().isEmpty) return [];

    final query = _searchQuery.toLowerCase().trim();
    return allAcademies.where((academy) {
      bool matches = false;

      if (_selectedFilter == 'All') {
        matches = academy.name.toLowerCase().contains(query) ||
                  academy.sport.toLowerCase().contains(query) ||
                  academy.city.toLowerCase().contains(query);
      } else if (_selectedFilter == 'Academies') {
        matches = academy.name.toLowerCase().contains(query);
      } else if (_selectedFilter == 'Sports') {
        matches = academy.sport.toLowerCase().contains(query);
      } else if (_selectedFilter == 'Cities') {
        matches = academy.city.toLowerCase().contains(query);
      }

      return matches;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final recentSearches = ref.watch(recentSearchesProvider);
    final allAcademies = ref.watch(academiesProvider).value ?? [];
    final results = _getFilteredResults(allAcademies);

    return SafeArea(
      child: Column(
        children: [
          // Search Bar & Filters
          Container(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Input
                Container(
                  height: 56,
                  decoration: BoxDecoration(
                    color: widget.isDark ? AppColors.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: widget.isDark ? Colors.white12 : Colors.black12,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      Icon(Icons.search, color: widget.isDark ? Colors.white54 : Colors.black54),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          style: TextStyle(color: widget.isDark ? Colors.white : Colors.black87),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Search academies, sports, cities...',
                            hintStyle: TextStyle(
                              color: widget.isDark ? Colors.white38 : Colors.black38,
                            ),
                          ),
                          onSubmitted: _performSearch,
                        ),
                      ),
                      if (_searchQuery.isNotEmpty)
                        GestureDetector(
                          onTap: () {
                            _searchController.clear();
                            FocusScope.of(context).unfocus();
                          },
                          child: Icon(Icons.close, color: widget.isDark ? Colors.white54 : Colors.black54),
                        ),
                    ],
                  ),
                ),
                
                // Filter Tabs (only show when typing)
                if (_searchQuery.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _filters.map((filter) {
                        final isSelected = _selectedFilter == filter;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedFilter = filter;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                color: isSelected 
                                    ? AppColors.agPrimary 
                                    : (widget.isDark ? AppColors.inkDark : Colors.white),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected 
                                      ? AppColors.agPrimary 
                                      : (widget.isDark ? Colors.white12 : Colors.black12),
                                ),
                              ),
                              child: Text(
                                filter,
                                style: TextStyle(
                                  color: isSelected ? Colors.white : (widget.isDark ? Colors.white70 : Colors.black87),
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Main Content Area
          Expanded(
            child: _searchQuery.isEmpty
                ? _buildPreSearchState(recentSearches)
                : _buildResultsState(results),
          ),
        ],
      ),
    );
  }

  Widget _buildPreSearchState(List<String> recentSearches) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      children: [
        if (recentSearches.isNotEmpty) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Searches',
                style: GoogleFonts.barlowCondensed(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: widget.isDark ? AppColors.textPrimary : Colors.black87,
                ),
              ),
              TextButton(
                onPressed: () {
                  ref.read(recentSearchesProvider.notifier).clearSearches();
                },
                child: const Text('Clear All', style: TextStyle(color: AppColors.agPrimary)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: recentSearches.map<Widget>((query) {
              return InputChip(
                label: Text(query),
                onPressed: () => _performSearch(query),
                onDeleted: () {
                  ref.read(recentSearchesProvider.notifier).removeSearch(query);
                },
                backgroundColor: widget.isDark ? AppColors.cardDark : AppColors.inkLight,
                labelStyle: TextStyle(color: widget.isDark ? Colors.white70 : Colors.black87),
                deleteIconColor: widget.isDark ? Colors.white38 : Colors.black38,
                side: BorderSide(color: widget.isDark ? Colors.white12 : Colors.black12),
              );
            }).toList(),
          ),
          const SizedBox(height: 32),
        ],

        Text(
          'Trending Searches',
          style: GoogleFonts.barlowCondensed(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: widget.isDark ? AppColors.textPrimary : Colors.black87,
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _trendingSearches.map<Widget>((query) {
            return ActionChip(
              avatar: const Icon(Icons.trending_up, size: 16, color: AppColors.green),
              label: Text(query),
              onPressed: () => _performSearch(query),
              backgroundColor: widget.isDark ? AppColors.cardDark : AppColors.inkLight,
              labelStyle: TextStyle(color: widget.isDark ? Colors.white70 : Colors.black87),
              side: BorderSide(color: widget.isDark ? Colors.white12 : Colors.black12),
            );
          }).toList(),
        ),
      ],
    ).animate().fadeIn();
  }

  Widget _buildResultsState(List<Academy> results) {
    if (_isLoading) {
      return Center(
        child: const CircularProgressIndicator(color: AppColors.agPrimary)
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .shimmer(),
      );
    }

    if (results.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 80, color: widget.isDark ? Colors.white24 : Colors.black.withValues(alpha: 0.24)),
            const SizedBox(height: 16),
            Text(
              'No results found',
              style: GoogleFonts.barlowCondensed(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: widget.isDark ? AppColors.textPrimary : Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "We couldn't find anything matching '$_searchQuery'.\nTry a different sport, academy, or city.",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: widget.isDark ? AppColors.textSecondary : Colors.black54,
              ),
            ),
          ],
        ).animate().fadeIn().scale(),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 100), // padding bottom for sticky nav
      itemCount: results.length,
      itemBuilder: (context, index) {
        final academy = results[index];
        return AcademyCard(
          academy: academy,
          isSelected: false,
          onSelect: () {
            ref.read(recentSearchesProvider.notifier).addSearch(_searchQuery);
            context.push('/academy_details/${academy.id}');
          },
          delayMs: 100 * index,
        );
      },
    );
  }
}
