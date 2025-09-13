import 'package:flutter/material.dart';

class InputtextField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final bool seen;
  const InputtextField({required this.label, required this.controller,required this.seen,super.key});

  @override
  Widget build(BuildContext context) {
  final screenWidth = MediaQuery.of(context).size.width;
  final screenHeight = MediaQuery.of(context).size.height;
    return SizedBox(
      height: screenHeight*0.075,
      width: screenWidth*0.6,
      child: TextField(
        obscureText: seen,
        decoration: InputDecoration(
          label: Text(label, style: TextStyle(color: Colors.black),),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Colors.black,
              width: 2,
            ),
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(
              width: 2,
            ),
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
        ),
      ),
    );
  }
}
