import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user: null,
  user_id: null,
  email: "",
  error: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
  },
});

// Reducer
export default slice.reducer;

const apiRequest = async (
  url,
  data,
  dispatch,
  successAction,
  failureMessage
) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || failureMessage || error.message;
    dispatch(showSnackbar({ severity: "error", message }));
    throw error; // Rethrow error to handle it in the calling function
  }
};

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/reset-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/forgot-password",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      });
  };
}

export function LoginUser(formValues) {
  // Make API call here

  return async (dispatch, getState) => {
    
      dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      await axios
        .post(
          "/auth/login",
          {
            ...formValues,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          console.log(response);
          dispatch(
            slice.actions.logIn({
              isLoggedIn: true,
              token: response.data.token,
              user_id: response.data.user_id,
            })
          );
          window.localStorage.setItem("user_id", response.data.user_id);
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: false })
          );
        })
        .catch(function (error) {
          console.log(error);
          dispatch(showSnackbar({ severity: "error", message: error.message }));
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: true })
          );
        });
    
  };
 
}


export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.signOut());
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {

    {
      dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
  
      await axios
        .post(
          "/auth/register",
          {
            ...formValues,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then ((response)=> {
          console.log(response);
          dispatch(
            slice.actions.updateRegisterEmail({ email: formValues.email })
          );
  
          dispatch(
            showSnackbar({ severity: "success", message: response.data.message })
          );
          dispatch(
            slice.actions.updateIsLoading({ isLoading: false, error: false })
          );
        })
        .catch ((error)=> {
          console.log(error);
          dispatch(showSnackbar({ severity: "error", message: error.message }));
          dispatch(
            slice.actions.updateIsLoading({ error: false, isLoading: true })
          );
        })
        .finally(() => {
          if (!getState().auth.error) {
            window.location.href = "/auth/verify";
          }
        });
    };
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const data = await apiRequest(
        "/auth/register",
        formValues,
        dispatch,
        "Registration successful"
      );
      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(showSnackbar({ severity: "success", message: data.message }));
      if (!getState().auth.error) {
        window.location.href = "/auth/verify";
      }
    } catch {
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };

  {
    /**/
  }
}

export function VerifyEmail(formValues) {
  {
    return async (dispatch) => {

      dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    await axios
      .post(
        "/auth/verify",
        {
          ...formValues,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
       // dispatch(slice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", response.data.user_id);
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        dispatch(
          showSnackbar({ severity: "success", message: response.data.message })
        );
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: false })
        );
      })
      .catch(function (error) {
        console.log(error);
        dispatch(showSnackbar({ severity: "error", message: error.message }));
        dispatch(
          slice.actions.updateIsLoading({ error: true, isLoading: false })
        );
      });
      {/*dispatch(
        slice.actions.updateIsLoading({ isLoading: true, error: false })
      );
      try {
        const data = await apiRequest(
          "/auth/verify",
          formValues,
          dispatch,
          "Verification successful"
        );
        dispatch(slice.actions.updateRegisterEmail({ email: "" }));
        window.localStorage.setItem("user_id", data.user_id);
        dispatch(slice.actions.logIn({ isLoggedIn: true, token: data.token }));
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      } catch {
        dispatch(
          slice.actions.updateIsLoading({ isLoading: false, error: true })
        );
      }*/}
    };

    {
      /*
    */
    }
  }
}
