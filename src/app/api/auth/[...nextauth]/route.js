import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from 'next/server';
import User from "@/app/models/User";
import "dotenv/config";
import connectToDatabase from "@/app/lib/mongodb";
const handle=  NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    
callbacks: {
    async session({ session, token }) {
      await connectToDatabase();
  
      // Add the user's ID to the session object
      const sessionUser = await User.findOne({
        email: session.user.email,
        username: session.user.name,
      });
  
      session.user.id = sessionUser?._id;
      return session;
    },
    async jwt({ token, user }) {
      // Persist the user's ID to the token object
      if (user) {
        token.id = user._id;
      }
      return token;
    },
    async signIn({ profile }) {
      try {
        await connectToDatabase();
  
        // Check if the user already exists in the database
        const userExists = await User.findOne({
          email: profile.email,
          username: profile.name,
        });
        
        // If the user does not exist, create a new user record
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name,
            password: profile.at_hash, // Be cautious with storing passwords directly
          });
        }
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
});

export { handle as GET, handle as POST };