import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'location_provider.dart';
import 'places_provider.dart';
import 'academy_provider.dart';
import 'colors.dart';
import 'theme.dart';

class LocationScreen extends ConsumerStatefulWidget {
  const LocationScreen({super.key});

  @override
  ConsumerState<LocationScreen> createState() => _LocationScreenState();
}

class _LocationScreenState extends ConsumerState<LocationScreen> {
  final Set<String> _selectedAcademies = {};

  @override
  Widget build(BuildContext context) {
    // Riverpod providers should always be watched unconditionally at the top of the build method
    final isDark = ref.watch(themeProvider) == ThemeMode.dark;
    final locationAsync = ref.watch(locationProvider);
    final placesAsync = ref.watch(placesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Real-Time Location'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: () {
            if (context.canPop()) {
              context.pop(); // Goes to the previous page
            } else {
              context.go('/home'); // Fallback if no history exists
            }
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () => context.go('/home'), // Navigates to the home route
          ),
        ],
      ),
      body: Center(
        child: locationAsync.when(
          // Data state: Successfully receiving location updates
          data: (position) {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.my_location,
                    size: 48,
                    color: AppColors.green,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Location Found!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: isDark ? AppColors.textPrimary : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Lat: ${position.latitude.toStringAsFixed(4)}, Lng: ${position.longitude.toStringAsFixed(4)}\nAccuracy: ${position.accuracy.toStringAsFixed(1)}m',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? AppColors.textSecondary : Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () async {
                      final url = Uri.parse(
                        'https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}',
                      );
                      if (!await launchUrl(
                        url,
                        mode: LaunchMode.externalApplication,
                      )) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Could not open Google Maps'),
                            ),
                          );
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.green,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                    ),
                    icon: const Icon(Icons.map),
                    label: const Text('Open in Google Maps'),
                  ),
                  const SizedBox(height: 40),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'NEARBY ACADEMIES',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                        color:
                            isDark ? AppColors.textSecondary : Colors.black54,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  placesAsync.when(
                    data: (academies) {
                      if (academies.isEmpty) {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text('No academies found nearby.'),
                        );
                      }
                      return Column(
                        children: academies
                            .map(
                              (academy) => Card(
                                color:
                                    isDark ? AppColors.cardDark : Colors.white,
                                elevation: 0,
                                margin: const EdgeInsets.only(bottom: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  side: BorderSide(
                                    color: isDark
                                        ? Colors.white12
                                        : Colors.black12,
                                  ),
                                ),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(16),
                                  leading: Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: AppColors.green
                                          .withValues(alpha: 0.1),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Text(
                                      academy['icon'].toString(),
                                      style: const TextStyle(fontSize: 20),
                                    ),
                                  ),
                                  title: Text(
                                    academy['name'].toString(),
                                    style: TextStyle(
                                      color: isDark
                                          ? AppColors.textPrimary
                                          : Colors.black87,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  subtitle: Padding(
                                    padding: const EdgeInsets.only(top: 4.0),
                                    child: Text(
                                      '${academy['sport']}  •  ${academy['distance']}',
                                      style: TextStyle(
                                        color: isDark
                                            ? AppColors.textSecondary
                                            : Colors.black54,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                  trailing: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          const Icon(
                                            Icons.star,
                                            color: AppColors.amber,
                                            size: 20,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            academy['rating'].toString(),
                                            style: TextStyle(
                                              color: isDark
                                                  ? AppColors.textPrimary
                                                  : Colors.black87,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(width: 8),
                                      Checkbox(
                                        value: _selectedAcademies.contains(
                                            academy['name'].toString()),
                                        onChanged: (value) {
                                          setState(() {
                                            if (value == true) {
                                              _selectedAcademies.add(
                                                  academy['name'].toString());
                                            } else {
                                              _selectedAcademies.remove(
                                                  academy['name'].toString());
                                            }
                                          });
                                        },
                                        activeColor: AppColors.green,
                                        checkColor: Colors.black,
                                      ),
                                    ],
                                  ),
                                  onTap: () {
                                    showDialog(
                                      context: context,
                                      builder: (context) {
                                        bool isFetching = false;
                                        return StatefulBuilder(
                                          builder: (context, setState) {
                                            return AlertDialog(
                                              backgroundColor: isDark
                                                  ? AppColors.cardDark
                                                  : Colors.white,
                                              title: Text(
                                                  academy['name'].toString()),
                                              content: const Text(
                                                  'Would you like to book a free trial at this academy?'),
                                              actions: [
                                                TextButton(
                                                  onPressed: isFetching
                                                      ? null
                                                      : () => Navigator.pop(
                                                          context),
                                                  child: const Text('Cancel'),
                                                ),
                                                ElevatedButton.icon(
                                                  onPressed: isFetching
                                                      ? null
                                                      : () async {
                                                          setState(() =>
                                                              isFetching =
                                                                  true);

                                                          // Fetch phone dynamically using Riverpod
                                                          final phone =
                                                              await ref.read(
                                                            academyPhoneProvider(
                                                                    academy['name']
                                                                        .toString())
                                                                .future,
                                                          );

                                                          if (phone == null ||
                                                              phone.isEmpty) {
                                                            if (context
                                                                .mounted) {
                                                              setState(() =>
                                                                  isFetching =
                                                                      false);
                                                              ScaffoldMessenger
                                                                      .of(context)
                                                                  .showSnackBar(
                                                                const SnackBar(
                                                                    content: Text(
                                                                        'Phone number not available for this academy.')),
                                                              );
                                                            }
                                                            return;
                                                          }

                                                          final message =
                                                              "Hi! I would like to book a free trial at ${academy['name']}.";
                                                          final url = Uri.parse(
                                                              "https://wa.me/$phone?text=${Uri.encodeComponent(message)}");

                                                          if (await canLaunchUrl(
                                                              url)) {
                                                            await launchUrl(url,
                                                                mode: LaunchMode
                                                                    .externalApplication);
                                                          }
                                                          if (context.mounted) {
                                                            Navigator.pop(
                                                                context);
                                                          }
                                                        },
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        AppColors.green,
                                                    foregroundColor:
                                                        Colors.black,
                                                  ),
                                                  icon: isFetching
                                                      ? const SizedBox(
                                                          width: 16,
                                                          height: 16,
                                                          child:
                                                              CircularProgressIndicator(
                                                                  color: Colors
                                                                      .black,
                                                                  strokeWidth:
                                                                      2),
                                                        )
                                                      : const Icon(Icons.chat),
                                                  label: Text(isFetching
                                                      ? 'Connecting...'
                                                      : 'Book via WhatsApp'),
                                                ),
                                              ],
                                            );
                                          },
                                        );
                                      },
                                    );
                                  },
                                ),
                              ),
                            )
                            .toList(),
                      );
                    },
                    loading: () => const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24.0),
                        child:
                            CircularProgressIndicator(color: AppColors.green),
                      ),
                    ),
                    error: (error, stackTrace) => Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Error loading places: $error',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  if (_selectedAcademies.isNotEmpty) ...[
                    ElevatedButton.icon(
                      onPressed: () {
                        context.push(
                          '/compare',
                          extra: _selectedAcademies.toList(),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.blue,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 54),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      icon: Icon(
                        _selectedAcademies.length > 1
                            ? Icons.compare_arrows
                            : Icons.visibility,
                      ),
                      label: Text(
                        _selectedAcademies.length > 1
                            ? 'Compare ${_selectedAcademies.length} Academies'
                            : 'View Selected Academy',
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                  ElevatedButton.icon(
                    onPressed: () => context.go('/home'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.green,
                      foregroundColor: Colors.black,
                      minimumSize: const Size(double.infinity, 54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    icon: const Icon(Icons.arrow_forward),
                    label: const Text('Continue to App',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: () => context.go('/welcome'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor:
                          isDark ? AppColors.textPrimary : Colors.black87,
                      minimumSize: const Size(double.infinity, 54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      side: BorderSide(
                        color: isDark ? Colors.white24 : Colors.black12,
                      ),
                    ),
                    icon: const Icon(Icons.person_add_outlined),
                    label: const Text('Sign In / Create Account',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            );
          },
          // Error state: E.g., user denied permissions
          error: (error, stackTrace) => Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Error: $error',
              style: const TextStyle(color: Colors.red, fontSize: 16),
              textAlign: TextAlign.center,
            ),
          ),
          // Loading state: Checking permissions and waiting for the first GPS fix
          loading: () => const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Acquiring location...'),
            ],
          ),
        ),
      ),
    );
  }
}
