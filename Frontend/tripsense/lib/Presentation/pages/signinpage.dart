import 'package:flutter/material.dart';
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
            Container(
              height: screenHeight*0.48,
              width: screenWidth*0.8,
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
                      fontSize: screenHeight*0.05,
                    ),
                  ),
                  //SizedBox(height: screenHeight*0.03),
                  Spacer(),
                  InputtextField(
                    label: 'Email',
                    controller: emailController,
                    seen: false,
                  ),
                  //SizedBox(height: screenHeight*0.03),
                  Spacer(),
                  InputtextField(
                    label: 'Password',
                    controller: passwordController,
                    seen: true,
                  ),
                  Align(
                    alignment: Alignment(-0.65, 0),
                    child: TextButton(
                      onPressed: () {},
                      child: Text(
                        "Forgot Password!",
                        style: TextStyle(color: Colors.blue, fontSize: screenHeight*0.015),
                      ),
                    ),
                  ),
                 // SizedBox(height: screenHeight*0.025),
                 Spacer(),
                  TextButton(
                    onPressed: () {},
                    style: ButtonStyle(
                      minimumSize: WidgetStateProperty.all(Size(screenWidth*0.3, screenHeight*0.05)),
                      backgroundColor: WidgetStateProperty.all(
                        const Color.fromARGB(255, 0, 0, 0),
                      ),
                    ),
                    child: Text("LogIn", style: TextStyle(color: Colors.white)),
                  ),
                  Spacer(),
                ],
              ),
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
