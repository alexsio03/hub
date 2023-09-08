import { NextApiRequest, NextApiResponse } from "next";
import type { SteamProfile } from "./passport";
import { createRouter, expressWrapper } from "next-connect";
import passport from "./passport";

export type NextSteamAuthApiRequest = NextApiRequest & {user: SteamProfile};

const router = createRouter<NextApiRequest, NextApiResponse>();

passport.initialize()
router.use(expressWrapper(passport.session()))

export default router;