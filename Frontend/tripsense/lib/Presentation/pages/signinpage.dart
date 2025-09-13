import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:tripsense/Presentation/pages/homepage.dart';
import '../widgets/input_textfield.dart';

class Signinpage extends StatelessWidget {
  Signinpage({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

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
                  ).showSnackBar(SnackBar(content: Text("Failed")));
                }
                if (state is AuthSuccess) {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text("Account Created")));
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => Homepage()),
                  );
                }
              },
              builder: (context, state) {
                if (state is AuthLoading) {
                  return  Center(child: CircularProgressIndicator());

                }
                return Container(
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
                        'Login',
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: screenHeight * 0.05,
                        ),
                      ),
                      //SizedBox(height: screenHeight*0.03),
                      Spacer(),
                      InputtextField(
                        label: 'Email',
                        controller: emailController,
                        passfield: false,
                      ),
                      //SizedBox(height: screenHeight*0.03),
                      Spacer(),
                      InputtextField(
                        label: 'Password',
                        controller: passwordController,
                        passfield: true,
                      ),
                      Align(
                        alignment: Alignment(-0.65, 0),
                        child: TextButton(
                          onPressed: () {},
                          child: Text(
                            "Forgot Password!",
                            style: TextStyle(
                              color: Colors.blue,
                              fontSize: screenHeight * 0.015,
                            ),
                          ),
                        ),
                      ),
                      // SizedBox(height: screenHeight*0.025),
                      Spacer(),
                      TextButton(
                        onPressed: () {
                          final String email = emailController.text.trim();
                          final String password =
                              passwordController.text.trim();
                          context.read<AuthBloc>().add(
                            Signuprequested(email, password),
                          );
                        },
                        style: ButtonStyle(
                          minimumSize: WidgetStateProperty.all(
                            Size(screenWidth * 0.3, screenHeight * 0.05),
                          ),
                          backgroundColor: WidgetStateProperty.all(
                            const Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                        child: Text(
                          "LogIn",
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                      Spacer(),
                    ],
                  ),
                );
              },
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Dont Have an Account?"),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    "Create Account",
                    style: TextStyle(color: Colors.blue),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
