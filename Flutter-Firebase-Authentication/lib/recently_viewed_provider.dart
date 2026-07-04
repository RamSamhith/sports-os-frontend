import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'shared_prefs_provider.dart';

class RecentlyViewedNotifier extends StateNotifier<List<String>> {
  final SharedPreferences prefs;
  static const _key = 'recently_viewed_academies';

  RecentlyViewedNotifier(this.prefs) : super([]) {
    _loadFromPrefs();
  }

  void _loadFromPrefs() {
    final list = prefs.getStringList(_key);
    if (list != null && list.isNotEmpty) {
      state = list;
    } else {
      // Mock data for initial view so the user can see the UI!
      state = ['1', '2'];
    }
  }

  void _saveToPrefs() {
    prefs.setStringList(_key, state);
  }

  void addViewed(String academyId) {
    if (academyId.trim().isEmpty) return;

    final currentList = List<String>.from(state);
    currentList.remove(academyId); // Remove if exists
    currentList.insert(0, academyId); // Insert at top

    if (currentList.length > 15) {
      currentList.removeLast(); // Keep top 15
    }

    state = currentList;
    _saveToPrefs();
  }
}

final recentlyViewedProvider = StateNotifierProvider<RecentlyViewedNotifier, List<String>>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return RecentlyViewedNotifier(prefs);
});
