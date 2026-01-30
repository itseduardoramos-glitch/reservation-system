import { useEffect, useState } from "react";
import { ReservationsBaseService } from "../services/reservations.service";
import {socket} from "../socket";
import type { ReservationEvent } from "../interfaces/socket.mode";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function Reservations() {
    //Hook that stores the reservationId once it's reserved in the database
    const [reservationId, setReservationId] = useState<number>(); 
    //Hook that handles the error|success message returned if the date was already reserved
    const [message, setMessage] = useState<string>('');
    //Hook that handles the time to show the message
    const [visible, setVisible] = useState<boolean>(false);
    //Hook that handles message type received
    const [messageType, setMessageType] = useState<string>('');
    //Hook used to store the selected date
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    //Hook used to store the full list of blocked dates
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);
    //Hook used prevent the reservation to be deleted after it was confirmed
    const [reservationConfirmed, sertReservationConfirmed] = useState<boolean>(false);


    useEffect(() => {
        socket.on("reservation:created", ({ date }: { date: string }) => {
            console.log("fecha bloqueada", date);
            setBlockedDates(prev => [...prev, toDate(date)]);
        });

        socket.on("reservation:released", ({ date }: { date: string }) => {
            setBlockedDates(prev =>
            prev.filter(d => d.getTime() !== new Date(date).getTime())
        );
        })

        return () => {
            socket.off("reservation:created");
            socket.off("reservation:released");
        };
    }, []);


    /**
     * useEffect that runs a function when the page is closed or abandonded to delete the reservation
     */
    useEffect(() => {
        const onChangeVisibility = () => {
            if (document.visibilityState === "hidden" && reservationId && reservationConfirmed == false) {
            const token = localStorage.getItem("token");

            fetch("http://localhost:3000/reservations/release-slot", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: reservationId }),
                keepalive: true, // 👈 clave
            });
            }
        };

        document.addEventListener("visibilitychange", onChangeVisibility);

        return () => {
            document.removeEventListener("visibilitychange", onChangeVisibility);
        };
    }, [reservationId, reservationConfirmed]);

    /**
     * useEffect that runs a  setTimeout to show the message for 5 seconds
     */
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    const toDate = (dateStr: string): Date => {
        const [y, m, d] = dateStr.split("-");
        return new Date(Number(y), Number(m) - 1, Number(d));
    };



    /**
     * Function to validate if the selected date is available
     * @param date Selected date
     */
    const validateDate = async(date: Date) => {
        if(!date) return;

        const formatted = date.toISOString().split("T")[0];

        if (blockedDates.includes(date)) {
            alert("Fecha no disponible");
            return;
        }

        setSelectedDate(date);
        const response = await ReservationsBaseService.postDate(formatted, reservationId || null);

        if(!response.id){
            setMessage(response.message);
            setMessageType('danger');
            return;
        }

        setReservationId(response.id);
        setMessage("Fecha apartada temporalmente con èxito");
        setMessageType('success');

    }


    const handleSubmit = async(e: any) => {
        e.preventDefault();

        const form = e.target;

        const formData = {
            reservationId: reservationId,
            tipoServicio: form.serviceType.value,
            celular: form.phone.value
        };

        const response = await ReservationsBaseService.postReservation(formData);

        if(response.ok) {
            sertReservationConfirmed(true);
            setMessage("La reservacion se hizo correctamente");
        }

        form.reset();
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="serviceType">Tipo de servicio solicitado:</label>
                    <input type="text" className="form-control" name="serviceType" id="serviceType" />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Fecha:</label>
                    <div>
                        <DatePicker
                        selected={selectedDate}
                        onChange={(date: any) => {
                            setSelectedDate(date);
                            if (date) validateDate(date);
                        }}
                        excludeDates={blockedDates}
                        minDate={new Date()}
                        inline
                    />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Celular:</label>
                    <input type="text" className="form-control" name="phone" id="phone" />
                </div>
                <button type="submit" className="btn btn-primary">Reservar</button>
            </form>
            {
                (message && visible) && (
                    <div className={`alert alert-${messageType}`}>
                        {message}
                    </div>
                )
            }
        </div>
    )
}

export default Reservations