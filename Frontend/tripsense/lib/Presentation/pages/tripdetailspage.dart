import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripdetails_handler.dart';
import 'package:tripsense/Presentation/bloc/events/tripdetails_event.dart';
import 'package:tripsense/Presentation/bloc/state/tripdetailsstate.dart';
import 'package:tripsense/Presentation/widgets/tripdeatils.dart';

class Tripdetailspage extends StatefulWidget {
  final String id;
  const Tripdetailspage({required this.id, super.key});

  @override
  State<Tripdetailspage> createState() => _TripdetailspageState();
}

class _TripdetailspageState extends State<Tripdetailspage> {
  final PageController _pageController = PageController();
  int currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    context.read<TripdetailsHandler>().add(Gettripbyidevent(widget.id));
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    List members = ["Ayush", "Abhishekh"];
    List photos = ["image1", "image2"];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Trip Details"),
        backgroundColor: Colors.blue,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        label: Text(""),
        icon: Icon(Icons.edit),
      ),
      body: Center(
        child: BlocBuilder<TripdetailsHandler, Tripdetailsstate>(
          builder: (context, state) {
            if (state is Tripdetailsloading) {
              return const CircularProgressIndicator();
            }
            if (state is Tripdetailssuccess) {
              final trip = state.tripdetails;
              bool read = true;

              TextEditingController dateController = TextEditingController(
                text: trip.date,
              );
              TextEditingController destinationController =
                  TextEditingController(text: trip.destination);
              TextEditingController modeController = TextEditingController(
                text: trip.mode ?? "null",
              );

              return SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        height: screenHeight * 0.3,
                        width: screenWidth,
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: SizedBox(
                          height: screenHeight * 0.3,
                          width: screenWidth,
                          // child: ClipRRect(
                          //   borderRadius: BorderRadius.circular(15),
                          //   child: PageView.builder(
                          //     controller: _pageController,
                          //     itemCount: photos.length,
                          //     onPageChanged: (index) {
                          //       setState(() {
                          //         currentPage = index;
                          //       });
                          //     },
                          //     itemBuilder: (context, index) {
                          //       int currentIndex = index;
                          //       return Center(
                          //         child: Text(photos[currentIndex]),
                          //       );
                          //     },
                          //   ),
                          // ),
                          child: PageView(
                            children: [
                              Container(
                                color: Colors.red,
                                child: Center(child: Text("Page 1")),
                              ),
                              Container(
                                color: Colors.blue,
                                child: Center(child: Text("Page 2")),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: screenHeight * 0.02),
                      Container(
                        height: screenHeight * 0.5,
                        width: screenWidth,
                        decoration: BoxDecoration(
                          //color: const Color.fromARGB(255, 246, 246, 243),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Column(
                          children: [
                            TripdeatilsTextfield(
                              label: "Date",
                              controller: dateController,
                              read: read,
                            ),
                            SizedBox(height: screenHeight * 0.01),
                            TripdeatilsTextfield(
                              label: "Destination",
                              controller: destinationController,
                              read: read,
                            ),
                            SizedBox(height: screenHeight * 0.01),
                            TripdeatilsTextfield(
                              label: "Mode",
                              controller: modeController,
                              read: read,
                            ),
                            SizedBox(height: screenHeight * 0.01),
                            SizedBox(
                              height: screenHeight * 0.15,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                itemCount: members.length,
                                itemBuilder: (context, index) {
                                  int currentIndex = index;
                                  return SizedBox(
                                    height: screenHeight * 0.1,
                                    width: screenWidth * 0.35,
                                    child: Card(
                                      color: Colors.red,
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Spacer(),
                                            Icon(
                                              Icons.donut_large,
                                              size: screenHeight * 0.08,
                                            ),
                                            Spacer(),
                                            Text(members[currentIndex]),
                                            Spacer(),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
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
