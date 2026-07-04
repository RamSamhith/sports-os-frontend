import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'theme.dart';
import 'colors.dart';
import 'academy_provider.dart';
import 'academy_card.dart';

class CityPageScreen extends ConsumerWidget {
  final String cityName;

  const CityPageScreen({super.key, required this.cityName});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final allAcademies = ref.watch(academiesProvider).value ?? [];

    // Filter academies by city
    final cityAcademies = allAcademies.where((a) => a.city.toLowerCase() == cityName.toLowerCase()).toList();

    // Extract all coaches
    final cityCoaches = cityAcademies.expand((a) => a.coaches).toList();

    // Determine center of map
    // We'll use a generic center for the city, or default to Bangalore coords
    LatLng cityCenter = const LatLng(12.9716, 77.5946);
    if (cityName.toLowerCase() == 'mumbai') cityCenter = const LatLng(19.0760, 72.8777);
    if (cityName.toLowerCase() == 'delhi') cityCenter = const LatLng(28.7041, 77.1025);
    if (cityName.toLowerCase() == 'madanapalle') cityCenter = const LatLng(13.5500, 78.5000);
    if (cityName.toLowerCase() == 'pune') cityCenter = const LatLng(18.5204, 73.8567);

    return Scaffold(
      backgroundColor: isDark ? AppColors.inkDark : AppColors.inkLight,
      body: DefaultTabController(
        length: 2,
        child: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) {
            return [
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                leading: IconButton(
                  icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black87),
                  onPressed: () => context.pop(),
                ),
                title: Text(
                  cityName,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      FlutterMap(
                        options: MapOptions(
                          initialCenter: cityCenter,
                          initialZoom: 12.0,
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
                            markers: List.generate(cityAcademies.length, (index) {
                              final academy = cityAcademies[index];
                              // Add slight artificial offset so markers don't overlap exactly if they share the exact same mock coordinate
                              final latOffset = (index * 0.01) - 0.02;
                              final lngOffset = (index * 0.01) - 0.02;
                              
                              return Marker(
                                point: LatLng(cityCenter.latitude + latOffset, cityCenter.longitude + lngOffset),
                                width: 40,
                                height: 40,
                                child: GestureDetector(
                                  onTap: () => context.push('/academy_details/${academy.id}'),
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: AppColors.green,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 2),
                                    ),
                                    child: const Icon(Icons.sports_baseball, color: Colors.white, size: 20),
                                  ),
                                ),
                              );
                            }),
                          ),
                        ],
                      ),
                      // Gradient overlay to make back button and title visible
                      Positioned(
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.6),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                bottom: TabBar(
                  labelColor: AppColors.green,
                  unselectedLabelColor: isDark ? Colors.white54 : Colors.black54,
                  indicatorColor: AppColors.green,
                  tabs: [
                    Tab(text: 'Academies (${cityAcademies.length})'),
                    Tab(text: 'Coaches (${cityCoaches.length})'),
                  ],
                ),
              ),
            ];
          },
          body: TabBarView(
            children: [
              // Academies Tab
              cityAcademies.isEmpty
                  ? Center(child: Text('No academies found in $cityName', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54)))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: cityAcademies.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: AcademyCard(
                            academy: cityAcademies[index],
                            isSelected: false,
                            delayMs: index * 50,
                            onSelect: () => context.push('/academy_details/${cityAcademies[index].id}'),
                          ),
                        );
                      },
                    ),

              // Coaches Tab
              cityCoaches.isEmpty
                  ? Center(child: Text('No coaches found in $cityName', style: TextStyle(color: isDark ? Colors.white54 : Colors.black54)))
                  : GridView.builder(
                      padding: const EdgeInsets.all(16),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: cityCoaches.length,
                      itemBuilder: (context, index) {
                        final coach = cityCoaches[index];
                        return Container(
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.cardDark : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: isDark ? Colors.white12 : Colors.black12),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Image.network(
                                  coach.imageUrl,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    color: Colors.grey.withValues(alpha: 0.2),
                                    child: const Icon(Icons.person, color: Colors.grey, size: 40),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      coach.name,
                                      style: TextStyle(
                                        color: isDark ? Colors.white : Colors.black87,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      coach.role,
                                      style: const TextStyle(
                                        color: AppColors.green,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(Icons.timer_outlined, size: 12, color: Colors.grey),
                                        const SizedBox(width: 4),
                                        Text(
                                          coach.experience,
                                          style: TextStyle(
                                            color: isDark ? Colors.white54 : Colors.black54,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
