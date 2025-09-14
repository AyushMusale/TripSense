import 'package:flutter/material.dart';

class Popularplaceswidget extends StatelessWidget {
  const Popularplaceswidget({super.key});
      
  @override
  Widget build(BuildContext context) {
  final screenHeight = MediaQuery.of(context).size.height;
  //final screenWidth = MediaQuery.of(context).size.width;

  List<String> placesList = ["Gujarat", "Maharashtra", "Kerela", "Ayodhya", "Varanasi" ];
  
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(0, 5, 0, 0),
          child: Text("Popular Places", style: TextStyle(color: Colors.black, fontSize: screenHeight*0.02 ),),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: placesList.length,
            itemBuilder: (context, index){
              int count = index;
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: SizedBox(
                  height: screenHeight*0.08,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(placesList[count]),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },),
        ),
      ],
    );
  }
}