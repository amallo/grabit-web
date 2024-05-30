import { combineReducers } from "@reduxjs/toolkit";
import { messagesSlice } from "./message/models/message.reducer";

export const coreReducer = combineReducers({
    message: messagesSlice.reducer,
  });
  