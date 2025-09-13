import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState>{
  final Signupusecase _signinusecase;
  AuthBloc(this._signinusecase): super(AuthInitial()){
    on<Signinrequested>((event, emit) async{
      emit(AuthLoading());
      try{
        final res = await _signinusecase.execute(event.email, event.password);
        final status = res.status;
        if(status == 'success'){
          emit(AuthSuccess(res));
        }
        else if (status == 'error'){
          emit(AuthFailure());
        }
      }
      catch(e){
        emit(AuthFailure());
      }
    });
  }
}