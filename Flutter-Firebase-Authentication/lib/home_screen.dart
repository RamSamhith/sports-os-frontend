import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_service.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'colors.dart';
import 'theme.dart';
import 'auth_provider.dart';
import 'academy_provider.dart';
import 'academy_card.dart';
import 'sports_provider.dart';
import 'sport_card.dart';
import 'shortlist_provider.dart';
import 'recently_viewed_provider.dart';
import 'compare_provider.dart';
import 'search_tab.dart';
import 'utils.dart';
import 'widgets/premium_filter_chip.dart';
import 'location_provider.dart';
import 'package:geolocator/geolocator.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _selectedIndex = 0;
  final Set<String> _selectedSports = {'All'};
  // _selectedAcademies removed in favor of compareProvider
  String _selectedCity = 'All';
  double _minRating = 0.0;
  String _selectedGender = 'Any';
  String _selectedAgeGroup = 'All';
  final Set<String> _selectedFacilities = {};
  bool _isLoading = true;
  bool _showAllSports = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      final bytes = await image.readAsBytes();
      final base64String = 'data:image/jpeg;base64,' + base64Encode(bytes);
      ref.read(authStateProvider.notifier).updateProfilePhoto(base64String);
    }
  }

  // _sports list has been removed in favor of dynamic generation based on allSports

  void _showSessionsDialog(BuildContext context, bool isDark) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
          title: Text('Active Sessions', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(Icons.phone_android, color: isDark ? Colors.white70 : Colors.black87),
                title: Text('iPhone 13 Pro', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
                subtitle: Text('Current Device • Bengaluru', style: TextStyle(color: AppColors.green, fontSize: 12)),
              ),
              ListTile(
                leading: Icon(Icons.laptop, color: isDark ? Colors.white70 : Colors.black87),
                title: Text('MacBook Air', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
                subtitle: Text('Last active 2 hours ago • Chennai', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 12)),
                trailing: IconButton(
                  icon: const Icon(Icons.logout, color: Colors.red),
                  onPressed: () {
                    // Handle single device logout
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Logged out from MacBook Air', style: TextStyle(color: Colors.white)), backgroundColor: Colors.red),
                    );
                  },
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            TextButton(
              onPressed: () {
                // Logout all
                Navigator.pop(context);
                ref.read(authStateProvider.notifier).signOut();
                context.go('/welcome');
              },
              child: const Text('Logout All Devices', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  // Removed _allAcademies and _filteredAcademies to use Riverpod provider

  // _toggleAcademySelection removed

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final authState = ref.watch(authStateProvider);
    ref.listen<AsyncValue<User?>>(authStateProvider, (previous, next) {
      if (next.value != null && previous?.value?.email != next.value?.email) {
        // Removed syncWithCloud call because it's not implemented yet
      }
    });
    final allAcademies = ref.watch(academiesProvider).value ?? [];
    final allSports = ref.watch(sportsProvider);
    
    final filteredAcademies = allAcademies.where((a) {
      bool matchesSport = _selectedSports.contains('All') || _selectedSports.isEmpty || _selectedSports.contains(a.sport);
      bool matchesCity = _selectedCity == 'All' || a.city == _selectedCity;
      bool matchesRating = a.rating >= _minRating;
      bool matchesGender = _selectedGender == 'Any' || a.gender == _selectedGender;
      bool matchesAge = _selectedAgeGroup == 'All' || a.ageGroups.contains('All Ages') || a.ageGroups.contains(_selectedAgeGroup);
      bool matchesFacilities = _selectedFacilities.isEmpty || _selectedFacilities.every((fac) => a.facilities.contains(fac));
      return matchesSport && matchesCity && matchesRating && matchesGender && matchesAge && matchesFacilities;
    }).toList();
    
    final userPosition = ref.watch(initialLocationProvider).value;
    final Map<String, String> dynamicDistances = {};
    
    if (userPosition != null) {
      for (final a in filteredAcademies) {
        final meters = Geolocator.distanceBetween(
          userPosition.latitude, userPosition.longitude,
          a.latitude ?? 0.0, a.longitude ?? 0.0,
        );
        final km = meters / 1000.0;
        dynamicDistances[a.id] = '${km.toStringAsFixed(1)} km';
      }
      
      // Sort filteredAcademies by distance
      filteredAcademies.sort((a, b) {
        final distA = Geolocator.distanceBetween(
          userPosition.latitude, userPosition.longitude,
          a.latitude ?? 0.0, a.longitude ?? 0.0,
        );
        final distB = Geolocator.distanceBetween(
          userPosition.latitude, userPosition.longitude,
          b.latitude ?? 0.0, b.longitude ?? 0.0,
        );
        return distA.compareTo(distB);
      });
    } else {
      // Sort filteredAcademies by rankingScore descending if distance is not available
      filteredAcademies.sort((a, b) => b.rankingScore.compareTo(a.rankingScore));
    }

    final shortlistState = ref.watch(shortlistProvider);
    final shortlistedAcademies = allAcademies.where((a) => shortlistState.academyIds.contains(a.id)).toList();
    final allCoaches = allAcademies.expand((a) => a.coaches).toList();
    final shortlistedCoaches = allCoaches.where((c) => shortlistState.coachIds.contains(c.id)).toList();

    final recentlyViewedIds = ref.watch(recentlyViewedProvider);
    final recentlyViewedAcademies = <Academy>[];
    for (final id in recentlyViewedIds) {
      try {
        recentlyViewedAcademies.add(allAcademies.firstWhere((a) => a.id == id));
      } catch (_) {}
    }

    final selectedAcademies = ref.watch(compareProvider);

    return Scaffold(
      extendBody: true, // Allows background to flow under floating nav bar
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      bottomNavigationBar: _buildBottomNav(isDark),
      floatingActionButton: _selectedIndex == 0
          ? Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (selectedAcademies.isNotEmpty)
                  _CompareButton(
                    count: selectedAcademies.length,
                    isDark: isDark,
                    onPressed: () {
                      context.push('/compare');
                    },
                  ),
                if (selectedAcademies.isNotEmpty) const SizedBox(height: 16),
                FloatingActionButton.extended(
                  heroTag: 'location_fab',
                  onPressed: () => context.push('/location'),
                  backgroundColor: isDark ? AppColors.card2Dark : Colors.white,
                  icon: const Icon(Icons.location_on, color: AppColors.green),
                  label: const Text(
                    'Live Location',
                    style: TextStyle(
                      color: AppColors.green,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            )
          : null,
      body: Stack(
        children: [
          // Background Glows
          // Top Right Glow
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 450,
              height: 450,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark 
                    ? AppColors.green.withValues(alpha: 0.15) 
                    : AppColors.agGlowEmerald.withValues(alpha: 0.35),
              ),
            )
                .animate(
                  onPlay: (controller) => controller.repeat(reverse: true),
                )
                .scaleXY(end: 1.3, duration: 4.seconds)
                .blurXY(end: 120),
          ),

          // Bottom Left Glow
          Positioned(
            bottom: -150,
            left: -150,
            child: Container(
              width: 500,
              height: 500,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark 
                    ? AppColors.blue.withValues(alpha: 0.1) 
                    : AppColors.agGlowTeal.withValues(alpha: 0.35),
              ),
            )
                .animate(
                  onPlay: (controller) => controller.repeat(reverse: true),
                )
                .scaleXY(end: 1.4, duration: 5.seconds)
                .blurXY(end: 140),
          ),
          
          // Extra Middle Glow for Light Mode Enhancement
          if (!isDark)
            Positioned(
              top: MediaQuery.of(context).size.height * 0.3,
              right: -150,
              child: Container(
                width: 550,
                height: 550,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.agGlowMint.withValues(alpha: 0.25),
                ),
              )
                  .animate(
                    onPlay: (controller) => controller.repeat(reverse: true),
                  )
                  .slideX(begin: 0, end: -0.3, duration: 6.seconds)
                  .blurXY(end: 160),
            ),

          IndexedStack(
            index: _selectedIndex,
            children: [
              _buildHomeTab(isDark, authState, filteredAcademies, allSports, recentlyViewedAcademies, dynamicDistances, selectedAcademies),
              _buildShortlistTab(isDark, shortlistedAcademies, shortlistedCoaches),
              SearchTab(isDark: isDark),
              _buildProfileTab(isDark, authState),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHomeTab(bool isDark, AsyncValue<User?> authState, List<Academy> filteredAcademies, List<Sport> allSports, List<Academy> recentlyViewedAcademies, Map<String, String> dynamicDistances, Set<String> selectedAcademies) {
    final hour = DateTime.now().hour;
    String greeting = 'Good Morning,';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon,';
    } else if (hour >= 17) {
      greeting = 'Good Evening,';
    }

    final List<String> displaySports = ['All'];
    if (!_showAllSports) {
      displaySports.addAll(['Cricket', 'Football', 'Badminton', 'Martial Arts', 'Fitness', 'Yoga']);
      displaySports.add('More');
    } else {
      displaySports.addAll(allSports.map((s) => s.name));
      displaySports.add('Less');
    }

    return SafeArea(
      child: CustomScrollView(
        slivers: [
          // App Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => context.go('/welcome'),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          margin: const EdgeInsets.only(right: 16),
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.cardDark : Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isDark ? Colors.white12 : Colors.black12,
                            ),
                          ),
                          child: Icon(
                            Icons.arrow_back_ios_new,
                            size: 16,
                            color:
                                isDark ? AppColors.textPrimary : Colors.black87,
                          ),
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            greeting,
                            style: TextStyle(
                              color: isDark
                                  ? AppColors.textSecondary
                                  : Colors.black54,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            'Future Champion',
                            style: GoogleFonts.barlowCondensed(
                              color: isDark
                                  ? AppColors.textPrimary
                                  : AppColors.textLight,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () => context.push('/notifications'),
                        child: Stack(
                          children: [
                            CircleAvatar(
                              radius: 20,
                              backgroundColor: isDark ? AppColors.green.withValues(alpha: 0.2) : Colors.black.withValues(alpha: 0.05),
                              child: Icon(Icons.notifications_outlined, color: isDark ? AppColors.green : Colors.black87, size: 20),
                            ),
                            Positioned(
                              top: 0,
                              right: 0,
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  color: Colors.red,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedIndex = 3;
                          });
                        },
                        child: authState.when(
                          data: (user) => Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isDark ? AppColors.green.withValues(alpha: 0.2) : Colors.black.withValues(alpha: 0.05),
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: (user?.photoURL == null || user!.photoURL!.isEmpty)
                                ? Icon(Icons.person, color: isDark ? AppColors.green : Colors.black87)
                                : Image(
                                    image: getProfileImageProvider(user!.photoURL)!,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Icon(Icons.person, color: isDark ? AppColors.green : Colors.black87);
                                    },
                                  ),
                          ),
                          loading: () => const CircleAvatar(radius: 24, child: CircularProgressIndicator()),
                          error: (_, __) => const CircleAvatar(radius: 24, child: Icon(Icons.error)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ).animate().fadeIn().slideY(begin: -0.2),
          ),

          // Search Bar & Filter
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedIndex = 2; // Route to Search Tab
                        });
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.cardDark : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDark ? Colors.white12 : Colors.black12,
                          ),
                        ),
                        child: TextField(
                          enabled: false,
                          style: TextStyle(
                            color: isDark ? AppColors.textPrimary : Colors.black87,
                          ),
                          decoration: const InputDecoration(
                            hintText: 'Search academies, sports...',
                            prefixIcon: Icon(
                              Icons.search,
                              color: AppColors.green,
                            ),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () => _showFilterModal(context, isDark),
                    child: Container(
                      height: 52,
                      width: 52,
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.green.withValues(alpha: 0.15) : Colors.black.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? AppColors.green.withValues(alpha: 0.4) : Colors.black.withValues(alpha: 0.1)),
                      ),
                      child: Icon(Icons.tune, color: isDark ? AppColors.green : Colors.black87),
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),
            ),
          ),

          // Sports Categories
          SliverToBoxAdapter(
            child: SizedBox(
              height: 90,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical: 20.0,
                ),
                scrollDirection: Axis.horizontal,
                itemCount: displaySports.length,
                itemBuilder: (context, index) {
                  final sport = displaySports[index];
                  if (sport == 'More' || sport == 'Less') {
                    final isMore = sport == 'More';
                    return Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _showAllSports = !_showAllSports;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: isDark 
                                ? [AppColors.green.withValues(alpha: 0.25), AppColors.green.withValues(alpha: 0.05)]
                                : [AppColors.green.withValues(alpha: 0.2), AppColors.green.withValues(alpha: 0.05)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: AppColors.green.withValues(alpha: 0.5), width: 1.5),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.green.withValues(alpha: 0.2),
                                blurRadius: 10,
                                spreadRadius: 0,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                sport,
                                style: TextStyle(
                                  color: isDark ? Colors.white : AppColors.agPrimary,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(
                                isMore ? Icons.add_circle_outline : Icons.remove_circle_outline,
                                color: isDark ? AppColors.green : AppColors.agPrimary,
                                size: 18,
                              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
                               .scaleXY(end: 1.15, duration: 1.seconds, curve: Curves.easeInOut),
                            ],
                          ),
                        ),
                      ).animate().fadeIn(
                            delay: Duration(
                              milliseconds: 150 + (index * 50),
                            ),
                          ),
                    );
                  }
                  final isSelected = _selectedSports.contains(sport);
                  return Padding(
                    padding: const EdgeInsets.only(right: 12.0),
                    child: PremiumFilterChip(
                      label: sport,
                      isSelected: isSelected,
                      isDark: isDark,
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
                        });
                      },
                    ).animate().fadeIn(
                          delay: Duration(
                            milliseconds: 150 + (index * 50),
                          ),
                        ),
                  );
                },
              ),
            ),
          ),

          // Explore Sports Horizontal List
          SliverToBoxAdapter(
            child: SizedBox(
              height: 280,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                itemCount: allSports.length,
                itemBuilder: (context, index) {
                  final sport = allSports[index];
                  return SportCard(
                    sport: sport,
                    delayMs: 250 + (index * 100),
                    onTap: () => context.push('/sport_details/${sport.id}'),
                  );
                },
              ),
            ),
          ),

          // Browse by City Horizontal List
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'BROWSE BY CITY',
                        style: TextStyle(
                          color: isDark ? AppColors.textSecondary : Colors.black54,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 200.ms),
                ),
                SizedBox(
                  height: 140,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                    itemCount: 5,
                    itemBuilder: (context, index) {
                      final cities = [
                        {'name': 'Bangalore', 'image': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=600'},
                        {'name': 'Mumbai', 'image': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=600'},
                        {'name': 'Delhi', 'image': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600'},
                        {'name': 'Pune', 'image': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=600'},
                        {'name': 'Madanapalle', 'image': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600'},
                      ];
                      final city = cities[index];
                      return GestureDetector(
                        onTap: () => context.push('/city/${city['name']}'),
                        child: Container(
                          width: 140,
                          margin: const EdgeInsets.only(right: 16),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            image: DecorationImage(
                              image: NetworkImage(city['image']!),
                              fit: BoxFit.cover,
                            ),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.8),
                                    ],
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 12,
                                left: 12,
                                child: Text(
                                  city['name']!,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ).animate().scale(delay: Duration(milliseconds: 250 + (index * 50))),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Recently Viewed
          if (recentlyViewedAcademies.isNotEmpty)
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'RECENTLY VIEWED',
                          style: TextStyle(
                            color: isDark ? AppColors.textSecondary : Colors.black54,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ).animate().fadeIn(delay: 250.ms),
                  ),
                  SizedBox(
                    height: 180, // Using smaller cards for recently viewed
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                      itemCount: recentlyViewedAcademies.length,
                      itemBuilder: (context, index) {
                        final academy = recentlyViewedAcademies[index];
                        return Container(
                          width: 250,
                          margin: const EdgeInsets.only(right: 16),
                          child: GestureDetector(
                            onTap: () => context.push('/academy_details/${academy.id}'),
                            child: Container(
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.cardDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                              ),
                              clipBehavior: Clip.antiAlias,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Academy Image
                                  SizedBox(
                                    height: 100,
                                    width: double.infinity,
                                    child: Image.network(
                                      academy.images.isNotEmpty ? academy.images.first : '',
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) {
                                        return Container(
                                          color: Colors.grey.withValues(alpha: 0.2),
                                          child: const Icon(Icons.sports_basketball, color: Colors.grey),
                                        );
                                      },
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              const Text('🏅', style: TextStyle(fontSize: 14)),
                                              const SizedBox(width: 6),
                                              Expanded(
                                                child: Text(
                                                  academy.name,
                                                  style: TextStyle(
                                                    color: isDark ? Colors.white : Colors.black87,
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 14,
                                                  ),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const Spacer(),
                                          Row(
                                            children: [
                                              const Icon(Icons.star, color: AppColors.amber, size: 12),
                                              const SizedBox(width: 4),
                                              Text('${academy.rating}', style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 11)),
                                              const Spacer(),
                                              Icon(Icons.location_on, color: isDark ? Colors.white54 : Colors.black54, size: 12),
                                              const SizedBox(width: 2),
                                              Expanded(
                                                child: Text(
                                                  academy.city, 
                                                  style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 11),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ).animate().fadeIn(delay: Duration(milliseconds: 250 + (index * 50)));
                      },
                    ),
                  ),
                ],
              ),
            ),

          // Section Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 8.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'AI RECOMMENDED ACADEMIES',
                    style: TextStyle(
                      color: isDark ? AppColors.textSecondary : Colors.black54,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  if (ref.watch(initialLocationProvider).value == null)
                    TextButton.icon(
                      onPressed: () {
                        ref.invalidate(initialLocationProvider);
                      },
                      icon: const Icon(Icons.my_location, size: 16, color: AppColors.green),
                      label: const Text('Detect Distance', style: TextStyle(color: AppColors.green, fontSize: 12)),
                    ),
                ],
              ).animate().fadeIn(delay: 300.ms),
            ),
          ),

          // Academy Cards List
          if (_isLoading)
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: _buildShimmerCard(isDark),
                  );
                }, childCount: 3),
              ),
            )
          else if (filteredAcademies.isEmpty)
            SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(40.0),
                  child: Column(
                    children: [
                      Icon(Icons.search_off, size: 64, color: isDark ? Colors.white24 : Colors.black26),
                      const SizedBox(height: 16),
                      Text('No academies found.', style: TextStyle(color: isDark ? Colors.white70 : Colors.black87, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('Try adjusting your filters.', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54)),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 8.0,
              ),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  if (index == filteredAcademies.length) {
                    return const SizedBox(height: 40);
                  }
                  final academy = filteredAcademies[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: AcademyCard(
                      academy: academy,
                      isSelected: selectedAcademies.contains(academy.id),
                      delayMs: 400 + (index * 50),
                      calculatedDistance: dynamicDistances[academy.id],
                      onSelect: () => context.push('/academy_details/${academy.id}'),
                    ),
                  );
                }, childCount: filteredAcademies.length + 1),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildShimmerCard(bool isDark) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: isDark ? Colors.white10 : Colors.black12,
        borderRadius: BorderRadius.circular(20),
      ),
    ).animate(onPlay: (controller) => controller.repeat()).shimmer(duration: 1.5.seconds, color: isDark ? Colors.white24 : Colors.black26);
  }

  Widget _buildShortlistTab(bool isDark, List<Academy> shortlistedAcademies, List<Coach> shortlistedCoaches) {
    return SafeArea(
      child: DefaultTabController(
        length: 2,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Text(
                'Your Shortlist',
                style: GoogleFonts.barlowCondensed(
                  color: isDark ? AppColors.textPrimary : Colors.black87,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn(),
            ),
            TabBar(
              indicatorColor: AppColors.green,
              labelColor: isDark ? AppColors.green : AppColors.agPrimary,
              unselectedLabelColor: isDark ? Colors.white54 : Colors.black54,
              tabs: const [
                Tab(text: 'Academies'),
                Tab(text: 'Coaches'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  // Academies Tab
                  shortlistedAcademies.isEmpty
                      ? Center(
                          child: Text(
                            'No academies shortlisted.',
                            style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                          itemCount: shortlistedAcademies.length,
                          itemBuilder: (context, index) {
                            final academy = shortlistedAcademies[index];
                            return AcademyCard(
                              academy: academy,
                              isSelected: false,
                              onSelect: () => context.push('/academy_details/${academy.id}'),
                              delayMs: 100 * index,
                            );
                          },
                        ),
                  
                  // Coaches Tab
                  shortlistedCoaches.isEmpty
                      ? Center(
                          child: Text(
                            'No coaches shortlisted.',
                            style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                          itemCount: shortlistedCoaches.length,
                          itemBuilder: (context, index) {
                            final coach = shortlistedCoaches[index];
                            return Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.cardDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    radius: 30,
                                    backgroundImage: NetworkImage(coach.imageUrl),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          coach.name,
                                          style: TextStyle(
                                            color: isDark ? Colors.white : Colors.black87,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Text(
                                          coach.role,
                                          style: const TextStyle(
                                            color: AppColors.green,
                                            fontSize: 14,
                                          ),
                                        ),
                                        Text(
                                          coach.experience,
                                          style: TextStyle(
                                            color: isDark ? Colors.white54 : Colors.black54,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.bookmark, color: AppColors.green),
                                    onPressed: () {
                                      ref.read(shortlistProvider.notifier).toggleCoach(coach.id);
                                    },
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }


  Widget _buildProfileTab(bool isDark, AsyncValue<User?> authState) {
    return SafeArea(
      child: authState.when(
        data: (user) {
          if (user == null) {
            return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Align(
                      alignment: Alignment.topLeft,
                      child: Padding(
                        padding: const EdgeInsets.only(left: 24.0, top: 24.0),
                        child: IconButton(
                          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black87),
                          onPressed: () {
                            setState(() {
                              _selectedIndex = 0; // Go back to Home tab
                            });
                          },
                        ),
                      ),
                    ),
                    const Spacer(),
                    Icon(Icons.lock_outline,
                      size: 80, color: AppColors.green.withValues(alpha: 0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'Profile',
                    style: GoogleFonts.barlowCondensed(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to view your profile',
                    style: TextStyle(
                      color: isDark ? AppColors.textSecondary : Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton.icon(
                    onPressed: () => context.push('/signin'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.green,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 32, vertical: 16),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.login),
                    label: const Text('Sign In',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                  const SizedBox(height: 16),
                ],
              ).animate().fadeIn().scale(),
            );
          }

          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: IconButton(
                  icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black87),
                  onPressed: () {
                    setState(() {
                      _selectedIndex = 0; // Go back to Home tab
                    });
                  },
                ),
              ),
              Center(
                child: Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.green.withValues(alpha: 0.2),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: (user.photoURL == null || user.photoURL!.isEmpty)
                          ? const Icon(Icons.person, size: 60, color: AppColors.green)
                          : Image(
                              image: getProfileImageProvider(user.photoURL)!,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return const Icon(Icons.person, size: 60, color: AppColors.green);
                              },
                            ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.green,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isDark ? AppColors.cardDark : Colors.white,
                          width: 3,
                        ),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.camera_alt, color: Colors.black, size: 20),
                        onPressed: _pickImage,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Center(
                child: Text(
                  user.displayName ?? 'Unknown Name',
                  style: GoogleFonts.barlowCondensed(
                    color: isDark ? AppColors.textPrimary : Colors.black87,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  user.email,
                  style: TextStyle(
                    color: isDark ? AppColors.textSecondary : Colors.black54,
                    fontSize: 16,
                  ),
                ),
              ),
              Center(
                child: Text(
                  user.phoneNumber ?? 'No Phone Number',
                  style: TextStyle(
                    color: isDark ? AppColors.textSecondary : Colors.black54,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              
              // Edit Profile Tile
              Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white12 : Colors.black12,
                  ),
                ),
                child: ListTile(
                  leading: const Icon(Icons.edit, color: AppColors.green),
                  title: Text(
                    'Edit Profile',
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                  onTap: () {
                    context.push('/edit_profile');
                  },
                ),
              ),
              const SizedBox(height: 16),

              // Settings Tile
              Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white12 : Colors.black12,
                  ),
                ),
                child: ListTile(
                  leading: const Icon(Icons.settings, color: AppColors.green),
                  title: Text(
                    'Settings',
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                  onTap: () {
                    context.push('/settings');
                  },
                ),
              ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
              
              const SizedBox(height: 16),

              // Sessions Tile
              Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white12 : Colors.black12,
                  ),
                ),
                child: ListTile(
                  leading: const Icon(Icons.devices, color: AppColors.green),
                  title: Text(
                    'Active Sessions',
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  trailing: Icon(Icons.chevron_right, color: isDark ? Colors.white54 : Colors.black54),
                  onTap: () => _showSessionsDialog(context, isDark),
                ),
              ).animate().fadeIn(delay: 420.ms).slideY(begin: 0.1),

              const SizedBox(height: 16),

              // Dark Mode Toggle Tile
              Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white12 : Colors.black12,
                  ),
                ),
                child: SwitchListTile(
                  secondary: const Icon(Icons.dark_mode, color: AppColors.green),
                  title: Text(
                    'Dark Mode',
                    style: TextStyle(
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  value: isDark,
                  activeColor: AppColors.green,
                  onChanged: (value) {
                    ref.read(themeProvider.notifier).state = 
                        value ? ThemeMode.dark : ThemeMode.light;
                  },
                ),
              ).animate().fadeIn(delay: 450.ms).slideY(begin: 0.1),

              const SizedBox(height: 40),
              
              Center(
                child: ElevatedButton.icon(
                  onPressed: () {
                    ref.read(authStateProvider.notifier).signOut();
                    context.go('/welcome');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                    foregroundColor: AppColors.green,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    side: BorderSide(
                        color: isDark ? Colors.white12 : Colors.black12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.logout),
                  label: const Text('Sign Out',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2),
              ),
            ],
          );
        },
        loading: () => const Center(
            child: CircularProgressIndicator(color: AppColors.green)),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _buildAcademyCard({
    required String name,
    required String sport,
    required String icon,
    required Color accentColor,
    required String rating,
    required String distance,
    required String price,
    required List<String> features,
    required List<String> badges,
    required bool isDark,
    required int delay,
    required bool isSelected,
    required VoidCallback onSelect,
  }) {
    return GestureDetector(
      onTap: onSelect,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: isDark
                ? BoxDecoration(
                    color: AppColors.cardDark.withValues(
                      alpha: isSelected ? 0.9 : 0.7,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.green
                          : accentColor.withValues(alpha: 0.3),
                      width: isSelected ? 2 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: accentColor.withValues(alpha: 0.05),
                        blurRadius: 20,
                        spreadRadius: -5,
                      ),
                    ],
                  )
                : AntiGravityStyle.floatingCard(
                    borderRadius: 20.0,
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
                // Banner area (Simulated with Gradient)
                Container(
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        accentColor.withValues(alpha: 0.2),
                        Colors.transparent,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: badges
                            .map(
                              (badge) => Container(
                                margin: const EdgeInsets.only(right: 8),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: badge == 'AI Match'
                                      ? AppColors.green
                                      : Colors.black45,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  badge,
                                  style: TextStyle(
                                    color: badge == 'AI Match'
                                        ? Colors.black
                                        : Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isDark ? Colors.black45 : Colors.white54,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.favorite_border,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      if (isSelected)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: AppColors.green,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.check,
                            color: Colors.black,
                            size: 20,
                          ),
                        ).animate().scale(),
                    ],
                  ),
                ),

                // Details Area
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(icon, style: const TextStyle(fontSize: 24)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              name,
                              style: TextStyle(
                                color: isDark
                                    ? AppColors.textPrimary
                                    : Colors.black87,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                color: AppColors.amber,
                                size: 16,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                rating,
                                style: TextStyle(
                                  color: isDark ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '$sport  •  $distance  •  $price',
                        style: TextStyle(
                          color:
                              isDark ? AppColors.textSecondary : Colors.black54,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: features
                            .map(
                              (f) => Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? AppColors.inkDark
                                      : AppColors.inkLight,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isDark
                                        ? Colors.white12
                                        : Colors.black12,
                                  ),
                                ),
                                child: Text(
                                  f,
                                  style: TextStyle(
                                    color: isDark
                                        ? AppColors.textTertiary
                                        : Colors.black87,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ).animate().fadeIn(delay: delay.ms).slideY(begin: 0.1),
    );
  }
  Widget _buildSelectedNavIcon(IconData iconData, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 6),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark 
            ? [AppColors.green.withValues(alpha: 0.25), AppColors.green.withValues(alpha: 0.05)]
            : [AppColors.green.withValues(alpha: 0.2), AppColors.green.withValues(alpha: 0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.green.withValues(alpha: 0.5), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: AppColors.green.withValues(alpha: 0.2),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Icon(iconData, color: isDark ? AppColors.green : AppColors.agPrimary),
    ).animate().scaleXY(begin: 0.9, end: 1.0, duration: 200.ms, curve: Curves.easeOutBack);
  }

  Widget _buildBottomNav(bool isDark) {
    return SafeArea(
      child: Container(
        margin: const EdgeInsets.only(left: 24, right: 24, bottom: 16),
        decoration: isDark
            ? BoxDecoration(
                color: AppColors.cardDark,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white12),
              )
            : AntiGravityStyle.floatingNavBar(),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: NavigationBar(
            height: 65,
            backgroundColor: Colors.transparent,
            elevation: 0,
            indicatorColor: Colors.transparent,
            selectedIndex: _selectedIndex,
            onDestinationSelected: (i) => setState(() => _selectedIndex = i),
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.home_outlined),
                selectedIcon: _buildSelectedNavIcon(Icons.home, isDark),
                label: 'Home',
              ),
              NavigationDestination(
                icon: const Icon(Icons.bookmark_outline),
                selectedIcon: _buildSelectedNavIcon(Icons.bookmark, isDark),
                label: 'Shortlist',
              ),
              NavigationDestination(
                icon: const Icon(Icons.search_outlined),
                selectedIcon: _buildSelectedNavIcon(Icons.search, isDark),
                label: 'Search',
              ),
              NavigationDestination(
                icon: const Icon(Icons.person_outline),
                selectedIcon: _buildSelectedNavIcon(Icons.person, isDark),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFilterModal(BuildContext context, bool isDark) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.inkDark.withValues(alpha: 0.9) : Colors.white.withValues(alpha: 0.9),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                  border: Border.all(
                    color: isDark ? Colors.white12 : Colors.black12,
                  ),
                ),
                child: SafeArea(
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          margin: const EdgeInsets.only(bottom: 24),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.white24 : Colors.black12,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      Text(
                        'Filters',
                        style: GoogleFonts.barlowCondensed(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Sports Filter
                      Text(
                        'Sports',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ['All', ...ref.read(sportsProvider).map((s) => s.name)].map((sport) {
                          final isSelected = _selectedSports.contains(sport);
                          return PremiumFilterChip(
                            label: sport,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              setModalState(() {
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
                              });
                              setState(() {});
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // City Filter
                      Text(
                        'City',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ['All', 'Madanapalle', 'Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi', 'Pune'].map((city) {
                          final isSelected = _selectedCity == city;
                          return PremiumFilterChip(
                            label: city,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              if (selected) {
                                setModalState(() => _selectedCity = city);
                                setState(() => _selectedCity = city);
                              }
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Rating Filter
                      Text(
                        'Minimum Rating',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          {'label': 'Any', 'val': 0.0},
                          {'label': '3+ Stars', 'val': 3.0},
                          {'label': '4+ Stars', 'val': 4.0},
                          {'label': '4.5+ Stars', 'val': 4.5},
                        ].map((ratingMap) {
                          final label = ratingMap['label'] as String;
                          final val = ratingMap['val'] as double;
                          final isSelected = _minRating == val;
                          return PremiumFilterChip(
                            label: label,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              if (selected) {
                                setModalState(() => _minRating = val);
                                setState(() => _minRating = val);
                              }
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Gender Filter
                      Text(
                        'Gender',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ['Any', 'Boys', 'Girls', 'Mixed'].map((gender) {
                          final isSelected = _selectedGender == gender;
                          return PremiumFilterChip(
                            label: gender,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              if (selected) {
                                setModalState(() => _selectedGender = gender);
                                setState(() => _selectedGender = gender);
                              }
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Age Group Filter
                      Text(
                        'Age Group',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ['All', 'Kids', 'U-14', 'U-19', 'Adults'].map((age) {
                          final isSelected = _selectedAgeGroup == age;
                          return PremiumFilterChip(
                            label: age,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              if (selected) {
                                setModalState(() => _selectedAgeGroup = age);
                                setState(() => _selectedAgeGroup = age);
                              }
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Facilities Filter
                      Text(
                        'Facilities',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDark ? Colors.white70 : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: ['Parking', 'Locker Room', 'Floodlights', 'Equipment Provided', 'Cafeteria', 'First Aid'].map((fac) {
                          final isSelected = _selectedFacilities.contains(fac);
                          return PremiumFilterChip(
                            label: fac,
                            isSelected: isSelected,
                            isDark: isDark,
                            onSelected: (selected) {
                              setModalState(() {
                                if (selected) {
                                  _selectedFacilities.add(fac);
                                } else {
                                  _selectedFacilities.remove(fac);
                                }
                              });
                              setState(() {});
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 32),

                      // Apply Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {
                            context.pop();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.green,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text(
                            'Apply Filters',
                            style: TextStyle(
                              color: Colors.black87,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class _CompareButton extends StatelessWidget {
  final int count;
  final bool isDark;
  final VoidCallback onPressed;

  const _CompareButton({
    required this.count,
    required this.isDark,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      heroTag: 'compare_fab',
      onPressed: onPressed,
      backgroundColor: AppColors.green,
      elevation: 6,
      icon: const Icon(
        Icons.auto_awesome,
        color: Colors.black87,
      ),
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Compare & Suggest',
            style: TextStyle(
              color: Colors.black87,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              '$count Selected',
              style: const TextStyle(
                color: AppColors.green,
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    )
        .animate(onPlay: (c) => c.repeat(reverse: true))
        .shimmer(
            duration: 2.seconds, color: Colors.white.withValues(alpha: 0.3))
        .boxShadow(
          end: BoxShadow(
            color: AppColors.green.withValues(alpha: 0.5),
            blurRadius: 20,
            spreadRadius: 4,
          ),
        );
  }

}
