import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';

// AutoDispose ensures we only fetch when the screen is open, saving API costs.
final placesProvider =
    FutureProvider.autoDispose<List<Map<String, dynamic>>>((ref) async {
  // 1. Get the current location once for the API call
  final position = await Geolocator.getCurrentPosition(
    desiredAccuracy: LocationAccuracy.high,
  );

  // 2. Setup the Google Places API call
  const String apiKey = 'YOUR_GOOGLE_PLACES_API_KEY'; // TODO: Replace this!
  const String url =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    final dio = Dio();
    final response = await dio.get(url, queryParameters: {
      'location': '${position.latitude},${position.longitude}',
      'radius': '5000', // 5 km radius
      'keyword': 'sports academy OR fitness OR gym', // Filtering targets
      'key': apiKey,
    });

    if (response.statusCode == 200 && response.data['status'] == 'OK') {
      final results = (response.data['results'] as List).take(10).toList();

      if (results.isEmpty) return [];

      // 3. Format the top 10 places for the Distance Matrix API
      final destinations =
          results.map((place) => 'place_id:${place['place_id']}').join('|');

      const String distUrl =
          'https://maps.googleapis.com/maps/api/distancematrix/json';
      final distResponse = await dio.get(distUrl, queryParameters: {
        'origins': '${position.latitude},${position.longitude}',
        'destinations': destinations,
        'key': apiKey,
      });

      List<String> distances = List.filled(results.length, 'Nearby');

      if (distResponse.statusCode == 200 &&
          distResponse.data['status'] == 'OK') {
        final rows = distResponse.data['rows'] as List;
        if (rows.isNotEmpty) {
          final elements = rows[0]['elements'] as List;
          for (int i = 0; i < elements.length && i < results.length; i++) {
            if (elements[i]['status'] == 'OK') {
              distances[i] = elements[i]['distance']['text']; // E.g., "2.5 km"
            }
          }
        }
      }

      return List.generate(results.length, (index) {
        final place = results[index];
        return {
          'name': place['name'] ?? 'Unknown Location',
          'sport': 'Sports & Fitness',
          'distance': distances[index],
          'rating': place['rating']?.toString() ?? 'N/A',
          'icon': _getIconForTypes(place['types'] as List?),
        };
      });
    }
  } catch (e) {
    print('Error fetching places: $e');
  }
  return [];
});

// Helper function to map Google Place types to an emoji icon
String _getIconForTypes(List<dynamic>? types) {
  if (types == null) return '📍';

  final typeStrings = types.map((e) => e.toString()).toList();

  if (typeStrings.contains('gym') || typeStrings.contains('health')) {
    return '💪';
  }
  if (typeStrings.contains('stadium') || typeStrings.contains('sports_complex')) {
    return '🏟️';
  }
  if (typeStrings.contains('park')) return '🌳';
  if (typeStrings.contains('school') || typeStrings.contains('university')) {
    return '🏫';
  }
  if (typeStrings.contains('bowling_alley')) return '🎳';

  return '📍'; // Default fallback icon
}
