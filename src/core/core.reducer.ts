import { combineReducers } from "@reduxjs/toolkit";
import { grabSlice } from "./message/models/grab.reducer";
import { dropSlice } from "./message/models/drop.reducer";

export const coreReducer = combineReducers({
    grab: grabSlice.reducer,
    drop: dropSlice.reducer
  });
  