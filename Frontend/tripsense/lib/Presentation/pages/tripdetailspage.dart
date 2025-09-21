import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripdetails_handler.dart';
import 'package:tripsense/Presentation/bloc/events/tripdetails_event.dart';
import 'package:tripsense/Presentation/bloc/state/tripdetailsstate.dart';

class Tripdetailspage extends StatefulWidget {
  final String id;
  const Tripdetailspage({required this.id, super.key});

  @override
  State<Tripdetailspage> createState() => _TripdetailspageState();
}

class _TripdetailspageState extends State<Tripdetailspage> {
  @override
  void initState() {
    super.initState();
    context.read<TripdetailsHandler>().add(Gettripbyidevent(widget.id));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Trip Details")),
      body: Center(
        child: BlocBuilder<TripdetailsHandler, Tripdetailsstate>(
          builder: (context, state) {
            if (state is Tripdetailsloading) {
              return const CircularProgressIndicator();
            }
            if (state is Tripdetailssuccess) {
              final trip = state.tripdetails;
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Destination: ${trip.destination}"),
                  Text("Date: ${trip.date}"),
                  if (trip.mode != null) Text("Mode: ${trip.mode}"),
                ],
              );
            }
            if (state is Tripdetailsfailure) {
              return const Text("Failed to load trip details");
            } else {
              return const SizedBox(); // Empty state
            }
          },
        ),
      ),
    );
  }
}
