import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          await createGuest({ email: user.email, fullName: user.name });
        } // if user does not exist in the database then create a new one
        return true;
      } catch {
        return false;
      }
    },async session({ session, user }) {const guest = await getGuest(session.user.email); // get the guest from the database
      session.user.id = guest.id; // add the id to the session object
      return session; // return the session object
    }
  }, //this !! helps converting any statement ot boolean. it means if user exists then return true otherwise false
  secret: process.env.NEXTAUTH_SECRET, // Also important
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
