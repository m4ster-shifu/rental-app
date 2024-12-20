"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";

interface BookingsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const BookingsClient: React.FC<BookingsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string>("");

  const onCancel = useCallback(
    async (id: string) => {
      setDeletingId(id);

      try {
        await axios.delete(`/api/reservations/${id}`);
        toast.success("Reservation cancelled");
        router.refresh();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // We know this is an Axios error, so we can safely access .response
          const errorMessage =
            error.response?.data?.error || "Something went wrong";
          toast.error(errorMessage);
        } else {
          // This handles non-axios errors
          toast.error("An unexpected error occurred");
        }
      } finally {
        setDeletingId("");
      }
    },
    [router]
  );

  return (
    <Container>
      <Heading title="Bookings" subtitle="All of your bookings" />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {reservations.map((reservation: SafeReservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            userData={reservation.user}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel Booking"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default BookingsClient;
