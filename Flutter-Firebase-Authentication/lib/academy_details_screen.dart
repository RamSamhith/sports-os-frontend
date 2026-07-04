import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'auth_provider.dart';
import 'conversion_modal.dart';
import 'shortlist_provider.dart';
import 'recently_viewed_provider.dart';

class AcademyDetailsScreen extends ConsumerStatefulWidget {
  final String academyId;

  const AcademyDetailsScreen({super.key, required this.academyId});

  @override
  ConsumerState<AcademyDetailsScreen> createState() => _AcademyDetailsScreenState();
}

class _AcademyDetailsScreenState extends ConsumerState<AcademyDetailsScreen> {
  int _currentImageIndex = 0;
  final LatLng _center = const LatLng(12.9716, 77.5946); // Default to Bangalore for mock data

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(recentlyViewedProvider.notifier).addViewed(widget.academyId);
    });
  }

  void _showReviewDialog(BuildContext context, bool isDark) {
    double rating = 5.0;
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: isDark ? AppColors.cardDark : Colors.white,
              title: Text('Rate Academy', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      return IconButton(
                        icon: Icon(
                          index < rating ? Icons.star : Icons.star_border,
                          color: AppColors.amber,
                        ),
                        onPressed: () {
                          setState(() {
                            rating = index + 1.0;
                          });
                        },
                      );
                    }),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: commentController,
                    maxLines: 3,
                    style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                    decoration: InputDecoration(
                      hintText: 'Write your review...',
                      hintStyle: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
                      filled: true,
                      fillColor: isDark ? AppColors.inkDark : Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('Cancel', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.green,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    if (commentController.text.trim().isEmpty) return;
                    
                    final newReview = Review(
                      userName: 'You',
                      rating: rating,
                      comment: commentController.text.trim(),
                      date: 'Just now',
                    );
                    
                    ref.read(academiesProvider.notifier).addReview(widget.academyId, newReview);
                    Navigator.pop(context);
                  },
                  child: const Text('Submit', style: TextStyle(color: Colors.white)),
                ),
              ],
            );
          }
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final academies = ref.watch(academiesProvider).value ?? [];
    final academy = academies.firstWhere(
      (a) => a.id == widget.academyId,
      orElse: () => academies.first,
    );

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      body: CustomScrollView(
        slivers: [
          // 1. Gallery (SliverAppBar)
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: isDark ? AppColors.cardDark : Colors.white,
            leading: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.5),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
                  onPressed: () => context.pop(),
                ),
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.share, color: Colors.white, size: 20),
                    onPressed: () {
                      // ignore: deprecated_member_use
                      Share.share('Check out ${academy.name} on our app! They have a rating of ${academy.rating}.');
                    },
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.5),
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.bookmark_border, color: Colors.white, size: 20),
                    onPressed: () {},
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  PageView.builder(
                    itemCount: academy.images.length,
                    onPageChanged: (index) {
                      setState(() {
                        _currentImageIndex = index;
                      });
                    },
                    itemBuilder: (context, index) {
                      return Image.network(
                        academy.images[index],
                        fit: BoxFit.cover,
                      );
                    },
                  ),
                  // Gradient Overlay
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.4),
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.7),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Pagination Dots
                  Positioned(
                    bottom: 16,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(academy.images.length, (index) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: _currentImageIndex == index ? 12 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _currentImageIndex == index ? AppColors.green : Colors.white54,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Details Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Title & Rating
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              academy.name,
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: isDark ? AppColors.textPrimary : Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: AppColors.green, size: 16),
                                const SizedBox(width: 4),
                                Text(
                                  '${academy.city} • ${academy.distance}',
                                  style: TextStyle(
                                    color: isDark ? AppColors.textSecondary : Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.green.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.star, color: AppColors.amber, size: 24),
                            const SizedBox(height: 4),
                            Text(
                              '${academy.rating}',
                              style: const TextStyle(
                                color: AppColors.green,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 24),

                  // About Section
                  _buildSectionTitle('About', isDark),
                  Text(
                    academy.aboutText ?? '',
                    style: TextStyle(
                      color: isDark ? Colors.white70 : Colors.black87,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 12,
                    children: [
                      if (academy.instagram != null)
                        ActionChip(
                          avatar: const Icon(Icons.camera_alt, size: 16, color: Colors.pink),
                          label: const Text('Instagram'),
                          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                          onPressed: () => launchUrl(Uri.parse(academy.instagram!)),
                        ),
                      if (academy.facebook != null)
                        ActionChip(
                          avatar: const Icon(Icons.facebook, size: 16, color: Colors.blue),
                          label: const Text('Facebook'),
                          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                          onPressed: () => launchUrl(Uri.parse(academy.facebook!)),
                        ),
                      if (academy.website != null)
                        ActionChip(
                          avatar: const Icon(Icons.language, size: 16, color: Colors.green),
                          label: const Text('Website'),
                          backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                          onPressed: () => launchUrl(Uri.parse(academy.website!)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Facilities
                  _buildSectionTitle('Facilities', isDark),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      Chip(
                        avatar: const Icon(Icons.people, size: 16, color: AppColors.green),
                        label: Text(academy.gender ?? 'Unspecified'),
                        backgroundColor: isDark ? AppColors.cardDark : Colors.grey[100],
                        labelStyle: TextStyle(color: isDark ? Colors.white : Colors.black87),
                        side: BorderSide(color: isDark ? Colors.white12 : Colors.black12),
                      ),
                      Chip(
                        avatar: const Icon(Icons.cake, size: 16, color: AppColors.green),
                        label: Text(academy.ageGroups.join(', ')),
                        backgroundColor: isDark ? AppColors.cardDark : Colors.grey[100],
                        labelStyle: TextStyle(color: isDark ? Colors.white : Colors.black87),
                        side: BorderSide(color: isDark ? Colors.white12 : Colors.black12),
                      ),
                      ...(academy.facilities).map((fac) {
                        return Chip(
                          label: Text(fac),
                          backgroundColor: isDark ? AppColors.cardDark : Colors.grey[100],
                          labelStyle: TextStyle(color: isDark ? Colors.white : Colors.black87),
                          side: BorderSide(color: isDark ? Colors.white12 : Colors.black12),
                        );
                      }),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Coaches Section
                  if (academy.coaches.isNotEmpty) ...[
                    _buildSectionTitle('Our Coaches', isDark),
                    SizedBox(
                      height: 180,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: academy.coaches.length,
                        itemBuilder: (context, index) {
                          final coach = academy.coaches[index];
                          return Container(
                            width: 140,
                            margin: const EdgeInsets.only(right: 16),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Stack(
                                  children: [
                                    Center(
                                      child: CircleAvatar(
                                        radius: 40,
                                        backgroundImage: NetworkImage(coach.imageUrl),
                                      ),
                                    ),
                                    Positioned(
                                      top: -10,
                                      right: -10,
                                      child: Consumer(
                                        builder: (context, ref, child) {
                                          final isCoachShortlisted = ref.watch(shortlistProvider).coachIds.contains(coach.id);
                                          return IconButton(
                                            icon: Icon(
                                              isCoachShortlisted ? Icons.bookmark : Icons.bookmark_border,
                                              color: AppColors.green,
                                              size: 20,
                                            ),
                                            onPressed: () {
                                              ref.read(shortlistProvider.notifier).toggleCoach(coach.id);
                                            },
                                          );
                                        },
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  coach.name,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white : Colors.black87,
                                  ),
                                  textAlign: TextAlign.center,
                                  maxLines: 1,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  coach.role,
                                  style: const TextStyle(
                                    color: AppColors.green,
                                    fontSize: 12,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                Text(
                                  coach.experience,
                                  style: TextStyle(
                                    color: isDark ? Colors.white54 : Colors.black54,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],

                  // Reviews Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildSectionTitle('Reviews', isDark),
                      TextButton.icon(
                        onPressed: () {
                          if (ref.read(isGuestProvider)) {
                            showConversionModal(context, ref: ref, actionName: 'write a review');
                          } else {
                            _showReviewDialog(context, isDark);
                          }
                        },
                        icon: const Icon(Icons.edit, color: AppColors.green, size: 16),
                        label: const Text('Write Review', style: TextStyle(color: AppColors.green)),
                      ),
                    ],
                  ),
                  if (academy.reviews.isEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 24.0),
                      child: Text(
                        'No reviews yet. Be the first to review!',
                        style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
                      ),
                    )
                  else
                    ...academy.reviews.map((review) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.cardDark : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  review.userName,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white : Colors.black87,
                                  ),
                                ),
                                Row(
                                  children: [
                                    const Icon(Icons.star, color: AppColors.amber, size: 14),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${review.rating}',
                                      style: TextStyle(
                                        color: isDark ? Colors.white70 : Colors.black87,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              review.comment,
                              style: TextStyle(
                                color: isDark ? Colors.white70 : Colors.black87,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 8),
                            if (review.images.isNotEmpty)
                              SizedBox(
                                height: 80,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: review.images.length,
                                  itemBuilder: (context, idx) {
                                    return Container(
                                      margin: const EdgeInsets.only(right: 8),
                                      width: 80,
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(8),
                                        image: DecorationImage(
                                          image: NetworkImage(review.images[idx]),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            if (review.images.isNotEmpty) const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  review.date,
                                  style: TextStyle(
                                    color: isDark ? Colors.white38 : Colors.black38,
                                    fontSize: 11,
                                  ),
                                ),
                                InkWell(
                                  onTap: () {}, // Future: Handle helpful toggle
                                  child: Row(
                                    children: [
                                      Icon(Icons.thumb_up_alt_outlined, size: 14, color: isDark ? Colors.white54 : Colors.black54),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Helpful (${review.helpfulCount})',
                                        style: TextStyle(
                                          color: isDark ? Colors.white54 : Colors.black54,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }),
                  const SizedBox(height: 32),

                  // Achievements & Certifications
                  if (academy.achievements.isNotEmpty) ...[
                    _buildSectionTitle('Achievements', isDark),
                    ...academy.achievements.map((ach) => Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Row(
                            children: [
                              const Icon(Icons.emoji_events, color: AppColors.amber, size: 20),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  ach,
                                  style: TextStyle(color: isDark ? Colors.white70 : Colors.black87),
                                ),
                              ),
                            ],
                          ),
                        )),
                    const SizedBox(height: 24),
                  ],

                  // Map
                  _buildSectionTitle('Location', isDark),
                  Container(
                    height: 200,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                    ),
                    clipBehavior: Clip.hardEdge,
                    child: FlutterMap(
                      options: MapOptions(
                        initialCenter: _center,
                        initialZoom: 14.0,
                        interactionOptions: const InteractionOptions(
                          flags: InteractiveFlag.all,
                        ),
                      ),
                      children: [
                        TileLayer(
                          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                          userAgentPackageName: 'com.example.myapp',
                        ),
                        MarkerLayer(
                          markers: [
                            Marker(
                              point: _center,
                              width: 80,
                              height: 80,
                              child: const Icon(
                                Icons.location_on,
                                color: Colors.redAccent,
                                size: 48,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        final url = 'https://www.google.com/maps/search/?api=1&query=${academy.name} ${academy.city}';
                        launchUrl(Uri.parse(url));
                      },
                      icon: const Icon(Icons.directions, color: AppColors.green),
                      label: const Text('Get Directions', style: TextStyle(color: AppColors.green)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.green),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 100), // Space for sticky bottom bar
                ],
              ),
            ),
          ),
        ],
      ),
      
      // Sticky Bottom Actions
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              _buildActionButton(Icons.call, 'Call', Colors.blue, () {}),
              const SizedBox(width: 12),
              _buildActionButton(Icons.chat, 'WhatsApp', Colors.green, () {}),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    context.push('/academy_details/${widget.academyId}/enquire');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.green,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Enquiry', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: isDark ? Colors.white : Colors.black87,
        ),
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Icon(icon, color: color),
      ),
    );
  }
}
