"use client";

import { useState, useActionState } from "react";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createReserve } from "@/lib/action";
import { RoomDetailProps, DisabledDateProps } from "@/types/room";
import clsx from "clsx";

const ReserveForm = ({
  room,
  disabledDate,
}: {
  room: RoomDetailProps;
  disabledDate: DisabledDateProps[];
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(tomorrow);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // const [state, formAction, isPending] = useActionState(
  //   createReserve.bind(null, room.id, room.price, startDate, endDate),
  //   null
  // );

  const [state, formAction, isPending] = useActionState(
    createReserve.bind(
      null,
      room.id,
      room.price,
      startDate ?? new Date(),
      endDate ?? addDays(new Date(), 1)
    ),
    null
  );

  const excludeDates = disabledDate.map((item) => ({
    start: new Date(item.startDate),
    end: new Date(item.endDate),
  }));

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Arrival - Departure
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={new Date()}
            excludeDateIntervals={excludeDates}
            dateFormat="dd-MM-yyyy"
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
            wrapperClassName="w-full"
            placeholderText="Pilih tanggal kedatangan dan pulang"
          />
          {state?.messageDate && (
            <p className="text-sm text-red-500 mt-2">{state.messageDate}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Full Name..."
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
          />
          {state?.error?.name && (
            <p className="text-sm text-red-500 mt-2">{state.error.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number..."
            className="py-2 px-4 rounded-md border border-gray-300 w-full"
          />
          {state?.error?.phone && (
            <p className="text-sm text-red-500 mt-2">{state.error.phone}</p>
          )}
        </div>

        <button
          type="submit"
          className={clsx(
            "px-10 py-3 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-500",
            {
              "opacity-50 cursor-not-allowed": isPending,
            }
          )}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Reserve"}
        </button>
      </form>
    </div>
  );
};

export default ReserveForm;
