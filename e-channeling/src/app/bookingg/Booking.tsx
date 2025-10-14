"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setStep, setPatientDetails, resetBooking } from "@/store/booking/bookingSlice";

