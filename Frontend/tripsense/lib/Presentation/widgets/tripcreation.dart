import 'package:flutter/material.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripcreation_handler.dart';
import 'package:tripsense/Presentation/bloc/events/tripcreation_event.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:tripsense/Presentation/widgets/tripaddtextfield.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Domain/enities/user.dart';

class TripCreation extends StatelessWidget {
  const TripCreation({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthBloc>().state;
    User ?currentUser;
    if(authState is AuthSuccess){
      currentUser = authState.user;
    }
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    final TextEditingController destinationController = TextEditingController();
    final TextEditingController dateController = TextEditingController();

    return Column(
      children: [
        SizedBox(height: screenHeight * 0.015),

        SizedBox(
          height: screenHeight * 0.05,
          child: Tripaddtextfield(
            lable: "Date",
            controller: dateController,
            isDatefield: true,
          ),
        ),

        SizedBox(height: screenHeight * 0.015),

        SizedBox(
          height: screenHeight * 0.05,
          child: Tripaddtextfield(
            lable: "Destination",
            controller: destinationController,
          ),
        ),

        SizedBox(height: screenHeight * 0.03),

        TextButton(
          onPressed: () {
            context.read<TripcreationHandler>().add(TripcreationEvent(date: dateController.text.trim(), destination: destinationController.text.trim(), email:  currentUser!.email!));
          },
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
    );
  }
}
