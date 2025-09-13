import 'package:flutter/material.dart';

class TrialPage extends StatelessWidget {
  const TrialPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("checking if it changes locally"),
            Text("another")
          ],
        ),
      ),
    );
  }
}