import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/mytrips_handler.dart';
import 'package:tripsense/Presentation/bloc/state/mytrips_state.dart';

class MytripsPage extends StatelessWidget {
  const MytripsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return BlocConsumer<MytripsHandler, MytripsState>(
      listener: (context, state) {
        if (state is MyTripsFailureState) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text("Trips-not-found")));
        }
      },
      builder: (context, state) {
        List<Map<String, String>> list = [];
        if (state is MyTripsLoadingState) {
          return Scaffold(body: CircularProgressIndicator());
        }
        if (state is MyTripsSuccessState) {
          list = state.mytrips.mytripslist;
        }
        return Scaffold(
          appBar: AppBar(
            title: Text(
              "MyTrips",
              style: TextStyle(
                color: Colors.black,
                fontSize: screenHeight * 0.03,
              ),
            ),
            backgroundColor: Colors.blue,
          ),
          body:
              list.isEmpty
                  ? const Center(child: Text("Trips Not found"))
                  : ListView.builder(
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      int currentIndex = index;
                      return SizedBox(
                        height: screenHeight * 0.12,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: GestureDetector(
                            onTap: () {
                              final id = list[currentIndex]['id'];
                              context.push('/tripdetails/$id');
                            },
                            child: Card(
                              child: Column(
                                children: [
                                  Text(list[currentIndex]['destination']!),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
        );
      },
    );
  }
}
