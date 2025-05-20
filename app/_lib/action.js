"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { is } from "date-fns/locale";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error(
      "Invalid national ID format. It should be 6-12 alphanumeric characters."
    );
  const updateData = { nationality, countryFlag, nationalID };
  const guestId = session.user.id; // Get the guest ID from the session
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", guestId);
  if (!guestId) throw new Error("Guest ID is missing in session.");

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
}
// console.log("updateGuest", formData);

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  const newBooking = {
    ...bookingData,
    guestId: session.user.id,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,

    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  // console.log(newBooking);
  const { error } = await supabase.from("bookings").insert([newBooking]);
  // So that the newly created object gets returned!

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  const bookingId = Number(formData.get("bookingId"));
  const guestBookings = await getBookings(session.user.id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not authorized to update this booking.");
  }

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }
  const guestBookings = await getBookings(session.user.id);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not authorized to delete this booking.");
  }
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
  // redirect to the account page after sign in
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
  // redirect to the home page after sign out
}
