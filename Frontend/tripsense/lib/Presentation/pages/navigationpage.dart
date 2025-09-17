import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:tripsense/Data/datasource/routes/go_route_constants.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:tripsense/Presentation/pages/homepage.dart';
import 'package:tripsense/Presentation/pages/mytripspage.dart';
import 'package:tripsense/Data/datasource/routes/go_router.dart';

class Navigationpage extends StatefulWidget {
  const Navigationpage({super.key});

  @override
  State<Navigationpage> createState() => _NavigationpageState();
}

class _NavigationpageState extends State<Navigationpage> {
  final pages = [Homepage(), MytripsPage()];
  int currentIndex = 0;
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        if(state is AuthLoading){
          return Scaffold(body: Center(child: CircularProgressIndicator(),),);
        }
        if(state is AuthInitial){
          context.pushReplacementNamed(Routes.signinpage);
        }
        return Scaffold(
          appBar: AppBar(
            title: Text(
              "TripSense",
              style: TextStyle(
                color: Colors.black,
                fontSize: screenHeight * 0.03,
              ),
            ),
            actions: [
              IconButton(
                onPressed: () {
                  context.read<AuthBloc>().add(SignOutrequested());
                },
                icon: Icon(Icons.logout),
              ),
            ],
            backgroundColor: Colors.blue,
          ),
          body: pages[currentIndex],
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: currentIndex,
            onTap: (index) {
              setState(() {
                currentIndex = index;
              });
            },
            items: [
              BottomNavigationBarItem(label: "Home", icon: Icon(Icons.home)),
              BottomNavigationBarItem(label: "MyTrips", icon: Icon(Icons.abc)),
            ],
          ),
        );
      },
    );
  }
}
