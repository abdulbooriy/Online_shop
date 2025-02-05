import axios from "axios";

const api = axios.create({
   baseURL: "https://notify.eskiz.uz/api",
});

async function sendOTP(phone, otp) {
   try {
      // 1️ **Eskizga avtorizatsiya qilish (yangi token olish)**
      const loginResponse = await api.post("/auth/login", {
         email: "qosimxushvaxtov78@gmail.com",
         password: "ZPCcnYtUu9n7kF1L3bjatlsp9wbcqPDhPdryQqdf",
      });

      const token = loginResponse.data.data.token; //  Token olish

      // 2️ **OTP xabarini jo‘natish**
      const smsResponse = await api.post(
         "/message/sms/send",
         {
            mobile_phone: phone,
            message: ` Bu Eskiz dan test`,
            from: "4546",
         },
         {
            headers: { Authorization: `Bearer ${token}` }, 
         }
      );

      console.log(`Eskiz OTP jonatildi: ${smsResponse.data.message}`);
   } catch (error) {
      console.error("Eskiz SMS yuborishda xatolik:", error.message);
   }
}

export { sendOTP };

