import 'package:flutter/material.dart';

class TripdeatilsTextfield extends StatelessWidget {
  final TextEditingController controller;
  final bool read;
  final String label;
  const TripdeatilsTextfield({
    required this.label,
    required this.controller,
    required this.read,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      readOnly: read,
      decoration: InputDecoration(
        label: Text(label, style: TextStyle(color: Colors.black)),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black, width: 2),
        ),
      ),
    );
  }
}
