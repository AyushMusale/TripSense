import 'package:flutter/material.dart';

class Tripaddtextfield extends StatefulWidget {
  final TextEditingController controller;
  final String lable;
  final bool isDatefield;
  const Tripaddtextfield({
    required this.lable,
    required this.controller,
    this.isDatefield = false,
    super.key,
  });

  @override
  State<Tripaddtextfield> createState() => _TripaddtextfieldState();
}

class _TripaddtextfieldState extends State<Tripaddtextfield> {
  @override
  Widget build(BuildContext context) {
    Future<void> datePicker() async {
      DateTime? pickedDate = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime(2024),
        lastDate: DateTime(2027),
      );

      if (pickedDate != null) {
        setState(() {
          String year = pickedDate.year.toString();
          String month = pickedDate.month.toString();
          String day = pickedDate.day.toString();
          widget.controller.text = "$day / $month / $year";
        });
      }
    }

    return TextField(
      controller: widget.controller,
      decoration: InputDecoration(
        label: Text(widget.lable, style: TextStyle(color: Colors.black)),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(width: 2),
          borderRadius: BorderRadius.circular(10),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: const Color.fromARGB(255, 61, 60, 60)),
          borderRadius: BorderRadius.circular(10),
        ),
        suffixIcon: IconButton(
          onPressed: () {
            datePicker();
          },
          icon: widget.isDatefield? Icon(Icons.calendar_today) : Icon(null),
        ),

        //
      ),
    );
  }
}
