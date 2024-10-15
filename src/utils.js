import crypto from "crypto";

const generateId = () => crypto.randomUUID();

export default generateId;
