import { z } from "zod";
const ObjectId = z.string().trim().regex(/^[a-f\d]{24}$/i);
export default ObjectId