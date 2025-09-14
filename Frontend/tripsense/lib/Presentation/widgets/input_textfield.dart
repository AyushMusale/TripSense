import 'package:flutter/material.dart';

class InputtextField extends StatefulWidget {
  final String label;
  final TextEditingController controller;
  final bool passfield;
  const InputtextField({required this.label, required this.controller,required this.passfield,super.key});

  @override
  State<InputtextField> createState() => _InputtextFieldState();
}

class _InputtextFieldState extends State<InputtextField> {
   bool seen = true;
  @override
  Widget build(BuildContext context) {
  final screenWidth = MediaQuery.of(context).size.width;
  final screenHeight = MediaQuery.of(context).size.height;
    return SizedBox(
      height: screenHeight*0.075,
      width: screenWidth*0.6,
      child: TextField(
        controller: widget.controller,
        obscureText:  widget.passfield? seen : false,
        decoration: InputDecoration(
          label: Text(widget.label, style: TextStyle(color: Colors.black),),
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
          suffixIcon: widget.passfield? IconButton(onPressed: (){
            setState(() {
              seen = !seen;
            });
          }, icon: !seen? Icon(Icons.visibility): Icon(Icons.visibility_off)) : null
        ),
      ),
    );
  }
}
