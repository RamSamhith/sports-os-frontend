import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ParentSignUpScreen extends StatefulWidget {
  const ParentSignUpScreen({super.key});

  @override
  State<ParentSignUpScreen> createState() => _ParentSignUpScreenState();
}

class _ParentSignUpScreenState extends State<ParentSignUpScreen> {
  final _formKey = GlobalKey<FormState>();

  // Parent details
  String? _parentFullName;
  String? _parentPhoneNumber;
  bool _isLoading = false;

  // State variables for the form
  int? _totalChildren;
  int _childrenJoining = 1; // Default to 1 child joining

  // Lists to store dynamic text controllers for children's details
  final List<TextEditingController> _nameControllers = [];
  final List<TextEditingController> _ageControllers = [];

  @override
  void initState() {
    super.initState();
    _initializeControllers();
  }

  /// Initializes or rebuilds the controllers based on the number of children joining
  void _initializeControllers() {
    // Dispose existing controllers to prevent memory leaks
    for (var controller in _nameControllers) {
      controller.dispose();
    }
    for (var controller in _ageControllers) {
      controller.dispose();
    }

    _nameControllers.clear();
    _ageControllers.clear();

    // Create new controllers based on _childrenJoining (max 5)
    for (int i = 0; i < _childrenJoining; i++) {
      _nameControllers.add(TextEditingController());
      _ageControllers.add(TextEditingController());
    }
  }

  /// Updates the UI and regenerates controllers when dropdown changes
  void _updateChildrenJoining(int? value) {
    if (value != null && value != _childrenJoining) {
      setState(() {
        _childrenJoining = value;
        _initializeControllers();
      });
    }
  }

  @override
  void dispose() {
    // Dispose all controllers when the widget is removed from the widget tree
    for (var controller in _nameControllers) {
      controller.dispose();
    }
    for (var controller in _ageControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  /// Handles form validation and submission
  void _submitForm() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();

      setState(() {
        _isLoading = true;
      });

      // Collect child data
      List<Map<String, dynamic>> childrenData = [];
      for (int i = 0; i < _childrenJoining; i++) {
        childrenData.add({
          'name': _nameControllers[i].text.trim(),
          'age': int.tryParse(_ageControllers[i].text.trim()) ?? 0,
        });
      }

      // TODO: Pass the data to your auth provider or API layer here
      print("Parent Name: $_parentFullName");
      print("Parent Phone: $_parentPhoneNumber");
      print("Total Children: $_totalChildren");
      print("Children Joining: $_childrenJoining");
      print("Children Details: $childrenData");

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Processing Sign Up...')),
      );

      // Add a slight delay so the user can read the SnackBar
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        // Relocate to the home page
        context.go('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Parent Sign Up'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Parent Full Name
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter your full name';
                  }
                  return null;
                },
                onSaved: (value) => _parentFullName = value?.trim(),
              ),
              const SizedBox(height: 24),

              // Parent Phone Number
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter your phone number';
                  }
                  return null;
                },
                onSaved: (value) => _parentPhoneNumber = value?.trim(),
              ),
              const SizedBox(height: 32),

              // Total Children Input
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'How many children do you have?',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.family_restroom),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a number';
                  }
                  if (int.tryParse(value.trim()) == null) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },
                onSaved: (value) =>
                    _totalChildren = int.tryParse(value?.trim() ?? '0'),
              ),
              const SizedBox(height: 24),

              // Children Joining Dropdown (Limited to 5)
              DropdownButtonFormField<int>(
                value: _childrenJoining,
                decoration: const InputDecoration(
                  labelText:
                      'How many children do you want to join or discover the platform?',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person_add),
                ),
                items: List.generate(5, (index) {
                  int val = index + 1;
                  return DropdownMenuItem(
                    value: val,
                    child: Text(val.toString()),
                  );
                }),
                onChanged: _updateChildrenJoining,
              ),
              const SizedBox(height: 32),

              // Dynamic Fields for each child
              if (_childrenJoining > 0) ...[
                Text(
                  'Children Details',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                ...List.generate(_childrenJoining, (index) {
                  return Card(
                    elevation: 2,
                    margin: const EdgeInsets.only(bottom: 20),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Child ${index + 1}',
                            style: Theme.of(context)
                                .textTheme
                                .titleMedium
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _nameControllers[index],
                            textInputAction: TextInputAction.next,
                            decoration: InputDecoration(
                              labelText: 'Child ${index + 1} Name',
                              border: const OutlineInputBorder(),
                              prefixIcon: const Icon(Icons.person_outline),
                            ),
                            validator: (value) =>
                                value == null || value.trim().isEmpty
                                    ? 'Please enter a name'
                                    : null,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _ageControllers[index],
                            textInputAction: index == _childrenJoining - 1
                                ? TextInputAction.done
                                : TextInputAction.next,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Child ${index + 1} Age',
                              border: const OutlineInputBorder(),
                              prefixIcon: const Icon(Icons.cake_outlined),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Please enter an age';
                              }
                              if (int.tryParse(value.trim()) == null) {
                                return 'Please enter a valid number';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ],

              const SizedBox(height: 24),

              // Submit Button
              ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text(
                        'Complete Sign Up',
                        style: TextStyle(fontSize: 18),
                      ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
