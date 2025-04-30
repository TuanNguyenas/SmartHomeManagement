import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserState from "@/interface/userState.interface";
import Home from "@/interface/home.interface";

const initialState: UserState = {
  homes: [],
  selectedHome: null,
  isAuthenticated: false,
  first_name: null,
  last_name: null,
  user_id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserState>) => {
      state.homes = action.payload.homes;
      state.selectedHome = action.payload.selectedHome;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.user_id = action.payload.user_id;
    },

    setSelectedHome: (state: UserState, action: PayloadAction<any>) => {
      state.selectedHome = action.payload;
    },

    logout: (state) => {
      state.homes = [];
      state.selectedHome = null;
      state.isAuthenticated = false;
      state.first_name = null;
      state.last_name = null;
      state.user_id = null;
    },

    addHome: (state: UserState, action: PayloadAction<Home>) => {
      state.homes.push(action.payload);
    },

    changeDeviceStatus: (
      state: UserState,
      action: PayloadAction<{
        homeId: number;
        deviceId: number;
        status: string;
      }>
    ) => {
      const { homeId, deviceId, status } = action.payload;

      const home = state.homes.find((home) => home.home_id === homeId);
      if (!home) return;

      const device = home.devices.find((device) => device.id === deviceId);
      if (!device) return;

      device.status = status;
    },
  },
});

export const { setUser, logout, setSelectedHome, addHome, changeDeviceStatus } =
  userSlice.actions;

export default userSlice.reducer;
