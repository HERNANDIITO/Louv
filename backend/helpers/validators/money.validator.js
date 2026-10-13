import { z } from "zod"
const Money = z.string().regex(/^\d+(\.\d{1,2})?$/);
export default Money;