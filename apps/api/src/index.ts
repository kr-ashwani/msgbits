import App from "./server";
import { testIsOdd } from "@msgbits/utils";

const app = new App();
console.log(testIsOdd(10)); // "The number 10 is even."
app.run();
