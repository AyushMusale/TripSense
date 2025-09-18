import 'package:flutter/material.dart';

class Tripdetailspage extends StatelessWidget {
  final String? id;
  const Tripdetailspage({required this.id,super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(id!),
      ),
    );
  }
}