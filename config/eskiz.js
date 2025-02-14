import axios from "axios";
import { totp } from "otplib";

totp.options = {step:200, digits:4}

const api = axios.create({
    baseURL: "https://notify.eskiz.uz/api",
});

let eskizToken = null;

async function getEskizToken() {
    try {
        if (eskizToken) return eskizToken;

        const response = await api.post("/auth/login", {
            email: "qosimxushvaxtov78@gmail.com",
            password: "ZPCcnYtUu9n7kF1L3bjatlsp9wbcqPDhPdryQqdf",
        });

        eskizToken = response.data.data.token;
        return eskizToken;
    } catch (error) {
        console.error("Eskiz token olishda xatolik:", error.response?.data || error.message);
        return null;
    }
}

async function sendOTP(phone, otp) {
    try {
        const token = await getEskizToken();
        if (!token) {
            console.error("Eskiz token olinmadi, OTP jo'natib bo'lmadi!");
            return;
        }

        const smsResponse = await api.post(
            // "/message/sms/send",
            {
                mobile_phone: phone,
                message: ` Bu Eskiz dan test`,
                from: "4546",
                expire_time : 300
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // console.log(`Eskiz OTP jo'natildi: ${smsResponse.data.message}`);
    } catch (error) {
        console.error("Eskiz SMS yuborishda xatolik:", error.response?.data || error.message);
    }
}

export { sendOTP };