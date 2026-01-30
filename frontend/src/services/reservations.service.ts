// const API_URL = import.meta.env.CINEMA_API_URL;
const API_URL: string = "http://localhost:3000";

/**
 * Function to save the date
 * @param date date selected
 * @returns response wether it was succesful or not
 */
const postDate = async(date: string, revertationId: number | null): Promise<any> => {
    const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ date: date, reservationId: revertationId })
    });
    const data = await response.json();
    return data;
}

const postReservation = async(formData: any): Promise<any> => {
    const response = await fetch(`${API_URL}/reservations/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ form: formData })
    });
    const data = await response.json();
    return data;
}

export const ReservationsBaseService = {
    postDate,
    postReservation
};