import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'shared_prefs_provider.dart';

class RecentSearchesNotifier extends StateNotifier<List<String>> {
  final SharedPreferences prefs;
  static const _key = 'recent_searches';

  RecentSearchesNotifier(this.prefs) : super([]) {
    _loadFromPrefs();
  }

  void _loadFromPrefs() {
    final list = prefs.getStringList(_key);
    if (list != null) {
      state = list;
    }
  }

  void _saveToPrefs() {
    prefs.setStringList(_key, state);
  }

  void addSearch(String query) {
    if (query.trim().isEmpty) return;
    
    // Remove if exists to push to front
    final currentList = List<String>.from(state);
    currentList.removeWhere((q) => q.toLowerCase() == query.trim().toLowerCase());
    
    // Add to front
    currentList.insert(0, query.trim());
    
    // Keep only top 10
    if (currentList.length > 10) {
      currentList.removeLast();
    }
    
    state = currentList;
    _saveToPrefs();
  }

  void removeSearch(String query) {
    final currentList = List<String>.from(state);
    currentList.remove(query);
    state = currentList;
    _saveToPrefs();
  }

  void clearSearches() {
    state = [];
    _saveToPrefs();
  }
}

final recentSearchesProvider = StateNotifierProvider<RecentSearchesNotifier, List<String>>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return RecentSearchesNotifier(prefs);
});
