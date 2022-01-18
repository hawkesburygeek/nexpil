console.log(" === process.env ====> ", process.env)
export const server = {
  // serverURL: "http://nexpil.test/api/"

  // serverURL: "http://127.0.0.1:8000/api/",
  // domainURL: "http://127.0.0.1:8000",

  // serverURL: process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/" : "https://twilio.nexp.xyz/api/",
  // domainURL: process.env.NODE_ENV === 'development' ? "http://localhost:8000" : "https://twilio.nexp.xyz",

  serverURL: "https://twilio.nexp.xyz/api/",
  domainURL: "https://twilio.nexp.xyz/",

  // serverURL: process.env.REACT_APP_API_URL,
  // domainURL: process.env.REACT_APP_DOMAIN_URL,
}
