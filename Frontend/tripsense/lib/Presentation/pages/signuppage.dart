import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:tripsense/Presentation/pages/navigationpage.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';
import '../widgets/input_textfield.dart';

class Signuppage extends StatelessWidget {
  Signuppage({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
    final TextEditingController passwordconfirmController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if(state is AuthSuccess){
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Account Created"),),);
          Navigator.pop(context);
        }
        if(state is AuthFailure){
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.error),),);
        }
      },
      builder: (context, state) {
        if(state is AuthLoading){
          return Scaffold(
            body: CircularProgressIndicator(),
          );
        }
        return Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                BlocConsumer<AuthBloc, AuthState>(
                  listener: (context, state) {
                    if (state is AuthFailure) {
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text(state.error)));
                    }
                    if (state is AuthSuccess) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("Account Created")),
                      );
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => Navigationpage(),
                        ),
                      );
                    }
                  },
                  builder: (context, state) {
                    if (state is AuthLoading) {
                      return Center(child: CircularProgressIndicator());
                    }
                    return Column(
                      //main container
                      children: [
                        Container(
                          height: screenHeight * 0.48,
                          width: screenWidth * 0.8,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(
                                color: const Color.fromARGB(255, 75, 74, 74),
                                blurRadius: 10.0,
                                blurStyle: BlurStyle.solid,
                              ),
                            ],
                          ),
                          child: Column(
                            // mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              //SizedBox(height: screenHeight*0.02),
                              Spacer(),
                              Text(
                                'Create Account',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: screenHeight * 0.04,
                                ),
                              ),
                              //SizedBox(height: screenHeight*0.03),
                              Spacer(),

                              //email text field
                              InputtextField(
                                label: 'Email',
                                controller: emailController,
                                passfield: false,
                              ),
                              //SizedBox(height: screenHeight*0.03),
                              Spacer(),

                              //password text field
                              InputtextField(
                                label: 'Password',
                                controller: passwordController,
                                passfield: true,
                              ),
                              Spacer(),
                              InputtextField(
                                label: 'Password',
                                controller: passwordconfirmController,
                                passfield: true,
                              ),
                              // SizedBox(height: screenHeight*0.025),
                              Spacer(),
                              TextButton(
                                onPressed: () {
                                  final String email =
                                      emailController.text.trim();
                                  final String password =
                                      passwordController.text.trim();
                                  context.read<AuthBloc>().add(
                                    Signuprequested(email, password),
                                  );
                                },
                                style: ButtonStyle(
                                  minimumSize: WidgetStateProperty.all(
                                    Size(
                                      screenWidth * 0.3,
                                      screenHeight * 0.05,
                                    ),
                                  ),
                                  backgroundColor: WidgetStateProperty.all(
                                    const Color.fromARGB(255, 0, 0, 0),
                                  ),
                                ),
                                child: Text(
                                  "SignUp",
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              Spacer(),
                            ],
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text("Alreadty Have an Account?"),
                            TextButton(
                              onPressed: () {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) {
                                      return Signinpage();
                                    },
                                  ),
                                );
                              },
                              child: Text(
                                "Create Account",
                                style: TextStyle(color: Colors.blue),
                              ),
                            ),
                          ],
                        ),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
