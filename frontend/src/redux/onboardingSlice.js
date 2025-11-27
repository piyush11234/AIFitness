import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to submit onboarding data
export const submitOnboarding = createAsyncThunk(
  "onboarding/submit",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); // assume JWT stored
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/auth/onboarding",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    preferredWorkoutType: [],
    dietType: "",
    allergies: [],
    step: 1,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    nextStep: (state) => {
      if (state.step < 5) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    resetOnboarding: (state) => {
      Object.assign(state, {
        age: "",
        gender: "",
        height: "",
        weight: "",
        goal: "",
        activityLevel: "",
        preferredWorkoutType: [],
        dietType: "",
        allergies: [],
        step: 1,
        loading: false,
        error: null,
        success: false,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to submit onboarding";
      });
  },
});

export const { updateField, nextStep, prevStep, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
