export const BASE_URL="https://tc2c-fvaisoutbusiness.customs.gov.az:3535";
export const token=localStorage.getItem("token");


export const getHeaders = () => ({
    accept: "application/json",
    "api-key": token || "",
  });