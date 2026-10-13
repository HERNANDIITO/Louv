import { z } from "zod"
const Decimal128 = z.string().regex(/^-?\d+(\.\d{1,7})?$/);;
export default Decimal128;