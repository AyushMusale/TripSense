import 'package:flutter/material.dart';
import 'package:tripsense/Presentation/pages/homepage.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';

class Navigationpage extends StatefulWidget {
  const Navigationpage({super.key});

  @override
  State<Navigationpage> createState() => _NavigationpageState();
}

class _NavigationpageState extends State<Navigationpage> {
    final pages = [Homepage(), Signinpage()];
    int currentIndex = 0;
  @override
  Widget build(BuildContext context) {
  final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      appBar:AppBar(
        title: Text("TripSense", style: TextStyle(color: Colors.black, fontSize: screenHeight* 0.03),
        ),
      backgroundColor: Colors.blue),
      body: pages[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index){
          setState(() {
            currentIndex = index;
          });
        },
        items: [BottomNavigationBarItem(label: "Home",icon: Icon(Icons.home)), BottomNavigationBarItem(label: "MyTrips",icon: Icon(Icons.abc))],
      ),
    );
  }
}