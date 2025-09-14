import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
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
    return Scaffold(
      appBar:AppBar(backgroundColor: Colors.blue),
      body: pages[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index){
          setState(() {
            currentIndex = index;
          });
        },
        items: [BottomNavigationBarItem(label: "Home",icon: Icon(Icons.home)), BottomNavigationBarItem(label: "Home",icon: Icon(Icons.abc))],
      ),
    );
  }
}