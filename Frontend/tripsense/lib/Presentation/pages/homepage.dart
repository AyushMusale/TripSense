import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/widgets/mapwidgets.dart';
import 'package:tripsense/Presentation/widgets/popularplaceswidget.dart';
import 'package:tripsense/Presentation/widgets/tripcreation.dart';
import 'package:tripsense/Presentation/bloc/state/tripcreation_state.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripcreation_handler.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return BlocConsumer<TripcreationHandler, TripcreationState>(
      listener: (context, state) {
        if (state is TripCreationInproccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [Text("Creating"), CircularProgressIndicator()],
              ),
            ),
          );
        }
        if (state is TripCreationSuccess) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text("Trip Added")));
        }
        if (state is TripCreationFailed) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text("Could Not Add Trip")));
        }
      },
      builder: (context, state) {
        return Scaffold(
          body: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: Column(
                //mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(height: screenHeight * 0.05),

                  //Container for Trip Creation
                  Container(
                    padding: EdgeInsets.all(10),
                    height: screenHeight * 0.25,
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
                    child: TripCreation(),
                  ),

                  SizedBox(height: screenHeight * 0.05),
                  //container for MAP
                  Container(
                    height: screenHeight * 0.3,
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
                    child: Mapwidgets(),
                  ),

                  SizedBox(height: screenHeight * 0.05),
                  //Container for Popular Places
                  Container(
                    height: screenHeight * 0.3,
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
                    child: Popularplaceswidget(),
                  ),

                  SizedBox(height: screenHeight * 0.05),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
