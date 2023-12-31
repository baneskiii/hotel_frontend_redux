import { useEffect, useState } from "react";
import {
  useGetReservationsByDateQuery,
  useGetReservationsQuery,
} from "./reservationsApiSlice";
import { validateReservationFilter } from "../../util/reservationValidation";
import { ReservationFilter } from "./ReservationFilter";
import { ReservationsTable } from "./ReservationsTable";
import { motion as m } from "framer-motion";

const ViewReservations = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [found, setFound] = useState(false);
  const [foundMsg, setFoundMsg] = useState("");

  const { data: reservationsData } = useGetReservationsQuery();

  useEffect(() => {
    if (reservationsData) {
      setReservations(reservationsData);
    }
  }, [reservationsData]);

  const { data: reservationsDataDate } = useGetReservationsByDateQuery({
    dateFrom,
    dateTo,
  });

  const onDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setErrorMessage("");
    setSuccessful(false);
    setFound(false);
    setFoundMsg("");
  };

  const onDateToChange = (e) => {
    setDateTo(e.target.value);
    setErrorMessage("");
    setSuccessful(false);
    setFound(false);
    setFoundMsg("");
  };

  const refresh = () => {
    setReservations(reservationsData);
    setDateFrom("");
    setDateTo("");
    setErrorMessage("");
    setSuccessful(false);
    setFound(false);
    setFoundMsg("");
  };

  const onSubmit = () => {
    const { can, errorMessage } = validateReservationFilter(dateFrom, dateTo);
    if (can) {
      setReservations(reservationsDataDate);
    } else {
      setErrorMessage(errorMessage);
      setSuccessful(true);
      return;
    }
    if (reservationsDataDate == undefined) {
      setErrorMessage(
        "Sistem ne može da nađe rezervacije po zadatoj vrednosti."
      );
      setSuccessful(true);
      return;
    }
    if (reservationsDataDate.length > 0) {
      setFound(true);
      setFoundMsg("Sistem je našao rezervacije po zadatoj vrednosti.");
    } else {
      setErrorMessage(
        "Sistem ne može da nađe rezervacije po zadatoj vrednosti."
      );
      setSuccessful(true);
    }
  };

  return (
    <div className="container mt-4">
      <ReservationFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        errorMessage={errorMessage}
        successful={successful}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        refresh={refresh}
        onSubmit={onSubmit}
        _errorMessage={errorMessage}
        found={found}
        foundMsg={foundMsg}
      ></ReservationFilter>
      <m.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        className="py-4"
      >
        <ReservationsTable reservations={reservations}></ReservationsTable>
      </m.div>
    </div>
  );
};

export default ViewReservations;
