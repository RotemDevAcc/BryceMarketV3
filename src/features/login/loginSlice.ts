import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { logtoServer } from './loginAPI';
import { Message } from '../../Message';

const getUserDetailsFromSessionStorage = () => {
  const storedUserDetails = sessionStorage.getItem('userDetails');
  return storedUserDetails ? JSON.parse(storedUserDetails) : null;
};


export interface UserDetails {
    user_id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    gender?: string;
    dob?: string;
    img?: string;
    is_staff?: boolean;
}

export interface LoginInterface {
    loggedin:boolean,
    token: string,
    userDetails: UserDetails
    
}

const initialState:LoginInterface = {
  loggedin:getUserDetailsFromSessionStorage() ? true : false,
  token:sessionStorage.getItem('token') || "",
  userDetails:getUserDetailsFromSessionStorage() || []
};


export const loginAsync = createAsyncThunk(
    'login/logtoServer',
    async (details: {userName: string; password: string;}) => {
      const response = await logtoServer(details);
      return response.data;
    }
  );


export const loginSlice = createSlice({
  name: 'login',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    user_logout: (state) => {
      state.loggedin = false
      state.userDetails = {} as UserDetails;
      sessionStorage.removeItem("userDetails")
      Message("Logged out Successfully","success")
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        if(!action.payload.access) return
        state.token = action.payload.access;
        if (state.token) {
            state.userDetails = parseJwt(state.token);
            sessionStorage.setItem("token", state.token);
            sessionStorage.setItem("userDetails", JSON.stringify({
                "user_id": state.userDetails.user_id,
                "user": state.userDetails.username,
                "firstname": state.userDetails.firstname || "John",
                "lastname": state.userDetails.lastname || "Doe",
                "email": state.userDetails.email || "johndoe@gmail.com",
                "gender": state.userDetails.gender || "male",
                "dob": state.userDetails.dob,
                "img": state.userDetails.img,
                "is_staff": state.userDetails.is_staff
              }));
              state.loggedin = true
              Message("Welcome Back "+state.userDetails.username,"success")
          } else {
            Message("A Problem has occured, try again later.","error")
            // state.userDetails = {}; // or whatever initial value you want
          }
        // state.userDetails = parseJwt(state.token)
        // sessionStorage.setItem("token", state.token);

      })
  },
});

function parseJwt(token:string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const { user_logout } = loginSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.login.value)`
export const is_user_logged = (state: { login: { loggedin: boolean; }; }) => state.login.loggedin;
export const is_user_staff = (state: { login:  LoginInterface; }) => state.login.userDetails.is_staff;
export const get_user_details = (state: { login: { userDetails: UserDetails; }; }) => state.login.userDetails;
export const get_user_token = (state: { login: { token: string; }; }) => state.login.token;

export default loginSlice.reducer;
