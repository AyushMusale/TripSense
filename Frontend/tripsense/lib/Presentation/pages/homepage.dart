import 'package:flutter/material.dart';
import 'package:tripsense/Presentation/widgets/tripaddtextfield.dart';

class Homepage extends StatelessWidget {
  const Homepage({super.key});
  @override
  Widget build(BuildContext context) {
    final TextEditingController destinationController = TextEditingController();
    final TextEditingController dateController = TextEditingController();
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.blue),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 10),
          child: Column(
            //mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: screenHeight * 0.05),
              Container(
                padding: EdgeInsets.all(10),
                height: screenHeight * 0.2,
                width: screenWidth,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 255, 255, 255),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: const Color.fromARGB(255, 0, 0, 0),
                      blurRadius: 2,
                      blurStyle: BlurStyle.solid,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    SizedBox(
                      height: screenHeight * 0.05,
                      child: Tripaddtextfield(
                        lable: "Date",
                        controller: dateController,
                        isDatefield: true,
                      ),
                    ),

                    SizedBox(height: screenHeight * 0.01),

                    SizedBox(
                      height: screenHeight * 0.05,
                      child: Tripaddtextfield(
                        lable: "Destination",
                        controller: destinationController,
                      ),
                    ),

                    SizedBox(height: screenHeight * 0.01),

                    TextButton(
                      onPressed: () {},
                      style: ButtonStyle(
                        backgroundColor: WidgetStateProperty.all(
                          const Color.fromARGB(255, 255, 43, 43),
                        ),
                        minimumSize: WidgetStateProperty.all(
                          Size(screenWidth * 0.5, screenHeight * 0.045),
                        ),
                      ),
                      child: Text(
                        "ADD TRip",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: screenHeight * 0.02,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: screenHeight * 0.05),

              Container(
                height: screenHeight * 0.2,
                width: screenWidth,
                decoration: BoxDecoration(
                  color: Colors.amber,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black,
                      blurRadius: 2,
                      blurStyle: BlurStyle.solid,
                    ),
                  ],
                ),
              ),

              SizedBox(height: screenHeight * 0.05),

              Container(
                height: screenHeight * 0.2,
                width: screenWidth,
                decoration: BoxDecoration(
                  color: Colors.amber,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black,
                      blurRadius: 2,
                      blurStyle: BlurStyle.solid,
                    ),
                  ],
                ),
              ),

              SizedBox(height: screenHeight * 0.05),

              Container(
                height: screenHeight * 0.2,
                width: screenWidth,
                decoration: BoxDecoration(
                  color: Colors.amber,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black,
                      blurRadius: 2,
                      blurStyle: BlurStyle.solid,
                    ),
                  ],
                ),
              ),
               SizedBox(height: screenHeight * 0.05),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [BottomNavigationBarItem(label: "Home",icon: Icon(Icons.home)), BottomNavigationBarItem(label: "Home",icon: Icon(Icons.abc))],
      ),
    );
  }
}
